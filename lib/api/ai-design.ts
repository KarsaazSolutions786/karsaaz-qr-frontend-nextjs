/**
 * AI Design API Wrapper
 * 
 * API integration for AI-powered QR code design generation.
 * Communicates with backend AI service to generate design suggestions.
 */

import apiClient from './client';
import { DesignerConfig } from '@/types/entities/designer';

export interface AIDesignRequest {
  prompt: string;
  style?: 'modern' | 'classic' | 'playful' | 'professional' | 'artistic';
  baseConfig?: Partial<DesignerConfig>;
  preferences?: {
    colorScheme?: 'light' | 'dark' | 'colorful' | 'monochrome';
    complexity?: 'simple' | 'moderate' | 'complex';
    includeGradients?: boolean;
    includeLogo?: boolean;
  };
}

export interface AIDesignResponse {
  success: boolean;
  designId: string;
  config: DesignerConfig;
  metadata?: {
    prompt: string;
    style: string;
    generatedAt: string;
    variations?: number;
  };
  error?: string;
}

export interface AIDesignVariation {
  id: string;
  config: DesignerConfig;
  score: number; // 0-1 confidence score
  preview?: string; // SVG preview
}

export interface AIDesignVariationsResponse {
  success: boolean;
  variations: AIDesignVariation[];
  error?: string;
}

/**
 * Generate AI design from prompt
 */
export async function generateAIDesign(request: AIDesignRequest): Promise<AIDesignResponse> {
  try {
    const response = await apiClient.post<AIDesignResponse>('/ai-designs/generate', request);
    return response.data;
  } catch (error) {
    return {
      success: false,
      designId: '',
      config: {} as DesignerConfig,
      error: error instanceof Error ? error.message : 'Failed to generate AI design',
    };
  }
}

/**
 * Generate multiple variations
 */
export async function generateAIDesignVariations(
  request: AIDesignRequest,
  count: number = 3
): Promise<AIDesignVariationsResponse> {
  try {
    const response = await apiClient.post<AIDesignVariationsResponse>('/ai-designs/variations', {
      ...request,
      count,
    });
    return response.data;
  } catch (error) {
    return {
      success: false,
      variations: [],
      error: error instanceof Error ? error.message : 'Failed to generate variations',
    };
  }
}

/**
 * Get AI design by ID
 */
export async function getAIDesign(designId: string): Promise<AIDesignResponse> {
  try {
    const response = await apiClient.get<AIDesignResponse>(`/ai-designs/${designId}`);
    return response.data;
  } catch (error) {
    return {
      success: false,
      designId: '',
      config: {} as DesignerConfig,
      error: error instanceof Error ? error.message : 'Failed to fetch AI design',
    };
  }
}

/**
 * Refine existing AI design
 */
export async function refineAIDesign(
  designId: string,
  refinementPrompt: string
): Promise<AIDesignResponse> {
  try {
    const response = await apiClient.post<AIDesignResponse>(`/ai-designs/${designId}/refine`, {
      prompt: refinementPrompt,
    });
    return response.data;
  } catch (error) {
    return {
      success: false,
      designId: '',
      config: {} as DesignerConfig,
      error: error instanceof Error ? error.message : 'Failed to refine design',
    };
  }
}

/**
 * Save AI design to user's collection
 */
export async function saveAIDesign(designId: string, name?: string): Promise<{ success: boolean }> {
  try {
    const response = await apiClient.post(`/ai-designs/${designId}/save`, { name });
    return { success: response.data.success };
  } catch (error) {
    return { success: false };
  }
}

/**
 * Get user's saved AI designs
 */
export async function getSavedAIDesigns(): Promise<AIDesignVariation[]> {
  try {
    const response = await apiClient.get<{ designs: AIDesignVariation[] }>('/ai-designs/saved');
    return response.data.designs;
  } catch (error) {
    return [];
  }
}

/**
 * Delete saved AI design
 */
export async function deleteAIDesign(designId: string): Promise<{ success: boolean }> {
  try {
    const response = await apiClient.delete(`/ai-designs/${designId}`);
    return { success: response.data.success };
  } catch (error) {
    return { success: false };
  }
}

/**
 * Get AI design suggestions based on QR content
 */
export async function getAIDesignSuggestions(qrData: string): Promise<{
  success: boolean;
  suggestions: Array<{ prompt: string; style: string }>;
}> {
  try {
    const response = await apiClient.post('/ai-designs/suggestions', { qrData });
    return response.data;
  } catch (error) {
    return { success: false, suggestions: [] };
  }
}

/**
 * Estimate AI design generation time
 */
export function estimateGenerationTime(complexity: 'simple' | 'moderate' | 'complex'): number {
  const times = {
    simple: 3000, // 3 seconds
    moderate: 5000, // 5 seconds
    complex: 10000, // 10 seconds
  };
  return times[complexity];
}

/**
 * Validate AI design prompt
 */
export function validateAIPrompt(prompt: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!prompt || prompt.trim() === '') {
    errors.push('Prompt cannot be empty');
  }

  if (prompt.length < 10) {
    errors.push('Prompt should be at least 10 characters');
  }

  if (prompt.length > 500) {
    errors.push('Prompt should not exceed 500 characters');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get prompt examples
 */
export const AI_PROMPT_EXAMPLES = [
  {
    category: 'Business',
    prompts: [
      'Professional design with corporate blue and white colors',
      'Elegant minimal design for luxury brand',
      'Modern tech startup style with gradients',
      'Traditional business style with classic fonts',
    ],
  },
  {
    category: 'Creative',
    prompts: [
      'Vibrant and colorful design for art gallery',
      'Playful design with rounded shapes for kids',
      'Artistic design with watercolor effects',
      'Retro 80s style with neon colors',
    ],
  },
  {
    category: 'Events',
    prompts: [
      'Wedding invitation style with gold accents',
      'Party design with confetti and bright colors',
      'Concert poster style with bold typography',
      'Conference design with professional layout',
    ],
  },
  {
    category: 'Product',
    prompts: [
      'Product packaging style with clean design',
      'Restaurant menu style with food imagery',
      'Retail sale design with attention-grabbing elements',
      'App download style with mobile-first approach',
    ],
  },
];

/**
 * Get style recommendations
 */
export const AI_STYLE_RECOMMENDATIONS = {
  modern: {
    name: 'Modern',
    description: 'Clean lines, gradients, contemporary feel',
    bestFor: 'Tech, startups, innovation',
  },
  classic: {
    name: 'Classic',
    description: 'Timeless, professional, traditional',
    bestFor: 'Corporate, finance, law',
  },
  playful: {
    name: 'Playful',
    description: 'Fun, colorful, energetic',
    bestFor: 'Kids, entertainment, casual',
  },
  professional: {
    name: 'Professional',
    description: 'Polished, trustworthy, refined',
    bestFor: 'Business, consulting, services',
  },
  artistic: {
    name: 'Artistic',
    description: 'Creative, unique, expressive',
    bestFor: 'Art, design, culture',
  },
};
