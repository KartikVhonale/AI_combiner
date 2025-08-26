import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Settings as SettingsIcon, 
  Brain, 
  Key, 
  Palette, 
  Save, 
  RotateCcw,
  Moon,
  Sun,
  Monitor,
  Gift,
  Crown,
  DollarSign,
  Check,
  X,
  ChevronDown,
  Search
} from 'lucide-react';
import ModelSelector from './ModelSelector';
import APIKeyManager from './APIKeyManager';

const Settings = ({ onClose }) => {
  const { state, actions } = useAppContext();
  const { theme, setLightTheme, setDarkTheme, setSystemTheme, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('models');
  const [preferences, setPreferences] = useState(state.userPreferences);

  // Handle escape key to close modal
  React.useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const tabs = [
    { id: 'models', label: 'Models', icon: Brain },
    { id: 'api', label: 'API Key', icon: Key },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'general', label: 'General', icon: SettingsIcon }
  ];

  const handleSavePreferences = () => {
    actions.updateUserPreferences(preferences);
    actions.showSuccess('Settings saved successfully!');
  };

  const handleResetPreferences = () => {
    const defaultPreferences = {
      theme: 'light',
      defaultTemperature: 0.7,
      defaultMaxTokens: 1000,
      autoSave: true,
      showModelInfo: true,
      comparisonView: 'side-by-side'
    };
    setPreferences(defaultPreferences);
    actions.updateUserPreferences(defaultPreferences);
    actions.showSuccess('Settings reset to defaults!');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'models':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Model Selection</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Choose which AI models you want to use for generating responses. 
                You can select multiple models to compare their outputs.
              </p>
            </div>
            
            <ModelSelector />
            
            {state.selectedModels.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Selected Models Summary</h4>
                <div className="space-y-2">
                  {state.selectedModels.map(modelId => {
                    const model = state.availableModels.find(m => m.id === modelId);
                    if (!model) return null;
                    
                    return (
                      <div key={modelId} className="flex items-center justify-between bg-white dark:bg-gray-700 rounded p-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm dark:text-white">{model.name}</span>
                          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                            model.isFree 
                              ? 'bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800'
                              : 'bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800'
                          }`}>
                            {model.isFree ? <Gift className="w-3 h-3" /> : <Crown className="w-3 h-3" />}
                            <span>{model.isFree ? 'Free' : 'Paid'}</span>
                          </div>
                        </div>
                        {!model.isFree && model.promptPrice > 0 && (
                          <span className="text-xs text-blue-600 dark:text-blue-400">
                            ${(model.promptPrice * 1000000).toFixed(2)}/M tokens
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );

      case 'api':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">API Configuration</h3>
              <p className="text-sm text-gray-600 mb-4">
                Configure your OpenRouter API key to access AI models.
              </p>
            </div>
            
            <APIKeyManager />
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Theme Settings</h3>
              <p className="text-sm text-gray-600 mb-4">
                Customize the appearance of the application.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={setLightTheme}
                    className={`p-4 border rounded-lg transition-all ${
                      theme === 'light' 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Sun className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm font-medium">Light</div>
                  </button>
                  
                  <button
                    onClick={setDarkTheme}
                    className={`p-4 border rounded-lg transition-all ${
                      theme === 'dark' 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Moon className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm font-medium">Dark</div>
                  </button>
                  
                  <button
                    onClick={setSystemTheme}
                    className={`p-4 border rounded-lg transition-all ${
                      !['light', 'dark'].includes(theme)
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Monitor className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm font-medium">System</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Comparison View</label>
                <select
                  value={preferences.comparisonView}
                  onChange={(e) => setPreferences({...preferences, comparisonView: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="side-by-side">Side by Side</option>
                  <option value="stacked">Stacked</option>
                  <option value="tabbed">Tabbed</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">General Settings</h3>
              <p className="text-sm text-gray-600 mb-4">
                Configure general application behavior and AI model parameters.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Temperature: {preferences.defaultTemperature}
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={preferences.defaultTemperature}
                  onChange={(e) => setPreferences({...preferences, defaultTemperature: parseFloat(e.target.value)})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Focused (0)</span>
                  <span>Balanced (1)</span>
                  <span>Creative (2)</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Max Tokens: {preferences.defaultMaxTokens}
                </label>
                <input
                  type="range"
                  min="100"
                  max="4000"
                  step="100"
                  value={preferences.defaultMaxTokens}
                  onChange={(e) => setPreferences({...preferences, defaultMaxTokens: parseInt(e.target.value)})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Short (100)</span>
                  <span>Medium (2000)</span>
                  <span>Long (4000)</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.autoSave}
                    onChange={(e) => setPreferences({...preferences, autoSave: e.target.checked})}
                    className="mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Auto-save conversations</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.showModelInfo}
                    onChange={(e) => setPreferences({...preferences, showModelInfo: e.target.checked})}
                    className="mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Show model information</span>
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{
        zIndex: 50000,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)'
      }}
    >
      <div 
        className="flex min-h-screen items-center justify-center p-4" 
        onClick={handleBackdropClick}
        style={{ height: '100vh' }}
      >
        <div 
          className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-auto"
          style={{
            width: '100%',
            maxWidth: 'min(90vw, 56rem)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <SettingsIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">Configure your AI model preferences</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="flex" style={{ height: 'calc(100vh - 8rem)' }}>
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 overflow-y-auto flex-shrink-0">
            <div className="p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-800">
            <div className="p-6">
              {renderTabContent()}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <button
            onClick={handleResetPreferences}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Defaults
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSavePreferences}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Settings;