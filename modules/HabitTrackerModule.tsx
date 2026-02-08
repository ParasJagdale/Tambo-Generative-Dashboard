"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useDashboardStore } from "@/store/dashboardStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Activity,
  Plus,
  Trash2,
  CheckCircle,
  Flame,
  Trophy,
} from "lucide-react";
import { isToday } from "@/utils/helpers";

export default function HabitTrackerModule() {
  const {
    habits,
    fitnessGoals,
    addHabit,
    deleteHabit,
    completeHabit,
    updateFitnessGoal,
  } = useDashboardStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: "",
    description: "",
    frequency: "daily" as const,
    targetCount: 1,
  });

  const handleAddHabit = () => {
    if (!newHabit.name) return;
    addHabit(newHabit);
    setNewHabit({
      name: "",
      description: "",
      frequency: "daily",
      targetCount: 1,
    });
    setShowAddForm(false);
  };

  const handleCompleteHabit = (habitId: string) => {
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;

    const today = new Date();
    const alreadyCompleted = habit.completedDates.some((date) => isToday(date));

    if (!alreadyCompleted) {
      completeHabit(habitId, today);
    }
  };

  const habitIcons: Record<string, string> = {
    exercise: "💪",
    meditation: "🧘",
    reading: "📚",
    water: "💧",
    sleep: "😴",
    workout: "🏋️",
    yoga: "🤸",
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
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <Activity className="h-6 w-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Habit & Fitness Tracker</h2>
            <p className="text-sm text-muted-foreground">
              Build consistent routines
            </p>
          </div>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Habit
        </Button>
      </div>

      {/* Fitness Goals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {fitnessGoals.map((goal) => (
          <Card key={goal.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold capitalize">{goal.type}</h3>
                <span className="text-2xl">
                  {goal.type === "steps" && "👟"}
                  {goal.type === "water" && "💧"}
                  {goal.type === "sleep" && "😴"}
                  {goal.type === "workout" && "🏋️"}
                </span>
              </div>
              <div className="space-y-2">
                <Progress value={(goal.current / goal.target) * 100} />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {goal.current} / {goal.target} {goal.unit}
                  </span>
                  <span className="font-semibold">
                    {Math.round((goal.current / goal.target) * 100)}%
                  </span>
                </div>
              </div>
              <div className="mt-3">
                <Input
                  type="number"
                  placeholder={`Add ${goal.unit}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const value = parseInt(
                        (e.target as HTMLInputElement).value,
                      );
                      if (value > 0) {
                        updateFitnessGoal(goal.id, goal.current + value);
                        (e.target as HTMLInputElement).value = "";
                      }
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
        >
          <Card className="border-primary/50">
            <CardHeader>
              <CardTitle className="text-lg">Create New Habit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Habit Name</label>
                <Input
                  placeholder="e.g., Morning Exercise"
                  value={newHabit.name}
                  onChange={(e) =>
                    setNewHabit({ ...newHabit, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  Description (Optional)
                </label>
                <Input
                  placeholder="Brief description..."
                  value={newHabit.description}
                  onChange={(e) =>
                    setNewHabit({ ...newHabit, description: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Frequency</label>
                  <select
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                    value={newHabit.frequency}
                    onChange={(e) =>
                      setNewHabit({
                        ...newHabit,
                        frequency: e.target.value as any,
                      })
                    }
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Target Count</label>
                  <Input
                    type="number"
                    value={newHabit.targetCount}
                    onChange={(e) =>
                      setNewHabit({
                        ...newHabit,
                        targetCount: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddHabit}>Create Habit</Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Habits List */}
      <div className="grid gap-4">
        {habits.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Activity className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No habits tracked yet. Create one to start building consistency!
              </p>
            </CardContent>
          </Card>
        ) : (
          habits.map((habit) => {
            const completedToday = habit.completedDates.some((date) =>
              isToday(date),
            );
            return (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card
                  className={`hover:border-primary/50 transition-colors ${completedToday ? "border-green-500/50 bg-green-500/5" : ""}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">
                            {habit.name}
                          </h3>
                          <Badge variant="outline" className="capitalize">
                            {habit.frequency}
                          </Badge>
                          {completedToday && (
                            <Badge className="bg-green-500/20 text-green-400">
                              ✓ Done Today
                            </Badge>
                          )}
                        </div>
                        {habit.description && (
                          <p className="text-sm text-muted-foreground mb-3">
                            {habit.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Flame className="h-5 w-5 text-orange-400" />
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Current Streak
                              </p>
                              <p className="font-semibold">
                                {habit.currentStreak} days
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-yellow-400" />
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Longest Streak
                              </p>
                              <p className="font-semibold">
                                {habit.longestStreak} days
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={completedToday ? "outline" : "default"}
                          onClick={() => handleCompleteHabit(habit.id)}
                          disabled={completedToday}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteHabit(habit.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
