"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ColorPicker } from "@/components/qr/ColorPicker";
import { qrCodeService } from "@/services/qr.service";
import { Palette } from "lucide-react";
import React from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";

export function FillTypeFields() {
  const { register, watch, setValue } = useFormContext();
  const fillType = watch("design.fillType") || "solid";
  const idValue = watch("id");

  // Gradient helper
  const gradientFill = watch("design.gradientFill") || { type: "linear", colors: ["#000000", "#333333"], rotation: 0 };

  const updateGradient = (key: string, value: any) => {
    setValue("design.gradientFill", { ...gradientFill, [key]: value });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!idValue) {
      // Buffer for create
      setValue("foregroundImageFile", file);
      const objectUrl = URL.createObjectURL(file);
      setValue("design.foregroundImage", objectUrl);
      return;
    }

    try {
      const resp = await qrCodeService.uploadDesignFile(idValue, file, "foreground_image");
      setValue("design.foregroundImage", resp.url || resp.path);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error("Upload failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">Select Fill Type</Label>
        <Select
          value={fillType}
          onValueChange={(val) => setValue("design.fillType", val)}
        >
          <SelectTrigger className="h-10 rounded-xl">
            <SelectValue placeholder="Select fill type" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="solid">Solid Color</SelectItem>
            <SelectItem value="gradient">Gradient</SelectItem>
            <SelectItem value="foreground_image">Image Mask</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="pt-4 border-t space-y-4">
        {fillType === "solid" && (
          <ColorPicker
            value={watch("design.foregroundColor") || "#000000"}
            onChange={(color) => setValue("design.foregroundColor", color)}
            label="Main Color"
            showPresets
          />
        )}

        {fillType === "gradient" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase">Gradient Direction</Label>
              <Select
                value={gradientFill.type}
                onValueChange={(val) => updateGradient("type", val)}
              >
                <SelectTrigger className="h-9 rounded-lg text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-lg">
                  <SelectItem value="linear">Linear</SelectItem>
                  <SelectItem value="radial">Radial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <ColorPicker
                value={gradientFill.colors[0]}
                onChange={(color) =>
                  updateGradient("colors", [color, gradientFill.colors[1]])
                }
                label="Start Color"
                showPresets={false}
              />
              <ColorPicker
                value={gradientFill.colors[1]}
                onChange={(color) =>
                  updateGradient("colors", [gradientFill.colors[0], color])
                }
                label="End Color"
                showPresets={false}
              />
            </div>

            {gradientFill.type === "linear" && (
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground">Rotation</Label>
                  <span className="text-[10px] font-mono">{gradientFill.rotation || 0}°</span>
                </div>
                <Slider
                  value={[gradientFill.rotation || 0]}
                  min={0}
                  max={360}
                  step={1}
                  onValueChange={(val: number[]) => updateGradient("rotation", val[0])}
                />
              </div>
            )}
          </div>
        )}

        {fillType === "foreground_image" && (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
            <Label className="text-[10px] font-bold uppercase">Upload Pattern/Image</Label>
            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-xl cursor-pointer bg-muted/20 hover:bg-muted/30 transition-all border-muted group">
              <div className="flex flex-col items-center justify-center py-2">
                <Palette className="h-6 w-6 text-muted-foreground group-hover:text-blue-500 mb-2 transition-colors" />
                <span className="text-[10px] font-medium text-muted-foreground">Select high contrast image</span>
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
            {watch("design.foregroundImage") && (
              <p className="text-[9px] text-center text-blue-600 font-bold truncate">{watch("design.foregroundImage")}</p>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-dashed">
          <ColorPicker
            value={watch("design.eyeInternalColor") || "#000000"}
            onChange={(color) => setValue("design.eyeInternalColor", color)}
            label="Eye Inner"
            showPresets={false}
          />
          <ColorPicker
            value={watch("design.eyeExternalColor") || "#000000"}
            onChange={(color) => setValue("design.eyeExternalColor", color)}
            label="Eye Outer"
            showPresets={false}
          />
        </div>
      </div>
    </div>
  );
}
