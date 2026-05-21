import { type QRCodeTypeDefinition } from './qr-types'

export interface QRTypeCategory {
  id: string
  label: string
  icon: string // Lucide icon name
  accent: string // Tailwind color token
  typeIds: string[] // empty = show all
}

export const QR_TYPE_CATEGORIES: QRTypeCategory[] = [
  {
    id: 'all',
    label: 'All',
    icon: 'LayoutGrid',
    accent: 'primary',
    typeIds: [],
  },
  {
    id: 'links',
    label: 'Links',
    icon: 'Link2',
    accent: 'blue',
    typeIds: ['text', 'url', 'biolinks'],
  },
  {
    id: 'social',
    label: 'Social',
    icon: 'Share2',
    accent: 'pink',
    typeIds: [
      'whatsapp',
      'telegram',
      'instagram',
      'youtube',
      'facebook',
      'facebookmessenger',
      'linkedin',
      'viber',
      'x',
      'snapchat',
      'spotify',
      'tiktok',
      'skype',
      'wechat',
    ],
  },
  {
    id: 'business',
    label: 'Business',
    icon: 'Briefcase',
    accent: 'emerald',
    typeIds: [
      'business-profile',
      'business-review',
      'vcard',
      'vcard-plus',
      'restaurant-menu',
      'product-catalogue',
      'resume',
      'lead-form',
      'google-review',
      'website-builder',
    ],
  },
  {
    id: 'communication',
    label: 'Communication',
    icon: 'MessageSquare',
    accent: 'amber',
    typeIds: ['email', 'email-dynamic', 'sms', 'sms-dynamic', 'call', 'facetime', 'zoom'],
  },
  {
    id: 'payment',
    label: 'Payment',
    icon: 'CreditCard',
    accent: 'green',
    typeIds: ['crypto', 'paypal', 'upi', 'upi-dynamic', 'brazilpix'],
  },
  {
    id: 'utility',
    label: 'Utility',
    icon: 'Wrench',
    accent: 'sky',
    typeIds: ['wifi', 'location', 'googlemaps', 'file-upload', 'app-download', 'event', 'calendar'],
  },
]

const categoryByTypeId = new Map<string, string>()
for (const cat of QR_TYPE_CATEGORIES) {
  for (const typeId of cat.typeIds) {
    categoryByTypeId.set(typeId, cat.id)
  }
}

/**
 * Purpose: Retrieves categoryfortype.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export function getCategoryForType(typeId: string): string {
  return categoryByTypeId.get(typeId) ?? 'all'
}

/**
 * Purpose: Executes filterQrTypes functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export function filterQrTypes(
  types: QRCodeTypeDefinition[],
  categoryId: string,
  keyword: string
): QRCodeTypeDefinition[] {
  const category = QR_TYPE_CATEGORIES.find(c => c.id === categoryId)
  const typeIdSet = category && category.typeIds.length > 0 ? new Set(category.typeIds) : null

  const escaped = keyword.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const pattern = escaped ? new RegExp(escaped, 'i') : null

  return types.filter(type => {
    if (typeIdSet && !typeIdSet.has(type.id)) return false
    if (
      pattern &&
      !pattern.test(type.name) &&
      !pattern.test(type.id) &&
      !pattern.test(type.description ?? '')
    )
      return false
    return true
  })
}

/**
 * Purpose: Executes countTypesPerCategory functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export function countTypesPerCategory(
  types: QRCodeTypeDefinition[],
  keyword: string
): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const cat of QR_TYPE_CATEGORIES) {
    counts[cat.id] = filterQrTypes(types, cat.id, keyword).length
  }
  return counts
}
