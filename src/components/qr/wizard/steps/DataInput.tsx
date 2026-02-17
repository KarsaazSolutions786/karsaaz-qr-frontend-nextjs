"use client";

import { useQRWizard } from "@/store/use-qr-wizard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getQRTypeById } from "@/data/qr-types";

export default function DataInput() {
  const { qrType, qrData, setQRData, setStep } = useQRWizard();

  const updateData = (key: string, value: string) => {
    setQRData({ ...qrData, [key]: value });
  };

  const typeInfo = qrType ? getQRTypeById(qrType) : null;
  const typeName = typeInfo?.name || qrType?.toUpperCase() || "QR Code";

  const handleBack = () => setStep(0);
  const handleNext = () => setStep(2);

  return (
    <div className="wizard-data-input">
      {/* Header: back arrow + type name */}
      <div className="wizard-data-header">
        <button onClick={handleBack} className="wizard-data-back">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="wizard-data-title">{typeName}</h1>
      </div>

      {/* Input form area */}
      <div className="wizard-data-form">
        {renderForm(qrType, qrData, updateData)}
      </div>

      {/* Next button */}
      <div className="wizard-data-actions">
        <button onClick={handleNext} className="wizard-data-next">
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* QR watermark background */}
      <div className="wizard-data-watermark" aria-hidden="true">
        <svg viewBox="0 0 400 400" fill="none" className="wizard-data-watermark-svg">
          {/* Simplified QR pattern */}
          <rect x="0" y="0" width="120" height="120" rx="8" fill="currentColor" opacity="0.06" />
          <rect x="140" y="0" width="40" height="40" rx="4" fill="currentColor" opacity="0.06" />
          <rect x="200" y="0" width="40" height="40" rx="4" fill="currentColor" opacity="0.06" />
          <rect x="280" y="0" width="120" height="120" rx="8" fill="currentColor" opacity="0.06" />
          <rect x="0" y="140" width="40" height="40" rx="4" fill="currentColor" opacity="0.06" />
          <rect x="80" y="140" width="40" height="40" rx="4" fill="currentColor" opacity="0.06" />
          <rect x="140" y="140" width="40" height="40" rx="4" fill="currentColor" opacity="0.06" />
          <rect x="200" y="140" width="40" height="40" rx="4" fill="currentColor" opacity="0.06" />
          <rect x="280" y="140" width="40" height="40" rx="4" fill="currentColor" opacity="0.06" />
          <rect x="360" y="140" width="40" height="40" rx="4" fill="currentColor" opacity="0.06" />
          <rect x="0" y="200" width="40" height="40" rx="4" fill="currentColor" opacity="0.06" />
          <rect x="140" y="200" width="40" height="40" rx="4" fill="currentColor" opacity="0.06" />
          <rect x="280" y="200" width="40" height="40" rx="4" fill="currentColor" opacity="0.06" />
          <rect x="360" y="200" width="40" height="40" rx="4" fill="currentColor" opacity="0.06" />
          <rect x="0" y="280" width="120" height="120" rx="8" fill="currentColor" opacity="0.06" />
          <rect x="140" y="280" width="40" height="40" rx="4" fill="currentColor" opacity="0.06" />
          <rect x="200" y="280" width="40" height="40" rx="4" fill="currentColor" opacity="0.06" />
          <rect x="280" y="280" width="40" height="40" rx="4" fill="currentColor" opacity="0.06" />
          <rect x="360" y="280" width="40" height="40" rx="4" fill="currentColor" opacity="0.06" />
          <rect x="280" y="360" width="40" height="40" rx="4" fill="currentColor" opacity="0.06" />
          <rect x="360" y="360" width="40" height="40" rx="4" fill="currentColor" opacity="0.06" />
        </svg>
      </div>
    </div>
  );
}

function renderForm(
  qrType: string | null,
  qrData: Record<string, string>,
  updateData: (key: string, value: string) => void
) {
  switch (qrType) {
    case "text":
    case "url":
      return (
        <input
          type="url"
          placeholder="Enter URL here"
          value={qrData.url || ""}
          onChange={(e) => updateData("url", e.target.value)}
          className="wizard-data-url-input"
        />
      );

    case "email":
      return (
        <div className="wizard-data-fields">
          <input
            type="email"
            placeholder="Email address"
            value={qrData.email || ""}
            onChange={(e) => updateData("email", e.target.value)}
            className="wizard-data-url-input"
          />
          <input
            type="text"
            placeholder="Subject"
            value={qrData.subject || ""}
            onChange={(e) => updateData("subject", e.target.value)}
            className="wizard-data-url-input"
          />
          <textarea
            placeholder="Message body"
            rows={3}
            value={qrData.body || ""}
            onChange={(e) => updateData("body", e.target.value)}
            className="wizard-data-url-input"
          />
        </div>
      );

    case "wifi":
      return (
        <div className="wizard-data-fields">
          <input
            type="text"
            placeholder="Network name (SSID)"
            value={qrData.ssid || ""}
            onChange={(e) => updateData("ssid", e.target.value)}
            className="wizard-data-url-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={qrData.password || ""}
            onChange={(e) => updateData("password", e.target.value)}
            className="wizard-data-url-input"
          />
        </div>
      );

    case "call":
    case "sms":
      return (
        <input
          type="tel"
          placeholder="Phone number"
          value={qrData.phone || ""}
          onChange={(e) => updateData("phone", e.target.value)}
          className="wizard-data-url-input"
        />
      );

    case "vcard":
      return (
        <div className="wizard-data-fields">
          <input type="text" placeholder="Full name" value={qrData.name || ""} onChange={(e) => updateData("name", e.target.value)} className="wizard-data-url-input" />
          <input type="text" placeholder="Organization" value={qrData.org || ""} onChange={(e) => updateData("org", e.target.value)} className="wizard-data-url-input" />
          <input type="tel" placeholder="Phone number" value={qrData.phone || ""} onChange={(e) => updateData("phone", e.target.value)} className="wizard-data-url-input" />
          <input type="email" placeholder="Email address" value={qrData.email || ""} onChange={(e) => updateData("email", e.target.value)} className="wizard-data-url-input" />
          <input type="url" placeholder="Website URL" value={qrData.url || ""} onChange={(e) => updateData("url", e.target.value)} className="wizard-data-url-input" />
        </div>
      );

    default:
      return (
        <input
          type="url"
          placeholder="Enter URL here"
          value={qrData.url || ""}
          onChange={(e) => updateData("url", e.target.value)}
          className="wizard-data-url-input"
        />
      );
  }
}
