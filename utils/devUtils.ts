/**
 * Development utilities and seed data for testing
 */

import type { StudyTask, Expense, Habit } from "@/types";
import { generateId } from "./helpers";

// Seed data for development and demo
export const seedStudyTasks: Omit<StudyTask, "id" | "createdAt">[] = [
  {
    subject: "Data Structures & Algorithms",
    topic: "Binary Trees - Traversal Techniques",
    duration: 120,
    priority: "high",
    status: "in-progress",
    dueDate: new Date(Date.now() + 86400000), // Tomorrow
  },
  {
    subject: "Web Development",
    topic: "React Hooks - useEffect & useCallback",
    duration: 90,
    priority: "medium",
    status: "pending",
    dueDate: new Date(Date.now() + 172800000), // 2 days
  },
  {
    subject: "System Design",
    topic: "Scalability Patterns",
    duration: 60,
    priority: "high",
    status: "pending",
    dueDate: new Date(Date.now() + 259200000), // 3 days
  },
  {
    subject: "Database Management",
    topic: "SQL Query Optimization",
    duration: 75,
    priority: "medium",
    status: "completed",
    dueDate: new Date(Date.now() - 86400000), // Yesterday
  },
];

export const seedExpenses: Omit<Expense, "id">[] = [
  {
    amount: 45.99,
    category: "food",
    description: "Lunch at restaurant",
    date: new Date(),
    type: "expense",
    tags: ["dining", "weekend"],
  },
  {
    amount: 120.0,
    category: "shopping",
    description: "New headphones",
    date: new Date(Date.now() - 86400000),
    type: "expense",
    tags: ["electronics"],
  },
  {
    amount: 2500.0,
    category: "other",
    description: "Monthly salary",
    date: new Date(Date.now() - 172800000),
    type: "income",
  },
  {
    amount: 89.99,
    category: "utilities",
    description: "Internet bill",
    date: new Date(Date.now() - 259200000),
    type: "expense",
    tags: ["bills", "monthly"],
  },
  {
    amount: 35.5,
    category: "transport",
    description: "Uber rides",
    date: new Date(Date.now() - 345600000),
    type: "expense",
    tags: ["commute"],
  },
  {
    amount: 150.0,
    category: "entertainment",
    description: "Movie tickets & snacks",
    date: new Date(Date.now() - 432000000),
    type: "expense",
    tags: ["leisure"],
  },
];

export const seedHabits: Omit<
  Habit,
  "id" | "createdAt" | "currentStreak" | "longestStreak" | "completedDates"
>[] = [
  {
    name: "Morning Workout",
    description: "30 minutes of exercise",
    frequency: "daily",
    targetCount: 1,
    icon: "🏋️",
    color: "#3b82f6",
  },
  {
    name: "Read Technical Articles",
    description: "Read at least 2 articles",
    frequency: "daily",
    targetCount: 2,
    icon: "📚",
    color: "#8b5cf6",
  },
  {
    name: "Meditation",
    description: "10 minutes of mindfulness",
    frequency: "daily",
    targetCount: 1,
    icon: "🧘",
    color: "#10b981",
  },
  {
    name: "Drink Water",
    description: "8 glasses of water",
    frequency: "daily",
    targetCount: 8,
    icon: "💧",
    color: "#06b6d4",
  },
];

// Sample motivational quotes
export const motivationalQuotes = [
  {
    quote: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
  },
  {
    quote:
      "Success is not final, failure is not fatal: it is the courage to continue that counts.",
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
    quote: "Success is the sum of small efforts repeated day in and day out.",
    author: "Robert Collier",
  },
  {
    quote: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
  },
  {
    quote: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  },
];

// Demo user intents for testing
export const demoIntents = [
  "Plan my study for DSA and web development",
  "Track my expenses for this month",
  "Help me build daily workout habits",
  "Show me my productivity analytics",
  "Add expense of $50 for groceries",
  "Create study task for system design",
  "Track my water intake today",
  "Show weekly productivity trends",
];

// Color palette for charts
export const chartColors = {
  primary: "#3b82f6",
  secondary: "#8b5cf6",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#06b6d4",
  purple: "#a855f7",
  pink: "#ec4899",
};

// Utility to populate store with seed data
export function populateSeedData() {
  if (typeof window === "undefined") return;

  const hasData = localStorage.getItem("ai-life-dashboard-storage");

  if (!hasData) {
    console.log("Populating seed data for demo...");

    // This would be used to populate the store
    // In a real app, you'd call the store methods directly
    return {
      studyTasks: seedStudyTasks,
      expenses: seedExpenses,
      habits: seedHabits,
    };
  }
}

// Test data generator
export function generateTestData() {
  return {
    timestamp: new Date().toISOString(),
    studyTasks: seedStudyTasks.length,
    expenses: seedExpenses.length,
    habits: seedHabits.length,
    totalExpenses: seedExpenses
      .filter((e) => e.type === "expense")
      .reduce((sum, e) => sum + e.amount, 0),
    totalIncome: seedExpenses
      .filter((e) => e.type === "income")
      .reduce((sum, e) => sum + e.amount, 0),
  };
}

// Performance measurement utilities
export function measurePerformance(label: string, fn: () => void) {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`[Performance] ${label}: ${(end - start).toFixed(2)}ms`);
}

// Debug logger with categories
export function debugLog(category: string, message: string, data?: any) {
  if (process.env.NODE_ENV === "development") {
    console.log(`[${category}] ${message}`, data || "");
  }
}

// Error boundary helper
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any,
  ) {
    super(message);
    this.name = "AppError";
  }
}

// Local storage utilities
export const storage = {
  set: (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Storage set error:", error);
    }
  },

  get: (key: string) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error("Storage get error:", error);
      return null;
    }
  },

  remove: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Storage remove error:", error);
    }
  },

  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Storage clear error:", error);
    }
  },
};
