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

      <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">How to get your API key:</h4>
        <ol className="text-sm text-gray-600 space-y-1">
          <li> Go to <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">OpenRouter.ai</a></li>
          <li> Sign up or log in to your account</li>
          <li> Navigate to the API Keys section</li>
          <li> Create a new API key</li>
          <li> Copy and paste it above</li>
        </ol>
        <p className="text-xs text-gray-500 mt-2">
          Your API key is stored locally and never shared with third parties.
        </p>
      </div>
    </div>
  );
};

export default APIKeyManager;