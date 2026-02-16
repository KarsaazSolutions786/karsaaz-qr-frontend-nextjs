
export class SvgPngConverter {
    private svgUrl: string;
    private name: string;
    private image: HTMLImageElement | null = null;
    private svgContent: string | null = null;
    private response: Response | null = null;

    constructor(svgUrl: string, name: string) {
        this.svgUrl = svgUrl;
        this.name = name;
    }

    public withSvgContent(svgContent: string): this {
        this.svgContent = svgContent;
        return this;
    }

    private async fetchIfNeeded(): Promise<void> {
        if (this.svgContent) return;
        this.response = await fetch(this.svgUrl);
    }

    private async getSvgContent(): Promise<string> {
        if (this.svgContent) return this.svgContent;

        if (!this.response) {
            await this.fetchIfNeeded();
        }

        if (!this.response) {
            throw new Error("No SVG content available");
        }

        return this.response.clone().text();
    }

    private async getViewboxSize(): Promise<[number, number]> {
        const text = await this.getSvgContent();
        const line = text.substring(0, 1000);

        // Try viewBox
        const match = line.match(/viewBox="([^"]+)"/);
        if (match) {
            const viewBox = match[1].split(/[\s,]+/).map((n) => +n);
            if (viewBox[2] && viewBox[3]) {
                return [viewBox[2], viewBox[3]];
            }
        }

        // Try width/height attributes
        const widthMatch = line.match(/width="([^"]+)"|width='([^']+)'|\swidth=(\d+(?:\.\d+)?)/i);
        const heightMatch = line.match(/height="([^"]+)"|height='([^']+)'|\sheight=(\d+(?:\.\d+)?)/i);

        if (widthMatch && heightMatch) {
            const widthStr = widthMatch[1] || widthMatch[2] || widthMatch[3];
            const heightStr = heightMatch[1] || heightMatch[2] || heightMatch[3];
            const width = parseFloat(widthStr.replace(/[^\d.]/g, ''));
            const height = parseFloat(heightStr.replace(/[^\d.]/g, ''));
            if (width && height) return [width, height];
        }

        // Default
        if (line.match(/<svg[^>]*>/i)) {
            return [300, 150];
        }

        throw new Error("Could not determine SVG dimensions");
    }

    private async getResponseBlob(): Promise<Blob> {
        let text = await this.getSvgContent();
        const length = 1000;
        let line = text.substring(0, length);

        const svgTagMatch = line.match(/<svg[^>]*>/i);
        if (!svgTagMatch) throw new Error("Could not find SVG tag");

        const svgTag = svgTagMatch[0];
        const [width, height] = await this.getViewboxSize();

        let updatedSvgTag = svgTag;

        if (!svgTag.match(/width\s*=/i)) {
            updatedSvgTag = updatedSvgTag.replace('>', ` width="${width}px"`);
        }
        if (!svgTag.match(/height\s*=/i)) {
            updatedSvgTag = updatedSvgTag.replace('>', ` height="${height}px"`);
        }
        if (!svgTag.match(/viewBox\s*=/i)) {
            updatedSvgTag = updatedSvgTag.replace('>', ` viewBox="0 0 ${width} ${height}"`);
        }
        if (!updatedSvgTag.endsWith('>')) {
            updatedSvgTag += '>';
        }

        line = line.replace(svgTag, updatedSvgTag);
        text = line + text.substring(length);

        return new Blob([text], { type: 'image/svg+xml;charset=utf-8' });
    }

    private async renderSvgImage(): Promise<void> {
        await this.fetchIfNeeded();
        const blob = await this.getResponseBlob();
        const src = URL.createObjectURL(blob);

        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                URL.revokeObjectURL(src);
                this.image?.remove();
                reject(new Error("SVG image loading timeout"));
            }, 15000);

            this.image = document.createElement("img");
            this.image.setAttribute("crossOrigin", "anonymous");

            this.image.onload = () => {
                clearTimeout(timeoutId);
                resolve();
            };

            this.image.onerror = (e) => {
                clearTimeout(timeoutId);
                URL.revokeObjectURL(src);
                this.image?.remove();
                reject(new Error("Failed to load SVG image"));
            };

            this.image.style.cssText = "position: fixed; top: -9999px; opacity: 0; pointer-events: none;";
            document.body.appendChild(this.image);
            this.image.src = src;
        });
    }

    public async getPngBlob(width = 0, height = 0): Promise<Blob> {
        const [viewW, viewH] = await this.getViewboxSize();
        const canvasWidth = width === 0 ? viewW : width;
        const canvasHeight = height === 0 ? viewH : (height * viewH) / viewW;

        const canvas = document.createElement("canvas");
        canvas.width = Math.ceil(canvasWidth);
        canvas.height = Math.ceil(canvasHeight);

        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Failed to get canvas context");

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (!this.image) throw new Error("Image not initialized");

        await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for render

        try {
            ctx.drawImage(this.image, 0, 0, canvas.width, canvas.height);
        } catch (e) {
            throw new Error("Canvas draw failed");
        }

        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (blob) {
                    URL.revokeObjectURL(this.image?.src || "");
                    this.image?.remove();
                    this.image = null;
                    canvas.remove();
                    resolve(blob);
                } else {
                    reject(new Error("Failed to create PNG blob"));
                }
            }, "image/png", 1.0);
        });
    }

    public downloadBlob(blob: Blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = this.name;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
            URL.revokeObjectURL(url);
            link.remove();
        }, 100);
    }
}
