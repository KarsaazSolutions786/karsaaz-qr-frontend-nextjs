/**
 * Folder Types
 * 
 * Defines folder organization system for QR codes including
 * nested folders, colors, and tree structures.
 */

// Folder Colors
export type FolderColor =
  | 'gray'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'pink';

// Folder Interface
export interface Folder {
  id: string; // UUID
  userId: string; // Owner ID
  name: string; // Folder name
  color: FolderColor; // Visual color identifier
  parentId: string | null; // Parent folder ID (null for root)
  depth: number; // Nesting level (0-2, max 3 levels)
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  qrCodeCount?: number; // Number of QR codes in folder (cached)
  childCount?: number; // Number of child folders (cached)
}

// Folder with Children (Tree Structure)
export interface FolderTree extends Folder {
  children: FolderTree[]; // Nested folders
  isExpanded?: boolean; // UI state for tree view
}

// Folder Creation/Update
export interface CreateFolderData {
  name: string;
  color?: FolderColor;
  parentId?: string | null;
}

export interface UpdateFolderData {
  name?: string;
  color?: FolderColor;
  parentId?: string | null;
}

// Folder Move Operation
export interface MoveFolderData {
  folderId: string;
  targetParentId: string | null; // null for root level
}

// Folder Statistics
export interface FolderStats {
  totalQRCodes: number; // Including all child folders
  directQRCodes: number; // Only in this folder
  childFolders: number; // Direct children
  totalChildFolders: number; // Including nested
}

// Folder Color Definitions
export const FOLDER_COLORS: Record<FolderColor, { hex: string; name: string }> = {
  gray: { hex: '#6B7280', name: 'Gray' },
  red: { hex: '#EF4444', name: 'Red' },
  orange: { hex: '#F97316', name: 'Orange' },
  yellow: { hex: '#EAB308', name: 'Yellow' },
  green: { hex: '#10B981', name: 'Green' },
  blue: { hex: '#3B82F6', name: 'Blue' },
  purple: { hex: '#8B5CF6', name: 'Purple' },
  pink: { hex: '#EC4899', name: 'Pink' },
};

// Maximum folder depth
export const MAX_FOLDER_DEPTH = 2; // 0-indexed, so 3 levels total (0, 1, 2)

// Helper Functions
export function canAddChildFolder(parentDepth: number): boolean {
  return parentDepth < MAX_FOLDER_DEPTH;
}

export function getFolderPath(folder: Folder, allFolders: Folder[]): Folder[] {
  const path: Folder[] = [folder];
  let current = folder;
  
  while (current.parentId) {
    const parent = allFolders.find(f => f.id === current.parentId);
    if (!parent) break;
    path.unshift(parent);
    current = parent;
  }
  
  return path;
}

export function buildFolderTree(folders: Folder[]): FolderTree[] {
  const folderMap = new Map<string, FolderTree>();
  const rootFolders: FolderTree[] = [];
  
  // Create folder tree nodes
  folders.forEach(folder => {
    folderMap.set(folder.id, { ...folder, children: [] });
  });
  
  // Build tree structure
  folders.forEach(folder => {
    const treeNode = folderMap.get(folder.id)!;
    
    if (folder.parentId === null) {
      rootFolders.push(treeNode);
    } else {
      const parent = folderMap.get(folder.parentId);
      if (parent) {
        parent.children.push(treeNode);
      }
    }
  });
  
  return rootFolders;
}

export function flattenFolderTree(tree: FolderTree[]): Folder[] {
  const result: Folder[] = [];
  
  function traverse(nodes: FolderTree[]) {
    nodes.forEach(node => {
      const { children, isExpanded, ...folder } = node;
      result.push(folder);
      if (children.length > 0) {
        traverse(children);
      }
    });
  }
  
  traverse(tree);
  return result;
}

export function findFolder(folderId: string, tree: FolderTree[]): FolderTree | null {
  for (const node of tree) {
    if (node.id === folderId) {
      return node;
    }
    if (node.children.length > 0) {
      const found = findFolder(folderId, node.children);
      if (found) return found;
    }
  }
  return null;
}

export function validateFolderName(name: string): { isValid: boolean; error?: string } {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'Folder name cannot be empty' };
  }
  
  if (name.length > 50) {
    return { isValid: false, error: 'Folder name must be 50 characters or less' };
  }
  
  // Check for invalid characters
  const invalidChars = /[<>:"/\\|?*]/;
  if (invalidChars.test(name)) {
    return { isValid: false, error: 'Folder name contains invalid characters' };
  }
  
  return { isValid: true };
}
