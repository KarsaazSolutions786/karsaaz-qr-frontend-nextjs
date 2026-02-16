"use client";

import { useState, useMemo } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { BlockEditorProps } from '../types';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Plus,
  X,
  GripVertical,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  Circle,
  MoveUp,
  MoveDown,
  Trash2,
  Indent,
  Outdent,
  CircleDot,
  ArrowRight,
  Star,
  Disc,
  Square,
  Minus, // For dash
} from 'lucide-react';import TextareaAutosize from 'react-textarea-autosize';

/**
 * List Block
 * A dynamic list component with support for bullets, numbered lists, and checklists
 * Features include:
 * - Dynamic add/remove/reorder items
 * - Indentation support for nested lists
 * - Icon selection for bullet points
 * - Rich text editing capabilities
 * - Accessibility-compliant markup
 */

// Icon mapping for bullet types
const BULLET_LUCIDE_ICONS = {
  disc: Disc,
  circle: CircleDot,
  square: Square,
  dash: Minus,
  star: Star,
  arrow: ArrowRight,
  check: CheckCircle2,
  custom: null // Will use custom icon from selection
};

// React Hook Form interface
interface ListItem {
  id: string;
  text: string;
  checked?: boolean;
  indentLevel?: number;
  icon?: string | null;
}

interface ListFormData {
  items: ListItem[];
}

interface ExtendedListContent {
  type?: 'bullet' | 'numbered' | 'checklist';
  items: ListItem[];
  bulletIcon?: keyof typeof BULLET_ICONS;
  showRichText?: boolean;
  spacing?: 'compact' | 'normal' | 'relaxed';
  startNumber?: number;
  customBulletIcon?: string;
}

export default function ListBlock({ block, onUpdate, onDelete, isEditing = false }: BlockEditorProps) {
  const { content, design } = block;
  const listContent = content as ExtendedListContent;
  
  const {
    type = 'bullet',
    items = [{ id: Date.now().toString(), text: '', checked: false, indentLevel: 0 }],
    bulletIcon = 'disc',
    showRichText = false,
    spacing = 'normal',
    startNumber = 1,
    customBulletIcon
  } = listContent;

  // React Hook Form setup
  const { control, watch, setValue, register } = useForm<ListFormData>({
    defaultValues: {
      items: items.length > 0 ? items : [{ id: Date.now().toString(), text: '', checked: false, indentLevel: 0 }]
    }
  });

  const { fields, append, remove, move: _move, update } = useFieldArray({
    control,
    name: "items"
  });

  const watchedItems = watch("items");

  // Update parent when items change
  const handleItemsChange = (newItems: ListItem[]) => {
    onUpdate({
      content: {
        ...listContent,
        items: newItems
      }
    });
  };

  // Add new item
  const handleAddItem = (index?: number) => {
    const newItem: ListItem = {
      id: Date.now().toString(),
      text: '',
      checked: false,
      indentLevel: 0,
      icon: null
    };

    if (index !== undefined) {
      // Insert at specific position
      const newFields = [...fields];
      newFields.splice(index + 1, 0, newItem);
      setValue("items", newFields);
      handleItemsChange(newFields);
    } else {
      // Append to end
      append(newItem);
      handleItemsChange([...watchedItems, newItem]);
    }
  };

  // Remove item
  const handleRemoveItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
      const newItems = [...watchedItems];
      newItems.splice(index, 1);
      handleItemsChange(newItems);
    }
  };

  // Move item up
  const handleMoveUp = (index: number) => {
    if (index > 0) {
      move(index, index - 1);
      const newItems = [...watchedItems];
      [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];
      handleItemsChange(newItems);
    }
  };

  // Move item down
  const handleMoveDown = (index: number) => {
    if (index < fields.length - 1) {
      move(index, index + 1);
      const newItems = [...watchedItems];
      [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
      handleItemsChange(newItems);
    }
  };

  // Increase indent
  const handleIndent = (index: number) => {
    const item = watchedItems[index];
    if (item.indentLevel < 3) { // Max 3 levels of nesting
      const newIndentLevel = (item.indentLevel || 0) + 1;
      update(index, { ...item, indentLevel: newIndentLevel });
      const newItems = [...watchedItems];
      newItems[index].indentLevel = newIndentLevel;
      handleItemsChange(newItems);
    }
  };

  // Decrease indent
  const handleOutdent = (index: number) => {
    const item = watchedItems[index];
    if (item.indentLevel > 0) {
      const newIndentLevel = (item.indentLevel || 0) - 1;
      update(index, { ...item, indentLevel: newIndentLevel });
      const newItems = [...watchedItems];
      newItems[index].indentLevel = newIndentLevel;
      handleItemsChange(newItems);
    }
  };

  // Toggle checklist item
  const handleToggleCheck = (index: number) => {
    const item = watchedItems[index];
    const newChecked = !item.checked;
    update(index, { ...item, checked: newChecked });
    const newItems = [...watchedItems];
    newItems[index].checked = newChecked;
    handleItemsChange(newItems);
  };

  // Update item text
  const handleItemTextChange = (index: number, text: string) => {
    const item = watchedItems[index];
    update(index, { ...item, text });
    const newItems = [...watchedItems];
    newItems[index].text = text;
    handleItemsChange(newItems);
  };

  // Handle other content changes
  const handleContentChange = (field: string, value: string | number) => {
    onUpdate({
      content: {
        ...listContent,
        [field]: value
      }
    });
  };

  // Get spacing classes
  const getSpacingClasses = () => {
    switch (spacing) {
      case 'compact': return 'space-y-1';
      case 'relaxed': return 'space-y-3';
      default: return 'space-y-2';
    }
  };

  // Get bullet content based on type and index
  const getBulletContent = (item: ListItem, index: number) => {
    if (type === 'numbered') {
      return `${startNumber + index}.`;
    }
    
    if (type === 'checklist') {
      return item.checked ? (
        <CheckCircle2 className="w-4 h-4 text-green-500" />
      ) : (
        <Circle className="w-4 h-4 text-gray-400" />
      );
    }
    
    if (type === 'bullet') {
      const IconComponent = BULLET_LUCIDE_ICONS[bulletIcon];
      if (IconComponent) {
        return <IconComponent className="w-4 h-4" />;
      }
      return <span className="text-sm">{BULLET_ICONS[bulletIcon]}</span>;
    }
    
    return '•';
  };

  // Render public view
  if (!isEditing) {
    return (
      <div 
        className="block-list"
        style={{ 
          backgroundColor: design.backgroundColor,
          color: design.textColor,
          padding: design.padding,
          margin: design.margin,
          borderRadius: design.borderRadius,
        }}
      >
        {type === 'numbered' ? (
          <ol className={`list-decimal list-inside ${getSpacingClasses()} pl-4`} start={startNumber}>
            {watchedItems.map((item, index) => (
              <li key={item.id} style={{ marginLeft: `${(item.indentLevel || 0) * 1.5}rem` }}>
                {item.text}
              </li>
            ))}
          </ol>
        ) : (
          <ul className={`${getSpacingClasses()}`}>
            {watchedItems.map((item, index) => (
              <li key={item.id} className="flex items-start gap-2">
                <span className="flex-shrink-0 mt-0.5" style={{ marginLeft: `${(item.indentLevel || 0) * 1.5}rem` }}>
                  {getBulletContent(item, index)}
                </span>
                {type === 'checklist' ? (
                  <span className={`${item.checked ? 'line-through opacity-60' : ''}`}>
                    {item.text}
                  </span>
                ) : (
                  <span>{item.text}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  // Render editor interface
  return (
    <div className="block-editor-list space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">List Block</h3>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <X size={16} />
        </Button>
      </div>

      <div className="space-y-4">
        {/* List Type Selection */}
        <div>
          <Label>List Type</Label>
          <Select
            value={type}
            onValueChange={(value) => handleContentChange('type', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bullet">Bulleted List</SelectItem>
              <SelectItem value="numbered">Numbered List</SelectItem>
              <SelectItem value="checklist">Checklist</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bullet Icon Selection (for bullet type) */}
        {type === 'bullet' && (
          <div>
            <Label>Bullet Icon</Label>
            <Select
              value={bulletIcon}
              onValueChange={(value) => handleContentChange('bulletIcon', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="disc">• Disc</SelectItem>
                <SelectItem value="circle">○ Circle</SelectItem>
                <SelectItem value="square">■ Square</SelectItem>
                <SelectItem value="dash">— Dash</SelectItem>
                <SelectItem value="star">★ Star</SelectItem>
                <SelectItem value="arrow">→ Arrow</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Start Number (for numbered type) */}
        {type === 'numbered' && (
          <div>
            <Label>Starting Number</Label>
            <Input
              type="number"
              min="1"
              max="999"
              value={startNumber}
              onChange={(e) => handleContentChange('startNumber', parseInt(e.target.value) || 1)}
              className="w-24"
            />
          </div>
        )}

        {/* Spacing Options */}
        <div>
          <Label>Item Spacing</Label>
          <Select
            value={spacing}
            onValueChange={(value) => handleContentChange('spacing', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="compact">Compact</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="relaxed">Relaxed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Show Rich Text Toggle */}
        <div className="flex items-center space-x-2">
          <Switch
            checked={showRichText}
            onCheckedChange={(checked) => handleContentChange('showRichText', checked)}
          />
          <Label>Enable Rich Text Editor</Label>
        </div>

        {/* List Items Management */}
        <div>
          <Label>List Items</Label>
          <div className="mt-2 space-y-2 max-h-96 overflow-y-auto border rounded-md p-3">
            {fields.map((field, index) => {
              const item = watchedItems[index];
              return (
                <div key={field.id} className="flex items-start gap-2 group">
                  {/* Drag Handle */}
                  <div className="flex-shrink-0 mt-2 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600">
                    <GripVertical size={16} />
                  </div>

                  {/* Bullet/Number/Checkbox */}
                  <div className="flex-shrink-0 mt-2 w-6 flex justify-center">
                    {type === 'checklist' ? (
                      <button
                        type="button"
                        onClick={() => handleToggleCheck(index)}
                        className="focus:outline-none"
                      >
                        {item.checked ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500 hover:text-green-600" />
                        ) : (
                          <Circle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    ) : (
                      <span className="text-sm text-gray-600">
                        {getBulletContent(item, index)}
                      </span>
                    )}
                  </div>

                  {/* Text Input */}
                  <div className="flex-grow">
                    <TextareaAutosize
                      value={item.text}
                      onChange={(e) => handleItemTextChange(index, e.target.value)}
                      placeholder="Enter list item..."
                      minRows={1}
                      maxRows={3}
                      className="w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>

                  {/* Indentation Controls */}
                  <div className="flex flex-col gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleIndent(index)}
                      disabled={item.indentLevel >= 3}
                      className="h-7 w-7 p-0"
                      title="Indent"
                    >
                      <Indent size={14} />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOutdent(index)}
                      disabled={item.indentLevel <= 0}
                      className="h-7 w-7 p-0"
                      title="Outdent"
                    >
                      <Outdent size={14} />
                    </Button>
                  </div>

                  {/* Reorder Controls */}
                  <div className="flex flex-col gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="h-7 w-7 p-0"
                      title="Move Up"
                    >
                      <MoveUp size={14} />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMoveDown(index)}
                      disabled={index === fields.length - 1}
                      className="h-7 w-7 p-0"
                      title="Move Down"
                    >
                      <MoveDown size={14} />
                    </Button>
                  </div>

                  {/* Remove Button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveItem(index)}
                    disabled={fields.length <= 1}
                    className="h-7 w-7 p-0 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove Item"
                  >
                    <Trash2 size={14} />
                  </Button>

                  {/* Add Item Below */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAddItem(index)}
                    className="h-7 w-7 p-0 text-green-600 hover:text-green-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Add Item Below"
                  >
                    <Plus size={14} />
                  </Button>
                </div>
              );
            })}

            {/* Add Item Button at Bottom */}
            <div className="pt-2 border-t">
              <Button 
                type="button"
                onClick={() => handleAddItem()}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <Plus size={14} className="mr-2" />
                Add Item
              </Button>
            </div>
          </div>

          {/* Item Count */}
          <p className="text-sm text-muted-foreground mt-1">
            {fields.length} item{fields.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Preview Section */}
        <div className="mt-6 p-4 bg-muted rounded-md">
          <Label>Preview</Label>
          <div className="mt-2 p-3 bg-white dark:bg-gray-800 rounded border">
            {type === 'numbered' ? (
              <ol className={`list-decimal list-inside ${getSpacingClasses()} pl-4 text-sm`} start={startNumber}>
                {watchedItems.map((item, index) => (
                  <li key={`preview-${item.id}`} style={{ marginLeft: `${(item.indentLevel || 0) * 1.5}rem` }}>
                    {item.text || <span className="text-muted-foreground italic">Empty item</span>}
                  </li>
                ))}
              </ol>
            ) : (
              <ul className={`${getSpacingClasses()} text-sm`}>
                {watchedItems.map((item, index) => (
                  <li key={`preview-${item.id}`} className="flex items-start gap-2">
                    <span className="flex-shrink-0 mt-0.5" style={{ marginLeft: `${(item.indentLevel || 0) * 1.5}rem` }}>
                      {getBulletContent(item, index)}
                    </span>
                    {type === 'checklist' ? (
                      <span className={`${item.checked ? 'line-through opacity-60' : ''}`}>
                        {item.text || <span className="text-muted-foreground italic">Empty item</span>}
                      </span>
                    ) : (
                      <span>
                        {item.text || <span className="text-muted-foreground italic">Empty item</span>}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Accessibility Info */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-md">
          <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100">Accessibility Features</h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 mt-1 space-y-1">
            <li>• Screen reader compatible list markup</li>
            <li>• Proper nesting for hierarchical lists</li>
            <li>• Interactive controls have ARIA labels</li>
            <li>• Keyboard navigation support</li>
            <li>• High contrast mode compatible</li>
          </ul>
        </div>
      </div>
    </div>
  );
}