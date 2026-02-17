"use client";

import { useQRWizard } from "@/store/use-qr-wizard";
import { cn } from "@/lib/utils";
import { useState, useCallback } from "react";
import { ChevronDown, Upload } from "lucide-react";
import QRPreview from "@/components/qr/QRPreview";

type FillType = "solid" | "gradient" | "image";
type GradientMode = "Linear" | "Radial" | "Angular" | "Diamond";

export default function ColorSelection() {
  const { design, updateDesign } = useQRWizard();

  const [fillType, setFillType] = useState<FillType>(design.background.type || "solid");
  const [fillDropdownOpen, setFillDropdownOpen] = useState(false);
  const [gradientMode, setGradientMode] = useState<GradientMode>("Diamond");
  const [gradientDropdownOpen, setGradientDropdownOpen] = useState(false);
  const [bgEnabled, setBgEnabled] = useState(true);

  const handleFillTypeChange = useCallback((type: FillType) => {
    setFillType(type);
    setFillDropdownOpen(false);
    updateDesign({ background: { ...design.background, type } });
  }, [design.background, updateDesign]);

  const handleColorChange = (section: "background" | "dots" | "corners", key: string, value: string) => {
    if (section === "background") {
      updateDesign({ background: { ...design.background, [key]: value } });
    } else if (section === "dots") {
      updateDesign({ dots: { ...design.dots, [key]: value } });
    } else if (section === "corners") {
      updateDesign({ corners: { ...design.corners, [key]: value } });
    }
  };

  const fillTypeLabel = fillType === "solid" ? "Solid Color" : fillType === "gradient" ? "Gradient" : "Image";

  return (
    <div className="wizard-color-layout">
      {/* Left: Controls */}
      <div className="wizard-color-controls">
        {/* Fill Type */}
        <div className="wizard-color-row">
          <span className="wizard-color-label">Fill Type</span>
          <div className="wizard-color-dropdown-wrap">
            <button
              onClick={() => setFillDropdownOpen(!fillDropdownOpen)}
              className="wizard-color-dropdown-btn"
            >
              <span>{fillTypeLabel}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {fillDropdownOpen && (
              <div className="wizard-color-dropdown-menu">
                <button onClick={() => handleFillTypeChange("solid")} className={cn("wizard-color-dropdown-item", fillType === "solid" && "wizard-color-dropdown-item--active")}>Solid Color</button>
                <button onClick={() => handleFillTypeChange("gradient")} className={cn("wizard-color-dropdown-item", fillType === "gradient" && "wizard-color-dropdown-item--active")}>Gradient</button>
                <button onClick={() => handleFillTypeChange("image")} className={cn("wizard-color-dropdown-item", fillType === "image" && "wizard-color-dropdown-item--active")}>Image</button>
              </div>
            )}
          </div>
        </div>

        {/* Solid Color mode */}
        {fillType === "solid" && (
          <>
            <ColorRow
              label="Fill Color"
              value={design.dots.color}
              onChange={(v) => handleColorChange("dots", "color", v)}
            />
            <ColorRow
              label="Eye external Color"
              value={design.corners.squareColor}
              onChange={(v) => handleColorChange("corners", "squareColor", v)}
            />
            <ColorRow
              label="Eye Internal Color"
              value={design.corners.dotColor}
              onChange={(v) => handleColorChange("corners", "dotColor", v)}
            />

            {/* Background toggle */}
            <div className="wizard-color-row">
              <span className="wizard-color-label">Background</span>
              <button
                onClick={() => setBgEnabled(!bgEnabled)}
                className={cn("wizard-color-toggle", bgEnabled && "wizard-color-toggle--on")}
              >
                <span className="wizard-color-toggle-thumb" />
              </button>
            </div>

            {bgEnabled && (
              <ColorRow
                label="Background Color"
                value={design.background.color}
                onChange={(v) => handleColorChange("background", "color", v)}
              />
            )}
          </>
        )}

        {/* Gradient mode */}
        {fillType === "gradient" && (
          <>
            {/* Gradient type dropdown */}
            <div className="wizard-color-row">
              <div className="wizard-color-dropdown-wrap">
                <button
                  onClick={() => setGradientDropdownOpen(!gradientDropdownOpen)}
                  className="wizard-color-dropdown-btn"
                >
                  <span>{gradientMode}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {gradientDropdownOpen && (
                  <div className="wizard-color-dropdown-menu">
                    {(["Linear", "Radial", "Angular", "Diamond"] as GradientMode[]).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => { setGradientMode(mode); setGradientDropdownOpen(false); }}
                        className={cn("wizard-color-dropdown-item", gradientMode === mode && "wizard-color-dropdown-item--active")}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Gradient preview bar */}
            <div className="wizard-gradient-preview">
              <div
                className="wizard-gradient-bar"
                style={{
                  background: `linear-gradient(to right, ${design.background.gradientColor1 || "#FAF1FF"}, ${design.background.gradientColor2 || "#EEEEEE"})`
                }}
              />
            </div>

            {/* Gradient stops */}
            <div className="wizard-gradient-stops">
              <div className="wizard-gradient-stop">
                <span className="wizard-gradient-stop-pct">0%</span>
                <input
                  type="color"
                  value={design.background.gradientColor1 || "#FAF1FF"}
                  onChange={(e) => updateDesign({ background: { ...design.background, gradientColor1: e.target.value } })}
                  className="wizard-color-swatch"
                />
                <span className="wizard-gradient-stop-hex">{(design.background.gradientColor1 || "#FAF1FF").replace("#", "").toUpperCase()}</span>
                <span className="wizard-gradient-stop-opacity">100 %</span>
              </div>
              <div className="wizard-gradient-stop">
                <span className="wizard-gradient-stop-pct">100%</span>
                <input
                  type="color"
                  value={design.background.gradientColor2 || "#EEEEEE"}
                  onChange={(e) => updateDesign({ background: { ...design.background, gradientColor2: e.target.value } })}
                  className="wizard-color-swatch"
                />
                <span className="wizard-gradient-stop-hex">{(design.background.gradientColor2 || "#EEEEEE").replace("#", "").toUpperCase()}</span>
                <span className="wizard-gradient-stop-opacity">100 %</span>
              </div>
            </div>

            {/* Background toggle & color */}
            <div className="wizard-color-row">
              <span className="wizard-color-label">Background</span>
              <button
                onClick={() => setBgEnabled(!bgEnabled)}
                className={cn("wizard-color-toggle", bgEnabled && "wizard-color-toggle--on")}
              >
                <span className="wizard-color-toggle-thumb" />
              </button>
            </div>
            {bgEnabled && (
              <ColorRow
                label="Background Color"
                value={design.background.color}
                onChange={(v) => handleColorChange("background", "color", v)}
              />
            )}
          </>
        )}

        {/* Image mode */}
        {fillType === "image" && (
          <>
            <div className="wizard-image-upload">
              <Upload className="w-6 h-6 text-gray-400" />
              <p className="wizard-image-upload-text">Drop your file here</p>
              <span className="wizard-image-upload-or">or</span>
              <button className="wizard-image-upload-btn">Browse Files</button>
            </div>

            <div className="wizard-color-row">
              <span className="wizard-color-label">Background</span>
              <button
                onClick={() => setBgEnabled(!bgEnabled)}
                className={cn("wizard-color-toggle", bgEnabled && "wizard-color-toggle--on")}
              >
                <span className="wizard-color-toggle-thumb" />
              </button>
            </div>
            {bgEnabled && (
              <ColorRow
                label="Background Color"
                value={design.background.color}
                onChange={(v) => handleColorChange("background", "color", v)}
              />
            )}
          </>
        )}
      </div>

      {/* Right: QR Preview */}
      <div className="wizard-color-preview">
        <div className="wizard-color-preview-card">
          <QRPreview />
          <p className="wizard-preview-hint">Double click to enlarge</p>
        </div>
        <button className="wizard-ai-btn">
          <span>💡</span> Create With AI
        </button>
      </div>
    </div>
  );
}

/* Reusable color row: label + 4 swatches + RGB button */
function ColorRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="wizard-color-row">
      <span className="wizard-color-label">{label}</span>
      <div className="wizard-color-swatches">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="wizard-color-swatch wizard-color-swatch--main"
        />
        <div className="wizard-color-swatch wizard-color-swatch--preset" style={{ background: "#C4A0E8" }} onClick={() => onChange("#C4A0E8")} />
        <div className="wizard-color-swatch wizard-color-swatch--preset" style={{ background: "#7DDBA3" }} onClick={() => onChange("#7DDBA3")} />
        <div className="wizard-color-swatch wizard-color-swatch--preset" style={{ background: "#FFFFFF", border: "1px solid #E0E0E0" }} onClick={() => onChange("#FFFFFF")} />
        <button className="wizard-color-rgb-btn">RGB</button>
      </div>
    </div>
  );
}
