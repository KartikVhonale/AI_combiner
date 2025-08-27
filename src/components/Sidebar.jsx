import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import memoryManager from '../services/memoryManager';
import { 
  MessageSquare, 
  Plus, 
  Trash2, 
  Download, 
  Upload, 
  Settings, 
  X,
  Search,
  Calendar
} from 'lucide-react';

const Sidebar = () => {
  const { state, actions } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const filteredConversations = state.conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewConversation = () => {
    actions.startNewConversation();
    if (window.innerWidth < 768) {
      actions.toggleSidebar();
    }
  };

  const handleCloseSidebar = () => {
    // Save desktop sidebar preference when closed
    if (window.innerWidth >= 768) {
      localStorage.setItem('sidebarOpenDesktop', 'false');
    }
    actions.toggleSidebar();
  };

  const handleLoadConversation = (conversationId) => {
    actions.loadConversation(conversationId);
    if (window.innerWidth < 768) {
      actions.toggleSidebar();
    }
  };

  const handleDeleteConversation = (conversationId, e) => {
    e.stopPropagation();
    setShowDeleteConfirm(conversationId);
  };

  const confirmDelete = (conversationId) => {
    actions.deleteConversation(conversationId);
    setShowDeleteConfirm(null);
  };

  const handleExportData = () => {
    const data = memoryManager.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-combiner-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        const success = memoryManager.importData(data);
        if (success) {
          actions.showSuccess('Data imported successfully!');
          // Reload conversations
          const conversations = memoryManager.getConversations();
          actions.setConversations(conversations);
        } else {
          actions.showError('Failed to import data');
        }
      } catch (error) {
        actions.showError('Invalid file format');
      }
    };
    reader.readAsText(file);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="sidebar h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col relative z-40">
      {/* Header */}
      <div className="sidebar-header p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">AI Combiner</h2>
          
          {/* Close Button - Visible on all screen sizes */}
          <button
            onClick={handleCloseSidebar}
            className="p-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 
              bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg 
              hover:border-red-300 dark:hover:border-red-500 transition-all duration-200 
              shadow-sm hover:shadow-md touch-manipulation min-w-[44px] min-h-[44px] 
              flex items-center justify-center group"
            aria-label="Close sidebar"
            title="Close Sidebar"
          >
            <X className="w-6 h-6 font-bold stroke-[2.5] group-hover:scale-110 transition-transform" />
          </button>
        </div>
        
        <button
          onClick={handleNewConversation}
          className="w-full flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Conversation
        </button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
              focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm
              bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
              placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
            {searchTerm ? 'No conversations found.' : 'No conversations yet.'}
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => handleLoadConversation(conversation.id)}
                className={`conversation-item p-3 rounded-lg cursor-pointer transition-all duration-200 group ${
                  state.currentConversation?.id === conversation.id
                    ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 border border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageSquare className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {conversation.title}
                      </h4>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(conversation.timestamp)}</span>
                    </div>
                    
                    {conversation.selectedModels && conversation.selectedModels.length > 0 && (
                      <div className="text-xs text-gray-400 dark:text-gray-500 truncate">
                        {conversation.selectedModels.length} model{conversation.selectedModels.length === 1 ? '' : 's'}
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={(e) => handleDeleteConversation(conversation.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-all flex-shrink-0 rounded"
                    title="Delete conversation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="sidebar-footer p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        <div className="flex gap-2">
          <button
            onClick={handleExportData}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm 
              text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 
              rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            title="Export conversations"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          
          <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm 
            text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 
            rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            title="Import conversations"
          >
            <Upload className="w-4 h-4" />
            Import
            <input
              type="file"
              accept=".json"
              onChange={handleImportData}
              className="hidden"
            />
          </label>
        </div>
        
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          {state.conversations.length} conversation{state.conversations.length === 1 ? '' : 's'}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full border border-gray-200 dark:border-gray-700 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Delete Conversation
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              Are you sure you want to delete this conversation? This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 
                  rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(showDeleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 
                  text-white rounded-md transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;