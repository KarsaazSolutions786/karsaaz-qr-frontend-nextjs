/**
 * QR Code Designer Configuration Types
 * 
 * Defines all visual customization options for QR codes including
 * module shapes, corner styles, fills, logos, backgrounds, and AI designs.
 */

// Module/Pattern Shapes
export type ModuleShape = 
  | 'square'
  | 'rounded'
  | 'dots'
  | 'circular'
  | 'diamond'
  | 'classy'
  | 'classy-rounded';

// Corner Styles
export type CornerFrameStyle =
  | 'square'
  | 'rounded'
  | 'extra-rounded'
  | 'circular'
  | 'dot';

export type CornerDotStyle =
  | 'square'
  | 'rounded'
  | 'dot';

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

export interface LogoConfig {
  url: string;
  size: number; // 0-1 (percentage of QR code size)
  margin: number; // Margin around logo in modules
  shape: LogoShape;
  borderWidth?: number; // Border width in pixels
  borderColor?: string; // Hex color
  backgroundColor?: string; // Background behind logo
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

// Complete Designer Configuration
export interface DesignerConfig {
  // Module customization
  moduleShape: ModuleShape;
  
  // Corner customization
  cornerFrameStyle: CornerFrameStyle;
  cornerDotStyle: CornerDotStyle;
  
  // Fill customization
  foregroundFill: FillConfig;
  
  // Logo (optional)
  logo?: LogoConfig;
  
  // Background
  background: BackgroundConfig;
  
  // Outline (optional)
  outline?: OutlineConfig;
  
  // AI Design (optional)
  aiDesign?: AIDesignConfig;
  
  // Size settings
  size: number; // Base size in pixels (default: 600)
  margin: number; // Quiet zone margin in modules (default: 4)
  
  // Error correction level
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H'; // Low, Medium, Quartile, High
}

// Default designer configuration
export const DEFAULT_DESIGNER_CONFIG: DesignerConfig = {
  moduleShape: 'square',
  cornerFrameStyle: 'square',
  cornerDotStyle: 'square',
  foregroundFill: {
    type: 'solid',
    color: '#000000',
  },
  background: {
    type: 'solid',
    color: '#FFFFFF',
  },
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
      cornerFrameStyle: 'square',
      cornerDotStyle: 'square',
    },
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Rounded corners with dots',
    config: {
      moduleShape: 'dots',
      cornerFrameStyle: 'rounded',
      cornerDotStyle: 'dot',
    },
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Circular modules with gradient',
    config: {
      moduleShape: 'circular',
      cornerFrameStyle: 'circular',
      cornerDotStyle: 'dot',
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
      cornerFrameStyle: 'rounded',
      cornerDotStyle: 'dot',
      foregroundFill: {
        type: 'solid',
        color: '#FF6B6B',
      },
    },
  },
];
