"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { qrCodeService } from "@/services/qr.service";
import { ImageIcon, Upload } from "lucide-react";
import React from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { SelectorGrid, SelectorItem } from "./SelectorGrid";

const presetLogos = [
  'address-book', 'badoo', 'dribbble', 'dropbox', 'facebook',
  'google-calendar', 'google-forms', 'google-maps', 'google-meet',
  'google-sheets', 'google-slides', 'instagram', 'linkedin',
  'paypal', 'pinterest', 'skype', 'snapchat', 'soundcloud',
  'spotify', 'swarm', 'telegram', 'twitter', 'viber', 'vimeo',
  'vine', 'whatsapp', 'youtube', 'zoom-meeting', 'buymeacoffee', 'patreon'
];

export function LogoFields() {
  const { register, watch, setValue } = useFormContext();
  const logoType = watch("design.logoType") || "none";
  const logoUrl = watch("design.logoUrl");
  const logoBackground = watch("design.logoBackground");
  const logoBackgroundShape = watch("design.logoBackgroundShape") || "circle";
  const idValue = watch("id");

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!idValue) {
      setValue("logoFile", file);
      const objectUrl = URL.createObjectURL(file);
      setValue("design.logoUrl", objectUrl);
      setValue("design.logoType", "custom");
      return;
    }

    try {
      const resp = await qrCodeService.uploadLogo(idValue, file);
      setValue("design.logoUrl", resp.url || resp.path);
      setValue("design.logoType", "custom");
      toast.success("Logo uploaded");
    } catch (err) {
      toast.error("Logo upload failed");
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="space-y-4">
        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <ImageIcon className="h-3 w-3 text-blue-600" />
          Branding Strategy
        </Label>
        <div className="grid grid-cols-3 gap-3">
          {["none", "preset", "custom"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setValue("design.logoType", type)}
              className={cn(
                "py-3 rounded-2xl border-2 text-[10px] font-black uppercase tracking-widest transition-all",
                logoType === type
                  ? "border-blue-600 bg-blue-50 text-blue-600 shadow-md"
                  : "border-gray-100 bg-white dark:bg-zinc-950 dark:border-zinc-800 text-muted-foreground hover:border-gray-200"
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {logoType === "preset" && (
        <SelectorGrid label="Signature Selection" columns={5} className="animate-in fade-in slide-in-from-left-2 duration-300">
          {presetLogos.map((logo) => {
            // We use relative path for client-side rendering
            const relativeUrl = `/images/png-logos/${logo}.png`;
            return (
              <SelectorItem
                key={logo}
                value={logo}
                label={logo}
                src={relativeUrl}
                selected={logoUrl === relativeUrl}
                onClick={() => setValue("design.logoUrl", relativeUrl)}
              />
            );
          })}
        </SelectorGrid>
      )}

      {logoType === "custom" && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-300">
          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Asset Pipeline</Label>
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-3xl cursor-pointer bg-white dark:bg-zinc-950 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-all group">
            <div className="flex flex-col items-center justify-center pt-2">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-2xl mb-2 group-hover:scale-110 transition-transform duration-300">
                <Upload className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Drop vector or high-res PNG</p>
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
          </label>
        </div>
      )}

      {logoType !== "none" && (
        <div className="pt-10 border-t-2 border-dashed border-gray-100 dark:border-zinc-900 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-gray-50 dark:bg-zinc-900/50 p-5 rounded-2xl">
                <div className="space-y-0.5">
                  <Label className="text-xs font-black uppercase tracking-widest text-blue-900 dark:text-blue-300">Isolation Block</Label>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Add background padding</p>
                </div>
                <Checkbox
                  checked={logoBackground}
                  onCheckedChange={(checked) => setValue("design.logoBackground", checked)}
                  className="w-6 h-6 rounded-lg border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
              </div>

              {logoBackground && (
                <div className="space-y-6 bg-white dark:bg-zinc-950 p-6 rounded-3xl border-2 border-gray-50 dark:border-zinc-900 shadow-sm animate-in zoom-in-95 duration-300">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Block Geometry</Label>
                    <div className="flex gap-4">
                      {["circle", "square"].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setValue("design.logoBackgroundShape", s)}
                          className={cn(
                            "px-4 py-2 rounded-xl border-2 text-[8px] font-black uppercase tracking-widest transition-all",
                            logoBackgroundShape === s
                              ? "border-blue-600 bg-blue-50 text-blue-600"
                              : "border-gray-50 text-muted-foreground"
                          )}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Block Density</Label>
                    <div className="flex gap-2">
                      <Input type="color" className="h-10 w-14 p-1 rounded-xl border-none shadow-sm" {...register("design.logoBackgroundFill")} />
                      <Input type="text" className="flex-1 h-10 rounded-xl font-mono text-xs uppercase bg-gray-50 dark:bg-zinc-900 border-none text-center" {...register("design.logoBackgroundFill")} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Isolation Scale</Label>
                      <span className="text-[10px] font-black font-mono text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">{watch("design.logoBackgroundScale") || 1}</span>
                    </div>
                    <Slider
                      value={[watch("design.logoBackgroundScale") || 1]}
                      min={0.3}
                      max={2}
                      step={0.01}
                      onValueChange={(val) => setValue("design.logoBackgroundScale", val[0])}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Optical Scale</Label>
                  <span className="text-[10px] font-black font-mono text-blue-600">{watch("design.logoScale") || 0.2}</span>
                </div>
                <Slider
                  value={[watch("design.logoScale") || 0.2]}
                  min={0.05}
                  max={1}
                  step={0.01}
                  onValueChange={(val) => setValue("design.logoScale", val[0])}
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Translational Rotate</Label>
                  <span className="text-[10px] font-black font-mono text-blue-600">{watch("design.logoRotate") || 0}°</span>
                </div>
                <Slider
                  value={[watch("design.logoRotate") || 0]}
                  min={0}
                  max={360}
                  step={1}
                  onValueChange={(val) => setValue("design.logoRotate", val[0])}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center block">Axis X</Label>
                  <Slider
                    value={[watch("design.logoPositionX") || 0.5]}
                    min={0}
                    max={1}
                    step={0.01}
                    onValueChange={(val) => setValue("design.logoPositionX", val[0])}
                  />
                </div>
                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center block">Axis Y</Label>
                  <Slider
                    value={[watch("design.logoPositionY") || 0.5]}
                    min={0}
                    max={1}
                    step={0.01}
                    onValueChange={(val) => setValue("design.logoPositionY", val[0])}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}