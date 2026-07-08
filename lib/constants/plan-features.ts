import { OUTLINED_SHAPES, ADVANCED_SHAPES as STICKER_SHAPES } from './qr-shapes'

export interface PlanFeatureOption {
  name: string
  value: string
}

/** Core plan features (non-shape) — used directly in plan editors */
export const BASE_PLAN_FEATURES: PlanFeatureOption[] = [
  { name: 'Copy QR Code', value: 'qrcode.copy' },
  { name: 'QR Code Logo', value: 'qrcode.logo' },
  { name: 'Remove Powered By', value: 'qrcode.remove_powered_by' },
  { name: 'Color Customization', value: 'qrcode.color_customization' },
  { name: 'Lead Form in vCard+', value: 'vcard-plus.lead-form' },
  {
    name: 'Hide Subscription Details Section (Account Page)',
    value: 'account.hide-subscription-details-section',
  },
  { name: 'Hide Custom Code Input', value: 'designer.hide-custom-code-input' },
  { name: 'Bulk QR Code Creation', value: 'bulk-qrcode-creation' },
]

/** Shape features derived from OUTLINED_SHAPES (fallback when DB assets unavailable) */
const SHAPE_FEATURES: PlanFeatureOption[] = OUTLINED_SHAPES.map(shape => ({
  name: `Shape: ${shape.label}`,
  value: `shape.${shape.value}`,
}))

/** Sticker features derived from ADVANCED_SHAPES (fallback when DB assets unavailable) */
const STICKER_FEATURES: PlanFeatureOption[] = STICKER_SHAPES.map(shape => ({
  name: `Sticker: ${shape.label}`,
  value: `advancedShape.${shape.value}`,
}))

/**
 * All plan feature options combined (static fallback).
 * The plan editor pages load shapes/stickers dynamically from the design-assets API
 * so that newly uploaded assets appear without a code deploy.
 */
export const PLAN_FEATURE_OPTIONS: PlanFeatureOption[] = [
  ...BASE_PLAN_FEATURES,
  ...SHAPE_FEATURES,
  ...STICKER_FEATURES,
]
