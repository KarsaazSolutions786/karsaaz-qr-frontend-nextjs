/**
 * Svg Png Converter
 * Ported logic from legacy SvgPngConverter.js
 * Supports client-side conversion of SVG to PNG for downloads
 */

export class SvgPngConverter {
  constructor(private svgString: string) {}

  async toPngBlob(width: number = 1000, height: number = 1000): Promise<Blob | null> {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        resolve(null);
        return;
      }

      const img = new Image();
      const svgBlob = new Blob([this.svgString], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        ctx.fillStyle = "white"; // Default background
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        URL.revokeObjectURL(url);
        
        canvas.toBlob((blob) => {
          resolve(blob);
        }, "image/png");
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(null);
      };

      img.src = url;
    });
  }

  download(filename: string, blob: Blob) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export default SvgPngConverter;
