// Subscription Plan Entity Types (Admin)

export interface SubscriptionPlan {
  id: number
  name: string
  price: number
  frequency: 'monthly' | 'yearly' | 'life-time'
  sortOrder: number
  isHidden: boolean
  isTrial: boolean
  trialDays?: number
  numberOfDynamicQrcodes: number
  numberOfScans: number
  numberOfCustomDomains: number
  fileSizeLimit?: number
  numberOfUsers?: number
  numberOfRestaurantMenuItems?: number
  numberOfProductCatalogueItems?: number
  numberOfAiGenerations?: number
  numberOfBulkCreatedQrcodes?: number
  showAds: boolean
  adsTimeout?: number
  adsCode?: string
  qrTypes: string[]
  unavailableTypesBehaviour?: string
  features: string[]
  checkpoints?: { id: string; text: string; available: boolean }[]
  qrTypeLimits?: { typeId: string; limit: number }[]
  createdAt: string
  updatedAt: string
}

export interface CreateSubscriptionPlanRequest {
  name: string
  price: number
  frequency: 'monthly' | 'yearly' | 'life-time'
  sortOrder?: number
  isHidden?: boolean
  isTrial?: boolean
  trialDays?: number
  numberOfDynamicQrcodes?: number
  numberOfScans?: number
  numberOfCustomDomains?: number
  fileSizeLimit?: number
  numberOfUsers?: number
  numberOfRestaurantMenuItems?: number
  numberOfProductCatalogueItems?: number
  numberOfAiGenerations?: number
  numberOfBulkCreatedQrcodes?: number
  showAds?: boolean
  adsTimeout?: number
  adsCode?: string
  qrTypes?: string[]
  unavailableTypesBehaviour?: 'hidden' | 'show_upgrade_message'
  features?: string[]
  checkpoints?: { id: string; text: string; available: boolean }[]
  qrTypeLimits?: { typeId: string; limit: number }[]
}

export interface SubscriptionPlanListResponse {
  data: SubscriptionPlan[]
  pagination: {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
  }
}
