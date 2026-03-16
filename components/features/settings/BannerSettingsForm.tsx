'use client'

import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { bannerApi, type BannerSettings } from '@/lib/api/endpoints/banner'
import { useTranslation } from '@/lib/i18n'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ColorPicker } from '@/components/ui/ColorPicker'
import { WebsiteBanner } from '@/components/public/website-banner/WebsiteBanner'

interface BannerSettingsFormProps {
  initialData: BannerSettings
}

const DEFAULT_SETTINGS: BannerSettings = {
  enabled: false,
  type: 'info',
  content: '',
  dismissible: true,
  link_url: '',
  link_text: '',
  background_color: '#3B82F6',
  text_color: '#FFFFFF',
}

export function BannerSettingsForm({ initialData }: BannerSettingsFormProps) {
  const { t } = useTranslation()
  const [settings, setSettings] = useState<BannerSettings>({ ...DEFAULT_SETTINGS, ...initialData })
  const queryClient = useQueryClient()

  useEffect(() => {
    setSettings({ ...DEFAULT_SETTINGS, ...initialData })
  }, [initialData])

  const mutation = useMutation({
    mutationFn: (data: Partial<BannerSettings>) => bannerApi.updateSettings(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['banner-settings'] })
      setSettings({ ...DEFAULT_SETTINGS, ...data })
      toast.success(t('Banner settings saved'))
    },
    onError: () => {
      toast.error(t('Failed to save banner settings'))
    },
  })

  const handleChange = <K extends keyof BannerSettings>(field: K, value: BannerSettings[K]) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate(settings)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Preview */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900">{t('Preview')}</h2>
          <p className="mt-1 text-sm text-gray-500">{t('Live preview of the banner')}</p>
        </div>
        <div className="px-4 py-5 sm:px-6">
          {settings.enabled && settings.content ? (
            <div className="overflow-hidden rounded-md border border-gray-200">
              <WebsiteBanner
                type={settings.type}
                message={settings.content}
                dismissible={settings.dismissible}
              />
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">
              {!settings.enabled ? t('Banner is disabled') : t('Enter banner content to see preview')}
            </p>
          )}
        </div>
      </div>

      {/* General Settings */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900">{t('Banner Settings')}</h2>
        </div>
        <div className="px-4 py-5 sm:px-6 space-y-6">
          {/* Enabled toggle */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">{t('Enable Banner')}</label>
              <p className="text-sm text-gray-500">{t('Show the banner on the website')}</p>
            </div>
            <Switch
              checked={settings.enabled}
              onCheckedChange={(checked) => handleChange('enabled', checked)}
            />
          </div>

          {/* Banner type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('Banner Type')}</label>
            <Select value={settings.type} onValueChange={(val) => handleChange('type', val as BannerSettings['type'])}>
              <SelectTrigger>
                <SelectValue placeholder={t('Select type')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="info">{t('Info')}</SelectItem>
                <SelectItem value="warning">{t('Warning')}</SelectItem>
                <SelectItem value="success">{t('Success')}</SelectItem>
                <SelectItem value="promo">{t('Promo')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('Banner Content')}</label>
            <textarea
              value={settings.content}
              onChange={(e) => handleChange('content', e.target.value)}
              rows={3}
              placeholder={t('Enter the banner message...')}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Dismissible */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">{t('Dismissible')}</label>
              <p className="text-sm text-gray-500">{t('Allow users to dismiss the banner')}</p>
            </div>
            <Switch
              checked={settings.dismissible}
              onCheckedChange={(checked) => handleChange('dismissible', checked)}
            />
          </div>
        </div>
      </div>

      {/* Link Settings */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900">{t('Link (Optional)')}</h2>
        </div>
        <div className="px-4 py-5 sm:px-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('Link URL')}</label>
              <input
                type="url"
                value={settings.link_url ?? ''}
                onChange={(e) => handleChange('link_url', e.target.value)}
                placeholder="https://example.com"
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('Link Text')}</label>
              <input
                type="text"
                value={settings.link_text ?? ''}
                onChange={(e) => handleChange('link_text', e.target.value)}
                placeholder={t('Learn more')}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Color Settings */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900">{t('Colors (Optional)')}</h2>
          <p className="mt-1 text-sm text-gray-500">{t('Override the default banner type colors')}</p>
        </div>
        <div className="px-4 py-5 sm:px-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <ColorPicker
              label={t('Background Color')}
              value={settings.background_color ?? '#3B82F6'}
              onChange={(color) => handleChange('background_color', color)}
            />
            <ColorPicker
              label={t('Text Color')}
              value={settings.text_color ?? '#FFFFFF'}
              onChange={(color) => handleChange('text_color', color)}
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
        >
          {mutation.isPending ? t('Saving...') : t('Save Settings')}
        </button>
      </div>
    </form>
  )
}
