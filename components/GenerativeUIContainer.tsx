"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Mic, MicOff, Loader2, Sparkles } from "lucide-react";
import { useDashboardStore } from "@/store/dashboardStore";
import {
  detectIntent,
  generateResponse,
  generateSuggestions,
} from "@/ai/intentDetection";
import { toast } from "sonner";
import type { ModuleType } from "@/types";

// Import modules
import StudyPlannerModule from "@/modules/StudyPlannerModule";
import ExpenseTrackerModule from "@/modules/ExpenseTrackerModule";
import HabitTrackerModule from "@/modules/HabitTrackerModule";
import AnalyticsDashboardModule from "@/modules/AnalyticsDashboardModule";
import WelcomeModule from "@/modules/WelcomeModule";

// Component Registry - Core of Generative UI
const componentRegistry: Record<ModuleType, React.ComponentType<any>> = {
  studyPlanner: StudyPlannerModule,
  expenseTracker: ExpenseTrackerModule,
  habitTracker: HabitTrackerModule,
  analytics: AnalyticsDashboardModule,
  welcome: WelcomeModule,
};

export default function GenerativeUIContainer() {
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { activeModule, setActiveModule, addMessage, messages } =
    useDashboardStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions = generateSuggestions(activeModule || "welcome");

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (customInput?: string) => {
    const messageText = customInput || input;
    if (!messageText.trim() || isProcessing) return;

    setIsProcessing(true);
    setInput("");

    // Add user message
    addMessage({
      role: "user",
      content: messageText,
    });

    try {
      // Detect intent using AI
      const intent = detectIntent(messageText);

      // Generate response
      const response = generateResponse(intent);

      // Add assistant response
      addMessage({
        role: "assistant",
        content: response,
        moduleType: intent.type,
      });

      // Update active module (lower threshold for card clicks, or if not welcome)
      const shouldSwitch = intent.confidence > 0.1 || intent.type !== "welcome";

      if (shouldSwitch && intent.type !== "welcome") {
        setActiveModule(intent.type);
        toast.success(
          `Switched to ${intent.type.replace(/([A-Z])/g, " $1").trim()}`,
          {
            description: `Confidence: ${Math.round(intent.confidence * 100)}%`,
          },
        );
      }
    } catch (error) {
      console.error("Error processing message:", error);
      toast.error("Failed to process your request");
    } finally {
      setIsProcessing(false);
    }
  };

  // Voice recognition (browser API)
  const handleVoiceInput = () => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      toast.error("Voice recognition not supported in this browser");
      return;
    }

    const SpeechRecognition =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      toast.info("Listening...", { duration: 2000 });
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      toast.success("Voice captured!", { description: transcript });
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      toast.error("Voice recognition failed");
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // Dynamically render the active module
  const ActiveModuleComponent = componentRegistry[activeModule || "welcome"];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Chat Sidebar */}
      <motion.div
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-96 border-r border-border flex flex-col"
      >
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold">AI Assistant</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Ask me anything about your productivity
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="p-4 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">Suggestions:</p>
            <div className="space-y-1">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(suggestion)}
                  className="w-full text-left text-sm p-2 rounded hover:bg-secondary transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Ask me anything..."
              disabled={isProcessing}
              className="flex-1"
            />
            <Button
              size="icon"
              variant={isListening ? "destructive" : "outline"}
              onClick={handleVoiceInput}
              disabled={isProcessing}
            >
              {isListening ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
            <Button
              size="icon"
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Dynamic Module Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-8">
          <AnimatePresence mode="wait">
            {ActiveModuleComponent && (
              <ActiveModuleComponent
                key={activeModule}
                onSelectModule={
                  activeModule === "welcome" ? handleSendMessage : undefined
                }
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
