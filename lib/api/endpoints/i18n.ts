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

/** Response shape from /api/localization/languages */
interface LocalizationLanguagesResponse {
  success: boolean
  data: Array<{
    id: number
    code: string
    name: string
    native_name: string
    direction: 'ltr' | 'rtl'
    version: number
  }>
}

/** Response shape from /api/localization/translations */
interface LocalizationTranslationsResponse {
  success: boolean
  language: string
  version: number
  platform: string
  count: number
  data: TranslationStrings
}


export async function getActiveTranslations(): Promise<ActiveTranslation[]> {
  try {
    // Primary: use the new public localization endpoint
    const { data } = await apiClient.get<LocalizationLanguagesResponse>('/localization/languages')
    if (data?.success && Array.isArray(data.data) && data.data.length > 0) {
      return data.data.map((lang, index) => ({
        id: lang.id,
        name: lang.name,
        display_name: lang.code.toUpperCase(),
        locale: lang.code,
        direction: lang.direction,
        is_default: index === 0,
        is_active: true,
      }))
    }
  } catch {
    // Fall through to legacy endpoint
  }

  // Fallback: legacy endpoint (works for admin users)
  const { data } = await apiClient.get<ActiveTranslation[]>('/translations/active')
  return Array.isArray(data) ? data : []
}


export async function getTranslationStrings(locale: string): Promise<TranslationStrings> {
  try {
    // Primary: use the new public localization endpoint
    const { data } = await apiClient.get<LocalizationTranslationsResponse>(
      '/localization/translations',
      { params: { lang: locale, platform: 'web' } }
    )
    if (data?.success && data.data && typeof data.data === 'object') {
      return data.data
    }
  } catch {
    // Fall through to legacy — this will likely fail without auth
  }

  return {}
}


export async function switchLanguage(locale: string): Promise<void> {
  await apiClient.get(`/language/${locale}`)
}
