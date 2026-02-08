import { NextRequest, NextResponse } from "next/server";
import { getWeatherData, getFitnessSuggestions } from "@/services/mcpTools";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city") || "London";

    const weather = await getWeatherData(city);

    if (!weather) {
      return NextResponse.json(
        { error: "Failed to fetch weather data" },
        { status: 500 },
      );
    }

    const suggestions = getFitnessSuggestions(weather);

    return NextResponse.json({
      weather,
      suggestions,
      city,
    });
  } catch (error) {
    console.error("Weather API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch weather data" },
      { status: 500 },
    );
  }
}
