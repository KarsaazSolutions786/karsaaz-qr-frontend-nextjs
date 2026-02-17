"use client";

import { cn } from "@/lib/utils";
import React from "react";

const PATTERN_TYPES = [
  { id: "square", name: "Square", icon: "▢" },
  { id: "rounded", name: "Rounded", icon: "◉" },
  { id: "circle", name: "Circle", icon: "●" },
  { id: "diamond", name: "Diamond", icon: "◆" },
  { id: "line", name: "Line", icon: "║" },
  { id: "dot", name: "Dot", icon: "·" },
];

interface PatternSelectorProps {
  value?: string;
  onChange: (pattern: string) => void;
  label?: string;
  className?: string;
}

export function PatternSelector({
  value = "square",
  onChange,
  label,
  className,
}: PatternSelectorProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {label && (
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 px-1 ml-0.5 border-l-2 border-blue-600/30 block">
          {label}
        </label>
      )}

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {PATTERN_TYPES.map((pattern) => (
          <button
            key={pattern.id}
            type="button"
            onClick={() => onChange(pattern.id)}
            className={cn(
              "relative flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 group h-24 w-full",
              value === pattern.id
                ? "border-blue-600 bg-blue-50/50 dark:bg-blue-900/10 shadow-md ring-2 ring-blue-600/20"
                : "border-gray-100 bg-white dark:bg-zinc-950 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 hover:shadow-sm"
            )}
          >
            <div className="text-3xl mb-2 transition-transform group-hover:scale-125 duration-200">
              {pattern.icon}
            </div>
            <span
              className={cn(
                "text-[9px] font-black uppercase tracking-tighter text-center leading-none",
                value === pattern.id
                  ? "text-blue-700 dark:text-blue-400"
                  : "text-muted-foreground"
              )}
            >
              {pattern.name}
            </span>
            {value === pattern.id && (
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-1 bg-blue-600 rounded-full animate-in fade-in zoom-in duration-300" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
