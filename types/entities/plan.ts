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
  showAds: boolean
  adsTimeout?: number
  qrTypes: string[]
  features: string[]
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
  showAds?: boolean
  features?: string[]
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
