/**
 * FolderTree Component
 * 
 * Hierarchical folder tree with drag and drop support.
 */

'use client';

import React, { useState } from 'react';
import {
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  MoreVertical,
  Edit2,
  Trash2,
  FolderPlus,
  Move,
} from 'lucide-react';

/** Minimal folder shape required by FolderTree */
export interface FolderTreeItem {
  id: string;
  name: string;
  color?: string;
  parentId?: string | null;
  level?: number;
  itemCount?: number;
  children?: FolderTreeItem[];
  isExpanded?: boolean;
}

export interface FolderTreeProps {
  folders: FolderTreeItem[];
  selectedFolderId?: string | null;
  onSelectFolder: (folderId: string | null) => void;
  onToggleExpanded: (folderId: string) => void;
  onCreateFolder?: (parentId: string | null) => void;
  onRenameFolder?: (folderId: string) => void;
  onDeleteFolder?: (folderId: string) => void;
  onMoveFolder?: (folderId: string, newParentId: string | null) => void;
  dragEnabled?: boolean;
  className?: string;
}

export function FolderTree({
  folders,
  selectedFolderId,
  onSelectFolder,
  onToggleExpanded,
  onCreateFolder,
  onRenameFolder,
  onDeleteFolder,
  onMoveFolder,
  dragEnabled = false,
  className = '',
}: FolderTreeProps) {
  const [draggedFolderId, setDraggedFolderId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  
  const handleDragStart = (e: React.DragEvent, folderId: string) => {
    if (!dragEnabled) return;
    
    setDraggedFolderId(folderId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('folderId', folderId);
  };
  
  const handleDragOver = (e: React.DragEvent, folderId: string | null) => {
    if (!dragEnabled || !draggedFolderId) return;
    
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropTargetId(folderId);
  };
  
  const handleDragLeave = () => {
    setDropTargetId(null);
  };
  
  const handleDrop = (e: React.DragEvent, targetFolderId: string | null) => {
    if (!dragEnabled || !draggedFolderId) return;
    
    e.preventDefault();
    
    if (draggedFolderId !== targetFolderId && onMoveFolder) {
      onMoveFolder(draggedFolderId, targetFolderId);
    }
    
    setDraggedFolderId(null);
    setDropTargetId(null);
  };
  
  const handleDragEnd = () => {
    setDraggedFolderId(null);
    setDropTargetId(null);
  };
  
  return (
    <div className={`space-y-1 ${className}`}>
      {/* Root level drop zone */}
      {dragEnabled && (
        <div
          onDragOver={(e) => handleDragOver(e, null)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, null)}
          className={`
            h-2 rounded transition-colors
            ${dropTargetId === null && draggedFolderId
              ? 'bg-blue-200'
              : 'bg-transparent'
            }
          `}
        />
      )}
      
      {folders.map(folder => (
        <FolderTreeItem
          key={folder.id}
          folder={folder}
          isSelected={selectedFolderId === folder.id}
          isDragging={draggedFolderId === folder.id}
          isDropTarget={dropTargetId === folder.id}
          onSelect={() => onSelectFolder(folder.id)}
          onToggleExpanded={() => onToggleExpanded(folder.id)}
          onCreateSubfolder={onCreateFolder ? () => onCreateFolder(folder.id) : undefined}
          onRename={onRenameFolder ? () => onRenameFolder(folder.id) : undefined}
          onDelete={onDeleteFolder ? () => onDeleteFolder(folder.id) : undefined}
          onDragStart={(e) => handleDragStart(e, folder.id)}
          onDragOver={(e) => handleDragOver(e, folder.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, folder.id)}
          onDragEnd={handleDragEnd}
          dragEnabled={dragEnabled}
        />
      ))}
    </div>
  );
}

/**
 * Folder tree item
 */
interface FolderTreeItemProps {
  folder: FolderTreeItem;
  isSelected: boolean;
  isDragging: boolean;
  isDropTarget: boolean;
  onSelect: () => void;
  onToggleExpanded: () => void;
  onCreateSubfolder?: () => void;
  onRename?: () => void;
  onDelete?: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  dragEnabled?: boolean;
}

function FolderTreeItem({
  folder,
  isSelected,
  isDragging,
  isDropTarget,
  onSelect,
  onToggleExpanded,
  onCreateSubfolder,
  onRename,
  onDelete,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  dragEnabled = false,
}: FolderTreeItemProps) {
  const [showMenu, setShowMenu] = useState(false);
  const hasChildren = (folder.children?.length ?? 0) > 0;
  const indent = ((folder.level ?? 1) - 1) * 20;
  
  return (
    <div>
      <div
        draggable={dragEnabled}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onDragEnd={onDragEnd}
        className={`
          group flex items-center gap-2 px-2 py-2 rounded-lg
          transition-all cursor-pointer relative
          ${isSelected
            ? 'bg-blue-50 text-blue-700'
            : 'text-gray-700 hover:bg-gray-50'
          }
          ${isDragging ? 'opacity-50' : ''}
          ${isDropTarget ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
        `}
        style={{ paddingLeft: `${8 + indent}px` }}
      >
        {/* Expansion toggle */}
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpanded();
            }}
            className="p-0.5 hover:bg-gray-200 rounded"
          >
            {folder.isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        ) : (
          <div className="w-5" />
        )}
        
        {/* Folder icon */}
        <div
          className="flex-shrink-0"
          style={{ color: folder.color || undefined }}
        >
          {folder.isExpanded ? (
            <FolderOpen className="w-5 h-5" />
          ) : (
            <Folder className="w-5 h-5" />
          )}
        </div>
        
        {/* Folder name */}
        <button
          onClick={onSelect}
          className="flex-1 text-left text-sm font-medium truncate"
        >
          {folder.name}
        </button>
        
        {/* Item count */}
        {(folder.itemCount ?? 0) > 0 && (
          <span className="text-xs text-gray-500 px-1.5 py-0.5 bg-gray-100 rounded">
            {folder.itemCount}
          </span>
        )}
        
        {/* Menu */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-200 rounded transition-opacity"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          
          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-20 py-1">
                {onCreateSubfolder && (
                  <button
                    onClick={() => {
                      onCreateSubfolder();
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <FolderPlus className="w-4 h-4" />
                    <span>New Subfolder</span>
                  </button>
                )}
                
                {onRename && (
                  <button
                    onClick={() => {
                      onRename();
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Rename</span>
                  </button>
                )}
                
                {dragEnabled && (
                  <button
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-move"
                  >
                    <Move className="w-4 h-4" />
                    <span>Drag to move</span>
                  </button>
                )}
                
                {onDelete && (
                  <>
                    <div className="my-1 border-t border-gray-200" />
                    <button
                      onClick={() => {
                        onDelete();
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Children */}
      {folder.isExpanded && hasChildren && folder.children && (
        <div className="mt-1">
          {folder.children.map(child => (
            <FolderTreeItem
              key={child.id}
              folder={child}
              isSelected={isSelected}
              isDragging={isDragging}
              isDropTarget={isDropTarget}
              onSelect={onSelect}
              onToggleExpanded={onToggleExpanded}
              onCreateSubfolder={onCreateSubfolder}
              onRename={onRename}
              onDelete={onDelete}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onDragEnd={onDragEnd}
              dragEnabled={dragEnabled}
            />
          ))}
        </div>
      )}
    </div>
  );
}
