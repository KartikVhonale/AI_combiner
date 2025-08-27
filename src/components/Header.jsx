import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';
import { Menu, Save, AlertCircle, CheckCircle, X, Moon, Sun, Monitor, Settings as SettingsIcon, MessageSquare, EyeOff } from 'lucide-react';
import Settings from './Settings';

const Header = () => {
  const { state, actions } = useAppContext();
  const { theme, toggleTheme, isDark } = useTheme();
  const [showSettings, setShowSettings] = useState(false);
  const [chatHidden, setChatHidden] = useState(false);

  const handleSaveConversation = () => {
    if (state.messages.length > 0) {
      actions.saveCurrentConversation();
      actions.showSuccess('Conversation saved!');
    }
  };

  const handleToggleSidebar = () => {
    // Notify App component about manual sidebar toggle
    window.dispatchEvent(new CustomEvent('manualSidebarToggle'));
    
    // Save desktop sidebar preference when toggled
    if (window.innerWidth >= 768) {
      const newState = !state.sidebarOpen;
      localStorage.setItem('sidebarOpenDesktop', newState.toString());
    }
    actions.toggleSidebar();
  };

  const handleToggleChat = () => {
    setChatHidden(!chatHidden);
    // Dispatch custom event to notify App component
    window.dispatchEvent(new CustomEvent('toggleChat', { detail: { hidden: !chatHidden } }));
  };

  return (
    <>
      <header className="header bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            {/* Hamburger Menu Button - Visible on all screen sizes */}
            <button
              onClick={handleToggleSidebar}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 
                hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-all duration-200 
                border border-transparent hover:border-gray-300 dark:hover:border-gray-600
                min-w-[40px] min-h-[40px] flex items-center justify-center"
              title="Toggle Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Mobile Chat Toggle Button - Only visible on mobile */}
            <button
              onClick={handleToggleChat}
              className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 
                hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-all duration-200 
                border border-transparent hover:border-gray-300 dark:hover:border-gray-600
                min-w-[40px] min-h-[40px] flex items-center justify-center"
              title={chatHidden ? 'Show Chat' : 'Hide Chat'}
            >
              {chatHidden ? (
                <MessageSquare className="w-5 h-5" />
              ) : (
                <EyeOff className="w-5 h-5" />
              )}
            </button>
            
            <div className="hidden sm:block">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                AI Model Combiner
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Compare responses from multiple AI models
              </p>
            </div>
          </div>

          {/* Center Section - Status */}
          <div className="flex items-center gap-4">
            {/* API Key Status */}
            <div className="flex items-center gap-2">
              {state.isApiKeyValid ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600 hidden sm:inline">API Connected</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-orange-600 hidden sm:inline">API Key Required</span>
                </>
              )}
            </div>

            {/* Selected Models Count */}
            {state.selectedModels.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600 hidden sm:inline">
                  {state.selectedModels.length} model{state.selectedModels.length === 1 ? '' : 's'}
                </span>
              </div>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Settings Button */}
            <button
              onClick={() => {
                console.log('Settings button clicked, current showSettings:', showSettings);
                setShowSettings(true);
                console.log('Settings should now be visible');
              }}
              className="settings-icon-glow flex items-center justify-center w-12 h-12 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700
                rounded-xl transition-all duration-200 relative overflow-hidden group border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-600
                shadow-sm hover:shadow-lg transform hover:scale-105 active:scale-95"
              title="Settings"
            >
              <SettingsIcon className="w-7 h-7 transition-transform duration-200 group-hover:rotate-45" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 
                group-hover:opacity-15 transition-opacity duration-200 rounded-xl"></div>
              {/* Subtle glow effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 
                group-hover:opacity-100 transition-all duration-300 blur-sm scale-110"></div>
            </button>
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-10 h-10 text-gray-600 hover:text-gray-900 hover:bg-gray-100 
                rounded-lg transition-all duration-200 relative overflow-hidden group"
              title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              <div className="relative w-5 h-5">
                <Sun className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
                  isDark ? 'opacity-0 rotate-180 scale-0' : 'opacity-100 rotate-0 scale-100'
                }`} />
                <Moon className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
                  isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-180 scale-0'
                }`} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 
                group-hover:opacity-10 transition-opacity duration-200 rounded-lg"></div>
            </button>
            
            {/* Save Button */}
            {state.messages.length > 0 && (
              <button
                onClick={handleSaveConversation}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">Save</span>
              </button>
            )}

            {/* Loading Indicator */}
            {(state.isLoading || state.isLoadingModels) && (
              <div className="flex items-center gap-2 px-3 py-1.5">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-gray-600 hidden sm:inline">Processing...</span>
              </div>
            )}
          </div>
        </div>

        {/* Notifications */}
        {(state.error || state.success) && (
          <div className="mt-3">
            {state.error && (
              <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-800">{state.error}</span>
                </div>
                <button
                  onClick={actions.clearNotifications}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            
            {state.success && (
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-800">{state.success}</span>
                </div>
                <button
                  onClick={actions.clearNotifications}
                  className="text-green-500 hover:text-green-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Settings Modal - Rendered outside the header container */}
      {showSettings && (
        <Settings onClose={() => setShowSettings(false)} />
      )}
    </>
  );
};

export default Header;