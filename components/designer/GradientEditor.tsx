'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';

export interface GradientSettings {
  type: 'linear' | 'radial' | 'none';
  colors: Array<{ color: string; position: number }>;
  angle?: number;
}

interface GradientEditorProps {
  gradient?: GradientSettings;
  onChange: (gradient?: GradientSettings) => void;
}

const presetGradients: GradientSettings[] = [
  {
    type: 'linear',
    angle: 45,
    colors: [
      { color: '#667eea', position: 0 },
      { color: '#764ba2', position: 100 },
    ],
  },
  {
    type: 'linear',
    angle: 135,
    colors: [
      { color: '#f093fb', position: 0 },
      { color: '#f5576c', position: 100 },
    ],
  },
  {
    type: 'radial',
    colors: [
      { color: '#4facfe', position: 0 },
      { color: '#00f2fe', position: 100 },
    ],
  },
  {
    type: 'linear',
    angle: 90,
    colors: [
      { color: '#43e97b', position: 0 },
      { color: '#38f9d7', position: 100 },
    ],
  },
  {
    type: 'linear',
    angle: 45,
    colors: [
      { color: '#fa709a', position: 0 },
      { color: '#fee140', position: 100 },
    ],
  },
  {
    type: 'radial',
    colors: [
      { color: '#30cfd0', position: 0 },
      { color: '#330867', position: 100 },
    ],
  },
];

export default function GradientEditor({ gradient, onChange }: GradientEditorProps) {
  const [localGradient, setLocalGradient] = useState<GradientSettings>(
    gradient || {
      type: 'none',
      colors: [
        { color: '#000000', position: 0 },
        { color: '#ffffff', position: 100 },
      ],
    }
  );

  const updateGradient = (updates: Partial<GradientSettings>) => {
    const newGradient = { ...localGradient, ...updates };
    setLocalGradient(newGradient);
    onChange(newGradient.type === 'none' ? undefined : newGradient);
  };

  const addColorStop = () => {
    const newColors = [
      ...localGradient.colors,
      { color: '#888888', position: 50 },
    ].sort((a, b) => a.position - b.position);
    updateGradient({ colors: newColors });
  };

  const removeColorStop = (index: number) => {
    if (localGradient.colors.length <= 2) return;
    const newColors = localGradient.colors.filter((_, i) => i !== index);
    updateGradient({ colors: newColors });
  };

  const updateColorStop = (index: number, updates: Partial<{ color: string; position: number }>) => {
    const newColors = localGradient.colors.map((stop, i) =>
      i === index ? { ...stop, ...updates } : stop
    );
    updateGradient({ colors: newColors.sort((a, b) => a.position - b.position) });
  };

  const applyPreset = (preset: GradientSettings) => {
    setLocalGradient(preset);
    onChange(preset);
  };

  const getGradientPreview = (gradientSettings: GradientSettings) => {
    if (gradientSettings.type === 'none') return 'transparent';
    
    const colorStops = gradientSettings.colors
      .map((stop) => `${stop.color} ${stop.position}%`)
      .join(', ');
    
    if (gradientSettings.type === 'linear') {
      return `linear-gradient(${gradientSettings.angle || 45}deg, ${colorStops})`;
    } else {
      return `radial-gradient(circle, ${colorStops})`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Gradient Type Selector */}
      <div className="space-y-2">
        <Label>Gradient Type</Label>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={localGradient.type === 'none' ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateGradient({ type: 'none' })}
          >
            None
          </Button>
          <Button
            variant={localGradient.type === 'linear' ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateGradient({ type: 'linear', angle: 45 })}
          >
            Linear
          </Button>
          <Button
            variant={localGradient.type === 'radial' ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateGradient({ type: 'radial' })}
          >
            Radial
          </Button>
        </div>
      </div>

      {localGradient.type !== 'none' && (
        <>
          {/* Angle Slider for Linear Gradients */}
          {localGradient.type === 'linear' && (
            <div className="space-y-2">
              <Label htmlFor="gradient-angle">
                Angle: {localGradient.angle || 0}°
              </Label>
              <Input
                id="gradient-angle"
                type="range"
                min="0"
                max="360"
                value={localGradient.angle || 0}
                onChange={(e) => updateGradient({ angle: parseInt(e.target.value) })}
              />
            </div>
          )}

          {/* Color Stops Editor */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Color Stops</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={addColorStop}
                disabled={localGradient.colors.length >= 5}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Stop
              </Button>
            </div>

            <div className="space-y-2">
              {localGradient.colors.map((stop, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={stop.color}
                    onChange={(e) => updateColorStop(index, { color: e.target.value })}
                    className="h-10 w-16"
                  />
                  <Input
                    type="text"
                    value={stop.color}
                    onChange={(e) => updateColorStop(index, { color: e.target.value })}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={stop.position}
                    onChange={(e) =>
                      updateColorStop(index, { position: parseInt(e.target.value) || 0 })
                    }
                    className="w-20"
                  />
                  <span className="text-xs text-muted-foreground">%</span>
                  {localGradient.colors.length > 2 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeColorStop(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Visual Preview */}
          <div className="space-y-2">
            <Label>Preview</Label>
            <div
              className="h-24 rounded-lg border-2 border-dashed border-gray-300"
              style={{ background: getGradientPreview(localGradient) }}
            />
          </div>

          {/* Preset Gradients Library */}
          <div className="space-y-2">
            <Label>Preset Gradients</Label>
            <div className="grid grid-cols-3 gap-2">
              {presetGradients.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => applyPreset(preset)}
                  className="h-16 rounded-lg border-2 border-gray-200 hover:border-primary transition-colors"
                  style={{ background: getGradientPreview(preset) }}
                  title={`${preset.type} gradient`}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
