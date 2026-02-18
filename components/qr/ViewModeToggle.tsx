/**
 * ViewModeToggle Component
 * 
 * View mode switcher for QR code list (Grid/List/Minimal).
 */

'use client';

import React from 'react';
import { Grid3x3, List, Minimize2 } from 'lucide-react';

export type ViewMode = 'grid' | 'list' | 'minimal';

export interface ViewModeToggleProps {
  currentMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
}

interface ViewModeOption {
  value: ViewMode;
  icon: React.ReactNode;
  label: string;
  tooltip: string;
}

const VIEW_MODES: ViewModeOption[] = [
  {
    value: 'grid',
    icon: <Grid3x3 className="w-4 h-4" />,
    label: 'Grid',
    tooltip: 'Grid View',
  },
  {
    value: 'list',
    icon: <List className="w-4 h-4" />,
    label: 'List',
    tooltip: 'List View',
  },
  {
    value: 'minimal',
    icon: <Minimize2 className="w-4 h-4" />,
    label: 'Minimal',
    tooltip: 'Minimal View',
  },
];

export function ViewModeToggle({ currentMode, onModeChange }: ViewModeToggleProps) {
  return (
    <div className="inline-flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden">
      {VIEW_MODES.map((mode, index) => (
        <button
          key={mode.value}
          onClick={() => onModeChange(mode.value)}
          title={mode.tooltip}
          className={`
            relative px-3 py-2 text-sm font-medium transition-all
            ${
              currentMode === mode.value
                ? 'bg-blue-600 text-white shadow-sm z-10'
                : 'text-gray-700 hover:bg-gray-50'
            }
            ${index > 0 ? '-ml-px' : ''}
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:z-20
          `}
        >
          <div className="flex items-center gap-1.5">
            {mode.icon}
            <span className="hidden md:inline">{mode.label}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
