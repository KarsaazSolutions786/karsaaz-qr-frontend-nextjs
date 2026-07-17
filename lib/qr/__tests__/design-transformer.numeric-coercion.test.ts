import { describe, it, expect } from 'vitest'
import { transformDesignFromBackend } from '../design-transformer'

// Regression (2026-07-17): saved designs can round-trip numeric fields as
// strings; hydrating them uncoerced crashed StickerEditor
// ("(config.textSize || 1).toFixed is not a function") when editing a QR
// that used a sticker. Hydration must always yield real numbers.

describe('transformDesignFromBackend numeric coercion', () => {
  it('coerces string numerics from saved designs to numbers', () => {
    const config = transformDesignFromBackend({
      textSize: '1.4',
      ai_strength: '2.2',
      ai_steps: '20',
      margin: '6',
      logoUrl: '/images/logos/x.png',
      logoScale: '0.3',
      logoPositionX: '0.4',
      logoPositionY: '0.6',
      logoRotate: '90',
      logoBackgroundScale: '1.5',
    } as never)

    expect(config.textSize).toBe(1.4)
    expect(config.aiStrength).toBe(2.2)
    expect(config.aiSteps).toBe(20)
    expect(config.margin).toBe(6)
    expect(config.logo?.size).toBe(0.3)
    expect(config.logo?.positionX).toBe(0.4)
    expect(config.logo?.positionY).toBe(0.6)
    expect(config.logo?.rotate).toBe(90)
    expect(config.logo?.backgroundScale).toBe(1.5)

    // The crash site: must not throw and must format cleanly.
    expect((Number(config.textSize) || 1).toFixed(1)).toBe('1.4')
  })

  it('falls back to defaults for absent or garbage values', () => {
    const config = transformDesignFromBackend({ textSize: 'not-a-number' } as never)

    expect(config.textSize).toBe(1)
    expect(config.aiStrength).toBe(1.8)
    expect(config.margin).toBe(4)
  })
})
