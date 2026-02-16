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
import { Switch } from "@/components/ui/switch";
import {
  Box,
  ImageIcon,
  LayoutGrid,
  Palette,
  Settings2,
  Shapes,
  Sparkles,
  Sticker,
  Wand2
} from "lucide-react";
import { useFormContext } from "react-hook-form";

// Sub-components
import { AdvancedShapeFields } from "./AdvancedShapeFields";
import { BackgroundFields } from "./BackgroundFields";
import { FillTypeFields } from "./FillTypeFields";
import { LogoFields } from "./LogoFields";
import { ModuleFields } from "./ModuleFields";
import { OutlinedShapesFields } from "./OutlinedShapesFields";

export function DesignTabs() {
  const { register, watch, setValue } = useFormContext();
  const isAi = watch("design.is_ai") || false;
  const aiStrength = watch("design.ai_strength") || 1.6;
  const aiSteps = watch("design.ai_steps") || 18;
  const aiModel = watch("design.ai_model") || "1.1";

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-left-4 duration-700">
      <div className="flex items-center gap-3 border-b-2 border-blue-600/10 pb-6 mb-8">
        <div className="p-2.5 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200 dark:shadow-none">
          <Settings2 className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-black tracking-tight uppercase text-blue-900 dark:text-blue-100">QR Architecture</h3>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">Configure high-fidelity aesthetics</p>
        </div>
      </div>

      <div className="grid gap-12 divide-y-2 divide-dashed divide-gray-100 dark:divide-zinc-900 pb-20">
        {/* Fill & Colors Section */}
        <section className="space-y-6 pt-0">
          <div className="flex items-center gap-2 mb-2">
            <Palette className="h-4 w-4 text-blue-600" />
            <h4 className="text-xs font-black uppercase tracking-widest text-blue-900 dark:text-blue-200">Colors & Fill</h4>
          </div>
          <FillTypeFields />
        </section>

        {/* Background Section */}
        <section className="space-y-6 pt-10">
          <div className="flex items-center gap-2 mb-2">
            <LayoutGrid className="h-4 w-4 text-blue-600" />
            <h4 className="text-xs font-black uppercase tracking-widest text-blue-900 dark:text-blue-200">Background Canvas</h4>
          </div>
          <BackgroundFields />
        </section>

        {/* Modules & Finders Section */}
        <section className="space-y-8 pt-10">
          <div className="flex items-center gap-2 mb-2">
            <Box className="h-4 w-4 text-blue-600" />
            <h4 className="text-xs font-black uppercase tracking-widest text-blue-900 dark:text-blue-200">Structural Modules</h4>
          </div>
          <ModuleFields />
        </section>

        {/* Outlined Shapes Section */}
        <section className="space-y-8 pt-10">
          <div className="flex items-center gap-2 mb-2">
            <Shapes className="h-4 w-4 text-blue-600" />
            <h4 className="text-xs font-black uppercase tracking-widest text-blue-900 dark:text-blue-200">Outer Geometry</h4>
          </div>
          <OutlinedShapesFields />
        </section>

        {/* Logo Section */}
        <section className="space-y-8 pt-10">
          <div className="flex items-center gap-2 mb-2">
            <ImageIcon className="h-4 w-4 text-blue-600" />
            <h4 className="text-xs font-black uppercase tracking-widest text-blue-900 dark:text-blue-200">Branding & Logo</h4>
          </div>
          <LogoFields />
        </section>

        {/* Sticker / Advanced Shapes Section */}
        <section className="space-y-8 pt-10">
          <div className="flex items-center gap-2 mb-2">
            <Sticker className="h-4 w-4 text-blue-600" />
            <h4 className="text-xs font-black uppercase tracking-widest text-blue-900 dark:text-blue-200">Advanced Frames</h4>
          </div>
          <AdvancedShapeFields />
        </section>

        {/* AI Art Section */}
        <section className="space-y-8 pt-10">
          <div className="flex items-center justify-between p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/10 border-2 border-purple-100/50 dark:border-purple-900/30 rounded-3xl shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-purple-600">
                <Wand2 className="h-5 w-5" />
                <Label className="text-sm font-black uppercase tracking-widest">AI Art Enhancement</Label>
              </div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Transform with generative neural patterns</p>
            </div>
            <Switch
              checked={isAi}
              onCheckedChange={(checked) => setValue("design.is_ai", checked)}
              className="data-[state=checked]:bg-purple-600 scale-110"
            />
          </div>

          {isAi && (
            <div className="space-y-8 animate-in slide-in-from-top-4 duration-500 bg-white dark:bg-zinc-950 p-6 rounded-3xl border-2 border-dashed border-purple-100 dark:border-purple-900/40 shadow-sm">
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Sparkles className="h-3 w-3 text-purple-600" />
                  Neural Prompt
                </Label>
                <textarea
                  className="w-full min-h-[120px] rounded-2xl border-2 border-gray-100 dark:border-zinc-800 bg-background px-4 py-4 text-xs font-medium focus-visible:ring-2 focus-visible:ring-purple-500 shadow-inner"
                  placeholder="e.g. A cyberpunk city at night with neon lights, digital art style..."
                  {...register("design.ai_prompt")}
                />
              </div>

              <div className="space-y-5 px-1">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Creativity Index</Label>
                  <span className="text-[10px] font-black font-mono text-purple-600 bg-purple-50 dark:bg-purple-900/30 px-2 py-1 rounded-full">{aiStrength}</span>
                </div>
                <Slider
                  value={[aiStrength]}
                  min={0.5}
                  max={2.5}
                  step={0.1}
                  onValueChange={(val) => setValue("design.ai_strength", val[0])}
                  className="py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-dashed border-gray-100 dark:border-zinc-900">
                <div className="space-y-3 text-center">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Model Engine</Label>
                  <Select value={aiModel} onValueChange={(val) => setValue("design.ai_model", val)}>
                    <SelectTrigger className="h-10 rounded-xl text-xs font-bold bg-gray-50 dark:bg-zinc-900 border-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-xl">
                      <SelectItem value="1.1" className="text-xs font-bold uppercase">Standard Neural</SelectItem>
                      <SelectItem value="2.0" className="text-xs font-bold uppercase">Creative HD v2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3 text-center">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center block">Processing Steps</Label>
                  <Input
                    type="number"
                    className="h-10 rounded-xl text-xs font-black text-center bg-gray-50 dark:bg-zinc-900 border-none shadow-inner"
                    value={aiSteps}
                    onChange={(e) => setValue("design.ai_steps", parseInt(e.target.value) || 18)}
                  />
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}