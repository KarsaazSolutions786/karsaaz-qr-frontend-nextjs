'use client';

import React, { useState } from 'react';
import { ThemeSettings } from '@/types/entities/biolinks';

interface BiolinksDesignerProps {
  theme: ThemeSettings;
  onChange: (theme: ThemeSettings) => void;
}

const fontOptions = [
  { value: 'Inter, sans-serif', label: 'Inter' },
  { value: 'Roboto, sans-serif', label: 'Roboto' },
  { value: 'Open Sans, sans-serif', label: 'Open Sans' },
  { value: 'Montserrat, sans-serif', label: 'Montserrat' },
  { value: 'Poppins, sans-serif', label: 'Poppins' },
  { value: 'Playfair Display, serif', label: 'Playfair Display' },
  { value: 'Merriweather, serif', label: 'Merriweather' },
  { value: 'Georgia, serif', label: 'Georgia' },
];

const gradientPresets = [
  { name: 'Ocean', colors: ['#667eea', '#764ba2'] },
  { name: 'Sunset', colors: ['#f857a6', '#ff5858'] },
  { name: 'Forest', colors: ['#56ab2f', '#a8e063'] },
  { name: 'Purple Dream', colors: ['#c471f5', '#fa71cd'] },
  { name: 'Sky', colors: ['#4facfe', '#00f2fe'] },
  { name: 'Fire', colors: ['#fa709a', '#fee140'] },
];

export function BiolinksDesigner({ theme, onChange }: BiolinksDesignerProps) {
  const [activeTab, setActiveTab] = useState<'background' | 'typography' | 'buttons' | 'layout'>(
    'background'
  );
  const [backgroundMode, setBackgroundMode] = useState<'color' | 'gradient' | 'image'>('color');

  const updateTheme = (updates: Partial<ThemeSettings>) => {
    onChange({ ...theme, ...updates });
  };

  const applyGradient = (colors: string[]) => {
    updateTheme({
      backgroundGradient: {
        type: 'linear',
        colors,
        angle: 135,
      },
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Design & Styling</h3>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b">
        {[
          { id: 'background', label: '🎨 Background' },
          { id: 'typography', label: '📝 Typography' },
          { id: 'buttons', label: '🔘 Buttons' },
          { id: 'layout', label: '📐 Layout' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white border rounded-lg p-6 space-y-4">
        {activeTab === 'background' && (
          <>
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setBackgroundMode('color')}
                className={`px-3 py-1 rounded ${
                  backgroundMode === 'color' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}
              >
                Solid Color
              </button>
              <button
                onClick={() => setBackgroundMode('gradient')}
                className={`px-3 py-1 rounded ${
                  backgroundMode === 'gradient' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}
              >
                Gradient
              </button>
              <button
                onClick={() => setBackgroundMode('image')}
                className={`px-3 py-1 rounded ${
                  backgroundMode === 'image' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}
              >
                Image
              </button>
            </div>

            {backgroundMode === 'color' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={theme.backgroundColor || '#ffffff'}
                    onChange={(e) => updateTheme({ backgroundColor: e.target.value })}
                    className="h-10 w-20 rounded border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={theme.backgroundColor || '#ffffff'}
                    onChange={(e) => updateTheme({ backgroundColor: e.target.value })}
                    className="flex-1 px-3 py-2 border rounded-lg"
                    placeholder="#ffffff"
                  />
                </div>
              </div>
            )}

            {backgroundMode === 'gradient' && (
              <>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {gradientPresets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => applyGradient(preset.colors)}
                      className="h-16 rounded-lg border-2 border-gray-300 hover:border-blue-500 transition-colors"
                      style={{
                        background: `linear-gradient(135deg, ${preset.colors[0]}, ${preset.colors[1]})`,
                      }}
                      title={preset.name}
                    />
                  ))}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Custom Gradient
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={theme.backgroundGradient?.colors[0] || '#667eea'}
                      onChange={(e) =>
                        updateTheme({
                          backgroundGradient: {
                            type: 'linear',
                            colors: [e.target.value, theme.backgroundGradient?.colors[1] || '#764ba2'],
                            angle: theme.backgroundGradient?.angle || 135,
                          },
                        })
                      }
                      className="h-10 w-20 rounded border cursor-pointer"
                    />
                    <input
                      type="color"
                      value={theme.backgroundGradient?.colors[1] || '#764ba2'}
                      onChange={(e) =>
                        updateTheme({
                          backgroundGradient: {
                            type: 'linear',
                            colors: [theme.backgroundGradient?.colors[0] || '#667eea', e.target.value],
                            angle: theme.backgroundGradient?.angle || 135,
                          },
                        })
                      }
                      className="h-10 w-20 rounded border cursor-pointer"
                    />
                    <input
                      type="number"
                      value={theme.backgroundGradient?.angle || 135}
                      onChange={(e) =>
                        updateTheme({
                          backgroundGradient: {
                            ...theme.backgroundGradient!,
                            angle: parseInt(e.target.value),
                          },
                        })
                      }
                      className="w-24 px-3 py-2 border rounded-lg"
                      placeholder="Angle"
                      min="0"
                      max="360"
                    />
                  </div>
                </div>
              </>
            )}

            {backgroundMode === 'image' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={theme.backgroundImage || ''}
                    onChange={(e) => updateTheme({ backgroundImage: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="https://example.com/background.jpg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blur Amount: {theme.backgroundBlur || 0}px
                  </label>
                  <input
                    type="range"
                    value={theme.backgroundBlur || 0}
                    onChange={(e) => updateTheme({ backgroundBlur: parseInt(e.target.value) })}
                    min="0"
                    max="20"
                    className="w-full"
                  />
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'typography' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
              <select
                value={theme.fontFamily || fontOptions[0]?.value || 'Inter'}
                onChange={(e) => updateTheme({ fontFamily: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                {fontOptions.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={theme.primaryColor || '#3b82f6'}
                  onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                  className="h-10 w-20 rounded border cursor-pointer"
                />
                <input
                  type="text"
                  value={theme.primaryColor || '#3b82f6'}
                  onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                  className="flex-1 px-3 py-2 border rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={theme.textColor || '#1f2937'}
                  onChange={(e) => updateTheme({ textColor: e.target.value })}
                  className="h-10 w-20 rounded border cursor-pointer"
                />
                <input
                  type="text"
                  value={theme.textColor || '#1f2937'}
                  onChange={(e) => updateTheme({ textColor: e.target.value })}
                  className="flex-1 px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
          </>
        )}

        {activeTab === 'buttons' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Button Style</label>
              <div className="grid grid-cols-3 gap-2">
                {['rounded', 'square', 'pill'].map((style) => (
                  <button
                    key={style}
                    onClick={() => updateTheme({ buttonStyle: style as any })}
                    className={`px-4 py-2 border-2 capitalize ${
                      theme.buttonStyle === style
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-300'
                    } ${
                      style === 'rounded'
                        ? 'rounded-lg'
                        : style === 'pill'
                        ? 'rounded-full'
                        : 'rounded-none'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Button Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={theme.buttonColor || '#3b82f6'}
                  onChange={(e) => updateTheme({ buttonColor: e.target.value })}
                  className="h-10 w-20 rounded border cursor-pointer"
                />
                <input
                  type="text"
                  value={theme.buttonColor || '#3b82f6'}
                  onChange={(e) => updateTheme({ buttonColor: e.target.value })}
                  className="flex-1 px-3 py-2 border rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Button Text Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={theme.buttonTextColor || '#ffffff'}
                  onChange={(e) => updateTheme({ buttonTextColor: e.target.value })}
                  className="h-10 w-20 rounded border cursor-pointer"
                />
                <input
                  type="text"
                  value={theme.buttonTextColor || '#ffffff'}
                  onChange={(e) => updateTheme({ buttonTextColor: e.target.value })}
                  className="flex-1 px-3 py-2 border rounded-lg"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="buttonShadow"
                checked={theme.buttonShadow ?? true}
                onChange={(e) => updateTheme({ buttonShadow: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="buttonShadow" className="text-sm text-gray-700">
                Enable button shadow
              </label>
            </div>
          </>
        )}

        {activeTab === 'layout' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Width: {theme.maxWidth || 680}px
              </label>
              <input
                type="range"
                value={theme.maxWidth || 680}
                onChange={(e) => updateTheme({ maxWidth: parseInt(e.target.value) })}
                min="320"
                max="1200"
                step="20"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Padding: {theme.padding || 24}px
              </label>
              <input
                type="range"
                value={theme.padding || 24}
                onChange={(e) => updateTheme({ padding: parseInt(e.target.value) })}
                min="0"
                max="48"
                step="4"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Block Spacing: {theme.spacing || 16}px
              </label>
              <input
                type="range"
                value={theme.spacing || 16}
                onChange={(e) => updateTheme({ spacing: parseInt(e.target.value) })}
                min="0"
                max="48"
                step="4"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Border Radius: {theme.borderRadius || 12}px
              </label>
              <input
                type="range"
                value={theme.borderRadius || 12}
                onChange={(e) => updateTheme({ borderRadius: parseInt(e.target.value) })}
                min="0"
                max="32"
                step="2"
                className="w-full"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="enableAnimations"
                checked={theme.enableAnimations ?? true}
                onChange={(e) => updateTheme({ enableAnimations: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="enableAnimations" className="text-sm text-gray-700">
                Enable animations
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Custom CSS</label>
              <textarea
                value={theme.customCss || ''}
                onChange={(e) => updateTheme({ customCss: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg font-mono text-sm"
                rows={6}
                placeholder="/* Add custom CSS here */"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
