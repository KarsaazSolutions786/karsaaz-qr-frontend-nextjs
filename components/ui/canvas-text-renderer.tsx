'use client'

import { useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react'

export interface CanvasTextRenderOptions {
  text: string
  fontFamily?: string
  fontVariant?: string
  fontSize?: number
  color?: string
  alignment?: CanvasTextAlign
  baseline?: CanvasTextBaseline
  lineHeight?: number
  maxWidth?: number
  padding?: number
  backgroundColor?: string
  trim?: boolean
}

export interface CanvasTextRendererHandle {
  render: (options: CanvasTextRenderOptions) => Promise<string>
  getCanvas: () => HTMLCanvasElement | null
  getDataURL: (type?: string, quality?: number) => string
  getBlob: (type?: string, quality?: number) => Promise<Blob | null>
}

interface CanvasTextRendererProps {
  width?: number
  height?: number
  className?: string
  /** Auto-render with these options */
  options?: CanvasTextRenderOptions
  /** Called when rendering completes, receives data URL */
  onRender?: (dataUrl: string) => void
}

/**
 * Purpose: * Load a Google Font by name and variant 
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

async function loadGoogleFont(
  fontFamily: string,
  fontVariant: string = '400'
): Promise<void> {
  if (typeof window === 'undefined') return

  const encodedName = fontFamily.replace(/ /g, '+')
  const url = `https://fonts.googleapis.com/css?family=${encodedName}:${fontVariant}`

  try {
    const cssText = await (await fetch(url)).text()
    const fontFaceRegex = /@font-face\s*\{[^}]*\}/g
    const srcRegex = /src:\s*url\(([^)]+)\)/
    const unicodeRegex = /unicode-range:\s*([^;]+);/
    const styleRegex = /font-style:\s*([^;]+);/
    const weightRegex = /font-weight:\s*([^;]+);/

    const matches = cssText.match(fontFaceRegex) || []

    const promises = matches.map(async (block) => {
      const srcMatch = block.match(srcRegex)
      const unicodeMatch = block.match(unicodeRegex)
      const styleMatch = block.match(styleRegex)
      const weightMatch = block.match(weightRegex)

      if (!srcMatch?.[1]) return

      const fontFace = new FontFace(fontFamily, `url(${srcMatch[1]})`, {
        unicodeRange: unicodeMatch?.[1] || undefined,
        style: styleMatch?.[1] || 'normal',
        weight: weightMatch?.[1] || '400',
      })

      document.fonts.add(fontFace)
      await fontFace.load()
    })

    await Promise.all(promises)
  } catch (err) {
    console.warn('Failed to load Google Font:', fontFamily, err)
  }
}

/**
 * Purpose: * Trim transparent pixels from a canvas, returning a new canvas 
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

function trimCanvas(canvas: HTMLCanvasElement): HTMLCanvasElement {
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return canvas

  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const { data } = pixels
  const w = canvas.width
  const h = canvas.height

  let top = h
  let left = w
  let right = 0
  let bottom = 0

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const alpha = data[(y * w + x) * 4 + 3]!
      if (alpha > 0) {
        if (y < top) top = y
        if (y > bottom) bottom = y
        if (x < left) left = x
        if (x > right) right = x
      }
    }
  }

  // Nothing drawn
  if (right < left || bottom < top) return canvas

  const trimWidth = right - left + 1
  const trimHeight = bottom - top + 1
  const trimmed = ctx.getImageData(left, top, trimWidth, trimHeight)

  const result = document.createElement('canvas')
  result.width = trimWidth
  result.height = trimHeight
  const rctx = result.getContext('2d', { willReadFrequently: true })
  rctx?.putImageData(trimmed, 0, 0)

  return result
}

/**
 * Purpose: * Render text to a canvas and return the data URL 
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

async function renderTextToCanvas(
  canvas: HTMLCanvasElement,
  options: CanvasTextRenderOptions
): Promise<string> {
  const {
    text,
    fontFamily = 'Arial',
    fontVariant = '400',
    fontSize = 60,
    color = '#000000',
    alignment = 'left',
    baseline = 'top',
    lineHeight = 1.3,
    maxWidth,
    padding = 0,
    backgroundColor,
    trim = true,
  } = options

  // Load font if it looks like a Google Font (has spaces or is not a system font)
  const systemFonts = ['Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Courier New', 'Verdana']
  if (!systemFonts.includes(fontFamily)) {
    await loadGoogleFont(fontFamily, fontVariant)
  }

  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return ''

  // Build font string
  let fontStyle = ''
  if (fontVariant !== 'regular' && fontVariant !== '400') {
    const weight = fontVariant.replace(/italic/i, '').trim() || '400'
    const isItalic = fontVariant.toLowerCase().includes('italic')
    fontStyle = `${isItalic ? 'italic ' : ''}${weight}`
  }
  const fontString = `${fontStyle} ${fontSize}px ${fontFamily}`.trim()

  // Measure text to determine canvas size
  ctx.font = fontString
  const lines = text.split('\n')

  const effectiveMaxWidth = maxWidth || canvas.width - padding * 2
  const wrappedLines: string[] = []

  for (const line of lines) {
    if (!line.trim()) {
      wrappedLines.push('')
      continue
    }
    const words = line.split(' ')
    let currentLine = ''
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word
      const metrics = ctx.measureText(testLine)
      if (metrics.width > effectiveMaxWidth && currentLine) {
        wrappedLines.push(currentLine)
        currentLine = word
      } else {
        currentLine = testLine
      }
    }
    if (currentLine) wrappedLines.push(currentLine)
  }

  const lineHeightPx = fontSize * lineHeight
  const totalHeight = wrappedLines.length * lineHeightPx + padding * 2
  const maxLineWidth = Math.max(
    ...wrappedLines.map((line) => ctx.measureText(line).width),
    100
  )
  const totalWidth = maxLineWidth + padding * 2

  // Resize canvas
  canvas.width = Math.ceil(totalWidth)
  canvas.height = Math.ceil(totalHeight)

  // Re-apply font after resize (resize clears context)
  ctx.font = fontString
  ctx.textAlign = alignment
  ctx.textBaseline = baseline

  // Background
  if (backgroundColor) {
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  // Draw text
  ctx.fillStyle = color

  let x = padding
  if (alignment === 'center') x = canvas.width / 2
  else if (alignment === 'right') x = canvas.width - padding

  for (let i = 0; i < wrappedLines.length; i++) {
    const y = padding + i * lineHeightPx
    ctx.fillText(wrappedLines[i]!, x, y)
  }

  // Trim if requested
  if (trim && !backgroundColor) {
    const trimmed = trimCanvas(canvas)
    return trimmed.toDataURL()
  }

  return canvas.toDataURL()
}

export const CanvasTextRenderer = forwardRef<
  CanvasTextRendererHandle,
  CanvasTextRendererProps
>(function CanvasTextRenderer(
  { width = 1000, height = 120, className, options, onRender },
  forwardedRef
) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const render = useCallback(
    async (renderOptions: CanvasTextRenderOptions): Promise<string> => {
      if (!canvasRef.current) return ''
      const dataUrl = await renderTextToCanvas(canvasRef.current, renderOptions)
      onRender?.(dataUrl)
      return dataUrl
    },
    [onRender]
  )

  const getCanvas = useCallback(() => canvasRef.current, [])

  const getDataURL = useCallback(
    (type?: string, quality?: number) => {
      return canvasRef.current?.toDataURL(type, quality) || ''
    },
    []
  )

  const getBlob = useCallback(
    (type?: string, quality?: number): Promise<Blob | null> => {
      return new Promise((resolve) => {
        if (!canvasRef.current) {
          resolve(null)
          return
        }
        canvasRef.current.toBlob(
          (blob) => resolve(blob),
          type || 'image/png',
          quality
        )
      })
    },
    []
  )

  useImperativeHandle(
    forwardedRef,
    () => ({ render, getCanvas, getDataURL, getBlob }),
    [render, getCanvas, getDataURL, getBlob]
  )

  // Auto-render when options change
  useEffect(() => {
    if (options?.text) {
      render(options)
    }
  }, [options, render])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
    />
  )
})
