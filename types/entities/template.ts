/**
 * QR Code Template Entity Types
 */

export interface QRCodeTemplate {
  id: number
  name: string
  description?: string
  type: string
  category_id?: number
  category?: TemplateCategory
  template_access_level: 'public' | 'private'
  thumbnail_url?: string
  settings: Record<string, any>
  data: Record<string, any>
  design: TemplateDesign
  created_at: string
  updated_at: string
  user_id?: number
}

export interface TemplateCategory {
  id: number
  name: string
  slug: string
  description?: string
  icon?: string
  imageUrl?: string      // Category background image (image_url from API)
  textColor?: string     // Text color for category name overlay (text_color from API)
  sort_order?: number
  created_at: string
  updated_at: string
}

export interface TemplateDesign {
  // Colors
  foreground_color?: string
  background_color?: string
  
  // Gradient
  gradient_type?: 'linear' | 'radial' | 'none'
  gradient_colors?: string[]
  gradient_angle?: number
  
  // Pattern
  pattern_type?: 'dots' | 'squares' | 'custom' | 'none'
  pattern_color?: string
  
  // Logo
  logo_url?: string
  logo_size?: number
  logo_position?: 'center' | 'top' | 'bottom'
  logo_margin?: number
  
  // Sticker
  sticker_id?: number
  sticker_position?: string
  sticker_size?: number
  
  // Shapes
  module_shape?: 'square' | 'rounded' | 'dots' | 'custom'
  eye_shape?: 'square' | 'rounded' | 'custom'
  corner_shape?: 'square' | 'rounded' | 'extra-rounded'
  
  // Advanced
  error_correction?: 'L' | 'M' | 'Q' | 'H'
  margin?: number
  size?: number
  
  // AI Design
  ai_generated?: boolean
  ai_prompt?: string
  ai_style?: string
}

export interface UseTemplateInput {
  template_id: number
  name?: string
}

export interface TemplateFilters {
  category_id?: number
  type?: string
  access_level?: 'public' | 'private' | 'all'
  search?: string
}

export interface CreateTemplateInput {
  name: string
  description?: string
  type: string
  category_id?: number
  template_access_level: 'public' | 'private'
  settings: Record<string, any>
  data: Record<string, any>
  design: TemplateDesign
  thumbnail_url?: string
}

export interface UpdateTemplateInput extends Partial<CreateTemplateInput> {
  id: number
}
