"use client";

import { useQRWizard } from "@/store/use-qr-wizard";
import { cn } from "@/lib/utils";
import { useState } from "react";
import QRPreview from "@/components/qr/QRPreview";

/* Module patterns (body dots) */
const MODULES = [
  "square", "dots", "rounded", "extra-rounded", "classy", "classy-rounded",
  "diamond", "star", "fluid",
  "mosaic", "vertical", "horizontal",
  "circle", "cross", "plus",
  "heart", "arrow", "leaf",
];

/* Finder (eye outer) patterns */
const FINDERS = [
  "square", "rounded", "circle", "leaf", "diamond", "star",
  "shield", "flower", "octagon",
  "cross", "plus", "heart",
];

/* Finder dot (eye inner) patterns */
const FINDER_DOTS = [
  "square", "dot", "rounded", "diamond", "star", "heart", "circle",
  "leaf", "cross", "plus", "arrow", "shield",
  "flower", "octagon", "triangle",
  "mosaic", "fluid", "extra",
];

/* QR outer shapes */
const SHAPES = [
  "square", "rounded", "circle", "leaf", "diamond", "star", "shield",
  "flower", "octagon", "cross", "plus", "heart",
  "mosaic", "fluid", "extra",
  "arrow", "hexagon", "blob",
];

/* Preset logo icons */
const LOGO_PRESETS = [
  { id: "behance", src: "/images/png-logos/behance.png" },
  { id: "skype", src: "/images/png-logos/skype.png" },
  { id: "reddit", src: "/images/png-logos/reddit.png" },
  { id: "wechat", src: "/images/png-logos/wechat.png" },
  { id: "facebook", src: "/images/png-logos/facebook.png" },
  { id: "clubhouse", src: "/images/png-logos/clubhouse.png" },
  { id: "foursquare", src: "/images/png-logos/foursquare.png" },
  { id: "discord", src: "/images/png-logos/discord.png" },
  { id: "google", src: "/images/png-logos/google.png" },
  { id: "instagram", src: "/images/png-logos/instagram.png" },
  { id: "linkedin", src: "/images/png-logos/linkedin.png" },
  { id: "viber", src: "/images/png-logos/viber.png" },
  { id: "snapchat", src: "/images/png-logos/snapchat.png" },
  { id: "youtube", src: "/images/png-logos/youtube.png" },
  { id: "spotify", src: "/images/png-logos/spotify.png" },
  { id: "tiktok", src: "/images/png-logos/tiktok.png" },
  { id: "telegram", src: "/images/png-logos/telegram.png" },
  { id: "twitter", src: "/images/png-logos/twitter.png" },
];

export default function LookAndFeel() {
  const { design, updateDesign } = useQRWizard();
  const [logoType, setLogoType] = useState<"preset" | "custom">("preset");

  return (
    <div className="wizard-look-layout">
      {/* Left: Controls */}
      <div className="wizard-look-controls">
        {/* Select Module */}
        <ShapeGrid
          label="Select Module"
          items={MODULES}
          selected={design.dots.type}
          onSelect={(type) => updateDesign({ dots: { ...design.dots, type } })}
        />

        {/* Select Finder */}
        <ShapeGrid
          label="Select Finder"
          items={FINDERS}
          selected={design.corners.type}
          onSelect={(type) => updateDesign({ corners: { ...design.corners, type } })}
        />

        {/* Select Finder Dot */}
        <ShapeGrid
          label="Select Finder Dot"
          items={FINDER_DOTS}
          selected={design.corners.type + "-dot"}
          onSelect={() => {}}
        />

        {/* Select Shape */}
        <ShapeGrid
          label="Select Shape"
          items={SHAPES}
          selected={design.frame.type}
          onSelect={(type) => updateDesign({ frame: { ...design.frame, type } })}
        />

        {/* Frame Color */}
        <div className="wizard-color-row">
          <span className="wizard-color-label">Frame Color</span>
          <div className="wizard-color-swatches">
            <input
              type="color"
              value={design.frame.color}
              onChange={(e) => updateDesign({ frame: { ...design.frame, color: e.target.value } })}
              className="wizard-color-swatch wizard-color-swatch--main"
            />
            <div className="wizard-color-swatch wizard-color-swatch--preset" style={{ background: "#C4A0E8" }} onClick={() => updateDesign({ frame: { ...design.frame, color: "#C4A0E8" } })} />
            <div className="wizard-color-swatch wizard-color-swatch--preset" style={{ background: "#7DDBA3" }} onClick={() => updateDesign({ frame: { ...design.frame, color: "#7DDBA3" } })} />
            <div className="wizard-color-swatch wizard-color-swatch--preset" style={{ background: "#FFFFFF", border: "1px solid #E0E0E0" }} onClick={() => updateDesign({ frame: { ...design.frame, color: "#FFFFFF" } })} />
            <button className="wizard-color-rgb-btn">RGB</button>
          </div>
        </div>

        {/* Logo Type */}
        <div className="wizard-look-logo-section">
          <div className="wizard-color-row">
            <span className="wizard-color-label">Logo Type</span>
            <div className="wizard-look-logo-toggle">
              <label className="wizard-radio">
                <input
                  type="radio"
                  name="logoType"
                  checked={logoType === "preset"}
                  onChange={() => setLogoType("preset")}
                />
                <span>Preset</span>
              </label>
              <label className="wizard-radio">
                <input
                  type="radio"
                  name="logoType"
                  checked={logoType === "custom"}
                  onChange={() => setLogoType("custom")}
                />
                <span>Your logo</span>
              </label>
            </div>
          </div>

          {logoType === "preset" && (
            <div className="wizard-logo-grid">
              {LOGO_PRESETS.map((logo) => (
                <button
                  key={logo.id}
                  onClick={() => updateDesign({ logo: { ...design.logo, url: logo.src } })}
                  className={cn(
                    "wizard-logo-item",
                    design.logo.url === logo.src && "wizard-logo-item--selected"
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={logo.src} alt={logo.id} className="wizard-logo-img" />
                </button>
              ))}
            </div>
          )}

          {logoType === "custom" && (
            <div className="wizard-image-upload wizard-image-upload--small">
              <p className="wizard-image-upload-text">Drop your logo here or</p>
              <button className="wizard-image-upload-btn">Browse Files</button>
            </div>
          )}
        </div>
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

/* Reusable shape/pattern selection grid */
function ShapeGrid({
  label,
  items,
  selected,
  onSelect,
}: {
  label: string;
  items: string[];
  selected: string;
  onSelect: (type: string) => void;
}) {
  return (
    <div className="wizard-shape-section">
      <span className="wizard-color-label">{label}</span>
      <div className="wizard-shape-grid">
        {items.map((item) => (
          <button
            key={item}
            onClick={() => onSelect(item)}
            className={cn(
              "wizard-shape-item",
              selected === item && "wizard-shape-item--selected"
            )}
          >
            {/* Placeholder pattern preview */}
            <div className="wizard-shape-preview">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <rect x="2" y="2" width="8" height="8" rx={item.includes("rounded") ? 3 : item.includes("circle") ? 10 : 1} />
                <rect x="14" y="2" width="4" height="4" rx={item.includes("dot") ? 4 : 1} />
                <rect x="2" y="14" width="4" height="4" rx={item.includes("dot") ? 4 : 1} />
                <rect x="14" y="14" width="8" height="8" rx={item.includes("rounded") ? 3 : item.includes("circle") ? 10 : 1} />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
