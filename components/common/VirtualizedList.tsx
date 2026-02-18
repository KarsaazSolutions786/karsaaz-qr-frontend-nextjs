/**
 * VirtualizedList Component
 * 
 * Virtualized list using react-window for large datasets.
 */

'use client';

import React, { useCallback } from 'react';
import { FixedSizeList, VariableSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

export interface VirtualizedListProps<T> {
  items: T[];
  itemHeight?: number | ((index: number) => number);
  renderItem: (item: T, index: number, style: React.CSSProperties) => React.ReactNode;
  height?: number;
  width?: string | number;
  overscanCount?: number;
  className?: string;
}

export function VirtualizedList<T>({
  items,
  itemHeight = 80,
  renderItem,
  height = 600,
  width = '100%',
  overscanCount = 5,
  className = '',
}: VirtualizedListProps<T>) {
  const isVariableHeight = typeof itemHeight === 'function';
  
  const Row = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const item = items[index];
    if (!item) return null;
    
    return (
      <div style={style}>
        {renderItem(item, index, style)}
      </div>
    );
  }, [items, renderItem]);
  
  if (items.length === 0) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height }}>
        <p className="text-gray-500">No items to display</p>
      </div>
    );
  }
  
  if (isVariableHeight) {
    return (
      <div className={className} style={{ height, width }}>
        <AutoSizer>
          {({ height: autoHeight, width: autoWidth }) => (
            <VariableSizeList
              height={autoHeight}
              width={autoWidth}
              itemCount={items.length}
              itemSize={itemHeight as (index: number) => number}
              overscanCount={overscanCount}
            >
              {Row}
            </VariableSizeList>
          )}
        </AutoSizer>
      </div>
    );
  }
  
  return (
    <div className={className} style={{ height, width }}>
      <AutoSizer>
        {({ height: autoHeight, width: autoWidth }) => (
          <FixedSizeList
            height={autoHeight}
            width={autoWidth}
            itemCount={items.length}
            itemSize={itemHeight as number}
            overscanCount={overscanCount}
          >
            {Row}
          </FixedSizeList>
        )}
      </AutoSizer>
    </div>
  );
}

/**
 * VirtualizedGrid Component
 * 
 * Virtualized grid layout for large datasets.
 */
export interface VirtualizedGridProps<T> {
  items: T[];
  columnCount?: number;
  rowHeight?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  height?: number;
  gap?: number;
  className?: string;
}

export function VirtualizedGrid<T>({
  items,
  columnCount = 3,
  rowHeight = 200,
  renderItem,
  height = 600,
  gap = 16,
  className = '',
}: VirtualizedGridProps<T>) {
  const rowCount = Math.ceil(items.length / columnCount);
  
  const Row = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const startIndex = index * columnCount;
    const rowItems = items.slice(startIndex, startIndex + columnCount);
    
    return (
      <div className="flex" style={{ ...style, gap }}>
        {rowItems.map((item, i) => {
          const itemIndex = startIndex + i;
          return (
            <div
              key={itemIndex}
              style={{ flex: `0 0 calc((100% - ${gap * (columnCount - 1)}px) / ${columnCount})` }}
            >
              {renderItem(item, itemIndex)}
            </div>
          );
        })}
      </div>
    );
  }, [items, columnCount, renderItem, gap]);
  
  if (items.length === 0) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height }}>
        <p className="text-gray-500">No items to display</p>
      </div>
    );
  }
  
  return (
    <div className={className} style={{ height, width: '100%' }}>
      <AutoSizer>
        {({ height: autoHeight, width: autoWidth }) => (
          <FixedSizeList
            height={autoHeight}
            width={autoWidth}
            itemCount={rowCount}
            itemSize={rowHeight + gap}
            overscanCount={2}
          >
            {Row}
          </FixedSizeList>
        )}
      </AutoSizer>
    </div>
  );
}

/**
 * VirtualizedTable Component
 * 
 * Virtualized table for large datasets with sticky header.
 */
export interface VirtualizedTableProps<T> {
  items: T[];
  columns: Array<{
    key: string;
    label: string;
    width?: number;
    render?: (item: T, index: number) => React.ReactNode;
  }>;
  rowHeight?: number;
  height?: number;
  className?: string;
  onRowClick?: (item: T, index: number) => void;
}

export function VirtualizedTable<T extends Record<string, any>>({
  items,
  columns,
  rowHeight = 60,
  height = 600,
  className = '',
  onRowClick,
}: VirtualizedTableProps<T>) {
  const Row = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const item = items[index];
    if (!item) return null;
    
    return (
      <div
        style={style}
        className={`flex items-center border-b border-gray-200 ${
          onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''
        }`}
        onClick={() => onRowClick?.(item, index)}
      >
        {columns.map((column) => (
          <div
            key={column.key}
            className="px-4 overflow-hidden text-ellipsis whitespace-nowrap"
            style={{ width: column.width || 'auto', flex: column.width ? undefined : 1 }}
          >
            {column.render ? column.render(item, index) : item[column.key]}
          </div>
        ))}
      </div>
    );
  }, [items, columns, onRowClick]);
  
  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center bg-gray-50 border-b border-gray-200 font-medium text-gray-700">
        {columns.map((column) => (
          <div
            key={column.key}
            className="px-4 py-3 overflow-hidden text-ellipsis whitespace-nowrap"
            style={{ width: column.width || 'auto', flex: column.width ? undefined : 1 }}
          >
            {column.label}
          </div>
        ))}
      </div>
      
      {/* Virtualized Rows */}
      <div style={{ height }}>
        <AutoSizer>
          {({ height: autoHeight, width: autoWidth }) => (
            <FixedSizeList
              height={autoHeight}
              width={autoWidth}
              itemCount={items.length}
              itemSize={rowHeight}
              overscanCount={5}
            >
              {Row}
            </FixedSizeList>
          )}
        </AutoSizer>
      </div>
    </div>
  );
}
