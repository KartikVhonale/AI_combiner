import React, { createContext, useContext, useReducer, useEffect } from 'react';
import openRouterAPI from '../services/openRouterAPI';
import memoryManager from '../services/memoryManager';

// Initial state
const initialState = {
  // API and Models
  apiKey: null,
  isApiKeyValid: false,
  availableModels: [],
  selectedModels: [],
  isLoadingModels: false,
  
  // Current conversation
  currentConversation: null,
  messages: [],
  isLoading: false,
  
  // Conversations history
  conversations: [],
  
  // User preferences
  userPreferences: {
    theme: 'light',
    defaultTemperature: 0.7,
    defaultMaxTokens: 1000,
    autoSave: true,
    showModelInfo: true,
    comparisonView: 'side-by-side'
  },
  
  // UI state
  sidebarOpen: false,
  error: null,
  success: null
};

// Action types
const actionTypes = {
  // API and Models
  SET_API_KEY: 'SET_API_KEY',
  SET_API_KEY_VALID: 'SET_API_KEY_VALID',
  SET_AVAILABLE_MODELS: 'SET_AVAILABLE_MODELS',
  SET_SELECTED_MODELS: 'SET_SELECTED_MODELS',
  SET_LOADING_MODELS: 'SET_LOADING_MODELS',
  
  // Conversation
  SET_CURRENT_CONVERSATION: 'SET_CURRENT_CONVERSATION',
  SET_MESSAGES: 'SET_MESSAGES',
  ADD_MESSAGE: 'ADD_MESSAGE',
  UPDATE_MESSAGE: 'UPDATE_MESSAGE',
  SET_LOADING: 'SET_LOADING',
  
  // Conversations history
  SET_CONVERSATIONS: 'SET_CONVERSATIONS',
  ADD_CONVERSATION: 'ADD_CONVERSATION',
  UPDATE_CONVERSATION: 'UPDATE_CONVERSATION',
  DELETE_CONVERSATION: 'DELETE_CONVERSATION',
  
  // User preferences
  SET_USER_PREFERENCES: 'SET_USER_PREFERENCES',
  
  // UI state
  SET_SIDEBAR_OPEN: 'SET_SIDEBAR_OPEN',
  SET_ERROR: 'SET_ERROR',
  SET_SUCCESS: 'SET_SUCCESS',
  CLEAR_NOTIFICATIONS: 'CLEAR_NOTIFICATIONS'
};

// Reducer
function appReducer(state, action) {
  switch (action.type) {
    case actionTypes.SET_API_KEY:
      return { ...state, apiKey: action.payload };
      
    case actionTypes.SET_API_KEY_VALID:
      return { ...state, isApiKeyValid: action.payload };
      
    case actionTypes.SET_AVAILABLE_MODELS:
      return { ...state, availableModels: action.payload };
      
    case actionTypes.SET_SELECTED_MODELS:
      return { ...state, selectedModels: action.payload };
      
    case actionTypes.SET_LOADING_MODELS:
      return { ...state, isLoadingModels: action.payload };
      
    case actionTypes.SET_CURRENT_CONVERSATION:
      return { ...state, currentConversation: action.payload };
      
    case actionTypes.SET_MESSAGES:
      return { ...state, messages: action.payload };
      
    case actionTypes.ADD_MESSAGE:
      return { ...state, messages: [...state.messages, action.payload] };
      
    case actionTypes.UPDATE_MESSAGE:
      return {
        ...state,
        messages: state.messages.map(msg =>
          msg.id === action.payload.id ? { ...msg, ...action.payload.updates } : msg
        )
      };
      
    case actionTypes.SET_LOADING:
      return { ...state, isLoading: action.payload };
      
    case actionTypes.SET_CONVERSATIONS:
      return { ...state, conversations: action.payload };
      
    case actionTypes.ADD_CONVERSATION:
      return { ...state, conversations: [action.payload, ...state.conversations] };
      
    case actionTypes.UPDATE_CONVERSATION:
      return {
        ...state,
        conversations: state.conversations.map(conv =>
          conv.id === action.payload.id ? { ...conv, ...action.payload.updates } : conv
        )
      };
      
    case actionTypes.DELETE_CONVERSATION:
      return {
        ...state,
        conversations: state.conversations.filter(conv => conv.id !== action.payload)
      };
      
    case actionTypes.SET_USER_PREFERENCES:
      return { ...state, userPreferences: { ...state.userPreferences, ...action.payload } };
      
    case actionTypes.SET_SIDEBAR_OPEN:
      return { ...state, sidebarOpen: action.payload };
      
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload };
      
    case actionTypes.SET_SUCCESS:
      return { ...state, success: action.payload };
      
    case actionTypes.CLEAR_NOTIFICATIONS:
      return { ...state, error: null, success: null };
      
    default:
      return state;
  }
}

// Create context
const AppContext = createContext();

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Context provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load initial data from memory
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      // Load API key
      const apiKey = memoryManager.getApiKey();
      if (apiKey) {
        dispatch({ type: actionTypes.SET_API_KEY, payload: apiKey });
        openRouterAPI.setApiKey(apiKey);
        
        // Validate API key and load models
        const isValid = await openRouterAPI.validateApiKey(apiKey);
        dispatch({ type: actionTypes.SET_API_KEY_VALID, payload: isValid });
        
        if (isValid) {
          await loadModels();
        }
      }
      
      // Load user preferences
      const preferences = memoryManager.getUserPreferences();
      dispatch({ type: actionTypes.SET_USER_PREFERENCES, payload: preferences });
      
      // Load selected models
      const selectedModels = memoryManager.getSelectedModels();
      dispatch({ type: actionTypes.SET_SELECTED_MODELS, payload: selectedModels });
      
      // Load conversations
      const conversations = memoryManager.getConversations();
      dispatch({ type: actionTypes.SET_CONVERSATIONS, payload: conversations });
      
    } catch (error) {
      console.error('Error loading initial data:', error);
      dispatch({ type: actionTypes.SET_ERROR, payload: 'Failed to load initial data' });
    }
  };

  const loadModels = async () => {
    try {
      dispatch({ type: actionTypes.SET_LOADING_MODELS, payload: true });
      const models = await openRouterAPI.getModels();
      dispatch({ type: actionTypes.SET_AVAILABLE_MODELS, payload: models });
    } catch (error) {
      console.error('Error loading models:', error);
      dispatch({ type: actionTypes.SET_ERROR, payload: 'Failed to load models' });
    } finally {
      dispatch({ type: actionTypes.SET_LOADING_MODELS, payload: false });
    }
  };

  // Actions
  const actions = {
    // API Key management
    setApiKey: async (apiKey) => {
      try {
        dispatch({ type: actionTypes.SET_API_KEY, payload: apiKey });
        openRouterAPI.setApiKey(apiKey);
        memoryManager.saveApiKey(apiKey);
        
        if (apiKey) {
          const isValid = await openRouterAPI.validateApiKey(apiKey);
          dispatch({ type: actionTypes.SET_API_KEY_VALID, payload: isValid });
          
          if (isValid) {
            await loadModels();
            dispatch({ type: actionTypes.SET_SUCCESS, payload: 'API key validated successfully!' });
          } else {
            dispatch({ type: actionTypes.SET_ERROR, payload: 'Invalid API key' });
          }
        } else {
          dispatch({ type: actionTypes.SET_API_KEY_VALID, payload: false });
          dispatch({ type: actionTypes.SET_AVAILABLE_MODELS, payload: [] });
        }
      } catch (error) {
        console.error('Error setting API key:', error);
        dispatch({ type: actionTypes.SET_ERROR, payload: 'Error validating API key' });
      }
    },

    // Model selection
    setSelectedModels: (modelIds) => {
      dispatch({ type: actionTypes.SET_SELECTED_MODELS, payload: modelIds });
      memoryManager.saveSelectedModels(modelIds);
    },

    // Conversation management
    startNewConversation: () => {
      dispatch({ type: actionTypes.SET_CURRENT_CONVERSATION, payload: null });
      dispatch({ type: actionTypes.SET_MESSAGES, payload: [] });
    },

    loadConversation: (conversationId) => {
      const conversation = memoryManager.getConversation(conversationId);
      if (conversation) {
        dispatch({ type: actionTypes.SET_CURRENT_CONVERSATION, payload: conversation });
        dispatch({ type: actionTypes.SET_MESSAGES, payload: conversation.messages || [] });
        dispatch({ type: actionTypes.SET_SELECTED_MODELS, payload: conversation.selectedModels || [] });
      }
    },

    saveCurrentConversation: () => {
      if (state.messages.length === 0) return null;
      
      const conversation = {
        id: state.currentConversation?.id,
        messages: state.messages,
        selectedModels: state.selectedModels,
        timestamp: state.currentConversation?.timestamp || Date.now()
      };
      
      const savedConversation = memoryManager.saveConversation(conversation);
      dispatch({ type: actionTypes.SET_CURRENT_CONVERSATION, payload: savedConversation });
      
      // Update conversations list
      const conversations = memoryManager.getConversations();
      dispatch({ type: actionTypes.SET_CONVERSATIONS, payload: conversations });
      
      return savedConversation;
    },

    deleteConversation: (conversationId) => {
      memoryManager.deleteConversation(conversationId);
      const conversations = memoryManager.getConversations();
      dispatch({ type: actionTypes.SET_CONVERSATIONS, payload: conversations });
      
      if (state.currentConversation?.id === conversationId) {
        actions.startNewConversation();
      }
    },

    // User preferences
    updateUserPreferences: (preferences) => {
      dispatch({ type: actionTypes.SET_USER_PREFERENCES, payload: preferences });
      memoryManager.saveUserPreferences(preferences);
    },

    // UI actions
    toggleSidebar: () => {
      dispatch({ type: actionTypes.SET_SIDEBAR_OPEN, payload: !state.sidebarOpen });
    },

    showError: (message) => {
      dispatch({ type: actionTypes.SET_ERROR, payload: message });
    },

    showSuccess: (message) => {
      dispatch({ type: actionTypes.SET_SUCCESS, payload: message });
    },

    clearNotifications: () => {
      dispatch({ type: actionTypes.CLEAR_NOTIFICATIONS });
    },

    // Add message
    addMessage: (message) => {
      dispatch({ type: actionTypes.ADD_MESSAGE, payload: message });
    },

    // Update message
    updateMessage: (id, updates) => {
      dispatch({ type: actionTypes.UPDATE_MESSAGE, payload: { id, updates } });
    },

    // Set conversations (for import functionality)
    setConversations: (conversations) => {
      dispatch({ type: actionTypes.SET_CONVERSATIONS, payload: conversations });
    },

    // Set loading state
    setLoading: (loading) => {
      dispatch({ type: actionTypes.SET_LOADING, payload: loading });
    }
  };

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
};