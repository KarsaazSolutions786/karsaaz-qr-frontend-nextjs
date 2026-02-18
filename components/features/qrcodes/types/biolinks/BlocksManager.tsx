'use client';

import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  PlusIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  PencilIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';
import { BiolinkBlock, BlockType, createBlockTemplate } from '@/types/entities/biolinks';
import { BlockSettingsModal } from './BlockSettingsModal';

interface BlocksManagerProps {
  blocks: BiolinkBlock[];
  onChange: (blocks: BiolinkBlock[]) => void;
}

const blockTypeLabels: Record<BlockType, string> = {
  [BlockType.LINK]: 'Link Button',
  [BlockType.TEXT]: 'Text Block',
  [BlockType.HEADING]: 'Heading',
  [BlockType.SOCIAL_LINKS]: 'Social Links',
  [BlockType.IMAGE]: 'Image',
  [BlockType.VIDEO]: 'Video',
  [BlockType.DIVIDER]: 'Divider',
  [BlockType.CONTACT]: 'Contact Card',
  [BlockType.EMAIL]: 'Email Button',
  [BlockType.PHONE]: 'Phone Button',
  [BlockType.LOCATION]: 'Location',
  [BlockType.EMBED]: 'Embed',
  [BlockType.DOWNLOAD]: 'Download File',
  [BlockType.PAYMENT]: 'Payment Link',
  [BlockType.NEWSLETTER]: 'Newsletter Signup',
};

const blockTypeIcons: Record<BlockType, string> = {
  [BlockType.LINK]: '🔗',
  [BlockType.TEXT]: '📝',
  [BlockType.HEADING]: '📰',
  [BlockType.SOCIAL_LINKS]: '👥',
  [BlockType.IMAGE]: '🖼️',
  [BlockType.VIDEO]: '🎥',
  [BlockType.DIVIDER]: '➖',
  [BlockType.CONTACT]: '👤',
  [BlockType.EMAIL]: '✉️',
  [BlockType.PHONE]: '📞',
  [BlockType.LOCATION]: '📍',
  [BlockType.EMBED]: '🔲',
  [BlockType.DOWNLOAD]: '📥',
  [BlockType.PAYMENT]: '💳',
  [BlockType.NEWSLETTER]: '📬',
};

interface SortableBlockItemProps {
  block: BiolinkBlock;
  onEdit: (block: BiolinkBlock) => void;
  onToggleVisibility: (blockId: string) => void;
  onDelete: (blockId: string) => void;
}

function SortableBlockItem({ block, onEdit, onToggleVisibility, onDelete }: SortableBlockItemProps) {
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
    opacity: isDragging ? 0.5 : 1,
  };

  const getBlockLabel = () => {
    switch (block.type) {
      case BlockType.LINK:
        return (block as any).title || 'Untitled Link';
      case BlockType.TEXT:
        return (block as any).content?.substring(0, 30) || 'Empty Text';
      case BlockType.HEADING:
        return (block as any).text || 'Empty Heading';
      case BlockType.EMAIL:
        return (block as any).email || 'Email Button';
      case BlockType.PHONE:
        return (block as any).phone || 'Phone Button';
      default:
        return blockTypeLabels[block.type];
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-3 p-3 bg-white border rounded-lg hover:shadow-md transition-all ${
        !block.visible ? 'opacity-50' : ''
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
      >
        <Bars3Icon className="h-5 w-5" />
      </button>

      <span className="text-2xl">{blockTypeIcons[block.type]}</span>

      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-gray-900 truncate">{getBlockLabel()}</div>
        <div className="text-xs text-gray-500">{blockTypeLabels[block.type]}</div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onToggleVisibility(block.id)}
          className="p-1.5 hover:bg-gray-100 rounded"
          title={block.visible ? 'Hide' : 'Show'}
        >
          {block.visible ? (
            <EyeIcon className="h-4 w-4 text-gray-600" />
          ) : (
            <EyeSlashIcon className="h-4 w-4 text-gray-400" />
          )}
        </button>

        <button
          onClick={() => onEdit(block)}
          className="p-1.5 hover:bg-blue-50 rounded"
          title="Edit"
        >
          <PencilIcon className="h-4 w-4 text-blue-600" />
        </button>

        <button
          onClick={() => onDelete(block.id)}
          className="p-1.5 hover:bg-red-50 rounded"
          title="Delete"
        >
          <TrashIcon className="h-4 w-4 text-red-600" />
        </button>
      </div>
    </div>
  );
}

export function BlocksManager({ blocks, onChange }: BlocksManagerProps) {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [editingBlock, setEditingBlock] = useState<BiolinkBlock | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((block) => block.id === active.id);
      const newIndex = blocks.findIndex((block) => block.id === over.id);

      const reorderedBlocks = arrayMove(blocks, oldIndex, newIndex).map((block, index) => ({
        ...block,
        order: index,
      }));

      onChange(reorderedBlocks);
    }
  };

  const handleAddBlock = (type: BlockType) => {
    const newBlock = createBlockTemplate(type, blocks.length);
    onChange([...blocks, newBlock]);
    setShowAddMenu(false);
    setEditingBlock(newBlock);
  };

  const handleDeleteBlock = (blockId: string) => {
    if (confirm('Are you sure you want to delete this block?')) {
      onChange(blocks.filter((block) => block.id !== blockId));
    }
  };

  const handleToggleVisibility = (blockId: string) => {
    onChange(
      blocks.map((block) =>
        block.id === blockId ? { ...block, visible: !block.visible } : block
      )
    );
  };

  const handleUpdateBlock = (updatedBlock: BiolinkBlock) => {
    onChange(blocks.map((block) => (block.id === updatedBlock.id ? updatedBlock : block)));
    setEditingBlock(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Content Blocks</h3>
        <div className="relative">
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            Add Block
          </button>

          {showAddMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowAddMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border z-20 max-h-96 overflow-y-auto">
                <div className="p-2 space-y-1">
                  {Object.entries(blockTypeLabels).map(([type, label]) => (
                    <button
                      key={type}
                      onClick={() => handleAddBlock(type as BlockType)}
                      className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
                    >
                      <span className="text-xl">{blockTypeIcons[type as BlockType]}</span>
                      <span className="text-sm font-medium text-gray-700">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {blocks.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
          <div className="text-4xl mb-3">📱</div>
          <h4 className="text-lg font-medium text-gray-900 mb-1">No blocks yet</h4>
          <p className="text-sm text-gray-500 mb-4">
            Start building your biolink page by adding content blocks
          </p>
          <button
            onClick={() => setShowAddMenu(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            Add Your First Block
          </button>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {blocks.map((block) => (
                <SortableBlockItem
                  key={block.id}
                  block={block}
                  onEdit={setEditingBlock}
                  onToggleVisibility={handleToggleVisibility}
                  onDelete={handleDeleteBlock}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {editingBlock && (
        <BlockSettingsModal
          block={editingBlock}
          onSave={handleUpdateBlock}
          onClose={() => setEditingBlock(null)}
        />
      )}
    </div>
  );
}
