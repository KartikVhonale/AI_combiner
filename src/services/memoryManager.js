import { v4 as uuidv4 } from 'uuid';

class MemoryManager {
  constructor() {
    this.storageKeys = {
      conversations: 'ai_combiner_conversations',
      userPreferences: 'ai_combiner_preferences',
      apiKey: 'ai_combiner_api_key',
      selectedModels: 'ai_combiner_selected_models'
    };
  }

  // Conversation Management
  saveConversation(conversation) {
    const conversations = this.getConversations();
    const conversationWithId = {
      id: conversation.id || uuidv4(),
      title: conversation.title || this.generateTitle(conversation.messages),
      messages: conversation.messages,
      selectedModels: conversation.selectedModels,
      timestamp: conversation.timestamp || Date.now(),
      lastUpdated: Date.now(),
      messageCount: conversation.messages ? conversation.messages.length : 0
    };
    
    const existingIndex = conversations.findIndex(c => c.id === conversationWithId.id);
    if (existingIndex >= 0) {
      // Update existing conversation but keep original timestamp
      conversationWithId.timestamp = conversations[existingIndex].timestamp;
      conversations[existingIndex] = conversationWithId;
    } else {
      conversations.unshift(conversationWithId); // Add to beginning
    }
    
    // Sort by last updated (most recent first)
    conversations.sort((a, b) => b.lastUpdated - a.lastUpdated);
    
    // Keep only last 100 conversations
    const trimmedConversations = conversations.slice(0, 100);
    
    localStorage.setItem(this.storageKeys.conversations, JSON.stringify(trimmedConversations));
    return conversationWithId;
  }

  getConversations() {
    try {
      const conversations = localStorage.getItem(this.storageKeys.conversations);
      return conversations ? JSON.parse(conversations) : [];
    } catch (error) {
      console.error('Error loading conversations:', error);
      return [];
    }
  }

  getConversation(id) {
    const conversations = this.getConversations();
    return conversations.find(c => c.id === id);
  }

  deleteConversation(id) {
    const conversations = this.getConversations();
    const filtered = conversations.filter(c => c.id !== id);
    localStorage.setItem(this.storageKeys.conversations, JSON.stringify(filtered));
  }

  clearAllConversations() {
    localStorage.removeItem(this.storageKeys.conversations);
  }

  // Generate a title from the first user message
  generateTitle(messages) {
    const userMessage = messages.find(m => m.role === 'user');
    if (userMessage && userMessage.content) {
      const content = userMessage.content.trim();
      if (content.length <= 50) {
        return content;
      }
      return content.substring(0, 50) + '...';
    }
    return 'New Conversation';
  }

  // User Preferences Management
  saveUserPreferences(preferences) {
    const currentPreferences = this.getUserPreferences();
    const updatedPreferences = { ...currentPreferences, ...preferences };
    localStorage.setItem(this.storageKeys.userPreferences, JSON.stringify(updatedPreferences));
  }

  getUserPreferences() {
    try {
      const preferences = localStorage.getItem(this.storageKeys.userPreferences);
      return preferences ? JSON.parse(preferences) : {
        theme: 'light',
        defaultTemperature: 0.7,
        defaultMaxTokens: 1000,
        autoSave: true,
        showModelInfo: true,
        comparisonView: 'side-by-side'
      };
    } catch (error) {
      console.error('Error loading user preferences:', error);
      return {
        theme: 'light',
        defaultTemperature: 0.7,
        defaultMaxTokens: 1000,
        autoSave: true,
        showModelInfo: true,
        comparisonView: 'side-by-side'
      };
    }
  }

  // API Key Management (encrypted storage would be better in production)
  saveApiKey(apiKey) {
    if (apiKey) {
      // In production, this should be encrypted
      localStorage.setItem(this.storageKeys.apiKey, btoa(apiKey));
    } else {
      localStorage.removeItem(this.storageKeys.apiKey);
    }
  }

  getApiKey() {
    try {
      const encodedKey = localStorage.getItem(this.storageKeys.apiKey);
      return encodedKey ? atob(encodedKey) : null;
    } catch (error) {
      console.error('Error retrieving API key:', error);
      return null;
    }
  }

  clearApiKey() {
    localStorage.removeItem(this.storageKeys.apiKey);
  }

  // Selected Models Management
  saveSelectedModels(modelIds) {
    localStorage.setItem(this.storageKeys.selectedModels, JSON.stringify(modelIds));
  }

  getSelectedModels() {
    try {
      const models = localStorage.getItem(this.storageKeys.selectedModels);
      return models ? JSON.parse(models) : [];
    } catch (error) {
      console.error('Error loading selected models:', error);
      return [];
    }
  }

  // Export/Import functionality
  exportData() {
    return {
      conversations: this.getConversations(),
      preferences: this.getUserPreferences(),
      selectedModels: this.getSelectedModels(),
      exportDate: new Date().toISOString()
    };
  }

  importData(data) {
    try {
      if (data.conversations) {
        localStorage.setItem(this.storageKeys.conversations, JSON.stringify(data.conversations));
      }
      if (data.preferences) {
        localStorage.setItem(this.storageKeys.userPreferences, JSON.stringify(data.preferences));
      }
      if (data.selectedModels) {
        localStorage.setItem(this.storageKeys.selectedModels, JSON.stringify(data.selectedModels));
      }
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  // Storage usage information
  getStorageInfo() {
    try {
      const conversations = JSON.stringify(this.getConversations());
      const preferences = JSON.stringify(this.getUserPreferences());
      const selectedModels = JSON.stringify(this.getSelectedModels());
      
      return {
        conversationsSize: new Blob([conversations]).size,
        preferencesSize: new Blob([preferences]).size,
        selectedModelsSize: new Blob([selectedModels]).size,
        totalConversations: this.getConversations().length
      };
    } catch (error) {
      console.error('Error calculating storage info:', error);
      return {
        conversationsSize: 0,
        preferencesSize: 0,
        selectedModelsSize: 0,
        totalConversations: 0
      };
    }
  }

  // Clear all data
  clearAllData() {
    Object.values(this.storageKeys).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}

export default new MemoryManager();