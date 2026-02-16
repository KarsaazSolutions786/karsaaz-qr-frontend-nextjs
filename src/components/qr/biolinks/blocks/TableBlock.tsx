"use client";

import { useState, useMemo, ChangeEvent } from 'react';
import { BlockEditorProps, TableBlockContent } from '../types';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/table';
import { 
  X, 
  Plus, 
  Trash2, 
  ArrowUpDown, 
  Upload, 
  Download,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ExtendedTableContent extends TableBlockContent {
  enableHeader?: boolean;
  headerBackground?: string;
  headerTextColor?: string;
  cellPadding?: string;
  fontSize?: string;
  textAlign?: 'left' | 'center' | 'right';
  verticalAlign?: 'top' | 'middle' | 'bottom';
  sortable?: boolean;
  sortColumn?: number;
  sortDirection?: 'asc' | 'desc';
}

export default function TableBlock({ block, onUpdate, onDelete, isEditing = false }: BlockEditorProps) {
  const { content, design } = block;
  const tableContent = content as ExtendedTableContent;
  
  const {
    headers = ['Column 1', 'Column 2', 'Column 3'],
    rows = [['', '', ''], ['', '', '']],
    striped = false,
    border = true,
    enableHeader = true,
    headerBackground = '#f3f4f6',
    headerTextColor = '#111827',
    cellPadding = '0.75rem',
    fontSize = '0.875rem',
    textAlign = 'left',
    verticalAlign = 'middle',
    sortable = false,
    sortColumn = -1,
    sortDirection = 'asc'
  } = tableContent;

  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);
  const [editValue, setEditValue] = useState('');

  // Handle cell content change
  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    const newRows = [...rows];
    if (!newRows[rowIndex]) {
      newRows[rowIndex] = [];
    }
    newRows[rowIndex][colIndex] = value;
    
    onUpdate({
      content: {
        ...tableContent,
        rows: newRows
      }
    });
  };

  // Handle header change
  const handleHeaderChange = (colIndex: number, value: string) => {
    const newHeaders = [...headers];
    newHeaders[colIndex] = value;
    
    onUpdate({
      content: {
        ...tableContent,
        headers: newHeaders
      }
    });
  };

  // Add a new row
  const addRow = () => {
    const newRow = new Array(headers.length).fill('');
    onUpdate({
      content: {
        ...tableContent,
        rows: [...rows, newRow]
      }
    });
  };

  // Remove a row
  const removeRow = (rowIndex: number) => {
    if (rows.length <= 1) return;
    
    const newRows = rows.filter((_, index) => index !== rowIndex);
    onUpdate({
      content: {
        ...tableContent,
        rows: newRows
      }
    });
  };

  // Add a new column
  const addColumn = () => {
    const newHeaders = [...headers, `Column ${headers.length + 1}`];
    const newRows = rows.map(row => [...row, '']);
    
    onUpdate({
      content: {
        ...tableContent,
        headers: newHeaders,
        rows: newRows
      }
    });
  };

  // Remove a column
  const removeColumn = (colIndex: number) => {
    if (headers.length <= 1) return;
    
    const newHeaders = headers.filter((_, index) => index !== colIndex);
    const newRows = rows.map(row => row.filter((_, index) => index !== colIndex));
    
    onUpdate({
      content: {
        ...tableContent,
        headers: newHeaders,
        rows: newRows
      }
    });
  };

  // Handle CSV import
  const handleCSVImport = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length === 0) return;
      
      const csvHeaders = lines[0].split(',').map(h => h.trim().replace(/(^"|"$)/g, ''));
      const csvRows = lines.slice(1).map(line => 
        line.split(',').map(cell => cell.trim().replace(/(^"|"$)/g, ''))
      );
      
      onUpdate({
        content: {
          ...tableContent,
          headers: csvHeaders,
          rows: csvRows
        }
      });
    };
    reader.readAsText(file);
  };

  // Handle CSV export
  const handleCSVExport = () => {
    if (enableHeader) {
      var csv = headers.join(',') + '\n';
    } else {
      var csv = '';
    }
    
    rows.forEach(row => {
      csv += row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',') + '\n';
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'table.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Handle column sorting
  const handleSort = (colIndex: number) => {
    if (!sortable) return;
    
    let newDirection: 'asc' | 'desc' = 'asc';
    let newColumn = colIndex;
    
    if (sortColumn === colIndex) {
      newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    }
    
    const sortedRows = [...rows].sort((a, b) => {
      const aVal = a[colIndex] || '';
      const bVal = b[colIndex] || '';
      
      const comparison = aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: 'base' });
      return newDirection === 'asc' ? comparison : -comparison;
    });
    
    onUpdate({
      content: {
        ...tableContent,
        rows: sortedRows,
        sortColumn: newColumn,
        sortDirection: newDirection
      }
    });
  };

  // Handle content changes
  const handleContentChange = (field: string, value: any) => {
    onUpdate({
      content: {
        ...tableContent,
        [field]: value
      }
    });
  };

  // Start editing a cell
  const startEditing = (rowIndex: number, colIndex: number, currentValue: string) => {
    if (!isEditing) return;
    setEditingCell({ row: rowIndex, col: colIndex });
    setEditValue(currentValue);
  };

  // Finish editing a cell
  const finishEditing = () => {
    if (editingCell) {
      handleCellChange(editingCell.row, editingCell.col, editValue);
    }
    setEditingCell(null);
    setEditValue('');
  };

  // Sorted rows for display
  const displayRows = useMemo(() => {
    if (!sortable || sortColumn === -1) return rows;
    
    const sorted = [...rows].sort((a, b) => {
      const aVal = a[sortColumn] || '';
      const bVal = b[sortColumn] || '';
      
      const comparison = aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: 'base' });
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    return sorted;
  }, [rows, sortable, sortColumn, sortDirection]);

  // Render public view
  if (!isEditing) {
    return (
      <div 
        className="block-table"
        style={{ 
          backgroundColor: design.backgroundColor,
          padding: design.padding,
          margin: design.margin,
          borderRadius: design.borderRadius,
          overflowX: 'auto'
        }}
      >
        <Table 
          className={cn(
            border && 'border border-gray-200',
            fontSize === '0.75rem' && 'text-xs',
            fontSize === '0.875rem' && 'text-sm',
            fontSize === '1rem' && 'text-base'
          )}
          style={{ minWidth: '600px' }}
        >
          {enableHeader && (
            <TableHeader>
              <TableRow>
                {headers.map((header, index) => (
                  <TableHead
                    key={index}
                    style={{
                      backgroundColor: headerBackground,
                      color: headerTextColor,
                      padding: cellPadding,
                      textAlign: textAlign,
                      verticalAlign: verticalAlign,
                      fontWeight: '600'
                    }}
                    className={cn(
                      border && 'border border-gray-200'
                    )}
                  >
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
          )}
          <TableBody>
            {displayRows.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                className={cn(
                  striped && rowIndex % 2 === 1 && 'bg-gray-50'
                )}
              >
                {row.map((cell, colIndex) => (
                  <TableCell
                    key={colIndex}
                    style={{
                      padding: cellPadding,
                      textAlign: textAlign,
                      verticalAlign: verticalAlign,
                      color: design.textColor
                    }}
                    className={cn(
                      border && 'border border-gray-200'
                    )}
                  >
                    {cell || '\u00A0'}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  // Render editor interface
  return (
    <div className="block-editor-table space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Table Block</h3>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <X size={16} />
        </Button>
      </div>

      {/* Table Controls */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Button onClick={addRow} size="sm" variant="outline">
          <Plus size={16} className="mr-1" />
          Add Row
        </Button>
        <Button onClick={addColumn} size="sm" variant="outline">
          <Plus size={16} className="mr-1" />
          Add Column
        </Button>
        <input
          type="file"
          accept=".csv"
          onChange={handleCSVImport}
          className="hidden"
          id="csv-import"
        />
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => document.getElementById('csv-import')?.click()}
        >
          <Upload size={16} className="mr-1" />
          Import CSV
        </Button>
        <Button onClick={handleCSVExport} size="sm" variant="outline">
          <Download size={16} className="mr-1" />
          Export CSV
        </Button>
      </div>

      {/* Table Display */}
      <div className="overflow-x-auto border rounded-lg">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              {headers.map((header, index) => (
                <TableHead 
                  key={index}
                  style={{
                    backgroundColor: headerBackground,
                    color: headerTextColor,
                    padding: cellPadding
                  }}
                  className="border border-gray-200 relative"
                >
                  <Input
                    value={header}
                    onChange={(e) => handleHeaderChange(index, e.target.value)}
                    className="font-semibold bg-transparent border-none p-0 focus:ring-0"
                    style={{ color: headerTextColor }}
                  />
                  {headers.length > 1 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-0 right-0 h-6 w-6 p-0"
                      onClick={() => removeColumn(index)}
                    >
                      <X size={12} />
                    </Button>
                  )}
                </TableHead>
              ))}
              <TableHead className="w-12 border border-gray-200 bg-gray-50" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                className={cn(striped && rowIndex % 2 === 1 && 'bg-gray-50')}
              >
                {row.map((cell, colIndex) => (
                  <TableCell 
                    key={colIndex}
                    className="border border-gray-200 p-0"
                    onClick={() => startEditing(rowIndex, colIndex, cell)}
                  >
                    {editingCell?.row === rowIndex && editingCell?.col === colIndex ? (
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={finishEditing}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            finishEditing();
                          } else if (e.key === 'Escape') {
                            setEditingCell(null);
                            setEditValue('');
                          }
                        }}
                        className="border-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                    ) : (
                      <div className="px-3 py-2 min-h-10 cursor-text hover:bg-gray-50">
                        {cell || '\u00A0'}
                      </div>
                    )}
                  </TableCell>
                ))}
                <TableCell className="border border-gray-200 p-1 w-12">
                  {rows.length > 1 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() => removeRow(rowIndex)}
                    >
                      <Trash2 size={14} className="text-red-500" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Table Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Display Options */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-gray-700">Display Options</h4>
          
          <div className="flex items-center space-x-2">
            <Switch
              checked={enableHeader}
              onCheckedChange={(checked) => handleContentChange('enableHeader', checked)}
            />
            <Label>Enable Header Row</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={striped}
              onCheckedChange={(checked) => handleContentChange('striped', checked)}
            />
            <Label>Striped Rows</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={border}
              onCheckedChange={(checked) => handleContentChange('border', checked)}
            />
            <Label>Table Borders</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={sortable}
              onCheckedChange={(checked) => handleContentChange('sortable', checked)}
            />
            <Label>Sortable Columns</Label>
          </div>
        </div>

        {/* Styling Options */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-gray-700">Styling</h4>

          <div>
            <Label>Font Size</Label>
            <Select
              value={fontSize}
              onValueChange={(value) => handleContentChange('fontSize', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.75rem">Extra Small (12px)</SelectItem>
                <SelectItem value="0.875rem">Small (14px)</SelectItem>
                <SelectItem value="1rem">Medium (16px)</SelectItem>
                <SelectItem value="1.125rem">Large (18px)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Text Alignment</Label>
            <Select
              value={textAlign}
              onValueChange={(value) => handleContentChange('textAlign', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Cell Padding</Label>
            <Select
              value={cellPadding}
              onValueChange={(value) => handleContentChange('cellPadding', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.25rem">Small</SelectItem>
                <SelectItem value="0.5rem">Medium</SelectItem>
                <SelectItem value="0.75rem">Large</SelectItem>
                <SelectItem value="1rem">Extra Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Header Styling */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-gray-700">Header Styling</h4>

          <div>
            <Label>Header Background Color</Label>
            <Input
              type="color"
              value={headerBackground}
              onChange={(e) => handleContentChange('headerBackground', e.target.value)}
              className="h-10 w-full"
            />
          </div>

          <div>
            <Label>Header Text Color</Label>
            <Input
              type="color"
              value={headerTextColor}
              onChange={(e) => handleContentChange('headerTextColor', e.target.value)}
              className="h-10 w-full"
            />
          </div>
        </div>

        {/* Current Status */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-gray-700">Table Info</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>Rows: {rows.length}</p>
            <p>Columns: {headers.length}</p>
            <p>Click any cell to edit</p>
          </div>
        </div>
      </div>
    </div>
  );
}
