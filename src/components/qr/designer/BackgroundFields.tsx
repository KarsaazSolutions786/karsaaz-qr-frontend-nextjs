"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ColorPicker } from "@/components/qr/ColorPicker";
import { useFormContext } from "react-hook-form";

export function BackgroundFields() {
  const { watch, setValue } = useFormContext();
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
        <div className="space-y-2 pt-2 border-t animate-in fade-in slide-in-from-top-2 duration-300">
          <ColorPicker
            value={watch("design.backgroundColor") || "#FFFFFF"}
            onChange={(color) => setValue("design.backgroundColor", color)}
            label="Background Color"
            showPresets
          />
        </div>
      )}
    </div>
  );
}
