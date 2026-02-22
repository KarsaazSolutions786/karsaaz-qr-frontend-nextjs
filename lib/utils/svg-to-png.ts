/**
 * SVG to PNG Conversion Utility
 *
 * Converts an SVG element to a PNG blob using HTML5 Canvas.
 */

export interface SvgToPngOptions {
  width?: number;
  height?: number;
  scale?: number;
}

export async function svgToPng(
  svgElement: SVGElement,
  options: SvgToPngOptions = {}
): Promise<Blob> {
  const { scale = 1 } = options;

  const svgRect = svgElement.getBoundingClientRect();
  const width = (options.width || svgRect.width) * scale;
  const height = (options.height || svgRect.height) * scale;

  // Serialize SVG to string
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgElement);
  const svgBlob = new Blob([svgString], {
    type: 'image/svg+xml;charset=utf-8',
  });
  const url = URL.createObjectURL(svgBlob);

  try {
    const img = await loadImage(url);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get canvas 2D context');
    }

    ctx.drawImage(img, 0, 0, width, height);

    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create PNG blob from canvas'));
          }
        },
        'image/png'
      );
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load SVG image'));
    img.src = src;
  });
}
