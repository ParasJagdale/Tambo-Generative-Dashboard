/**
 * MCP Tool Integrations
 * External API integrations for enhanced functionality
 */

import type { WeatherData } from "@/types";

// OpenWeather API Integration
export async function getWeatherData(
  city: string = "London",
): Promise<WeatherData | null> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    if (!apiKey) {
      console.warn("OpenWeather API key not configured");
      return null;
    }

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`,
    );

    if (!response.ok) {
      throw new Error("Weather API request failed");
    }

    const data = await response.json();

    return {
      temp: Math.round(data.main.temp),
      condition: data.weather[0].main,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
    };
  } catch (error) {
    console.error("Weather API Error:", error);
    return null;
  }
}

// Fitness suggestions based on weather
export function getFitnessSuggestions(weather: WeatherData | null): string[] {
  if (!weather) {
    return [
      "Do 30 minutes of indoor exercise",
      "Try a home workout routine",
      "Practice yoga or stretching",
    ];
  }

  const { temp, condition } = weather;

  if (temp > 25) {
    return [
      "Go for an early morning run",
      "Stay hydrated - drink extra water",
      "Try swimming if available",
    ];
  } else if (temp < 10) {
    return [
      "Indoor gym session recommended",
      "Try HIIT workout at home",
      "Dress warmly for outdoor activities",
    ];
  } else if (condition.toLowerCase().includes("rain")) {
    return [
      "Indoor workout recommended",
      "Try home exercise routines",
      "Perfect weather for yoga",
    ];
  } else {
    return [
      "Great weather for outdoor running",
      "Perfect for cycling",
      "Good conditions for any workout",
    ];
  }
}

// Simulated Calendar API
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: "study" | "personal" | "work";
}

export async function getCalendarEvents(date: Date): Promise<CalendarEvent[]> {
  // Simulated calendar data
  // In production, this would integrate with Google Calendar, Outlook, etc.
  return [
    {
      id: "1",
      title: "DSA Study Session",
      start: new Date(date.setHours(10, 0)),
      end: new Date(date.setHours(12, 0)),
      type: "study",
    },
    {
      id: "2",
      title: "Web Development Practice",
      start: new Date(date.setHours(14, 0)),
      end: new Date(date.setHours(16, 0)),
      type: "study",
    },
  ];
}

// Currency Exchange Rate API (simulated)
export async function getExchangeRate(
  from: string,
  to: string,
): Promise<number> {
  // In production, integrate with a real forex API
  const rates: Record<string, number> = {
    "USD-EUR": 0.92,
    "USD-GBP": 0.79,
    "USD-INR": 83.12,
    "EUR-USD": 1.09,
    "GBP-USD": 1.27,
    "INR-USD": 0.012,
  };

  const key = `${from}-${to}`;
  return rates[key] || 1;
}

// Productivity quote of the day
export async function getMotivationalQuote(): Promise<{
  quote: string;
  author: string;
}> {
  const quotes = [
    {
      quote: "The secret of getting ahead is getting started.",
      author: "Mark Twain",
    },
    {
      quote: "Success is not final, failure is not fatal.",
      author: "Winston Churchill",
    },
    {
      quote: "Don't watch the clock; do what it does. Keep going.",
      author: "Sam Levenson",
    },
    {
      quote: "The future depends on what you do today.",
      author: "Mahatma Gandhi",
    },
    {
      quote: "Success is the sum of small efforts repeated daily.",
      author: "Robert Collier",
    },
  ];

  return quotes[Math.floor(Math.random() * quotes.length)];
}

// Export data to JSON
export function exportToJSON(data: any, filename: string): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Export data to CSV
export function exportToCSV(data: any[], filename: string): void {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(","),
    ...data.map((row) =>
      headers.map((header) => JSON.stringify(row[header] || "")).join(","),
    ),
  ];

  const csv = csvRows.join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}-${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
