'use client';

import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PatternLibrary, { PatternSettings } from '../PatternLibrary';

interface PatternFieldsProps {
  patternSettings?: PatternSettings;
  onChange: (pattern?: PatternSettings) => void;
}

type BlendMode = 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten';

export default function PatternFields({
  patternSettings,
  onChange,
}: PatternFieldsProps) {
  const [enabled, setEnabled] = useState(!!patternSettings && patternSettings.type !== 'none');
  const [blendMode, setBlendMode] = useState<BlendMode>('normal');

  const togglePattern = () => {
    const newEnabled = !enabled;
    setEnabled(newEnabled);
    if (!newEnabled) {
      onChange(undefined);
    } else {
      onChange({
        type: 'dots',
        color: '#e5e7eb',
        density: 50,
      });
    }
  };

  const handlePatternChange = (pattern?: PatternSettings) => {
    onChange(pattern);
    setEnabled(!!pattern && pattern.type !== 'none');
  };

  return (
    <div className="space-y-6">
      {/* Enable/Disable Toggle */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Enable Pattern</Label>
          <p className="text-xs text-muted-foreground">
            Add decorative patterns to QR background
          </p>
        </div>
        <Button
          variant={enabled ? 'default' : 'outline'}
          size="sm"
          onClick={togglePattern}
        >
          {enabled ? 'Enabled' : 'Disabled'}
        </Button>
      </div>

      {enabled && (
        <>
          {/* Pattern Library */}
          <Card className="p-4">
            <PatternLibrary
              selectedPattern={patternSettings}
              onChange={handlePatternChange}
            />
          </Card>

          {/* Blend Mode Selector */}
          <div className="space-y-2">
            <Label htmlFor="blend-mode">Pattern Blend Mode</Label>
            <Select
              value={blendMode}
              onValueChange={(value) => setBlendMode(value as BlendMode)}
            >
              <SelectTrigger id="blend-mode">
                <SelectValue placeholder="Select blend mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="multiply">Multiply</SelectItem>
                <SelectItem value="screen">Screen</SelectItem>
                <SelectItem value="overlay">Overlay</SelectItem>
                <SelectItem value="darken">Darken</SelectItem>
                <SelectItem value="lighten">Lighten</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              How the pattern blends with the QR code background
            </p>
          </div>

          {/* Blend Mode Preview */}
          <div className="space-y-2">
            <Label className="text-sm">Blend Mode Preview</Label>
            <Card className="p-4">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Normal</div>
                  <div className="h-16 bg-blue-100 rounded border" style={{ mixBlendMode: 'normal' }}>
                    <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 opacity-50" />
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Multiply</div>
                  <div className="h-16 bg-blue-100 rounded border" style={{ mixBlendMode: 'multiply' }}>
                    <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 opacity-50" />
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Screen</div>
                  <div className="h-16 bg-blue-100 rounded border" style={{ mixBlendMode: 'screen' }}>
                    <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 opacity-50" />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Pattern Overlay Info */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs text-amber-800">
              <strong>Tip:</strong> Patterns with low density and subtle colors work best.
              Avoid high-contrast patterns that may interfere with QR code scanning.
            </p>
          </div>
        </>
      )}

      {!enabled && (
        <Card className="p-8 text-center">
          <div className="text-muted-foreground">
            <p className="text-sm mb-2">Pattern is disabled</p>
            <p className="text-xs">
              Enable patterns to add decorative backgrounds to your QR code
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
