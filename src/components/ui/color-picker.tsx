"use client";

import { useCallback, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Pipette } from "lucide-react";

const PRESET_COLORS = [
  "#000000", "#FFFFFF", "#EF4444", "#F97316", "#EAB308",
  "#22C55E", "#06B6D4", "#3B82F6", "#8B5CF6", "#EC4899",
  "#1E293B", "#64748B", "#A855F7", "#14B8A6", "#F43F5E",
  "#0EA5E9", "#84CC16", "#D946EF", "#FB923C", "#6366F1",
];

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  className?: string;
}

export function ColorPicker({ value, onChange, label, className }: ColorPickerProps) {
  const [inputValue, setInputValue] = useState(value || "#000000");
  const nativeRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    (color: string) => {
      setInputValue(color);
      onChange(color);
    },
    [onChange]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setInputValue(v);
    if (/^#[0-9A-Fa-f]{6}$/.test(v)) {
      onChange(v);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("h-9 gap-2 px-3", className)}
          type="button"
        >
          <div
            className="h-4 w-4 rounded-sm border"
            style={{ backgroundColor: value || "#000000" }}
          />
          <span className="text-xs font-mono">{value || "#000000"}</span>
          {label && <span className="text-xs text-muted-foreground ml-1">{label}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="start">
        <div className="space-y-3">
          {/* Color grid */}
          <div className="grid grid-cols-10 gap-1">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                className={cn(
                  "h-5 w-5 rounded-sm border transition-transform hover:scale-125",
                  value === color && "ring-2 ring-primary ring-offset-1"
                )}
                style={{ backgroundColor: color }}
                onClick={() => handleChange(color)}
              />
            ))}
          </div>

          {/* Hex input + native picker */}
          <div className="flex items-center gap-2">
            <Input
              value={inputValue}
              onChange={handleInputChange}
              placeholder="#000000"
              className="h-8 text-xs font-mono"
              maxLength={7}
            />
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 shrink-0"
              type="button"
              onClick={() => nativeRef.current?.click()}
            >
              <Pipette className="h-3.5 w-3.5" />
            </Button>
            <input
              ref={nativeRef}
              type="color"
              value={value || "#000000"}
              onChange={(e) => handleChange(e.target.value)}
              className="sr-only"
              tabIndex={-1}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default ColorPicker;
