# Contributing to Telegram Billionaire Empire

Thank you for your interest in contributing to Telegram Billionaire Empire! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Bugs

1. **Check existing issues** first to avoid duplicates
2. **Use the bug report template** when creating new issues
3. **Provide detailed information**:
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots/videos if applicable
   - Environment details (browser, OS, etc.)

### Suggesting Features

1. **Check the roadmap** and existing feature requests
2. **Use the feature request template**
3. **Explain the use case** and potential impact
4. **Consider implementation complexity**

### Code Contributions

1. **Fork the repository**
2. **Create a feature branch** from `main`
3. **Make your changes** following our coding standards
4. **Write tests** for new functionality
5. **Update documentation** as needed
6. **Submit a pull request**

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Git
- Supabase CLI
- TON development tools

### Local Development

1. **Clone your fork**

   ```bash
   git clone https://github.com/yourusername/telegram-billionaire-sim.git
   cd telegram-billionaire-sim
   ```

2. **Install dependencies**

   ```bash
   npm install
   cd server && npm install && cd ..
   ```

3. **Set up environment**

   ```bash
   cp server/env.example server/.env
   # Edit server/.env with your development credentials
   ```

4. **Start development servers**

   ```bash
   # Terminal 1: Backend
   cd server && npm run dev
   
   # Terminal 2: Frontend
   npm run dev
   ```

## 📝 Coding Standards

### JavaScript/React

- Use **ES6+ features** and modern JavaScript
- Follow **React best practices** and hooks patterns
- Use **functional components** over class components
- Implement **proper error boundaries**
- Use **TypeScript** for type safety (when applicable)

### Code Style

- **ESLint**: Follow the configured rules
- **Prettier**: Auto-format code before commits
- **Naming**: Use descriptive, camelCase variable names
- **Comments**: Document complex logic and business rules
- **File Structure**: Keep files focused and under 300 lines

### Example Code Style

```javascript
// ✅ Good
const calculateBusinessIncome = (business, timeElapsed) => {
  if (!business?.isActive) {
    return 0;
  }
  
  const baseIncome = business.baseIncome * business.level;
  const timeMultiplier = timeElapsed / 1000; // Convert to seconds
  
  return Math.floor(baseIncome * timeMultiplier);
};

// ❌ Bad
const calc = (b, t) => {
  return b.income * t;
};
```

### Component Structure

```jsx
// Component imports
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Local imports
import useGameStore from '../store/gameStore';
import { formatNumber } from '../utils/formatters';

// Component definition
const BusinessCard = ({ business, onUpgrade }) => {
  // Hooks
  const [isLoading, setIsLoading] = useState(false);
  
  // Store
  const player = useGameStore(state => state.player);
  
  // Effects
  useEffect(() => {
    // Effect logic
  }, [business.id]);
  
  // Event handlers
  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      await onUpgrade(business.id);
    } catch (error) {
      console.error('Upgrade failed:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Render
  return (
    <motion.div className="business-card">
      {/* Component JSX */}
    </motion.div>
  );
};

export default BusinessCard;
```

## 🧪 Testing

### Frontend Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Backend Testing

```bash
cd server

# Run API tests
npm test

# Run specific test file
npm test -- --grep "game routes"
```

### Test Guidelines

- **Unit tests** for utility functions
- **Component tests** for React components
- **Integration tests** for API endpoints
- **E2E tests** for critical user flows
- **Mock external services** (Supabase, TON)

## 🔄 Git Workflow

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Test additions/updates

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

[optional body]

[optional footer]
```

Examples:

```
feat(game): add business upgrade system
fix(api): resolve tap validation error
docs(readme): update installation instructions
refactor(store): simplify state management
test(components): add TapButton tests
```

### Pull Request Process

1. **Update your branch** with latest main
2. **Run tests** and ensure they pass
3. **Update documentation** if needed
4. **Fill out PR template** completely
5. **Request review** from maintainers
6. **Address feedback** promptly

## 🏗️ Architecture Guidelines

### Frontend Architecture

- **Components**: Reusable, single-responsibility
- **Pages**: Route-level components
- **Store**: Zustand for state management
- **Services**: API communication layer
- **Utils**: Pure helper functions

### Backend Architecture

- **Routes**: Express route handlers
- **Middleware**: Request processing
- **Services**: Business logic
- **Models**: Data access layer
- **Utils**: Shared utilities

### Database Design

- **Normalization**: Avoid data duplication
- **Indexing**: Optimize query performance
- **Constraints**: Ensure data integrity
- **Migrations**: Version control schema changes

## 🔐 Security Guidelines

### Frontend Security

- **Input validation** on all user inputs
- **XSS prevention** through proper escaping
- **CSRF protection** for state-changing operations
- **Secure storage** of sensitive data

### Backend Security

- **Authentication** on all protected routes
- **Authorization** based on user roles
- **Rate limiting** to prevent abuse
- **Input sanitization** and validation
- **SQL injection** prevention
- **Error handling** without information leakage

### Blockchain Security

- **Transaction validation** before processing
- **Wallet verification** for ownership
- **Amount limits** to prevent large losses
- **Audit trails** for all transactions

## 📚 Documentation

### Code Documentation

- **JSDoc comments** for functions and classes
- **README files** for complex modules
- **Inline comments** for business logic
- **API documentation** for endpoints

### User Documentation

- **Setup guides** for different environments
- **Feature explanations** with examples
- **Troubleshooting guides** for common issues
- **FAQ sections** for user questions

## 🚀 Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

- [ ] All tests passing
- [ ] Documentation updated
- [ ] Changelog updated
- [ ] Version bumped
- [ ] Security review completed
- [ ] Performance testing done
- [ ] Deployment tested

## 🎯 Project Priorities

### High Priority

- Security and anti-cheat measures
- Performance optimization
- User experience improvements
- Bug fixes and stability

### Medium Priority

- New game features
- Social features enhancement
- Analytics and monitoring
- Developer experience

### Low Priority

- UI/UX polish
- Additional integrations
- Advanced features
- Experimental features

## 📞 Getting Help

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Discord**: Real-time chat with maintainers
- **Email**: <security@billionaire-empire.com> (security issues)

### Maintainer Response Times

- **Security issues**: Within 24 hours
- **Bug reports**: Within 48 hours
- **Feature requests**: Within 1 week
- **Pull requests**: Within 3-5 days

## 🏆 Recognition

Contributors will be recognized in:

- **README.md** contributors section
- **CHANGELOG.md** for significant contributions
- **GitHub releases** for version contributions
- **Special badges** for major contributors

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Telegram Billionaire Empire! 🚀
