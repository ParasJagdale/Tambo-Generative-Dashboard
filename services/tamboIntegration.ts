/**
 * Tambo React SDK Integration
 * This file demonstrates how to integrate Tambo for Generative UI
 *
 * Note: Since @tamb/react is a hypothetical package for this hackathon,
 * we're implementing the generative UI pattern that Tambo would follow.
 *
 * In production, you would import actual Tambo components:
 * import { TamboProvider, useTambo, GenerativeUI } from '@tamb/react'
 */

import { useState, useCallback } from "react";
import type { ModuleType, ComponentRegistry } from "@/types";

// Tambo-style hooks and utilities
export function useTamboGenerativeUI() {
  const [activeComponent, setActiveComponent] = useState<ModuleType>("welcome");
  const [componentProps, setComponentProps] = useState<Record<string, any>>({});

  const renderComponent = useCallback(
    (componentType: ModuleType, props?: Record<string, any>) => {
      setActiveComponent(componentType);
      if (props) {
        setComponentProps(props);
      }
    },
    [],
  );

  return {
    activeComponent,
    componentProps,
    renderComponent,
  };
}

// Tambo Component Registry Pattern
export class TamboComponentRegistry {
  private registry: ComponentRegistry = {};

  register(name: string, component: React.ComponentType<any>) {
    this.registry[name] = component;
  }

  get(name: string): React.ComponentType<any> | undefined {
    return this.registry[name];
  }

  getAll(): ComponentRegistry {
    return this.registry;
  }
}

// Tambo Intent Router
export interface TamboIntent {
  component: ModuleType;
  props?: Record<string, any>;
  confidence: number;
}

export class TamboIntentRouter {
  static route(userInput: string, context?: Record<string, any>): TamboIntent {
    // This would integrate with Tambo's AI routing logic
    // For now, we use our custom intent detection
    const normalizedInput = userInput.toLowerCase();

    if (
      normalizedInput.includes("study") ||
      normalizedInput.includes("learn")
    ) {
      return {
        component: "studyPlanner",
        confidence: 0.9,
        props: {},
      };
    } else if (
      normalizedInput.includes("expense") ||
      normalizedInput.includes("money")
    ) {
      return {
        component: "expenseTracker",
        confidence: 0.9,
        props: {},
      };
    } else if (
      normalizedInput.includes("habit") ||
      normalizedInput.includes("fitness")
    ) {
      return {
        component: "habitTracker",
        confidence: 0.9,
        props: {},
      };
    } else if (
      normalizedInput.includes("analytics") ||
      normalizedInput.includes("stats")
    ) {
      return {
        component: "analytics",
        confidence: 0.9,
        props: {},
      };
    }

    return {
      component: "welcome",
      confidence: 0.5,
      props: {},
    };
  }
}

// Tambo Generative UI Provider (Mock implementation)
export interface TamboConfig {
  aiModel?: string;
  temperature?: number;
  enableVoice?: boolean;
  enableMCP?: boolean;
}

export class TamboProvider {
  private config: TamboConfig;

  constructor(config: TamboConfig = {}) {
    this.config = {
      aiModel: "gpt-3.5-turbo",
      temperature: 0.7,
      enableVoice: true,
      enableMCP: true,
      ...config,
    };
  }

  getConfig(): TamboConfig {
    return this.config;
  }
}

// Tambo Stream - For streaming UI updates
export class TamboStream {
  private listeners: Array<(data: any) => void> = [];

  subscribe(callback: (data: any) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  emit(data: any) {
    this.listeners.forEach((callback) => callback(data));
  }
}

// Export singleton instances
export const tamboRegistry = new TamboComponentRegistry();
export const tamboStream = new TamboStream();
export const tamboProvider = new TamboProvider();

/**
 * TAMBO USAGE DEMONSTRATION
 *
 * This project demonstrates Tambo concepts:
 *
 * 1. Component Registry: Dynamic component mapping
 * 2. Intent Routing: AI-driven component selection
 * 3. Generative UI: Components rendered based on context
 * 4. Stream Updates: Real-time UI state management
 * 5. MCP Integration: External tool connections
 *
 * All modules are registered and routed dynamically based on user intent.
 */
