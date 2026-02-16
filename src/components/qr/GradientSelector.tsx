"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { gradientTypes } from "@/data/qr-designer";
import { cn } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";
import { useFormContext } from "react-hook-form";

export function GradientSelector() {
    const { watch, setValue } = useFormContext();
    const design = watch("design") || {};
    const gradient = design.gradientFill || {
        type: "LINEAR",
        angle: 45,
        colors: [
            { color: "#000000", stop: 0, opacity: 1 },
            { color: "#808080", stop: 100, opacity: 1 },
        ],
    };

    const updateGradient = (updates: any) => {
        setValue("design.gradientFill", { ...gradient, ...updates });
    };

    const addStop = () => {
        const newColors = [...gradient.colors, { color: "#ffffff", stop: 100, opacity: 1 }];
        updateGradient({ colors: newColors });
    };

    const removeStop = (index: number) => {
        if (gradient.colors.length <= 2) return;
        const newColors = gradient.colors.filter((_: any, i: number) => i !== index);
        updateGradient({ colors: newColors });
    };

    const updateStop = (index: number, updates: any) => {
        const newColors = gradient.colors.map((c: any, i: number) =>
            i === index ? { ...c, ...updates } : c
        );
        updateGradient({ colors: newColors });
    };

    // Generate CSS background string for preview
    const getGradientPreview = () => {
        const colorStops = [...gradient.colors].sort((a, b) => a.stop - b.stop)
            .map((c: any) => `${c.color} ${c.stop}%`)
            .join(", ");

        if (gradient.type === "LINEAR") {
            return `linear-gradient(${gradient.angle}deg, ${colorStops})`;
        }
        return `radial-gradient(circle, ${colorStops})`;
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Label>Gradient Type</Label>
                <div className="flex bg-gray-100 p-1 rounded-md dark:bg-gray-800">
                    {gradientTypes.map((type) => (
                        <button
                            key={type.id}
                            type="button"
                            onClick={() => updateGradient({ type: type.id })}
                            className={cn(
                                "px-3 py-1 text-xs font-medium rounded transition-all",
                                gradient.type === type.id
                                    ? "bg-white text-blue-600 shadow-sm dark:bg-gray-700"
                                    : "text-gray-500 hover:text-gray-900"
                            )}
                        >
                            {type.name}
                        </button>
                    ))}
                </div>
            </div>

            {gradient.type === "LINEAR" && (
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <Label>Angle ({gradient.angle}°)</Label>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="360"
                        value={gradient.angle}
                        onChange={(e) => updateGradient({ angle: parseInt(e.target.value) })}
                        className="w-full"
                    />
                </div>
            )}

            <div className="space-y-3">
                <Label>Color Stops</Label>
                <div
                    className="h-10 w-full rounded-md border mb-4"
                    style={{ background: getGradientPreview() }}
                />

                <div className="space-y-2">
                    {gradient.colors.map((color: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded-md dark:bg-gray-800/50">
                            <Input
                                type="color"
                                value={color.color}
                                onChange={(e) => updateStop(index, { color: e.target.value })}
                                className="w-12 h-8 p-0 border-0"
                            />
                            <div className="flex-1 flex items-center gap-2">
                                <span className="text-xs text-muted-foreground w-8">{color.stop}%</span>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={color.stop}
                                    onChange={(e) => updateStop(index, { stop: parseInt(e.target.value) })}
                                    className="flex-1 h-1"
                                />
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-400 hover:text-red-500"
                                onClick={() => removeStop(index)}
                                disabled={gradient.colors.length <= 2}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                    onClick={addStop}
                    type="button"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Color Stop
                </Button>
            </div>
        </div>
    );
}
