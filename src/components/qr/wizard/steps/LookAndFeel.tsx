"use client";

import { useQRWizard } from "@/store/use-qr-wizard";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

// Mock shapes for now - in production import from constants
const DOT_SHAPES = ['square', 'dots', 'rounded', 'classy', 'classy-rounded', 'extra-rounded'];
const EYE_SHAPES = ['square', 'dots', 'rounded', 'leaf', 'circle'];

export default function LookAndFeel() {
  const { design, updateDesign } = useQRWizard();

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Body & Eye Shapes</h2>

      {/* Body Shape */}
      <div className="space-y-4">
        <Label className="text-lg">Body Shape</Label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {DOT_SHAPES.map((shape) => (
            <button
              key={shape}
              onClick={() => updateDesign({ dots: { ...design.dots, type: shape } })}
              className={cn(
                "aspect-square rounded-lg border-2 flex items-center justify-center transition-all hover:bg-gray-50",
                design.dots.type === shape ? "border-primary bg-primary/5" : "border-gray-200"
              )}
            >
              <span className="text-xs capitalize">{shape}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Finder (Eye) Shape */}
      <div className="space-y-4">
        <Label className="text-lg">Finder Shape</Label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
          {EYE_SHAPES.map((shape) => (
            <button
              key={shape}
              onClick={() => updateDesign({ corners: { ...design.corners, type: shape } })}
              className={cn(
                "aspect-square rounded-lg border-2 flex items-center justify-center transition-all hover:bg-gray-50",
                design.corners.type === shape ? "border-primary bg-primary/5" : "border-gray-200"
              )}
            >
              <span className="text-xs capitalize">{shape}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Logo Options */}
      <div className="space-y-4 pt-4 border-t">
        <Label className="text-lg">Logo</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Label className="text-sm text-muted-foreground mb-2 block">Logo Scale</Label>
            <Slider
              value={[design.logo.scale]}
              min={0.1}
              max={1}
              step={0.1}
              onValueChange={([val]) => updateDesign({ logo: { ...design.logo, scale: val } })}
            />
          </div>
          <div>
            <Label className="text-sm text-muted-foreground mb-2 block">Logo Margin</Label>
            <Slider
              value={[design.logo.margin]}
              min={0}
              max={20}
              step={1}
              onValueChange={([val]) => updateDesign({ logo: { ...design.logo, margin: val } })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
