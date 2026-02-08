"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  DollarSign,
  Activity,
  BarChart,
  Sparkles,
} from "lucide-react";
import { getGreeting } from "@/utils/helpers";
import { useDashboardStore } from "@/store/dashboardStore";

interface WelcomeModuleProps {
  onSelectModule?: (module: string) => void;
}

export default function WelcomeModule({ onSelectModule }: WelcomeModuleProps) {
  const { userName } = useDashboardStore();

  const modules = [
    {
      id: "studyPlanner",
      title: "Study Planner",
      description: "Organize your learning schedule",
      icon: BookOpen,
      color: "blue",
      prompt: "Plan my study schedule",
    },
    {
      id: "expenseTracker",
      title: "Expense Tracker",
      description: "Monitor your finances",
      icon: DollarSign,
      color: "green",
      prompt: "Track my expenses",
    },
    {
      id: "habitTracker",
      title: "Habit & Fitness",
      description: "Build consistent routines",
      icon: Activity,
      color: "purple",
      prompt: "Help me track my habits and fitness",
    },
    {
      id: "analytics",
      title: "Analytics",
      description: "View productivity insights",
      icon: BarChart,
      color: "cyan",
      prompt: "Show productivity analytics",
    },
  ];

  const colorClasses: Record<
    string,
    { bg: string; border: string; icon: string }
  > = {
    blue: {
      bg: "bg-blue-500/10",
      border: "border-blue-500/20 hover:border-blue-500/50",
      icon: "text-blue-400",
    },
    green: {
      bg: "bg-green-500/10",
      border: "border-green-500/20 hover:border-green-500/50",
      icon: "text-green-400",
    },
    purple: {
      bg: "bg-purple-500/10",
      border: "border-purple-500/20 hover:border-purple-500/50",
      icon: "text-purple-400",
    },
    cyan: {
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20 hover:border-cyan-500/50",
      icon: "text-cyan-400",
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Hero Section */}
      <div className="text-center space-y-4 py-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="inline-flex items-center justify-center p-4 rounded-full bg-primary/10 border border-primary/20 mb-4"
        >
          <Sparkles className="h-12 w-12 text-primary" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-5xl font-bold gradient-text"
        >
          {getGreeting()}, {userName}!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-muted-foreground max-w-2xl mx-auto"
        >
          Welcome to your AI-powered productivity OS.
          <br />
          <span className="text-primary">
            Ask me anything and watch the UI adapt!
          </span>
        </motion.p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((module, index) => {
          const Icon = module.icon;
          const colors = colorClasses[module.color];

          return (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <Card
                className={`${colors.border} hover:scale-105 transition-all cursor-pointer group`}
                onClick={() => onSelectModule?.(module.prompt)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-4 rounded-xl ${colors.bg} border ${colors.border} group-hover:scale-110 transition-transform`}
                    >
                      <Icon className={`h-8 w-8 ${colors.icon}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">
                        {module.title}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {module.description}
                      </p>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-primary hover:bg-primary/10"
                      >
                        Try: "{module.prompt}" →
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Features Highlight */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="glass rounded-xl p-8 space-y-6"
      >
        <h3 className="text-2xl font-bold text-center mb-6">
          ✨ Powered by Generative UI
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center space-y-2">
            <div className="text-4xl mb-2">🤖</div>
            <h4 className="font-semibold">AI Intent Detection</h4>
            <p className="text-sm text-muted-foreground">
              Smart understanding of your commands
            </p>
          </div>

          <div className="text-center space-y-2">
            <div className="text-4xl mb-2">🎨</div>
            <h4 className="font-semibold">Dynamic Components</h4>
            <p className="text-sm text-muted-foreground">
              UI adapts based on your needs
            </p>
          </div>

          <div className="text-center space-y-2">
            <div className="text-4xl mb-2">⚡</div>
            <h4 className="font-semibold">Real-time Updates</h4>
            <p className="text-sm text-muted-foreground">
              Instant state management with Zustand
            </p>
          </div>
        </div>
      </motion.div>

      {/* Example Prompts */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground text-center">
          Try these example prompts:
        </h3>
        <div className="flex flex-wrap gap-2 justify-center">
          {[
            "Plan DSA study for 2 hours",
            "Add expense of $50 for food",
            "Track my daily habits and workout",
            "Show this week's analytics",
          ].map((prompt, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 + i * 0.1 }}
              onClick={() => onSelectModule?.(prompt)}
              className="px-4 py-2 rounded-full bg-secondary hover:bg-secondary/80 text-sm transition-colors"
            >
              {prompt}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
