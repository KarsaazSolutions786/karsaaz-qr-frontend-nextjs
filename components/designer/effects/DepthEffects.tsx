'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface DepthSettings {
  enabled: boolean;
  perspective: number;
  rotateX: number;
  rotateY: number;
}

interface DepthEffectsProps {
  depth?: DepthSettings;
  onChange: (depth: DepthSettings) => void;
}

const defaultDepth: DepthSettings = {
  enabled: false,
  perspective: 800,
  rotateX: 0,
  rotateY: 0,
};

export default function DepthEffects({ depth, onChange }: DepthEffectsProps) {
  const d = depth ?? defaultDepth;

  const update = (partial: Partial<DepthSettings>) => {
    onChange({ ...d, ...partial });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="depth-enabled"
          checked={d.enabled}
          onChange={(e) => update({ enabled: e.target.checked })}
          className="h-4 w-4"
        />
        <Label htmlFor="depth-enabled" className="font-semibold">3D Perspective</Label>
      </div>

      {d.enabled && (
        <div className="space-y-3 pl-6">
          <div className="space-y-1">
            <Label className="text-xs">Perspective: {d.perspective}px</Label>
            <Input
              type="range"
              min="200"
              max="2000"
              step="50"
              value={d.perspective}
              onChange={(e) => update({ perspective: parseInt(e.target.value) })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Rotate X: {d.rotateX}°</Label>
              <Input
                type="range"
                min="-45"
                max="45"
                value={d.rotateX}
                onChange={(e) => update({ rotateX: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Rotate Y: {d.rotateY}°</Label>
              <Input
                type="range"
                min="-45"
                max="45"
                value={d.rotateY}
                onChange={(e) => update({ rotateY: parseInt(e.target.value) })}
              />
            </div>
          </div>

          {/* Preview */}
          <div className="rounded border border-dashed border-gray-200 p-6 flex items-center justify-center">
            <div
              style={{
                perspective: `${d.perspective}px`,
              }}
            >
              <div
                className="h-16 w-16 rounded bg-gray-800"
                style={{
                  transform: `rotateX(${d.rotateX}deg) rotateY(${d.rotateY}deg)`,
                  transition: 'transform 0.2s ease',
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
