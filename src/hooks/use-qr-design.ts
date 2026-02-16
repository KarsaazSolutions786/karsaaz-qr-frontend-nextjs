import { QRDesign } from "@/services/qr.service";
import { useFormContext } from "react-hook-form";

export interface QRDesignState extends Partial<QRDesign>, Record<string, unknown> {
  // Add any client-only state here if needed
}

export const defaultDesignState: QRDesignState = {
  fillType: "solid",
  foregroundColor: "#000000",
  eyeInternalColor: "#000000",
  eyeExternalColor: "#000000",
  backgroundColor: "#ffffff",
  backgroundEnabled: true,
  module: "square",
  finder: "default",
  finderDot: "default",
  shape: "none",
  frameColor: "#000000",
  logoScale: 0.2,
  logoPositionX: 0.5,
  logoPositionY: 0.5,
  logoRotate: 0,
  logoBackground: true,
  logoBackgroundFill: "#ffffff",
  logoBackgroundScale: 1.5,
  logoBackgroundShape: "circle",
  advancedShape: "none",
  advancedShapeDropShadow: true,
  advancedShapeFrameColor: "#000000",
  is_ai: false,
  ai_strength: 1.6,
  ai_steps: 18,
  ai_model: "1.1",
};

export function useQRDesign() {
  const { watch, setValue } = useFormContext();
  const design = watch("design") as QRDesignState;

  const updateDesign = (updates: Partial<QRDesignState>) => {
    setValue("design", { ...design, ...updates }, { shouldDirty: true });
  };

  return {
    design: design || defaultDesignState,
    updateDesign,
  };
}
