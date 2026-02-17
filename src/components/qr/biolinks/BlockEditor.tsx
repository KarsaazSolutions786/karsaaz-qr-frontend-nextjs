"use client";

import { useState, useCallback } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Block, BiolinkPage } from './types';
import { blockRegistry, createBlock, getBlocksForMenu } from './block-registry';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Eye, EyeOff, Trash2, Settings, Save, Layout, GripVertical, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

/**
 * Block Editor
 * Main component for managing and editing biolink blocks
 */

interface BlockEditorProps {
  page: BiolinkPage;
  onSave: (page: BiolinkPage) => Promise<void>;
  isLoading?: boolean;
}

export default function BlockEditor({ page, onSave, isLoading = false }: BlockEditorProps) {
  const [blocks, setBlocks] = useState<Block[]>(page.blocks || []);
  const [activeBlock, setActiveBlock] = useState<Block | null>(null);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

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
      setBlocks((items) => {
        const oldIndex = items.findIndex(b => b.id === active.id);
        const newIndex = items.findIndex(b => b.id === over.id);

        return arrayMove(items, oldIndex, newIndex).map((block, index) => ({
          ...block,
          settings: {
            ...block.settings,
            order: index
          }
        }));
      });
    }

    setActiveBlock(null);
  }, []);

  // Add new block
  const handleAddBlock = (type: string) => {
    const newBlock = createBlock(type);
    newBlock.settings.order = blocks.length;
    
    setBlocks([...blocks, newBlock]);
    setEditingBlockId(newBlock.id); // Open editor for new block
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
    if (editingBlockId === blockId) {
      setEditingBlockId(null);
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
  const renderBlock = (block: Block, isOverlay = false) => {
    const config = blockRegistry.find(b => b.type === block.type);
    if (!config) {
      return <div className="p-4 border border-red-200 bg-red-50 text-red-500 rounded">Unknown block type: {block.type}</div>;
    }

    const BlockComponent = config.component;
    const isEditing = editingBlockId === block.id;
    
    // In overlay mode, force preview
    const isPreview = isOverlay || !isEditing;

    return (
      <BlockComponent
        key={block.id}
        block={block}
        onUpdate={(updates) => handleUpdateBlock(block.id, updates)}
        onDelete={() => handleDeleteBlock(block.id)}
        isEditing={isEditing}
        isPreview={isPreview}
      />
    );
  };

  // Filter visible blocks for preview text
  const visibleBlocksCount = blocks.filter(block => block.settings.visible).length;

  return (
    <div className="biolink-block-editor space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between sticky top-0 z-50 bg-background/80 backdrop-blur-sm py-4 border-b">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Layout className="mr-2" size={24} />
            Content Blocks
          </h2>
          <p className="text-sm text-muted-foreground">
            {visibleBlocksCount} visible • {blocks.length} total
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Plus size={16} className="mr-2" />
                Add Block
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 max-h-[80vh] overflow-y-auto">
              <DropdownMenuLabel>Add a Block</DropdownMenuLabel>
              <DropdownMenuSeparator />
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

          <Button variant="outline" onClick={handleSave} disabled={isSaving || isLoading}>
            {isSaving ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Block List */}
      {blocks.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="bg-muted p-4 rounded-full mb-4">
              <Layout size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Start Building Your Page</h3>
            <p className="text-muted-foreground text-center max-w-sm mb-6">
              Add your first block to create a unique biolink page. Links, text, images, and more.
            </p>
            <Button onClick={() => handleAddBlock('link')}>
              <Plus size={16} className="mr-2" />
              Add Link Block
            </Button>
          </CardContent>
        </Card>
      ) : (
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart} 
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4 pb-20">
              {blocks.map((block) => (
                <SortableBlockItem
                  key={block.id}
                  block={block}
                  isEditing={editingBlockId === block.id}
                  onToggleEdit={() => setEditingBlockId(editingBlockId === block.id ? null : block.id)}
                  onToggleVisibility={() => handleToggleVisibility(block.id)}
                  onDelete={() => handleDeleteBlock(block.id)}
                >
                  {renderBlock(block)}
                </SortableBlockItem>
              ))}
            </div>
          </SortableContext>

          <DragOverlay>
            {activeBlock ? (
              <div className="opacity-90 scale-105 shadow-xl rounded-lg bg-background border">
                {renderBlock(activeBlock, true)}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
}

// Sortable Block Item Component
interface SortableBlockItemProps {
  children: React.ReactNode;
  block: Block;
  isEditing: boolean;
  onToggleEdit: () => void;
  onToggleVisibility: () => void;
  onDelete: () => void;
}

function SortableBlockItem({ 
  children, 
  block, 
  isEditing, 
  onToggleEdit, 
  onToggleVisibility, 
  onDelete 
}: SortableBlockItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative bg-card border rounded-lg transition-all",
        isEditing ? "ring-2 ring-primary shadow-md" : "hover:border-primary/50",
        !block.settings.visible && "opacity-60 bg-muted/50"
      )}
    >
      {/* Block Header / Controls */}
      <div className="flex items-center gap-2 p-3 border-b bg-muted/10">
        {/* Drag Handle */}
        <div 
          {...attributes} 
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground p-1 rounded hover:bg-muted"
        >
          <GripVertical size={16} />
        </div>

        {/* Block Icon & Title */}
        <div 
          className="flex-1 flex items-center gap-2 cursor-pointer" 
          onClick={onToggleEdit}
        >
          <span className="font-medium text-sm">
            {block.title || block.type}
          </span>
          {!block.settings.visible && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
              Hidden
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleVisibility}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            title={block.settings.visible ? "Hide block" : "Show block"}
          >
            {block.settings.visible ? <Eye size={14} /> : <EyeOff size={14} />}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
            title="Delete block"
          >
            <Trash2 size={14} />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleEdit}
            className={cn(
              "h-8 w-8 p-0 text-muted-foreground hover:text-primary",
              isEditing && "text-primary bg-primary/10"
            )}
            title="Edit block"
          >
            {isEditing ? <X size={14} /> : <Settings size={14} />}
          </Button>
        </div>
      </div>

      {/* Block Content */}
      <div className={cn(
        "p-4",
        isEditing ? "bg-background" : "bg-muted/5 cursor-pointer hover:bg-muted/10"
      )}
      onClick={!isEditing ? onToggleEdit : undefined}
      >
        {children}
      </div>
    </div>
  );
}
