"use client";

import { sanitizeSvg } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { AlertCircle, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface QRImageProps {
  url: string | null;
  className?: string;
  onLoad?: () => void;
  onError?: (error: string) => void;
  debounceMs?: number;
}

// Simple client-side cache for SVG content
const svgCache = new Map<string, string>();

export function QRImage({
  url,
  className,
  onLoad,
  onError,
  debounceMs = 500
}: QRImageProps) {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSvg = useCallback(async (currentUrl: string) => {
    // Check cache first
    if (svgCache.has(currentUrl)) {
      setSvgContent(svgCache.get(currentUrl)!);
      onLoad?.();
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(currentUrl);
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

      const data = await response.json();

      if (data && data.content) {
        const _content = data.content;
        let decodedContent = "";

        // Detect if content is raw SVG or Base64
        if (_content.trim().startsWith("<svg") || _content.trim().startsWith("<?xml")) {
          decodedContent = _content;
        } else {
          try {
            decodedContent = atob(_content);
          } catch (decodeErr) {
            console.error("[QRImage] Base64 decode failed:", decodeErr);
            throw new Error("Failed to decode QR content");
          }
        }

        const sanitized = sanitizeSvg(decodedContent);
        
        // Save to cache
        svgCache.set(currentUrl, sanitized);
        // Limit cache size
        if (svgCache.size > 50) {
          const firstKey = svgCache.keys().next().value;
          if (firstKey) svgCache.delete(firstKey);
        }

        setSvgContent(sanitized);
        onLoad?.();
      } else {
        throw new Error("Invalid response format: Missing content");
      }
    } catch (err: unknown) {
      console.error("[QRImage] Fetch error:", err);
      const msg = (err as Error).message || "Failed to generate preview";
      setError(msg);
      onError?.(msg);
    } finally {
      setLoading(false);
    }
  }, [onLoad, onError, setSvgContent]);

  useEffect(() => {
    if (!url) {
      setSvgContent(null);
      return;
    }

    const timer = setTimeout(() => fetchSvg(url), debounceMs);
    return () => clearTimeout(timer);
  }, [url, fetchSvg, debounceMs]);

  return (
    <div className={cn("relative aspect-square w-full flex items-center justify-center bg-white rounded-lg border shadow-sm overflow-hidden", className)}>
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-[1px]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      )}

      {error ? (
        <div className="flex flex-col items-center gap-2 text-destructive p-6 text-center">
          <AlertCircle className="h-10 w-10 opacity-50" />
          <p className="text-sm font-semibold tracking-tight">{error}</p>
          <p className="text-[10px] text-muted-foreground italic">Server-side rendering failure</p>
        </div>
      ) : svgContent ? (
        <div
          className="w-full h-full p-6 animate-in fade-in zoom-in-95 duration-300 flex items-center justify-center"
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      ) : (
        <div className="text-muted-foreground text-xs italic opacity-50 px-8 text-center font-medium">
          Configuring your unique QR design...
        </div>
      )}
    </div>
  );
}