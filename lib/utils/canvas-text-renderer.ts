export interface CanvasTextOptions {
  fontSize?: number
  fontFamily?: string
  color?: string
  x?: number
  y?: number
  maxWidth?: number
  textAlign?: CanvasTextAlign
  rotation?: number
}

/**
 * Wraps text to fit within maxWidth and returns an array of lines.
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  if (!maxWidth || maxWidth <= 0) return [text]
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = ''

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word
    const { width } = ctx.measureText(testLine)
    if (width > maxWidth && currentLine) {
      lines.push(currentLine)
      currentLine = word
    } else {
      currentLine = testLine
    }
  }
  if (currentLine) lines.push(currentLine)
  return lines
}

/**
 * Renders text on a canvas element with word wrapping, alignment, and rotation support.
 * Returns the canvas rendering context for chaining.
 */
export function renderTextOnCanvas(
  canvas: HTMLCanvasElement,
  text: string,
  options: CanvasTextOptions = {}
): CanvasRenderingContext2D {
  const {
    fontSize = 16,
    fontFamily = 'sans-serif',
    color = '#000000',
    x = 0,
    y = 0,
    maxWidth,
    textAlign = 'left',
    rotation = 0,
  } = options

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Unable to get 2D canvas context')

  ctx.save()

  // Apply rotation around the text origin
  if (rotation) {
    ctx.translate(x, y)
    ctx.rotate((rotation * Math.PI) / 180)
    ctx.translate(-x, -y)
  }

  ctx.font = `${fontSize}px ${fontFamily}`
  ctx.fillStyle = color
  ctx.textAlign = textAlign
  ctx.textBaseline = 'top'

  const lineHeight = fontSize * 1.2
  const lines = maxWidth ? wrapText(ctx, text, maxWidth) : [text]

  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i]!, x, y + i * lineHeight, maxWidth)
  }

  ctx.restore()

  return ctx
}

/**
 * Measures text dimensions without rendering.
 */
export function measureText(
  canvas: HTMLCanvasElement,
  text: string,
  options: Pick<CanvasTextOptions, 'fontSize' | 'fontFamily' | 'maxWidth'> = {}
): { width: number; height: number; lines: string[] } {
  const { fontSize = 16, fontFamily = 'sans-serif', maxWidth } = options

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Unable to get 2D canvas context')

  ctx.font = `${fontSize}px ${fontFamily}`

  const lines = maxWidth ? wrapText(ctx, text, maxWidth) : [text]
  const lineHeight = fontSize * 1.2
  const widestLine = Math.max(...lines.map((l) => ctx.measureText(l).width))

  return {
    width: maxWidth ? Math.min(widestLine, maxWidth) : widestLine,
    height: lines.length * lineHeight,
    lines,
  }
}
