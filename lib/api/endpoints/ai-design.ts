// AI Design API Endpoints

export interface AIDesignRequest {
  prompt: string;
  style: 'modern' | 'vintage' | 'minimalist' | 'playful' | 'professional' | 'artistic';
  colorScheme: 'monochrome' | 'vibrant' | 'pastel' | 'dark' | 'light' | 'neon';
  variations?: number;
}

export interface AIDesignResponse {
  id: string;
  foregroundColor: string;
  backgroundColor: string;
  pattern: string;
  cornerStyle: string;
  dotStyle: string;
  gradient?: {
    type: 'linear' | 'radial';
    colors: string[];
    angle?: number;
  };
  metadata?: {
    confidence: number;
    tags: string[];
    description: string;
  };
}

export interface DesignSuggestion {
  category: string;
  prompts: string[];
  examples: {
    prompt: string;
    preview: AIDesignResponse;
  }[];
}

// Color palettes based on schemes
const COLOR_SCHEMES = {
  monochrome: {
    foreground: ['#000000', '#1A1A1A', '#333333', '#4D4D4D'],
    background: ['#FFFFFF', '#F5F5F5', '#E8E8E8', '#D3D3D3'],
  },
  vibrant: {
    foreground: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'],
    background: ['#FFFFFF', '#FFF5E1', '#F0F8FF', '#FFF0F5', '#F5FFFA'],
  },
  pastel: {
    foreground: ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF'],
    background: ['#FFFFFF', '#FFF9F9', '#FFFEF9', '#F9FFF9', '#F9F9FF'],
  },
  dark: {
    foreground: ['#FFFFFF', '#E0E0E0', '#C0C0C0', '#A0A0A0'],
    background: ['#1A1A2E', '#16213E', '#0F3460', '#1C1C1C', '#2C2C2C'],
  },
  light: {
    foreground: ['#333333', '#555555', '#666666', '#777777'],
    background: ['#FFFFFF', '#F8F9FA', '#E9ECEF', '#DEE2E6', '#CED4DA'],
  },
  neon: {
    foreground: ['#FF00FF', '#00FFFF', '#FFFF00', '#FF6600', '#00FF00'],
    background: ['#000000', '#0A0A0A', '#141414', '#1E1E1E'],
  },
};

// Pattern styles based on design style
const STYLE_PATTERNS = {
  modern: ['dots', 'rounded', 'classy'],
  vintage: ['squares', 'classy-rounded'],
  minimalist: ['dots', 'rounded'],
  playful: ['extra-rounded', 'classy-rounded'],
  professional: ['classy', 'rounded'],
  artistic: ['extra-rounded', 'classy-rounded', 'dots'],
};

// Corner and dot styles
const CORNER_STYLES = ['square', 'extra-rounded', 'dot'];
const DOT_STYLES = ['square', 'rounded', 'classy', 'extra-rounded', 'classy-rounded'];

/**
 * Generate an AI-powered QR code design
 * @param request - Design generation request
 * @returns Promise<AIDesignResponse>
 */
export async function generateDesign(
  request: AIDesignRequest
): Promise<AIDesignResponse> {
  // In production, this would call an actual AI API
  // For now, we'll generate designs based on the parameters

  try {
    const { prompt, style, colorScheme, variations: _variations = 1 } = request;

    // Analyze prompt for keywords
    const keywords = extractKeywords(prompt.toLowerCase());
    
    // Select colors based on scheme and keywords
    const colors = selectColors(colorScheme, keywords);
    
    // Select pattern based on style
    const pattern = selectPattern(style, keywords);
    
    // Select corner and dot styles
    const cornerStyle = selectCornerStyle(style);
    const dotStyle = selectDotStyle(style);
    
    // Determine if gradient should be used
    const useGradient = shouldUseGradient(prompt, style);
    
    const design: AIDesignResponse = {
      id: generateId(),
      foregroundColor: colors.foreground,
      backgroundColor: colors.background,
      pattern,
      cornerStyle,
      dotStyle,
      gradient: useGradient ? {
        type: 'linear',
        colors: [colors.foreground, adjustColor(colors.foreground, 30)],
        angle: 135,
      } : undefined,
      metadata: {
        confidence: 0.85 + Math.random() * 0.15,
        tags: keywords,
        description: `${style} style QR code with ${colorScheme} colors`,
      },
    };

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    return design;
  } catch (error) {
    console.error('Failed to generate design:', error);
    throw new Error('Failed to generate AI design. Please try again.');
  }
}

/**
 * Generate multiple design variations
 * @param request - Design generation request
 * @returns Promise<AIDesignResponse[]>
 */
export async function generateDesignVariations(
  request: AIDesignRequest
): Promise<AIDesignResponse[]> {
  const variations = request.variations || 3;
  const designs: AIDesignResponse[] = [];

  for (let i = 0; i < variations; i++) {
    const design = await generateDesign({ ...request, variations: 1 });
    designs.push(design);
  }

  return designs;
}

/**
 * Get design suggestions and examples
 * @returns Promise<DesignSuggestion[]>
 */
export async function getDesignSuggestions(): Promise<DesignSuggestion[]> {
  return [
    {
      category: 'Business',
      prompts: [
        'Professional QR code for corporate website',
        'Modern business card QR with company colors',
        'Elegant QR code for luxury brand',
      ],
      examples: [],
    },
    {
      category: 'Events',
      prompts: [
        'Fun party invitation QR code',
        'Wedding QR code with romantic colors',
        'Conference badge QR with tech theme',
      ],
      examples: [],
    },
    {
      category: 'Marketing',
      prompts: [
        'Eye-catching promotional QR code',
        'Social media QR with vibrant colors',
        'Product packaging QR code',
      ],
      examples: [],
    },
    {
      category: 'Personal',
      prompts: [
        'Personal portfolio QR code',
        'Contact card QR with minimalist design',
        'Creative artist QR code',
      ],
      examples: [],
    },
  ];
}

// Helper functions

function extractKeywords(text: string): string[] {
  const keywords: string[] = [];
  
  // Color keywords
  const colorWords = ['blue', 'red', 'green', 'purple', 'orange', 'pink', 'yellow'];
  colorWords.forEach(color => {
    if (text.includes(color)) keywords.push(color);
  });
  
  // Style keywords
  const styleWords = ['modern', 'vintage', 'retro', 'minimal', 'elegant', 'fun', 'professional'];
  styleWords.forEach(style => {
    if (text.includes(style)) keywords.push(style);
  });
  
  // Theme keywords
  const themeWords = ['tech', 'business', 'creative', 'artistic', 'corporate', 'luxury'];
  themeWords.forEach(theme => {
    if (text.includes(theme)) keywords.push(theme);
  });
  
  return keywords;
}

function selectColors(
  scheme: AIDesignRequest['colorScheme'],
  keywords: string[]
): { foreground: string; background: string } {
  const palette = COLOR_SCHEMES[scheme];
  
  // Select colors based on keywords if available
  let foreground = palette.foreground[Math.floor(Math.random() * palette.foreground.length)] ?? '#000000';
  let background = palette.background[Math.floor(Math.random() * palette.background.length)] ?? '#FFFFFF';
  
  // Adjust based on color keywords
  if (keywords.includes('blue')) {
    foreground = '#4169E1';
  } else if (keywords.includes('red')) {
    foreground = '#DC143C';
  } else if (keywords.includes('green')) {
    foreground = '#2ECC71';
  } else if (keywords.includes('purple')) {
    foreground = '#9B59B6';
  }
  
  return { foreground, background };
}

function selectPattern(
  style: AIDesignRequest['style'],
  _keywords: string[]
): string {
  const patterns = STYLE_PATTERNS[style];
  return patterns[Math.floor(Math.random() * patterns.length)] ?? 'square';
}

function selectCornerStyle(style: AIDesignRequest['style']): string {
  if (style === 'modern' || style === 'minimalist') {
    return 'extra-rounded';
  } else if (style === 'vintage') {
    return 'square';
  } else {
    return CORNER_STYLES[Math.floor(Math.random() * CORNER_STYLES.length)] ?? 'square';
  }
}

function selectDotStyle(style: AIDesignRequest['style']): string {
  if (style === 'modern') {
    return 'rounded';
  } else if (style === 'vintage') {
    return 'square';
  } else if (style === 'playful') {
    return 'extra-rounded';
  } else {
    return DOT_STYLES[Math.floor(Math.random() * DOT_STYLES.length)] ?? 'square';
  }
}

function shouldUseGradient(prompt: string, style: AIDesignRequest['style']): boolean {
  const gradientKeywords = ['gradient', 'modern', 'vibrant', 'colorful'];
  const hasGradientKeyword = gradientKeywords.some(keyword => 
    prompt.toLowerCase().includes(keyword)
  );
  
  return hasGradientKeyword || (style === 'modern' && Math.random() > 0.5);
}

function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
  
  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

function generateId(): string {
  return `ai-design-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}


