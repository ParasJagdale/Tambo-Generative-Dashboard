# 🚀 Quick Start Guide - AI Life Dashboard

Get up and running in 5 minutes!

## Prerequisites

- **Node.js 18+** ([Download](https://nodejs.org/))
- **npm** or **yarn**
- **Git** ([Download](https://git-scm.com/))

---

## Installation

### Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd Tambo_Hackathon_Project
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:

- Next.js 14 (React framework)
- TypeScript (type safety)
- Tailwind CSS (styling)
- Framer Motion (animations)
- Zustand (state management)
- And more!

### Step 3: Setup Environment Variables

```bash
cp .env.local.example .env.local
```

**Optional**: Add API keys to `.env.local` for enhanced features:

```env
# For AI-powered intent detection (optional)
OPENAI_API_KEY=your_openai_api_key_here

# For weather-based fitness suggestions (optional)
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweather_key_here
```

> **Note**: The app works perfectly without these API keys! They only enable enhanced AI features.
> OpenAI is an optional enhancement; the built-in rule-based intent detection works out of the box.

### Step 4: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser! 🎉

---

## First Steps

### 1. Explore the Welcome Screen

You'll see a beautiful landing page with 4 module cards:

- 📚 Study Planner
- 💰 Expense Tracker
- 🎯 Habit & Fitness
- 📊 Analytics

### 2. Try the Chat Interface

Click in the chat sidebar and type:

```
"Plan my study for DSA"
```

Watch the UI dynamically switch to the Study Planner module! ✨

### 3. Test Voice Commands

Click the microphone icon 🎤 and say:

```
"Track my expenses"
```

The AI will understand and show you the Expense Tracker!

### 4. Explore Other Modules

Try these prompts:

- `"Help me build daily habits"`
- `"Show productivity analytics"`
- `"Add expense of $50 for food"`
- `"Plan web development study"`

---

## Project Structure

```
Tambo_Hackathon_Project/
├── app/                    # Next.js pages
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── ui/               # ShadCN components
│   └── GenerativeUIContainer.tsx
├── modules/              # Feature modules
│   ├── StudyPlannerModule.tsx
│   ├── ExpenseTrackerModule.tsx
│   ├── HabitTrackerModule.tsx
│   └── AnalyticsDashboardModule.tsx
├── ai/                   # AI logic
│   ├── intentDetection.ts
│   └── openaiService.ts
├── services/            # External services
│   ├── mcpTools.ts
│   └── tamboIntegration.ts
├── store/              # State management
│   └── dashboardStore.ts
└── types/              # TypeScript types
    └── index.ts
```

---

## Common Commands

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript validation

# Clean
rm -rf .next node_modules
npm install          # Fresh install
```

---

## Features to Try

### 1. Study Planner

- ✅ Create study tasks
- ✅ Set priorities (low/medium/high)
- ✅ Track duration and due dates
- ✅ Mark as completed

### 2. Expense Tracker

- ✅ Add transactions (income/expense)
- ✅ Categorize spending
- ✅ View pie charts
- ✅ Track monthly balance

### 3. Habit Tracker

- ✅ Create habits
- ✅ Track daily completion
- ✅ Monitor streaks
- ✅ Set fitness goals

### 4. Analytics

- ✅ View productivity score
- ✅ Weekly trend charts
- ✅ AI insights
- ✅ Export data (JSON/CSV)

---

## How Generative UI Works

```
User Input → AI Detection → Component Selection → Dynamic Rendering
```

Example:

```typescript
// 1. User types: "Plan my study"
const userInput = "Plan my study"

// 2. AI detects intent
const intent = detectIntent(userInput)
// Result: { type: 'studyPlanner', confidence: 0.95 }

// 3. Select component
const Component = componentRegistry['studyPlanner']

// 4. Render dynamically
<Component />
```

---

## Customization

### Add a New Module

1. Create `/modules/YourModule.tsx`:

```typescript
'use client'

export default function YourModule() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2>Your Custom Module</h2>
    </motion.div>
  )
}
```

2. Register in `/components/GenerativeUIContainer.tsx`:

```typescript
const componentRegistry = {
  // ... existing
  yourModule: YourModule,
};
```

3. Add intent keywords in `/ai/intentDetection.ts`:

```typescript
{
  keywords: ['your', 'custom', 'keywords'],
  module: 'yourModule',
  confidence: 0.9,
}
```

---

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000 (Windows)
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
```

### Module Not Found

```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

### TypeScript Errors

```bash
# Check types
npm run type-check

# Ignore and build anyway (not recommended)
npm run build -- --no-lint
```

---

## Next Steps

1. ✅ Explore all 4 modules
2. ✅ Try voice commands
3. ✅ Add your own data
4. ✅ Customize the theme
5. ✅ Deploy to Vercel

---

## Getting Help

- 📖 **Full Documentation**: See [README.md](README.md)
- 🏗️ **Architecture**: See [ARCHITECTURE.md](ARCHITECTURE.md)
- 🚀 **Deployment**: See [DEPLOYMENT.md](DEPLOYMENT.md)
- 🐛 **Issues**: Open a GitHub issue
- 💬 **Questions**: Check existing issues or discussions

---

## What's Next?

### Deploy Your App

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Add More Features

- Implement real backend
- Add user authentication
- Create more modules
- Integrate more APIs

### Join the Community

- ⭐ Star the repository
- 🍴 Fork and contribute
- 📣 Share your experience

---

**You're all set! Happy coding! 🎉**

Need help? Check the [README](README.md) or open an issue.
