'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

type ModuleShape = 'square' | 'rounded' | 'dots' | 'hearts' | 'stars' | 'custom';

interface ShapeLibraryProps {
  selectedShape: ModuleShape;
  moduleSize: number;
  moduleSpacing: number;
  onChange: (shape: ModuleShape, size?: number, spacing?: number) => void;
}

export default function ShapeLibrary({
  selectedShape,
  moduleSize,
  moduleSpacing,
  onChange,
}: ShapeLibraryProps) {
  const shapeOptions: Array<{
    type: ModuleShape;
    name: string;
    description: string;
    preview: React.ReactNode;
  }> = [
    {
      type: 'square',
      name: 'Square',
      description: 'Classic square modules',
      preview: (
        <div className="grid grid-cols-5 gap-1 p-4">
          {Array.from({ length: 25 }).map((_, i) => (
            <div key={i} className="w-3 h-3 bg-gray-800 rounded-none" />
          ))}
        </div>
      ),
    },
    {
      type: 'rounded',
      name: 'Rounded',
      description: 'Smooth rounded modules',
      preview: (
        <div className="grid grid-cols-5 gap-1 p-4">
          {Array.from({ length: 25 }).map((_, i) => (
            <div key={i} className="w-3 h-3 bg-gray-800 rounded-md" />
          ))}
        </div>
      ),
    },
    {
      type: 'dots',
      name: 'Dots',
      description: 'Circular dot modules',
      preview: (
        <div className="grid grid-cols-5 gap-1 p-4">
          {Array.from({ length: 25 }).map((_, i) => (
            <div key={i} className="w-3 h-3 bg-gray-800 rounded-full" />
          ))}
        </div>
      ),
    },
    {
      type: 'hearts',
      name: 'Hearts',
      description: 'Heart-shaped modules',
      preview: (
        <div className="grid grid-cols-5 gap-1 p-4">
          {Array.from({ length: 25 }).map((_, i) => (
            <div key={i} className="relative w-3 h-3">
              <svg viewBox="0 0 24 24" fill="currentColor" className="text-gray-800">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
          ))}
        </div>
      ),
    },
    {
      type: 'stars',
      name: 'Stars',
      description: 'Star-shaped modules',
      preview: (
        <div className="grid grid-cols-5 gap-1 p-4">
          {Array.from({ length: 25 }).map((_, i) => (
            <div key={i} className="relative w-3 h-3">
              <svg viewBox="0 0 24 24" fill="currentColor" className="text-gray-800">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
          ))}
        </div>
      ),
    },
    {
      type: 'custom',
      name: 'Custom',
      description: 'Upload custom shape (SVG)',
      preview: (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <svg
              className="w-12 h-12 mx-auto text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-xs text-gray-500 mt-2">Upload SVG</p>
          </div>
        </div>
      ),
    },
  ];

  const getSampleQRPattern = (shape: ModuleShape) => {
    const pattern = [
      [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];

    const getModuleClass = () => {
      switch (shape) {
        case 'square':
          return 'rounded-none';
        case 'rounded':
          return 'rounded-sm';
        case 'dots':
          return 'rounded-full';
        default:
          return 'rounded-sm';
      }
    };

    const getModuleContent = (module: number) => {
      if (!module) return null;

      switch (shape) {
        case 'hearts':
          return (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          );
        case 'stars':
          return (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          );
        default:
          return null;
      }
    };

    return (
      <div className="inline-grid gap-px bg-white p-2 rounded">
        {pattern.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-px">
            {row.map((module, colIndex) => (
              <div
                key={colIndex}
                className={`w-2.5 h-2.5 ${
                  module ? `bg-gray-800 ${getModuleClass()}` : 'bg-transparent'
                }`}
              >
                {getModuleContent(module)}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="mb-3 block">Module Shape</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {shapeOptions.map((option) => (
            <button
              key={option.type}
              onClick={() => onChange(option.type)}
              className={`relative rounded-lg border-2 transition-all overflow-hidden ${
                selectedShape === option.type
                  ? 'border-primary ring-2 ring-primary ring-offset-2'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="aspect-square bg-gray-50">{option.preview}</div>
              <div className="bg-white p-2 border-t">
                <div className="font-medium text-sm">{option.name}</div>
                <div className="text-xs text-muted-foreground">{option.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Shape Controls */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="module-size">Module Size: {moduleSize}px</Label>
          <Input
            id="module-size"
            type="range"
            min="2"
            max="8"
            value={moduleSize}
            onChange={(e) => onChange(selectedShape, parseInt(e.target.value), moduleSpacing)}
          />
          <p className="text-xs text-muted-foreground">Adjust the size of individual modules</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="module-spacing">Module Spacing: {moduleSpacing}px</Label>
          <Input
            id="module-spacing"
            type="range"
            min="0"
            max="4"
            value={moduleSpacing}
            onChange={(e) => onChange(selectedShape, moduleSize, parseInt(e.target.value))}
          />
          <p className="text-xs text-muted-foreground">Add spacing between modules</p>
        </div>
      </div>

      {/* Shape Preview with Sample QR */}
      <div className="space-y-2">
        <Label>Preview with Sample QR</Label>
        <Card className="p-6 bg-gray-50">
          <div className="flex items-center justify-center">
            {getSampleQRPattern(selectedShape)}
          </div>
        </Card>
        <p className="text-xs text-muted-foreground text-center">
          Sample QR code pattern with {selectedShape} modules
        </p>
      </div>

      {/* Custom Shape Upload */}
      {selectedShape === 'custom' && (
        <div className="space-y-2">
          <Label>Upload Custom Shape (SVG)</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <svg
              className="w-12 h-12 mx-auto text-gray-400 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-sm text-gray-600 mb-2">Upload SVG file</p>
            <p className="text-xs text-gray-400">
              Recommended: Simple SVG shape, 24x24px viewBox
            </p>
            <input
              type="file"
              accept=".svg"
              className="hidden"
              id="custom-shape-upload"
            />
            <label htmlFor="custom-shape-upload">
              <span className="mt-4 inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90 transition-colors text-sm">
                Choose File
              </span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
