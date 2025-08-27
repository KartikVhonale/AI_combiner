import React, { useEffect, useState } from 'react';
import { AppProvider, useAppContext } from './contexts/AppContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { MessageSquare } from 'lucide-react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import APIKeyManager from './components/APIKeyManager';
import './App.css';

function AppContent() {
  const { state, actions } = useAppContext();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [chatVisible, setChatVisible] = useState(true);
  const [isResizing, setIsResizing] = useState(false);
  const [manualToggle, setManualToggle] = useState(false);

  // Auto-clear notifications after 5 seconds
  useEffect(() => {
    if (state.error || state.success) {
      const timer = setTimeout(() => {
        actions.clearNotifications();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [state.error, state.success, actions]);

  // Professional responsive sidebar management
  useEffect(() => {
    let resizeTimeout;
    
    const handleResize = () => {
      // Debounce resize events to prevent rapid toggles
      clearTimeout(resizeTimeout);
      setIsResizing(true);
      
      resizeTimeout = setTimeout(() => {
        const newIsMobile = window.innerWidth < 768;
        const oldIsMobile = isMobile;
        setIsMobile(newIsMobile);
        setIsResizing(false);
        
        // Only handle desktop sidebar preferences when transitioning between desktop/mobile
        if (oldIsMobile !== newIsMobile && !manualToggle) {
          if (!newIsMobile && !state.sidebarOpen) {
            // Transitioning to desktop: restore desktop preference
            const desktopPreference = localStorage.getItem('sidebarOpenDesktop');
            if (desktopPreference !== 'false') {
              actions.toggleSidebar();
            }
          }
          // Note: We don't auto-close mobile sidebar when transitioning to mobile
        }
        
        // Reset manual toggle flag after resize handling
        if (manualToggle) {
          setTimeout(() => setManualToggle(false), 300);
        }
      }, 150); // 150ms debounce
    };

    // Initial setup - Only for desktop
    if (!isMobile) {
      // Desktop: Load saved preference or default to open
      const savedPreference = localStorage.getItem('sidebarOpenDesktop');
      if (savedPreference === null) {
        // First visit: open by default on desktop
        localStorage.setItem('sidebarOpenDesktop', 'true');
        if (!state.sidebarOpen) {
          actions.toggleSidebar();
        }
      } else if (savedPreference === 'true' && !state.sidebarOpen) {
        actions.toggleSidebar();
      }
    }

    // Prevent scroll when mobile sidebar is open
    const preventScroll = (e) => {
      if (isMobile && state.sidebarOpen) {
        e.preventDefault();
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('touchmove', preventScroll, { passive: false });

    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('touchmove', preventScroll);
    };
  }, [isMobile, actions, state.sidebarOpen]); // Re-added state.sidebarOpen dependency but improved logic

  // Listen for mobile chat toggle events
  useEffect(() => {
    const handleChatToggle = (event) => {
      if (isMobile) {
        setChatVisible(!event.detail.hidden);
      }
    };

    const handleManualSidebarToggle = () => {
      setManualToggle(true);
    };

    window.addEventListener('toggleChat', handleChatToggle);
    window.addEventListener('manualSidebarToggle', handleManualSidebarToggle);
    
    return () => {
      window.removeEventListener('toggleChat', handleChatToggle);
      window.removeEventListener('manualSidebarToggle', handleManualSidebarToggle);
    };
  }, [isMobile, chatVisible]);

  // Manage body scroll for mobile sidebar
  useEffect(() => {
    if (isMobile && state.sidebarOpen) {
      document.body.classList.add('mobile-sidebar-open');
    } else {
      document.body.classList.remove('mobile-sidebar-open');
    }
    
    return () => {
      document.body.classList.remove('mobile-sidebar-open');
    };
  }, [isMobile, state.sidebarOpen]);

  return (
    <div className="app">
      {/* Header - Professional fixed header */}
      <Header />
      
      {/* Main Application Layout - NO PADDING */}
      <div className="main-layout">
        {/* Desktop Sidebar - Only visible on desktop */}
        <aside className={`desktop-sidebar ${
          state.sidebarOpen ? 'sidebar-open' : 'sidebar-closed'
        }`}>
          {state.sidebarOpen && <Sidebar />}
        </aside>
        
        {/* Main Content - Chat Interface Container - NO PADDING */}
        <main className={`main-content ${
          isMobile && !chatVisible ? 'chat-hidden' : ''
        }`}>
          {!state.isApiKeyValid ? (
            <div className="api-setup-container">
              <APIKeyManager />
            </div>
          ) : (
            <>  
              {(!isMobile || chatVisible) && <ChatInterface />}
              {isMobile && !chatVisible && (
                <div className="mobile-chat-hidden-message">
                  <div className="text-center py-8 px-4">
                    <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Chat Hidden
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Tap the chat icon in the header to show the chat interface
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
        
        {/* Mobile Sidebar Overlay */}
        {isMobile && state.sidebarOpen && !isResizing && (
          <div className="mobile-sidebar-overlay">
            {/* Backdrop */}
            <div 
              className="sidebar-backdrop"
              onClick={(e) => {
                e.stopPropagation();
                actions.toggleSidebar();
              }}
              aria-label="Close sidebar"
            />
            
            {/* Mobile Sidebar Panel */}
            <aside className="mobile-sidebar-panel">
              <Sidebar />
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
