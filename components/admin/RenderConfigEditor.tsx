'use client'

import { useState, useCallback } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useTranslation } from '@/lib/i18n'

export interface RenderConfig {
  mode: string
  styles?: Record<string, string>
  transform?: { type: string; rotate: number }
  scale?: { x: number; y: number }
  circle_ring?: { stroke_width_ratio: number }
  svg_path?: { d: string; viewBox: string; scale: number; shouldFlip?: boolean }
}

const RENDER_MODES = [
  { value: 'none', label: 'None (default square)' },
  { value: 'native', label: 'Native (handled by QR library)' },
  { value: 'style', label: 'CSS Styles' },
  { value: 'transform', label: 'Transform (rotation)' },
  { value: 'scale', label: 'Scale' },
  { value: 'circle_ring', label: 'Circle Ring (finder frames)' },
  { value: 'filled_circle', label: 'Filled Circle (finder dots)' },
  { value: 'svg_path', label: 'Custom SVG Path' },
]

interface Props {
  config: RenderConfig | null
  onSave: (config: RenderConfig) => void
  onClose: () => void
}

/**
 * Purpose: Executes RenderConfigEditor functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export function RenderConfigEditor({ config, onSave, onClose }: Props) {
  const { t } = useTranslation()
  const [mode, setMode] = useState(config?.mode || 'none')

  // Style fields
  const [styles, setStyles] = useState<Record<string, string>>(
    config?.styles ? { ...config.styles } : {}
  )
  const [newStyleKey, setNewStyleKey] = useState('')
  const [newStyleValue, setNewStyleValue] = useState('')

  // Transform fields
  const [rotateAngle, setRotateAngle] = useState(config?.transform?.rotate ?? 45)

  // Scale fields
  const [scaleX, setScaleX] = useState(config?.scale?.x ?? 1)
  const [scaleY, setScaleY] = useState(config?.scale?.y ?? 1)

  // Circle ring
  const [strokeWidthRatio, setStrokeWidthRatio] = useState(
    config?.circle_ring?.stroke_width_ratio ?? 0.3
  )

  // SVG path
  const [svgD, setSvgD] = useState(config?.svg_path?.d ?? '')
  const [svgViewBox, setSvgViewBox] = useState(config?.svg_path?.viewBox ?? '0 0 700 700')
  const [svgScale, setSvgScale] = useState(config?.svg_path?.scale ?? 1)
  const [svgFlip, setSvgFlip] = useState(config?.svg_path?.shouldFlip ?? false)

  const addStyle = useCallback(() => {
    if (newStyleKey.trim()) {
      setStyles(prev => ({ ...prev, [newStyleKey.trim()]: newStyleValue.trim() }))
      setNewStyleKey('')
      setNewStyleValue('')
    }
  }, [newStyleKey, newStyleValue])

  const removeStyle = useCallback((key: string) => {
    setStyles(prev => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }, [])

  const handleSave = useCallback(() => {
    const result: RenderConfig = { mode }

    switch (mode) {
      case 'style':
        if (Object.keys(styles).length > 0) result.styles = styles
        break
      case 'transform':
        result.transform = { type: 'rotate', rotate: rotateAngle }
        break
      case 'scale':
        result.scale = { x: scaleX, y: scaleY }
        break
      case 'circle_ring':
        result.circle_ring = { stroke_width_ratio: strokeWidthRatio }
        break
      case 'svg_path':
        result.svg_path = {
          d: svgD,
          viewBox: svgViewBox,
          scale: svgScale,
          ...(svgFlip ? { shouldFlip: true } : {}),
        }
        break
    }

    onSave(result)
  }, [
    mode,
    styles,
    rotateAngle,
    scaleX,
    scaleY,
    strokeWidthRatio,
    svgD,
    svgViewBox,
    svgScale,
    svgFlip,
    onSave,
  ])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h3 className="text-lg font-semibold text-gray-900">{t('Render Configuration')}</h3>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-gray-100">
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[60vh] overflow-y-auto px-5 py-4 space-y-4">
          {/* Mode selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('Render Mode')}
            </label>
            <select
              value={mode}
              onChange={e => setMode(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {RENDER_MODES.map(m => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* Style fields */}
          {mode === 'style' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {t('CSS Properties')}
              </label>
              {Object.entries(styles).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded flex-1 truncate">
                    {key}: {value}
                  </code>
                  <button
                    onClick={() => removeStyle(key)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    {t('Remove')}
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newStyleKey}
                  onChange={e => setNewStyleKey(e.target.value)}
                  placeholder="stroke-linejoin"
                  className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm"
                />
                <input
                  type="text"
                  value={newStyleValue}
                  onChange={e => setNewStyleValue(e.target.value)}
                  placeholder="round"
                  className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm"
                />
                <button
                  onClick={addStyle}
                  className="rounded bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-200"
                >
                  {t('Add')}
                </button>
              </div>
            </div>
          )}

          {/* Transform fields */}
          {mode === 'transform' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('Rotation Angle')}
              </label>
              <input
                type="number"
                value={rotateAngle}
                onChange={e => setRotateAngle(Number(e.target.value))}
                min={0}
                max={360}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              />
              <p className="mt-1 text-xs text-gray-400">
                {t('Degrees (0-360). Common: 45 for diamond/rhombus.')}
              </p>
            </div>
          )}

          {/* Scale fields */}
          {mode === 'scale' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('Scale X')}
                </label>
                <input
                  type="number"
                  value={scaleX}
                  onChange={e => setScaleX(Number(e.target.value))}
                  min={0.1}
                  max={2}
                  step={0.1}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('Scale Y')}
                </label>
                <input
                  type="number"
                  value={scaleY}
                  onChange={e => setScaleY(Number(e.target.value))}
                  min={0.1}
                  max={2}
                  step={0.1}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <p className="col-span-2 text-xs text-gray-400">
                {t('Vertical lines: x=0.3, y=1. Horizontal: x=1, y=0.3.')}
              </p>
            </div>
          )}

          {/* Circle ring */}
          {mode === 'circle_ring' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('Stroke Width Ratio')}
              </label>
              <input
                type="range"
                value={strokeWidthRatio}
                onChange={e => setStrokeWidthRatio(Number(e.target.value))}
                min={0.1}
                max={0.8}
                step={0.05}
                className="w-full"
              />
              <div className="text-sm text-gray-600 text-center">{strokeWidthRatio.toFixed(2)}</div>
            </div>
          )}

          {/* SVG Path */}
          {mode === 'svg_path' && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('SVG Path (d attribute)')}
                </label>
                <textarea
                  value={svgD}
                  onChange={e => setSvgD(e.target.value)}
                  rows={4}
                  placeholder="M 8.76..."
                  className="w-full rounded border border-gray-300 px-3 py-2 text-xs font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('viewBox')}
                  </label>
                  <input
                    type="text"
                    value={svgViewBox}
                    onChange={e => setSvgViewBox(e.target.value)}
                    placeholder="0 0 700 700"
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('Scale')}
                  </label>
                  <input
                    type="number"
                    value={svgScale}
                    onChange={e => setSvgScale(Number(e.target.value))}
                    min={0.1}
                    max={3}
                    step={0.1}
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={svgFlip}
                  onChange={e => setSvgFlip(e.target.checked)}
                  className="rounded border-gray-300"
                />
                {t('Flip horizontally (mirror)')}
              </label>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t px-5 py-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {t('Cancel')}
          </button>
          <button
            onClick={handleSave}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            {t('Save Render Config')}
          </button>
        </div>
      </div>
    </div>
  )
}
