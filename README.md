# 🤖 AI Model Comparison Chat Interface

[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.2-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/github/license/your-username/ai-model-comparison?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)

A professional, modern chat interface that allows users to compare responses from multiple AI models simultaneously. Built with React, Vite, and featuring a beautiful glass morphism design with comprehensive comparison views.

<p align="center">
  <img src="https://placehold.co/800x400/8B5CF6/FFFFFF?text=AI+Model+Comparison+Interface" alt="AI Model Comparison Interface" width="100%">
</p>

## ✨ Features

### 🚀 Core Functionality
- **Multi-Model Chat**: Compare responses from multiple AI models side-by-side
- **Real-time Responses**: Get simultaneous responses from selected AI models
- **Conversation History**: Automatic local storage with persistent chat history
- **Professional UI/UX**: Glass morphism design with smooth animations
- **Dark Mode Support**: Toggle between light and dark themes
- **Mobile Responsive**: Optimized for all device sizes

### 🎯 Comparison Views
- **Side-by-Side**: Grid layout with responsive columns (1-4 models)
- **Stacked**: Vertical layout with enhanced visual separation
- **Tabbed**: Clean tabbed interface with smooth transitions

### 🛠️ Advanced Features
- **OpenRouter Integration**: Access to 100+ AI models from various providers
- **Model Selection**: Search, filter, and select from free and paid models
- **Conversation Management**: Save, load, and manage multiple conversations
- **Custom Settings**: Temperature, max tokens, and user preferences
- **Visual Indicators**: Clear distinction between free and paid models
- **Markdown Support**: Rich text formatting with code syntax highlighting

## 📸 Screenshots

<p align="center">
  <img src="https://placehold.co/400x300/8B5CF6/FFFFFF?text=Desktop+View" alt="Desktop View" width="45%">
  <img src="https://placehold.co/200x300/06B6D4/FFFFFF?text=Mobile+View" alt="Mobile View" width="45%">
</p>

## 🏗️ Technology Stack

- **Frontend Framework**: [React 19.1.1](https://reactjs.org/)
- **Build Tool**: [Vite 7.1.2](https://vitejs.dev/)
- **Styling**: Custom CSS with Glass Morphism
- **Icons**: [Lucide React](https://lucide.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **State Management**: React Context
- **Storage**: Local Storage for persistence
- **AI API**: [OpenRouter API](https://openrouter.ai/)

## 📦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- OpenRouter API key (get it from [OpenRouter](https://openrouter.ai/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ai-model-comparison.git
   cd ai-model-comparison/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

## 🔧 Configuration

### API Key Setup
1. Get your OpenRouter API key from [OpenRouter](https://openrouter.ai/)
2. Enter the API key in the application's API Key Manager
3. The app will automatically fetch available models

### Model Selection
- Navigate to Settings → Models
- Search and select your preferred AI models
- Choose from free models (GPT-3.5, Claude Haiku) or paid models
- Configure comparison view preferences

## 🎨 Design System

### Glass Morphism
- Translucent backgrounds with backdrop blur
- Gradient borders and subtle shadows
- Professional color palette with dark mode support

### Responsive Design
- **Mobile**: Single column layout with touch-optimized controls
- **Tablet**: 2-column grid for model comparisons
- **Desktop**: Up to 4-column grid for comprehensive comparisons
- **Large Screens**: Enhanced spacing and typography

## 📱 Usage

### Getting Started
1. **Setup API Key**: Enter your OpenRouter API key
2. **Select Models**: Choose AI models for comparison
3. **Start Chatting**: Type your message and get responses from all selected models

### Comparison Views
- **Side-by-Side**: Perfect for detailed response analysis
- **Stacked**: Great for reading longer responses sequentially
- **Tabbed**: Clean interface for focused model comparison

## 📊 Supported AI Models

### Free Models
- **OpenAI**: GPT-3.5 Turbo
- **Anthropic**: Claude 3 Haiku
- **Google**: Gemini Flash
- **Meta**: Llama models
- **Mistral**: 7B models

### Paid Models
- **OpenAI**: GPT-4, GPT-4 Turbo
- **Anthropic**: Claude 3 Opus, Claude 3 Sonnet
- **Google**: Gemini Pro
- **Perplexity**: Sonar models
- **And many more...**

## 🛡️ Security & Privacy

### Data Handling
- API keys stored securely in local storage
- No server-side data persistence
- Client-side only processing

### Best Practices
- Never commit API keys to version control
- Use environment variables for sensitive data
- Regular security audits of dependencies

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Deploy to Popular Platforms
- **Vercel**: Connect GitHub repository for automatic deployments
- **Netlify**: Drag and drop the `dist` folder
- **GitHub Pages**: Use GitHub Actions for CI/CD

## 🤝 Contributing

We love contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on:

- Code of Conduct
- How to submit pull requests
- Coding standards
- Development workflow
- Reporting issues

### Quick Start for Contributors
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenRouter](https://openrouter.ai/) for providing access to multiple AI models
- [React](https://reactjs.org/) for the amazing UI library
- [Vite](https://vitejs.dev/) for the blazing fast build tool
- All the open-source libraries and tools that made this project possible

## 📞 Support

If you encounter any issues or have questions:
- Check the [Documentation](#documentation)
- [Open an issue](https://github.com/your-username/ai-model-comparison/issues/new/choose)
- Review the [Contributing Guidelines](CONTRIBUTING.md)

---

<p align="center">
  <a href="https://github.com/your-username/ai-model-comparison/stargazers">
    <img src="https://img.shields.io/github/stars/your-username/ai-model-comparison?style=social" alt="GitHub Stars">
  </a>
  <a href="https://github.com/your-username/ai-model-comparison/network/members">
    <img src="https://img.shields.io/github/forks/your-username/ai-model-comparison?style=social" alt="GitHub Forks">
  </a>
  <a href="https://github.com/your-username/ai-model-comparison/issues">
    <img src="https://img.shields.io/github/issues/your-username/ai-model-comparison?style=social" alt="GitHub Issues">
  </a>
</p>

<p align="center">
  Made with ❤️ using React + Vite
</p>