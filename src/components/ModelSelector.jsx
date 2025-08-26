import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { ChevronDown, Check, X, Brain, Loader, Crown, Gift, DollarSign } from 'lucide-react';

const ModelSelector = () => {
  const { state, actions } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [groupByProvider, setGroupByProvider] = useState(false);
  const dropdownRef = useRef(null);

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

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredModels = state.availableModels.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (model.category && model.category.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFreeFilter = !showFreeOnly || model.isFree;
    
    return matchesSearch && matchesFreeFilter;
  });

  // Group models by provider if enabled
  const groupedModels = groupByProvider ? 
    filteredModels.reduce((acc, model) => {
      const provider = model.category || 'Other';
      if (!acc[provider]) acc[provider] = [];
      acc[provider].push(model);
      return acc;
    }, {}) : { 'All Models': filteredModels };

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
          {/* Free Models Filter */}
          <button
            onClick={() => setShowFreeOnly(!showFreeOnly)}
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-colors ${
              showFreeOnly 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Gift className="w-3 h-3" />
            <span className="hidden sm:inline">Free Only</span>
          </button>
          
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
            {state.selectedModels.map(modelId => (
              <div
                key={modelId}
                className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm"
              >
                <span className="truncate max-w-24 md:max-w-32">{getModelName(modelId)}</span>
                <button
                  onClick={() => removeModel(modelId)}
                  className="ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-2 h-2 md:w-3 md:h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-3 md:px-4 py-2 md:py-3 bg-white border border-gray-300 
            rounded-lg hover:border-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none 
            transition-colors text-sm md:text-base min-h-[44px]"
          disabled={state.isLoadingModels}
        >
          <span className="text-gray-700 truncate">
            {state.selectedModels.length === 0
              ? 'Choose models to compare...'
              : `${state.selectedModels.length} model${state.selectedModels.length === 1 ? '' : 's'} selected`
            }
          </span>
          <ChevronDown className={`w-4 h-4 md:w-5 md:h-5 text-gray-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg 
            max-h-60 md:max-h-80 overflow-hidden">
            {/* Enhanced Search Input */}
            <div className="p-2 md:p-3 border-b border-gray-200 space-y-2">
              <input
                type="text"
                placeholder="Search models..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-2 md:px-3 py-1 md:py-2 border border-gray-300 rounded-md 
                  focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
              />
              
              {/* Group by provider toggle */}
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
            </div>

            {/* Enhanced Models List */}
            <div className="overflow-y-auto max-h-48 md:max-h-60 scrollable">
              {Object.keys(groupedModels).length === 0 || filteredModels.length === 0 ? (
                <div className="p-3 md:p-4 text-center text-gray-500 text-sm">
                  {searchTerm ? 'No models found matching your search.' : 'No models available.'}
                </div>
              ) : (
                Object.entries(groupedModels).map(([groupName, models]) => (
                  <div key={groupName}>
                    {groupByProvider && Object.keys(groupedModels).length > 1 && (
                      <div className="px-3 py-2 bg-gray-50 border-b border-gray-100 text-xs font-medium text-gray-700">
                        {groupName} ({models.length})
                      </div>
                    )}
                    
                    {models.map(model => {
                      const isSelected = state.selectedModels.includes(model.id);
                      return (
                        <button
                          key={model.id}
                          onClick={() => handleModelToggle(model.id)}
                          className={`w-full text-left px-3 md:px-4 py-2 md:py-3 hover:bg-gray-50 transition-colors 
                            border-b border-gray-100 last:border-b-0 min-h-[44px] relative ${
                            isSelected ? 'bg-purple-50 border-purple-100' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0 pr-2">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-gray-900 truncate text-sm md:text-base">
                                  {model.name}
                                </span>
                                
                                {/* Free/Paid indicator */}
                                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                                  model.isFree 
                                    ? 'bg-green-100 text-green-700 border border-green-200'
                                    : 'bg-blue-100 text-blue-700 border border-blue-200'
                                }`}>
                                  {getPriceIcon(model.isFree)}
                                  <span>{model.isFree ? 'Free' : 'Paid'}</span>
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
                                  <span className={`px-2 py-0.5 rounded bg-blue-50 ${getPriceColor(model.isFree)}`}>
                                    <DollarSign className="w-3 h-3 inline mr-1" />
                                    {formatPrice(model.promptPrice)}
                                  </span>
                                )}
                                
                                {model.isFree && (
                                  <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded">
                                    <Gift className="w-3 h-3 inline mr-1" />
                                    Free tier
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ))
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
          
          {/* Show cost estimation for paid models */}
          {state.selectedModels.some(id => {
            const model = state.availableModels.find(m => m.id === id);
            return model && !model.isFree;
          }) && (
            <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded border border-blue-200">
              <DollarSign className="w-3 h-3 inline mr-1" />
              Note: Some selected models are paid. Costs will vary based on input/output length.
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