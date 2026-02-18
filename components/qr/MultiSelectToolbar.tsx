/**
 * MultiSelectToolbar Component
 * 
 * Toolbar for bulk actions on selected QR codes.
 */

'use client';

import React, { useState } from 'react';
import {
  Download,
  Trash2,
  FolderInput,
  Archive,
  Copy,
  Eye,
  EyeOff,
  X,
  MoreHorizontal,
  FileDown,
} from 'lucide-react';

export interface BulkAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  variant?: 'default' | 'danger';
  requiresConfirmation?: boolean;
  onClick: (selectedIds: string[]) => void | Promise<void>;
}

export interface MultiSelectToolbarProps {
  selectedCount: number;
  onClearSelection: () => void;
  actions?: BulkAction[];
  maxHeight?: boolean;
  className?: string;
}

const DEFAULT_ACTIONS: BulkAction[] = [
  {
    id: 'download',
    label: 'Download',
    icon: <Download className="w-4 h-4" />,
    onClick: () => {},
  },
  {
    id: 'zip',
    label: 'Download as ZIP',
    icon: <FileDown className="w-4 h-4" />,
    onClick: () => {},
  },
  {
    id: 'move',
    label: 'Move to Folder',
    icon: <FolderInput className="w-4 h-4" />,
    onClick: () => {},
  },
  {
    id: 'duplicate',
    label: 'Duplicate',
    icon: <Copy className="w-4 h-4" />,
    onClick: () => {},
  },
  {
    id: 'activate',
    label: 'Activate',
    icon: <Eye className="w-4 h-4" />,
    onClick: () => {},
  },
  {
    id: 'deactivate',
    label: 'Deactivate',
    icon: <EyeOff className="w-4 h-4" />,
    onClick: () => {},
  },
  {
    id: 'archive',
    label: 'Archive',
    icon: <Archive className="w-4 h-4" />,
    onClick: () => {},
  },
  {
    id: 'delete',
    label: 'Delete',
    icon: <Trash2 className="w-4 h-4" />,
    variant: 'danger' as const,
    requiresConfirmation: true,
    onClick: () => {},
  },
];

export function MultiSelectToolbar({
  selectedCount,
  onClearSelection,
  actions = DEFAULT_ACTIONS,
  maxHeight = true,
  className = '',
}: MultiSelectToolbarProps) {
  const [showMoreActions, setShowMoreActions] = useState(false);
  
  if (selectedCount === 0) return null;
  
  // Split actions into primary and more actions
  const primaryActions = actions.slice(0, 4);
  const moreActions = actions.slice(4);
  
  return (
    <div
      className={`
        fixed ${maxHeight ? 'top-16' : 'top-0'} left-0 right-0 z-40
        bg-blue-600 text-white shadow-lg
        transition-all duration-300
        ${className}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Selection info */}
          <div className="flex items-center gap-3">
            <button
              onClick={onClearSelection}
              className="p-1 rounded hover:bg-blue-700 transition-colors"
              title="Clear selection"
            >
              <X className="w-5 h-5" />
            </button>
            
            <span className="font-medium">
              {selectedCount} {selectedCount === 1 ? 'item' : 'items'} selected
            </span>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Primary actions */}
            {primaryActions.map((action) => (
              <ActionButton
                key={action.id}
                action={action}
                selectedCount={selectedCount}
              />
            ))}
            
            {/* More actions dropdown */}
            {moreActions.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowMoreActions(!showMoreActions)}
                  className={`
                    inline-flex items-center gap-2 px-3 py-2 rounded-lg
                    font-medium text-sm transition-colors
                    ${showMoreActions
                      ? 'bg-blue-700'
                      : 'bg-blue-500 hover:bg-blue-700'
                    }
                  `}
                >
                  <MoreHorizontal className="w-4 h-4" />
                  <span>More</span>
                </button>
                
                {showMoreActions && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowMoreActions(false)}
                    />
                    
                    {/* Dropdown */}
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
                      <div className="py-2">
                        {moreActions.map((action) => (
                          <button
                            key={action.id}
                            onClick={() => {
                              action.onClick([]);
                              setShowMoreActions(false);
                            }}
                            className={`
                              w-full flex items-center gap-3 px-4 py-2.5
                              text-left transition-colors
                              ${action.variant === 'danger'
                                ? 'text-red-600 hover:bg-red-50'
                                : 'text-gray-700 hover:bg-gray-50'
                              }
                            `}
                          >
                            {action.icon}
                            <span className="font-medium">{action.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Action button component
 */
function ActionButton({
  action,
  selectedCount,
}: {
  action: BulkAction;
  selectedCount: number;
}) {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleClick = async () => {
    if (action.requiresConfirmation) {
      const confirmed = confirm(
        `Are you sure you want to ${action.label.toLowerCase()} ${selectedCount} ${
          selectedCount === 1 ? 'item' : 'items'
        }?`
      );
      if (!confirmed) return;
    }
    
    setIsLoading(true);
    try {
      await action.onClick([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`
        inline-flex items-center gap-2 px-3 py-2 rounded-lg
        font-medium text-sm transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        ${action.variant === 'danger'
          ? 'bg-red-600 hover:bg-red-700'
          : 'bg-blue-500 hover:bg-blue-700'
        }
      `}
    >
      {action.icon}
      <span>{action.label}</span>
    </button>
  );
}

/**
 * Compact multi-select toolbar (sticky)
 */
export function MultiSelectToolbarCompact({
  selectedCount,
  onClearSelection,
  onDownloadAll,
  onDeleteAll,
  className = '',
}: {
  selectedCount: number;
  onClearSelection: () => void;
  onDownloadAll: () => void;
  onDeleteAll: () => void;
  className?: string;
}) {
  if (selectedCount === 0) return null;
  
  return (
    <div
      className={`
        sticky top-0 z-40 bg-blue-600 text-white px-4 py-2
        flex items-center justify-between gap-4
        ${className}
      `}
    >
      <div className="flex items-center gap-2">
        <button
          onClick={onClearSelection}
          className="p-1 rounded hover:bg-blue-700"
        >
          <X className="w-4 h-4" />
        </button>
        <span className="text-sm font-medium">
          {selectedCount} selected
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={onDownloadAll}
          className="p-2 rounded hover:bg-blue-700"
          title="Download all"
        >
          <Download className="w-4 h-4" />
        </button>
        <button
          onClick={onDeleteAll}
          className="p-2 rounded hover:bg-red-700"
          title="Delete all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
