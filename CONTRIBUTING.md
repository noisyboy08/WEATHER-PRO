# Contributing to WeatherPro

Thank you for your interest in contributing to WeatherPro! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Git
- Basic knowledge of React, TypeScript, and Tailwind CSS

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/yourusername/weatherpro.git
   cd weatherpro
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment**
   ```bash
   cp .env.example .env
   # Add your API keys to .env
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## 📋 How to Contribute

### Reporting Bugs
1. Check existing issues first
2. Use the bug report template
3. Include steps to reproduce
4. Add screenshots if applicable
5. Specify browser and OS versions

### Suggesting Features
1. Check if feature already exists or is planned
2. Use the feature request template
3. Explain the use case and benefits
4. Provide mockups or examples if possible

### Code Contributions

#### Branch Naming
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

#### Commit Messages
Follow conventional commits format:
```
type(scope): description

feat(dashboard): add weather alerts
fix(auth): resolve login validation issue
docs(readme): update installation guide
```

#### Pull Request Process
1. Create a feature branch from `main`
2. Make your changes
3. Add tests if applicable
4. Update documentation
5. Run linting and tests
6. Create a pull request with detailed description

## 🎯 Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow existing naming conventions
- Use functional components with hooks
- Implement proper error handling
- Add JSDoc comments for functions

### Component Structure
```typescript
interface ComponentProps {
  // Define props with proper types
}

const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Component logic
  
  return (
    <div className="component-styles">
      {/* JSX content */}
    </div>
  )
}

export default Component
```

### File Organization
- Components in `src/components/`
- Pages in `src/pages/`
- Utilities in `src/lib/`
- Types in `src/types/`
- Contexts in `src/contexts/`

### Styling Guidelines
- Use Tailwind CSS classes
- Follow mobile-first responsive design
- Maintain consistent spacing (8px grid)
- Use semantic color names
- Implement dark mode considerations

### Animation Guidelines
- Use Framer Motion for complex animations
- Keep animations under 300ms for micro-interactions
- Provide reduced motion alternatives
- Test on mobile devices

## 🧪 Testing

### Running Tests
```bash
npm run test          # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

### Writing Tests
- Write unit tests for utilities
- Add integration tests for components
- Test error scenarios
- Mock external API calls

### Test Structure
```typescript
describe('ComponentName', () => {
  it('should render correctly', () => {
    // Test implementation
  })
  
  it('should handle user interactions', () => {
    // Test implementation
  })
})
```

## 📚 Documentation

### Code Documentation
- Add JSDoc comments for functions
- Document complex logic
- Include usage examples
- Update README for new features

### API Documentation
- Document new API endpoints
- Include request/response examples
- Specify error codes
- Update OpenAPI specs

## 🔍 Code Review Process

### For Contributors
- Ensure code follows style guidelines
- Add appropriate tests
- Update documentation
- Respond to review feedback promptly

### For Reviewers
- Check code quality and style
- Verify functionality works as expected
- Ensure tests are adequate
- Provide constructive feedback

## 🏷️ Release Process

### Version Numbering
We follow Semantic Versioning (SemVer):
- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes (backward compatible)

### Release Checklist
- [ ] Update version number
- [ ] Update CHANGELOG.md
- [ ] Run full test suite
- [ ] Update documentation
- [ ] Create release notes
- [ ] Tag release in Git

## 🎨 Design Guidelines

### UI/UX Principles
- Prioritize user experience
- Maintain visual consistency
- Follow accessibility guidelines
- Design for mobile-first
- Use meaningful animations

### Color Palette
- Primary: `#b5a1e5` (Purple)
- Background: `#131214` (Dark)
- Surface: `#1d1c1f` (Dark Gray)
- Text: `#eae6f2` (Light)

### Typography
- Font Family: Nunito Sans
- Heading Scale: 1.25 ratio
- Line Height: 1.5 for body, 1.2 for headings
- Font Weights: 400 (regular), 600 (semibold)

## 🛡️ Security

### Reporting Security Issues
- Email security@weatherpro.com
- Do not create public issues for security vulnerabilities
- Provide detailed information about the issue
- Allow time for fix before public disclosure

### Security Guidelines
- Validate all user inputs
- Sanitize data before display
- Use HTTPS for all API calls
- Keep dependencies updated
- Follow OWASP guidelines

## 📞 Getting Help

### Communication Channels
- **GitHub Discussions** - General questions and ideas
- **GitHub Issues** - Bug reports and feature requests
- **Discord** - Real-time chat with contributors
- **Email** - Direct contact for sensitive issues

### Resources
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Framer Motion Docs](https://www.framer.com/motion/)

## 🏆 Recognition

### Contributors
All contributors will be recognized in:
- README.md contributors section
- Release notes
- Project website
- Annual contributor highlights

### Contribution Types
We recognize various types of contributions:
- Code contributions
- Bug reports
- Feature suggestions
- Documentation improvements
- Design contributions
- Community support

## 📄 License

By contributing to WeatherPro, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to WeatherPro! Together, we're building the future of weather applications. 🌤️