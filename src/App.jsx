import React, { useEffect } from 'react';
import { AppProvider, useAppContext } from './contexts/AppContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import APIKeyManager from './components/APIKeyManager';
import './App.css';

function AppContent() {
  const { state, actions } = useAppContext();

  // Auto-clear notifications after 5 seconds
  useEffect(() => {
    if (state.error || state.success) {
      const timer = setTimeout(() => {
        actions.clearNotifications();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [state.error, state.success, actions]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && !state.sidebarOpen) {
        // Auto-open sidebar on desktop if closed
        actions.toggleSidebar();
      }
    };

    const handleTouchMove = (e) => {
      // Prevent body scroll when sidebar is open on mobile
      if (state.sidebarOpen && window.innerWidth < 768) {
        e.preventDefault();
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [state.sidebarOpen, actions]);

  return (
    <div className="app h-screen flex flex-col overflow-hidden mobile-safe-area">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className={`${state.sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 fixed md:relative z-30 w-80 md:w-80 h-full transition-transform duration-300 ease-in-out 
          mobile-safe-area`}>
          <Sidebar />
        </div>
        
        {/* Sidebar Overlay for mobile */}
        {state.sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={actions.toggleSidebar}
          />
        )}
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {!state.isApiKeyValid ? (
            /* API Key Setup */
            <div className="flex-1 flex items-center justify-center p-4 md:p-8">
              <div className="max-w-md w-full">
                <APIKeyManager />
              </div>
            </div>
          ) : (
            /* Main Application */
            <div className="flex flex-1 overflow-hidden">
              {/* Chat Interface - Full Width */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <ChatInterface />
              </div>
            </div>
          )}
        </div>
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
