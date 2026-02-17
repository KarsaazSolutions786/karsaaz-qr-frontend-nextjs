"use client";

import { QRImage } from "@/components/qr/QRImage";
import { Card, CardContent } from "@/components/ui/card";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useQRPreviewUrl } from "@/hooks/use-qr-preview";
import { CanvasTextRenderer } from "@/lib/canvas-text-renderer";
import { cn } from "@/lib/utils";
import { Eye, Loader2, RefreshCw, Smartphone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";

interface QRPreviewProps {
  id?: string | number;
  loading?: boolean;
}

export function QRPreview({ id, loading = false }: QRPreviewProps) {
  const { watch } = useFormContext();
  const formData = watch();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<CanvasTextRenderer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [stickyTop, setStickyTop] = useState(24);

  const design = formData.design || {};
  const previewUrl = useQRPreviewUrl(id);

  // Canvas Text Rendering (Client-side layer for preview only if needed)
  useEffect(() => {
    if (canvasRef.current) {
      if (!rendererRef.current) {
        rendererRef.current = new CanvasTextRenderer(canvasRef.current);
      }

      const renderer = rendererRef.current;
      renderer.clear();

      if (design.stickerText) {
        renderer.renderText({
          text: design.stickerText,
          color: design.foregroundColor || "#000000",
          fontFamily: "Inter",
          fontSize: 20,
          y: 30
        });
      }
    }
  }, [design.stickerText, design.foregroundColor]);

  // Smart Sticky Logic
  useEffect(() => {
    if (!isDesktop) return;

    const handleScroll = () => {
      const headerHeight = 64;
      const buffer = 24;
      const newTop = headerHeight + buffer;
      setStickyTop(newTop);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDesktop]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "transition-all duration-300 ease-in-out z-10",
        isDesktop ? "sticky" : "relative"
      )}
      style={{ top: isDesktop ? `${stickyTop}px` : 0 }}
    >
      <Card className="overflow-hidden border-2 border-muted shadow-lg bg-white dark:bg-zinc-950">
        <div className="bg-muted/30 p-3 border-b flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-blue-600 dark:text-blue-400">
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Eye className="h-3.5 w-3.5" />}
            High-Fidelity Preview
          </span>
          <div className="flex gap-1 items-center">
            <Smartphone className="h-3 w-3 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Real-time</span>
          </div>
        </div>

        <CardContent className="p-8 flex flex-col items-center space-y-8">
          <div className="relative group p-4 rounded-3xl bg-white shadow-sm border ring-8 ring-gray-50 dark:ring-zinc-900 transition-all hover:scale-[1.02] duration-500 w-full max-w-[280px]">
            {loading && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/60 backdrop-blur-[2px] rounded-3xl">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
              </div>
            )}

            <QRImage
              url={previewUrl}
              className="border-none shadow-none ring-0 p-0"
            />

            {/* Sticker Text Canvas layer (Legacy fallback overlay) */}
            <canvas
              ref={canvasRef}
              width={220}
              height={60}
              className={cn(
                "absolute -bottom-14 left-4 pointer-events-none transition-opacity duration-300 hidden",
                design.stickerText ? "opacity-100" : "opacity-0"
              )}
            />
          </div>

          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-relaxed">
            Scan to test scannability across different lighting and devices
          </p>
        </CardContent>
      </Card>

      {/* Scannability Warning */}
      {(design.logoScale > 0.4 || design.shape === 'circle') && (
        <div className="mt-4 p-4 rounded-2xl bg-orange-50 border-2 border-orange-100 dark:bg-orange-950/20 dark:border-orange-900 flex gap-3 animate-in fade-in slide-in-from-top-2 duration-500">
          <RefreshCw className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
          <p className="text-[11px] text-orange-800 dark:text-orange-300 font-bold leading-tight uppercase tracking-tight">
            High logo scale or round shapes may reduce scannability. <br />Test it before you proceed.
          </p>
        </div>
      )}
    </div>
  );
}

export default QRPreview;
