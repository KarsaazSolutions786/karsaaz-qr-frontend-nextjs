/**
 * useMultiSelect Hook
 * 
 * Hook for managing multi-select state for QR codes.
 */

'use client';

import { useState, useCallback, useMemo } from 'react';

export interface MultiSelectOptions {
  selectAllOnMount?: boolean;
  maxSelection?: number;
  onSelectionChange?: (selectedIds: string[]) => void;
}

export function useMultiSelect<T extends { id: string }>(
  items: T[] = [], // Add default empty array
  options: MultiSelectOptions = {}
) {
  const { selectAllOnMount = false, maxSelection, onSelectionChange } = options;
  
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => selectAllOnMount && items ? new Set(items.map(item => item.id)) : new Set()
  );
  
  // Get selected items
  const selectedItems = useMemo(
    () => items ? items.filter(item => selectedIds.has(item.id)) : [],
    [items, selectedIds]
  );
  
  // Selection count
  const selectedCount = selectedIds.size;
  
  // Check if all items are selected
  const isAllSelected = useMemo(
    () => items.length > 0 && selectedIds.size === items.length,
    [items.length, selectedIds.size]
  );
  
  // Check if some (but not all) items are selected
  const isSomeSelected = useMemo(
    () => selectedIds.size > 0 && selectedIds.size < items.length,
    [items.length, selectedIds.size]
  );
  
  // Check if specific item is selected
  const isSelected = useCallback(
    (id: string) => selectedIds.has(id),
    [selectedIds]
  );
  
  // Toggle single item
  const toggleItem = useCallback(
    (id: string) => {
      setSelectedIds(prev => {
        const newSet = new Set(prev);
        
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          // Check max selection limit
          if (maxSelection && newSet.size >= maxSelection) {
            return prev; // Don't add if at limit
          }
          newSet.add(id);
        }
        
        const newIds = Array.from(newSet);
        onSelectionChange?.(newIds);
        return newSet;
      });
    },
    [maxSelection, onSelectionChange]
  );
  
  // Select single item
  const selectItem = useCallback(
    (id: string) => {
      setSelectedIds(prev => {
        if (prev.has(id)) return prev;
        
        // Check max selection limit
        if (maxSelection && prev.size >= maxSelection) {
          return prev;
        }
        
        const newSet = new Set(prev);
        newSet.add(id);
        
        const newIds = Array.from(newSet);
        onSelectionChange?.(newIds);
        return newSet;
      });
    },
    [maxSelection, onSelectionChange]
  );
  
  // Deselect single item
  const deselectItem = useCallback(
    (id: string) => {
      setSelectedIds(prev => {
        if (!prev.has(id)) return prev;
        
        const newSet = new Set(prev);
        newSet.delete(id);
        
        const newIds = Array.from(newSet);
        onSelectionChange?.(newIds);
        return newSet;
      });
    },
    [onSelectionChange]
  );
  
  // Select multiple items
  const selectItems = useCallback(
    (ids: string[]) => {
      setSelectedIds(prev => {
        const newSet = new Set(prev);
        
        for (const id of ids) {
          // Check max selection limit
          if (maxSelection && newSet.size >= maxSelection) {
            break;
          }
          newSet.add(id);
        }
        
        const newIds = Array.from(newSet);
        onSelectionChange?.(newIds);
        return newSet;
      });
    },
    [maxSelection, onSelectionChange]
  );
  
  // Deselect multiple items
  const deselectItems = useCallback(
    (ids: string[]) => {
      setSelectedIds(prev => {
        const newSet = new Set(prev);
        
        for (const id of ids) {
          newSet.delete(id);
        }
        
        const newIds = Array.from(newSet);
        onSelectionChange?.(newIds);
        return newSet;
      });
    },
    [onSelectionChange]
  );
  
  // Select all items
  const selectAll = useCallback(() => {
    setSelectedIds(() => {
      const itemsToSelect = maxSelection
        ? items.slice(0, maxSelection)
        : items;
      
      const newSet = new Set(itemsToSelect.map(item => item.id));
      const newIds = Array.from(newSet);
      onSelectionChange?.(newIds);
      return newSet;
    });
  }, [items, maxSelection, onSelectionChange]);
  
  // Deselect all items
  const deselectAll = useCallback(() => {
    setSelectedIds(() => {
      onSelectionChange?.([]);
      return new Set();
    });
  }, [onSelectionChange]);
  
  // Toggle all items
  const toggleAll = useCallback(() => {
    if (isAllSelected) {
      deselectAll();
    } else {
      selectAll();
    }
  }, [isAllSelected, selectAll, deselectAll]);
  
  // Select range (for shift-click)
  const selectRange = useCallback(
    (startId: string, endId: string) => {
      const startIndex = items.findIndex(item => item.id === startId);
      const endIndex = items.findIndex(item => item.id === endId);
      
      if (startIndex === -1 || endIndex === -1) return;
      
      const start = Math.min(startIndex, endIndex);
      const end = Math.max(startIndex, endIndex);
      
      const rangeIds = items.slice(start, end + 1).map(item => item.id);
      selectItems(rangeIds);
    },
    [items, selectItems]
  );
  
  // Invert selection
  const invertSelection = useCallback(() => {
    setSelectedIds(prev => {
      const newSet = new Set<string>();
      
      for (const item of items) {
        if (!prev.has(item.id)) {
          // Check max selection limit
          if (maxSelection && newSet.size >= maxSelection) {
            break;
          }
          newSet.add(item.id);
        }
      }
      
      const newIds = Array.from(newSet);
      onSelectionChange?.(newIds);
      return newSet;
    });
  }, [items, maxSelection, onSelectionChange]);
  
  // Clear selection
  const clear = deselectAll;
  
  return {
    // State
    selectedIds: Array.from(selectedIds),
    selectedItems,
    selectedCount,
    isAllSelected,
    isSomeSelected,
    
    // Item checks
    isSelected,
    
    // Single item actions
    toggleItem,
    selectItem,
    deselectItem,
    
    // Multiple item actions
    selectItems,
    deselectItems,
    selectAll,
    deselectAll,
    toggleAll,
    selectRange,
    invertSelection,
    clear,
  };
}

/**
 * useMultiSelectWithKeyboard Hook
 * 
 * Enhanced multi-select with keyboard support (Ctrl/Cmd, Shift).
 */
export function useMultiSelectWithKeyboard<T extends { id: string }>(
  items: T[],
  options: MultiSelectOptions = {}
) {
  const multiSelect = useMultiSelect(items, options);
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);
  
  // Handle item click with keyboard modifiers
  const handleItemClick = useCallback(
    (id: string, event?: React.MouseEvent) => {
      const isCtrlOrCmd = event?.ctrlKey || event?.metaKey;
      const isShift = event?.shiftKey;
      
      if (isShift && lastSelectedId) {
        // Shift-click: select range
        multiSelect.selectRange(lastSelectedId, id);
      } else if (isCtrlOrCmd) {
        // Ctrl/Cmd-click: toggle single item
        multiSelect.toggleItem(id);
      } else {
        // Regular click: select only this item
        multiSelect.deselectAll();
        multiSelect.selectItem(id);
      }
      
      setLastSelectedId(id);
    },
    [lastSelectedId, multiSelect]
  );
  
  return {
    ...multiSelect,
    handleItemClick,
    lastSelectedId,
  };
}
