/**
 * CustomSizeInput Component
 * 
 * Custom size input with validation for QR code exports.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, Check, Lock, Unlock } from 'lucide-react';

export interface CustomSizeInputProps {
  width: number;
  height: number;
  onWidthChange: (width: number) => void;
  onHeightChange: (height: number) => void;
  minSize?: number;
  maxSize?: number;
  maintainAspectRatio?: boolean;
  unit?: 'px' | 'in' | 'cm' | 'mm';
  dpi?: number;
  disabled?: boolean;
  className?: string;
}

interface ValidationError {
  field: 'width' | 'height' | 'both';
  message: string;
}

const SIZE_LIMITS = {
  min: 100,
  max: 10000,
  recommended: {
    min: 256,
    max: 4096,
  },
};

export function CustomSizeInput({
  width,
  height,
  onWidthChange,
  onHeightChange,
  minSize = SIZE_LIMITS.min,
  maxSize = SIZE_LIMITS.max,
  maintainAspectRatio: initialMaintainAspectRatio = true,
  unit = 'px',
  dpi = 300,
  disabled = false,
  className = '',
}: CustomSizeInputProps) {
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(initialMaintainAspectRatio);
  const [aspectRatio, setAspectRatio] = useState(width / height);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  
  // Update aspect ratio when width or height changes
  useEffect(() => {
    if (width > 0 && height > 0) {
      setAspectRatio(width / height);
    }
  }, [width, height]);
  
  // Validate size
  const validateSize = (w: number, h: number): { errors: ValidationError[]; warnings: string[] } => {
    const newErrors: ValidationError[] = [];
    const newWarnings: string[] = [];
    
    // Check minimum
    if (w < minSize) {
      newErrors.push({
        field: 'width',
        message: `Width must be at least ${minSize}${unit}`,
      });
    }
    if (h < minSize) {
      newErrors.push({
        field: 'height',
        message: `Height must be at least ${minSize}${unit}`,
      });
    }
    
    // Check maximum
    if (w > maxSize) {
      newErrors.push({
        field: 'width',
        message: `Width must not exceed ${maxSize}${unit}`,
      });
    }
    if (h > maxSize) {
      newErrors.push({
        field: 'height',
        message: `Height must not exceed ${maxSize}${unit}`,
      });
    }
    
    // Check recommended range
    if (w < SIZE_LIMITS.recommended.min || h < SIZE_LIMITS.recommended.min) {
      newWarnings.push('Size below recommended minimum for best quality');
    }
    if (w > SIZE_LIMITS.recommended.max || h > SIZE_LIMITS.recommended.max) {
      newWarnings.push('Very large size may impact performance');
    }
    
    // Check aspect ratio
    const ratio = w / h;
    if (Math.abs(ratio - 1) > 0.1) {
      newWarnings.push('QR codes work best with square dimensions (1:1 aspect ratio)');
    }
    
    // Check file size estimate
    const estimatedSizeMB = (w * h * 4) / (1024 * 1024);
    if (estimatedSizeMB > 50) {
      newWarnings.push(`Estimated file size: ${estimatedSizeMB.toFixed(1)}MB - may be slow to process`);
    }
    
    return { errors: newErrors, warnings: newWarnings };
  };
  
  // Handle width change
  const handleWidthChange = (newWidth: string) => {
    const w = parseInt(newWidth, 10);
    if (isNaN(w) || w < 0) return;
    
    onWidthChange(w);
    
    if (maintainAspectRatio && aspectRatio > 0) {
      const newHeight = Math.round(w / aspectRatio);
      onHeightChange(newHeight);
    }
    
    const h = maintainAspectRatio && aspectRatio > 0 ? Math.round(w / aspectRatio) : height;
    const validation = validateSize(w, h);
    setErrors(validation.errors);
    setWarnings(validation.warnings);
  };
  
  // Handle height change
  const handleHeightChange = (newHeight: string) => {
    const h = parseInt(newHeight, 10);
    if (isNaN(h) || h < 0) return;
    
    onHeightChange(h);
    
    if (maintainAspectRatio && aspectRatio > 0) {
      const newWidth = Math.round(h * aspectRatio);
      onWidthChange(newWidth);
    }
    
    const w = maintainAspectRatio && aspectRatio > 0 ? Math.round(h * aspectRatio) : width;
    const validation = validateSize(w, h);
    setErrors(validation.errors);
    setWarnings(validation.warnings);
  };
  
  // Toggle aspect ratio lock
  const toggleAspectRatio = () => {
    setMaintainAspectRatio(!maintainAspectRatio);
    if (!maintainAspectRatio) {
      setAspectRatio(width / height);
    }
  };
  
  // Convert units if needed
  const displayValue = (pixels: number): number => {
    switch (unit) {
      case 'in':
        return Math.round((pixels / dpi) * 100) / 100;
      case 'cm':
        return Math.round((pixels / dpi) * 2.54 * 100) / 100;
      case 'mm':
        return Math.round((pixels / dpi) * 25.4 * 10) / 10;
      default:
        return pixels;
    }
  };
  
  const hasErrors = errors.length > 0;
  const hasWarnings = warnings.length > 0;
  
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header */}
      <label className="text-sm font-medium text-gray-700">
        Custom Size
      </label>
      
      {/* Size inputs */}
      <div className="flex items-center gap-3">
        {/* Width */}
        <div className="flex-1">
          <label htmlFor="width" className="block text-xs text-gray-500 mb-1">
            Width
          </label>
          <div className="relative">
            <input
              id="width"
              type="number"
              min={minSize}
              max={maxSize}
              step={1}
              value={displayValue(width)}
              onChange={(e) => handleWidthChange(e.target.value)}
              disabled={disabled}
              className={`
                w-full px-3 py-2 pr-12 border rounded-lg
                focus:outline-none focus:ring-2
                ${hasErrors && errors.some(e => e.field === 'width' || e.field === 'both')
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
                }
                ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
              `}
            />
            <span className="absolute right-3 top-2.5 text-sm text-gray-400">
              {unit}
            </span>
          </div>
        </div>
        
        {/* Aspect ratio lock */}
        <button
          onClick={toggleAspectRatio}
          disabled={disabled}
          className={`
            mt-6 p-2 rounded-lg border-2 transition-all
            ${maintainAspectRatio
              ? 'border-blue-500 bg-blue-50 text-blue-600'
              : 'border-gray-300 bg-white text-gray-400 hover:border-gray-400'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          title={maintainAspectRatio ? 'Unlock aspect ratio' : 'Lock aspect ratio'}
        >
          {maintainAspectRatio ? (
            <Lock className="w-4 h-4" />
          ) : (
            <Unlock className="w-4 h-4" />
          )}
        </button>
        
        {/* Height */}
        <div className="flex-1">
          <label htmlFor="height" className="block text-xs text-gray-500 mb-1">
            Height
          </label>
          <div className="relative">
            <input
              id="height"
              type="number"
              min={minSize}
              max={maxSize}
              step={1}
              value={displayValue(height)}
              onChange={(e) => handleHeightChange(e.target.value)}
              disabled={disabled}
              className={`
                w-full px-3 py-2 pr-12 border rounded-lg
                focus:outline-none focus:ring-2
                ${hasErrors && errors.some(e => e.field === 'height' || e.field === 'both')
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
                }
                ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
              `}
            />
            <span className="absolute right-3 top-2.5 text-sm text-gray-400">
              {unit}
            </span>
          </div>
        </div>
      </div>
      
      {/* Aspect ratio display */}
      {maintainAspectRatio && (
        <div className="text-xs text-gray-500 text-center">
          Aspect ratio: {aspectRatio.toFixed(2)}:1
          {Math.abs(aspectRatio - 1) < 0.01 && (
            <Check className="inline-block w-3 h-3 ml-1 text-green-600" />
          )}
        </div>
      )}
      
      {/* Errors */}
      {hasErrors && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800 mb-1">Invalid size</p>
              <ul className="text-xs text-red-700 space-y-0.5">
                {errors.map((error, index) => (
                  <li key={index}>{error.message}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      
      {/* Warnings */}
      {!hasErrors && hasWarnings && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800 mb-1">Warnings</p>
              <ul className="text-xs text-yellow-700 space-y-0.5">
                {warnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      
      {/* Size info */}
      {!hasErrors && !hasWarnings && (
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-xs text-gray-600 space-y-1">
            <div className="flex justify-between">
              <span>Pixel dimensions:</span>
              <span className="font-medium text-gray-900">
                {width} × {height} px
              </span>
            </div>
            {unit !== 'px' && (
              <div className="flex justify-between">
                <span>Physical size:</span>
                <span className="font-medium text-gray-900">
                  {displayValue(width)} × {displayValue(height)} {unit}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Total pixels:</span>
              <span className="font-medium text-gray-900">
                {(width * height / 1000000).toFixed(2)} MP
              </span>
            </div>
            <div className="flex justify-between">
              <span>Estimated file size:</span>
              <span className="font-medium text-gray-900">
                {formatFileSize(width * height * 4 * 0.3)}
              </span>
            </div>
          </div>
        </div>
      )}
      
      {/* Quick size buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => {
            onWidthChange(1024);
            onHeightChange(1024);
          }}
          disabled={disabled}
          className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
        >
          1024×1024
        </button>
        <button
          onClick={() => {
            onWidthChange(2048);
            onHeightChange(2048);
          }}
          disabled={disabled}
          className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
        >
          2048×2048
        </button>
        <button
          onClick={() => {
            onWidthChange(4096);
            onHeightChange(4096);
          }}
          disabled={disabled}
          className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
        >
          4096×4096
        </button>
      </div>
    </div>
  );
}

/**
 * Format file size
 */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${Math.round(bytes)} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Validate custom size
 */
export function validateCustomSize(
  width: number,
  height: number,
  options: {
    minSize?: number;
    maxSize?: number;
    requireSquare?: boolean;
  } = {}
): { valid: boolean; errors: string[] } {
  const {
    minSize = SIZE_LIMITS.min,
    maxSize = SIZE_LIMITS.max,
    requireSquare = false,
  } = options;
  
  const errors: string[] = [];
  
  if (width < minSize) errors.push(`Width must be at least ${minSize}px`);
  if (height < minSize) errors.push(`Height must be at least ${minSize}px`);
  if (width > maxSize) errors.push(`Width must not exceed ${maxSize}px`);
  if (height > maxSize) errors.push(`Height must not exceed ${maxSize}px`);
  
  if (requireSquare && width !== height) {
    errors.push('QR codes must be square (width must equal height)');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
