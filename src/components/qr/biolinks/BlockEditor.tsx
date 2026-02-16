"use client";

import { useState, useCallback } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { Block, BiolinkPage } from './types';
import { blockRegistry, createBlock, getBlocksForMenu } from './block-registry';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Eye, EyeOff, Trash2, Settings, Save, Layout } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/**
 * Block Editor
 * Main component for managing and editing biolink blocks
 */

interface BlockEditorProps {
  page: BiolinkPage;
  onSave: (page: BiolinkPage) => void;
  isLoading?: boolean;
}

export default function BlockEditor({ page, onSave, isLoading = false }: BlockEditorProps) {
  const [blocks, setBlocks] = useState<Block[]>(page.blocks || []);
  const [activeBlock, setActiveBlock] = useState<Block | null>(null);
  const [editingBlock, setEditingBlock] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Handle drag start
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const block = blocks.find(b => b.id === active.id);
    if (block) {
      setActiveBlock(block);
    }
  }, [blocks]);

  // Handle drag end (reorder)
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex(b => b.id === active.id);
      const newIndex = blocks.findIndex(b => b.id === over.id);

      const newBlocks = arrayMove(blocks, oldIndex, newIndex).map((block, index) => ({
        ...block,
        settings: {
          ...block.settings,
          order: index
        }
      }));

      setBlocks(newBlocks);
    }

    setActiveBlock(null);
  }, [blocks]);

  // Add new block
  const handleAddBlock = (type: string) => {
    const newBlock = createBlock(type);
    newBlock.settings.order = blocks.length;
    
    setBlocks([...blocks, newBlock]);
    setEditingBlock(newBlock.id); // Open editor for new block
  };

  // Update block
  const handleUpdateBlock = (blockId: string, updates: Partial<Block>) => {
    setBlocks(blocks.map(block => 
      block.id === blockId ? { ...block, ...updates } : block
    ));
  };

  // Delete block
  const handleDeleteBlock = (blockId: string) => {
    setBlocks(blocks.filter(block => block.id !== blockId));
    if (editingBlock === blockId) {
      setEditingBlock(null);
    }
  };

  // Toggle block visibility
  const handleToggleVisibility = (blockId: string) => {
    setBlocks(blocks.map(block => 
      block.id === blockId 
        ? { ...block, settings: { ...block.settings, visible: !block.settings.visible } }
        : block
    ));
  };

  // Save changes
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedPage = {
        ...page,
        blocks: blocks
      };
      await onSave(updatedPage);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Get the block component for rendering
  const renderBlock = (block: Block) => {
    const config = blockRegistry.find(b => b.type === block.type);
    if (!config) {
      return <div>Unknown block type: {block.type}</div>;
    }

    const BlockComponent = config.component;
    
    return (
      <BlockComponent
        key={block.id}
        block={block}
        onUpdate={(updates) => handleUpdateBlock(block.id, updates)}
        onDelete={() => handleDeleteBlock(block.id)}
        isEditing={editingBlock === block.id}
      />
    );
  };

  // Filter visible blocks for preview
  const visibleBlocks = blocks.filter(block => block.settings.visible);

  return (
    <div className="biolink-block-editor space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          <Layout className="inline-block mr-2" size={24} />
          Edit Blocks
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {visibleBlocks.length} visible • {blocks.length} total
          </span>
          <Button onClick={handleSave} disabled={isSaving || isLoading}>
            {isSaving ? (
              <>
                <div className="animate-spin mr-2">⏳</div>
                Saving...
              </>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Instructions */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Layout size={16} />
              Drag blocks to reorder
            </div>
            <div className="flex items-center gap-2">
              <Eye size={16} />
              Click eye to hide/show
            </div>
            <div className="flex items-center gap-2">
              <Settings size={16} />
              Click block to edit
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Block Button */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="w-full">
            <Plus size={16} className="mr-2" />
            Add Block
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 max-h-96 overflow-y-auto">
          {getBlocksForMenu().map(blockConfig => (
            <DropdownMenuItem
              key={blockConfig.type}
              onClick={() => handleAddBlock(blockConfig.type)}
              className="flex items-center gap-3 py-3 cursor-pointer"
            >
              <blockConfig.icon size={18} className="text-muted-foreground" />
              <div className="flex flex-col">
                <span className="font-medium">{blockConfig.name}</span>
                <span className="text-xs text-muted-foreground">{blockConfig.description}</span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Block List */}
      {blocks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Layout size={48} className="text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No blocks yet</h3>
            <p className="text-muted-foreground text-center max-w-md mb-4">
              Add your first block to start building your biolink page. You can add links, text, images, and more.
            </p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <Plus size={16} className="mr-2" />
                  Add Your First Block
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {/* Simplify first experience - show common blocks */}
                {['link', 'text', 'image'].map(type => {
                  const config = blockRegistry.find(b => b.type === type);
                  return config ? (
                    <DropdownMenuItem
                      key={type}
                      onClick={() => handleAddBlock(type)}
                    >
                      <config.icon size={16} className="mr-2" />
                      {config.name}
                    </DropdownMenuItem>
                  ) : null;
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </CardContent>
        </Card>
      ) : (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {blocks.map((block) => (
                <BlockItem
                  key={block.id}
                  block={block}
                  isEditing={editingBlock === block.id}
                  onToggleEdit={() => setEditingBlock(editingBlock === block.id ? null : block.id)}
                  onToggleVisibility={() => handleToggleVisibility(block.id)}
                  onDelete={() => handleDeleteBlock(block.id)}
                >
                  {renderBlock(block)}
                </BlockItem>
              ))}
            </div>
          </SortableContext>

          <DragOverlay>
            {activeBlock ? (
              <div className="opacity-50">
                {renderBlock(activeBlock)}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* Empty State */}
      {blocks.length > 0 && (
        <div className="text-center text-sm text-muted-foreground pt-4 border-t">
          Drag blocks to reorder • Click to edit • Toggle visibility • Delete with ❌
        </div>
      )}
    </div>
  );
}

// Block Item Wrapper Component
function BlockItem({ 
  children, 
  block, 
  isEditing, 
  onToggleEdit, 
  onToggleVisibility, 
  onDelete 
}: { 
  children: React.ReactNode;
  block: Block;
  isEditing: boolean;
  onToggleEdit: () => void;
  onToggleVisibility: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${isEditing ? 'ring-2 ring-blue-500' : ''}`}
    >
      {/* Block Controls */}
      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleVisibility}
          className="h-8 w-8 p-0"
        >
          {block.settings.visible ? (
            <Eye size={14} className="text-green-600" />
          ) : (
            <EyeOff size={14} className="text-gray-400" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
        >
          <Trash2 size={14} />
        </Button>
        <div
          {...attributes}
          {...listeners}
          className="h-8 w-8 flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-gray-100 rounded"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" className="text-gray-400">
            <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
            <path d="M7 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
          </svg>
        </div>
      </div>

      {/* Edit Toggle */}
      <div 
        className="cursor-pointer" 
        onClick={onToggleEdit}
        role="button"
        aria-label="Edit block"
      >
        {children}
      </div>
    </div>
  );
}

// Custom hook for sortable
function useSortable({ id: _id }: { id: string }) {
  // Import from @dnd-kit in real implementation
  // For now, return stubbed values
  return {
    attributes: {},
    listeners: { onMouseDown: () => {} },
    setNodeRef: (_node: HTMLElement | null) => {},
    transform: null,
    transition: 'transform 250ms ease',
    isDragging: false
  };
}
