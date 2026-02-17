'use client'

import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { BlockData, BlockType } from '@/types/entities/biolink'
import { blockRegistry, createBlock } from '../block-registry'
import LinkBlock from '../blocks/LinkBlock'
import TextBlock from '../blocks/TextBlock'
import ImageBlock from '../blocks/ImageBlock'
import TitleBlock from '../blocks/TitleBlock'
import SocialLinksBlock from '../blocks/SocialLinksBlock'
import VideoBlock from '../blocks/VideoBlock'
import DividerBlock from '../blocks/DividerBlock'

interface BiolinkEditorProps {
  blocks: BlockData[]
  onChange: (blocks: BlockData[]) => void
}

function SortableBlock({
  block,
  onUpdate,
  onDelete,
}: {
  block: BlockData
  onUpdate: (data: any) => void
  onDelete: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const renderBlock = () => {
    switch (block.type) {
      case 'link':
        return <LinkBlock block={block} isEditing onUpdate={onUpdate} />
      case 'text':
        return <TextBlock block={block} isEditing onUpdate={onUpdate} />
      case 'image':
        return <ImageBlock block={block} isEditing onUpdate={onUpdate} />
      case 'title':
        return <TitleBlock block={block} isEditing onUpdate={onUpdate} />
      case 'social-links':
        return <SocialLinksBlock block={block} isEditing onUpdate={onUpdate} />
      case 'video':
        return <VideoBlock block={block} isEditing onUpdate={onUpdate} />
      case 'divider':
        return <DividerBlock block={block} isEditing onUpdate={onUpdate} />
      default:
        return <div>Unknown block type</div>
    }
  }

  return (
    <div ref={setNodeRef} style={style} className="group relative">
      <div className="absolute -left-10 top-4 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab rounded bg-gray-200 p-1 text-gray-600 hover:bg-gray-300 active:cursor-grabbing"
          title="Drag to reorder"
        >
          ⋮⋮
        </button>
      </div>
      <div className="relative">
        {renderBlock()}
        <button
          onClick={onDelete}
          className="absolute -right-10 top-4 rounded bg-red-100 p-1 text-red-600 opacity-0 transition-opacity hover:bg-red-200 group-hover:opacity-100"
          title="Delete block"
        >
          🗑️
        </button>
      </div>
    </div>
  )
}

export default function BiolinkEditor({ blocks, onChange }: BiolinkEditorProps) {
  const [showBlockSelector, setShowBlockSelector] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id)
      const newIndex = blocks.findIndex((b) => b.id === over.id)

      const newBlocks = arrayMove(blocks, oldIndex, newIndex).map((block, index) => ({
        ...block,
        order: index,
      }))

      onChange(newBlocks)
    }
  }

  const addBlock = (type: BlockType) => {
    const newBlock = createBlock(type, blocks.length)
    onChange([...blocks, newBlock])
    setShowBlockSelector(false)
  }

  const updateBlock = (id: string, data: any) => {
    onChange(
      blocks.map((block) =>
        block.id === id ? { ...block, data: { ...block.data, ...data } } : block
      )
    )
  }

  const deleteBlock = (id: string) => {
    onChange(blocks.filter((block) => block.id !== id))
  }

  return (
    <div className="space-y-4">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4 pl-12 pr-12">
            {blocks.map((block) => (
              <SortableBlock
                key={block.id}
                block={block}
                onUpdate={(data) => updateBlock(block.id, data)}
                onDelete={() => deleteBlock(block.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {blocks.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-500">No blocks yet. Add your first block below.</p>
        </div>
      )}

      <div className="flex justify-center">
        {showBlockSelector ? (
          <div className="w-full rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Add Block</h3>
              <button
                onClick={() => setShowBlockSelector(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {Object.values(blockRegistry).map((def) => (
                <button
                  key={def.type}
                  onClick={() => addBlock(def.type)}
                  className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 p-4 transition-colors hover:border-blue-500 hover:bg-blue-50"
                >
                  <span className="text-2xl">{def.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{def.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowBlockSelector(true)}
            className="rounded-lg border-2 border-dashed border-gray-300 px-6 py-3 text-sm font-medium text-gray-600 transition-colors hover:border-blue-500 hover:text-blue-600"
          >
            + Add Block
          </button>
        )}
      </div>
    </div>
  )
}
