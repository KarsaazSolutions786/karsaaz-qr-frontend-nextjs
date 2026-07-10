import apiClient from '../client'

export interface BillingCollectionStatus {
  result: boolean
}

export interface BillingCollectionForm {
  result: string | null
}

export const billingCollectionAPI = {
  isEnabled: async (): Promise<boolean> => {
    const response = await apiClient.get<BillingCollectionStatus>(
      '/billing-collection/is-enabled'
    )
    return response.data.result
  },

  /**
   * Get the custom form ID for a billing customer type
   * GET /api/billing-collection/form/{type}
   * @param type - 'private' or 'company'
   */
  getForm: async (type: string): Promise<string | null> => {
    const response = await apiClient.get<BillingCollectionForm>(
      `/billing-collection/form/${type}`
    )
    return response.data.result
  },
}
