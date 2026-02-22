'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';

export interface PatternSettings {
  type: 'dots' | 'squares' | 'hexagons' | 'diamonds' | 'stripes-h' | 'stripes-v' | 'triangles' | 'waves' | 'custom' | 'none';
  color: string;
  density: number;
  customImage?: string;
  rotation?: number;
  scale?: number;
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
      type: 'hexagons' as const,
      name: 'Hexagons',
      preview: (
        <svg className="w-full h-full" viewBox="0 0 60 60">
          <defs>
            <pattern id="hex-preview" width="20" height="17.32" patternUnits="userSpaceOnUse">
              <polygon points="10,0 20,5 20,12.32 10,17.32 0,12.32 0,5" fill="none" stroke={pattern.color} strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="60" height="60" fill="white" />
          <rect width="60" height="60" fill={`url(#hex-preview)`} />
        </svg>
      ),
    },
    {
      type: 'diamonds' as const,
      name: 'Diamonds',
      preview: (
        <svg className="w-full h-full" viewBox="0 0 60 60">
          <defs>
            <pattern id="diamond-preview" width="12" height="12" patternUnits="userSpaceOnUse">
              <polygon points="6,0 12,6 6,12 0,6" fill={pattern.color} opacity="0.4" />
            </pattern>
          </defs>
          <rect width="60" height="60" fill="white" />
          <rect width="60" height="60" fill={`url(#diamond-preview)`} />
        </svg>
      ),
    },
    {
      type: 'stripes-h' as const,
      name: 'H-Stripes',
      preview: (
        <div
          className="w-full h-full bg-white"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, ${pattern.color} 0px, ${pattern.color} 2px, transparent 2px, transparent 10px)`,
          }}
        />
      ),
    },
    {
      type: 'stripes-v' as const,
      name: 'V-Stripes',
      preview: (
        <div
          className="w-full h-full bg-white"
          style={{
            backgroundImage: `repeating-linear-gradient(90deg, ${pattern.color} 0px, ${pattern.color} 2px, transparent 2px, transparent 10px)`,
          }}
        />
      ),
    },
    {
      type: 'triangles' as const,
      name: 'Triangles',
      preview: (
        <svg className="w-full h-full" viewBox="0 0 60 60">
          <defs>
            <pattern id="tri-preview" width="14" height="12" patternUnits="userSpaceOnUse">
              <polygon points="7,0 14,12 0,12" fill={pattern.color} opacity="0.35" />
            </pattern>
          </defs>
          <rect width="60" height="60" fill="white" />
          <rect width="60" height="60" fill={`url(#tri-preview)`} />
        </svg>
      ),
    },
    {
      type: 'waves' as const,
      name: 'Waves',
      preview: (
        <svg className="w-full h-full" viewBox="0 0 60 60">
          <defs>
            <pattern id="wave-preview" width="60" height="12" patternUnits="userSpaceOnUse">
              <path d="M0,6 Q15,0 30,6 Q45,12 60,6" fill="none" stroke={pattern.color} strokeWidth="1.5" />
            </pattern>
          </defs>
          <rect width="60" height="60" fill="white" />
          <rect width="60" height="60" fill={`url(#wave-preview)`} />
        </svg>
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
    const rotation = pattern.rotation ?? 0;
    const scale = (pattern.scale ?? 100) / 100;
    const transformStyle = {
      transform: `rotate(${rotation}deg) scale(${scale})`,
      transformOrigin: 'center center',
    };

    switch (pattern.type) {
      case 'dots':
        return (
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle, ${pattern.color} ${pattern.density / 25}px, transparent ${pattern.density / 25}px)`,
              backgroundSize: `${pattern.density / 4}px ${pattern.density / 4}px`,
              ...transformStyle,
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
              ...transformStyle,
            }}
          />
        );
      case 'hexagons':
        return (
          <svg className="w-full h-full" viewBox="0 0 120 120" style={transformStyle}>
            <defs>
              <pattern id="hex-full" width="20" height="17.32" patternUnits="userSpaceOnUse">
                <polygon points="10,0 20,5 20,12.32 10,17.32 0,12.32 0,5" fill="none" stroke={pattern.color} strokeWidth="0.5" opacity={pattern.density / 100} />
              </pattern>
            </defs>
            <rect width="120" height="120" fill={`url(#hex-full)`} />
          </svg>
        );
      case 'diamonds':
        return (
          <svg className="w-full h-full" viewBox="0 0 120 120" style={transformStyle}>
            <defs>
              <pattern id="diamond-full" width="12" height="12" patternUnits="userSpaceOnUse">
                <polygon points="6,0 12,6 6,12 0,6" fill={pattern.color} opacity={pattern.density / 200} />
              </pattern>
            </defs>
            <rect width="120" height="120" fill={`url(#diamond-full)`} />
          </svg>
        );
      case 'stripes-h':
        return (
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `repeating-linear-gradient(0deg, ${pattern.color} 0px, ${pattern.color} 2px, transparent 2px, transparent ${pattern.density / 5}px)`,
              ...transformStyle,
            }}
          />
        );
      case 'stripes-v':
        return (
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `repeating-linear-gradient(90deg, ${pattern.color} 0px, ${pattern.color} 2px, transparent 2px, transparent ${pattern.density / 5}px)`,
              ...transformStyle,
            }}
          />
        );
      case 'triangles':
        return (
          <svg className="w-full h-full" viewBox="0 0 120 120" style={transformStyle}>
            <defs>
              <pattern id="tri-full" width="14" height="12" patternUnits="userSpaceOnUse">
                <polygon points="7,0 14,12 0,12" fill={pattern.color} opacity={pattern.density / 200} />
              </pattern>
            </defs>
            <rect width="120" height="120" fill={`url(#tri-full)`} />
          </svg>
        );
      case 'waves':
        return (
          <svg className="w-full h-full" viewBox="0 0 120 120" style={transformStyle}>
            <defs>
              <pattern id="wave-full" width="60" height="12" patternUnits="userSpaceOnUse">
                <path d="M0,6 Q15,0 30,6 Q45,12 60,6" fill="none" stroke={pattern.color} strokeWidth="1.5" opacity={pattern.density / 100} />
              </pattern>
            </defs>
            <rect width="120" height="120" fill={`url(#wave-full)`} />
          </svg>
        );
      case 'custom':
        return pattern.customImage ? (
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${pattern.customImage})`,
              opacity: pattern.density / 100,
              ...transformStyle,
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
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
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

          {/* Rotation & Scale */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pattern-rotation">
                Rotation: {pattern.rotation ?? 0}°
              </Label>
              <Input
                id="pattern-rotation"
                type="range"
                min="0"
                max="360"
                value={pattern.rotation ?? 0}
                onChange={(e) => updatePattern({ rotation: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pattern-scale">
                Scale: {pattern.scale ?? 100}%
              </Label>
              <Input
                id="pattern-scale"
                type="range"
                min="50"
                max="200"
                value={pattern.scale ?? 100}
                onChange={(e) => updatePattern({ scale: parseInt(e.target.value) })}
              />
            </div>
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
