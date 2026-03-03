export interface PatternSettings {
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

export const defaultPattern: PatternSettings = {
  type: 'none',
  color: '#e5e7eb',
  density: 50,
}
