/**
 * Color Utility Functions
 * RGB/Hex conversions and color manipulation helpers.
 */

/**
 * Convert RGB to hex color
 */
export function rgbToHex({ r, g, b }: { r: number; g: number; b: number }): string {
  const rgb = (r << 16) | (g << 8) | (b << 0)
  return '#' + (0x1000000 + rgb).toString(16).slice(1)
}

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1]!, 16),
        g: parseInt(result[2]!, 16),
        b: parseInt(result[3]!, 16),
      }
    : null
}
