// Core Types for AI Life Dashboard

export type ModuleType =
  | "studyPlanner"
  | "expenseTracker"
  | "habitTracker"
  | "analytics"
  | "welcome";

export interface UserIntent {
  type: ModuleType;
  confidence: number;
  parameters?: Record<string, any>;
  rawInput: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  moduleType?: ModuleType;
}

export interface StudyTask {
  id: string;
  subject: string;
  topic: string;
  duration: number; // in minutes
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed";
  dueDate: Date;
  createdAt: Date;
}

export interface StudySession {
  id: string;
  taskId: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in minutes
  notes?: string;
}

export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: Date;
  type: "income" | "expense";
  tags?: string[];
}

export interface Budget {
  category: string;
  limit: number;
  spent: number;
  period: "daily" | "weekly" | "monthly";
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  frequency: "daily" | "weekly";
  targetCount: number;
  currentStreak: number;
  longestStreak: number;
  completedDates: Date[];
  createdAt: Date;
  icon?: string;
  color?: string;
}

export interface FitnessGoal {
  id: string;
  type: "steps" | "workout" | "water" | "sleep";
  target: number;
  current: number;
  unit: string;
  date: Date;
}

export interface ProductivityMetrics {
  totalStudyHours: number;
  completedTasks: number;
  totalExpenses: number;
  habitCompletionRate: number;
  productivityScore: number;
  weeklyTrend: number;
}

export interface DashboardState {
  activeModule: ModuleType | null;
  messages: Message[];
  studyTasks: StudyTask[];
  expenses: Expense[];
  habits: Habit[];
  fitnessGoals: FitnessGoal[];
  isLoading: boolean;
  userName: string;
}

export interface AIResponse {
  intent: UserIntent;
  response: string;
  suggestions?: string[];
}

export interface ComponentRegistry {
  [key: string]: React.ComponentType<any>;
}

export interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
}
