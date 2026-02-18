'use client';

import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import GradientEditor, { GradientSettings } from '../GradientEditor';

interface GradientFieldsProps {
  gradientSettings?: GradientSettings;
  onChange: (gradient?: GradientSettings) => void;
}

const quickPresets: GradientSettings[] = [
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
];

export default function GradientFields({
  gradientSettings,
  onChange,
}: GradientFieldsProps) {
  const [enabled, setEnabled] = useState(!!gradientSettings && gradientSettings.type !== 'none');

  const toggleGradient = () => {
    const newEnabled = !enabled;
    setEnabled(newEnabled);
    if (!newEnabled) {
      onChange(undefined);
    } else {
      onChange(quickPresets[0]);
    }
  };

  const handleGradientChange = (gradient?: GradientSettings) => {
    onChange(gradient);
    setEnabled(!!gradient && gradient.type !== 'none');
  };

  const applyQuickPreset = (preset: GradientSettings) => {
    setEnabled(true);
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
      {/* Enable/Disable Toggle */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Enable Gradient</Label>
          <p className="text-xs text-muted-foreground">
            Apply gradient to QR code modules
          </p>
        </div>
        <Button
          variant={enabled ? 'default' : 'outline'}
          size="sm"
          onClick={toggleGradient}
        >
          {enabled ? 'Enabled' : 'Disabled'}
        </Button>
      </div>

      {enabled && (
        <>
          {/* Quick Presets */}
          <div className="space-y-3">
            <Label className="text-sm">Quick Presets</Label>
            <div className="grid grid-cols-2 gap-2">
              {quickPresets.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => applyQuickPreset(preset)}
                  className="h-16 rounded-lg border-2 border-gray-200 hover:border-primary transition-colors overflow-hidden"
                  style={{ background: getGradientPreview(preset) }}
                  title={`${preset.type} gradient preset ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Gradient Editor */}
          <Card className="p-4">
            <GradientEditor
              gradient={gradientSettings}
              onChange={handleGradientChange}
            />
          </Card>

          {/* Application Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              <strong>Note:</strong> Gradients are applied to the foreground color. For best
              scanning results, ensure sufficient contrast with the background.
            </p>
          </div>
        </>
      )}

      {!enabled && (
        <Card className="p-8 text-center">
          <div className="text-muted-foreground">
            <p className="text-sm mb-2">Gradient is disabled</p>
            <p className="text-xs">
              Enable gradient to add beautiful color transitions to your QR code
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
