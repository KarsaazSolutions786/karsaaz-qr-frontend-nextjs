'use client';

import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeftRight } from 'lucide-react';

interface ColorFieldsProps {
  foregroundColor: string;
  backgroundColor: string;
  onChange: (foreground: string, background: string) => void;
}

const recentColors: string[] = [
  '#000000',
  '#ffffff',
  '#ff0000',
  '#00ff00',
  '#0000ff',
  '#ffff00',
  '#ff00ff',
  '#00ffff',
];

const favoriteGradients: string[] = [
  '#667eea',
  '#764ba2',
  '#f093fb',
  '#f5576c',
  '#4facfe',
  '#00f2fe',
  '#43e97b',
  '#38f9d7',
];

export default function ColorFields({
  foregroundColor,
  backgroundColor,
  onChange,
}: ColorFieldsProps) {
  const [localForeground, setLocalForeground] = useState(foregroundColor);
  const [localBackground, setLocalBackground] = useState(backgroundColor);
  const [foregroundOpacity, setForegroundOpacity] = useState(100);
  const [backgroundOpacity, setBackgroundOpacity] = useState(100);

  const updateForeground = (color: string) => {
    setLocalForeground(color);
    onChange(color, localBackground);
  };

  const updateBackground = (color: string) => {
    setLocalBackground(color);
    onChange(localForeground, color);
  };

  const swapColors = () => {
    const tempForeground = localForeground;
    setLocalForeground(localBackground);
    setLocalBackground(tempForeground);
    onChange(localBackground, tempForeground);
  };

  const hexToRgba = (hex: string, opacity: number): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
  };

  const validateHex = (value: string): boolean => {
    return /^#[0-9A-Fa-f]{6}$/.test(value);
  };

  const handleHexInput = (value: string, isForeground: boolean) => {
    if (validateHex(value)) {
      if (isForeground) {
        updateForeground(value);
      } else {
        updateBackground(value);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Foreground Color */}
      <div className="space-y-3">
        <Label>Foreground Color (QR Modules)</Label>
        <Card className="p-4 space-y-3">
          <div className="flex gap-3 items-center">
            {/* Color Picker */}
            <div className="relative">
              <Input
                type="color"
                value={localForeground}
                onChange={(e) => updateForeground(e.target.value)}
                className="h-16 w-16 cursor-pointer"
              />
              <div
                className="absolute inset-0 rounded-md border-2 border-gray-300 pointer-events-none"
                style={{ backgroundColor: hexToRgba(localForeground, foregroundOpacity) }}
              />
            </div>

            {/* Hex Input */}
            <div className="flex-1 space-y-1">
              <Input
                type="text"
                value={localForeground}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase();
                  setLocalForeground(value);
                  if (validateHex(value)) {
                    handleHexInput(value, true);
                  }
                }}
                placeholder="#000000"
                className="font-mono"
                maxLength={7}
              />
              {!validateHex(localForeground) && (
                <p className="text-xs text-red-500">Invalid hex format</p>
              )}
            </div>
          </div>

          {/* Opacity Slider */}
          <div className="space-y-2">
            <Label htmlFor="foreground-opacity" className="text-xs">
              Opacity: {foregroundOpacity}%
            </Label>
            <Input
              id="foreground-opacity"
              type="range"
              min="0"
              max="100"
              value={foregroundOpacity}
              onChange={(e) => setForegroundOpacity(parseInt(e.target.value))}
            />
          </div>

          {/* Color Preview */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <div className="text-muted-foreground mb-1">Solid</div>
              <div
                className="h-12 rounded border-2 border-gray-300"
                style={{ backgroundColor: localForeground }}
              />
            </div>
            <div>
              <div className="text-muted-foreground mb-1">With Opacity</div>
              <div
                className="h-12 rounded border-2 border-gray-300"
                style={{ backgroundColor: hexToRgba(localForeground, foregroundOpacity) }}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Swap Colors Button */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={swapColors}
          className="gap-2"
        >
          <ArrowLeftRight className="w-4 h-4" />
          Swap Colors
        </Button>
      </div>

      {/* Background Color */}
      <div className="space-y-3">
        <Label>Background Color</Label>
        <Card className="p-4 space-y-3">
          <div className="flex gap-3 items-center">
            {/* Color Picker */}
            <div className="relative">
              <Input
                type="color"
                value={localBackground}
                onChange={(e) => updateBackground(e.target.value)}
                className="h-16 w-16 cursor-pointer"
              />
              <div
                className="absolute inset-0 rounded-md border-2 border-gray-300 pointer-events-none"
                style={{ backgroundColor: hexToRgba(localBackground, backgroundOpacity) }}
              />
            </div>

            {/* Hex Input */}
            <div className="flex-1 space-y-1">
              <Input
                type="text"
                value={localBackground}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase();
                  setLocalBackground(value);
                  if (validateHex(value)) {
                    handleHexInput(value, false);
                  }
                }}
                placeholder="#FFFFFF"
                className="font-mono"
                maxLength={7}
              />
              {!validateHex(localBackground) && (
                <p className="text-xs text-red-500">Invalid hex format</p>
              )}
            </div>
          </div>

          {/* Opacity Slider */}
          <div className="space-y-2">
            <Label htmlFor="background-opacity" className="text-xs">
              Opacity: {backgroundOpacity}%
            </Label>
            <Input
              id="background-opacity"
              type="range"
              min="0"
              max="100"
              value={backgroundOpacity}
              onChange={(e) => setBackgroundOpacity(parseInt(e.target.value))}
            />
          </div>

          {/* Color Preview */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <div className="text-muted-foreground mb-1">Solid</div>
              <div
                className="h-12 rounded border-2 border-gray-300"
                style={{ backgroundColor: localBackground }}
              />
            </div>
            <div>
              <div className="text-muted-foreground mb-1">With Opacity</div>
              <div
                className="h-12 rounded border-2 border-gray-300"
                style={{ backgroundColor: hexToRgba(localBackground, backgroundOpacity) }}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Colors */}
      <div className="space-y-2">
        <Label className="text-sm">Recent Colors</Label>
        <div className="grid grid-cols-8 gap-2">
          {recentColors.map((color, index) => (
            <button
              key={index}
              onClick={() => updateForeground(color)}
              className="aspect-square rounded border-2 border-gray-200 hover:border-primary transition-colors"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Favorite/Preset Colors */}
      <div className="space-y-2">
        <Label className="text-sm">Favorite Colors</Label>
        <div className="grid grid-cols-8 gap-2">
          {favoriteGradients.map((color, index) => (
            <button
              key={index}
              onClick={() => updateForeground(color)}
              className="aspect-square rounded border-2 border-gray-200 hover:border-primary transition-colors"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Color Contrast Preview */}
      <div className="space-y-2">
        <Label className="text-sm">Contrast Preview</Label>
        <Card className="p-6">
          <div
            className="h-32 rounded-lg flex items-center justify-center relative overflow-hidden"
            style={{ backgroundColor: localBackground }}
          >
            <div className="grid grid-cols-5 gap-1">
              {Array.from({ length: 25 }).map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: localForeground }}
                />
              ))}
            </div>
          </div>
        </Card>
        <p className="text-xs text-muted-foreground text-center">
          Ensure good contrast for reliable QR scanning
        </p>
      </div>
    </div>
  );
}
