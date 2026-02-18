/**
 * AIDesignFields Component
 * 
 * AI-powered design generation UI.
 * Allows users to generate QR designs using natural language prompts.
 */

'use client';

import React, { useState, useCallback } from 'react';
import { AIDesignConfig } from '@/types/entities/designer';
import {
  AI_PROMPT_EXAMPLES,
  AI_STYLE_RECOMMENDATIONS,
  validateAIPrompt,
  estimateGenerationTime,
} from '@/lib/api/ai-design';

export interface AIDesignFieldsProps {
  value: AIDesignConfig;
  onChange: (config: AIDesignConfig) => void;
  onGenerate?: (prompt: string, style: string) => void;
  isGenerating?: boolean;
  label?: string;
  className?: string;
}

export function AIDesignFields({
  value,
  onChange,
  onGenerate,
  isGenerating = false,
  label = 'AI Design Assistant',
  className = '',
}: AIDesignFieldsProps) {
  const [prompt, setPrompt] = useState(value.prompt || '');
  const [selectedStyle, setSelectedStyle] = useState<string>(value.style || 'modern');
  const [showExamples, setShowExamples] = useState(false);

  // Validate prompt
  const validation = validateAIPrompt(prompt);

  // Handle prompt change
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newPrompt = e.target.value;
    setPrompt(newPrompt);
    onChange({
      ...value,
      prompt: newPrompt,
    });
  };

  // Handle style change
  const handleStyleChange = (style: string) => {
    setSelectedStyle(style);
    onChange({
      ...value,
      style: style as any,
    });
  };

  // Handle example selection
  const handleExampleClick = (examplePrompt: string) => {
    setPrompt(examplePrompt);
    onChange({
      ...value,
      prompt: examplePrompt,
    });
    setShowExamples(false);
  };

  // Handle generate
  const handleGenerate = () => {
    if (validation.valid && onGenerate) {
      onGenerate(prompt, selectedStyle);
    }
  };

  const estimatedTime = estimateGenerationTime(
    prompt.length > 200 ? 'complex' : prompt.length > 100 ? 'moderate' : 'simple'
  );

  return (
    <div className={`ai-design-fields ${className}`}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <p className="text-xs text-gray-500">
          Describe the design you want and our AI will generate it for you
        </p>
      </div>

      {/* Prompt input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Design Prompt
          <span className="text-xs text-gray-500 ml-2">({prompt.length}/500)</span>
        </label>
        <textarea
          value={prompt}
          onChange={handlePromptChange}
          placeholder="E.g., Professional design with blue colors and rounded corners for a tech company"
          rows={4}
          maxLength={500}
          disabled={isGenerating}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        
        {!validation.valid && prompt.length > 0 && (
          <div className="mt-2">
            {validation.errors.map((error, index) => (
              <p key={index} className="text-xs text-red-600">
                {error}
              </p>
            ))}
          </div>
        )}

        {/* Show examples button */}
        <button
          type="button"
          onClick={() => setShowExamples(!showExamples)}
          disabled={isGenerating}
          className="mt-2 text-sm text-primary-600 hover:text-primary-700 disabled:text-gray-400"
        >
          {showExamples ? '✕ Hide Examples' : '💡 Show Example Prompts'}
        </button>
      </div>

      {/* Example prompts */}
      {showExamples && (
        <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Example Prompts</h4>
          <div className="space-y-3">
            {AI_PROMPT_EXAMPLES.map(category => (
              <div key={category.category}>
                <h5 className="text-xs font-medium text-gray-700 mb-2">{category.category}</h5>
                <div className="space-y-1">
                  {category.prompts.map((examplePrompt, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleExampleClick(examplePrompt)}
                      className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-white hover:shadow-sm rounded-md transition"
                    >
                      "{examplePrompt}"
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Style selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Design Style</label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {Object.entries(AI_STYLE_RECOMMENDATIONS).map(([key, style]) => (
            <button
              key={key}
              type="button"
              onClick={() => handleStyleChange(key)}
              disabled={isGenerating}
              className={`p-3 rounded-lg border-2 transition text-left ${
                selectedStyle === key
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="font-medium text-sm">{style.name}</div>
              <div className="text-xs text-gray-600 mt-1">{style.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Generate button */}
      <div className="mb-4">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={!validation.valid || isGenerating}
          className="w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg font-medium hover:from-primary-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Generating Design...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span>Generate AI Design</span>
            </>
          )}
        </button>

        {validation.valid && !isGenerating && (
          <p className="text-xs text-gray-500 text-center mt-2">
            Estimated time: ~{Math.round(estimatedTime / 1000)} seconds
          </p>
        )}
      </div>

      {/* AI info */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">✨ AI Design Assistant</h4>
        <ul className="list-disc list-inside space-y-1 text-xs text-blue-800">
          <li>Powered by advanced AI to create unique designs</li>
          <li>Describe your vision in natural language</li>
          <li>Get instant design suggestions and variations</li>
          <li>Refine and customize the generated design</li>
          <li>Save your favorite AI designs for later use</li>
        </ul>
      </div>

      {/* Previous design info */}
      {value.generated && value.designId && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-green-900">AI Design Active</p>
              <p className="text-xs text-green-700 mt-1">
                This QR code is using an AI-generated design. You can regenerate or customize it further.
              </p>
              <p className="text-xs text-green-600 mt-1">Design ID: {value.designId}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
