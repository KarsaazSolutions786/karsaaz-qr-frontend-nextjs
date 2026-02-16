"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormContext } from "react-hook-form";

export function BackgroundFields() {
  const { register, watch, setValue } = useFormContext();
  const backgroundEnabled = watch("design.backgroundEnabled") ?? true;

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="bg-enabled"
          checked={backgroundEnabled}
          onCheckedChange={(checked) => setValue("design.backgroundEnabled", checked)}
        />
        <Label htmlFor="bg-enabled" className="text-xs font-bold uppercase text-muted-foreground cursor-pointer">Enable Background</Label>
      </div>

      {backgroundEnabled && (
        <div className="space-y-2 pt-2 border-t">
          <Label className="text-xs font-bold uppercase text-muted-foreground">Background Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              className="h-9 w-16 p-1"
              {...register("design.backgroundColor")}
            />
            <Input
              type="text"
              className="flex-1 h-9 text-xs"
              placeholder="#FFFFFF"
              {...register("design.backgroundColor")}
            />
          </div>
        </div>
      )}
    </div>
  );
}
