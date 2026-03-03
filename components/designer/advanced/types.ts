import type { AdvancedShapeSettings } from '../fields/AdvancedShapesFields'

export interface QRDesign {
  // Colors
  foregroundColor: string
  backgroundColor: string
  gradient?: {
    type: 'linear' | 'radial' | 'none'
    colors: Array<{ color: string; position: number }>
    angle?: number
  }

  // Shapes
  moduleShape: 'square' | 'rounded' | 'dots' | 'hearts' | 'stars' | 'custom'
  moduleSize: number
  moduleSpacing: number

  // Pattern
  pattern?: {
    type:
      | 'dots'
      | 'squares'
      | 'hexagons'
      | 'diamonds'
      | 'stripes-h'
      | 'stripes-v'
      | 'triangles'
      | 'waves'
      | 'custom'
      | 'none'
    color: string
    density: number
    customImage?: string
    rotation?: number
    scale?: number
  }

  // Logo
  logo?: {
    url: string
    size: number
    padding: number
    backgroundColor?: string
  }

  // Advanced
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H'
  quietZone: number
  roundedCorners: boolean
  cornerRadius: number

  // Fill type (solid | gradient | image)
  fillType?: 'solid' | 'gradient' | 'image'
  foregroundImage?: string // URL of uploaded image for 'image' fill type

  // Sticker / advanced shape
  sticker?: AdvancedShapeSettings

  // Effects
  shadow?: {
    enabled: boolean
    offsetX: number
    offsetY: number
    blur: number
    spread: number
    color: string
    opacity: number
  }
  stroke?: {
    enabled: boolean
    width: number
    color: string
    opacity: number
  }
  depth?: {
    enabled: boolean
    perspective: number
    rotateX: number
    rotateY: number
  }
}

export interface AdvancedDesignerProps {
  design: QRDesign
  onChange: (design: QRDesign) => void
  qrData: string
}

export const defaultDesign: QRDesign = {
  foregroundColor: '#000000',
  backgroundColor: '#ffffff',
  moduleShape: 'square',
  moduleSize: 4,
  moduleSpacing: 0,
  errorCorrectionLevel: 'M',
  quietZone: 4,
  roundedCorners: false,
  cornerRadius: 0,
}

export const designPresets = [
  {
    name: 'Classic',
    design: { ...defaultDesign },
  },
  {
    name: 'Modern',
    design: {
      ...defaultDesign,
      moduleShape: 'rounded' as const,
      gradient: {
        type: 'linear' as const,
        colors: [
          { color: '#667eea', position: 0 },
          { color: '#764ba2', position: 100 },
        ],
        angle: 45,
      },
    },
  },
  {
    name: 'Elegant',
    design: {
      ...defaultDesign,
      moduleShape: 'dots' as const,
      foregroundColor: '#2d3748',
      backgroundColor: '#f7fafc',
      roundedCorners: true,
      cornerRadius: 8,
    },
  },
  {
    name: 'Vibrant',
    design: {
      ...defaultDesign,
      gradient: {
        type: 'radial' as const,
        colors: [
          { color: '#f093fb', position: 0 },
          { color: '#f5576c', position: 100 },
        ],
      },
    },
  },
]
