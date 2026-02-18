/**
 * Next.js API route for dynamic QR preview
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateQRCode, validateQRData, QRDesignOptions } from '@/lib/qr/qr-preview-generator';
import { qrPreviewCache } from '@/lib/qr/qr-cache';
import { verifyContentHash } from '@/lib/utils/qr-preview-url-builder';

export const dynamic = 'force-dynamic';

/**
 * Parse design options from query parameters
 */
function parseDesignOptions(searchParams: URLSearchParams): QRDesignOptions {
  const design: QRDesignOptions = {};

  const ecl = searchParams.get('ecl');
  if (ecl && ['L', 'M', 'Q', 'H'].includes(ecl)) {
    design.errorCorrectionLevel = ecl as 'L' | 'M' | 'Q' | 'H';
  }

  const margin = searchParams.get('margin');
  if (margin) {
    design.margin = parseInt(margin, 10);
  }

  const width = searchParams.get('width');
  if (width) {
    design.width = parseInt(width, 10);
  }

  const dark = searchParams.get('dark');
  const light = searchParams.get('light');
  if (dark || light) {
    design.color = {};
    if (dark) design.color.dark = `#${dark}`;
    if (light) design.color.light = `#${light}`;
  }

  const format = searchParams.get('format');
  if (format === 'svg' || format === 'png') {
    design.type = format;
  }

  return design;
}

/**
 * GET /api/qrcodes/preview
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Get required parameters
    const data = searchParams.get('data');
    const hash = searchParams.get('h');

    if (!data) {
      return NextResponse.json(
        { error: 'Missing required parameter: data' },
        { status: 400 }
      );
    }

    // Validate QR data
    const validation = validateQRData(data);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Verify hash if provided
    if (hash && !verifyContentHash(data, hash)) {
      return NextResponse.json(
        { error: 'Invalid content hash' },
        { status: 400 }
      );
    }

    // Parse design options
    const design = parseDesignOptions(searchParams);
    const format = design.type || 'svg';

    // Generate cache key
    const cacheKey = `qr:${data}:${JSON.stringify(design)}`;

    // Check cache
    let qrCode = qrPreviewCache.get(cacheKey);

    if (!qrCode) {
      // Generate QR code
      qrCode = await generateQRCode({ data, design });
      
      // Store in cache
      qrPreviewCache.set(cacheKey, qrCode);
    }

    // Set appropriate headers
    const headers: Record<string, string> = {
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    };

    if (format === 'svg') {
      headers['Content-Type'] = 'image/svg+xml';
      return new NextResponse(qrCode, { headers });
    } else {
      // PNG is returned as data URL, extract base64 part
      const base64Data = qrCode.split(',')[1];
      if (!base64Data) {
        throw new Error('Invalid PNG data URL');
      }
      const buffer = Buffer.from(base64Data, 'base64');
      
      headers['Content-Type'] = 'image/png';
      return new NextResponse(buffer as unknown as BodyInit, { headers });
    }
  } catch (error) {
    console.error('QR preview generation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate QR code preview',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
