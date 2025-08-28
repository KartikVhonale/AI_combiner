import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { ChevronDown, Check, X, Brain, Loader, Crown, Gift, DollarSign, Filter } from 'lucide-react';
import { createPortal } from 'react-dom';

const ModelSelector = () => {
  const { state, actions } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [pricingFilter, setPricingFilter] = useState('all'); // 'all', 'free', 'paid'
  const [groupByProvider, setGroupByProvider] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef(null);

  // Mobile detection effect
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 767 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const formatPrice = (price) => {
    if (price === 0) return 'Free';
    if (price < 0.000001) return '< $0.000001';
    return `$${(price * 1000000).toFixed(2)}/M`;
  };

  const getPriceColor = (isFree) => {
    return isFree ? 'text-green-600' : 'text-blue-600';
  };

  const getPriceIcon = (isFree) => {
    return isFree ? <Gift className="w-3 h-3" /> : <Crown className="w-3 h-3" />;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const handleTouchStart = (event) => {
      // Close dropdown on mobile when touching backdrop
      if (isOpen && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (isMobile && event.target.closest('.model-selector')) {
          setIsOpen(false);
        }
      }
    };

    // Prevent body scroll on mobile when dropdown is open
    if (isOpen && isMobile) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      document.removeEventListener('touchstart', handleTouchStart);
      
      // Clean up body styles
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isOpen, isMobile]);

  const filteredModels = state.availableModels.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (model.category && model.category.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesPricingFilter = 
      pricingFilter === 'all' || 
      (pricingFilter === 'free' && model.isFree) ||
      (pricingFilter === 'paid' && !model.isFree);
    
    return matchesSearch && matchesPricingFilter;
  });

  // Group models by provider if enabled, otherwise group by pricing tier
  const groupedModels = groupByProvider ? 
    filteredModels.reduce((acc, model) => {
      const provider = model.category || 'Other';
      if (!acc[provider]) acc[provider] = [];
      acc[provider].push(model);
      return acc;
    }, {}) : 
    {
      'Free Models': filteredModels.filter(m => m.isFree),
      'Paid Models': filteredModels.filter(m => !m.isFree)
    };

  const handleModelToggle = (modelId) => {
    const currentSelected = [...state.selectedModels];
    const index = currentSelected.indexOf(modelId);
    
    if (index > -1) {
      currentSelected.splice(index, 1);
    } else {
      currentSelected.push(modelId);
    }
    
    actions.setSelectedModels(currentSelected);
  };

  const removeModel = (modelId) => {
    const currentSelected = state.selectedModels.filter(id => id !== modelId);
    actions.setSelectedModels(currentSelected);
  };

  const clearAllModels = () => {
    actions.setSelectedModels([]);
  };

  const getModelName = (modelId) => {
    const model = state.availableModels.find(m => m.id === modelId);
    return model ? model.name : modelId.split('/').pop();
  };

  if (!state.isApiKeyValid) {
    return (
      <div className="model-selector-disabled p-3 md:p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex items-center gap-2 text-gray-500">
          <Brain className="w-4 h-4 md:w-5 md:h-5" />
          <span className="text-sm md:text-base">Please enter a valid API key to select models</span>
        </div>
      </div>
    );
  }

  return (
    <div className="model-selector">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
          <h3 className="text-base md:text-lg font-semibold">Select Models</h3>
          {state.isLoadingModels && <Loader className="w-3 h-3 md:w-4 md:h-4 animate-spin" />}
        </div>
        
        <div className="flex items-center gap-2">
          {/* Pricing Filter Dropdown */}
          <div className="relative">
            <select
              value={pricingFilter}
              onChange={(e) => setPricingFilter(e.target.value)}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-colors bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300 focus:ring-2 focus:ring-purple-500 cursor-pointer"
            >
              <option value="all">All Models</option>
              <option value="free">🎁 Free Only</option>
              <option value="paid">👑 Paid Only</option>
            </select>
          </div>
          
          {state.selectedModels.length > 0 && (
            <button
              onClick={clearAllModels}
              className="text-xs md:text-sm text-red-600 hover:text-red-800 transition-colors p-1 rounded"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Selected Models Display */}
      {state.selectedModels.length > 0 && (
        <div className="selected-models mb-4">
          <div className="flex flex-wrap gap-1 md:gap-2">
            {state.selectedModels.map(modelId => {
              const model = state.availableModels.find(m => m.id === modelId);
              return (
                <div
                  key={modelId}
                  className={`flex items-center gap-1 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm ${
                    model?.isFree 
                      ? 'bg-green-100 text-green-800 border border-green-200' 
                      : 'bg-blue-100 text-blue-800 border border-blue-200'
                  }`}
                >
                  {model?.isFree ? <Gift className="w-3 h-3" /> : <Crown className="w-3 h-3" />}
                  <span className="truncate max-w-24 md:max-w-32">{getModelName(modelId)}</span>
                  <button
                    onClick={() => removeModel(modelId)}
                    className={`ml-1 rounded-full p-0.5 transition-colors ${
                      model?.isFree ? 'hover:bg-green-200' : 'hover:bg-blue-200'
                    }`}
                  >
                    <X className="w-2 h-2 md:w-3 md:h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setIsOpen(!isOpen);
            // Add haptic feedback on mobile
            if (isMobile && navigator.vibrate) {
              navigator.vibrate(10);
            }
          }}
          onTouchStart={(e) => {
            // Prevent double-tap zoom and provide visual feedback
            e.currentTarget.style.transform = 'scale(0.98)';
          }}
          onTouchEnd={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
          className="w-full flex items-center justify-between px-3 md:px-4 py-2 md:py-3 bg-white border border-gray-300 
            rounded-lg hover:border-gray-400 active:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none 
            transition-all duration-200 text-sm md:text-base min-h-[44px] touch-manipulation mobile-dropdown-trigger"
          disabled={state.isLoadingModels}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          style={{
            WebkitTapHighlightColor: 'transparent',
            userSelect: 'none'
          }}
        >
          <span className="text-gray-700 truncate">
            {state.selectedModels.length === 0
              ? 'Choose models to compare...'
              : `${state.selectedModels.length} model${state.selectedModels.length === 1 ? '' : 's'} selected`
            }
          </span>
          <ChevronDown className={`w-4 h-4 md:w-5 md:h-5 text-gray-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Mobile Backdrop - Use Portal for better z-index control */}
        {isOpen && isMobile && createPortal(
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
            onTouchEnd={(e) => {
              e.preventDefault();
              setIsOpen(false);
            }}
            style={{ 
              touchAction: 'none',
              zIndex: 2147483646,  // Maximum safe z-index
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0
            }}
          />,
          document.body
        )}

        {/* Desktop Backdrop */}
        {isOpen && !isMobile && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm hidden md:block transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
            style={{ 
              touchAction: 'none',
              zIndex: 999998
            }}
          />
        )}

        {/* Mobile Dropdown Modal - Use Portal for complete z-index independence */}
        {isOpen && isMobile && createPortal(
          <div 
            className="fixed inset-0 z-[2147483647] flex items-center justify-center p-4"
            style={{
              zIndex: 2147483647,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)'
            }}
            onClick={() => setIsOpen(false)}
          >
            <div 
              className="w-full max-w-md max-h-[80vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
              style={{
                animation: 'modalSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                touchAction: 'manipulation',
                height: 'auto',
                maxHeight: '80vh'
              }}
            >
              {/* Enhanced Search Input */}
              <div className="p-4 border-b border-gray-200 space-y-3 bg-white sticky top-0 z-10">
                <input
                  type="text"
                  placeholder="Search models..."
                  value={searchTerm}
                  onChange={(e) => {
                    console.log('Search term changed:', e.target.value);
                    setSearchTerm(e.target.value);
                  }}
                  onFocus={(e) => {
                    // Ensure input is visible when focused
                    e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl 
                    focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-base
                    mobile-search-input"
                  autoComplete="off"
                  inputMode="search"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  style={{
                    fontSize: '16px', // Prevents zoom on iOS
                    WebkitAppearance: 'none',
                    touchAction: 'manipulation'
                  }}
                />
                
                {/* Group by provider toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="groupByProvider"
                      checked={groupByProvider}
                      onChange={(e) => setGroupByProvider(e.target.checked)}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="groupByProvider" className="text-sm text-gray-600">
                      Group by provider
                    </label>
                  </div>
                  
                  {/* Quick stats */}
                  <div className="text-sm text-gray-500">
                    {filteredModels.filter(m => m.isFree).length} free, {filteredModels.filter(m => !m.isFree).length} paid
                  </div>
                </div>
              </div>

              {/* Enhanced Models List */}
              <div 
                className="overflow-y-auto mobile-scrollable flex-1"
                role="listbox"
                aria-label="Available AI models"
                style={{
                  maxHeight: 'calc(80vh - 200px)', // Account for header and footer
                  minHeight: '200px',
                  WebkitOverflowScrolling: 'touch',
                  overscrollBehavior: 'contain',
                  touchAction: 'pan-y',
                  scrollBehavior: 'smooth'
                }}
                onTouchStart={(e) => {
                  // Allow native scrolling
                  e.stopPropagation();
                }}
                onTouchMove={(e) => {
                  // Allow native scrolling
                  e.stopPropagation();
                }}
              >
                {Object.keys(groupedModels).length === 0 || filteredModels.length === 0 ? (
                  <div className="p-6 text-center text-gray-500 text-base" role="status">
                    {searchTerm ? 'No models found matching your search.' : 'No models available.'}
                  </div>
                ) : (
                  Object.entries(groupedModels).map(([groupName, models]) => {
                    // Skip empty groups
                    if (!models || models.length === 0) return null;
                    
                    return (
                      <div key={groupName}>
                        {(groupByProvider || groupName === 'Free Models' || groupName === 'Paid Models') && (
                          <div className={`px-4 py-3 border-b border-gray-100 text-sm font-medium flex items-center gap-2 ${
                            groupName === 'Free Models' 
                              ? 'bg-green-50 text-green-700' 
                              : groupName === 'Paid Models'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-gray-50 text-gray-700'
                          }`}>
                            {groupName === 'Free Models' && <Gift className="w-4 h-4" />}
                            {groupName === 'Paid Models' && <Crown className="w-4 h-4" />}
                            <span>{groupName} ({models.length})</span>
                          </div>
                        )}
                      
                        {models.map(model => {
                          const isSelected = state.selectedModels.includes(model.id);
                          return (
                            <button
                              key={model.id}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleModelToggle(model.id);
                                // Provide haptic feedback on mobile
                                if (navigator.vibrate) {
                                  navigator.vibrate(10);
                                }
                              }}
                              onTouchStart={(e) => {
                                // Prevent double-tap zoom
                                e.currentTarget.style.transform = 'scale(0.98)';
                              }}
                              onTouchEnd={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                              }}
                              className={`w-full text-left px-4 py-4 hover:bg-gray-50 active:bg-gray-100 transition-all duration-200
                                border-b border-gray-100 last:border-b-0 min-h-[60px] relative
                                touch-manipulation cursor-pointer select-none ${
                                isSelected ? 'bg-purple-50 border-purple-100 ring-1 ring-purple-200' : ''
                              }`}
                              type="button"
                              style={{
                                WebkitTapHighlightColor: 'transparent',
                                userSelect: 'none'
                              }}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0 pr-2">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="font-medium text-gray-900 truncate text-base">
                                      {model.name}
                                    </span>
                                  
                                    {/* Enhanced Free/Paid indicator */}
                                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                      model.isFree 
                                        ? 'bg-green-100 text-green-800 border border-green-300'
                                        : 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-300'
                                    }`}>
                                      {getPriceIcon(model.isFree)}
                                      <span>{model.isFree ? 'FREE' : 'PAID'}</span>
                                    </div>
                                  
                                    {isSelected && <Check className="w-4 h-4 text-purple-600 flex-shrink-0" />}
                                  </div>
                                
                                  <div className="text-xs text-gray-500 truncate mb-2">
                                    {model.id}
                                  </div>
                                
                                  <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                                    {model.context_length && (
                                      <span className="bg-gray-100 px-2 py-1 rounded">
                                        {model.context_length.toLocaleString()} ctx
                                      </span>
                                    )}
                                  
                                    {!model.isFree && model.promptPrice > 0 && (
                                      <span className="px-2 py-1 rounded bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200">
                                        <DollarSign className="w-3 h-3 inline mr-1" />
                                        {formatPrice(model.promptPrice)}
                                      </span>
                                    )}
                                  
                                    {model.isFree && (
                                      <span className="bg-green-50 text-green-700 px-2 py-1 rounded border border-green-200">
                                        <Gift className="w-3 h-3 inline mr-1" />
                                        No cost
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    );
                  })
                )}
              </div>
              
              {/* Close button */}
              <div className="p-4 border-t border-gray-200">
                {/* Debug info for mobile */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="text-xs text-gray-400 mb-2">
                    Mobile: {isMobile ? 'Yes' : 'No'} | Width: {window.innerWidth}px
                  </div>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full px-4 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 active:bg-purple-800 transition-colors"
                  style={{
                    WebkitTapHighlightColor: 'transparent',
                    touchAction: 'manipulation'
                  }}
                >
                  Done ({state.selectedModels.length} selected)
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

        {/* Desktop Dropdown - Original inline version */}
        {isOpen && !isMobile && (
          <div 
            className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg 
            max-h-60 md:max-h-80 overflow-hidden"
            style={{
              zIndex: 999999
            }}
          >
            {/* Enhanced Search Input */}
            <div className="p-2 md:p-3 border-b border-gray-200 space-y-2">
              <input
                type="text"
                placeholder="Search models..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-2 md:px-3 py-1 md:py-2 border border-gray-300 rounded-md 
                  focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm
                  mobile-search-input"
                autoComplete="off"
                inputMode="search"
              />
              
              {/* Group by provider toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="groupByProvider"
                    checked={groupByProvider}
                    onChange={(e) => setGroupByProvider(e.target.checked)}
                    className="w-3 h-3 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="groupByProvider" className="text-xs text-gray-600">
                    Group by provider
                  </label>
                </div>
                
                {/* Quick stats */}
                <div className="text-xs text-gray-500">
                  {filteredModels.filter(m => m.isFree).length} free, {filteredModels.filter(m => !m.isFree).length} paid
                </div>
              </div>
            </div>

            {/* Enhanced Models List */}
            <div className="overflow-y-auto max-h-48 md:max-h-60 scrollable mobile-scrollable"
                 role="listbox"
                 aria-label="Available AI models">
              {Object.keys(groupedModels).length === 0 || filteredModels.length === 0 ? (
                <div className="p-3 md:p-4 text-center text-gray-500 text-sm" role="status">
                  {searchTerm ? 'No models found matching your search.' : 'No models available.'}
                </div>
              ) : (
                Object.entries(groupedModels).map(([groupName, models]) => {
                  // Skip empty groups
                  if (!models || models.length === 0) return null;
                  
                  return (
                    <div key={groupName}>
                      {(groupByProvider || groupName === 'Free Models' || groupName === 'Paid Models') && (
                        <div className={`px-3 py-2 border-b border-gray-100 text-xs font-medium flex items-center gap-2 ${
                          groupName === 'Free Models' 
                            ? 'bg-green-50 text-green-700' 
                            : groupName === 'Paid Models'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-gray-50 text-gray-700'
                        }`}>
                          {groupName === 'Free Models' && <Gift className="w-3 h-3" />}
                          {groupName === 'Paid Models' && <Crown className="w-3 h-3" />}
                          <span>{groupName} ({models.length})</span>
                        </div>
                      )}
                    
                      {models.map(model => {
                        const isSelected = state.selectedModels.includes(model.id);
                        return (
                          <button
                            key={model.id}
                            onClick={() => handleModelToggle(model.id)}
                            className={`w-full text-left px-3 md:px-4 py-2 md:py-3 hover:bg-gray-50 transition-colors 
                              border-b border-gray-100 last:border-b-0 min-h-[44px] relative mobile-model-item
                              touch-manipulation ${
                              isSelected ? 'bg-purple-50 border-purple-100' : ''
                            }`}
                            type="button"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0 pr-2">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-gray-900 truncate text-sm md:text-base">
                                    {model.name}
                                  </span>
                                
                                  {/* Enhanced Free/Paid indicator */}
                                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                                    model.isFree 
                                      ? 'bg-green-100 text-green-800 border border-green-300'
                                      : 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-300'
                                  }`}>
                                    {getPriceIcon(model.isFree)}
                                    <span>{model.isFree ? 'FREE' : 'PAID'}</span>
                                  </div>
                                
                                  {isSelected && <Check className="w-3 h-3 md:w-4 md:h-4 text-purple-600 flex-shrink-0" />}
                                </div>
                              
                                <div className="text-xs text-gray-500 truncate mb-1">
                                  {model.id}
                                </div>
                              
                                {model.description && (
                                  <div className="text-xs text-gray-600 mb-2 line-clamp-2 hidden md:block">
                                    {model.description}
                                  </div>
                                )}
                              
                                <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                                  {model.context_length && (
                                    <span className="bg-gray-100 px-2 py-0.5 rounded">
                                      {model.context_length.toLocaleString()} ctx
                                    </span>
                                  )}
                                
                                  {!model.isFree && model.promptPrice > 0 && (
                                    <span className="px-2 py-0.5 rounded bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200">
                                      <DollarSign className="w-3 h-3 inline mr-1" />
                                      {formatPrice(model.promptPrice)}
                                    </span>
                                  )}
                                
                                  {model.isFree && (
                                    <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-200">
                                      <Gift className="w-3 h-3 inline mr-1" />
                                      No cost
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {state.selectedModels.length > 0 && (
        <div className="mt-3 text-xs md:text-sm text-gray-600">
          <div className="flex items-center gap-2 mb-2">
            <p className="flex-1">
              💡 Tip: You can select multiple models to compare their responses side by side.
              Each model will process your prompt independently.
            </p>
          </div>
          
          {/* Enhanced cost and selection warnings */}
          {state.selectedModels.some(id => {
            const model = state.availableModels.find(m => m.id === id);
            return model && !model.isFree;
          }) && (
            <div className="text-xs text-blue-700 bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-4 h-4" />
                <span className="font-medium">Paid Models Selected</span>
              </div>
              <p className="text-blue-600">
                Some selected models require payment. Costs vary based on input/output length and model pricing.
              </p>
            </div>
          )}
          
          {/* Free models info */}
          {state.selectedModels.some(id => {
            const model = state.availableModels.find(m => m.id === id);
            return model && model.isFree;
          }) && state.selectedModels.every(id => {
            const model = state.availableModels.find(m => m.id === id);
            return model && model.isFree;
          }) && (
            <div className="text-xs text-green-700 bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="w-4 h-4" />
                <span className="font-medium">All Free Models</span>
              </div>
              <p className="text-green-600">
                Great choice! All selected models are free to use with no additional costs.
              </p>
            </div>
          )}
        </div>
      )}

      {state.selectedModels.length > 4 && (
        <div className="mt-3 p-2 md:p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-xs md:text-sm">
            ⚠️ You have selected {state.selectedModels.length} models. 
            This may result in higher costs and slower response times.
          </p>
        </div>
      )}
    </div>
  );
};

export default ModelSelector;