/**
 * FolderBreadcrumb Component
 * 
 * Breadcrumb navigation for folder hierarchy.
 */

'use client';

import React from 'react';
import { Home, ChevronRight, Folder } from 'lucide-react';
import { Folder as FolderType } from '@/hooks/useFolders';

export interface FolderBreadcrumbProps {
  path: FolderType[];
  onNavigate: (folderId: string | null) => void;
  className?: string;
}

export function FolderBreadcrumb({
  path,
  onNavigate,
  className = '',
}: FolderBreadcrumbProps) {
  return (
    <nav className={`flex items-center gap-2 ${className}`}>
      {/* Home/All */}
      <button
        onClick={() => onNavigate(null)}
        className={`
          flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
          transition-colors
          ${path.length === 0
            ? 'bg-blue-50 text-blue-700'
            : 'text-gray-600 hover:bg-gray-100'
          }
        `}
      >
        <Home className="w-4 h-4" />
        <span>All QR Codes</span>
      </button>
      
      {/* Breadcrumb items */}
      {path.map((folder, index) => {
        const isLast = index === path.length - 1;
        
        return (
          <React.Fragment key={folder.id}>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            
            <button
              onClick={() => onNavigate(folder.id)}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
                transition-colors
                ${isLast
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              <Folder
                className="w-4 h-4"
                style={{ color: folder.color || undefined }}
              />
              <span className="max-w-[200px] truncate">{folder.name}</span>
              
              {folder.itemCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                  {folder.itemCount}
                </span>
              )}
            </button>
          </React.Fragment>
        );
      })}
    </nav>
  );
}

/**
 * Compact breadcrumb (dropdown style)
 */
export function FolderBreadcrumbCompact({
  path,
  onNavigate,
  className = '',
}: FolderBreadcrumbProps) {
  const [showDropdown, setShowDropdown] = React.useState(false);
  const currentFolder = path[path.length - 1];
  
  if (path.length === 0) {
    return (
      <button
        onClick={() => onNavigate(null)}
        className={`flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg ${className}`}
      >
        <Home className="w-4 h-4" />
        <span>All QR Codes</span>
      </button>
    );
  }
  
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
      >
        <Folder
          className="w-4 h-4"
          style={{ color: currentFolder?.color || undefined }}
        />
        <span className="max-w-[200px] truncate">
          {currentFolder?.name || 'All QR Codes'}
        </span>
        <ChevronRight className="w-4 h-4" />
      </button>
      
      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          />
          
          <div className="absolute left-0 top-full mt-1 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-20 py-2">
            <button
              onClick={() => {
                onNavigate(null);
                setShowDropdown(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <Home className="w-4 h-4" />
              <span>All QR Codes</span>
            </button>
            
            {path.map((folder, index) => (
              <button
                key={folder.id}
                onClick={() => {
                  onNavigate(folder.id);
                  setShowDropdown(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                style={{ paddingLeft: `${12 + index * 16}px` }}
              >
                <Folder
                  className="w-4 h-4"
                  style={{ color: folder.color || undefined }}
                />
                <span className="flex-1 truncate">{folder.name}</span>
                {folder.itemCount > 0 && (
                  <span className="text-xs text-gray-500">
                    {folder.itemCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
