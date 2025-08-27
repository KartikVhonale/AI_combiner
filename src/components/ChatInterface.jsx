import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Send, Loader, Copy, ThumbsUp, ThumbsDown, RotateCcw, Grid, Layers, Layout } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import openRouterAPI from '../services/openRouterAPI';

const ChatInterface = () => {
  const { state, actions } = useAppContext();
  const [inputMessage, setInputMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTabModel, setActiveTabModel] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  // Auto-load most recent conversation if no current messages
  useEffect(() => {
    if (state.messages.length === 0 && state.conversations.length > 0 && !state.currentConversation) {
      const mostRecent = state.conversations[0]; // Conversations are sorted by most recent first
      if (mostRecent && mostRecent.messages && mostRecent.messages.length > 0) {
        actions.loadConversation(mostRecent.id);
      }
    }
  }, [state.conversations, state.messages.length, state.currentConversation, actions]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || !state.selectedModels.length || isGenerating) {
      if (!state.isApiKeyValid) {
        actions.showError('Please enter a valid API key first');
        return;
      }
      if (!state.selectedModels.length) {
        actions.showError('Please select at least one model');
        return;
      }
      if (!inputMessage.trim()) {
        actions.showError('Please enter a message');
        return;
      }
      return;
    }

    const userMessage = {
      id: uuidv4(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: Date.now()
    };

    // Add user message
    actions.addMessage(userMessage);
    
    // Immediately save the conversation with the user message
    setTimeout(() => {
      actions.saveCurrentConversation();
    }, 100);
    
    // Create assistant message placeholders
    const assistantMessages = state.selectedModels.map(modelId => ({
      id: uuidv4(),
      role: 'assistant',
      model: modelId,
      content: '',
      loading: true,
      timestamp: Date.now()
    }));

    assistantMessages.forEach(msg => actions.addMessage(msg));
    
    setInputMessage('');
    setIsGenerating(true);
    
    try {
      // Prepare conversation history for API
      const conversationHistory = [...state.messages, userMessage].filter(msg => 
        msg.role === 'user' || (msg.role === 'assistant' && msg.content && !msg.error)
      ).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      console.log('Sending to models:', state.selectedModels);
      console.log('Conversation history:', conversationHistory);

      // Get responses from all selected models
      const responses = await openRouterAPI.getCombinedCompletions(
        state.selectedModels,
        conversationHistory,
        {
          temperature: state.userPreferences.defaultTemperature,
          maxTokens: state.userPreferences.defaultMaxTokens
        }
      );

      console.log('Received responses:', responses);

      // Update each message with the response
      responses.forEach((response, index) => {
        const messageId = assistantMessages[index].id;
        actions.updateMessage(messageId, {
          content: response.content,
          loading: false,
          success: response.success,
          error: response.error,
          usage: response.usage
        });
      });

      // Immediately save conversation after responses are received
      setTimeout(() => {
        actions.saveCurrentConversation();
        console.log('Conversation automatically saved to history');
      }, 500);

      // Additional auto-save backup if enabled
      if (state.userPreferences.autoSave) {
        setTimeout(() => {
          actions.saveCurrentConversation();
        }, 2000);
      }

    } catch (error) {
      console.error('Error generating responses:', error);
      
      // Update all messages with error
      assistantMessages.forEach(msg => {
        actions.updateMessage(msg.id, {
          content: `Error: ${error.message}`,
          loading: false,
          success: false,
          error: error.message
        });
      });
      
      actions.showError('Failed to generate responses: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // On mobile, require explicit send button tap for better UX
      if (window.innerWidth >= 768) {
        handleSubmit(e);
      }
    }
  };

  const copyToClipboard = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      actions.showSuccess('Copied to clipboard!');
    } catch (error) {
      actions.showError('Failed to copy to clipboard');
    }
  };

  const retryMessage = async (messageId) => {
    const message = state.messages.find(m => m.id === messageId);
    if (!message || !message.model) return;

    actions.updateMessage(messageId, {
      loading: true,
      content: '',
      error: null
    });

    try {
      const conversationHistory = state.messages
        .filter(m => m.role === 'user' || (m.role === 'assistant' && m.success))
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));

      const response = await openRouterAPI.getChatCompletion(
        message.model,
        conversationHistory,
        {
          temperature: state.userPreferences.defaultTemperature,
          maxTokens: state.userPreferences.defaultMaxTokens
        }
      );

      actions.updateMessage(messageId, {
        content: response.content,
        loading: false,
        success: response.success,
        error: response.error,
        usage: response.usage
      });

    } catch (error) {
      actions.updateMessage(messageId, {
        content: `Error: ${error.message}`,
        loading: false,
        success: false,
        error: error.message
      });
    }
  };

  const getModelName = (modelId) => {
    const model = state.availableModels.find(m => m.id === modelId);
    return model ? model.name : modelId.split('/').pop();
  };

  const renderModelCard = (message, layout = 'default') => {
    const model = state.availableModels.find(m => m.id === message.model);
    const isTabbed = layout === 'tabbed';
    const isStacked = layout === 'stacked';
    const isSideBySide = layout === 'side-by-side';
    
    return (
      <div key={message.id} className={`model-response-card ${
        isTabbed ? '' : 
        isStacked ? 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-300' :
        isSideBySide ? 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] h-full flex flex-col' :
        'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]'
      }`}>
        {/* Model Header */}
        {!isTabbed && (
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-t-xl flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  model?.isFree ? 'bg-green-500' : 'bg-blue-500'
                }`}></div>
                <span className={`font-semibold text-purple-700 dark:text-purple-300 ${
                  isSideBySide ? 'text-sm' : 'text-sm'
                }`}>
                  {getModelName(message.model)}
                </span>
                {model && (
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    model.isFree 
                      ? 'bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
                      : 'bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800'
                  }`}>
                    <span>{model.isFree ? 'Free' : 'Paid'}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {message.usage && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                    {message.usage.total_tokens} tokens
                  </span>
                )}
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        )}
        
        {/* Model Content */}
        <div className={`model-content ${isTabbed ? 'p-6' : isSideBySide ? 'p-5 flex-1 flex flex-col' : 'p-5'}`}>
          {message.loading ? (
            <div className="flex items-center justify-center gap-3 text-gray-500 dark:text-gray-400 py-8">
              <Loader className="w-5 h-5 animate-spin" />
              <span className="text-sm font-medium">Generating response...</span>
            </div>
          ) : (
            <div className={isSideBySide ? 'flex flex-col h-full' : ''}>
              <div className={`response-text whitespace-pre-wrap leading-relaxed ${
                message.success === false 
                  ? 'text-red-600 dark:text-red-400' 
                  : 'text-gray-800 dark:text-gray-200'
              } ${isTabbed ? 'text-base' : isSideBySide ? 'text-sm flex-1 overflow-auto' : 'text-sm'}`}>
                {message.content}
              </div>
              
              {message.content && !message.error && (
                <div className={`flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-700 ${
                  isSideBySide ? 'mt-auto' : 'mt-4'
                }`}>
                  <button
                    onClick={() => copyToClipboard(message.content)}
                    className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors 
                      px-3 py-1.5 rounded-md hover:bg-purple-50 dark:hover:bg-purple-900/30 border border-transparent hover:border-purple-200 dark:hover:border-purple-800"
                  >
                    <Copy className="w-3 h-3" />
                    <span className="font-medium">Copy</span>
                  </button>
                  
                  <button
                    onClick={() => retryMessage(message.id)}
                    className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors 
                      px-3 py-1.5 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30 border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span className="font-medium">Retry</span>
                  </button>
                </div>
              )}
              
              {message.error && (
                <div className={`pt-4 border-t border-red-200 dark:border-red-800 ${
                  isSideBySide ? 'mt-auto' : 'mt-4'
                }`}>
                  <button
                    onClick={() => retryMessage(message.id)}
                    className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors 
                      px-3 py-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 border border-transparent hover:border-red-200 dark:hover:border-red-800"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span className="font-medium">Retry</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const canSubmit = inputMessage.trim() && state.selectedModels.length > 0 && !isGenerating && state.isApiKeyValid;

  return (
    <div className="chat-interface">
      {/* Messages Area - Perfect Scrolling */}
      <div className="messages-container">
        {state.messages.length === 0 ? (
          <div className="empty-state">
            <div className="text-gray-400 text-sm md:text-lg mb-4">
              👋 Welcome! {state.conversations.length > 0 ? 'Continue your conversation or start a new one' : 'Start a conversation with AI models'}
            </div>
            <div className="text-gray-500 text-xs md:text-sm px-2 mb-6">
              {!state.isApiKeyValid && '⚠️ Please enter your API key first'}
              {state.isApiKeyValid && state.selectedModels.length === 0 && '🔧 Select models to get started'}
              {state.isApiKeyValid && state.selectedModels.length > 0 && (
                state.conversations.length > 0 
                  ? '💬 Your conversation history is automatically saved. Type your message below to continue.'
                  : '🚀 Type your message below to start your first conversation'
              )}
            </div>
            
            {/* Quick Demo Prompts */}
            {state.isApiKeyValid && state.selectedModels.length > 0 && (
              <div className="max-w-md mx-auto">
                <p className="text-sm text-gray-600 mb-3">Try these sample prompts:</p>
                <div className="space-y-2">
                  {[
                    "Explain quantum computing in simple terms",
                    "Write a creative story about AI",
                    "Compare React vs Vue.js",
                    "Solve this math problem: 2x + 5 = 15"
                  ].map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => setInputMessage(prompt)}
                      className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm 
                        transition-colors border border-blue-200 hover:border-blue-300"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Settings Reminder */}
            {state.isApiKeyValid && state.selectedModels.length === 0 && (
              <div className="max-w-md mx-auto">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                  <h3 className="font-medium text-purple-900 mb-2">No Models Selected</h3>
                  <p className="text-sm text-purple-700 mb-3">
                    Click the Settings button in the header to select AI models for comparison.
                  </p>
                  <div className="text-xs text-purple-600">
                    ⚙️ Settings → Models → Choose your preferred AI models
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="conversation-flow">
            {(() => {
              // Group messages chronologically: user message followed by assistant responses
              const conversationGroups = [];
              let currentGroup = null;
              
              state.messages.forEach(message => {
                if (message.role === 'user') {
                  // Start a new conversation group
                  if (currentGroup) {
                    conversationGroups.push(currentGroup);
                  }
                  currentGroup = {
                    userMessage: message,
                    assistantMessages: []
                  };
                } else if (message.role === 'assistant' && currentGroup) {
                  // Add assistant message to current group
                  currentGroup.assistantMessages.push(message);
                }
              });
              
              // Add the last group if it exists
              if (currentGroup) {
                conversationGroups.push(currentGroup);
              }
              
              return conversationGroups.map((group, groupIndex) => {
                const comparisonView = state.userPreferences.comparisonView || 'side-by-side';
                const assistantMessages = group.assistantMessages;
                
                return (
                  <div key={group.userMessage.id} className="conversation-group mb-8">
                    {/* User Message */}
                    <div className="user-message-enhanced mb-6 animate-slideIn">
                      <div className="message-header flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="user-avatar w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                            U
                          </div>
                          <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 text-base">
                            You
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                          {new Date(group.userMessage.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      
                      <div className="user-message-card relative overflow-hidden">
                        {/* Glass morphism background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/90 via-indigo-50/80 to-purple-50/90 dark:from-blue-900/30 dark:via-indigo-900/20 dark:to-purple-900/30 backdrop-blur-sm"></div>
                        
                        {/* Border gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-200/60 via-indigo-200/40 to-purple-200/60 dark:from-blue-400/20 dark:via-indigo-400/15 dark:to-purple-400/20 rounded-xl p-0.5">
                          <div className="w-full h-full bg-white/80 dark:bg-gray-900/80 rounded-xl backdrop-blur-sm"></div>
                        </div>
                        
                        {/* Content */}
                        <div className="relative p-4 md:p-6">
                          <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 text-sm md:text-base leading-relaxed font-medium">
                            {group.userMessage.content}
                          </div>
                          
                          {/* Decorative elements */}
                          <div className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-60 animate-pulse"></div>
                          <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-full opacity-40"></div>
                        </div>
                        
                        {/* Hover glow effect */}
                        <div className="absolute inset-0 opacity-0 hover:opacity-100 bg-gradient-to-br from-blue-400/10 via-indigo-400/5 to-purple-400/10 rounded-xl transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    </div>
                    
                    {/* Assistant Responses */}
                    {assistantMessages.length > 0 && (
                      <div className="assistant-responses-section">
                        {/* Comparison View Header */}
                        {assistantMessages.length > 1 && (
                          <div className="comparison-header flex items-center justify-between mb-6 p-4 rounded-xl border shadow-sm">
                            <div className="flex items-center gap-3">
                              <div className="status-indicator status-info">
                                <span className="text-sm font-semibold gradient-text">
                                  Comparing {assistantMessages.length} Model{assistantMessages.length > 1 ? 's' : ''}
                                </span>
                              </div>
                              <div className="hidden sm:flex items-center gap-2 ml-4">
                                <button
                                  onClick={() => actions.updateUserPreferences({...state.userPreferences, comparisonView: 'side-by-side'})}
                                  className={`view-switcher-button p-2.5 rounded-lg transition-all ${
                                    comparisonView === 'side-by-side' 
                                      ? 'active bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-600 premium-shadow' 
                                      : 'hover:bg-purple-50 dark:hover:bg-purple-900/30 text-gray-500 dark:text-gray-400 border border-transparent'
                                  }`}
                                  title="Side by Side"
                                >
                                  <Grid className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => actions.updateUserPreferences({...state.userPreferences, comparisonView: 'stacked'})}
                                  className={`view-switcher-button p-2.5 rounded-lg transition-all ${
                                    comparisonView === 'stacked' 
                                      ? 'active bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-600 premium-shadow' 
                                      : 'hover:bg-purple-50 dark:hover:bg-purple-900/30 text-gray-500 dark:text-gray-400 border border-transparent'
                                  }`}
                                  title="Stacked"
                                >
                                  <Layers className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => actions.updateUserPreferences({...state.userPreferences, comparisonView: 'tabbed'})}
                                  className={`view-switcher-button p-2.5 rounded-lg transition-all ${
                                    comparisonView === 'tabbed' 
                                      ? 'active bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-600 premium-shadow' 
                                      : 'hover:bg-purple-50 dark:hover:bg-purple-900/30 text-gray-500 dark:text-gray-400 border border-transparent'
                                  }`}
                                  title="Tabbed"
                                >
                                  <Layout className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {comparisonView === 'side-by-side' && <Grid className="w-4 h-4 text-purple-600 dark:text-purple-400 animate-pulse" />}
                              {comparisonView === 'stacked' && <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400 animate-pulse" />}
                              {comparisonView === 'tabbed' && <Layout className="w-4 h-4 text-purple-600 dark:text-purple-400 animate-pulse" />}
                              <span className="text-xs text-purple-600 dark:text-purple-400 capitalize font-semibold">
                                {comparisonView.replace('-', ' ')}
                              </span>
                            </div>
                          </div>
                        )}
                        
                        {/* Render based on comparison view */}
                        {comparisonView === 'side-by-side' && (
                          <div className="comparison-view-side-by-side">
                            <div className={`comparison-grid view-transition ${
                              assistantMessages.length === 1 ? 'grid-cols-1' :
                              assistantMessages.length === 2 ? 'grid-cols-1 lg:grid-cols-2' :
                              assistantMessages.length === 3 ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' :
                              'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'
                            }`}>
                              {assistantMessages.map(message => renderModelCard(message, 'side-by-side'))}
                            </div>
                          </div>
                        )}
                        
                        {comparisonView === 'stacked' && (
                          <div className="comparison-stacked view-transition">
                            {assistantMessages.map(message => renderModelCard(message, 'stacked'))}
                          </div>
                        )}
                        
                        {comparisonView === 'tabbed' && (
                          <div className="comparison-tabs view-transition">
                            {/* Tab Headers */}
                            <div className="tab-navigation">
                              {assistantMessages.map((message, index) => {
                                const isActive = activeTabModel === message.model || (activeTabModel === null && index === 0);
                                return (
                                  <button
                                    key={message.id}
                                    onClick={() => setActiveTabModel(message.model)}
                                    className={`tab-button ${
                                      isActive ? 'active' : ''
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="truncate max-w-32">{getModelName(message.model)}</span>
                                      {(() => {
                                        const model = state.availableModels.find(m => m.id === message.model);
                                        if (model) {
                                          return (
                                            <div className={`w-2 h-2 rounded-full ${
                                              model.isFree ? 'bg-green-500' : 'bg-blue-500'
                                            }`}></div>
                                          );
                                        }
                                        return null;
                                      })()} 
                                      {message.loading && <Loader className="w-3 h-3 animate-spin" />}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                            
                            {/* Tab Content */}
                            <div className="tab-content">
                              {assistantMessages.map((message, index) => {
                                const isActive = activeTabModel === message.model || (activeTabModel === null && index === 0);
                                return (
                                  <div
                                    key={message.id}
                                    className={`${isActive ? 'block animate-fadeIn' : 'hidden'}`}
                                  >
                                    {renderModelCard(message, 'tabbed')}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              });
            })()}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Professional No-Padding Design */}
      <div className="input-area">
        <form onSubmit={handleSubmit} className="input-container">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                !state.isApiKeyValid ? 'Please enter API key first...' :
                state.selectedModels.length === 0 ? 'Please select models first...' :
                window.innerWidth < 768 ? 'Type your message...' : 'Type your message... (Press Enter to send, Shift+Enter for new line)'
              }
              className="chat-textarea"
              rows={Math.min(Math.max(1, inputMessage.split('\n').length), window.innerWidth < 768 ? 3 : 5)}
              disabled={isGenerating}
            />
          </div>
          
          <button
            type="submit"
            disabled={!canSubmit}
            className="send-button"
          >
            {isGenerating ? (
              <Loader className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
            ) : (
              <Send className="w-4 h-4 md:w-5 md:h-5" />
            )}
            <span className="hidden sm:inline">
              {isGenerating ? 'Sending...' : 'Send'}
            </span>
          </button>
        </form>
        
        {state.selectedModels.length > 0 && (
          <div className="model-status">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="font-medium text-sm">Active models:</span>
              <div className="flex gap-1 flex-wrap">
                {state.selectedModels.map(id => {
                  const model = state.availableModels.find(m => m.id === id);
                  return (
                    <span key={id} className={`model-tag ${
                      model?.isFree ? 'model-tag-free' : 'model-tag-paid'
                    }`}>
                      {model ? model.name : getModelName(id)}
                      {model && (
                        <span className={`status-dot ${
                          model.isFree ? 'status-dot-free' : 'status-dot-paid'
                        }`}></span>
                      )}
                    </span>
                  );
                })}
              </div>
            </div>
            {/* {state.conversations.length > 0 && (
              <div className="conversation-status">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Conversation history: {state.conversations.length} saved conversations</span>
                </div>
                <span>•</span>
                <span>Auto-saved to local storage</span>
              </div>
            )} */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;