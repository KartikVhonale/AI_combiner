# Contributing to AI Model Comparison Chat Interface

We love your input! We want to make contributing to this project as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

### Pull Requests

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Code Style

* Use ES6+ features where appropriate
* Follow React best practices and hooks patterns
* Use functional components over class components
* Implement proper error handling
* Add meaningful comments for complex logic
* Use semantic HTML and accessible markup

### CSS Guidelines

* Follow the existing glass morphism design system
* Use CSS custom properties (variables) for consistency
* Implement responsive design with mobile-first approach
* Maintain dark mode compatibility
* Use meaningful class names following BEM methodology

### Component Structure

```
ComponentName/
├── ComponentName.jsx
├── ComponentName.css (if needed)
└── index.js (export file)
```

## Coding Standards

### JavaScript/React

* Use `const` for immutable values, `let` for mutable
* Prefer arrow functions for inline functions
* Use destructuring for props and state
* Implement proper prop validation
* Use meaningful variable and function names

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line

Example:
```
Add dark mode toggle functionality

- Implement ThemeContext for state management
- Add toggle button to header component
- Update CSS variables for theme switching
- Persist theme preference in localStorage

Fixes #123
```

## Bug Reports

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](../../issues).

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## Feature Requests

We welcome feature requests! Please provide:

- Clear description of the feature
- Use case scenarios
- Expected behavior
- Mockups or examples (if applicable)
- Consider backwards compatibility

## Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AI_combined/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   - Get OpenRouter API key
   - Configure local environment

4. **Start development server**
   ```bash
   npm run dev
   ```

## Testing

Before submitting a PR:

1. **Run linting**
   ```bash
   npm run lint
   ```

2. **Test manually**
   - Test all comparison views (side-by-side, stacked, tabbed)
   - Verify dark mode functionality
   - Check mobile responsiveness
   - Test conversation history
   - Validate API integration

3. **Cross-browser testing**
   - Chrome/Chromium
   - Firefox
   - Safari
   - Edge

## Project Structure

```
src/
├── components/          # React components
│   ├── ChatInterface/
│   ├── Header/
│   ├── Sidebar/
│   └── ...
├── contexts/           # React contexts
│   ├── AppContext.jsx
│   └── ThemeContext.jsx
├── services/           # API and utility services
│   ├── openRouterAPI.js
│   └── memoryManager.js
├── styles/             # Global styles
└── App.jsx            # Main application component
```

## Design Principles

### User Experience
- Prioritize user-friendly interfaces
- Maintain consistent behavior across features
- Implement intuitive navigation
- Provide clear feedback for user actions

### Performance
- Optimize for fast loading times
- Implement efficient state management
- Use proper React optimization techniques
- Minimize bundle size

### Accessibility
- Follow WCAG guidelines
- Ensure keyboard navigation
- Provide proper ARIA labels
- Support screen readers

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Feel free to open an issue for any questions about contributing!