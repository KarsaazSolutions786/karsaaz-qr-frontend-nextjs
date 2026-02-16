/**
 * Canvas Text Renderer
 * Ported from legacy canvas-text-renderer.js
 * Handles rendering of sticker text onto the QR code canvas
 */

export class CanvasTextRenderer {
  private ctx: CanvasRenderingContext2D | null = null;

  constructor(private canvas?: HTMLCanvasElement) {
    if (canvas) {
      this.ctx = canvas.getContext('2d');
    }
  }

  setCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }

  renderText(options: {
    text: string;
    fontFamily?: string;
    fontSize?: number;
    color?: string;
    x?: number;
    y?: number;
    maxWidth?: number;
    align?: CanvasTextAlign;
  }) {
    if (!this.ctx || !this.canvas) return;

    const {
      text,
      fontFamily = "Inter",
      fontSize = 20,
      color = "#000000",
      x = this.canvas.width / 2,
      y = 30,
      maxWidth,
      align = "center"
    } = options;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.ctx.font = `bold ${fontSize}px ${fontFamily}`;
    this.ctx.fillStyle = color;
    this.ctx.textAlign = align;
    this.ctx.textBaseline = "middle";

    if (maxWidth) {
      this.wrapText(text, x, y, maxWidth, fontSize * 1.2);
    } else {
      this.ctx.fillText(text, x, y);
    }
  }

  private wrapText(text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
    if (!this.ctx) return;
    
    const words = text.split(' ');
    let line = '';
    let testLine = '';
    let testWidth = 0;

    for (let n = 0; n < words.length; n++) {
      testLine = line + words[n] + ' ';
      testWidth = this.ctx.measureText(testLine).width;
      
      if (testWidth > maxWidth && n > 0) {
        this.ctx.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    this.ctx.fillText(line, x, y);
  }

  clear() {
    if (!this.ctx || !this.canvas) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

export default CanvasTextRenderer;
