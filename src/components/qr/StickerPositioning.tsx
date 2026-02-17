"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { RotateCw } from "lucide-react";
import React from "react";

export interface StickerPositioningState {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
}

const DEFAULT_STATE: StickerPositioningState = {
  x: 50,
  y: 50,
  scale: 100,
  rotation: 0,
  opacity: 100,
};

interface StickerPositioningProps {
  value?: Partial<StickerPositioningState>;
  onChange: (state: StickerPositioningState) => void;
  label?: string;
  className?: string;
}

export function StickerPositioning({
  value = DEFAULT_STATE,
  onChange,
  label,
  className,
}: StickerPositioningProps) {
  const state: StickerPositioningState = { ...DEFAULT_STATE, ...value };

  const updateState = (updates: Partial<StickerPositioningState>) => {
    onChange({ ...state, ...updates });
  };

  const resetToDefaults = () => {
    onChange(DEFAULT_STATE);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {label && (
        <div className="flex items-center justify-between">
          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            {label}
          </Label>
          <button
            type="button"
            onClick={resetToDefaults}
            className="text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors text-muted-foreground flex items-center gap-1"
          >
            <RotateCw className="h-3 w-3" />
            Reset
          </button>
        </div>
      )}

      {/* Position X */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Position X (%)
          </Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={Math.round(state.x)}
              onChange={(e) =>
                updateState({
                  x: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)),
                })
              }
              min={0}
              max={100}
              className="h-8 w-16 text-center text-xs font-mono rounded-lg bg-gray-50 dark:bg-zinc-900 border-none"
            />
            <span className="text-[10px] font-bold text-muted-foreground">%</span>
          </div>
        </div>
        <Slider
          value={[state.x]}
          min={0}
          max={100}
          step={1}
          onValueChange={(val) => updateState({ x: val[0] })}
        />
      </div>

      {/* Position Y */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Position Y (%)
          </Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={Math.round(state.y)}
              onChange={(e) =>
                updateState({
                  y: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)),
                })
              }
              min={0}
              max={100}
              className="h-8 w-16 text-center text-xs font-mono rounded-lg bg-gray-50 dark:bg-zinc-900 border-none"
            />
            <span className="text-[10px] font-bold text-muted-foreground">%</span>
          </div>
        </div>
        <Slider
          value={[state.y]}
          min={0}
          max={100}
          step={1}
          onValueChange={(val) => updateState({ y: val[0] })}
        />
      </div>

      {/* Scale/Width */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Scale
          </Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={Math.round(state.scale)}
              onChange={(e) =>
                updateState({
                  scale: Math.min(200, Math.max(1, parseInt(e.target.value) || 1)),
                })
              }
              min={1}
              max={200}
              className="h-8 w-16 text-center text-xs font-mono rounded-lg bg-gray-50 dark:bg-zinc-900 border-none"
            />
            <span className="text-[10px] font-bold text-muted-foreground">%</span>
          </div>
        </div>
        <Slider
          value={[state.scale]}
          min={1}
          max={200}
          step={1}
          onValueChange={(val) => updateState({ scale: val[0] })}
        />
      </div>

      {/* Rotation */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Rotation
          </Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={Math.round(state.rotation)}
              onChange={(e) =>
                updateState({
                  rotation: ((parseInt(e.target.value) || 0) % 360 + 360) % 360,
                })
              }
              min={0}
              max={360}
              className="h-8 w-16 text-center text-xs font-mono rounded-lg bg-gray-50 dark:bg-zinc-900 border-none"
            />
            <span className="text-[10px] font-bold text-muted-foreground">°</span>
          </div>
        </div>
        <Slider
          value={[state.rotation]}
          min={0}
          max={360}
          step={1}
          onValueChange={(val) => updateState({ rotation: val[0] })}
        />
      </div>

      {/* Opacity */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Opacity
          </Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={Math.round(state.opacity)}
              onChange={(e) =>
                updateState({
                  opacity: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)),
                })
              }
              min={0}
              max={100}
              className="h-8 w-16 text-center text-xs font-mono rounded-lg bg-gray-50 dark:bg-zinc-900 border-none"
            />
            <span className="text-[10px] font-bold text-muted-foreground">%</span>
          </div>
        </div>
        <Slider
          value={[state.opacity]}
          min={0}
          max={100}
          step={1}
          onValueChange={(val) => updateState({ opacity: val[0] })}
        />
      </div>

      {/* Visual Preview */}
      <div className="mt-6 pt-6 border-t border-dashed border-gray-200 dark:border-zinc-800">
        <Label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground block mb-3">
          Preview
        </Label>
        <div className="w-full h-32 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-800 rounded-xl border-2 border-gray-200 dark:border-zinc-700 relative overflow-hidden flex items-center justify-center">
          {/* QR Code grid background */}
          <div className="absolute inset-0 grid grid-cols-6 gap-1 p-2 opacity-20">
            {Array.from({ length: 36 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-400 dark:bg-zinc-600 rounded-sm"
              />
            ))}
          </div>

          {/* Sticker preview */}
          <div
            className="relative w-6 h-6 bg-blue-600 dark:bg-blue-500 rounded-lg transition-all duration-300 shadow-lg"
            style={{
              left: `${state.x}%`,
              top: `${state.y}%`,
              transform: `translate(-50%, -50%) scale(${state.scale / 100}) rotate(${state.rotation}deg)`,
              opacity: state.opacity / 100,
            }}
          >
            {/* Small indicator dot */}
            <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
              ✓
            </div>
          </div>
        </div>
        <p className="text-[8px] text-muted-foreground mt-2 text-center">
          Position: ({Math.round(state.x)}%, {Math.round(state.y)}%) | Scale:{" "}
          {Math.round(state.scale)}% | Rotate: {Math.round(state.rotation)}° |
          Opacity: {Math.round(state.opacity)}%
        </p>
      </div>
    </div>
  );
}
