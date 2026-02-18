/**
 * Background Utilities
 * 
 * Helper functions for background processing and validation.
 */

import { BackgroundConfig } from '@/types/entities/designer';

export interface BackgroundValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate background configuration
 */
export function validateBackgroundConfig(bg: BackgroundConfig): BackgroundValidationResult {
  const errors: string[] = [];
  const warnings: string[];

 = [];

  if (bg.type === 'solid') {
    if (bg.color && !/^#[0-9A-F]{6}$/i.test(bg.color)) {
      errors.push('Invalid background color format');
    }
  }

  if (bg.type === 'gradient') {
    if (!bg.gradientStart || !/^#[0-9A-F]{6}$/i.test(bg.gradientStart)) {
      errors.push('Invalid gradient start color format');
    }
    if (!bg.gradientEnd || !/^#[0-9A-F]{6}$/i.test(bg.gradientEnd)) {
      errors.push('Invalid gradient end color format');
    }
  }

  if (bg.type === 'image') {
    if (!bg.imageUrl || bg.imageUrl.trim() === '') {
      errors.push('Image URL is required');
    }
    if (bg.imageOpacity !== undefined && (bg.imageOpacity < 0 || bg.imageOpacity > 1)) {
      errors.push('Image opacity must be between 0 and 1');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Create default background config
 */
export function createDefaultBackgroundConfig(): BackgroundConfig {
  return {
    type: 'solid',
    color: '#FFFFFF',
  };
}

/**
 * Create transparent background
 */
export function createTransparentBackground(): BackgroundConfig {
  return {
    type: 'transparent',
  };
}

/**
 * Create solid background
 */
export function createSolidBackground(color: string): BackgroundConfig {
  return {
    type: 'solid',
    color,
  };
}

/**
 * Create gradient background
 */
export function createGradientBackground(
  startColor: string,
  endColor: string,
  gradientType: 'linear' | 'radial' = 'linear'
): BackgroundConfig {
  return {
    type: 'gradient',
    gradientStart: startColor,
    gradientEnd: endColor,
    gradientType,
  };
}

/**
 * Create image background
 */
export function createImageBackground(imageUrl: string, opacity: number = 1): BackgroundConfig {
  return {
    type: 'image',
    imageUrl,
    imageOpacity: opacity,
  };
}

/**
 * Check if background is transparent
 */
export function isTransparentBackground(bg: BackgroundConfig): boolean {
  return bg.type === 'transparent';
}

/**
 * Check if background is solid
 */
export function isSolidBackground(bg: BackgroundConfig): boolean {
  return bg.type === 'solid';
}

/**
 * Check if background is gradient
 */
export function isGradientBackground(bg: BackgroundConfig): boolean {
  return bg.type === 'gradient';
}

/**
 * Check if background is image
 */
export function isImageBackground(bg: BackgroundConfig): boolean {
  return bg.type === 'image';
}

/**
 * Get background CSS
 */
export function backgroundToCSS(bg: BackgroundConfig): string {
  if (bg.type === 'transparent') {
    return 'transparent';
  }

  if (bg.type === 'solid') {
    return bg.color || '#FFFFFF';
  }

  if (bg.type === 'gradient') {
    const gradType = bg.gradientType || 'linear';
    if (gradType === 'linear') {
      return `linear-gradient(0deg, ${bg.gradientStart}, ${bg.gradientEnd})`;
    } else {
      return `radial-gradient(circle, ${bg.gradientStart}, ${bg.gradientEnd})`;
    }
  }

  if (bg.type === 'image') {
    return `url(${bg.imageUrl})`;
  }

  return 'transparent';
}

/**
 * Get background description (for UI)
 */
export function getBackgroundDescription(bg: BackgroundConfig): string {
  if (bg.type === 'transparent') {
    return 'Transparent background';
  }

  if (bg.type === 'solid') {
    return `Solid color: ${bg.color}`;
  }

  if (bg.type === 'gradient') {
    const gradType = bg.gradientType === 'radial' ? 'Radial' : 'Linear';
    return `${gradType} gradient: ${bg.gradientStart} → ${bg.gradientEnd}`;
  }

  if (bg.type === 'image') {
    const opacity = bg.imageOpacity ?? 1;
    return `Image background (${Math.round(opacity * 100)}% opacity)`;
  }

  return 'Unknown background';
}

/**
 * Clone background config
 */
export function cloneBackgroundConfig(bg: BackgroundConfig): BackgroundConfig {
  return JSON.parse(JSON.stringify(bg));
}

/**
 * Compress background image
 */
export async function compressBackgroundImage(
  dataURL: string,
  maxWidth: number = 1024,
  maxHeight: number = 1024,
  quality: number = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;

      // Calculate new dimensions
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataURL;
  });
}

/**
 * Get dominant color from image
 */
export async function getDominantColor(imageUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // Sample center area
      const sampleSize = 50;
      canvas.width = sampleSize;
      canvas.height = sampleSize;

      ctx.drawImage(img, 0, 0, sampleSize, sampleSize);
      const imageData = ctx.getImageData(0, 0, sampleSize, sampleSize);
      const data = imageData.data;

      let r = 0, g = 0, b = 0;
      const pixels = data.length / 4;

      for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
      }

      r = Math.round(r / pixels);
      g = Math.round(g / pixels);
      b = Math.round(b / pixels);

      const hex = '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
      resolve(hex);
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageUrl;
  });
}

/**
 * Check if background provides good contrast
 */
export function hasGoodContrast(backgroundColor: string, foregroundColor: string): boolean {
  // Simple luminance calculation
  const getLuminance = (hex: string): number => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = ((rgb >> 16) & 0xff) / 255;
    const g = ((rgb >> 8) & 0xff) / 255;
    const b = (rgb & 0xff) / 255;

    const [rs, gs, bs] = [r, g, b].map(c =>
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    );

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const l1 = getLuminance(backgroundColor);
  const l2 = getLuminance(foregroundColor);

  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

  return ratio >= 4.5; // WCAG AA standard
}

/**
 * Suggest foreground color based on background
 */
export function suggestForegroundColor(bg: BackgroundConfig): string {
  if (bg.type === 'solid' && bg.color) {
    return hasGoodContrast(bg.color, '#000000') ? '#000000' : '#FFFFFF';
  }

  if (bg.type === 'gradient' && bg.gradientStart) {
    return hasGoodContrast(bg.gradientStart, '#000000') ? '#000000' : '#FFFFFF';
  }

  return '#000000'; // Default to black
}
