'use client';

import { useState, useCallback, useMemo } from 'react';

export interface MultiSelectOptions {
  selectAllOnMount?: boolean;
  maxSelection?: number;
  onSelectionChange?: (selectedIds: string[]) => void;
}

export function useMultiSelect<T extends { id: string }>(
  items: T[] = [],
  options: MultiSelectOptions = {}
) {
  const { selectAllOnMount = false, maxSelection, onSelectionChange } = options;
  
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => selectAllOnMount && items ? new Set(items.map(item => item.id)) : new Set()
  );
  
  const selectedItems = useMemo(
    () => items ? items.filter(item => selectedIds.has(item.id)) : [],
    [items, selectedIds]
  );
  
  const selectedCount = selectedIds.size;
  
  const isAllSelected = useMemo(
    () => items.length > 0 && selectedIds.size === items.length,
    [items.length, selectedIds.size]
  );
  
  const isSomeSelected = useMemo(
    () => selectedIds.size > 0 && selectedIds.size < items.length,
    [items.length, selectedIds.size]
  );
  
  const isSelected = useCallback(
    (id: string) => selectedIds.has(id),
    [selectedIds]
  );
  
  const toggleItem = useCallback(
    (id: string) => {
      setSelectedIds(prev => {
        const newSet = new Set(prev);
        
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          if (maxSelection && newSet.size >= maxSelection) {
            return prev;
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
  
  const selectItem = useCallback(
    (id: string) => {
      setSelectedIds(prev => {
        if (prev.has(id)) return prev;
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
  
  const selectItems = useCallback(
    (ids: string[]) => {
      setSelectedIds(prev => {
        const newSet = new Set(prev);
        
        for (const id of ids) {
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
  
  const deselectAll = useCallback(() => {
    setSelectedIds(() => {
      onSelectionChange?.([]);
      return new Set();
    });
  }, [onSelectionChange]);
  
  const toggleAll = useCallback(() => {
    if (isAllSelected) {
      deselectAll();
    } else {
      selectAll();
    }
  }, [isAllSelected, selectAll, deselectAll]);
  
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
  
  const invertSelection = useCallback(() => {
    setSelectedIds(prev => {
      const newSet = new Set<string>();
      
      for (const item of items) {
        if (!prev.has(item.id)) {
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
  
  const clear = deselectAll;
  
  return {
    selectedIds: Array.from(selectedIds),
    selectedItems,
    selectedCount,
    isAllSelected,
    isSomeSelected,
    
    isSelected,
    toggleItem,
    selectItem,
    deselectItem,
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


export function useMultiSelectWithKeyboard<T extends { id: string }>(
  items: T[],
  options: MultiSelectOptions = {}
) {
  const multiSelect = useMultiSelect(items, options);
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);
  const handleItemClick = useCallback(
    (id: string, event?: React.MouseEvent) => {
      const isCtrlOrCmd = event?.ctrlKey || event?.metaKey;
      const isShift = event?.shiftKey;
      
      if (isShift && lastSelectedId) {
        multiSelect.selectRange(lastSelectedId, id);
      } else if (isCtrlOrCmd) {
        multiSelect.toggleItem(id);
      } else {
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
