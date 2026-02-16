"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { qrCodeService } from "@/services/qr.service";
import { Loader2, Camera, Check, FileDown, Image as ImageIcon } from "lucide-react";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { downloadBlob } from "@/lib/download";
import { SvgPngConverter } from "@/lib/svg-png-converter";

export function QRDownload() {
  const { register, watch } = useFormContext();
  const formData = watch();
  const [downloading, setDownloading] = useState<string | null>(null);
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false);

  const qrId = formData.id;
  const qrName = formData.name;

  const fetchCompatibleSvg = async () => {
    if (!qrId) throw new Error("Missing QR ID");
    const svg = await qrCodeService.getCompatibleSvg(qrId);
    if (!svg) throw new Error("Failed to generate SVG");
    return svg;
  };

  const handleDownloadSvg = async () => {
    setDownloading('svg');
    try {
      const svg = await fetchCompatibleSvg();
      const fileName = `${qrName || 'qrcode'}.svg`;
      downloadBlob(svg, fileName, "image/svg+xml");
      toast.success("SVG download started");
    } catch (error) {
      console.error(error);
      toast.error("Failed to download SVG");
    } finally {
      setDownloading(null);
    }
  };

  const handleDownloadPng = async () => {
    setDownloading('png');
    try {
      const svg = await fetchCompatibleSvg();
      const converter = new SvgPngConverter(svg);
      const blob = await converter.toPngBlob(2000, 2000); // High res
      if (blob) {
        converter.download(`${qrName || 'qrcode'}.png`, blob);
        toast.success("PNG download started");
      } else {
        throw new Error("Conversion failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to download PNG");
    } finally {
      setDownloading(null);
    }
  };

  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !qrId) return;

    setUploadingScreenshot(true);
    try {
      await qrCodeService.uploadDesignFile(qrId, file, "qrcode_screenshot");
      toast.success("Screenshot uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload screenshot");
    } finally {
      setUploadingScreenshot(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-card rounded-2xl border p-6 shadow-sm space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
              <Check className="h-4 w-4" />
            </div>
            <h2 className="text-sm font-bold uppercase tracking-tight">Finalize & Name</h2>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="qr-name" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">
              Internal Reference Name
            </Label>
            <Input
              id="qr-name"
              {...register("name")}
              placeholder="e.g. Summer Campaign 2024"
              className="h-12 rounded-xl border-2 focus-visible:ring-blue-500 transition-all"
            />
          </div>

          <div className="pt-2">
            <label className="group flex items-center justify-center gap-2 w-full h-12 border-2 border-dashed rounded-xl cursor-pointer hover:bg-muted/50 hover:border-blue-400 transition-all">
              {uploadingScreenshot ? (
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              ) : (
                <Camera className="h-4 w-4 text-muted-foreground group-hover:text-blue-600" />
              )}
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-blue-600">
                {uploadingScreenshot ? "Uploading..." : "Upload Screenshot (Optional)"}
              </span>
              <input type="file" className="hidden" accept="image/*" onChange={handleScreenshotUpload} disabled={uploadingScreenshot} />
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-center text-muted-foreground">Your download is ready</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button
            size="lg"
            variant="default"
            onClick={handleDownloadSvg}
            disabled={!!downloading}
            className="h-20 rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200 dark:shadow-none flex flex-col gap-1 group transition-all hover:scale-[1.02] active:scale-95"
          >
            {downloading === 'svg' ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <FileDown className="h-6 w-6 group-hover:bounce" />
            )}
            <div className="flex flex-col items-center">
              <span className="text-base font-black">SVG</span>
              <span className="text-[9px] font-bold opacity-70 uppercase tracking-widest">Vector Graphics</span>
            </div>
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={handleDownloadPng}
            disabled={!!downloading}
            className="h-20 rounded-2xl border-2 hover:bg-muted/50 flex flex-col gap-1 transition-all hover:scale-[1.02] active:scale-95"
          >
            {downloading === 'png' ? (
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            ) : (
              <ImageIcon className="h-6 w-6 text-blue-600" />
            )}
            <div className="flex flex-col items-center">
              <span className="text-base font-black">PNG</span>
              <span className="text-[9px] font-bold opacity-70 uppercase tracking-widest">High Res Image</span>
            </div>
          </Button>
        </div>
        
        <div className="p-4 bg-muted/30 rounded-xl border border-dashed text-center">
          <p className="text-[10px] text-muted-foreground font-bold leading-relaxed uppercase tracking-wide">
            SVG format provides infinite scalability for professional printing.
          </p>
        </div>
      </div>
    </div>
  );
}
