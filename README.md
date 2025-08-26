# 🤖 AI Model Comparison Chat Interface

A professional, modern chat interface that allows users to compare responses from multiple AI models simultaneously. Built with React, Vite, and featuring a beautiful glass morphism design with comprehensive comparison views.

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

## 🏗️ Technology Stack

- **Frontend Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.2
- **Styling**: Custom CSS with Glass Morphism
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **State Management**: React Context
- **Storage**: Local Storage for persistence
- **AI API**: OpenRouter API

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- OpenRouter API key

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AI_combined/frontend
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

## 🔑 Configuration

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

### Animation System
- Smooth slide-in effects for messages
- Fade transitions between comparison views
- Interactive hover states and micro-interactions

## 📱 Usage

### Getting Started
1. **Setup API Key**: Enter your OpenRouter API key
2. **Select Models**: Choose AI models for comparison
3. **Start Chatting**: Type your message and get responses from all selected models

### Comparison Views
- **Side-by-Side**: Perfect for detailed response analysis
- **Stacked**: Great for reading longer responses sequentially
- **Tabbed**: Clean interface for focused model comparison

### Conversation Management
- Conversations auto-save to local storage
- Load previous conversations from history
- Chronological message ordering (User → AI responses → User → AI responses)

## 🏃‍♂️ Available Scripts

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

## 🛡️ Features

### Security
- API keys stored securely in local storage
- No server-side data persistence
- Client-side encryption for sensitive data

### Performance
- Optimized React components with proper memoization
- Efficient state management with Context API
- Responsive images and lazy loading
- Minimal bundle size with tree shaking

### Accessibility
- Keyboard navigation support
- Screen reader friendly
- High contrast mode compatibility
- Touch-friendly mobile interface

## 🔧 Customization

### Theme Customization
Modify CSS variables in `src/App.css` for custom colors:
```css
:root {
  --color-primary-500: #8b5cf6;
  --color-secondary-500: #06b6d4;
  --radius-lg: 12px;
}
```

### Adding New Features
1. Create components in `src/components/`
2. Add context providers in `src/contexts/`
3. Implement services in `src/services/`
4. Update styling in `src/App.css`

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check the documentation
- Review the code comments

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Popular Platforms
- **Vercel**: Connect GitHub repository for automatic deployments
- **Netlify**: Drag and drop the `dist` folder
- **GitHub Pages**: Use GitHub Actions for CI/CD

---

**Made with ❤️ using React + Vite**
