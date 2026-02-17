"use client";

import { useQRWizard } from "@/store/use-qr-wizard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Share2 } from "lucide-react";
import { useState } from "react";

// Placeholder for actual QR renderer
function QRPreviewPlaceholder() {
  return (
    <div className="w-64 h-64 bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mx-auto">
      <span className="text-gray-400">QR Preview</span>
    </div>
  );
}

export default function DownloadPreview() {
  const { qrData } = useQRWizard();
  const [name, setName] = useState("My QR Code");

  const handleDownload = (format: 'png' | 'svg' | 'pdf') => {
    console.log(`Downloading as ${format}...`);
    // Trigger download logic using QRImage or similar
  };

  return (
    <div className="p-6 max-w-3xl mx-auto text-center space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Your QR Code is Ready!</h2>
        <p className="text-muted-foreground">Download it now and start sharing.</p>
      </div>

      {/* Main Preview */}
      <div className="bg-white p-8 rounded-xl shadow-sm border inline-block">
        <QRPreviewPlaceholder />
      </div>

      {/* Final Settings */}
      <div className="max-w-md mx-auto space-y-4">
        <div className="space-y-2 text-left">
          <Label htmlFor="qr-name">Name your QR Code</Label>
          <Input 
            id="qr-name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="e.g. Website Link"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button onClick={() => handleDownload('png')} className="w-full gap-2">
            <Download className="w-4 h-4" />
            Download PNG
          </Button>
          <Button variant="outline" onClick={() => handleDownload('svg')} className="w-full gap-2">
            <Download className="w-4 h-4" />
            Download SVG
          </Button>
        </div>
      </div>
    </div>
  );
}
