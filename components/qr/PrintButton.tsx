/**
 * PrintButton Component
 * 
 * Button component for printing QR codes with options.
 */

'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { Printer, Settings, Eye, Loader2 } from 'lucide-react';
import {
  printQRCode,
  printPreview,
  isPrintSupported,
  PrintOptions,
  PrintMetadata,
} from '@/lib/utils/print-utils';

export interface PrintButtonProps {
  svgElement: SVGElement | null;
  options?: PrintOptions;
  metadata?: PrintMetadata;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  showSettings?: boolean;
  disabled?: boolean;
  className?: string;
}

export function PrintButton({
  svgElement,
  options = {},
  metadata,
  variant = 'default',
  size = 'md',
  showSettings = false,
  disabled = false,
  className = '',
}: PrintButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [printOptions, setPrintOptions] = useState<PrintOptions>(options);
  
  const handlePrint = async () => {
    if (!svgElement) return;
    
    setIsLoading(true);
    try {
      await printQRCode(svgElement, printOptions, metadata);
    } catch (error) {
      console.error('Print failed:', error);
      toast.error('Unable to print. Please allow popups in your browser settings.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePreview = async () => {
    if (!svgElement) return;
    
    setIsLoading(true);
    try {
      await printPreview(svgElement, printOptions, metadata);
    } catch (error) {
      console.error('Preview failed:', error);
      toast.error('Unable to open print preview. Please allow popups in your browser.');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isPrintSupported()) {
    return null;
  }
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-2.5 text-lg',
  };
  
  const variantClasses = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 border border-blue-600',
    outline: 'bg-white text-blue-600 hover:bg-blue-50 border border-blue-600',
    ghost: 'bg-transparent text-blue-600 hover:bg-blue-50 border border-transparent',
  };
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Main print button */}
      <button
        onClick={handlePrint}
        disabled={disabled || isLoading || !svgElement}
        className={`
          inline-flex items-center gap-2 rounded-lg font-medium
          transition-all disabled:opacity-50 disabled:cursor-not-allowed
          ${sizeClasses[size]}
          ${variantClasses[variant]}
        `}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Printer className="w-4 h-4" />
        )}
        <span>Print</span>
      </button>
      
      {/* Preview button */}
      <button
        onClick={handlePreview}
        disabled={disabled || isLoading || !svgElement}
        title="Print Preview"
        className={`
          inline-flex items-center justify-center rounded-lg
          transition-all disabled:opacity-50 disabled:cursor-not-allowed
          ${size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-11 h-11' : 'w-10 h-10'}
          ${variant === 'default'
            ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }
        `}
      >
        <Eye className="w-4 h-4" />
      </button>
      
      {/* Settings button */}
      {showSettings && (
        <button
          onClick={() => setShowOptions(!showOptions)}
          disabled={disabled}
          title="Print Settings"
          className={`
            inline-flex items-center justify-center rounded-lg
            transition-all disabled:opacity-50 disabled:cursor-not-allowed
            ${size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-11 h-11' : 'w-10 h-10'}
            ${showOptions
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }
          `}
        >
          <Settings className="w-4 h-4" />
        </button>
      )}
      
      {/* Settings panel */}
      {showSettings && showOptions && (
        <div className="absolute top-full left-0 mt-2 p-4 bg-white rounded-lg shadow-lg border border-gray-200 z-10 min-w-[300px]">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Print Settings</h3>
          
          <div className="space-y-3">
            {/* Page size */}
            <div>
              <label className="block text-xs text-gray-600 mb-1">Page Size</label>
              <select
                value={printOptions.pageSize || 'a4'}
                onChange={(e) => setPrintOptions({ ...printOptions, pageSize: e.target.value as any })}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded"
              >
                <option value="a4">A4</option>
                <option value="letter">Letter</option>
                <option value="legal">Legal</option>
                <option value="a3">A3</option>
                <option value="a5">A5</option>
              </select>
            </div>
            
            {/* Orientation */}
            <div>
              <label className="block text-xs text-gray-600 mb-1">Orientation</label>
              <select
                value={printOptions.orientation || 'portrait'}
                onChange={(e) => setPrintOptions({ ...printOptions, orientation: e.target.value as any })}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded"
              >
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </div>
            
            {/* QR Size */}
            <div>
              <label className="block text-xs text-gray-600 mb-1">QR Size (px)</label>
              <input
                type="number"
                min={100}
                max={600}
                value={printOptions.qrSize || 300}
                onChange={(e) => setPrintOptions({ ...printOptions, qrSize: parseInt(e.target.value) })}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded"
              />
            </div>
            
            {/* Checkboxes */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs text-gray-600">
                <input
                  type="checkbox"
                  checked={printOptions.centerOnPage !== false}
                  onChange={(e) => setPrintOptions({ ...printOptions, centerOnPage: e.target.checked })}
                  className="rounded"
                />
                Center on page
              </label>
              
              <label className="flex items-center gap-2 text-xs text-gray-600">
                <input
                  type="checkbox"
                  checked={printOptions.showDate !== false}
                  onChange={(e) => setPrintOptions({ ...printOptions, showDate: e.target.checked })}
                  className="rounded"
                />
                Show date
              </label>
              
              <label className="flex items-center gap-2 text-xs text-gray-600">
                <input
                  type="checkbox"
                  checked={printOptions.showURL !== true}
                  onChange={(e) => setPrintOptions({ ...printOptions, showURL: e.target.checked })}
                  className="rounded"
                />
                Show URL
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Compact print button (icon only)
 */
export function PrintButtonCompact({
  svgElement,
  options = {},
  metadata,
  disabled = false,
  className = '',
}: Omit<PrintButtonProps, 'variant' | 'size' | 'showSettings'>) {
  const [isLoading, setIsLoading] = useState(false);
  
  const handlePrint = async () => {
    if (!svgElement) return;
    
    setIsLoading(true);
    try {
      await printQRCode(svgElement, options, metadata);
    } catch (error) {
      console.error('Print failed:', error);
      toast.error('Print failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isPrintSupported()) {
    return null;
  }
  
  return (
    <button
      onClick={handlePrint}
      disabled={disabled || isLoading || !svgElement}
      title="Print QR Code"
      className={`
        inline-flex items-center justify-center w-10 h-10 rounded-lg
        bg-gray-100 text-gray-600 hover:bg-gray-200
        transition-all disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Printer className="w-4 h-4" />
      )}
    </button>
  );
}
