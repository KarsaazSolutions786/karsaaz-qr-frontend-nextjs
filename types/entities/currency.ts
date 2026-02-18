// Currency Entity Types

export interface Currency {
  id: number
  name: string
  currencyCode: string
  symbol: string
  thousandsSeparator: string
  decimalSeparator: string
  decimalSeparatorEnabled: boolean
  symbolPosition: string
  isEnabled: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateCurrencyRequest {
  name: string
  currencyCode: string
  symbol: string
  thousandsSeparator?: string
  decimalSeparator?: string
  decimalSeparatorEnabled?: boolean
  symbolPosition?: string
}

export interface CurrencyListResponse {
  data: Currency[]
  pagination: {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
  }
}
