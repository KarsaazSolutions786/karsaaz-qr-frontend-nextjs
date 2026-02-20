/**
 * QR Code Designer Configuration Types
 * 
 * Defines all visual customization options for QR codes including
 * module shapes, corner styles, fills, logos, backgrounds, and AI designs.
 * 
 * IMPORTANT: Shape values must match the legacy Lit frontend exactly
 * for backend compatibility.
 */

// Module/Pattern Shapes — matches legacy module-fields.js (15 options)
export type ModuleShape = 
  | 'square'
  | 'dots'
  | 'triangle'
  | 'rhombus'
  | 'star-5'
  | 'star-7'
  | 'roundness'
  | 'vertical-lines'
  | 'horizontal-lines'
  | 'diamond'
  | 'fish'
  | 'tree'
  | 'twoTrianglesWithCircle'
  | 'fourTriangles'
  | 'triangle-end';

// Finder (eye frame) Styles — matches legacy module-fields.js (9 options)
export type FinderStyle =
  | 'default'
  | 'eye-shaped'
  | 'octagon'
  | 'rounded-corners'
  | 'whirlpool'
  | 'water-drop'
  | 'circle'
  | 'zigzag'
  | 'circle-dots';

// Finder Dot Styles — matches legacy module-fields.js (8 options)
export type FinderDotStyle =
  | 'default'
  | 'eye-shaped'
  | 'octagon'
  | 'rounded-corners'
  | 'whirlpool'
  | 'water-drop'
  | 'circle'
  | 'zigzag';

// Keep old types as aliases for backward compat
export type CornerFrameStyle = FinderStyle;
export type CornerDotStyle = FinderDotStyle;

// Fill Types
export type FillType =
  | 'solid'
  | 'gradient'
  | 'image';

export type GradientType =
  | 'linear'
  | 'radial';

export interface SolidFill {
  type: 'solid';
  color: string; // Hex color
}

export interface GradientFill {
  type: 'gradient';
  gradientType: GradientType;
  startColor: string; // Hex color
  endColor: string; // Hex color
  rotation?: number; // 0-360 degrees (for linear)
}

export interface ImageFill {
  type: 'image';
  imageUrl: string;
  opacity?: number; // 0-1
}

export type FillConfig = SolidFill | GradientFill | ImageFill;

// Logo Configuration
export type LogoShape = 'square' | 'circle';
export type LogoType = 'preset' | 'custom';

export interface LogoConfig {
  url: string;
  logoType?: LogoType; // preset or custom upload (default: 'preset')
  size: number; // 0-1 (percentage of QR code size) — maps to logoScale
  margin: number; // Margin around logo in modules
  shape: LogoShape;
  borderWidth?: number;
  borderColor?: string;
  backgroundColor?: string;
  // Position controls (defaults: centered, no rotation)
  positionX?: number; // 0-1 horizontal (0.5 = center)
  positionY?: number; // 0-1 vertical (0.5 = center)
  rotate?: number; // 0-360 degrees
  // Background controls (defaults: enabled, white circle, 1.3x)
  backgroundEnabled?: boolean;
  backgroundFill?: string; // hex color for background behind logo
  backgroundScale?: number; // 0.3-2 (multiplier of logo area)
  backgroundShape?: LogoShape; // circle or square
}

// Background Configuration
export type BackgroundType =
  | 'solid'
  | 'gradient'
  | 'image'
  | 'transparent';

export interface BackgroundConfig {
  type: BackgroundType;
  color?: string; // For solid
  gradientStart?: string; // For gradient
  gradientEnd?: string; // For gradient
  gradientType?: GradientType; // For gradient
  imageUrl?: string; // For image
  imageOpacity?: number; // 0-1 for image
}

// Outline Configuration
export interface OutlineConfig {
  enabled: boolean;
  color?: string; // Hex color
  width?: number; // Width in pixels
}

// AI Design Configuration
export interface AIDesignConfig {
  prompt?: string;
  style?: 'modern' | 'classic' | 'playful' | 'professional' | 'artistic';
  generated?: boolean;
  designId?: string; // Reference to generated design
}

// Gradient Fill Configuration (backend format with multi-stop support)
export interface GradientFillConfig {
  type: string; // LINEAR, RADIAL
  colors: Array<{
    color: string;
    stop: number; // 0-100
    opacity: number; // 0-1
    id?: string;
  }>;
  angle?: number; // 0-360 for LINEAR
}

// Complete Designer Configuration
export interface DesignerConfig {
  // Module customization
  moduleShape: ModuleShape;
  
  // Finder (eye) customization — uses legacy naming
  finder: FinderStyle;
  finderDot: FinderDotStyle;
  // Keep old aliases working
  cornerFrameStyle?: FinderStyle;
  cornerDotStyle?: FinderDotStyle;
  
  // Eye colors (separate from foreground)
  eyeExternalColor: string;
  eyeInternalColor: string;
  
  // Fill customization
  foregroundFill: FillConfig;
  
  // Logo (optional)
  logo?: LogoConfig;
  
  // Background
  background: BackgroundConfig;
  
  // Outlined shape
  shape: string; // 60+ shapes or 'none'
  frameColor: string;
  
  // Advanced shape / sticker
  advancedShape: string; // 12 options or 'none'
  advancedShapeDropShadow: boolean;
  advancedShapeFrameColor: string;
  
  // Sticker text
  text: string;
  textColor: string;
  textBackgroundColor: string;
  fontFamily: string;
  textSize: number;
  
  // Sticker-specific fields
  healthcareFrameColor?: string;
  healthcareHeartColor?: string;
  reviewCollectorCircleColor?: string;
  reviewCollectorStarsColor?: string;
  reviewCollectorLogoSrc?: string;
  couponLeftColor?: string;
  couponRightColor?: string;
  couponTextLine1?: string;
  couponTextLine2?: string;
  couponTextLine3?: string;
  
  // Outline (optional)
  outline?: OutlineConfig;
  
  // AI Design (optional)
  aiDesign?: AIDesignConfig;
  isAi: boolean;
  aiPrompt?: string;
  aiStrength: number;
  aiSteps: number;
  
  // Size settings
  size: number; // Base size in pixels (default: 600)
  margin: number; // Quiet zone margin in modules (default: 4)
  
  // Error correction level
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  
  // Gradient (backend format — used in transformer)
  gradientFill?: GradientFillConfig;
}

// Default designer configuration — matches legacy state.js defaults
export const DEFAULT_DESIGNER_CONFIG: DesignerConfig = {
  moduleShape: 'square',
  finder: 'default',
  finderDot: 'default',
  eyeExternalColor: '#000000',
  eyeInternalColor: '#000000',
  foregroundFill: {
    type: 'solid',
    color: '#000000',
  },
  background: {
    type: 'solid',
    color: '#FFFFFF',
  },
  shape: 'none',
  frameColor: '#000000',
  advancedShape: 'none',
  advancedShapeDropShadow: true,
  advancedShapeFrameColor: '#000000',
  text: 'SCAN ME',
  textColor: '#ffffff',
  textBackgroundColor: '#1c57cb',
  fontFamily: 'Raleway',
  textSize: 1,
  isAi: false,
  aiStrength: 1.8,
  aiSteps: 18,
  size: 600,
  margin: 4,
  errorCorrectionLevel: 'M',
};

// Preset designs for quick selection
export interface DesignPreset {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  config: Partial<DesignerConfig>;
}

export const DESIGN_PRESETS: DesignPreset[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional square QR code',
    config: {
      moduleShape: 'square',
      finder: 'default',
      finderDot: 'default',
    },
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Rounded corners with dots',
    config: {
      moduleShape: 'dots',
      finder: 'rounded-corners',
      finderDot: 'circle',
    },
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Rounded modules with gradient',
    config: {
      moduleShape: 'roundness',
      finder: 'circle',
      finderDot: 'circle',
      foregroundFill: {
        type: 'gradient',
        gradientType: 'linear',
        startColor: '#667eea',
        endColor: '#764ba2',
        rotation: 45,
      },
    },
  },
  {
    id: 'playful',
    name: 'Playful',
    description: 'Diamond shapes with bright colors',
    config: {
      moduleShape: 'diamond',
      finder: 'rounded-corners',
      finderDot: 'circle',
      foregroundFill: {
        type: 'solid',
        color: '#FF6B6B',
      },
    },
  },
];
