import type { UserIntent, ModuleType } from "@/types";

/**
 * AI Intent Detection Engine
 * Analyzes user input to determine which module to render
 * This is the core of the Generative UI system
 */

interface IntentPattern {
  keywords: string[];
  module: ModuleType;
  confidence: number;
}

const intentPatterns: IntentPattern[] = [
  // Study Planner intents
  {
    keywords: [
      "study",
      "learn",
      "course",
      "exam",
      "homework",
      "assignment",
      "revision",
      "notes",
      "dsa",
      "algorithm",
      "web development",
      "coding",
      "programming",
      "schedule",
      "syllabus",
    ],
    module: "studyPlanner",
    confidence: 0.9,
  },

  // Expense Tracker intents
  {
    keywords: [
      "expense",
      "money",
      "budget",
      "spending",
      "finance",
      "cost",
      "price",
      "purchase",
      "buy",
      "bought",
      "paid",
      "payment",
      "transaction",
      "track expense",
      "monthly expense",
    ],
    module: "expenseTracker",
    confidence: 0.9,
  },

  // Habit Tracker intents
  {
    keywords: [
      "habit",
      "routine",
      "daily",
      "fitness",
      "exercise",
      "workout",
      "health",
      "gym",
      "run",
      "meditation",
      "yoga",
      "water",
      "sleep",
      "wake up",
      "morning",
    ],
    module: "habitTracker",
    confidence: 0.9,
  },

  // Analytics intents
  {
    keywords: [
      "analytics",
      "stats",
      "statistics",
      "performance",
      "progress",
      "insights",
      "overview",
      "summary",
      "report",
      "trend",
      "productivity",
      "dashboard",
    ],
    module: "analytics",
    confidence: 0.9,
  },
];

export function detectIntent(userInput: string): UserIntent {
  const normalizedInput = userInput.toLowerCase().trim();

  // Score each module based on keyword matches
  const scores: { [key in ModuleType]?: number } = {};

  for (const pattern of intentPatterns) {
    let score = 0;
    for (const keyword of pattern.keywords) {
      if (normalizedInput.includes(keyword)) {
        score += pattern.confidence;
      }
    }

    if (score > 0) {
      scores[pattern.module] = (scores[pattern.module] || 0) + score;
    }
  }

  // Find the module with highest score
  let maxScore = 0;
  let detectedModule: ModuleType = "welcome";

  for (const [module, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      detectedModule = module as ModuleType;
    }
  }

  // Extract parameters from input
  const parameters = extractParameters(normalizedInput, detectedModule);

  // Calculate confidence
  const confidence = Math.min(maxScore / normalizedInput.split(" ").length, 1);

  return {
    type: detectedModule,
    confidence,
    parameters,
    rawInput: userInput,
  };
}

function extractParameters(
  input: string,
  module: ModuleType,
): Record<string, any> {
  const params: Record<string, any> = {};

  switch (module) {
    case "studyPlanner":
      // Extract subjects
      const subjects = [
        "dsa",
        "web development",
        "machine learning",
        "database",
        "networking",
        "os",
        "system design",
      ];
      for (const subject of subjects) {
        if (input.includes(subject)) {
          params.subject = subject;
          break;
        }
      }

      // Extract time keywords
      if (input.match(/\d+\s*(hour|hr|minute|min)/)) {
        const match = input.match(/(\d+)\s*(hour|hr|minute|min)/);
        if (match) {
          params.duration = parseInt(match[1]);
          params.unit = match[2];
        }
      }
      break;

    case "expenseTracker":
      // Extract amount
      const amountMatch = input.match(/\$?(\d+(?:\.\d{2})?)/);
      if (amountMatch) {
        params.amount = parseFloat(amountMatch[1]);
      }

      // Extract categories
      const categories = [
        "food",
        "transport",
        "entertainment",
        "utilities",
        "shopping",
        "healthcare",
      ];
      for (const category of categories) {
        if (input.includes(category)) {
          params.category = category;
          break;
        }
      }
      break;

    case "habitTracker":
      // Extract habit types
      const habits = [
        "exercise",
        "meditation",
        "reading",
        "water",
        "sleep",
        "workout",
        "yoga",
      ];
      for (const habit of habits) {
        if (input.includes(habit)) {
          params.habitType = habit;
          break;
        }
      }
      break;
  }

  return params;
}

export function generateResponse(intent: UserIntent): string {
  const responses: { [key in ModuleType]: string } = {
    studyPlanner: `I'll help you plan your study schedule. Let me show you the study planner where you can organize your tasks and track your progress.`,
    expenseTracker: `Let me open the expense tracker for you. You can manage your finances and monitor your spending here.`,
    habitTracker: `Great! I'll help you build consistent habits. Here's your habit tracker to monitor your daily routines and fitness goals.`,
    analytics: `Here's your productivity analytics dashboard. You can see your overall performance and insights here.`,
    welcome: `I'm your AI productivity assistant! I can help you with:
    
• 📚 Planning your studies
• 💰 Tracking expenses
• 🎯 Building habits
• 📊 Viewing analytics

What would you like to do?`,
  };

  return responses[intent.type];
}

export function generateSuggestions(module: ModuleType): string[] {
  const suggestions: { [key in ModuleType]: string[] } = {
    studyPlanner: [
      "Schedule DSA practice",
      "Plan web development study",
      "Set exam preparation tasks",
      "Review today's progress",
    ],
    expenseTracker: [
      "Add today's expenses",
      "View monthly budget",
      "Check spending by category",
      "Set budget limits",
    ],
    habitTracker: [
      "Log today's workout",
      "Track water intake",
      "Update meditation streak",
      "View habit progress",
    ],
    analytics: [
      "Show weekly productivity",
      "Compare this month vs last",
      "View completion rates",
      "Export report",
    ],
    welcome: [
      "Plan my study schedule",
      "Track my expenses",
      "Help me stay fit",
      "Show productivity analytics",
    ],
  };

  return suggestions[module];
}
