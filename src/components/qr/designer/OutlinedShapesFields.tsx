"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { qrShapes } from "@/data/qr-designer";
import { useFormContext } from "react-hook-form";
import { SelectorGrid, SelectorItem } from "./SelectorGrid";

export function OutlinedShapesFields() {
  const { register, watch, setValue } = useFormContext();
  const currentShape = watch("design.shape") || "none";

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-top-4 duration-500">
      <SelectorGrid label="Outer Frame Shape" columns={5}>
        {qrShapes.map((shape) => (
          <SelectorItem
            key={shape.id}
            value={shape.id}
            label={shape.name}
            src={`/images/shapes/shape-${shape.id}.jpg`}
            selected={currentShape === shape.id}
            onClick={() => setValue("design.shape", shape.id)}
          />
        ))}
      </SelectorGrid>

      {currentShape !== "none" && (
        <div className="pt-8 border-t border-dashed border-gray-100 dark:border-zinc-900 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-gray-50 dark:bg-zinc-900/50 p-6 rounded-3xl">
            <div className="space-y-1">
              <Label className="text-[10px] font-black uppercase tracking-widest text-blue-900 dark:text-blue-300">Frame Aesthetics</Label>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Adjust the container color</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Input
                type="color"
                className="h-12 w-16 p-1.5 rounded-xl border-none shadow-sm cursor-pointer"
                {...register("design.frameColor")}
              />
              <Input
                type="text"
                className="flex-1 h-12 w-32 rounded-xl font-black font-mono text-xs uppercase bg-white dark:bg-zinc-950 border-none shadow-sm text-center"
                placeholder="#000000"
                {...register("design.frameColor")}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
