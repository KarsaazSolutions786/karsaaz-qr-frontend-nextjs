/**
 * Design Transformer
 * 
 * Converts between React DesignerConfig format and backend-expected design format.
 * Now uses native backend keys (module, finder, finderDot) directly — no mapping needed.
 * 
 * React DesignerConfig uses the SAME shape keys as the backend (matching legacy Lit frontend).
 */

import { DesignerConfig, GradientFill, SolidFill, GradientFillConfig } from '@/types/entities/designer'

/**
 * Backend design format expected by the Laravel API
 * Matches QRDesignModel.toJson() from the Flutter app
 */
export interface BackendDesignConfig {
  fillType: 'solid' | 'gradient' | 'foreground_image'
  foregroundColor: string
  backgroundColor: string
  eyeExternalColor: string
  eyeInternalColor: string
  eyeColor: string
  gradientType: string
  gradientFill?: GradientFillConfig
  backgroundEnabled: boolean
  module: string
  finder: string
  finderDot: string
  errorCorrection: string
  margin: number
  shape: string
  frameColor: string
  advancedShape: string
  advancedShapeDropShadow: boolean
  advancedShapeFrameColor: string
  logoType: string
  logoUrl: string
  logoScale: number
  logoPositionX: number
  logoPositionY: number
  logoRotate: number
  logoBackground: boolean
  logoBackgroundFill: string
  logoBackgroundScale: number
  logoBackgroundShape: string
  fontFamily: string
  fontVariant?: string
  text: string
  textColor: string
  textBackgroundColor: string
  textSize: number
  frame: string
  stickerScale?: number
  // Sticker-specific
  healthcareFrameColor?: string
  healthcareHeartColor?: string
  reviewCollectorCircleColor?: string
  reviewCollectorStarsColor?: string
  reviewCollectorLogoSrc?: string
  couponLeftColor?: string
  couponRightColor?: string
  coupon_text_line_1?: string
  coupon_text_line_2?: string
  coupon_text_line_3?: string
  // AI
  is_ai: boolean
  ai_prompt?: string
  ai_strength: number
  ai_steps: number
}

/**
 * Transform React DesignerConfig to backend design format
 */
export function transformDesignToBackend(design: Partial<DesignerConfig>): BackendDesignConfig {
  const foregroundFill = design.foregroundFill
  const background = design.background

  // Fill type and colors
  let fillType: 'solid' | 'gradient' | 'foreground_image' = 'solid'
  let foregroundColor = '#000000'
  let gradientFill: GradientFillConfig | undefined
  let gradientType = 'RADIAL'

  if (foregroundFill) {
    if (foregroundFill.type === 'solid') {
      fillType = 'solid'
      foregroundColor = (foregroundFill as SolidFill).color || '#000000'
    } else if (foregroundFill.type === 'gradient') {
      fillType = 'gradient'
      const gradient = foregroundFill as GradientFill
      foregroundColor = gradient.startColor || '#000000'
      gradientType = (gradient.gradientType || 'linear').toUpperCase()
      
      // Convert to backend gradientFill format
      gradientFill = design.gradientFill || {
        type: gradientType,
        colors: [
          { color: gradient.startColor || '#000000', stop: 0, opacity: 1 },
          { color: gradient.endColor || '#000000', stop: 100, opacity: 1 },
        ],
        angle: gradient.rotation || 0,
      }
    } else if (foregroundFill.type === 'image' || (foregroundFill as any).type === 'foreground_image') {
      fillType = 'foreground_image'
    }
  }

  // Background
  let backgroundColor = '#ffffff'
  let backgroundEnabled = true
  if (background) {
    if (background.type === 'transparent') {
      backgroundEnabled = false
    } else if (background.type === 'solid' && background.color) {
      backgroundColor = background.color
    }
  }

  // Shape keys pass through directly (same as backend)
  const module = design.moduleShape || 'square'
  const finder = design.finder || 'default'
  const finderDot = design.finderDot || 'default'

  // Eye colors (use dedicated or fallback to foreground)
  const eyeExternalColor = design.eyeExternalColor || foregroundColor
  const eyeInternalColor = design.eyeInternalColor || foregroundColor

  // Logo
  let logoUrl = ''
  let logoType = 'preset'
  let logoScale = 0.2
  let logoPositionX = 0.5
  let logoPositionY = 0.5
  let logoRotate = 0
  let logoBackground = true
  let logoBackgroundFill = '#fff'
  let logoBackgroundScale = 1.3
  let logoBackgroundShape = 'circle'

  if (design.logo) {
    logoUrl = design.logo.url || ''
    logoType = design.logo.logoType || (design.logo.url ? 'custom' : 'preset')
    logoScale = design.logo.size || 0.2
    logoPositionX = design.logo.positionX ?? 0.5
    logoPositionY = design.logo.positionY ?? 0.5
    logoRotate = design.logo.rotate ?? 0
    logoBackground = design.logo.backgroundEnabled ?? true
    logoBackgroundFill = design.logo.backgroundFill || '#fff'
    logoBackgroundScale = design.logo.backgroundScale ?? 1.3
    logoBackgroundShape = design.logo.backgroundShape || 'circle'
  }

  return {
    fillType,
    foregroundColor,
    backgroundColor,
    eyeExternalColor,
    eyeInternalColor,
    eyeColor: eyeExternalColor,
    gradientType,
    gradientFill,
    backgroundEnabled,
    module,
    finder,
    finderDot,
    errorCorrection: design.errorCorrectionLevel || 'M',
    margin: design.margin ?? 4,
    shape: design.shape || 'none',
    frameColor: design.frameColor || '#000000',
    advancedShape: design.advancedShape || 'none',
    advancedShapeDropShadow: design.advancedShapeDropShadow ?? true,
    advancedShapeFrameColor: design.advancedShapeFrameColor || '#000000',
    logoType,
    logoUrl,
    logoScale,
    logoPositionX,
    logoPositionY,
    logoRotate,
    logoBackground,
    logoBackgroundFill,
    logoBackgroundScale,
    logoBackgroundShape,
    fontFamily: design.fontFamily || 'Raleway',
    text: design.text || 'SCAN ME',
    textColor: design.textColor || '#ffffff',
    textBackgroundColor: design.textBackgroundColor || '#1c57cb',
    textSize: design.textSize || 1,
    frame: 'none',
    // Sticker-specific
    healthcareFrameColor: design.healthcareFrameColor,
    healthcareHeartColor: design.healthcareHeartColor,
    reviewCollectorCircleColor: design.reviewCollectorCircleColor,
    reviewCollectorStarsColor: design.reviewCollectorStarsColor,
    reviewCollectorLogoSrc: design.reviewCollectorLogoSrc,
    couponLeftColor: design.couponLeftColor,
    couponRightColor: design.couponRightColor,
    coupon_text_line_1: design.couponTextLine1,
    coupon_text_line_2: design.couponTextLine2,
    coupon_text_line_3: design.couponTextLine3,
    // AI
    is_ai: design.isAi || false,
    ai_prompt: design.aiPrompt,
    ai_strength: design.aiStrength ?? 1.8,
    ai_steps: design.aiSteps ?? 18,
  }
}

/**
 * Transform backend design format to React DesignerConfig
 */
export function transformDesignFromBackend(backendDesign: BackendDesignConfig | Record<string, any>): Partial<DesignerConfig> {
  const d = backendDesign as Record<string, any>

  // Fill config
  let foregroundFill: DesignerConfig['foregroundFill']
  if (d.fillType === 'gradient' && d.gradientFill) {
    const gf = d.gradientFill as GradientFillConfig
    const colors = gf.colors || []
    foregroundFill = {
      type: 'gradient',
      gradientType: ((gf.type || d.gradientType || 'LINEAR') as string).toLowerCase() as 'linear' | 'radial',
      startColor: colors[0]?.color || d.foregroundColor || '#000000',
      endColor: colors[1]?.color || d.foregroundColor || '#000000',
      rotation: gf.angle || 0,
    }
  } else {
    foregroundFill = {
      type: 'solid',
      color: d.foregroundColor || '#000000',
    }
  }

  // Background
  const background: DesignerConfig['background'] = d.backgroundEnabled === false
    ? { type: 'transparent' }
    : { type: 'solid', color: d.backgroundColor || '#ffffff' }

  // Logo
  let logo: DesignerConfig['logo'] | undefined
  if (d.logoUrl) {
    logo = {
      url: d.logoUrl,
      logoType: (d.logoType || 'preset') as 'preset' | 'custom',
      size: d.logoScale || 0.2,
      margin: 1,
      shape: (d.logoBackgroundShape || 'circle') as 'square' | 'circle',
      positionX: d.logoPositionX ?? 0.5,
      positionY: d.logoPositionY ?? 0.5,
      rotate: d.logoRotate ?? 0,
      backgroundEnabled: d.logoBackground ?? true,
      backgroundFill: d.logoBackgroundFill || '#ffffff',
      backgroundScale: d.logoBackgroundScale ?? 1.3,
      backgroundShape: (d.logoBackgroundShape || 'circle') as 'square' | 'circle',
    }
  }

  return {
    // Shapes — pass through directly
    moduleShape: d.module || 'square',
    finder: d.finder || 'default',
    finderDot: d.finderDot || 'default',
    // Eye colors
    eyeExternalColor: d.eyeExternalColor || d.foregroundColor || '#000000',
    eyeInternalColor: d.eyeInternalColor || d.foregroundColor || '#000000',
    // Fill
    foregroundFill,
    background,
    // Gradient (keep original format for round-trip)
    gradientFill: d.gradientFill,
    // Logo
    logo,
    // Outlined shape
    shape: d.shape || 'none',
    frameColor: d.frameColor || '#000000',
    // Advanced shape
    advancedShape: d.advancedShape || 'none',
    advancedShapeDropShadow: d.advancedShapeDropShadow ?? true,
    advancedShapeFrameColor: d.advancedShapeFrameColor || '#000000',
    // Text
    text: d.text || 'SCAN ME',
    textColor: d.textColor || '#ffffff',
    textBackgroundColor: d.textBackgroundColor || '#1c57cb',
    fontFamily: d.fontFamily || 'Raleway',
    textSize: d.textSize || 1,
    // Sticker-specific
    healthcareFrameColor: d.healthcareFrameColor,
    healthcareHeartColor: d.healthcareHeartColor,
    reviewCollectorCircleColor: d.reviewCollectorCircleColor,
    reviewCollectorStarsColor: d.reviewCollectorStarsColor,
    reviewCollectorLogoSrc: d.reviewCollectorLogoSrc,
    couponLeftColor: d.couponLeftColor,
    couponRightColor: d.couponRightColor,
    couponTextLine1: d.coupon_text_line_1 || d.couponTextLine1,
    couponTextLine2: d.coupon_text_line_2 || d.couponTextLine2,
    couponTextLine3: d.coupon_text_line_3 || d.couponTextLine3,
    // AI
    isAi: d.is_ai || false,
    aiPrompt: d.ai_prompt,
    aiStrength: d.ai_strength ?? 1.8,
    aiSteps: d.ai_steps ?? 18,
    // Size
    errorCorrectionLevel: d.errorCorrection || 'M',
    margin: d.margin ?? 4,
  }
}
