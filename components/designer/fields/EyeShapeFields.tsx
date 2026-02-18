'use client';

import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type EyeShape = 'square' | 'rounded' | 'circle' | 'leaf' | 'custom';

interface EyeSettings {
  outerShape: EyeShape;
  innerShape: EyeShape;
  eyeColor?: string;
  useCustomColor: boolean;
}

interface EyeShapeFieldsProps {
  eyeSettings: EyeSettings;
  onChange: (settings: EyeSettings) => void;
}

export default function EyeShapeFields({
  eyeSettings,
  onChange,
}: EyeShapeFieldsProps) {
  const [localSettings, setLocalSettings] = useState<EyeSettings>(eyeSettings);

  const updateSettings = (updates: Partial<EyeSettings>) => {
    const newSettings = { ...localSettings, ...updates };
    setLocalSettings(newSettings);
    onChange(newSettings);
  };

  const eyeShapeOptions: Array<{
    shape: EyeShape;
    name: string;
    outerPath: string;
    innerPath: string;
  }> = [
    {
      shape: 'square',
      name: 'Square',
      outerPath: 'M0,0 h100 v100 h-100 z M20,20 h60 v60 h-60 z',
      innerPath: 'M35,35 h30 v30 h-30 z',
    },
    {
      shape: 'rounded',
      name: 'Rounded',
      outerPath: 'M20,0 h60 a20,20 0 0 1 20,20 v60 a20,20 0 0 1 -20,20 h-60 a20,20 0 0 1 -20,-20 v-60 a20,20 0 0 1 20,-20 z M30,20 h40 a10,10 0 0 1 10,10 v40 a10,10 0 0 1 -10,10 h-40 a10,10 0 0 1 -10,-10 v-40 a10,10 0 0 1 10,-10 z',
      innerPath: 'M40,35 h20 a5,5 0 0 1 5,5 v20 a5,5 0 0 1 -5,5 h-20 a5,5 0 0 1 -5,-5 v-20 a5,5 0 0 1 5,-5 z',
    },
    {
      shape: 'circle',
      name: 'Circle',
      outerPath: 'M50,0 a50,50 0 1,0 0,100 a50,50 0 1,0 0,-100 M50,20 a30,30 0 1,0 0,60 a30,30 0 1,0 0,-60',
      innerPath: 'M50,35 a15,15 0 1,0 0,30 a15,15 0 1,0 0,-30',
    },
    {
      shape: 'leaf',
      name: 'Leaf',
      outerPath: 'M0,50 Q0,0 50,0 Q100,0 100,50 Q100,100 50,100 Q0,100 0,50 M20,50 Q20,20 50,20 Q80,20 80,50 Q80,80 50,80 Q20,80 20,50',
      innerPath: 'M35,50 Q35,35 50,35 Q65,35 65,50 Q65,65 50,65 Q35,65 35,50',
    },
    {
      shape: 'custom',
      name: 'Custom',
      outerPath: '',
      innerPath: '',
    },
  ];

  const renderEyePreview = (
    outerShape: EyeShape,
    innerShape: EyeShape,
    color: string = '#000000',
    label: string = ''
  ) => {
    const outerOption = eyeShapeOptions.find((opt) => opt.shape === outerShape);
    const innerOption = eyeShapeOptions.find((opt) => opt.shape === innerShape);

    if (!outerOption || !innerOption) return null;

    return (
      <div className="text-center">
        <svg
          viewBox="0 0 100 100"
          className="w-20 h-20 mx-auto mb-2"
          fill={color}
        >
          <path d={outerOption.outerPath} fillRule="evenodd" />
          <path d={innerOption.innerPath} />
        </svg>
        {label && <div className="text-xs text-muted-foreground">{label}</div>}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Outer Eye Shape */}
      <div className="space-y-3">
        <Label>Outer Eye Shape</Label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {eyeShapeOptions.map((option) => (
            <button
              key={`outer-${option.shape}`}
              onClick={() => updateSettings({ outerShape: option.shape })}
              className={`p-3 rounded-lg border-2 transition-all ${
                localSettings.outerShape === option.shape
                  ? 'border-primary ring-2 ring-primary ring-offset-2'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {option.shape !== 'custom' ? (
                <svg viewBox="0 0 100 100" className="w-full h-12" fill="currentColor">
                  <path d={option.outerPath} fillRule="evenodd" />
                </svg>
              ) : (
                <div className="h-12 flex items-center justify-center text-xs text-gray-400">
                  Custom
                </div>
              )}
              <div className="text-xs font-medium mt-2">{option.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Inner Eye Shape */}
      <div className="space-y-3">
        <Label>Inner Eye Shape</Label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {eyeShapeOptions.map((option) => (
            <button
              key={`inner-${option.shape}`}
              onClick={() => updateSettings({ innerShape: option.shape })}
              className={`p-3 rounded-lg border-2 transition-all ${
                localSettings.innerShape === option.shape
                  ? 'border-primary ring-2 ring-primary ring-offset-2'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {option.shape !== 'custom' ? (
                <svg viewBox="0 0 100 100" className="w-full h-12" fill="currentColor">
                  <path d={option.innerPath} />
                </svg>
              ) : (
                <div className="h-12 flex items-center justify-center text-xs text-gray-400">
                  Custom
                </div>
              )}
              <div className="text-xs font-medium mt-2">{option.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Eye Color */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Custom Eye Color</Label>
          <Button
            variant={localSettings.useCustomColor ? 'default' : 'outline'}
            size="sm"
            onClick={() =>
              updateSettings({ useCustomColor: !localSettings.useCustomColor })
            }
          >
            {localSettings.useCustomColor ? 'Custom' : 'Same as Foreground'}
          </Button>
        </div>

        {localSettings.useCustomColor && (
          <div className="flex gap-2">
            <Input
              type="color"
              value={localSettings.eyeColor || '#000000'}
              onChange={(e) => updateSettings({ eyeColor: e.target.value })}
              className="h-10 w-20"
            />
            <Input
              type="text"
              value={localSettings.eyeColor || '#000000'}
              onChange={(e) => updateSettings({ eyeColor: e.target.value })}
              className="flex-1 font-mono"
              placeholder="#000000"
            />
          </div>
        )}
      </div>

      {/* Visual Preview of All 3 Eyes */}
      <div className="space-y-3">
        <Label>All Eyes Preview</Label>
        <Card className="p-6">
          <div className="flex items-center justify-center gap-8">
            {/* Top-Left Eye */}
            {renderEyePreview(
              localSettings.outerShape,
              localSettings.innerShape,
              localSettings.useCustomColor ? localSettings.eyeColor : '#000000',
              'Top-Left'
            )}
            {/* Top-Right Eye */}
            {renderEyePreview(
              localSettings.outerShape,
              localSettings.innerShape,
              localSettings.useCustomColor ? localSettings.eyeColor : '#000000',
              'Top-Right'
            )}
            {/* Bottom-Left Eye */}
            {renderEyePreview(
              localSettings.outerShape,
              localSettings.innerShape,
              localSettings.useCustomColor ? localSettings.eyeColor : '#000000',
              'Bottom-Left'
            )}
          </div>
        </Card>
      </div>

      {/* Eye Styles Comparison */}
      <div className="space-y-2">
        <Label className="text-sm">Style Combinations</Label>
        <Card className="p-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              {renderEyePreview('square', 'square', '#000000', 'Classic')}
            </div>
            <div className="text-center">
              {renderEyePreview('rounded', 'circle', '#000000', 'Modern')}
            </div>
            <div className="text-center">
              {renderEyePreview('circle', 'circle', '#000000', 'Smooth')}
            </div>
          </div>
        </Card>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-800">
          <strong>Eyes (Position Detection Patterns):</strong> These are the three large
          squares in the corners of every QR code. They help scanners identify the code's
          orientation and position. Customizing them can make your QR code more distinctive.
        </p>
      </div>
    </div>
  );
}
