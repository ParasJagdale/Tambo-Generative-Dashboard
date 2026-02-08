# Contributing to AI Life Dashboard

First off, thank you for considering contributing to AI Life Dashboard! 🎉

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues. When you create a bug report, include as many details as possible:

- Use a clear and descriptive title
- Describe the exact steps to reproduce the problem
- Provide specific examples to demonstrate the steps
- Describe the behavior you observed and what you expected
- Include screenshots if applicable
- Note your environment (OS, browser, Node version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- Use a clear and descriptive title
- Provide a detailed description of the suggested enhancement
- Provide specific examples to demonstrate the enhancement
- Describe the current behavior and explain the expected behavior
- Explain why this enhancement would be useful

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Issue that pull request!

## Development Process

### Setup

```bash
git clone https://github.com/your-username/ai-life-dashboard.git
cd ai-life-dashboard
npm install
cp .env.local.example .env.local
npm run dev
```

### Coding Style

- Use TypeScript for all new code
- Follow the existing code style
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

### Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters
- Reference issues and pull requests liberally

### Adding a New Module

1. Create module in `/modules/YourModule.tsx`
2. Add types to `/types/index.ts`
3. Register in component registry
4. Add intent keywords
5. Update README
6. Add tests

Example:

```typescript
// modules/YourModule.tsx
'use client'

import { motion } from 'framer-motion'
import { useDashboardStore } from '@/store/dashboardStore'

export default function YourModule() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Your module content */}
    </motion.div>
  )
}
```

## Project Structure

```
ai-life-dashboard/
├── app/              # Next.js app directory
├── components/       # Reusable UI components
├── modules/          # Feature modules
├── ai/              # AI and intent detection
├── services/        # External services
├── store/           # State management
├── hooks/           # Custom React hooks
├── types/           # TypeScript definitions
└── utils/           # Utility functions
```

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run linter
npm run lint

# Run type check
npm run type-check
```

## Documentation

- Update README.md if needed
- Add JSDoc comments for functions
- Update ARCHITECTURE.md for structural changes
- Add examples for new features

## Recognition

Contributors will be recognized in:

- README.md contributors section
- Release notes
- Project website (when available)

## Questions?

Feel free to open an issue with the `question` label or reach out to the maintainers.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to AI Life Dashboard! 🚀
