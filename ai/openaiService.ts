/**
 * OpenAI Integration for Enhanced Intent Detection
 * This provides more accurate intent detection using GPT models
 */

import OpenAI from "openai";
import type { UserIntent, ModuleType } from "@/types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

const SYSTEM_PROMPT = `You are an AI assistant that analyzes user input to determine their intent for a productivity dashboard.

The dashboard has 4 main modules:
1. studyPlanner - For study scheduling, tasks, courses, learning
2. expenseTracker - For tracking money, expenses, budgets, finances
3. habitTracker - For tracking habits, fitness, health, routines
4. analytics - For viewing productivity stats, reports, insights

Analyze the user's input and respond with a JSON object containing:
{
  "module": "studyPlanner" | "expenseTracker" | "habitTracker" | "analytics",
  "confidence": 0.0 to 1.0,
  "parameters": {
    // extracted relevant parameters
  },
  "reasoning": "brief explanation"
}

Be precise and confident in your classification.`;

export async function detectIntentWithAI(
  userInput: string,
): Promise<UserIntent> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userInput },
      ],
      temperature: 0.3,
      max_tokens: 200,
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(completion.choices[0].message.content || "{}");

    return {
      type: result.module as ModuleType,
      confidence: result.confidence || 0.8,
      parameters: result.parameters || {},
      rawInput: userInput,
    };
  } catch (error) {
    console.error("AI Intent Detection Error:", error);

    // Fallback to rule-based detection
    return {
      type: "welcome",
      confidence: 0,
      parameters: {},
      rawInput: userInput,
    };
  }
}

export async function generateAIResponse(
  userInput: string,
  module: ModuleType,
  context?: Record<string, any>,
): Promise<string> {
  try {
    const contextInfo = context
      ? `\n\nCurrent context: ${JSON.stringify(context, null, 2)}`
      : "";

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a helpful AI productivity assistant. Be concise, friendly, and actionable. The user is using the ${module} module.${contextInfo}`,
        },
        { role: "user", content: userInput },
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    return completion.choices[0].message.content || "I'm here to help!";
  } catch (error) {
    console.error("AI Response Generation Error:", error);
    return "I understand! Let me help you with that.";
  }
}

export async function generateSmartSuggestions(
  module: ModuleType,
  userHistory: string[],
): Promise<string[]> {
  try {
    const historyContext = userHistory.slice(-5).join("\n");

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Generate 3 helpful suggestions for the ${module} module based on user history. Return as JSON array of strings.`,
        },
        { role: "user", content: `Recent activity:\n${historyContext}` },
      ],
      temperature: 0.8,
      max_tokens: 100,
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(
      completion.choices[0].message.content || '{"suggestions": []}',
    );
    return result.suggestions || [];
  } catch (error) {
    console.error("Smart Suggestions Error:", error);
    return [];
  }
}
