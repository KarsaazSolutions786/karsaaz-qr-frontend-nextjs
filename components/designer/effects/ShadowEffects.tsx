'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ShadowSettings {
  enabled: boolean;
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
}

interface ShadowEffectsProps {
  shadow?: ShadowSettings;
  onChange: (shadow: ShadowSettings) => void;
}

const defaultShadow: ShadowSettings = {
  enabled: false,
  offsetX: 4,
  offsetY: 4,
  blur: 8,
  spread: 0,
  color: '#000000',
  opacity: 25,
};

export default function ShadowEffects({ shadow, onChange }: ShadowEffectsProps) {
  const s = shadow ?? defaultShadow;

  const update = (partial: Partial<ShadowSettings>) => {
    onChange({ ...s, ...partial });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="shadow-enabled"
          checked={s.enabled}
          onChange={(e) => update({ enabled: e.target.checked })}
          className="h-4 w-4"
        />
        <Label htmlFor="shadow-enabled" className="font-semibold">Drop Shadow</Label>
      </div>

      {s.enabled && (
        <div className="space-y-3 pl-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Offset X: {s.offsetX}px</Label>
              <Input
                type="range"
                min="-20"
                max="20"
                value={s.offsetX}
                onChange={(e) => update({ offsetX: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Offset Y: {s.offsetY}px</Label>
              <Input
                type="range"
                min="-20"
                max="20"
                value={s.offsetY}
                onChange={(e) => update({ offsetY: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Blur: {s.blur}px</Label>
              <Input
                type="range"
                min="0"
                max="30"
                value={s.blur}
                onChange={(e) => update({ blur: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Spread: {s.spread}px</Label>
              <Input
                type="range"
                min="-10"
                max="20"
                value={s.spread}
                onChange={(e) => update({ spread: parseInt(e.target.value) })}
              />
            </div>
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
                boxShadow: `${s.offsetX}px ${s.offsetY}px ${s.blur}px ${s.spread}px ${s.color}${Math.round(s.opacity * 2.55).toString(16).padStart(2, '0')}`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
