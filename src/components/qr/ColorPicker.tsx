"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

const PRESET_COLORS = [
  "#000000", // Black
  "#FFFFFF", // White
  "#FF0000", // Red
  "#00AA00", // Green
  "#0000FF", // Blue
  "#FFAA00", // Orange
  "#AA00FF", // Purple
  "#00AAAA", // Cyan
];

interface ColorPickerProps {
  value?: string;
  onChange: (color: string) => void;
  label?: string;
  showPresets?: boolean;
  className?: string;
}

export function ColorPicker({
  value = "#000000",
  onChange,
  label,
  showPresets = true,
  className,
}: ColorPickerProps) {
  const [hexInput, setHexInput] = useState(value.toUpperCase());

  useEffect(() => {
    setHexInput(value.toUpperCase());
  }, [value]);

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.toUpperCase();
    setHexInput(inputValue);

    if (/^#[0-9A-F]{6}$/i.test(inputValue)) {
      onChange(inputValue);
    }
  };

  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value.toUpperCase();
    onChange(newColor);
    setHexInput(newColor);
  };

  const handlePresetClick = (color: string) => {
    onChange(color);
    setHexInput(color.toUpperCase());
  };

  return (
    <div className={cn("space-y-4", className)}>
      {label && (
        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          {label}
        </Label>
      )}

      <div className="flex gap-2 items-center">
        <div className="relative">
          <Input
            type="color"
            value={value}
            onChange={handleColorPickerChange}
            className="h-10 w-20 p-1 rounded-lg cursor-pointer border-2 border-gray-200 dark:border-zinc-700"
          />
        </div>
        <Input
          type="text"
          value={hexInput}
          onChange={handleHexChange}
          placeholder="#000000"
          maxLength={7}
          className="flex-1 h-10 rounded-lg font-mono text-xs uppercase bg-gray-50 dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-700"
        />
      </div>

      {showPresets && (
        <div className="space-y-2">
          <Label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
            Preset Colors
          </Label>
          <div className="grid grid-cols-4 gap-2">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handlePresetClick(color)}
                title={color}
                className={cn(
                  "w-full h-8 rounded-lg border-2 transition-all duration-200 flex items-center justify-center",
                  value === color
                    ? "border-blue-600 ring-2 ring-blue-400/50 scale-105 shadow-md"
                    : "border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600"
                )}
                style={{ backgroundColor: color }}
              >
                {value === color && (
                  <div className="w-1.5 h-1.5 bg-white dark:bg-black rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
