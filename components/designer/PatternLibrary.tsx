'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';

export interface PatternSettings {
  type: 'dots' | 'squares' | 'custom' | 'none';
  color: string;
  density: number;
  customImage?: string;
}

interface PatternLibraryProps {
  selectedPattern?: PatternSettings;
  onChange: (pattern?: PatternSettings) => void;
}

const defaultPattern: PatternSettings = {
  type: 'none',
  color: '#e5e7eb',
  density: 50,
};

export default function PatternLibrary({ selectedPattern, onChange }: PatternLibraryProps) {
  const [pattern, setPattern] = useState<PatternSettings>(selectedPattern || defaultPattern);

  const updatePattern = (updates: Partial<PatternSettings>) => {
    const newPattern = { ...pattern, ...updates };
    setPattern(newPattern);
    onChange(newPattern.type === 'none' ? undefined : newPattern);
  };

  const handleCustomImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updatePattern({ type: 'custom', customImage: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const patternOptions = [
    {
      type: 'none' as const,
      name: 'None',
      preview: (
        <div className="w-full h-full bg-white border-2 border-dashed border-gray-300" />
      ),
    },
    {
      type: 'dots' as const,
      name: 'Dots',
      preview: (
        <div
          className="w-full h-full bg-white"
          style={{
            backgroundImage: `radial-gradient(circle, ${pattern.color} 2px, transparent 2px)`,
            backgroundSize: '12px 12px',
          }}
        />
      ),
    },
    {
      type: 'squares' as const,
      name: 'Squares',
      preview: (
        <div
          className="w-full h-full bg-white"
          style={{
            backgroundImage: `
              linear-gradient(90deg, ${pattern.color} 1px, transparent 1px),
              linear-gradient(180deg, ${pattern.color} 1px, transparent 1px)
            `,
            backgroundSize: '10px 10px',
          }}
        />
      ),
    },
    {
      type: 'custom' as const,
      name: 'Custom',
      preview: pattern.customImage ? (
        <div
          className="w-full h-full bg-white bg-cover bg-center"
          style={{ backgroundImage: `url(${pattern.customImage})` }}
        />
      ) : (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
          <Upload className="w-6 h-6 text-gray-400" />
        </div>
      ),
    },
  ];

  const getPatternPreview = () => {
    switch (pattern.type) {
      case 'dots':
        return (
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle, ${pattern.color} ${pattern.density / 25}px, transparent ${pattern.density / 25}px)`,
              backgroundSize: `${pattern.density / 4}px ${pattern.density / 4}px`,
            }}
          />
        );
      case 'squares':
        return (
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(90deg, ${pattern.color} 1px, transparent 1px),
                linear-gradient(180deg, ${pattern.color} 1px, transparent 1px)
              `,
              backgroundSize: `${pattern.density / 5}px ${pattern.density / 5}px`,
            }}
          />
        );
      case 'custom':
        return pattern.customImage ? (
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${pattern.customImage})`,
              opacity: pattern.density / 100,
            }}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="mb-3 block">Pattern Type</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {patternOptions.map((option) => (
            <button
              key={option.type}
              onClick={() => updatePattern({ type: option.type })}
              className={`relative aspect-square rounded-lg border-2 transition-all overflow-hidden ${
                pattern.type === option.type
                  ? 'border-primary ring-2 ring-primary ring-offset-2'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {option.preview}
              <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm py-1 text-xs font-medium text-center border-t">
                {option.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {pattern.type !== 'none' && (
        <>
          {/* Pattern Color Picker */}
          {pattern.type !== 'custom' && (
            <div className="space-y-2">
              <Label htmlFor="pattern-color">Pattern Color</Label>
              <div className="flex gap-2">
                <Input
                  id="pattern-color"
                  type="color"
                  value={pattern.color}
                  onChange={(e) => updatePattern({ color: e.target.value })}
                  className="h-10 w-20"
                />
                <Input
                  type="text"
                  value={pattern.color}
                  onChange={(e) => updatePattern({ color: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>
          )}

          {/* Pattern Density Slider */}
          <div className="space-y-2">
            <Label htmlFor="pattern-density">
              {pattern.type === 'custom' ? 'Opacity' : 'Density'}: {pattern.density}%
            </Label>
            <Input
              id="pattern-density"
              type="range"
              min="10"
              max="100"
              value={pattern.density}
              onChange={(e) => updatePattern({ density: parseInt(e.target.value) })}
            />
          </div>

          {/* Custom Pattern Upload */}
          {pattern.type === 'custom' && (
            <div className="space-y-2">
              <Label>Upload Custom Pattern</Label>
              <div className="flex gap-2">
                <label htmlFor="custom-pattern-upload" className="flex-1">
                  <Button variant="outline" className="w-full" asChild>
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Image
                    </span>
                  </Button>
                  <input
                    id="custom-pattern-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCustomImageUpload}
                  />
                </label>
                {pattern.customImage && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updatePattern({ customImage: undefined })}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Recommended: PNG with transparency, 256x256px
              </p>
            </div>
          )}

          {/* Pattern Preview */}
          <div className="space-y-2">
            <Label>Pattern Preview</Label>
            <Card className="p-0 overflow-hidden">
              <div className="h-32 bg-white relative">{getPatternPreview()}</div>
            </Card>
          </div>
        </>
      )}

      {pattern.type === 'none' && (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">No pattern selected</p>
          <p className="text-xs mt-1">Choose a pattern type to get started</p>
        </div>
      )}
    </div>
  );
}
