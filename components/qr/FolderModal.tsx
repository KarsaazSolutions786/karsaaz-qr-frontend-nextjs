/**
 * FolderModal Component
 * 
 * Modal for creating and editing folders.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { X, Folder, Check } from 'lucide-react';
import { Folder as FolderType } from '@/hooks/useFolders';

export interface FolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  folder?: FolderType;
  parentFolder?: FolderType;
  onSave: (data: { name: string; color?: string }) => void;
  colors: { name: string; value: string }[];
  maxNameLength?: number;
}

export function FolderModal({
  isOpen,
  onClose,
  mode,
  folder,
  parentFolder,
  onSave,
  colors,
  maxNameLength = 50,
}: FolderModalProps) {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (isOpen) {
      setName(folder?.name || '');
      setSelectedColor(folder?.color);
      setError('');
    }
  }, [isOpen, folder]);
  
  if (!isOpen) return null;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!name.trim()) {
      setError('Folder name is required');
      return;
    }
    
    if (name.length > maxNameLength) {
      setError(`Folder name must be ${maxNameLength} characters or less`);
      return;
    }
    
    // Save
    onSave({
      name: name.trim(),
      color: selectedColor,
    });
    
    onClose();
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Folder className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {mode === 'create' ? 'New Folder' : 'Edit Folder'}
              </h2>
              {parentFolder && (
                <p className="text-sm text-gray-500">
                  in {parentFolder.name}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name input */}
          <div>
            <label htmlFor="folder-name" className="block text-sm font-medium text-gray-700 mb-2">
              Folder Name
            </label>
            <input
              id="folder-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="Enter folder name"
              maxLength={maxNameLength}
              autoFocus
              className={`
                w-full px-3 py-2 border rounded-lg
                focus:outline-none focus:ring-2
                ${error
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
                }
              `}
            />
            
            {/* Character count */}
            <div className="flex items-center justify-between mt-1">
              {error ? (
                <p className="text-xs text-red-600">{error}</p>
              ) : (
                <div />
              )}
              <p className="text-xs text-gray-500">
                {name.length}/{maxNameLength}
              </p>
            </div>
          </div>
          
          {/* Color picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Folder Color (Optional)
            </label>
            <div className="grid grid-cols-9 gap-2">
              {/* No color option */}
              <button
                type="button"
                onClick={() => setSelectedColor(undefined)}
                className={`
                  w-10 h-10 rounded-lg border-2 flex items-center justify-center
                  transition-all
                  ${!selectedColor
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                  }
                `}
                title="No color"
              >
                <div className="w-6 h-6 rounded-full border-2 border-gray-300 bg-white" />
              </button>
              
              {/* Color options */}
              {colors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  className={`
                    w-10 h-10 rounded-lg border-2 flex items-center justify-center
                    transition-all
                    ${selectedColor === color.value
                      ? 'border-blue-500 scale-110'
                      : 'border-transparent hover:scale-105'
                    }
                  `}
                  style={{ backgroundColor: `${color.value}20` }}
                  title={color.name}
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: color.value }}
                  >
                    {selectedColor === color.value && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Preview */}
          <div className="pt-4 border-t border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preview
            </label>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2">
                <Folder
                  className="w-5 h-5"
                  style={{ color: selectedColor || '#6b7280' }}
                />
                <span className="font-medium text-gray-900">
                  {name || 'Folder Name'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mode === 'create' ? 'Create Folder' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * Folder delete confirmation modal
 */
export interface FolderDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  folder: FolderType;
  onConfirm: (moveItemsToParent: boolean) => void;
  hasItems: boolean;
}

export function FolderDeleteModal({
  isOpen,
  onClose,
  folder,
  onConfirm,
  hasItems,
}: FolderDeleteModalProps) {
  const [moveItems, setMoveItems] = useState(true);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Folder className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Delete Folder</h2>
              <p className="text-sm text-gray-600">This action cannot be undone</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-700">
              Are you sure you want to delete the folder{' '}
              <span className="font-medium">"{folder.name}"</span>?
            </p>
            
            {hasItems && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800 mb-3">
                  This folder contains {folder.itemCount} item{folder.itemCount !== 1 ? 's' : ''}.
                  What would you like to do with {folder.itemCount === 1 ? 'it' : 'them'}?
                </p>
                
                <div className="space-y-2">
                  <label className="flex items-start gap-2 text-sm text-gray-700">
                    <input
                      type="radio"
                      checked={moveItems}
                      onChange={() => setMoveItems(true)}
                      className="mt-0.5"
                    />
                    <span>
                      Move to parent folder
                      {folder.parentId && ' (recommended)'}
                    </span>
                  </label>
                  
                  <label className="flex items-start gap-2 text-sm text-gray-700">
                    <input
                      type="radio"
                      checked={!moveItems}
                      onChange={() => setMoveItems(false)}
                      className="mt-0.5"
                    />
                    <span className="text-red-600">
                      Delete all items in this folder
                    </span>
                  </label>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm(moveItems);
                onClose();
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg"
            >
              Delete Folder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
