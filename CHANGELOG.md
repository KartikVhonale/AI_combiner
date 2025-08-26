# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial release of AI Model Comparison Chat Interface
- Multi-model chat functionality with OpenRouter API integration
- Three comparison view layouts: side-by-side, stacked, and tabbed
- Professional glass morphism design system
- Dark mode support with theme persistence
- Conversation history with local storage
- Mobile-responsive design
- Model selection with search and filtering
- Real-time response generation from multiple AI models
- Visual distinction between free and paid models
- Enhanced user message styling with glass morphism effects
- Chronological conversation flow management
- Auto-save functionality for conversations
- Professional animation system
- Comprehensive settings management

### Changed
- Improved conversation flow to maintain chronological order
- Enhanced user message styling with professional design
- Optimized responsive layouts for all screen sizes
- Updated comparison view system with better visual hierarchy

### Fixed
- Lucide React import issues
- Side-by-side layout alignment problems
- Conversation history persistence
- Mobile responsiveness issues
- Dark mode styling inconsistencies

## [1.0.0] - 2024-01-XX

### Added
- Core chat interface functionality
- OpenRouter API integration
- Basic model selection
- Simple conversation management
- Initial responsive design
- Basic dark mode support

---

## How to Update This Changelog

When making changes to the project:

1. Add new entries under the `[Unreleased]` section
2. Use the following categories:
   - `Added` for new features
   - `Changed` for changes in existing functionality
   - `Deprecated` for soon-to-be removed features
   - `Removed` for now removed features
   - `Fixed` for any bug fixes
   - `Security` for vulnerability fixes

3. When releasing a new version:
   - Change `[Unreleased]` to the version number with date
   - Add a new `[Unreleased]` section at the top

### Example Entry Format

```markdown
### Added
- New feature description [#123](link-to-issue)

### Fixed
- Bug fix description [#456](link-to-issue)
```