"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface SelectorItemProps {
    value: string;
    label?: string;
    src?: string;
    icon?: React.ReactNode;
    selected: boolean;
    onClick: () => void;
    disabled?: boolean;
}

export function SelectorItem({ value, label, src, icon, selected, onClick, disabled }: SelectorItemProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "relative flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all duration-200 group h-20 w-full",
                selected
                    ? "border-blue-600 bg-blue-50/50 dark:bg-blue-900/10 shadow-sm ring-1 ring-blue-600/20"
                    : "border-gray-100 bg-white dark:bg-zinc-950 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 hover:shadow-sm",
                disabled && "opacity-40 cursor-not-allowed grayscale"
            )}
        >
            <div className="relative w-10 h-10 mb-1.5 flex items-center justify-center transition-transform group-hover:scale-110 duration-200">
                {src ? (
                    <img
                        src={src}
                        alt={label || value}
                        className={cn(
                            "object-contain w-full h-full",
                            selected ? "opacity-100" : "opacity-60 group-hover:opacity-80"
                        )}
                    />
                ) : (
                    <div className={cn(
                        "w-full h-full flex items-center justify-center",
                        selected ? "text-blue-600" : "text-muted-foreground"
                    )}>
                        {icon}
                    </div>
                )}
            </div>
            {label && (
                <span className={cn(
                    "text-[8px] font-black uppercase tracking-tighter truncate w-full px-1 text-center leading-none",
                    selected ? "text-blue-700 dark:text-blue-400" : "text-muted-foreground"
                )}>
                    {label}
                </span>
            )}
            {selected && (
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-1 bg-blue-600 rounded-full animate-in fade-in zoom-in duration-300" />
            )}
        </button>
    );
}

interface SelectorGridProps {
    label?: string;
    children: React.ReactNode;
    columns?: number;
    className?: string;
}

export function SelectorGrid({ label, children, columns = 4, className }: SelectorGridProps) {
    return (
        <div className={cn("space-y-3", className)}>
            {label && (
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 px-1 ml-0.5 border-l-2 border-blue-600/30">
                    {label}
                </label>
            )}
            <div className={cn(
                "grid gap-2",
                columns === 4 ? "grid-cols-4" : columns === 3 ? "grid-cols-3" : columns === 5 ? "grid-cols-5" : columns === 6 ? "grid-cols-6" : "grid-cols-4"
            )}>
                {children}
            </div>
        </div>
    );
}
