import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  DashboardState,
  StudyTask,
  Expense,
  Habit,
  FitnessGoal,
  Message,
  ModuleType,
} from "@/types";
import { generateId } from "@/utils/helpers";

interface DashboardStore extends DashboardState {
  // Actions
  setActiveModule: (module: ModuleType | null) => void;
  addMessage: (message: Omit<Message, "id" | "timestamp">) => void;
  setUserName: (name: string) => void;

  // Study Planner Actions
  addStudyTask: (task: Omit<StudyTask, "id" | "createdAt">) => void;
  updateStudyTask: (id: string, updates: Partial<StudyTask>) => void;
  deleteStudyTask: (id: string) => void;

  // Expense Tracker Actions
  addExpense: (expense: Omit<Expense, "id">) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;

  // Habit Tracker Actions
  addHabit: (
    habit: Omit<
      Habit,
      "id" | "createdAt" | "currentStreak" | "longestStreak" | "completedDates"
    >,
  ) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  completeHabit: (id: string, date: Date) => void;

  // Fitness Goals Actions
  updateFitnessGoal: (id: string, current: number) => void;

  // Utility Actions
  setLoading: (isLoading: boolean) => void;
  clearMessages: () => void;
  resetDashboard: () => void;
}

const initialState: DashboardState = {
  activeModule: null,
  messages: [],
  studyTasks: [],
  expenses: [],
  habits: [],
  fitnessGoals: [
    {
      id: generateId(),
      type: "steps",
      target: 10000,
      current: 0,
      unit: "steps",
      date: new Date(),
    },
    {
      id: generateId(),
      type: "water",
      target: 8,
      current: 0,
      unit: "glasses",
      date: new Date(),
    },
    {
      id: generateId(),
      type: "sleep",
      target: 8,
      current: 0,
      unit: "hours",
      date: new Date(),
    },
  ],
  isLoading: false,
  userName: "User",
};

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set) => ({
      ...initialState,

      setActiveModule: (module) => set({ activeModule: module }),

      addMessage: (message) =>
        set((state) => ({
          messages: [
            ...state.messages,
            {
              ...message,
              id: generateId(),
              timestamp: new Date(),
            },
          ],
        })),

      setUserName: (name) => set({ userName: name }),

      // Study Planner Actions
      addStudyTask: (task) =>
        set((state) => ({
          studyTasks: [
            ...state.studyTasks,
            {
              ...task,
              id: generateId(),
              createdAt: new Date(),
            },
          ],
        })),

      updateStudyTask: (id, updates) =>
        set((state) => ({
          studyTasks: state.studyTasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task,
          ),
        })),

      deleteStudyTask: (id) =>
        set((state) => ({
          studyTasks: state.studyTasks.filter((task) => task.id !== id),
        })),

      // Expense Tracker Actions
      addExpense: (expense) =>
        set((state) => ({
          expenses: [
            ...state.expenses,
            {
              ...expense,
              id: generateId(),
            },
          ],
        })),

      updateExpense: (id, updates) =>
        set((state) => ({
          expenses: state.expenses.map((expense) =>
            expense.id === id ? { ...expense, ...updates } : expense,
          ),
        })),

      deleteExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((expense) => expense.id !== id),
        })),

      // Habit Tracker Actions
      addHabit: (habit) =>
        set((state) => ({
          habits: [
            ...state.habits,
            {
              ...habit,
              id: generateId(),
              createdAt: new Date(),
              currentStreak: 0,
              longestStreak: 0,
              completedDates: [],
            },
          ],
        })),

      updateHabit: (id, updates) =>
        set((state) => ({
          habits: state.habits.map((habit) =>
            habit.id === id ? { ...habit, ...updates } : habit,
          ),
        })),

      deleteHabit: (id) =>
        set((state) => ({
          habits: state.habits.filter((habit) => habit.id !== id),
        })),

      completeHabit: (id, date) =>
        set((state) => ({
          habits: state.habits.map((habit) => {
            if (habit.id !== id) return habit;

            const newCompletedDates = [...habit.completedDates, date];
            const sortedDates = newCompletedDates.sort(
              (a, b) => b.getTime() - a.getTime(),
            );

            // Calculate streak
            let currentStreak = 1;
            for (let i = 1; i < sortedDates.length; i++) {
              const prevDate = new Date(sortedDates[i - 1]);
              const currDate = new Date(sortedDates[i]);
              const diffDays = Math.floor(
                (prevDate.getTime() - currDate.getTime()) /
                  (1000 * 60 * 60 * 24),
              );
              if (diffDays === 1) {
                currentStreak++;
              } else {
                break;
              }
            }

            const longestStreak = Math.max(habit.longestStreak, currentStreak);

            return {
              ...habit,
              completedDates: newCompletedDates,
              currentStreak,
              longestStreak,
            };
          }),
        })),

      updateFitnessGoal: (id, current) =>
        set((state) => ({
          fitnessGoals: state.fitnessGoals.map((goal) =>
            goal.id === id ? { ...goal, current } : goal,
          ),
        })),

      setLoading: (isLoading) => set({ isLoading }),
      clearMessages: () => set({ messages: [] }),
      resetDashboard: () => set(initialState),
    }),
    {
      name: "ai-life-dashboard-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        studyTasks: state.studyTasks,
        expenses: state.expenses,
        habits: state.habits,
        userName: state.userName,
      }),
    },
  ),
);
