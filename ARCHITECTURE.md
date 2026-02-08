/\*\*

- AI Life Dashboard - Architecture Documentation
-
- This document explains the technical architecture and design decisions
- behind the Generative UI system.
  \*/

## System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        User Interface                        │
│  ┌────────────────┐              ┌────────────────────────┐ │
│  │  Chat Sidebar  │              │  Dynamic Module Area   │ │
│  │                │              │                        │ │
│  │ - Voice Input  │              │  ┌──────────────────┐ │ │
│  │ - Text Input   │◄────────────►│  │ Active Component │ │ │
│  │ - Suggestions  │              │  │  (Generative UI) │ │ │
│  │ - History      │              │  └──────────────────┘ │ │
│  └────────────────┘              └────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                          ▲
                          │
┌─────────────────────────┼──────────────────────────────────┐
│                    AI Engine                                │
│  ┌──────────────────────┴───────────────────────────────┐  │
│  │          Intent Detection System                      │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌────────────┐  │  │
│  │  │ Rule-based  │  │   OpenAI     │  │  Context   │  │  │
│  │  │   Engine    │  │  NLP Model   │  │  Analysis  │  │  │
│  │  └─────────────┘  └──────────────┘  └────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          ▲
                          │
┌─────────────────────────┼──────────────────────────────────┐
│              Component Registry & Routing                   │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  ModuleType → React Component Mapping                 │ │
│  │  - studyPlanner    → StudyPlannerModule               │ │
│  │  - expenseTracker  → ExpenseTrackerModule             │ │
│  │  - habitTracker    → HabitTrackerModule               │ │
│  │  - analytics       → AnalyticsDashboardModule         │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                          ▲
                          │
┌─────────────────────────┼──────────────────────────────────┐
│                  State Management (Zustand)                 │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Global Store with Persistence                        │ │
│  │  - activeModule: ModuleType | null                    │ │
│  │  - messages: Message[]                                │ │
│  │  - studyTasks: StudyTask[]                            │ │
│  │  - expenses: Expense[]                                │ │
│  │  - habits: Habit[]                                    │ │
│  │  - fitnessGoals: FitnessGoal[]                        │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                          ▲
                          │
┌─────────────────────────┼──────────────────────────────────┐
│              External Services & APIs                       │
│  ┌──────────┐  ┌───────────┐  ┌──────────┐  ┌──────────┐ │
│  │ OpenAI   │  │ OpenWeather│  │ Calendar │  │ Storage  │ │
│  │   API    │  │    API     │  │   API    │  │  Local   │ │
│  └──────────┘  └───────────┘  └──────────┘  └──────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### User Input → UI Rendering

1. **User Input**

   ```typescript
   User types: "Plan my study for DSA"
   ```

2. **Intent Detection**

   ```typescript
   const intent = detectIntent("Plan my study for DSA");
   // Result: { type: 'studyPlanner', confidence: 0.95 }
   ```

3. **Component Selection**

   ```typescript
   const Component = componentRegistry["studyPlanner"];
   // Returns: StudyPlannerModule
   ```

4. **Dynamic Rendering**

   ```typescript
   <AnimatePresence mode="wait">
     <Component key="studyPlanner" />
   </AnimatePresence>
   ```

5. **State Update**
   ```typescript
   setActiveModule("studyPlanner");
   addMessage({ role: "user", content: input });
   addMessage({ role: "assistant", content: response });
   ```

---

## Key Design Patterns

### 1. Component Registry Pattern

**Purpose**: Decouple component selection from routing logic

```typescript
// Define registry
const registry: Record<ModuleType, ComponentType> = {
  studyPlanner: StudyPlannerModule,
  expenseTracker: ExpenseTrackerModule,
  // ...
};

// Dynamic lookup
const Component = registry[moduleType];
```

**Benefits**:

- Scalable: Add new modules without changing core logic
- Type-safe: TypeScript ensures all modules are mapped
- Testable: Easy to mock and test individual modules

### 2. Intent Detection Pipeline

**Multi-stage detection**:

```typescript
Stage 1: Rule-based keyword matching (fast, offline)
  ↓ (if confidence < 0.7)
Stage 2: OpenAI GPT analysis (accurate, requires API)
  ↓
Stage 3: Confidence scoring and fallback
```

### 3. State Management Architecture

**Zustand with Persistence**:

```typescript
create()(
  persist(
    (set) => ({
      // State
      studyTasks: [],

      // Actions
      addTask: (task) =>
        set((state) => ({
          studyTasks: [...state.studyTasks, task],
        })),
    }),
    {
      name: "storage-key",
      storage: localStorage,
    },
  ),
);
```

**Why Zustand?**

- Minimal boilerplate
- Built-in persistence
- React hook integration
- No provider needed

---

## Module Structure

### Standard Module Interface

Each module follows this pattern:

```typescript
export default function ModuleComponent() {
  // 1. State hooks
  const { items, addItem, deleteItem } = useDashboardStore()
  const [localState, setLocalState] = useState()

  // 2. Event handlers
  const handleAction = () => { ... }

  // 3. Render logic
  return (
    <motion.div>
      {/* Module UI */}
    </motion.div>
  )
}
```

**Common Features**:

- Framer Motion animations
- ShadCN UI components
- Responsive design
- Error handling
- Loading states

---

## Tambo Integration Points

### 1. Component Registration

```typescript
import { tamboRegistry } from "@/services/tamboIntegration";

tamboRegistry.register("studyPlanner", StudyPlannerModule);
tamboRegistry.register("expenseTracker", ExpenseTrackerModule);
```

### 2. Intent Routing

```typescript
import { TamboIntentRouter } from "@/services/tamboIntegration";

const intent = TamboIntentRouter.route(userInput, context);
```

### 3. Generative UI Hook

```typescript
import { useTamboGenerativeUI } from "@/services/tamboIntegration";

const { activeComponent, renderComponent } = useTamboGenerativeUI();
```

---

## Performance Optimizations

### 1. Code Splitting

```typescript
// Dynamic imports for heavy modules
const AnalyticsModule = dynamic(
  () => import("@/modules/AnalyticsDashboardModule"),
);
```

### 2. Memoization

```typescript
// Expensive calculations
const productivityScore = useMemo(
  () => getProductivityScore(metrics),
  [metrics],
);
```

### 3. Debouncing

```typescript
// Debounce search/filter
const debouncedSearch = debounce(handleSearch, 300);
```

---

## Security Considerations

### 1. Input Validation

```typescript
// Sanitize user input
const sanitized = DOMPurify.sanitize(userInput);
```

### 2. API Key Protection

```typescript
// Server-side only
const apiKey = process.env.OPENAI_API_KEY; // Not NEXT_PUBLIC_
```

### 3. XSS Prevention

```typescript
// Use React's built-in escaping
<div>{userInput}</div> // Safe
<div dangerouslySetInnerHTML={{ __html: userInput }} /> // Unsafe
```

---

## Testing Strategy

### Unit Tests

```typescript
describe("detectIntent", () => {
  it("should detect study intent", () => {
    const result = detectIntent("plan my study");
    expect(result.type).toBe("studyPlanner");
  });
});
```

### Integration Tests

```typescript
describe('GenerativeUIContainer', () => {
  it('should render correct module based on intent', () => {
    render(<GenerativeUIContainer />)
    fireEvent.change(input, { target: { value: 'track expenses' } })
    fireEvent.click(sendButton)
    expect(screen.getByText('Expense Tracker')).toBeInTheDocument()
  })
})
```

---

## Scalability Roadmap

### Phase 1: Current (Hackathon)

- 5 core modules
- Local storage
- Client-side AI

### Phase 2: Enhanced

- User authentication
- Cloud sync
- More modules (10+)
- Real-time collaboration

### Phase 3: Enterprise

- Multi-tenant support
- Advanced analytics
- Plugin system
- Mobile apps

---

## Technology Decisions

| Decision   | Choice        | Rationale                                 |
| ---------- | ------------- | ----------------------------------------- |
| Framework  | Next.js 14    | Server components, App Router, optimal DX |
| Styling    | Tailwind CSS  | Utility-first, rapid development          |
| Animations | Framer Motion | Declarative, powerful, smooth             |
| State      | Zustand       | Minimal, performant, easy persistence     |
| Charts     | Recharts      | React-native, customizable                |
| Icons      | Lucide        | Modern, tree-shakeable, consistent        |

---

## Contribution Guidelines

### Adding a New Module

1. Create module component in `/modules`
2. Define types in `/types`
3. Register in component registry
4. Add intent keywords
5. Update documentation

Example:

```typescript
// 1. Create module
export default function NewModule() { ... }

// 2. Register
componentRegistry.newModule = NewModule

// 3. Add intent keywords
const intentPatterns = [
  ...existing,
  { keywords: ['new', 'module'], module: 'newModule' }
]
```

---

## Deployment Architecture

```
GitHub → Vercel → Edge Network → Users
  │
  └──→ CI/CD Pipeline
        - Type Check
        - Lint
        - Build
        - Deploy
```

---

## Monitoring & Observability

- **Analytics**: Vercel Analytics for performance
- **Errors**: Console logging (TODO: Sentry integration)
- **Metrics**: Lighthouse CI in GitHub Actions
- **Logs**: Vercel logs for debugging

---

**For questions or contributions, see README.md**
