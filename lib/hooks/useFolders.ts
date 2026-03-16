/**
 * useFolders Hook
 * 
 * Hook for managing folder hierarchy and operations.
 */

'use client';

import { useState, useCallback, useMemo } from 'react';

export interface Folder {
  id: string;
  name: string;
  color?: string;
  parentId?: string | null;
  level: number;
  itemCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FolderTreeNode extends Folder {
  children: FolderTreeNode[];
  isExpanded?: boolean;
}

const FOLDER_COLORS = [
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Gray', value: '#6b7280' },
];

const MAX_FOLDER_DEPTH = 3;
const MAX_FOLDER_NAME_LENGTH = 50;

export function useFolders(initialFolders: Folder[] = []) {
  const [folders, setFolders] = useState<Folder[]>(initialFolders);
  const [expandedFolderIds, setExpandedFolderIds] = useState<Set<string>>(new Set());
  
  // Build folder tree
  const folderTree = useMemo(() => {
    return buildFolderTree(folders, expandedFolderIds);
  }, [folders, expandedFolderIds]);
  
  // Get flat list of folders (for display)
  const flatFolders = useMemo(() => {
    return flattenFolderTree(folderTree);
  }, [folderTree]);
  
  // Get root folders
  const rootFolders = useMemo(() => {
    return folders.filter(f => !f.parentId);
  }, [folders]);
  
  // Get folder by ID
  const getFolder = useCallback((folderId: string): Folder | undefined => {
    return folders.find(f => f.id === folderId);
  }, [folders]);
  
  // Get folder path (breadcrumb)
  const getFolderPath = useCallback((folderId: string): Folder[] => {
    const path: Folder[] = [];
    let currentId: string | undefined | null = folderId;
    
    while (currentId) {
      const folder = folders.find(f => f.id === currentId);
      if (!folder) break;
      
      path.unshift(folder);
      currentId = folder.parentId;
    }
    
    return path;
  }, [folders]);
  
  // Get children folders
  const getChildren = useCallback((folderId: string | null): Folder[] => {
    return folders.filter(f => f.parentId === folderId);
  }, [folders]);
  
  // Check if folder can accept children
  const canHaveChildren = useCallback((folderId: string): boolean => {
    const folder = getFolder(folderId);
    if (!folder) return false;
    return folder.level < MAX_FOLDER_DEPTH;
  }, [getFolder]);
  
  // Create folder
  const createFolder = useCallback((
    name: string,
    parentId?: string | null,
    color?: string
  ): Folder | null => {
    // Validate name
    if (!name.trim()) return null;
    if (name.length > MAX_FOLDER_NAME_LENGTH) return null;
    
    // Calculate level
    let level = 1;
    if (parentId) {
      const parent = getFolder(parentId);
      if (!parent) return null;
      
      level = parent.level + 1;
      
      // Check max depth
      if (level > MAX_FOLDER_DEPTH) return null;
    }
    
    // Create folder
    const newFolder: Folder = {
      id: `folder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      color,
      parentId: parentId || null,
      level,
      itemCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setFolders(prev => [...prev, newFolder]);
    
    // Auto-expand parent
    if (parentId) {
      setExpandedFolderIds(prev => new Set(prev).add(parentId));
    }
    
    return newFolder;
  }, [getFolder]);
  
  // Update folder
  const updateFolder = useCallback((
    folderId: string,
    updates: Partial<Pick<Folder, 'name' | 'color'>>
  ): boolean => {
    const folder = getFolder(folderId);
    if (!folder) return false;
    
    // Validate name if updating
    if (updates.name !== undefined) {
      if (!updates.name.trim()) return false;
      if (updates.name.length > MAX_FOLDER_NAME_LENGTH) return false;
    }
    
    setFolders(prev => prev.map(f =>
      f.id === folderId
        ? { ...f, ...updates, updatedAt: new Date() }
        : f
    ));
    
    return true;
  }, [getFolder]);
  
  // Delete folder
  const deleteFolder = useCallback((folderId: string, moveItemsToParent = false): boolean => {
    const folder = getFolder(folderId);
    if (!folder) return false;
    
    // Get all descendants
    const descendants = getAllDescendants(folderId, folders);
    const descendantIds = new Set(descendants.map(f => f.id));
    
    setFolders(prev => {
      if (moveItemsToParent) {
        // Move direct children to parent
        return prev
          .filter(f => f.id !== folderId && !descendantIds.has(f.id))
          .map(f => f.parentId === folderId ? { ...f, parentId: folder.parentId } : f);
      } else {
        // Delete folder and all descendants
        return prev.filter(f => f.id !== folderId && !descendantIds.has(f.id));
      }
    });
    
    return true;
  }, [getFolder, folders]);
  
  // Move folder
  const moveFolder = useCallback((
    folderId: string,
    newParentId: string | null
  ): boolean => {
    const folder = getFolder(folderId);
    if (!folder) return false;
    
    // Can't move to itself
    if (folderId === newParentId) return false;
    
    // Can't move to own descendant
    const descendants = getAllDescendants(folderId, folders);
    if (descendants.some(d => d.id === newParentId)) return false;
    
    // Calculate new level
    let newLevel = 1;
    if (newParentId) {
      const newParent = getFolder(newParentId);
      if (!newParent) return false;
      
      newLevel = newParent.level + 1;
      
      // Check if move would exceed max depth
      const maxDescendantDepth = getMaxDescendantDepth(folder, folders);
      if (newLevel + maxDescendantDepth > MAX_FOLDER_DEPTH) return false;
    }
    
    // Update folder and all descendants
    setFolders(prev => {
      const levelDiff = newLevel - folder.level;
      
      return prev.map(f => {
        if (f.id === folderId) {
          return { ...f, parentId: newParentId, level: newLevel, updatedAt: new Date() };
        }
        
        // Update descendant levels
        if (descendants.some(d => d.id === f.id)) {
          return { ...f, level: f.level + levelDiff };
        }
        
        return f;
      });
    });
    
    // Auto-expand new parent
    if (newParentId) {
      setExpandedFolderIds(prev => new Set(prev).add(newParentId));
    }
    
    return true;
  }, [getFolder, folders]);
  
  // Toggle folder expansion
  const toggleExpanded = useCallback((folderId: string) => {
    setExpandedFolderIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  }, []);
  
  // Expand all folders
  const expandAll = useCallback(() => {
    setExpandedFolderIds(new Set(folders.map(f => f.id)));
  }, [folders]);
  
  // Collapse all folders
  const collapseAll = useCallback(() => {
    setExpandedFolderIds(new Set());
  }, []);
  
  return {
    // State
    folders,
    folderTree,
    flatFolders,
    rootFolders,
    expandedFolderIds,
    
    // Getters
    getFolder,
    getFolderPath,
    getChildren,
    canHaveChildren,
    
    // CRUD
    createFolder,
    updateFolder,
    deleteFolder,
    moveFolder,
    
    // Expansion
    toggleExpanded,
    expandAll,
    collapseAll,
    
    // Constants
    FOLDER_COLORS,
    MAX_FOLDER_DEPTH,
    MAX_FOLDER_NAME_LENGTH,
  };
}

/**
 * Build folder tree from flat list
 */
function buildFolderTree(folders: Folder[], expandedIds: Set<string>): FolderTreeNode[] {
  const nodeMap = new Map<string, FolderTreeNode>();
  const rootNodes: FolderTreeNode[] = [];
  
  // Create nodes
  folders.forEach(folder => {
    nodeMap.set(folder.id, {
      ...folder,
      children: [],
      isExpanded: expandedIds.has(folder.id),
    });
  });
  
  // Build tree
  folders.forEach(folder => {
    const node = nodeMap.get(folder.id)!;
    
    if (folder.parentId) {
      const parent = nodeMap.get(folder.parentId);
      if (parent) {
        parent.children.push(node);
      }
    } else {
      rootNodes.push(node);
    }
  });
  
  // Sort children by name
  const sortChildren = (node: FolderTreeNode) => {
    node.children.sort((a, b) => a.name.localeCompare(b.name));
    node.children.forEach(sortChildren);
  };
  
  rootNodes.forEach(sortChildren);
  
  return rootNodes;
}

/**
 * Flatten folder tree to list (respecting expansion state)
 */
function flattenFolderTree(tree: FolderTreeNode[]): FolderTreeNode[] {
  const result: FolderTreeNode[] = [];
  
  const traverse = (nodes: FolderTreeNode[]) => {
    nodes.forEach(node => {
      result.push(node);
      if (node.isExpanded && node.children.length > 0) {
        traverse(node.children);
      }
    });
  };
  
  traverse(tree);
  return result;
}

/**
 * Get all descendants of a folder
 */
function getAllDescendants(folderId: string, folders: Folder[]): Folder[] {
  const descendants: Folder[] = [];
  const children = folders.filter(f => f.parentId === folderId);
  
  children.forEach(child => {
    descendants.push(child);
    descendants.push(...getAllDescendants(child.id, folders));
  });
  
  return descendants;
}

/**
 * Get max depth of descendants
 */
function getMaxDescendantDepth(folder: Folder, folders: Folder[]): number {
  const children = folders.filter(f => f.parentId === folder.id);
  
  if (children.length === 0) return 0;
  
  return 1 + Math.max(...children.map(child => getMaxDescendantDepth(child, folders)));
}
