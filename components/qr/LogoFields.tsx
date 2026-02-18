/**
 * LogoFields Component
 * 
 * Complete logo configuration UI combining upload and positioning.
 * Provides all controls for logo customization in one component.
 */

'use client';

import React, { useMemo } from 'react';
import { LogoConfig as DesignerLogoConfig } from '@/types/entities/designer';
import { LogoUpload } from './LogoUpload';
import { LogoPositioning } from './LogoPositioning';
import { validateLogoConfig, getOptimalLogoSize, getMaxLogoSize } from '@/lib/utils/logo-utils';

export interface LogoFieldsProps {
  value: DesignerLogoConfig | null;
  onChange: (logo: DesignerLogoConfig | null) => void;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  qrSize?: number;
  className?: string;
}

export function LogoFields({
  value,
  onChange,
  errorCorrectionLevel,
  qrSize: _qrSize = 512,
  className = '',
}: LogoFieldsProps) {
  // Handle logo URL change
  const handleLogoUrlChange = (url: string | null) => {
    if (!url) {
      onChange(null);
      return;
    }

    // Create new logo config or update existing
    if (value) {
      onChange({ ...value, url });
    } else {
      // Create default config
      const optimalSize = getOptimalLogoSize(errorCorrectionLevel);
      onChange({
        url,
        size: optimalSize * 0.8, // Start slightly smaller than optimal
        margin: 0.05,
        shape: 'square',
      });
    }
  };

  // Handle logo config change
  const handleLogoConfigChange = (config: DesignerLogoConfig) => {
    onChange(config);
  };

  // Validate current config
  const validation = useMemo(() => {
    if (!value) return null;
    return validateLogoConfig(value, errorCorrectionLevel);
  }, [value, errorCorrectionLevel]);

  // Get size recommendations
  const sizeInfo = useMemo(() => {
    const optimal = getOptimalLogoSize(errorCorrectionLevel);
    const max = getMaxLogoSize(errorCorrectionLevel);
    return { optimal, max };
  }, [errorCorrectionLevel]);

  return (
    <div className={`logo-fields ${className}`}>
      {/* Logo upload */}
      <LogoUpload value={value?.url || null} onChange={handleLogoUrlChange} />

      {/* Logo positioning (only show if logo is uploaded) */}
      {value && (
        <div className="mt-6">
          <LogoPositioning
            value={value}
            onChange={handleLogoConfigChange}
            maxSize={sizeInfo.max}
            maxMargin={0.3}
          />
        </div>
      )}

      {/* Size recommendations */}
      {value && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Size Recommendations</h4>
          <div className="space-y-1 text-sm text-blue-800">
            <p>
              <span className="font-medium">Optimal:</span> {Math.round(sizeInfo.optimal * 100)}%
              {value.size <= sizeInfo.optimal && ' ✓'}
            </p>
            <p>
              <span className="font-medium">Maximum:</span> {Math.round(sizeInfo.max * 100)}%
              {value.size <= sizeInfo.max && ' ✓'}
            </p>
            <p className="text-xs">
              Error Correction: <span className="font-mono">{errorCorrectionLevel}</span> (
              {errorCorrectionLevel === 'L' && '7% recovery'}
              {errorCorrectionLevel === 'M' && '15% recovery'}
              {errorCorrectionLevel === 'Q' && '25% recovery'}
              {errorCorrectionLevel === 'H' && '30% recovery'})
            </p>
          </div>
        </div>
      )}

      {/* Validation errors/warnings */}
      {validation && !validation.valid && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <h4 className="text-sm font-medium text-red-900 mb-2">⚠️ Validation Errors</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-red-800">
            {validation.errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {validation && validation.warnings.length > 0 && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <h4 className="text-sm font-medium text-yellow-900 mb-2">⚡ Warnings</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800">
            {validation.warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Quick actions */}
      {value && (
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => {
              const optimal = getOptimalLogoSize(errorCorrectionLevel) * 0.8;
              onChange({ ...value, size: optimal, margin: 0.05 });
            }}
            className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium transition"
          >
            Reset to Optimal
          </button>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md text-sm font-medium transition"
          >
            Remove Logo
          </button>
        </div>
      )}

      {/* Help text */}
      <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
        <h4 className="text-sm font-medium text-gray-900 mb-2">📖 Logo Tips</h4>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
          <li>Use high-contrast logos for better visibility</li>
          <li>Square logos work best for QR codes</li>
          <li>Keep logo size under 30% for reliable scanning</li>
          <li>Higher error correction allows larger logos</li>
          <li>Add background if logo has transparency</li>
          <li>Test scanning before finalizing design</li>
        </ul>
      </div>
    </div>
  );
}

/**
 * Simplified logo toggle (enable/disable with default config)
 */
export function LogoToggle({
  enabled,
  onToggle,
  errorCorrectionLevel,
  className = '',
}: {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  className?: string;
}) {
  const optimalSize = useMemo(() => {
    return getOptimalLogoSize(errorCorrectionLevel);
  }, [errorCorrectionLevel]);

  return (
    <div className={`logo-toggle ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-gray-700">Add Logo</label>
          <p className="text-xs text-gray-500 mt-1">
            {enabled
              ? 'Logo enabled - configure below'
              : `Add logo up to ${Math.round(optimalSize * 100)}% size`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onToggle(!enabled)}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
            enabled ? 'bg-primary-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              enabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </div>
  );
}
