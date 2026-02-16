"use client";

import { Label } from "@/components/ui/label";
import { ballTypes, eyeTypes, moduleTypes } from "@/data/qr-designer";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";

export function ShapeSelector() {
    const { watch, setValue } = useFormContext();
    const design = watch("design") || {};

    const renderShapeOption = (id: string, name: string, field: string, preview?: string) => {
        const isSelected = design[field] === id || (!design[field] && id === "square");

        return (
            <button
                key={id}
                type="button"
                title={name}
                onClick={() => setValue(`design.${field}`, id)}
                className={cn(
                    "h-12 w-12 rounded-md border-2 flex items-center justify-center p-2 transition-all hover:bg-gray-50 dark:hover:bg-gray-800",
                    isSelected ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200"
                )}
            >
                {preview ? (
                    <svg viewBox="0 0 1 1" className="h-full w-full fill-current text-gray-700 dark:text-gray-300">
                        <path d={preview} />
                    </svg>
                ) : (
                    <span className="text-[10px] uppercase font-bold text-gray-500">{id.substring(0, 3)}</span>
                )}
            </button>
        );
    };

    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <Label>Module Shape</Label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {moduleTypes.map((type) => renderShapeOption(type.id, type.name, "moduleType", type.preview))}
                </div>
            </div>

            <div className="space-y-3">
                <Label>Eye Structure (Frame)</Label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {eyeTypes.map((type) => renderShapeOption(type.id, type.name, "eyeType"))}
                </div>
            </div>

            <div className="space-y-3">
                <Label>Eye Ball Structure</Label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {ballTypes.map((type) => renderShapeOption(type.id, type.name, "ballType"))}
                </div>
            </div>
        </div>
    );
}
