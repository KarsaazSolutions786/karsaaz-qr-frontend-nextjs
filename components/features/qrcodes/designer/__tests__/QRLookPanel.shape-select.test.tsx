import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { QRLookPanel } from '../QRLookPanel'
import { DEFAULT_DESIGNER_CONFIG } from '@/types/entities/designer'

// Regression test (2026-07-16): selecting a Shape fired four sequential
// onFieldChange calls; the parent spread a stale design object per call, so
// the later asset-identity updates clobbered `shape` and nothing selected.
// The selection must arrive as ONE batched update containing all keys.

vi.mock('@/lib/hooks/useDesignShapes', () => ({
  useDesignShapes: () => ({
    MODULE_SHAPES: [],
    FINDER_STYLES: [],
    FINDER_DOT_STYLES: [],
    PRESET_LOGOS: [],
    OUTLINED_SHAPES: [
      { value: 'none', label: 'None' },
      { value: 'cloud', label: 'Cloud', id: 42, version: 3, source: 'built_in' },
    ],
  }),
}))

vi.mock('@/lib/i18n', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}))

vi.mock('@/components/qr/LogoUpload', () => ({ LogoUpload: () => null }))
vi.mock('../ColorPickerWithPresets', () => ({ ColorPickerWithPresets: () => null }))
vi.mock('../SectionCard', () => ({
  SectionCard: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe('QRLookPanel shape selection', () => {
  it('emits a single batched update with shape and asset identity keys', () => {
    const onFieldChange = vi.fn()

    render(
      <QRLookPanel
        value={{ ...DEFAULT_DESIGNER_CONFIG }}
        onFieldChange={onFieldChange}
        onLogoChange={vi.fn()}
        isFreePlan={false}
        onPremiumBlock={vi.fn()}
      />
    )

    fireEvent.click(screen.getByTitle('Cloud'))

    expect(onFieldChange).toHaveBeenCalledTimes(1)
    expect(onFieldChange).toHaveBeenCalledWith({
      shape: 'cloud',
      outlineShapeAssetId: 42,
      outlineShapeAssetVersion: 3,
      outlineShapeSource: 'built_in',
    })
  })

  it('locks non-first shapes for free plans instead of selecting', () => {
    const onFieldChange = vi.fn()
    const onPremiumBlock = vi.fn()

    render(
      <QRLookPanel
        value={{ ...DEFAULT_DESIGNER_CONFIG }}
        onFieldChange={onFieldChange}
        onLogoChange={vi.fn()}
        isFreePlan={true}
        onPremiumBlock={onPremiumBlock}
      />
    )

    fireEvent.click(screen.getByTitle('Cloud (requires paid plan)'))

    expect(onFieldChange).not.toHaveBeenCalled()
    expect(onPremiumBlock).toHaveBeenCalledTimes(1)
  })
})
