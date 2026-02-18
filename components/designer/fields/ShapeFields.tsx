'use client';

import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import ShapeLibrary from '../ShapeLibrary';

type ModuleShape = 'square' | 'rounded' | 'dots' | 'hearts' | 'stars' | 'custom';

interface ShapeSettings {
  shape: ModuleShape;
  cornerRadius?: number;
}

interface ShapeFieldsProps {
  shapeSettings: ShapeSettings;
  onChange: (settings: ShapeSettings) => void;
}

export default function ShapeFields({
  shapeSettings,
  onChange,
}: ShapeFieldsProps) {
  const [moduleSize, setModuleSize] = useState(4);
  const [moduleSpacing, setModuleSpacing] = useState(0);
  const [cornerRadius, setCornerRadius] = useState(shapeSettings.cornerRadius || 0);

  const handleShapeChange = (
    shape: ModuleShape,
    size?: number,
    spacing?: number
  ) => {
    if (size !== undefined) setModuleSize(size);
    if (spacing !== undefined) setModuleSpacing(spacing);
    
    onChange({
      shape,
      cornerRadius: ['rounded', 'custom'].includes(shape) ? cornerRadius : undefined,
    });
  };

  const handleCornerRadiusChange = (radius: number) => {
    setCornerRadius(radius);
    onChange({
      ...shapeSettings,
      cornerRadius: radius,
    });
  };

  return (
    <div className="space-y-6">
      {/* Shape Library */}
      <ShapeLibrary
        selectedShape={shapeSettings.shape}
        moduleSize={moduleSize}
        moduleSpacing={moduleSpacing}
        onChange={handleShapeChange}
      />

      {/* Corner Radius for Rounded Shapes */}
      {(shapeSettings.shape === 'rounded' || shapeSettings.shape === 'custom') && (
        <div className="space-y-3">
          <Label htmlFor="corner-radius">
            Corner Radius: {cornerRadius}px
          </Label>
          <Input
            id="corner-radius"
            type="range"
            min="0"
            max="8"
            value={cornerRadius}
            onChange={(e) => handleCornerRadiusChange(parseInt(e.target.value))}
          />
          <p className="text-xs text-muted-foreground">
            Adjust roundness of module corners
          </p>

          {/* Corner Radius Preview */}
          <Card className="p-6">
            <div className="flex items-center justify-center gap-4">
              {[0, 2, 4, 6, 8].map((radius) => (
                <div key={radius} className="text-center">
                  <div
                    className="w-12 h-12 bg-gray-800 mb-1"
                    style={{ borderRadius: `${radius}px` }}
                  />
                  <span className="text-xs text-muted-foreground">{radius}px</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Shape Impact Info */}
      <div className="space-y-2">
        <Label className="text-sm">Shape Selection Guide</Label>
        <Card className="p-4 space-y-2 text-xs">
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 bg-gray-800 rounded-none mt-0.5 flex-shrink-0" />
            <div>
              <strong>Square:</strong> Best for maximum scannability, classic QR code look
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 bg-gray-800 rounded-md mt-0.5 flex-shrink-0" />
            <div>
              <strong>Rounded:</strong> Modern look while maintaining good scan reliability
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 bg-gray-800 rounded-full mt-0.5 flex-shrink-0" />
            <div>
              <strong>Dots:</strong> Stylish appearance, slightly reduced scan range
            </div>
          </div>
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 text-gray-800 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <div>
              <strong>Hearts/Stars:</strong> Decorative, best for promotional QR codes
            </div>
          </div>
        </Card>
      </div>

      {/* Scanning Reliability Warning */}
      {(shapeSettings.shape === 'hearts' || shapeSettings.shape === 'stars' || shapeSettings.shape === 'custom') && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-xs text-amber-800">
            <strong>⚠️ Scanning Notice:</strong> Decorative shapes may reduce QR code
            scannability. Test thoroughly before production use. Consider using higher
            error correction levels.
          </p>
        </div>
      )}
    </div>
  );
}
