'use client'

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { PlusIcon, TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

export interface GradientStop {
  color: string
  position: number // 0-100
}

export interface GradientValue {
  type: 'linear' | 'radial'
  angle: number // 0-360 for linear, ignored for radial
  stops: GradientStop[]
}

export interface GradientPickerProps {
  value: GradientValue
  onChange: (value: GradientValue) => void
  label?: string
  showPresets?: boolean
  className?: string
  minStops?: number
  maxStops?: number
}

// Default presets
const GRADIENT_PRESETS: GradientValue[] = [
  {
    type: 'linear',
    angle: 90,
    stops: [
      { color: '#667EEA', position: 0 },
      { color: '#764BA2', position: 100 },
    ],
  },
  {
    type: 'linear',
    angle: 45,
    stops: [
      { color: '#F093FB', position: 0 },
      { color: '#F5576C', position: 100 },
    ],
  },
  {
    type: 'linear',
    angle: 135,
    stops: [
      { color: '#4FACFE', position: 0 },
      { color: '#00F2FE', position: 100 },
    ],
  },
  {
    type: 'linear',
    angle: 90,
    stops: [
      { color: '#43E97B', position: 0 },
      { color: '#38F9D7', position: 100 },
    ],
  },
  {
    type: 'linear',
    angle: 180,
    stops: [
      { color: '#FA709A', position: 0 },
      { color: '#FEE140', position: 100 },
    ],
  },
  {
    type: 'radial',
    angle: 0,
    stops: [
      { color: '#FFFFFF', position: 0 },
      { color: '#6DD5FA', position: 50 },
      { color: '#2980B9', position: 100 },
    ],
  },
  {
    type: 'linear',
    angle: 120,
    stops: [
      { color: '#FF512F', position: 0 },
      { color: '#DD2476', position: 100 },
    ],
  },
  {
    type: 'linear',
    angle: 60,
    stops: [
      { color: '#8E2DE2', position: 0 },
      { color: '#4A00E0', position: 100 },
    ],
  },
]

// Convert gradient value to CSS string
export function gradientToCSS(gradient: GradientValue): string {
  const sortedStops = [...gradient.stops].sort((a, b) => a.position - b.position)
  const stopsStr = sortedStops.map(s => `${s.color} ${s.position}%`).join(', ')

  if (gradient.type === 'radial') {
    return `radial-gradient(circle, ${stopsStr})`
  }
  return `linear-gradient(${gradient.angle}deg, ${stopsStr})`
}

// Parse CSS gradient string to GradientValue
export function parseGradientCSS(css: string): GradientValue | null {
  try {
    const isRadial = css.startsWith('radial-gradient')
    const isLinear = css.startsWith('linear-gradient')

    if (!isRadial && !isLinear) return null

    const content = css.match(/\((.+)\)/)?.[1]
    if (!content) return null

    let angle = 90
    let stopsStr = content

    if (isLinear) {
      const angleMatch = content.match(/^(\d+)deg,/)
      if (angleMatch) {
        angle = parseInt(angleMatch[1]!, 10)
        stopsStr = content.slice(angleMatch[0].length)
      }
    } else if (isRadial) {
      // Remove "circle," prefix if present
      stopsStr = stopsStr.replace(/^circle,\s*/, '')
    }

    const stopRegex = /(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|rgba?\([^)]+\))\s+(\d+)%/g
    const stops: GradientStop[] = []
    let match

    while ((match = stopRegex.exec(stopsStr)) !== null) {
      stops.push({
        color: match[1]!,
        position: parseInt(match[2]!, 10),
      })
    }

    if (stops.length < 2) return null

    return {
      type: isRadial ? 'radial' : 'linear',
      angle,
      stops,
    }
  } catch {
    return null
  }
}

// Default gradient value
export function createDefaultGradient(): GradientValue {
  return {
    type: 'linear',
    angle: 90,
    stops: [
      { color: '#3B82F6', position: 0 },
      { color: '#8B5CF6', position: 100 },
    ],
  }
}

export function GradientPicker({
  value,
  onChange,
  label,
  showPresets = true,
  className,
  minStops = 2,
  maxStops = 5,
}: GradientPickerProps) {
  const [activeStopIndex, setActiveStopIndex] = useState(0)
  const [showPresetPanel, setShowPresetPanel] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const gradientCSS = useMemo(() => gradientToCSS(value), [value])

  // Update a specific stop
  const updateStop = useCallback(
    (index: number, updates: Partial<GradientStop>) => {
      const newStops = value.stops.map((stop, i) => (i === index ? { ...stop, ...updates } : stop))
      onChange({ ...value, stops: newStops })
    },
    [value, onChange]
  )

  // Add a new stop
  const addStop = useCallback(() => {
    if (value.stops.length >= maxStops) return

    // Find middle position
    const sortedStops = [...value.stops].sort((a, b) => a.position - b.position)
    let newPosition = 50
    let newColor = '#888888'

    if (sortedStops.length >= 2) {
      // Find largest gap and add stop there
      let maxGap = 0
      let gapStart = 0
      let gapEnd = 100

      for (let i = 0; i < sortedStops.length - 1; i++) {
        const gap = sortedStops[i + 1]!.position - sortedStops[i]!.position
        if (gap > maxGap) {
          maxGap = gap
          gapStart = sortedStops[i]!.position
          gapEnd = sortedStops[i + 1]!.position
          newColor = sortedStops[i]!.color
        }
      }

      newPosition = Math.round((gapStart + gapEnd) / 2)
    }

    const newStops = [...value.stops, { color: newColor, position: newPosition }]
    onChange({ ...value, stops: newStops })
    setActiveStopIndex(newStops.length - 1)
  }, [value, onChange, maxStops])

  // Remove a stop
  const removeStop = useCallback(
    (index: number) => {
      if (value.stops.length <= minStops) return

      const newStops = value.stops.filter((_, i) => i !== index)
      onChange({ ...value, stops: newStops })
      setActiveStopIndex(Math.max(0, index - 1))
    },
    [value, onChange, minStops]
  )

  // Handle slider drag
  const handleSliderMouseDown = (e: React.MouseEvent, index: number) => {
    e.preventDefault()
    setActiveStopIndex(index)
    setIsDragging(true)
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!sliderRef.current) return

      const rect = sliderRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const position = Math.round(Math.max(0, Math.min(100, (x / rect.width) * 100)))

      updateStop(activeStopIndex, { position })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, activeStopIndex, updateStop])

  // Apply preset
  const applyPreset = useCallback(
    (preset: GradientValue) => {
      onChange(preset)
      setShowPresetPanel(false)
    },
    [onChange]
  )

  // Randomize gradient
  const randomize = useCallback(() => {
    const randomColor = () =>
      '#' +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0')

    const numStops = Math.floor(Math.random() * 3) + 2
    const stops: GradientStop[] = [{ color: randomColor(), position: 0 }]

    for (let i = 1; i < numStops - 1; i++) {
      stops.push({
        color: randomColor(),
        position: Math.round((i / (numStops - 1)) * 100),
      })
    }

    stops.push({ color: randomColor(), position: 100 })

    onChange({
      type: Math.random() > 0.8 ? 'radial' : 'linear',
      angle: Math.round(Math.random() * 360),
      stops,
    })
  }, [onChange])

  const activeStop = value.stops[activeStopIndex]

  return (
    <div className={cn('space-y-4', className)}>
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}

      {/* Preview */}
      <div
        className="h-20 rounded-lg border border-gray-200 shadow-inner"
        style={{ background: gradientCSS }}
      />

      {/* Gradient slider */}
      <div className="space-y-2">
        <div className="text-xs text-gray-500 font-medium">Color Stops</div>
        <div
          ref={sliderRef}
          className="relative h-8 rounded-md border border-gray-300 cursor-crosshair"
          style={{
            background: `linear-gradient(to right, ${value.stops
              .sort((a, b) => a.position - b.position)
              .map(s => `${s.color} ${s.position}%`)
              .join(', ')})`,
          }}
          onClick={e => {
            if (e.target === sliderRef.current && value.stops.length < maxStops) {
              const rect = sliderRef.current!.getBoundingClientRect()
              const position = Math.round(((e.clientX - rect.left) / rect.width) * 100)
              const newStops = [...value.stops, { color: '#888888', position }]
              onChange({ ...value, stops: newStops })
              setActiveStopIndex(newStops.length - 1)
            }
          }}
        >
          {value.stops.map((stop, index) => (
            <button
              key={index}
              type="button"
              className={cn(
                'absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-2 shadow-md cursor-grab active:cursor-grabbing transition-transform',
                activeStopIndex === index
                  ? 'border-blue-500 ring-2 ring-blue-200 scale-110 z-10'
                  : 'border-white'
              )}
              style={{
                left: `${stop.position}%`,
                backgroundColor: stop.color,
              }}
              onMouseDown={e => handleSliderMouseDown(e, index)}
              onClick={e => {
                e.stopPropagation()
                setActiveStopIndex(index)
              }}
            />
          ))}
        </div>
      </div>

      {/* Stop editor */}
      {activeStop && (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div
                  className="w-10 h-10 rounded-md border-2 border-gray-300"
                  style={{ backgroundColor: activeStop.color }}
                />
                <input
                  type="color"
                  value={activeStop.color}
                  onChange={e => updateStop(activeStopIndex, { color: e.target.value })}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <input
                type="text"
                value={activeStop.color}
                onChange={e => {
                  const color = e.target.value
                  if (/^#[0-9a-fA-F]{6}$/i.test(color)) {
                    updateStop(activeStopIndex, { color })
                  }
                }}
                className="w-24 px-2 py-1 text-sm font-mono border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="#000000"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500">Position</label>
            <input
              type="number"
              min={0}
              max={100}
              value={activeStop.position}
              onChange={e =>
                updateStop(activeStopIndex, {
                  position: Math.max(0, Math.min(100, parseInt(e.target.value) || 0)),
                })
              }
              className="w-16 px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <span className="text-xs text-gray-400">%</span>
          </div>

          <button
            type="button"
            onClick={() => removeStop(activeStopIndex)}
            disabled={value.stops.length <= minStops}
            className="p-1.5 text-red-500 hover:bg-red-50 rounded-md disabled:opacity-30 disabled:cursor-not-allowed"
            title="Remove stop"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Gradient type */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500">Type</label>
          <select
            value={value.type}
            onChange={e => onChange({ ...value, type: e.target.value as 'linear' | 'radial' })}
            className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="linear">Linear</option>
            <option value="radial">Radial</option>
          </select>
        </div>

        {/* Angle (linear only) */}
        {value.type === 'linear' && (
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500">Angle</label>
            <input
              type="number"
              min={0}
              max={360}
              value={value.angle}
              onChange={e =>
                onChange({
                  ...value,
                  angle: Math.max(0, Math.min(360, parseInt(e.target.value) || 0)),
                })
              }
              className="w-16 px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <span className="text-xs text-gray-400">°</span>
          </div>
        )}

        <div className="flex-1" />

        {/* Add stop */}
        <button
          type="button"
          onClick={addStop}
          disabled={value.stops.length >= maxStops}
          className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-md disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <PlusIcon className="w-3.5 h-3.5" />
          Add Stop
        </button>

        {/* Randomize */}
        <button
          type="button"
          onClick={randomize}
          className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-md"
          title="Randomize gradient"
        >
          <ArrowPathIcon className="w-4 h-4" />
        </button>

        {/* Presets toggle */}
        {showPresets && (
          <button
            type="button"
            onClick={() => setShowPresetPanel(!showPresetPanel)}
            className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            Presets
          </button>
        )}
      </div>

      {/* Presets panel */}
      {showPresets && showPresetPanel && (
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-4 gap-2">
            {GRADIENT_PRESETS.map((preset, index) => (
              <button
                key={index}
                type="button"
                onClick={() => applyPreset(preset)}
                className="h-12 rounded-md border-2 border-transparent hover:border-blue-400 transition-all"
                style={{ background: gradientToCSS(preset) }}
                title={`Preset ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* CSS output */}
      <div className="text-xs text-gray-500 font-mono bg-gray-50 p-2 rounded-md overflow-x-auto">
        {gradientCSS}
      </div>
    </div>
  )
}

export default GradientPicker
