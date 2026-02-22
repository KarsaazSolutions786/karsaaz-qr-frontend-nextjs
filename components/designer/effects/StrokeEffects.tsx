'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface StrokeSettings {
  enabled: boolean;
  width: number;
  color: string;
  opacity: number;
}

interface StrokeEffectsProps {
  stroke?: StrokeSettings;
  onChange: (stroke: StrokeSettings) => void;
}

const defaultStroke: StrokeSettings = {
  enabled: false,
  width: 1,
  color: '#000000',
  opacity: 100,
};

export default function StrokeEffects({ stroke, onChange }: StrokeEffectsProps) {
  const s = stroke ?? defaultStroke;

  const update = (partial: Partial<StrokeSettings>) => {
    onChange({ ...s, ...partial });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="stroke-enabled"
          checked={s.enabled}
          onChange={(e) => update({ enabled: e.target.checked })}
          className="h-4 w-4"
        />
        <Label htmlFor="stroke-enabled" className="font-semibold">Outline / Stroke</Label>
      </div>

      {s.enabled && (
        <div className="space-y-3 pl-6">
          <div className="space-y-1">
            <Label className="text-xs">Width: {s.width}px</Label>
            <Input
              type="range"
              min="1"
              max="8"
              value={s.width}
              onChange={(e) => update({ width: parseInt(e.target.value) })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={s.color}
                  onChange={(e) => update({ color: e.target.value })}
                  className="h-8 w-14"
                />
                <Input
                  type="text"
                  value={s.color}
                  onChange={(e) => update({ color: e.target.value })}
                  className="flex-1 text-xs"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Opacity: {s.opacity}%</Label>
              <Input
                type="range"
                min="0"
                max="100"
                value={s.opacity}
                onChange={(e) => update({ opacity: parseInt(e.target.value) })}
              />
            </div>
          </div>

          {/* Preview */}
          <div className="rounded border border-dashed border-gray-200 p-4 flex items-center justify-center">
            <div
              className="h-16 w-16 rounded bg-gray-800"
              style={{
                outline: `${s.width}px solid ${s.color}${Math.round(s.opacity * 2.55).toString(16).padStart(2, '0')}`,
                outlineOffset: '2px',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
