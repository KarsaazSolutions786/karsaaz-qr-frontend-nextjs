'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'

export interface DesignSettings {
  // Background
  backgroundColor?: string
  backgroundGradient?: {
    type: 'linear' | 'radial'
    colors: string[]
    angle?: number
  }
  backgroundImage?: string
  backgroundBlur?: number

  // Typography
  fontFamily?: string
  primaryColor?: string
  textColor?: string
  headingColor?: string

  // Buttons
  buttonStyle?: 'rounded' | 'square' | 'pill'
  buttonColor?: string
  buttonTextColor?: string
  buttonShadow?: boolean

  // Layout
  maxWidth?: number
  padding?: number
  spacing?: number
  borderRadius?: number

  // Advanced
  customCss?: string
  enableAnimations?: boolean

  // Type-specific settings
  [key: string]: unknown
}

export interface BaseDesignerProps {
  design: DesignSettings
  onChange: (design: DesignSettings) => void
  children?: React.ReactNode
  tabs?: DesignerTab[]
  className?: string
}

export interface DesignerTab {
  id: string
  label: string
  icon?: string
}

const defaultTabs: DesignerTab[] = [
  { id: 'colors', label: 'Colors', icon: '🎨' },
  { id: 'typography', label: 'Typography', icon: '📝' },
  { id: 'buttons', label: 'Buttons', icon: '🔘' },
  { id: 'layout', label: 'Layout', icon: '📐' },
]

const fontOptions = [
  { value: 'Inter, sans-serif', label: 'Inter' },
  { value: 'Roboto, sans-serif', label: 'Roboto' },
  { value: 'Open Sans, sans-serif', label: 'Open Sans' },
  { value: 'Montserrat, sans-serif', label: 'Montserrat' },
  { value: 'Poppins, sans-serif', label: 'Poppins' },
  { value: 'Playfair Display, serif', label: 'Playfair Display' },
  { value: 'Merriweather, serif', label: 'Merriweather' },
  { value: 'Georgia, serif', label: 'Georgia' },
]

const gradientPresets = [
  { name: 'Ocean', colors: ['#667eea', '#764ba2'] },
  { name: 'Sunset', colors: ['#f857a6', '#ff5858'] },
  { name: 'Forest', colors: ['#56ab2f', '#a8e063'] },
  { name: 'Purple Dream', colors: ['#c471f5', '#fa71cd'] },
  { name: 'Sky', colors: ['#4facfe', '#00f2fe'] },
  { name: 'Fire', colors: ['#fa709a', '#fee140'] },
]

export function BaseDesigner({
  design,
  onChange,
  children,
  tabs = defaultTabs,
  className,
}: BaseDesignerProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || 'colors')
  const [backgroundMode, setBackgroundMode] = useState<'color' | 'gradient' | 'image'>('color')

  const updateDesign = (updates: Partial<DesignSettings>) => {
    onChange({ ...design, ...updates })
  }

  const applyGradient = (colors: string[]) => {
    updateDesign({
      backgroundGradient: {
        type: 'linear',
        colors,
        angle: 135,
      },
    })
  }

  const renderColorsTab = () => (
    <>
      <div className="flex gap-2 mb-4">
        {['color', 'gradient', 'image'].map(mode => (
          <button
            key={mode}
            onClick={() => setBackgroundMode(mode as typeof backgroundMode)}
            className={cn(
              'px-3 py-1 rounded text-sm capitalize',
              backgroundMode === mode ? 'bg-blue-600 text-white' : 'bg-gray-200'
            )}
          >
            {mode === 'color' ? 'Solid Color' : mode}
          </button>
        ))}
      </div>

      {backgroundMode === 'color' && (
        <ColorInput
          label="Background Color"
          value={design.backgroundColor || '#ffffff'}
          onChange={value => updateDesign({ backgroundColor: value })}
        />
      )}

      {backgroundMode === 'gradient' && (
        <>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {gradientPresets.map(preset => (
              <button
                key={preset.name}
                onClick={() => applyGradient(preset.colors)}
                className="h-12 rounded-lg border-2 border-gray-300 hover:border-blue-500 transition-colors"
                style={{
                  background: `linear-gradient(135deg, ${preset.colors[0]}, ${preset.colors[1]})`,
                }}
                title={preset.name}
              />
            ))}
          </div>
          <div className="flex gap-2 items-end">
            <ColorInput
              label="Start Color"
              value={design.backgroundGradient?.colors[0] || '#667eea'}
              onChange={value =>
                updateDesign({
                  backgroundGradient: {
                    type: 'linear',
                    colors: [value, design.backgroundGradient?.colors[1] || '#764ba2'],
                    angle: design.backgroundGradient?.angle || 135,
                  },
                })
              }
            />
            <ColorInput
              label="End Color"
              value={design.backgroundGradient?.colors[1] || '#764ba2'}
              onChange={value =>
                updateDesign({
                  backgroundGradient: {
                    type: 'linear',
                    colors: [design.backgroundGradient?.colors[0] || '#667eea', value],
                    angle: design.backgroundGradient?.angle || 135,
                  },
                })
              }
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Angle</label>
              <input
                type="number"
                value={design.backgroundGradient?.angle || 135}
                onChange={e =>
                  updateDesign({
                    backgroundGradient: {
                      ...design.backgroundGradient!,
                      angle: parseInt(e.target.value),
                    },
                  })
                }
                className="w-20 px-3 py-2 border rounded-lg"
                min="0"
                max="360"
              />
            </div>
          </div>
        </>
      )}

      {backgroundMode === 'image' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input
              type="url"
              value={design.backgroundImage || ''}
              onChange={e => updateDesign({ backgroundImage: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="https://example.com/background.jpg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Blur Amount: {design.backgroundBlur || 0}px
            </label>
            <input
              type="range"
              value={design.backgroundBlur || 0}
              onChange={e => updateDesign({ backgroundBlur: parseInt(e.target.value) })}
              min="0"
              max="20"
              className="w-full"
            />
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t">
        <ColorInput
          label="Primary Color"
          value={design.primaryColor || '#3b82f6'}
          onChange={value => updateDesign({ primaryColor: value })}
        />
      </div>
    </>
  )

  const renderTypographyTab = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Font Family</label>
        <select
          value={design.fontFamily || fontOptions[0]?.value || ''}
          onChange={e => updateDesign({ fontFamily: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg"
        >
          {fontOptions.map(font => (
            <option key={font.value} value={font.value}>
              {font.label}
            </option>
          ))}
        </select>
      </div>

      <ColorInput
        label="Text Color"
        value={design.textColor || '#1f2937'}
        onChange={value => updateDesign({ textColor: value })}
      />

      <ColorInput
        label="Heading Color"
        value={design.headingColor || '#111827'}
        onChange={value => updateDesign({ headingColor: value })}
      />
    </div>
  )

  const renderButtonsTab = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Button Style</label>
        <div className="grid grid-cols-3 gap-2">
          {['rounded', 'square', 'pill'].map(style => (
            <button
              key={style}
              onClick={() => updateDesign({ buttonStyle: style as DesignSettings['buttonStyle'] })}
              className={cn(
                'px-4 py-2 border-2 capitalize',
                design.buttonStyle === style ? 'border-blue-600 bg-blue-50' : 'border-gray-300',
                style === 'rounded'
                  ? 'rounded-lg'
                  : style === 'pill'
                    ? 'rounded-full'
                    : 'rounded-none'
              )}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      <ColorInput
        label="Button Color"
        value={design.buttonColor || '#3b82f6'}
        onChange={value => updateDesign({ buttonColor: value })}
      />

      <ColorInput
        label="Button Text Color"
        value={design.buttonTextColor || '#ffffff'}
        onChange={value => updateDesign({ buttonTextColor: value })}
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="buttonShadow"
          checked={design.buttonShadow ?? true}
          onChange={e => updateDesign({ buttonShadow: e.target.checked })}
          className="rounded border-gray-300"
        />
        <label htmlFor="buttonShadow" className="text-sm text-gray-700">
          Enable button shadow
        </label>
      </div>
    </div>
  )

  const renderLayoutTab = () => (
    <div className="space-y-4">
      <RangeInput
        label="Max Width"
        value={design.maxWidth || 680}
        min={320}
        max={1200}
        step={20}
        unit="px"
        onChange={value => updateDesign({ maxWidth: value })}
      />

      <RangeInput
        label="Padding"
        value={design.padding || 24}
        min={0}
        max={48}
        step={4}
        unit="px"
        onChange={value => updateDesign({ padding: value })}
      />

      <RangeInput
        label="Section Spacing"
        value={design.spacing || 16}
        min={0}
        max={48}
        step={4}
        unit="px"
        onChange={value => updateDesign({ spacing: value })}
      />

      <RangeInput
        label="Border Radius"
        value={design.borderRadius || 12}
        min={0}
        max={32}
        step={2}
        unit="px"
        onChange={value => updateDesign({ borderRadius: value })}
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="enableAnimations"
          checked={design.enableAnimations ?? true}
          onChange={e => updateDesign({ enableAnimations: e.target.checked })}
          className="rounded border-gray-300"
        />
        <label htmlFor="enableAnimations" className="text-sm text-gray-700">
          Enable animations
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Custom CSS</label>
        <textarea
          value={design.customCss || ''}
          onChange={e => updateDesign({ customCss: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg font-mono text-sm"
          rows={4}
          placeholder="/* Add custom CSS here */"
        />
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'colors':
        return renderColorsTab()
      case 'typography':
        return renderTypographyTab()
      case 'buttons':
        return renderButtonsTab()
      case 'layout':
        return renderLayoutTab()
      default:
        return null
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      <h3 className="text-lg font-semibold text-gray-900">Design & Styling</h3>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-4 py-2 font-medium transition-colors whitespace-nowrap',
              activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            )}
          >
            {tab.icon && <span className="mr-1">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white border rounded-lg p-6">
        {renderTabContent()}
        {children}
      </div>
    </div>
  )
}

// Helper Components
function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex gap-2">
        <input
          type="color"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="h-10 w-16 rounded border cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-lg"
        />
      </div>
    </div>
  )
}

function RangeInput({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  unit?: string
  onChange: (value: number) => void
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}: {value}
        {unit}
      </label>
      <input
        type="range"
        value={value}
        onChange={e => onChange(parseInt(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
    </div>
  )
}

export default BaseDesigner
