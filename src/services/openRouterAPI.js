import axios from 'axios';

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

class OpenRouterAPI {
  constructor() {
    this.apiKey = null;
    this.baseURL = OPENROUTER_BASE_URL;
  }

  setApiKey(apiKey) {
    this.apiKey = apiKey;
  }

  getHeaders() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'AI Model Combiner'
    };
  }

  // Fetch available models from OpenRouter
  async getModels() {
    try {
      if (!this.apiKey) {
        console.warn('No API key provided, returning fallback models');
        return this.getFallbackModels();
      }

      const response = await axios.get(`${this.baseURL}/models`, {
        headers: this.getHeaders()
      });
      
      // Process and categorize models
      const models = response.data.data.map(model => {
        const isFree = this.isFreeModel(model);
        const pricing = model.pricing || {};
        
        return {
          id: model.id,
          name: model.name || this.formatModelName(model.id),
          description: model.description || '',
          pricing: pricing,
          context_length: model.context_length || 4096,
          architecture: model.architecture || {},
          isFree: isFree,
          promptPrice: pricing.prompt ? parseFloat(pricing.prompt) : 0,
          completionPrice: pricing.completion ? parseFloat(pricing.completion) : 0,
          category: this.getModelCategory(model.id),
          provider: this.getModelProvider(model.id)
        };
      }).filter(model => {
        // Filter out invalid models
        return model.id && !model.id.includes(':') && model.name;
      }).sort((a, b) => {
        // Sort: free models first, then by category and name
        if (a.isFree && !b.isFree) return -1;
        if (!a.isFree && b.isFree) return 1;
        
        // Within same pricing tier, sort by category then name
        if (a.category !== b.category) {
          return a.category.localeCompare(b.category);
        }
        return a.name.localeCompare(b.name);
      });

      return models.length > 0 ? models : this.getFallbackModels();
    } catch (error) {
      console.error('Error fetching models:', error);
      return this.getFallbackModels();
    }
  }

  // Helper functions for model categorization
  isFreeModel(model) {
    const freeKeywords = [
      'free', ':free', 'gemma', 'llama-3.1-8b', 'llama-3-8b', 'mistral-7b', 
      'qwen', 'phi-3', 'phi-3-mini', 'mixtral-8x7b', 'codestral-mamba',
      'deepseek-coder', 'nous-hermes', 'openchat', 'toppy-m'
    ];
    const modelId = model.id.toLowerCase();
    const pricing = model.pricing || {};
    
    // Check if explicitly marked as free in model ID
    if (freeKeywords.some(keyword => modelId.includes(keyword))) {
      return true;
    }
    
    // Check if pricing is 0 or very low (free tier)
    const promptPrice = parseFloat(pricing.prompt || 0);
    const completionPrice = parseFloat(pricing.completion || 0);
    
    // Consider free if both prompt and completion prices are 0 or extremely low
    return (promptPrice === 0 && completionPrice === 0) || 
           (promptPrice < 0.000001 && completionPrice < 0.000001);
  }

  getModelCategory(modelId) {
    const id = modelId.toLowerCase();
    if (id.includes('gpt') || id.includes('openai')) return 'OpenAI';
    if (id.includes('claude') || id.includes('anthropic')) return 'Anthropic';
    if (id.includes('gemini') || id.includes('google')) return 'Google';
    if (id.includes('llama') || id.includes('meta')) return 'Meta';
    if (id.includes('mistral')) return 'Mistral';
    if (id.includes('cohere')) return 'Cohere';
    if (id.includes('qwen') || id.includes('alibaba')) return 'Alibaba';
    return 'Other';
  }

  getModelProvider(modelId) {
    return modelId.split('/')[0] || 'Unknown';
  }

  formatModelName(modelId) {
    return modelId.split('/').pop()
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  getFallbackModels() {
    return [
      // Free Models
      {
        id: 'meta-llama/llama-3.1-8b-instruct:free',
        name: 'Llama 3.1 8B (Free)',
        description: 'Meta\'s latest open-source model with excellent performance, completely free',
        context_length: 131072,
        isFree: true,
        promptPrice: 0,
        completionPrice: 0,
        category: 'Meta',
        provider: 'meta-llama'
      },
      {
        id: 'microsoft/phi-3-mini-128k-instruct:free',
        name: 'Phi 3 Mini (Free)',
        description: 'Microsoft\'s efficient small language model, optimized for speed and quality',
        context_length: 128000,
        isFree: true,
        promptPrice: 0,
        completionPrice: 0,
        category: 'Microsoft',
        provider: 'microsoft'
      },
      {
        id: 'google/gemma-2-9b-it:free',
        name: 'Gemma 2 9B (Free)',
        description: 'Google\'s latest Gemma model with improved reasoning capabilities',
        context_length: 8192,
        isFree: true,
        promptPrice: 0,
        completionPrice: 0,
        category: 'Google',
        provider: 'google'
      },
      {
        id: 'mistralai/mistral-7b-instruct:free',
        name: 'Mistral 7B (Free)',
        description: 'High-quality multilingual model from Mistral AI, available for free',
        context_length: 32768,
        isFree: true,
        promptPrice: 0,
        completionPrice: 0,
        category: 'Mistral',
        provider: 'mistralai'
      },
      {
        id: 'huggingfaceh4/zephyr-7b-beta:free',
        name: 'Zephyr 7B Beta (Free)',
        description: 'Community-fine-tuned model based on Mistral with strong performance',
        context_length: 32768,
        isFree: true,
        promptPrice: 0,
        completionPrice: 0,
        category: 'Hugging Face',
        provider: 'huggingfaceh4'
      },
      
      // Premium Models
      {
        id: 'anthropic/claude-3.5-sonnet',
        name: 'Claude 3.5 Sonnet',
        description: 'Anthropic\'s most capable model with superior reasoning and coding abilities',
        context_length: 200000,
        isFree: false,
        promptPrice: 0.000003,
        completionPrice: 0.000015,
        category: 'Anthropic',
        provider: 'anthropic'
      },
      {
        id: 'openai/gpt-4o',
        name: 'GPT-4o',
        description: 'OpenAI\'s flagship multimodal model with excellent performance across tasks',
        context_length: 128000,
        isFree: false,
        promptPrice: 0.0000025,
        completionPrice: 0.00001,
        category: 'OpenAI',
        provider: 'openai'
      },
      {
        id: 'google/gemini-pro-1.5',
        name: 'Gemini Pro 1.5',
        description: 'Google\'s advanced reasoning model with massive context window',
        context_length: 1000000,
        isFree: false,
        promptPrice: 0.00000125,
        completionPrice: 0.000005,
        category: 'Google',
        provider: 'google'
      },
      {
        id: 'meta-llama/llama-3.1-405b-instruct',
        name: 'Llama 3.1 405B',
        description: 'Meta\'s largest and most capable open-source model',
        context_length: 131072,
        isFree: false,
        promptPrice: 0.000005,
        completionPrice: 0.000015,
        category: 'Meta',
        provider: 'meta-llama'
      },
      {
        id: 'mistralai/mistral-large',
        name: 'Mistral Large',
        description: 'Mistral\'s flagship model with top-tier performance',
        context_length: 128000,
        isFree: false,
        promptPrice: 0.000004,
        completionPrice: 0.000012,
        category: 'Mistral',
        provider: 'mistralai'
      },
      {
        id: 'anthropic/claude-3-haiku',
        name: 'Claude 3 Haiku',
        description: 'Fast and affordable model from Anthropic, great for simple tasks',
        context_length: 200000,
        isFree: false,
        promptPrice: 0.00000025,
        completionPrice: 0.00000125,
        category: 'Anthropic',
        provider: 'anthropic'
      }
    ];
  }

  // Send chat completion to a specific model
  async getChatCompletion(modelId, messages, options = {}) {
    try {
      const requestData = {
        model: modelId,
        messages: messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 1000,
        stream: false,
        ...options
      };

      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        requestData,
        { headers: this.getHeaders() }
      );

      return {
        success: true,
        model: modelId,
        content: response.data.choices[0]?.message?.content || '',
        usage: response.data.usage || {},
        finish_reason: response.data.choices[0]?.finish_reason || 'stop'
      };
    } catch (error) {
      console.error(`Error with model ${modelId}:`, error);
      return {
        success: false,
        model: modelId,
        error: error.response?.data?.error?.message || error.message,
        content: `Error: ${error.response?.data?.error?.message || error.message}`
      };
    }
  }

  // Send the same prompt to multiple models
  async getCombinedCompletions(modelIds, messages, options = {}) {
    const promises = modelIds.map(modelId => 
      this.getChatCompletion(modelId, messages, options)
    );

    try {
      const results = await Promise.allSettled(promises);
      return results.map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          return {
            success: false,
            model: modelIds[index],
            error: result.reason?.message || 'Unknown error',
            content: `Failed to get response: ${result.reason?.message || 'Unknown error'}`
          };
        }
      });
    } catch (error) {
      console.error('Error in combined completions:', error);
      return modelIds.map(modelId => ({
        success: false,
        model: modelId,
        error: error.message,
        content: `Failed to get response: ${error.message}`
      }));
    }
  }

  // Validate API key
  async validateApiKey(apiKey) {
    const tempKey = this.apiKey;
    this.setApiKey(apiKey);
    
    try {
      await this.getModels();
      return true;
    } catch (error) {
      return false;
    } finally {
      this.setApiKey(tempKey);
    }
  }
}

export default new OpenRouterAPI();