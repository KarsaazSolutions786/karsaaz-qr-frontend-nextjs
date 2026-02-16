"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { qrFrames } from "@/data/qr-frames";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

export function FrameSelector() {
    const { register: _register, watch, setValue } = useFormContext();
    const design = watch("design") || {};
    const frameId = design.frame || "none";
    const frameText = design.frameText || "SCAN ME";
    const frameColor = design.frameColor || "#000000";
    const frameTextColor = design.frameTextColor || "#FFFFFF";

    const _currentFrame = qrFrames.find(f => f.id === frameId);

    // Set defaults if missing
    useEffect(() => {
        if (!design.frame) setValue("design.frame", "none");
        if (!design.frameText) setValue("design.frameText", "SCAN ME");
        if (!design.frameColor) setValue("design.frameColor", "#000000");
        if (!design.frameTextColor) setValue("design.frameTextColor", "#FFFFFF");
    }, [design.frame, design.frameText, design.frameColor, design.frameTextColor, setValue]);

    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <Label>Select Frame</Label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {qrFrames.map((frame) => {
                        // Simple preview generation
                        const previewSvg = frame.id === 'none'
                            ? `<svg viewBox="0 0 100 100"><rect width="100" height="100" fill="#f3f4f6" /><text x="50" y="50" text-anchor="middle" font-size="10" fill="#9ca3af">None</text></svg>`
                            : frame.svg(frameColor, frameTextColor, "SCAN");

                        return (
                            <button
                                key={frame.id}
                                type="button"
                                onClick={() => setValue("design.frame", frame.id)}
                                className={cn(
                                    "flex flex-col items-center p-2 border-2 rounded-lg hover:border-blue-400 transition-all",
                                    frameId === frame.id ? "border-blue-600 bg-blue-50" : "border-gray-200"
                                )}
                            >
                                <div
                                    className="h-16 w-16 mb-2"
                                    dangerouslySetInnerHTML={{ __html: previewSvg.replace(/width=".*?"/, 'width="100%"').replace(/height=".*?"/, 'height="100%"') }}
                                />
                                <span className="text-[10px] font-medium truncate w-full text-center">{frame.name}</span>
                            </button>
                        )
                    })}
                </div>
            </div>

            {frameId !== 'none' && (
                <div className="space-y-4 pt-4 border-t">
                    <div className="space-y-3">
                        <Label>Frame Text</Label>
                        <Input
                            value={frameText}
                            onChange={(e) => setValue("design.frameText", e.target.value)}
                            maxLength={20}
                            placeholder="SCAN ME"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Frame Color</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="color"
                                    className="w-12 h-10 p-1"
                                    value={frameColor}
                                    onChange={(e) => setValue("design.frameColor", e.target.value)}
                                />
                                <Input
                                    value={frameColor}
                                    onChange={(e) => setValue("design.frameColor", e.target.value)}
                                    className="flex-1 font-mono uppercase"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Text Color</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="color"
                                    className="w-12 h-10 p-1"
                                    value={frameTextColor}
                                    onChange={(e) => setValue("design.frameTextColor", e.target.value)}
                                />
                                <Input
                                    value={frameTextColor}
                                    onChange={(e) => setValue("design.frameTextColor", e.target.value)}
                                    className="flex-1 font-mono uppercase"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
