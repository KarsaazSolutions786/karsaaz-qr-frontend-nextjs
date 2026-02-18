/**
 * Fill Handlers Utility
 * 
 * Helper functions for managing fill configurations (solid, gradient, image).
 * Provides conversion, validation, and manipulation utilities.
 */

import { FillConfig, SolidFill, GradientFill, ImageFill } from '@/types/entities/designer';

/**
 * Create solid fill
 */
export function createSolidFill(color: string): SolidFill {
  return {
    type: 'solid',
    color,
  };
}

/**
 * Create gradient fill
 */
export function createGradientFill(
  startColor: string,
  endColor: string,
  gradientType: 'linear' | 'radial' = 'linear',
  rotation: number = 0
): GradientFill {
  return {
    type: 'gradient',
    gradientType,
    startColor,
    endColor,
    rotation,
  };
}

/**
 * Create image fill
 */
export function createImageFill(imageUrl: string, opacity: number = 1): ImageFill {
  return {
    type: 'image',
    imageUrl,
    opacity,
  };
}

/**
 * Check if fill is solid
 */
export function isSolidFill(fill: FillConfig): fill is SolidFill {
  return fill.type === 'solid';
}

/**
 * Check if fill is gradient
 */
export function isGradientFill(fill: FillConfig): fill is GradientFill {
  return fill.type === 'gradient';
}

/**
 * Check if fill is image
 */
export function isImageFill(fill: FillConfig): fill is ImageFill {
  return fill.type === 'image';
}

/**
 * Get primary color from fill (for UI display)
 */
export function getPrimaryColor(fill: FillConfig): string {
  if (isSolidFill(fill)) {
    return fill.color;
  }

  if (isGradientFill(fill)) {
    return fill.startColor;
  }

  return '#000000'; // Default for image fills
}

/**
 * Convert fill to CSS background
 */
export function fillToCSS(fill: FillConfig): string {
  if (isSolidFill(fill)) {
    return fill.color;
  }

  if (isGradientFill(fill)) {
    if (fill.gradientType === 'linear') {
      const angle = fill.rotation ?? 0;
      return `linear-gradient(${angle}deg, ${fill.startColor}, ${fill.endColor})`;
    } else {
      return `radial-gradient(circle, ${fill.startColor}, ${fill.endColor})`;
    }
  }

  if (isImageFill(fill)) {
    return `url(${fill.imageUrl})`;
  }

  return '#000000';
}

/**
 * Convert fill to SVG definition
 */
export function fillToSVGDefinition(fill: FillConfig, id: string): string {
  if (isSolidFill(fill)) {
    // Solid fills don't need definitions
    return '';
  }

  if (isGradientFill(fill)) {
    if (fill.gradientType === 'linear') {
      const rad = ((fill.rotation ?? 0) * Math.PI) / 180;
      const x1 = 50 - 50 * Math.cos(rad);
      const y1 = 50 - 50 * Math.sin(rad);
      const x2 = 50 + 50 * Math.cos(rad);
      const y2 = 50 + 50 * Math.sin(rad);

      return `
        <linearGradient id="${id}" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
          <stop offset="0%" stop-color="${fill.startColor}"/>
          <stop offset="100%" stop-color="${fill.endColor}"/>
        </linearGradient>
      `;
    } else {
      return `
        <radialGradient id="${id}">
          <stop offset="0%" stop-color="${fill.startColor}"/>
          <stop offset="100%" stop-color="${fill.endColor}"/>
        </radialGradient>
      `;
    }
  }

  if (isImageFill(fill)) {
    return `
      <pattern id="${id}" patternUnits="userSpaceOnUse" width="100%" height="100%">
        <image href="${fill.imageUrl}" width="100%" height="100%" opacity="${fill.opacity ?? 1}"/>
      </pattern>
    `;
  }

  return '';
}

/**
 * Get SVG fill reference
 */
export function fillToSVGReference(fill: FillConfig, id: string): string {
  if (isSolidFill(fill)) {
    return fill.color;
  }

  return `url(#${id})`;
}

/**
 * Validate fill configuration
 */
export function validateFill(fill: FillConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (isSolidFill(fill)) {
    if (!/^#[0-9A-F]{6}$/i.test(fill.color)) {
      errors.push('Invalid hex color format');
    }
  }

  if (isGradientFill(fill)) {
    if (!/^#[0-9A-F]{6}$/i.test(fill.startColor)) {
      errors.push('Invalid start color format');
    }
    if (!/^#[0-9A-F]{6}$/i.test(fill.endColor)) {
      errors.push('Invalid end color format');
    }
    if (fill.rotation !== undefined && (fill.rotation < 0 || fill.rotation > 360)) {
      errors.push('Rotation must be between 0 and 360 degrees');
    }
  }

  if (isImageFill(fill)) {
    if (!fill.imageUrl || fill.imageUrl.trim() === '') {
      errors.push('Image URL is required');
    }
    if (fill.opacity !== undefined && (fill.opacity < 0 || fill.opacity > 1)) {
      errors.push('Opacity must be between 0 and 1');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Clone fill configuration
 */
export function cloneFill(fill: FillConfig): FillConfig {
  return JSON.parse(JSON.stringify(fill));
}

/**
 * Merge fills (for partial updates)
 */
export function mergeFill(base: FillConfig, updates: Partial<FillConfig>): FillConfig {
  return {
    ...base,
    ...updates,
  } as FillConfig;
}

/**
 * Invert colors (for contrast)
 */
export function invertFillColors(fill: FillConfig): FillConfig {
  if (isSolidFill(fill)) {
    return createSolidFill(invertColor(fill.color));
  }

  if (isGradientFill(fill)) {
    return createGradientFill(
      invertColor(fill.endColor),
      invertColor(fill.startColor),
      fill.gradientType,
      fill.rotation
    );
  }

  return fill; // Can't invert image fills
}

/**
 * Invert hex color
 */
function invertColor(hex: string): string {
  const rgb = parseInt(hex.slice(1), 16);
  const r = 255 - ((rgb >> 16) & 0xff);
  const g = 255 - ((rgb >> 8) & 0xff);
  const b = 255 - (rgb & 0xff);

  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

/**
 * Lighten/darken color
 */
export function adjustFillBrightness(fill: FillConfig, amount: number): FillConfig {
  if (isSolidFill(fill)) {
    return createSolidFill(adjustColorBrightness(fill.color, amount));
  }

  if (isGradientFill(fill)) {
    return createGradientFill(
      adjustColorBrightness(fill.startColor, amount),
      adjustColorBrightness(fill.endColor, amount),
      fill.gradientType,
      fill.rotation
    );
  }

  return fill;
}

/**
 * Adjust hex color brightness
 */
function adjustColorBrightness(hex: string, amount: number): string {
  const num = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.min(255, ((num >> 16) & 0xff) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + amount));
  const b = Math.max(0, Math.min(255, (num & 0xff) + amount));

  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

/**
 * Get fill description (for UI)
 */
export function getFillDescription(fill: FillConfig): string {
  if (isSolidFill(fill)) {
    return `Solid color: ${fill.color}`;
  }

  if (isGradientFill(fill)) {
    return `${fill.gradientType === 'linear' ? 'Linear' : 'Radial'} gradient: ${fill.startColor} → ${fill.endColor}`;
  }

  if (isImageFill(fill)) {
    return `Image fill`;
  }

  return 'Unknown fill';
}
