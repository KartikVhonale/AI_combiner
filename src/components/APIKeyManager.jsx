import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Eye, EyeOff, Key, CheckCircle, XCircle } from 'lucide-react';

const APIKeyManager = () => {
  const { state, actions } = useAppContext();
  const [localApiKey, setLocalApiKey] = useState(state.apiKey || '');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const handleApiKeySubmit = async (e) => {
    e.preventDefault();
    if (localApiKey.trim()) {
      setIsValidating(true);
      await actions.setApiKey(localApiKey.trim());
      setIsValidating(false);
    }
  };

  const handleClearApiKey = () => {
    setLocalApiKey('');
    actions.setApiKey('');
  };

  return (
    <div className="api-key-manager">
      <div className="api-key-header">
        <div className="flex items-center gap-2 mb-4">
          <Key className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">OpenRouter API Key</h3>
          {state.isApiKeyValid && (
            <CheckCircle className="w-5 h-5 text-green-500" />
          )}
          {state.apiKey && !state.isApiKeyValid && (
            <XCircle className="w-5 h-5 text-red-500" />
          )}
        </div>
      </div>

      <form onSubmit={handleApiKeySubmit} className="space-y-4">
        <div className="relative">
          <input
            type={showApiKey ? 'text' : 'password'}
            value={localApiKey}
            onChange={(e) => setLocalApiKey(e.target.value)}
            placeholder="Enter your OpenRouter API key..."
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            disabled={isValidating}
          />
          <button
            type="button"
            onClick={() => setShowApiKey(!showApiKey)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            disabled={isValidating}
          >
            {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!localApiKey.trim() || isValidating}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isValidating ? 'Validating...' : 'Save API Key'}
          </button>
          
          {state.apiKey && (
            <button
              type="button"
              onClick={handleClearApiKey}
              className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isValidating}
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {state.isApiKeyValid && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-sm">
            ✅ API key is valid! You can now select models and start chatting.
          </p>
        </div>
      )}

      {state.apiKey && !state.isApiKeyValid && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">
            ❌ Invalid API key. Please check your key and try again.
          </p>
        </div>
      )}

      <div className="mt-6 relative overflow-hidden">
        {/* Glass morphism container */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/90 via-indigo-50/80 to-purple-50/90 dark:from-blue-900/30 dark:via-indigo-900/20 dark:to-purple-900/30 backdrop-blur-sm rounded-xl"></div>
        
        {/* Border gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-200/60 via-indigo-200/40 to-purple-200/60 dark:from-blue-400/20 dark:via-indigo-400/15 dark:to-purple-400/20 rounded-xl p-0.5">
          <div className="w-full h-full bg-white/80 dark:bg-gray-900/80 rounded-xl backdrop-blur-sm"></div>
        </div>
        
        {/* Content */}
        <div className="relative p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm shadow-lg flex-shrink-0 mt-0.5">
              <Key className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-300 dark:to-indigo-300 text-base mb-1">
                How to get your API key:
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Follow these simple steps to get started
              </p>
            </div>
          </div>
          
          <ol className="space-y-3 mb-4">
            <li className="flex items-start gap-3 group">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0 mt-0.5 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                1
              </div>
              <div className="flex-1">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Go to{' '}
                  <a 
                    href="https://openrouter.ai" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-300 dark:hover:to-indigo-300 transition-all duration-300 relative"
                  >
                    OpenRouter.ai
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
                  </a>
                </span>
              </div>
            </li>
            
            <li className="flex items-start gap-3 group">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0 mt-0.5 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                2
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">
                Sign up or log in to your account
              </span>
            </li>
            
            <li className="flex items-start gap-3 group">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0 mt-0.5 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                3
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">
                Navigate to the <span className="font-medium text-blue-700 dark:text-blue-300">API Keys</span> section
              </span>
            </li>
            
            <li className="flex items-start gap-3 group">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0 mt-0.5 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                4
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">
                Create a new API key
              </span>
            </li>
            
            <li className="flex items-start gap-3 group">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0 mt-0.5 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                5
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">
                Copy and paste it above
              </span>
            </li>
          </ol>
          
          {/* Security notice */}
          <div className="bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200/60 dark:border-green-700/40 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
              <p className="text-xs font-medium text-green-800 dark:text-green-300">
                🔒 Your API key is stored locally and never shared with third parties.
              </p>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-3 right-3 w-2 h-2 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full opacity-60 animate-pulse"></div>
          <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full opacity-40"></div>
        </div>
        
        {/* Hover glow effect */}
        <div className="absolute inset-0 opacity-0 hover:opacity-100 bg-gradient-to-br from-blue-400/10 via-indigo-400/5 to-purple-400/10 rounded-xl transition-opacity duration-300 pointer-events-none"></div>
      </div>
    </div>
  );
};

export default APIKeyManager;