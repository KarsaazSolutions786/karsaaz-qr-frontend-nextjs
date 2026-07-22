'use client'

import { useState, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { qrcodesAPI } from '@/lib/api/endpoints/qrcodes'
import { queryKeys } from '@/lib/query/keys'
import apiClient from '@/lib/api/client'
import { transformDesignToBackend } from '@/lib/qr/design-transformer'

export interface DuplicateOptions {
  count?: number
  includeDesign?: boolean
  includeSettings?: boolean
  prefix?: string
}

export interface ArchiveOptions {
  reason?: string
}

export interface TransferOptions {
  newOwnerId: string
  transferDesign?: boolean
  transferAnalytics?: boolean
  notifyNewOwner?: boolean
}

export interface PINProtectionOptions {
  pin: string
  confirmPin: string
  expiresAt?: Date
}

export function useQRActions() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const queryClient = useQueryClient()

  /** Invalidate QR-related caches after mutations */
  const invalidateQRCaches = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.qrcodes.all() }),
      queryClient.invalidateQueries({ queryKey: queryKeys.folders.all() }),
    ])
  }, [queryClient])

  const duplicateQRCode = useCallback(
    async (qrCodeId: string, _options: DuplicateOptions = {}) => {
      setIsProcessing(true)
      setError(null)

      try {
        const cloned = await qrcodesAPI.copy(qrCodeId)
        await invalidateQRCaches()
        return cloned
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to duplicate QR code'
        setError(errorMessage)
        throw new Error(errorMessage)
      } finally {
        setIsProcessing(false)
      }
    },
    [invalidateQRCaches]
  )

  const bulkDuplicateQRCodes = useCallback(
    async (qrCodeIds: string[], _options: DuplicateOptions = {}) => {
      setIsProcessing(true)
      setError(null)

      try {
        const results = []
        for (const id of qrCodeIds) {
          const cloned = await qrcodesAPI.copy(id)
          results.push(cloned)
        }
        await invalidateQRCaches()
        return results
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to bulk duplicate QR codes'
        setError(errorMessage)
        throw new Error(errorMessage)
      } finally {
        setIsProcessing(false)
      }
    },
    [invalidateQRCaches]
  )

  const archiveQRCode = useCallback(
    async (qrCodeId: string, _options: ArchiveOptions = {}): Promise<void> => {
      setIsProcessing(true)
      setError(null)

      try {
        await qrcodesAPI.archive(qrCodeId)
        await invalidateQRCaches()
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to archive QR code'
        setError(errorMessage)
        throw new Error(errorMessage)
      } finally {
        setIsProcessing(false)
      }
    },
    [invalidateQRCaches]
  )

  const bulkArchiveQRCodes = useCallback(
    async (qrCodeIds: string[], _options: ArchiveOptions = {}): Promise<void> => {
      setIsProcessing(true)
      setError(null)

      try {
        await Promise.all(qrCodeIds.map(id => qrcodesAPI.archive(id)))
        await invalidateQRCaches()
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to bulk archive QR codes'
        setError(errorMessage)
        throw new Error(errorMessage)
      } finally {
        setIsProcessing(false)
      }
    },
    [invalidateQRCaches]
  )

  const unarchiveQRCode = useCallback(
    async (qrCodeId: string): Promise<void> => {
      setIsProcessing(true)
      setError(null)

      try {
        await qrcodesAPI.unarchive(qrCodeId)
        await invalidateQRCaches()
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to unarchive QR code'
        setError(errorMessage)
        throw new Error(errorMessage)
      } finally {
        setIsProcessing(false)
      }
    },
    [invalidateQRCaches]
  )

  const bulkUnarchiveQRCodes = useCallback(
    async (qrCodeIds: string[]): Promise<void> => {
      setIsProcessing(true)
      setError(null)

      try {
        await Promise.all(qrCodeIds.map(id => qrcodesAPI.unarchive(id)))
        await invalidateQRCaches()
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to bulk unarchive QR codes'
        setError(errorMessage)
        throw new Error(errorMessage)
      } finally {
        setIsProcessing(false)
      }
    },
    [invalidateQRCaches]
  )

  const changeStatus = useCallback(
    async (qrCodeId: string, status: 'active' | 'inactive'): Promise<void> => {
      setIsProcessing(true)
      setError(null)

      try {
        await qrcodesAPI.changeStatus(qrCodeId, status)
        await invalidateQRCaches()
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to change QR code status'
        setError(errorMessage)
        throw new Error(errorMessage)
      } finally {
        setIsProcessing(false)
      }
    },
    [invalidateQRCaches]
  )

  const bulkChangeStatus = useCallback(
    async (qrCodeIds: string[], status: 'active' | 'inactive'): Promise<void> => {
      setIsProcessing(true)
      setError(null)

      try {
        await Promise.all(qrCodeIds.map(id => qrcodesAPI.changeStatus(id, status)))
        await invalidateQRCaches()
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to bulk change status'
        setError(errorMessage)
        throw new Error(errorMessage)
      } finally {
        setIsProcessing(false)
      }
    },
    [invalidateQRCaches]
  )

  const deleteQRCode = useCallback(
    async (qrCodeId: string): Promise<void> => {
      setIsProcessing(true)
      setError(null)

      try {
        await qrcodesAPI.delete(qrCodeId)
        await invalidateQRCaches()
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete QR code'
        setError(errorMessage)
        throw new Error(errorMessage)
      } finally {
        setIsProcessing(false)
      }
    },
    [invalidateQRCaches]
  )

  const bulkDeleteQRCodes = useCallback(
    async (qrCodeIds: string[]): Promise<void> => {
      setIsProcessing(true)
      setError(null)

      try {
        await Promise.all(qrCodeIds.map(id => qrcodesAPI.delete(id)))
        await invalidateQRCaches()
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to bulk delete QR codes'
        setError(errorMessage)
        throw new Error(errorMessage)
      } finally {
        setIsProcessing(false)
      }
    },
    [invalidateQRCaches]
  )

  const transferQRCode = useCallback(
    async (qrCodeId: string, options: TransferOptions): Promise<void> => {
      setIsProcessing(true)
      setError(null)

      try {
        const { newOwnerId } = options
        if (!newOwnerId) {
          throw new Error('New owner ID is required')
        }
        await qrcodesAPI.transferOwnership(qrCodeId, newOwnerId)
        await invalidateQRCaches()
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to transfer QR code'
        setError(errorMessage)
        throw new Error(errorMessage)
      } finally {
        setIsProcessing(false)
      }
    },
    [invalidateQRCaches]
  )

  const addPINProtection = useCallback(
    async (qrCodeId: string, options: PINProtectionOptions): Promise<void> => {
      setIsProcessing(true)
      setError(null)

      try {
        const { pin, confirmPin } = options

        const validation = validatePIN(pin)
        if (!validation.valid) {
          throw new Error(validation.error)
        }
        if (pin !== confirmPin) {
          throw new Error('PINs do not match')
        }

        await qrcodesAPI.setPIN(qrCodeId, pin)
        await invalidateQRCaches()
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to add PIN protection'
        setError(errorMessage)
        throw new Error(errorMessage)
      } finally {
        setIsProcessing(false)
      }
    },
    [invalidateQRCaches]
  )

  const removePINProtection = useCallback(
    async (qrCodeId: string, _currentPin?: string): Promise<void> => {
      setIsProcessing(true)
      setError(null)

      try {
        await qrcodesAPI.setPIN(qrCodeId, null)
        await invalidateQRCaches()
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to remove PIN protection'
        setError(errorMessage)
        throw new Error(errorMessage)
      } finally {
        setIsProcessing(false)
      }
    },
    [invalidateQRCaches]
  )

  const updatePIN = useCallback(
    async (
      qrCodeId: string,
      _currentPin: string,
      newPin: string,
      confirmNewPin: string
    ): Promise<void> => {
      setIsProcessing(true)
      setError(null)

      try {
        const validation = validatePIN(newPin)
        if (!validation.valid) {
          throw new Error(validation.error)
        }
        if (newPin !== confirmNewPin) {
          throw new Error('New PINs do not match')
        }

        await qrcodesAPI.setPIN(qrCodeId, newPin)
        await invalidateQRCaches()
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update PIN'
        setError(errorMessage)
        throw new Error(errorMessage)
      } finally {
        setIsProcessing(false)
      }
    },
    [invalidateQRCaches]
  )

  const convertQRType = useCallback(
    async (qrCodeId: string, newType: string, newData: Record<string, unknown>): Promise<void> => {
      setIsProcessing(true)
      setError(null)

      try {
        if (!newType) {
          throw new Error('New QR type is required')
        }
        await qrcodesAPI.changeType(qrCodeId, { type: newType, data: newData })
        await invalidateQRCaches()
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to convert QR type'
        setError(errorMessage)
        throw new Error(errorMessage)
      } finally {
        setIsProcessing(false)
      }
    },
    [invalidateQRCaches]
  )

  const moveToFolder = useCallback(
    async (qrCodeIds: string[], folderId: string | null): Promise<void> => {
      setIsProcessing(true)
      setError(null)

      try {
        await Promise.all(qrCodeIds.map(id => qrcodesAPI.moveToFolder(id, folderId)))
        await invalidateQRCaches()
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to move QR codes to folder'
        setError(errorMessage)
        throw new Error(errorMessage)
      } finally {
        setIsProcessing(false)
      }
    },
    [invalidateQRCaches]
  )

  const downloadQRCode = useCallback(
    async (
      qrCodeId: string,
      format: 'png' | 'svg' = 'png',
      filename?: string,
      size?: number
    ): Promise<void> => {
      setIsProcessing(true)
      setError(null)

      try {
        // 1. Fetch QR code details to get its configuration and svgUrl
        const qrcode = await qrcodesAPI.get(qrCodeId)
        let svgString = ''

        // 2. Try fetching from svgUrl if available
        if (qrcode.svgUrl) {
          try {
            let fetchUrl = qrcode.svgUrl
            if (fetchUrl.startsWith('http')) {
              const parsed = new URL(fetchUrl)
              fetchUrl = parsed.pathname.replace(/^\/api/, '') + parsed.search
            }
            const res = await apiClient.get(fetchUrl, { _silent: true } as any)
            const contentType = res.headers?.['content-type'] || ''
            if (typeof res.data === 'object' && res.data?.content) {
              svgString = atob(res.data.content)
            } else if (
              typeof res.data === 'string' &&
              (contentType.includes('svg') || res.data.trim().startsWith('<'))
            ) {
              svgString = res.data
            }
          } catch (fetchErr) {
            if (process.env.NODE_ENV === 'development') {
              console.error(
                'Failed to fetch from svgUrl, falling back to preview endpoint',
                fetchErr
              )
            }
          }
        }

        // 3. Fallback to /qrcodes/preview if svgString is empty
        if (!svgString && qrcode.data) {
          const backendDesign = transformDesignToBackend(
            qrcode.designerConfig || qrcode.customization || {}
          )
          const params = new URLSearchParams()
          params.set('data', JSON.stringify(qrcode.data))
          params.set('type', qrcode.type)
          params.set('design', JSON.stringify(backendDesign))
          params.set('renderText', 'false')
          params.set('id', String(qrcode.id))

          let hash = 0
          const paramStr = params.toString()
          for (let i = 0; i < paramStr.length; i++) {
            const char = paramStr.charCodeAt(i)
            hash = (hash << 5) - hash + char
            hash = hash & hash
          }
          const h = Math.abs(hash).toString(36)
          params.set('h', h)

          const res = await apiClient.get('/qrcodes/preview', {
            params: Object.fromEntries(params),
            transformResponse: [(raw: string) => raw],
          })

          try {
            const json = JSON.parse(res.data)
            if (json.content) {
              svgString = window.atob(json.content)
            } else {
              svgString = res.data
            }
          } catch {
            svgString = res.data as string
          }
        }

        if (!svgString) {
          throw new Error('Could not retrieve QR code SVG content')
        }

        // 4. Parse SVG string to SVGSVGElement
        const parser = new DOMParser()
        const doc = parser.parseFromString(svgString, 'image/svg+xml')
        const svgElement = doc.documentElement as unknown as SVGSVGElement

        const dlFilename = filename || qrcode.name || `qrcode-${qrCodeId}`
        const { downloadPNG, downloadSVG } = await import('@/lib/utils/download-utils')

        // 5. Download in the requested format
        if (format === 'svg') {
          downloadSVG(svgElement, dlFilename)
        } else if (format === 'png') {
          await downloadPNG(
            svgElement,
            dlFilename,
            size || qrcode.designerConfig?.size || qrcode.customization?.size || 512
          )
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to download QR code'
        setError(errorMessage)
        throw new Error(errorMessage)
      } finally {
        setIsProcessing(false)
      }
    },
    []
  )

  const bulkDownloadQRCodes = useCallback(
    async (qrCodeIds: string[], format: 'png' | 'svg' = 'png', size?: number): Promise<void> => {
      setIsProcessing(true)
      setError(null)

      try {
        for (const id of qrCodeIds) {
          await downloadQRCode(id, format, undefined, size)
          // Small delay between downloads to avoid browser blocking
          await new Promise(resolve => setTimeout(resolve, 200))
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to bulk download QR codes'
        setError(errorMessage)
        throw new Error(errorMessage)
      } finally {
        setIsProcessing(false)
      }
    },
    [downloadQRCode]
  )

  return {
    // State
    isProcessing,
    error,

    // Duplicate
    duplicateQRCode,
    bulkDuplicateQRCodes,

    // Archive
    archiveQRCode,
    bulkArchiveQRCodes,
    unarchiveQRCode,
    bulkUnarchiveQRCodes,

    // Status
    changeStatus,
    bulkChangeStatus,

    // Delete
    deleteQRCode,
    bulkDeleteQRCodes,

    // Transfer
    transferQRCode,

    // PIN Protection
    addPINProtection,
    removePINProtection,
    updatePIN,

    // Type Conversion
    convertQRType,

    // Folder Management
    moveToFolder,

    // Download
    downloadQRCode,
    bulkDownloadQRCodes,
  }
}

export function validatePIN(pin: string): { valid: boolean; error?: string } {
  if (!pin) {
    return { valid: false, error: 'PIN is required' }
  }
  if (pin.length < 4) {
    return { valid: false, error: 'PIN must be at least 4 digits' }
  }
  if (pin.length > 8) {
    return { valid: false, error: 'PIN must be at most 8 digits' }
  }
  if (!/^\d+$/.test(pin)) {
    return { valid: false, error: 'PIN must contain only digits' }
  }
  return { valid: true }
}
