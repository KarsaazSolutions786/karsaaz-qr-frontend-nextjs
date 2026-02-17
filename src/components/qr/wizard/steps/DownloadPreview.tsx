"use client";

import { useQRWizard } from "@/store/use-qr-wizard";
import { useState } from "react";
import { Download } from "lucide-react";
import QRPreview from "@/components/qr/QRPreview";

export default function DownloadPreview() {
  const { qrData } = useQRWizard();
  const [name, setName] = useState(qrData.url || "www.google.com");

  const handleDownload = (format: "svg" | "png") => {
    console.log(`Downloading as ${format}...`);
  };

  return (
    <div className="wizard-download-layout">
      {/* Left: Ready message + controls */}
      <div className="wizard-download-controls">
        <div className="wizard-download-heading">
          <h2 className="wizard-download-title">Your Download is</h2>
          <h1 className="wizard-download-ready">Ready !</h1>
        </div>

        <div className="wizard-download-name">
          <label className="wizard-color-label">Name your QR</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="wizard-data-url-input"
          />
        </div>

        <div className="wizard-download-buttons">
          <button onClick={() => handleDownload("svg")} className="wizard-download-btn">
            Download SVG
            <Download className="w-4 h-4" />
          </button>
          <button onClick={() => handleDownload("png")} className="wizard-download-btn">
            Download PNG
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Right: QR Preview */}
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
