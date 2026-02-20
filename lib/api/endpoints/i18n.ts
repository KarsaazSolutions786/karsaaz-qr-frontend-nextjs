import apiClient from '../client'

export interface ActiveTranslation {
  id: number
  name: string
  display_name: string
  locale: string
  direction: 'rtl' | 'ltr'
  is_default: boolean
  is_active: boolean
  flag_url?: string
  flag_file_id?: number
}

export interface TranslationStrings {
  [key: string]: string
}

/**
 * Fetch list of active translations (languages) from the backend.
 * Maps to: GET /api/translations/active
 */
export async function getActiveTranslations(): Promise<ActiveTranslation[]> {
  const { data } = await apiClient.get<ActiveTranslation[]>('/translations/active')
  return Array.isArray(data) ? data : []
}

/**
 * Fetch translation key-value map for a given locale.
 * Maps to: GET /api/translations/lines?locale={locale}
 */
export async function getTranslationStrings(locale: string): Promise<TranslationStrings> {
  const { data } = await apiClient.get<TranslationStrings>('/translations/lines', {
    params: { locale },
  })
  return data && typeof data === 'object' ? data : {}
}

/**
 * Switch language by calling backend endpoint.
 * Maps to: GET /language/{locale} (sets cookie/session)
 */
export async function switchLanguage(locale: string): Promise<void> {
  await apiClient.get(`/language/${locale}`)
}
