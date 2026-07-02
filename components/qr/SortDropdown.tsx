/**
 * SortDropdown Component
 * 
 * Sort options dropdown for QR code list.
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  ArrowUpAZ,
  ArrowDownAZ,
  BarChart3,
  Calendar,
  Tag,
  Check,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

export type SortOption =
  | 'name-asc'
  | 'name-desc'
  | 'type-asc'
  | 'type-desc'
  | 'scans-desc'
  | 'scans-asc'
  | 'date-desc'
  | 'date-asc';

export interface SortDropdownProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

interface SortOptionItem {
  value: SortOption;
  label: string;
  icon: React.ReactNode;
}

const SORT_OPTIONS: SortOptionItem[] = [
  {
    value: 'name-asc',
    label: 'Name (A-Z)',
    icon: <ArrowUpAZ className="w-4 h-4" />,
  },
  {
    value: 'name-desc',
    label: 'Name (Z-A)',
    icon: <ArrowDownAZ className="w-4 h-4" />,
  },
  {
    value: 'type-asc',
    label: 'Type (A-Z)',
    icon: <Tag className="w-4 h-4" />,
  },
  {
    value: 'type-desc',
    label: 'Type (Z-A)',
    icon: <Tag className="w-4 h-4 rotate-180" />,
  },
  {
    value: 'scans-desc',
    label: 'Most Scans',
    icon: <BarChart3 className="w-4 h-4" />,
  },
  {
    value: 'scans-asc',
    label: 'Fewest Scans',
    icon: <BarChart3 className="w-4 h-4 rotate-180" />,
  },
  {
    value: 'date-desc',
    label: 'Most Recent',
    icon: <Calendar className="w-4 h-4" />,
  },
  {
    value: 'date-asc',
    label: 'Oldest',
    icon: <Calendar className="w-4 h-4 rotate-180" />,
  },
];

/**
 * Purpose: Executes SortDropdown functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function SortDropdown({ currentSort, onSortChange }: SortDropdownProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentOption = SORT_OPTIONS.find((opt) => opt.value === currentSort);

  useEffect(() => {
    /**
     * Purpose: Executes handleClickOutside functionality.
     * Owner/Author: Syed Ashhad
     * Created/Updated: February 2026
     */
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  /**
   * Purpose: Executes handleSortSelect functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handleSortSelect = (sort: SortOption) => {
    onSortChange(sort);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
      >
        {currentOption?.icon}
        <span className="hidden sm:inline">{t(currentOption?.label || 'Sort')}</span>
        <span className="sm:hidden">{t('Sort')}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="py-1">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortSelect(option.value)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  currentSort === option.value
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className={currentSort === option.value ? 'text-blue-600' : 'text-gray-500'}>
                  {option.icon}
                </span>
                <span className="flex-1 text-left">{t(option.label)}</span>
                {currentSort === option.value && (
                  <Check className="w-4 h-4 text-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
