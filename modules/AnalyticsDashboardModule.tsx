"use client";

import { motion } from "framer-motion";
import { useDashboardStore } from "@/store/dashboardStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  TrendingUp,
  Award,
  Clock,
  DollarSign,
  Zap,
  Download,
} from "lucide-react";
import { getProductivityScore, formatCurrency } from "@/utils/helpers";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { exportToJSON, exportToCSV } from "@/services/mcpTools";

export default function AnalyticsDashboardModule() {
  const { studyTasks, expenses, habits } = useDashboardStore();

  // Calculate metrics
  const completedTasks = studyTasks.filter(
    (t) => t.status === "completed",
  ).length;
  const totalStudyHours =
    studyTasks
      .filter((t) => t.status === "completed")
      .reduce((sum, t) => sum + t.duration, 0) / 60;

  const totalExpensesCurrent = expenses
    .filter((e) => e.type === "expense")
    .reduce((sum, e) => sum + e.amount, 0);

  const habitCompletionRate =
    habits.length > 0
      ? habits.reduce((sum, h) => sum + h.currentStreak, 0) / habits.length
      : 0;

  const productivityScore = getProductivityScore({
    completedTasks,
    studyHours: totalStudyHours,
    habitCompletionRate,
  });

  // Weekly data for charts
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

    return {
      name: dayName,
      study: Math.floor(Math.random() * 4) + 1,
      habits: Math.floor(Math.random() * 5) + 1,
      productivity: Math.floor(Math.random() * 30) + 50,
    };
  });

  const handleExportData = () => {
    const exportData = {
      studyTasks,
      expenses,
      habits,
      metrics: {
        completedTasks,
        totalStudyHours,
        totalExpenses: totalExpensesCurrent,
        habitCompletionRate,
        productivityScore,
      },
      exportDate: new Date().toISOString(),
    };
    exportToJSON(exportData, "ai-life-dashboard-data");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            <BarChart className="h-6 w-6 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Productivity Analytics</h2>
            <p className="text-sm text-muted-foreground">
              Your performance insights
            </p>
          </div>
        </div>
        <Button onClick={handleExportData} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Data
        </Button>
      </div>

      {/* Productivity Score */}
      <Card className="border-primary/50 bg-gradient-to-br from-primary/10 to-transparent">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm text-muted-foreground mb-2">
                Overall Productivity Score
              </h3>
              <div className="flex items-baseline gap-3">
                <span className="text-6xl font-bold gradient-text">
                  {productivityScore}
                </span>
                <span className="text-2xl text-muted-foreground">/ 100</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {productivityScore >= 80 && "🎉 Outstanding performance!"}
                {productivityScore >= 60 &&
                  productivityScore < 80 &&
                  "💪 Great work, keep it up!"}
                {productivityScore >= 40 &&
                  productivityScore < 60 &&
                  "📈 You're making progress!"}
                {productivityScore < 40 && "🌱 Start small, build momentum!"}
              </p>
            </div>
            <div className="p-6 rounded-full bg-primary/10">
              <Award className="h-16 w-16 text-primary" />
            </div>
          </div>
          <div className="mt-6">
            <Progress value={productivityScore} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-blue-500/10">
                <Clock className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Study Hours</p>
                <p className="text-2xl font-bold">
                  {totalStudyHours.toFixed(1)}h
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-green-500/10">
                <Zap className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tasks Done</p>
                <p className="text-2xl font-bold">{completedTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-purple-500/10">
                <TrendingUp className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Habit Streak</p>
                <p className="text-2xl font-bold">
                  {Math.round(habitCompletionRate)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-red-500/10">
                <DollarSign className="h-6 w-6 text-red-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Expenses</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(totalExpensesCurrent)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Productivity Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient
                  id="colorProductivity"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="productivity"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorProductivity)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Activity Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Study vs Habits - Weekly Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="study"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Study Hours"
              />
              <Line
                type="monotone"
                dataKey="habits"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Habits Completed"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>AI Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <p className="text-sm">
              📚 <span className="font-semibold">Study Pattern:</span> You've
              completed {completedTasks} tasks this period.
              {completedTasks > 5
                ? " Excellent progress!"
                : " Try to increase your task completion rate."}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <p className="text-sm">
              💰 <span className="font-semibold">Financial Health:</span> Total
              expenses: {formatCurrency(totalExpensesCurrent)}.
              {totalExpensesCurrent < 500
                ? " Good spending control!"
                : " Consider reviewing your budget."}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <p className="text-sm">
              🎯 <span className="font-semibold">Habit Consistency:</span>{" "}
              Average streak: {Math.round(habitCompletionRate)} days.
              {habitCompletionRate > 7
                ? " Amazing consistency!"
                : " Build stronger habits with daily practice."}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
