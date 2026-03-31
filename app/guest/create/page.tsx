'use client'

import { useState, useMemo, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useGuest } from '@/lib/hooks/useGuest'
import { guestAPI, type CreateGuestQrcodeRequest } from '@/lib/api/endpoints/guest'
import { GuestLimitsBanner } from '@/components/guest/GuestLimitsBanner'
import { GuestSignupPrompt } from '@/components/guest/GuestSignupPrompt'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Loader } from '@/components/ui/loader'
import { useTranslation } from '@/lib/i18n'
import { toast } from 'sonner'

const TYPE_LABELS: Record<string, string> = {
  url: 'URL',
  text: 'Text',
  wifi: 'WiFi',
  email: 'Email',
  phone: 'Phone',
  sms: 'SMS',
  vcard: 'vCard',
  location: 'Location',
  calendar: 'Calendar Event',
}

export default function GuestCreatePage() {
  const searchParams = useSearchParams()
  const { t } = useTranslation()
  const { guestConfig, sessionLimits, isGuestLoading, isGuest, incrementActionCount, refreshSession } = useGuest()

  const type = searchParams.get('type') || 'url'

  const [name, setName] = useState('')
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [fgColor, setFgColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [isCreating, setIsCreating] = useState(false)
  const [isPreviewing, setIsPreviewing] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [createdQr, setCreatedQr] = useState<{ id: number; file_path: string | null } | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)

  const limitReached = useMemo(() => {
    if (!sessionLimits) return false
    return sessionLimits.qrcodes.remaining <= 0
  }, [sessionLimits])

  const updateField = useCallback((key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }, [])

  const buildQrData = useCallback((): Record<string, any> => {
    switch (type) {
      case 'url':
        return { url: formData.url || '' }
      case 'text':
        return { text: formData.text || '' }
      case 'wifi':
        return {
          ssid: formData.ssid || '',
          password: formData.password || '',
          encryption: formData.encryption || 'WPA',
        }
      case 'email':
        return {
          to: formData.to || '',
          subject: formData.subject || '',
          body: formData.body || '',
        }
      case 'phone':
        return { phone: formData.phone || '' }
      case 'sms':
        return {
          phone: formData.phone || '',
          message: formData.message || '',
        }
      case 'vcard':
        return {
          first_name: formData.first_name || '',
          last_name: formData.last_name || '',
          phone: formData.phone || '',
          email: formData.email || '',
          organization: formData.organization || '',
        }
      case 'location':
        return {
          latitude: formData.latitude || '',
          longitude: formData.longitude || '',
        }
      case 'calendar':
        return {
          title: formData.title || '',
          start: formData.start || '',
          end: formData.end || '',
          location: formData.location || '',
          description: formData.description || '',
        }
      default:
        return formData
    }
  }, [type, formData])

  const handlePreview = async () => {
    setIsPreviewing(true)
    try {
      const design = guestConfig?.allow_design_customization
        ? { foreground_color: fgColor, background_color: bgColor }
        : undefined
      const blob = await guestAPI.previewQrcode({ type, data: buildQrData(), design })
      const url = URL.createObjectURL(blob as Blob)
      setPreviewUrl(url)
    } catch {
      toast.error(t('Failed to generate preview'))
    } finally {
      setIsPreviewing(false)
    }
  }

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error(t('Please enter a name for your QR code'))
      return
    }

    setIsCreating(true)
    try {
      const design = guestConfig?.allow_design_customization
        ? { foreground_color: fgColor, background_color: bgColor }
        : undefined

      const payload: CreateGuestQrcodeRequest = {
        name: name.trim(),
        type,
        data: buildQrData(),
        design,
        is_static: !guestConfig?.allow_dynamic_qrcodes,
      }

      const qr = await guestAPI.createQrcode(payload)
      setCreatedQr(qr)
      incrementActionCount()
      await refreshSession()
      toast.success(t('QR code created successfully!'))
    } catch (err: any) {
      const message = err?.response?.data?.message || t('Failed to create QR code')
      toast.error(message)
    } finally {
      setIsCreating(false)
    }
  }

  const handleDownload = async () => {
    if (!createdQr) return
    setIsDownloading(true)
    try {
      const blob = await guestAPI.downloadQrcode(createdQr.id)
      const url = URL.createObjectURL(blob as Blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${name || 'qrcode'}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      await refreshSession()
    } catch {
      toast.error(t('Failed to download QR code'))
    } finally {
      setIsDownloading(false)
    }
  }

  if (isGuestLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    )
  }

  if (!guestConfig?.is_guest_mode_enabled || !isGuest) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <p className="mb-4 text-gray-600 dark:text-gray-400">{t('Please sign in to create QR codes.')}</p>
        <Link href="/login" className="text-blue-600 hover:underline">{t('Sign In')}</Link>
      </div>
    )
  }

  // Success state — show created QR code
  if (createdQr) {
    return (
      <div className="mx-auto max-w-lg">
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 text-5xl">✅</div>
          <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
            {t('QR Code Created!')}
          </h2>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">{name}</p>

          {createdQr.file_path && (
            <div className="mb-6 flex justify-center">
              <img
                src={createdQr.file_path}
                alt={name}
                className="h-48 w-48 rounded-lg border border-gray-200 dark:border-gray-700"
              />
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button onClick={handleDownload} disabled={isDownloading}>
              {isDownloading ? t('Downloading...') : t('Download QR Code')}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setCreatedQr(null)
                setName('')
                setFormData({})
                setPreviewUrl(null)
              }}
            >
              {t('Create Another')}
            </Button>
          </div>

          {sessionLimits && (
            <p className="mt-4 text-xs text-gray-400">
              {t('QR Codes remaining')}: {sessionLimits.qrcodes.remaining}/{sessionLimits.qrcodes.max}
            </p>
          )}
        </div>

        <GuestSignupPrompt />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Limits banner */}
      {sessionLimits && <GuestLimitsBanner limits={sessionLimits} />}

      {/* Header */}
      <div className="mb-6">
        <Link href="/guest" className="mb-2 inline-block text-sm text-blue-600 hover:underline dark:text-blue-400">
          ← {t('Back to QR Types')}
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('Create')} {TYPE_LABELS[type] || type} {t('QR Code')}
        </h1>
        {sessionLimits && (
          <p className="mt-1 text-sm text-gray-500">
            {sessionLimits.qrcodes.remaining} {t('of')} {sessionLimits.qrcodes.max} {t('QR codes remaining')}
          </p>
        )}
      </div>

      {limitReached && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
          <p className="font-medium text-amber-800 dark:text-amber-200">
            {t('You\'ve reached the QR code limit for guest users.')}
          </p>
          <p className="mt-1 text-sm text-amber-600 dark:text-amber-400">
            <Link href="/signup" className="underline">{t('Sign up')}</Link> {t('to create more QR codes and unlock additional features.')}
          </p>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        {/* Name field */}
        <div className="mb-4">
          <Label htmlFor="qr-name">{t('QR Code Name')}</Label>
          <Input
            id="qr-name"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder={t('My QR Code')}
            className="mt-1"
          />
        </div>

        {/* Type-specific fields */}
        <div className="mb-6 space-y-4">
          {type === 'url' && (
            <div>
              <Label htmlFor="url">{t('URL')}</Label>
              <Input
                id="url"
                type="url"
                value={formData.url || ''}
                onChange={e => updateField('url', e.target.value)}
                placeholder="https://example.com"
                className="mt-1"
              />
            </div>
          )}

          {type === 'text' && (
            <div>
              <Label htmlFor="text">{t('Text')}</Label>
              <Textarea
                id="text"
                value={formData.text || ''}
                onChange={e => updateField('text', e.target.value)}
                placeholder={t('Enter your text...')}
                className="mt-1"
              />
            </div>
          )}

          {type === 'wifi' && (
            <>
              <div>
                <Label htmlFor="ssid">{t('Network Name (SSID)')}</Label>
                <Input
                  id="ssid"
                  value={formData.ssid || ''}
                  onChange={e => updateField('ssid', e.target.value)}
                  placeholder="MyWiFi"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="wifi-password">{t('Password')}</Label>
                <Input
                  id="wifi-password"
                  type="password"
                  value={formData.password || ''}
                  onChange={e => updateField('password', e.target.value)}
                  placeholder="••••••••"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="encryption">{t('Encryption')}</Label>
                <select
                  id="encryption"
                  value={formData.encryption || 'WPA'}
                  onChange={e => updateField('encryption', e.target.value)}
                  className="mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                >
                  <option value="WPA">WPA/WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">{t('None')}</option>
                </select>
              </div>
            </>
          )}

          {type === 'email' && (
            <>
              <div>
                <Label htmlFor="to">{t('To')}</Label>
                <Input
                  id="to"
                  type="email"
                  value={formData.to || ''}
                  onChange={e => updateField('to', e.target.value)}
                  placeholder="example@email.com"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="subject">{t('Subject')}</Label>
                <Input
                  id="subject"
                  value={formData.subject || ''}
                  onChange={e => updateField('subject', e.target.value)}
                  placeholder={t('Email subject')}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="body">{t('Body')}</Label>
                <Textarea
                  id="body"
                  value={formData.body || ''}
                  onChange={e => updateField('body', e.target.value)}
                  placeholder={t('Email body...')}
                  className="mt-1"
                />
              </div>
            </>
          )}

          {type === 'phone' && (
            <div>
              <Label htmlFor="phone">{t('Phone Number')}</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone || ''}
                onChange={e => updateField('phone', e.target.value)}
                placeholder="+1234567890"
                className="mt-1"
              />
            </div>
          )}

          {type === 'sms' && (
            <>
              <div>
                <Label htmlFor="sms-phone">{t('Phone Number')}</Label>
                <Input
                  id="sms-phone"
                  type="tel"
                  value={formData.phone || ''}
                  onChange={e => updateField('phone', e.target.value)}
                  placeholder="+1234567890"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="message">{t('Message')}</Label>
                <Textarea
                  id="message"
                  value={formData.message || ''}
                  onChange={e => updateField('message', e.target.value)}
                  placeholder={t('Your message...')}
                  className="mt-1"
                />
              </div>
            </>
          )}

          {type === 'vcard' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">{t('First Name')}</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name || ''}
                    onChange={e => updateField('first_name', e.target.value)}
                    placeholder="John"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">{t('Last Name')}</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name || ''}
                    onChange={e => updateField('last_name', e.target.value)}
                    placeholder="Doe"
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="vcard-phone">{t('Phone')}</Label>
                <Input
                  id="vcard-phone"
                  type="tel"
                  value={formData.phone || ''}
                  onChange={e => updateField('phone', e.target.value)}
                  placeholder="+1234567890"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="vcard-email">{t('Email')}</Label>
                <Input
                  id="vcard-email"
                  type="email"
                  value={formData.email || ''}
                  onChange={e => updateField('email', e.target.value)}
                  placeholder="john@example.com"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="organization">{t('Organization')}</Label>
                <Input
                  id="organization"
                  value={formData.organization || ''}
                  onChange={e => updateField('organization', e.target.value)}
                  placeholder={t('Company name')}
                  className="mt-1"
                />
              </div>
            </>
          )}

          {type === 'location' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latitude">{t('Latitude')}</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={formData.latitude || ''}
                  onChange={e => updateField('latitude', e.target.value)}
                  placeholder="40.7128"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="longitude">{t('Longitude')}</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  value={formData.longitude || ''}
                  onChange={e => updateField('longitude', e.target.value)}
                  placeholder="-74.0060"
                  className="mt-1"
                />
              </div>
            </div>
          )}

          {type === 'calendar' && (
            <>
              <div>
                <Label htmlFor="event-title">{t('Event Title')}</Label>
                <Input
                  id="event-title"
                  value={formData.title || ''}
                  onChange={e => updateField('title', e.target.value)}
                  placeholder={t('Meeting')}
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start">{t('Start')}</Label>
                  <Input
                    id="start"
                    type="datetime-local"
                    value={formData.start || ''}
                    onChange={e => updateField('start', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="end">{t('End')}</Label>
                  <Input
                    id="end"
                    type="datetime-local"
                    value={formData.end || ''}
                    onChange={e => updateField('end', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="event-location">{t('Location')}</Label>
                <Input
                  id="event-location"
                  value={formData.location || ''}
                  onChange={e => updateField('location', e.target.value)}
                  placeholder={t('Meeting room')}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="event-description">{t('Description')}</Label>
                <Textarea
                  id="event-description"
                  value={formData.description || ''}
                  onChange={e => updateField('description', e.target.value)}
                  placeholder={t('Event details...')}
                  className="mt-1"
                />
              </div>
            </>
          )}
        </div>

        {/* Design customization */}
        {guestConfig?.allow_design_customization && (
          <div className="mb-6 border-t border-gray-200 pt-4 dark:border-gray-700">
            <h3 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('Colors')}
            </h3>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <Label htmlFor="fg-color">{t('Foreground')}</Label>
                <input
                  id="fg-color"
                  type="color"
                  value={fgColor}
                  onChange={e => setFgColor(e.target.value)}
                  className="h-8 w-10 cursor-pointer rounded border border-gray-300"
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="bg-color">{t('Background')}</Label>
                <input
                  id="bg-color"
                  type="color"
                  value={bgColor}
                  onChange={e => setBgColor(e.target.value)}
                  className="h-8 w-10 cursor-pointer rounded border border-gray-300"
                />
              </div>
            </div>
          </div>
        )}

        {/* Preview area */}
        {previewUrl && (
          <div className="mb-6 flex justify-center">
            <img
              src={previewUrl}
              alt={t('QR Code Preview')}
              className="h-48 w-48 rounded-lg border border-gray-200 dark:border-gray-700"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handlePreview}
            disabled={isPreviewing || limitReached}
          >
            {isPreviewing ? <Loader size="sm" className="mr-2" /> : null}
            {t('Preview')}
          </Button>
          <Button
            onClick={handleCreate}
            disabled={isCreating || limitReached}
          >
            {isCreating ? <Loader size="sm" className="mr-2" /> : null}
            {t('Create QR Code')}
          </Button>
        </div>
      </div>

      <GuestSignupPrompt />
    </div>
  )
}
