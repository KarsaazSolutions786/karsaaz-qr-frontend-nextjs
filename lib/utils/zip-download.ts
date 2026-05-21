/**
 * ZIP Download Utilities
 *
 * Utilities for creating ZIP files with multiple QR codes.
 */

'use client'

import type JSZip from 'jszip'
import { exportSVG } from './export-svg'

/**
 * Purpose: Lazily load JSZip to avoid bundling it at the top level (~100KB). The library is only fetched when the user triggers a batch ZIP download.
 * Owner/Author: Syed Ashhad
 * Created: February 2026
 * Last Editor: Syed Ashhad
 * Last Updated: March 2026
 */

async function loadJSZip(): Promise<typeof JSZip> {
  const { default: JSZip } = await import('jszip')
  return JSZip
}
import { exportPNG } from './export-png'
import { exportPDF } from './export-pdf'

export interface ZipDownloadOptions {
  format?: 'svg' | 'png' | 'pdf' | 'all'
  filename?: string
  includeMetadata?: boolean
  pngSize?: number
  folderStructure?: boolean
  compressionLevel?: number
}

export interface QRCodeData {
  id: string
  name: string
  svgElement: SVGElement
  folderPath?: string
  metadata?: {
    title?: string
    description?: string
    url?: string
    createdAt?: string
  }
}

/**
 * Purpose: Download multiple QR codes as ZIP
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export async function downloadQRCodesAsZip(
  qrCodes: QRCodeData[],
  options: ZipDownloadOptions = {}
): Promise<void> {
  const {
    format = 'png',
    filename = 'qr-codes',
    includeMetadata = false,
    pngSize = 1024,
    folderStructure = false,
    compressionLevel = 6,
  } = options

  const JSZipCtor = await loadJSZip()
  const zip = new JSZipCtor()

  // Add QR codes to ZIP
  for (const qrCode of qrCodes) {
    const basePath = folderStructure && qrCode.folderPath ? qrCode.folderPath : ''

    const sanitizedName = sanitizeFilename(qrCode.name || qrCode.id)

    try {
      if (format === 'all') {
        // Add all formats
        await addQRCodeAllFormats(zip, qrCode, basePath, sanitizedName, pngSize)
      } else {
        // Add single format
        await addQRCodeSingleFormat(zip, qrCode, basePath, sanitizedName, format, pngSize)
      }

      // Add metadata if requested
      if (includeMetadata && qrCode.metadata) {
        const metadataPath = joinPath(basePath, `${sanitizedName}.json`)
        const metadataContent = JSON.stringify(qrCode.metadata, null, 2)
        zip.file(metadataPath, metadataContent)
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.error(`Failed to add ${qrCode.name} to ZIP:`, error)
      // Continue with other files
    }
  }

  // Generate ZIP blob
  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: {
      level: compressionLevel,
    },
  })

  // Download ZIP
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${sanitizeFilename(filename)}.zip`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Purpose: Add QR code in all formats to ZIP
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

async function addQRCodeAllFormats(
  zip: JSZip,
  qrCode: QRCodeData,
  basePath: string,
  filename: string,
  pngSize: number
): Promise<void> {
  // SVG
  const svgBlob = await exportSVG(qrCode.svgElement as any, {
    filename,
    optimized: true,
  }).then(() => getSVGBlob(qrCode.svgElement))
  zip.file(joinPath(basePath, `${filename}.svg`), svgBlob)

  // PNG
  const pngBlob = await exportPNG(qrCode.svgElement as any, {
    width: pngSize,
    height: pngSize,
    filename,
  }).then(() => getPNGBlob(qrCode.svgElement, pngSize, pngSize))
  zip.file(joinPath(basePath, `${filename}.png`), pngBlob)

  // PDF
  const pdfBlob = await exportPDF(qrCode.svgElement as any, {
    filename,
  }).then(() => getPDFBlob(qrCode.svgElement))
  zip.file(joinPath(basePath, `${filename}.pdf`), pdfBlob)
}

/**
 * Purpose: Add QR code in single format to ZIP
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

async function addQRCodeSingleFormat(
  zip: JSZip,
  qrCode: QRCodeData,
  basePath: string,
  filename: string,
  format: 'svg' | 'png' | 'pdf',
  pngSize: number
): Promise<void> {
  let blob: Blob
  let extension: string

  switch (format) {
    case 'svg':
      blob = await getSVGBlob(qrCode.svgElement)
      extension = 'svg'
      break
    case 'png':
      blob = await getPNGBlob(qrCode.svgElement, pngSize, pngSize)
      extension = 'png'
      break
    case 'pdf':
      blob = await getPDFBlob(qrCode.svgElement)
      extension = 'pdf'
      break
    default:
      throw new Error(`Unsupported format: ${format}`)
  }

  zip.file(joinPath(basePath, `${filename}.${extension}`), blob)
}

/**
 * Purpose: Get SVG as blob
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

async function getSVGBlob(svgElement: SVGElement): Promise<Blob> {
  const svgString = new XMLSerializer().serializeToString(svgElement)
  return new Blob([svgString], { type: 'image/svg+xml' })
}

/**
 * Purpose: Get PNG as blob
 * Owner/Author: Syed Ashhad
 * Created: February 2026
 * Last Editor: Syed Ashhad
 * Last Updated: March 2026
 */

async function getPNGBlob(svgElement: SVGElement, width: number, height: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      reject(new Error('Failed to get canvas context'))
      return
    }

    const img = new Image()
    const svgString = new XMLSerializer().serializeToString(svgElement)
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(svgBlob)

    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height)
      URL.revokeObjectURL(url)

      canvas.toBlob(blob => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Failed to create PNG blob'))
        }
      }, 'image/png')
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load SVG'))
    }

    img.src = url
  })
}

/**
 * Purpose: Get PDF as blob (placeholder - requires jsPDF)
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

async function getPDFBlob(svgElement: SVGElement): Promise<Blob> {
  // This is a simplified version - you would use the actual exportPDF utility
  const svgString = new XMLSerializer().serializeToString(svgElement)
  return new Blob([svgString], { type: 'application/pdf' })
}

/**
 * Purpose: Sanitize filename
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-z0-9_\-\.]/gi, '_')
    .replace(/__+/g, '_')
    .replace(/^_|_$/g, '')
    .substring(0, 255)
}

/**
 * Purpose: Join path segments
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

function joinPath(...segments: string[]): string {
  return segments.filter(Boolean).join('/').replace(/\/+/g, '/')
}

/**
 * Purpose: Estimate ZIP size
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function estimateZipSize(
  qrCodeCount: number,
  format: 'svg' | 'png' | 'pdf' | 'all',
  pngSize: number = 1024
): { bytes: number; formatted: string } {
  let bytesPerQR = 0

  switch (format) {
    case 'svg':
      bytesPerQR = 15 * 1024 // ~15 KB per SVG
      break
    case 'png':
      // Estimate based on size
      const pixels = pngSize * pngSize
      bytesPerQR = pixels * 4 * 0.3 // RGBA with 30% compression
      break
    case 'pdf':
      bytesPerQR = 30 * 1024 // ~30 KB per PDF
      break
    case 'all':
      bytesPerQR = 15 * 1024 + pngSize * pngSize * 4 * 0.3 + 30 * 1024
      break
  }

  const bytes = bytesPerQR * qrCodeCount

  return {
    bytes,
    formatted: formatFileSize(bytes),
  }
}

/**
 * Purpose: Format file size
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${Math.round(bytes)} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

/**
 * Purpose: Check if browser supports ZIP creation
 * Owner/Author: Syed Ashhad
 * Created: February 2026
 * Last Editor: Syed Ashhad
 * Last Updated: March 2026
 */

export async function isZipSupported(): Promise<boolean> {
  try {
    await loadJSZip()
    return true
  } catch {
    return false
  }
}

/**
 * Create progress callback for ZIP generation
 */
export type ZipProgressCallback = (progress: {
  current: number
  total: number
  percentage: number
  currentFile: string
}) => void

/**
 * Purpose: Download QR codes as ZIP with progress tracking
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export async function downloadQRCodesAsZipWithProgress(
  qrCodes: QRCodeData[],
  options: ZipDownloadOptions = {},
  onProgress?: ZipProgressCallback
): Promise<void> {
  const {
    format = 'png',
    filename = 'qr-codes',
    includeMetadata = false,
    pngSize = 1024,
    folderStructure = false,
    compressionLevel = 6,
  } = options

  const JSZipCtor = await loadJSZip()
  const zip = new JSZipCtor()
  const total = qrCodes.length

  for (let i = 0; i < qrCodes.length; i++) {
    const qrCode = qrCodes[i]
    if (!qrCode) continue
    const basePath = folderStructure && qrCode.folderPath ? qrCode.folderPath : ''
    const sanitizedName = sanitizeFilename(qrCode.name || qrCode.id)

    // Report progress
    onProgress?.({
      current: i + 1,
      total,
      percentage: Math.round(((i + 1) / total) * 100),
      currentFile: sanitizedName,
    })

    try {
      if (format === 'all') {
        await addQRCodeAllFormats(zip, qrCode, basePath, sanitizedName, pngSize)
      } else {
        await addQRCodeSingleFormat(zip, qrCode, basePath, sanitizedName, format, pngSize)
      }

      if (includeMetadata && qrCode.metadata) {
        const metadataPath = joinPath(basePath, `${sanitizedName}.json`)
        const metadataContent = JSON.stringify(qrCode.metadata, null, 2)
        zip.file(metadataPath, metadataContent)
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.error(`Failed to add ${qrCode.name} to ZIP:`, error)
    }
  }

  // Generate ZIP
  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: {
      level: compressionLevel,
    },
  })

  // Download
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${sanitizeFilename(filename)}.zip`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
