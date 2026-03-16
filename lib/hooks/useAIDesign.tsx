/**
 * useAIDesign Hook
 * 
 * State management for AI design generation.
 * Handles API calls, loading states, and error handling.
 */

'use client';

import { useState, useCallback } from 'react';
import { DesignerConfig } from '@/types/entities/designer';
import {
  generateAIDesign,
  generateAIDesignVariations,
  refineAIDesign,
  saveAIDesign,
  getSavedAIDesigns,
  deleteAIDesign,
  getAIDesignSuggestions,
  AIDesignRequest,
  AIDesignVariation,
} from '@/lib/api/ai-design';

export interface UseAIDesignOptions {
  onSuccess?: (config: DesignerConfig) => void;
  onError?: (error: string) => void;
  baseConfig?: Partial<DesignerConfig>;
}

export interface UseAIDesignReturn {
  // State
  isGenerating: boolean;
  error: string | null;
  currentDesign: DesignerConfig | null;
  variations: AIDesignVariation[];
  savedDesigns: AIDesignVariation[];
  suggestions: Array<{ prompt: string; style: string }>;

  // Actions
  generate: (prompt: string, style: string) => Promise<void>;
  generateVariations: (prompt: string, style: string, count?: number) => Promise<void>;
  refine: (designId: string, refinementPrompt: string) => Promise<void>;
  save: (designId: string, name?: string) => Promise<void>;
  loadSaved: () => Promise<void>;
  deleteSaved: (designId: string) => Promise<void>;
  getSuggestions: (qrData: string) => Promise<void>;
  applyVariation: (variation: AIDesignVariation) => void;
  reset: () => void;
}

export function useAIDesign(options: UseAIDesignOptions = {}): UseAIDesignReturn {
  const { onSuccess, onError, baseConfig } = options;

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentDesign, setCurrentDesign] = useState<DesignerConfig | null>(null);
  const [variations, setVariations] = useState<AIDesignVariation[]>([]);
  const [savedDesigns, setSavedDesigns] = useState<AIDesignVariation[]>([]);
  const [suggestions, setSuggestions] = useState<Array<{ prompt: string; style: string }>>([]);

  /**
   * Generate AI design from prompt
   */
  const generate = useCallback(
    async (prompt: string, style: string) => {
      setIsGenerating(true);
      setError(null);

      try {
        const request: AIDesignRequest = {
          prompt,
          style: style as any,
          baseConfig,
        };

        const response = await generateAIDesign(request);

        if (response.success) {
          setCurrentDesign(response.config);
          onSuccess?.(response.config);
        } else {
          const errorMsg = response.error || 'Failed to generate design';
          setError(errorMsg);
          onError?.(errorMsg);
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMsg);
        onError?.(errorMsg);
      } finally {
        setIsGenerating(false);
      }
    },
    [baseConfig, onSuccess, onError]
  );

  /**
   * Generate multiple variations
   */
  const generateVariations = useCallback(
    async (prompt: string, style: string, count: number = 3) => {
      setIsGenerating(true);
      setError(null);

      try {
        const request: AIDesignRequest = {
          prompt,
          style: style as any,
          baseConfig,
        };

        const response = await generateAIDesignVariations(request, count);

        if (response.success) {
          setVariations(response.variations);
          
          // Auto-apply first variation if available
          const firstVariation = response.variations[0];
          if (response.variations.length > 0 && firstVariation) {
            setCurrentDesign(firstVariation.config);
            onSuccess?.(firstVariation.config);
          }
        } else {
          const errorMsg = response.error || 'Failed to generate variations';
          setError(errorMsg);
          onError?.(errorMsg);
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMsg);
        onError?.(errorMsg);
      } finally {
        setIsGenerating(false);
      }
    },
    [baseConfig, onSuccess, onError]
  );

  /**
   * Refine existing design
   */
  const refine = useCallback(
    async (designId: string, refinementPrompt: string) => {
      setIsGenerating(true);
      setError(null);

      try {
        const response = await refineAIDesign(designId, refinementPrompt);

        if (response.success) {
          setCurrentDesign(response.config);
          onSuccess?.(response.config);
        } else {
          const errorMsg = response.error || 'Failed to refine design';
          setError(errorMsg);
          onError?.(errorMsg);
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMsg);
        onError?.(errorMsg);
      } finally {
        setIsGenerating(false);
      }
    },
    [onSuccess, onError]
  );

  /**
   * Save design to collection
   */
  const save = useCallback(async (designId: string, name?: string) => {
    try {
      const response = await saveAIDesign(designId, name);
      if (response.success) {
        // Reload saved designs
        await loadSaved();
      }
    } catch (err) {
      console.error('Failed to save design:', err);
    }
  }, []);

  /**
   * Load saved designs
   */
  const loadSaved = useCallback(async () => {
    try {
      const designs = await getSavedAIDesigns();
      setSavedDesigns(designs);
    } catch (err) {
      console.error('Failed to load saved designs:', err);
    }
  }, []);

  /**
   * Delete saved design
   */
  const deleteSaved = useCallback(async (designId: string) => {
    try {
      const response = await deleteAIDesign(designId);
      if (response.success) {
        // Reload saved designs
        await loadSaved();
      }
    } catch (err) {
      console.error('Failed to delete design:', err);
    }
  }, [loadSaved]);

  /**
   * Get AI suggestions based on QR content
   */
  const getSuggestionsCallback = useCallback(async (qrData: string) => {
    try {
      const response = await getAIDesignSuggestions(qrData);
      if (response.success) {
        setSuggestions(response.suggestions);
      }
    } catch (err) {
      console.error('Failed to get suggestions:', err);
    }
  }, []);

  /**
   * Apply a variation
   */
  const applyVariation = useCallback(
    (variation: AIDesignVariation) => {
      setCurrentDesign(variation.config);
      onSuccess?.(variation.config);
    },
    [onSuccess]
  );

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setIsGenerating(false);
    setError(null);
    setCurrentDesign(null);
    setVariations([]);
    setSuggestions([]);
  }, []);

  return {
    // State
    isGenerating,
    error,
    currentDesign,
    variations,
    savedDesigns,
    suggestions,

    // Actions
    generate,
    generateVariations,
    refine,
    save,
    loadSaved,
    deleteSaved,
    getSuggestions: getSuggestionsCallback,
    applyVariation,
    reset,
  };
}

/**
 * AI Design Button Component
 */
export interface AIDesignButtonProps {
  onClick: () => void;
  isGenerating?: boolean;
  disabled?: boolean;
  className?: string;
  variant?: 'primary' | 'secondary' | 'minimal';
}

export function AIDesignButton({
  onClick,
  isGenerating = false,
  disabled = false,
  className = '',
  variant = 'primary',
}: AIDesignButtonProps) {
  const baseClasses = 'inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-primary-600 to-purple-600 text-white hover:from-primary-700 hover:to-purple-700',
    secondary: 'bg-white border-2 border-primary-600 text-primary-600 hover:bg-primary-50',
    minimal: 'text-primary-600 hover:text-primary-700 hover:bg-primary-50',
  };

  const disabledClasses = 'opacity-50 cursor-not-allowed';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isGenerating}
      className={`${baseClasses} ${variantClasses[variant]} ${
        disabled || isGenerating ? disabledClasses : ''
      } ${className}`}
    >
      {isGenerating ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
          <span>Generating...</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          <span>AI Design</span>
        </>
      )}
    </button>
  );
}

/**
 * AI Design Loading State Component
 */
export interface AIDesignLoadingProps {
  message?: string;
  progress?: number; // 0-100
}

export function AIDesignLoading({ message = 'Generating your design...', progress }: AIDesignLoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Animated icon */}
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-primary-200 animate-pulse"></div>
        <div className="absolute inset-0 rounded-full border-4 border-t-primary-600 animate-spin"></div>
        <svg
          className="absolute inset-2 text-primary-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      </div>

      {/* Message */}
      <p className="text-lg font-medium text-gray-900 mb-2">{message}</p>
      <p className="text-sm text-gray-600">This usually takes a few seconds...</p>

      {/* Progress bar if provided */}
      {progress !== undefined && (
        <div className="w-64 h-2 bg-gray-200 rounded-full mt-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-600 to-purple-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
}
