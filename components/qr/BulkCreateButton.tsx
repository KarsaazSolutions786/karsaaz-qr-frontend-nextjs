/**
 * BulkCreateButton Component
 * 
 * Prominent button for bulk QR code creation.
 */

'use client';

import React from 'react';
import { FolderPlus, Sparkles } from 'lucide-react';

export interface BulkCreateButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function BulkCreateButton({ onClick, disabled = false }: BulkCreateButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        group relative inline-flex items-center gap-2 px-5 py-2.5 
        bg-gradient-to-r from-purple-600 to-blue-600 
        text-white font-semibold rounded-lg 
        shadow-lg shadow-purple-500/30
        transition-all duration-200
        ${
          disabled
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:shadow-xl hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98]'
        }
        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
      `}
    >
      {/* Animated Sparkle */}
      <div className="relative">
        <FolderPlus className="w-5 h-5" />
        {!disabled && (
          <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-300 animate-pulse" />
        )}
      </div>
      
      <span className="text-sm sm:text-base">Bulk Create</span>
      
      {/* Shine Effect */}
      {!disabled && (
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      )}
    </button>
  );
}
