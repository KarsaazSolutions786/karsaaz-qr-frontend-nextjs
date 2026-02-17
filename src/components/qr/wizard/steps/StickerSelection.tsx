"use client";

import { useQRWizard } from "@/store/use-qr-wizard";
import { cn } from "@/lib/utils";
import QRPreview from "@/components/qr/QRPreview";

/* Sticker options - placeholder IDs, replace with actual sticker images */
const STICKERS = [
  "none", "scan-me-1", "scan-me-2", "scan-me-3", "scan-me-4",
  "scan-me-5", "scan-me-6", "scan-me-7",
  "arrow-1", "arrow-2", "arrow-3", "arrow-4",
  "arrow-5", "arrow-6", "arrow-7",
  "badge-1", "badge-2", "badge-3",
];

export default function StickerSelection() {
  const { sticker, updateSticker } = useQRWizard();

  return (
    <div className="wizard-sticker-layout">
      {/* Left: Controls */}
      <div className="wizard-sticker-controls">
        {/* Select Sticker grid */}
        <div className="wizard-shape-section">
          <span className="wizard-color-label">Select Sticker</span>
          <div className="wizard-shape-grid">
            {STICKERS.map((id) => (
              <button
                key={id}
                onClick={() => updateSticker({ id })}
                className={cn(
                  "wizard-shape-item",
                  sticker.id === id && "wizard-shape-item--selected"
                )}
              >
                <div className="wizard-shape-preview">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 opacity-60">
                    <rect x="2" y="2" width="20" height="14" rx="2" />
                    <rect x="6" y="18" width="12" height="4" rx="1" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Dropshadow toggle */}
        <div className="wizard-color-row">
          <span className="wizard-color-label">Dropshadow</span>
          <button
            onClick={() => updateSticker({ shadow: !sticker.shadow })}
            className={cn("wizard-color-toggle", sticker.shadow && "wizard-color-toggle--on")}
          >
            <span className="wizard-color-toggle-thumb" />
          </button>
        </div>

        {/* Text to show */}
        <div className="wizard-sticker-text-wrap">
          <input
            type="text"
            placeholder="Text to show"
            value={sticker.text}
            onChange={(e) => updateSticker({ text: e.target.value })}
            className="wizard-data-url-input"
          />
        </div>
      </div>

      {/* Right: QR Preview with sticker */}
      <div className="wizard-color-preview">
        <div className="wizard-color-preview-card">
          <QRPreview />
        </div>
        <button className="wizard-ai-btn">
          <span>💡</span> Create With AI
        </button>
      </div>
    </div>
  );
}
