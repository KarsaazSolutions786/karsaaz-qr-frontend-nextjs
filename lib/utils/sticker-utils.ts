/**
 * Sticker Utilities
 * 
 * Validation, positioning, and manipulation utilities for QR code stickers.
 */

import { Sticker, StickerConfig, StickerPosition, StickerCategory } from '@/types/entities/sticker';

// Validation configuration
const STICKER_CONSTRAINTS = {
  MAX_FILE_SIZE: 2 * 1024 * 1024, // 2MB
  ALLOWED_TYPES: ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'],
  ALLOWED_EXTENSIONS: ['.png', '.jpg', '.jpeg', '.svg', '.webp'],
  MIN_SIZE: 0.05, // 5% of QR size
  MAX_SIZE: 0.5, // 50% of QR size
  MAX_ROTATION: 360,
  MIN_OPACITY: 0.1,
  MAX_OPACITY: 1.0,
};

/**
 * Validate sticker file
 */
export function validateStickerFile(file: File): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check file type
  if (!STICKER_CONSTRAINTS.ALLOWED_TYPES.includes(file.type)) {
    errors.push(`Invalid file type. Allowed: ${STICKER_CONSTRAINTS.ALLOWED_EXTENSIONS.join(', ')}`);
  }

  // Check file size
  if (file.size > STICKER_CONSTRAINTS.MAX_FILE_SIZE) {
    errors.push(`File too large. Maximum size: ${STICKER_CONSTRAINTS.MAX_FILE_SIZE / 1024 / 1024}MB`);
  }

  // Check file extension
  const extension = file.name.toLowerCase().match(/\.[^.]+$/)?.[0];
  if (extension && !STICKER_CONSTRAINTS.ALLOWED_EXTENSIONS.includes(extension)) {
    errors.push(`Invalid file extension. Allowed: ${STICKER_CONSTRAINTS.ALLOWED_EXTENSIONS.join(', ')}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate sticker configuration
 */
export function validateStickerConfig(config: StickerConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check URL
  if (!config.url || config.url.trim() === '') {
    errors.push('Sticker URL is required');
  }

  // Check size
  if (config.size < STICKER_CONSTRAINTS.MIN_SIZE) {
    errors.push(`Sticker size too small. Minimum: ${STICKER_CONSTRAINTS.MIN_SIZE * 100}%`);
  }
  if (config.size > STICKER_CONSTRAINTS.MAX_SIZE) {
    errors.push(`Sticker size too large. Maximum: ${STICKER_CONSTRAINTS.MAX_SIZE * 100}%`);
  }

  // Check rotation
  if (config.rotation !== undefined) {
    if (config.rotation < 0 || config.rotation > STICKER_CONSTRAINTS.MAX_ROTATION) {
      errors.push(`Rotation must be between 0 and ${STICKER_CONSTRAINTS.MAX_ROTATION} degrees`);
    }
  }

  // Check opacity
  if (config.opacity !== undefined) {
    if (config.opacity < STICKER_CONSTRAINTS.MIN_OPACITY || config.opacity > STICKER_CONSTRAINTS.MAX_OPACITY) {
      errors.push(`Opacity must be between ${STICKER_CONSTRAINTS.MIN_OPACITY} and ${STICKER_CONSTRAINTS.MAX_OPACITY}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Calculate optimal sticker size based on QR code size
 */
export function getOptimalStickerSize(qrSize: number): number {
  // Default to 20% of QR size, but scale based on QR dimensions
  if (qrSize <= 256) return 0.25; // 25% for small QR codes
  if (qrSize <= 512) return 0.20; // 20% for medium QR codes
  if (qrSize <= 1024) return 0.15; // 15% for large QR codes
  return 0.12; // 12% for very large QR codes
}

/**
 * Calculate sticker dimensions in pixels
 */
export function calculateStickerDimensions(
  stickerSize: number,
  qrSize: number
): { width: number; height: number } {
  const size = qrSize * stickerSize;
  return { width: size, height: size };
}

/**
 * Calculate sticker position in pixels
 */
export function calculateStickerPosition(
  position: StickerPosition,
  qrSize: number,
  stickerSize: number
): { x: number; y: number } {
  const { x: xPercent, y: yPercent } = position.preset === 'custom' && position.x !== undefined && position.y !== undefined
    ? { x: position.x, y: position.y }
    : getStickerPositionPreset(position.preset);

  const stickerDimensions = calculateStickerDimensions(stickerSize, qrSize);

  // Calculate pixel position (accounting for sticker size)
  let x = xPercent * qrSize;
  let y = yPercent * qrSize;

  // Adjust for different anchor points
  if (xPercent === 0) {
    // Left aligned - no adjustment
  } else if (xPercent === 1) {
    // Right aligned - subtract sticker width
    x -= stickerDimensions.width;
  } else {
    // Center aligned - subtract half sticker width
    x -= stickerDimensions.width / 2;
  }

  if (yPercent === 0) {
    // Top aligned - no adjustment
  } else if (yPercent === 1) {
    // Bottom aligned - subtract sticker height
    y -= stickerDimensions.height;
  } else {
    // Center aligned - subtract half sticker height
    y -= stickerDimensions.height / 2;
  }

  return { x, y };
}

/**
 * Get position coordinates from preset
 */
function getStickerPositionPreset(preset: string): { x: number; y: number } {
  const presets: Record<string, { x: number; y: number }> = {
    top: { x: 0.5, y: 0 },
    bottom: { x: 0.5, y: 1 },
    left: { x: 0, y: 0.5 },
    right: { x: 1, y: 0.5 },
    'top-left': { x: 0, y: 0 },
    'top-right': { x: 1, y: 0 },
    'bottom-left': { x: 0, y: 1 },
    'bottom-right': { x: 1, y: 1 },
    custom: { x: 0.5, y: 1 },
  };
  return presets[preset] || presets.bottom;
}

/**
 * Compress sticker image
 */
export async function compressStickerImage(file: File, maxSize: number = 512): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        // Calculate new dimensions
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = (height * maxSize) / width;
            width = maxSize;
          } else {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert to data URL
        resolve(canvas.toDataURL('image/png', 0.9));
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Filter stickers by category
 */
export function filterStickersByCategory(
  stickers: Sticker[],
  category: StickerCategory | 'all'
): Sticker[] {
  if (category === 'all') return stickers;
  return stickers.filter((s) => s.category === category);
}

/**
 * Filter stickers by search query
 */
export function filterStickersBySearch(stickers: Sticker[], query: string): Sticker[] {
  if (!query || query.trim() === '') return stickers;

  const lowerQuery = query.toLowerCase().trim();
  return stickers.filter(
    (s) =>
      s.name.toLowerCase().includes(lowerQuery) ||
      s.category.toLowerCase().includes(lowerQuery) ||
      s.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Sort stickers
 */
export function sortStickers(
  stickers: Sticker[],
  sortBy: 'name' | 'category' | 'recent' = 'name'
): Sticker[] {
  const sorted = [...stickers];

  switch (sortBy) {
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'category':
      return sorted.sort((a, b) => a.category.localeCompare(b.category));
    case 'recent':
      return sorted.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA; // Most recent first
      });
    default:
      return sorted;
  }
}

/**
 * Get category display name
 */
export function getCategoryDisplayName(category: StickerCategory | 'all'): string {
  const names: Record<string, string> = {
    all: 'All Stickers',
    'call-to-action': 'Call to Action',
    'social-media': 'Social Media',
    contact: 'Contact',
    business: 'Business',
    events: 'Events',
    seasonal: 'Seasonal',
    custom: 'Custom',
  };
  return names[category] || category;
}

/**
 * Get category icon
 */
export function getCategoryIcon(category: StickerCategory | 'all'): string {
  const icons: Record<string, string> = {
    all: '🎨',
    'call-to-action': '👆',
    'social-media': '📱',
    contact: '📞',
    business: '💼',
    events: '🎉',
    seasonal: '🎄',
    custom: '✏️',
  };
  return icons[category] || '📌';
}

/**
 * Create default sticker config
 */
export function createDefaultStickerConfig(stickerId: string, stickerUrl: string): StickerConfig {
  return {
    id: stickerId,
    url: stickerUrl,
    position: {
      preset: 'bottom',
    },
    size: 0.2, // 20% of QR size
    rotation: 0,
    opacity: 1.0,
  };
}

/**
 * Estimate sticker file upload time
 */
export function estimateUploadTime(fileSize: number): number {
  // Assume 1MB/s upload speed
  const seconds = fileSize / (1024 * 1024);
  return Math.max(1, Math.ceil(seconds)) * 1000; // Return milliseconds
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Check if sticker overlaps with QR code critical areas
 */
export function checkStickerOverlap(
  position: StickerPosition,
  size: number,
  qrSize: number
): { hasOverlap: boolean; warnings: string[] } {
  const warnings: string[] = [];
  const { x, y } = calculateStickerPosition(position, qrSize, size);
  const dimensions = calculateStickerDimensions(size, qrSize);

  // Check overlap with corners (finder patterns at 0,0  1,0  0,1 - each 7 modules)
  const cornerSize = qrSize * 0.15; // Approximate corner size

  // Top-left corner
  if (x < cornerSize && y < cornerSize) {
    warnings.push('Sticker may overlap with top-left corner pattern');
  }

  // Top-right corner
  if (x + dimensions.width > qrSize - cornerSize && y < cornerSize) {
    warnings.push('Sticker may overlap with top-right corner pattern');
  }

  // Bottom-left corner
  if (x < cornerSize && y + dimensions.height > qrSize - cornerSize) {
    warnings.push('Sticker may overlap with bottom-left corner pattern');
  }

  return {
    hasOverlap: warnings.length > 0,
    warnings,
  };
}
