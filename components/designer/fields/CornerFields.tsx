'use client';

import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Unlock } from 'lucide-react';

type CornerStyle = 'square' | 'rounded' | 'extra-rounded';

interface CornerSettings {
  style: CornerStyle;
  radius: number;
  applyToAll: boolean;
  individual?: {
    topLeft: number;
    topRight: number;
    bottomLeft: number;
    bottomRight: number;
  };
}

interface CornerFieldsProps {
  cornerSettings: CornerSettings;
  onChange: (settings: CornerSettings) => void;
}

export default function CornerFields({
  cornerSettings,
  onChange,
}: CornerFieldsProps) {
  const [localSettings, setLocalSettings] = useState<CornerSettings>(cornerSettings);

  const updateSettings = (updates: Partial<CornerSettings>) => {
    const newSettings = { ...localSettings, ...updates };
    setLocalSettings(newSettings);
    onChange(newSettings);
  };

  const handleRadiusChange = (radius: number) => {
    if (localSettings.applyToAll) {
      updateSettings({ radius });
    } else {
      updateSettings({
        radius,
        individual: {
          topLeft: radius,
          topRight: radius,
          bottomLeft: radius,
          bottomRight: radius,
        },
      });
    }
  };

  const handleIndividualCorner = (
    corner: keyof NonNullable<CornerSettings['individual']>,
    value: number
  ) => {
    updateSettings({
      individual: {
        ...localSettings.individual,
        topLeft: localSettings.individual?.topLeft || 0,
        topRight: localSettings.individual?.topRight || 0,
        bottomLeft: localSettings.individual?.bottomLeft || 0,
        bottomRight: localSettings.individual?.bottomRight || 0,
        [corner]: value,
      },
    });
  };

  const cornerStyleOptions: Array<{
    style: CornerStyle;
    name: string;
    description: string;
    radius: number;
  }> = [
    {
      style: 'square',
      name: 'Square',
      description: 'Sharp 90° corners',
      radius: 0,
    },
    {
      style: 'rounded',
      name: 'Rounded',
      description: 'Subtle corner radius',
      radius: 8,
    },
    {
      style: 'extra-rounded',
      name: 'Extra Rounded',
      description: 'Large corner radius',
      radius: 16,
    },
  ];

  const getQRPreview = (
    borderRadius: string | number,
    label: string = ''
  ) => {
    return (
      <div className="text-center">
        <div
          className="w-32 h-32 bg-white border-4 border-gray-800 mx-auto mb-2 relative overflow-hidden"
          style={{ borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius }}
        >
          {/* Simulate QR pattern */}
          <div className="absolute inset-2 grid grid-cols-4 grid-rows-4 gap-1">
            {Array.from({ length: 16 }).map((_, i) => (
              <div
                key={i}
                className={`${
                  i % 3 === 0 || i % 5 === 0 ? 'bg-gray-800' : 'bg-transparent'
                }`}
              />
            ))}
          </div>
        </div>
        {label && <div className="text-xs text-muted-foreground">{label}</div>}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Corner Style Selector */}
      <div className="space-y-3">
        <Label>Corner Style</Label>
        <div className="grid grid-cols-3 gap-3">
          {cornerStyleOptions.map((option) => (
            <button
              key={option.style}
              onClick={() =>
                updateSettings({ style: option.style, radius: option.radius })
              }
              className={`p-4 rounded-lg border-2 transition-all ${
                localSettings.style === option.style
                  ? 'border-primary ring-2 ring-primary ring-offset-2'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div
                className="w-16 h-16 bg-gray-800 mx-auto mb-2"
                style={{ borderRadius: `${option.radius}px` }}
              />
              <div className="text-sm font-medium">{option.name}</div>
              <div className="text-xs text-muted-foreground">{option.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Apply to All Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3">
          {localSettings.applyToAll ? (
            <Lock className="w-5 h-5 text-primary" />
          ) : (
            <Unlock className="w-5 h-5 text-gray-400" />
          )}
          <div>
            <Label className="text-sm">Apply to All Corners</Label>
            <p className="text-xs text-muted-foreground">
              {localSettings.applyToAll
                ? 'All corners use the same radius'
                : 'Control each corner individually'}
            </p>
          </div>
        </div>
        <Button
          variant={localSettings.applyToAll ? 'default' : 'outline'}
          size="sm"
          onClick={() => updateSettings({ applyToAll: !localSettings.applyToAll })}
        >
          {localSettings.applyToAll ? 'Locked' : 'Unlocked'}
        </Button>
      </div>

      {/* Corner Radius Slider */}
      {localSettings.applyToAll ? (
        <div className="space-y-2">
          <Label htmlFor="corner-radius">
            Corner Radius: {localSettings.radius}px
          </Label>
          <Input
            id="corner-radius"
            type="range"
            min="0"
            max="32"
            value={localSettings.radius}
            onChange={(e) => handleRadiusChange(parseInt(e.target.value))}
          />
          <p className="text-xs text-muted-foreground">
            Applies to all four corners
          </p>
        </div>
      ) : (
        /* Individual Corner Controls */
        <div className="space-y-4">
          <Label className="text-sm">Individual Corner Control</Label>
          
          {/* Top Left */}
          <div className="space-y-2">
            <Label htmlFor="top-left" className="text-xs">
              Top-Left: {localSettings.individual?.topLeft || 0}px
            </Label>
            <Input
              id="top-left"
              type="range"
              min="0"
              max="32"
              value={localSettings.individual?.topLeft || 0}
              onChange={(e) =>
                handleIndividualCorner('topLeft', parseInt(e.target.value))
              }
            />
          </div>

          {/* Top Right */}
          <div className="space-y-2">
            <Label htmlFor="top-right" className="text-xs">
              Top-Right: {localSettings.individual?.topRight || 0}px
            </Label>
            <Input
              id="top-right"
              type="range"
              min="0"
              max="32"
              value={localSettings.individual?.topRight || 0}
              onChange={(e) =>
                handleIndividualCorner('topRight', parseInt(e.target.value))
              }
            />
          </div>

          {/* Bottom Left */}
          <div className="space-y-2">
            <Label htmlFor="bottom-left" className="text-xs">
              Bottom-Left: {localSettings.individual?.bottomLeft || 0}px
            </Label>
            <Input
              id="bottom-left"
              type="range"
              min="0"
              max="32"
              value={localSettings.individual?.bottomLeft || 0}
              onChange={(e) =>
                handleIndividualCorner('bottomLeft', parseInt(e.target.value))
              }
            />
          </div>

          {/* Bottom Right */}
          <div className="space-y-2">
            <Label htmlFor="bottom-right" className="text-xs">
              Bottom-Right: {localSettings.individual?.bottomRight || 0}px
            </Label>
            <Input
              id="bottom-right"
              type="range"
              min="0"
              max="32"
              value={localSettings.individual?.bottomRight || 0}
              onChange={(e) =>
                handleIndividualCorner('bottomRight', parseInt(e.target.value))
              }
            />
          </div>
        </div>
      )}

      {/* Corner Preview */}
      <div className="space-y-3">
        <Label>Corner Preview</Label>
        <Card className="p-6">
          {localSettings.applyToAll ? (
            <div className="flex justify-center">
              {getQRPreview(localSettings.radius, `${localSettings.radius}px all corners`)}
            </div>
          ) : (
            <div className="flex justify-center">
              {getQRPreview(
                `${localSettings.individual?.topLeft || 0}px ${
                  localSettings.individual?.topRight || 0
                }px ${localSettings.individual?.bottomRight || 0}px ${
                  localSettings.individual?.bottomLeft || 0
                }px`,
                'Individual corners'
              )}
            </div>
          )}
        </Card>
      </div>

      {/* Corner Styles Comparison */}
      <div className="space-y-2">
        <Label className="text-sm">Style Comparison</Label>
        <Card className="p-6 bg-gray-50">
          <div className="grid grid-cols-3 gap-4">
            {getQRPreview(0, 'Square (0px)')}
            {getQRPreview(8, 'Rounded (8px)')}
            {getQRPreview(16, 'Extra (16px)')}
          </div>
        </Card>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-800">
          <strong>Tip:</strong> Rounded corners give your QR code a modern, friendly
          appearance. Ensure corner radius doesn't interfere with the QR code's eye
          patterns (corner squares).
        </p>
      </div>
    </div>
  );
}
