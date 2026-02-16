"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { advancedShapes } from "@/data/qr-designer";
import { Upload } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { SelectorGrid, SelectorItem } from "./SelectorGrid";

const reviewCollectorLogos = 'airbnb,ebay,linkedin,tripadvisor,yelp,aliexpress,facebook,pinterest,trustpilot,yemeksepeti,amazon,foursquare,skype,twitch,youtube,appstore,google-maps,snapchat,twitter,zoom,bitcoin,google,telegram,wechat,booking,googleplay,tiktok,whatsapp,discord,instagram,trendyol,yellowpages'.split(',');

export function AdvancedShapeFields() {
  const { register, watch, setValue } = useFormContext();
  const advancedShape = watch("design.advancedShape") || "none";
  const frameColor = watch("design.advancedShapeFrameColor") || "#000000";
  const dropShadow = watch("design.advancedShapeDropShadow");

  const hasTextParams = !["pincode-protected", "qrcode-details", "review-collector"].includes(advancedShape);
  const isCoupon = advancedShape === "coupon";

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-top-4 duration-500">
      <SelectorGrid label="Signature Sticker Selection" columns={4}>
        {advancedShapes.map((shape) => (
          <SelectorItem
            key={shape.id}
            value={shape.id}
            label={shape.name}
            src={`/images/advanced-shapes/${shape.id}.png`}
            selected={advancedShape === shape.id}
            onClick={() => setValue("design.advancedShape", shape.id)}
          />
        ))}
      </SelectorGrid>

      {advancedShape !== "none" && (
        <div className="space-y-12 pt-10 border-t-2 border-dashed border-gray-100 dark:border-zinc-900 animate-in fade-in slide-in-from-bottom-6 duration-500">

          {/* Global Properties */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="space-y-1">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-900 dark:text-blue-300">Sticker Palette</Label>
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Define the primary frame tone</p>
              </div>
              <div className="flex gap-2">
                <Input type="color" className="h-12 w-16 p-1.5 rounded-xl border-none shadow-md cursor-pointer" value={frameColor} onChange={(e) => setValue("design.advancedShapeFrameColor", e.target.value)} />
                <Input type="text" className="flex-1 h-12 w-32 rounded-xl font-black font-mono text-xs uppercase bg-white dark:bg-zinc-950 border-none shadow-md text-center" value={frameColor} onChange={(e) => setValue("design.advancedShapeFrameColor", e.target.value)} />
              </div>

              {["rect-frame-text-top", "rect-frame-text-bottom", "simple-text-top", "simple-text-bottom"].includes(advancedShape) && (
                <div className="flex items-center justify-between bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/20 mt-4">
                  <div className="space-y-0.5">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-blue-900 dark:text-blue-300">Depth Effect</Label>
                    <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Enable drop shadow</p>
                  </div>
                  <Checkbox
                    checked={dropShadow}
                    onCheckedChange={(checked) => setValue("design.advancedShapeDropShadow", checked)}
                    className="w-6 h-6 rounded-lg data-[state=checked]:bg-blue-600"
                  />
                </div>
              )}
            </div>

            {hasTextParams && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-900 dark:text-blue-300">Sticker Callout</Label>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Main display text on frame</p>
                </div>
                <Input
                  placeholder="SCAN ME"
                  className="h-12 text-xs font-black uppercase tracking-[0.2em] bg-white dark:bg-zinc-950 border-none shadow-md focus-visible:ring-2 focus-visible:ring-blue-600 rounded-xl px-6"
                  {...register("design.text")}
                />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[8px] uppercase font-black text-muted-foreground tracking-widest">Text Style</Label>
                    <div className="flex gap-1.5">
                      <Input type="color" className="h-10 w-10 p-1 rounded-lg border-none shadow-sm" {...register("design.textColor")} />
                      {!isCoupon && <Input type="color" className="h-10 w-10 p-1 rounded-lg border-none shadow-sm" {...register("design.textBackgroundColor")} />}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[8px] uppercase font-black text-muted-foreground tracking-widest">Font Scale</Label>
                    <select className="h-10 w-full rounded-lg bg-gray-50 dark:bg-zinc-900 border-none text-[10px] font-black uppercase tracking-tighter" {...register("design.textSize")}>
                      <option value="1">Normal (1x)</option>
                      <option value="1.5">Large (1.5x)</option>
                      <option value="2">Titan (2x)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Specialized Controls */}
          {advancedShape === "healthcare" && (
            <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/10 rounded-[2.5rem] border-2 border-blue-100/50 dark:border-blue-900/30 animate-in zoom-in-95 duration-500">
              <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-900 dark:text-blue-200 mb-6 font-mono">Healthcare Pipeline Config</h5>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4 text-center">
                  <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest block">Frame Tone</Label>
                  <Input type="color" className="h-12 w-full p-1.5 rounded-2xl shadow-sm" {...register("design.healthcareFrameColor")} />
                </div>
                <div className="space-y-4 text-center">
                  <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest block">Core Accent</Label>
                  <Input type="color" className="h-12 w-full p-1.5 rounded-2xl shadow-sm" {...register("design.healthcareHeartColor")} />
                </div>
              </div>
            </div>
          )}

          {advancedShape === "coupon" && (
            <div className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/10 rounded-[2.5rem] border-2 border-purple-100/50 dark:border-purple-900/30 animate-in zoom-in-95 duration-500">
              <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-900 dark:text-purple-200 mb-6 font-mono">Promotional Coupon Hub</h5>
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="space-y-4 text-center">
                  <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest block">Master Primary</Label>
                  <Input type="color" className="h-12 w-full p-1.5 rounded-2xl shadow-sm" {...register("design.couponLeftColor")} />
                </div>
                <div className="space-y-4 text-center">
                  <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest block">Master Secondary</Label>
                  <Input type="color" className="h-12 w-full p-1.5 rounded-2xl shadow-sm" {...register("design.couponRightColor")} />
                </div>
              </div>
              <div className="space-y-4">
                <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest ml-1">Copywriting Streams</Label>
                <div className="grid gap-3">
                  <Input placeholder="Line 1: EXCLUSIVE OFFER" className="h-12 text-xs font-bold uppercase tracking-widest rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-purple-400" {...register("design.coupon_text_line_1text")} />
                  <Input placeholder="Line 2: 50% DISCOUNT" className="h-12 text-xs font-bold uppercase tracking-widest rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-purple-400" {...register("design.coupon_text_line_2text")} />
                  <Input placeholder="Line 3: LIMITED TIME" className="h-12 text-xs font-bold uppercase tracking-widest rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-purple-400" {...register("design.coupon_text_line_3text")} />
                </div>
              </div>
            </div>
          )}

          {advancedShape === "review-collector" && (
            <div className="p-8 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/10 rounded-[2.5rem] border-2 border-orange-100/50 dark:border-orange-900/30 animate-in zoom-in-95 duration-500">
              <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-900 dark:text-orange-200 mb-6">Trust Signal Integration</h5>
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="space-y-4 text-center">
                  <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest block">Badge Hue</Label>
                  <Input type="color" className="h-12 w-full p-1.5 rounded-2xl shadow-sm" {...register("design.reviewCollectorCircleColor")} />
                </div>
                <div className="space-y-4 text-center">
                  <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest block">Star Accent</Label>
                  <Input type="color" className="h-12 w-full p-1.5 rounded-2xl shadow-sm" {...register("design.reviewCollectorStarsColor")} />
                </div>
              </div>

              <SelectorGrid label="Platform Provider Library" columns={6} className="bg-white/50 dark:bg-zinc-950/50 p-6 rounded-3xl backdrop-blur-sm border border-orange-100/50 dark:border-orange-900/20 shadow-inner">
                {reviewCollectorLogos.map(logo => (
                  <SelectorItem
                    key={logo}
                    value={logo}
                    label={logo}
                    src={`/images/review-collector-logos/${logo}.png`}
                    selected={watch("design.reviewCollectorLogoSrc") === logo}
                    onClick={() => setValue("design.reviewCollectorLogoSrc", logo)}
                  />
                ))}
              </SelectorGrid>

              <div className="mt-8 pt-8 border-t border-dashed border-orange-200/50">
                <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest ml-1 block mb-4 text-center">Alternative Brand Injector</Label>
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-orange-200 dark:border-orange-900/50 rounded-3xl cursor-pointer bg-white/30 dark:bg-zinc-950/30 hover:bg-white/60 transition-all group">
                  <div className="flex items-center gap-3">
                    <Upload className="h-5 w-5 text-orange-600 group-hover:scale-110 transition-transform" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-orange-900/70">Source asset pipeline</span>
                  </div>
                  <input type="file" className="hidden" accept="image/*" />
                </label>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}