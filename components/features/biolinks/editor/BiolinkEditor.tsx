'use client'

import { useState } from 'react'
import { useTranslation } from '@/lib/i18n'
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
import ContactBlock from '../blocks/ContactBlock'
import EmailBlock from '../blocks/EmailBlock'
import PhoneBlock from '../blocks/PhoneBlock'
import LocationBlock from '../blocks/LocationBlock'
import EmbedBlock from '../blocks/EmbedBlock'
import DownloadBlock from '../blocks/DownloadBlock'
import PaymentBlock from '../blocks/PaymentBlock'
import NewsletterBlock from '../blocks/NewsletterBlock'
import FAQsBlock from '../blocks/FAQsBlock'
import VCardBlock from '../blocks/VCardBlock'
import LeadFormBlock from '../blocks/LeadFormBlock'
import OpeningHoursBlock from '../blocks/OpeningHoursBlock'
import TableBlock from '../blocks/TableBlock'
import ListBlock from '../blocks/ListBlock'
import ImageGridBlock from '../blocks/ImageGridBlock'
import AudioBlock from '../blocks/AudioBlock'
import ProfileBlock from '../blocks/ProfileBlock'
import CustomCodeBlock from '../blocks/CustomCodeBlock'
import CopyableDataBlock from '../blocks/CopyableDataBlock'
import FileBlock from '../blocks/FileBlock'
import InformationPopupBlock from '../blocks/InformationPopupBlock'
import ParagraphBlock from '../blocks/ParagraphBlock'
import ShareBlock from '../blocks/ShareBlock'
import UPIBlock from '../blocks/UPIBlock'
import CountdownBlock from '../blocks/CountdownBlock'
import CalendarBlock from '../blocks/CalendarBlock'
import HeaderBannerBlock from '../blocks/HeaderBannerBlock'
import TestimonialBlock from '../blocks/TestimonialBlock'
import CarouselBlock from '../blocks/CarouselBlock'
import MapBlock from '../blocks/MapBlock'
import AppDownloadBlock from '../blocks/AppDownloadBlock'
import PricingBlock from '../blocks/PricingBlock'
import YouTubeBlock from '../blocks/YouTubeBlock'
import VimeoBlock from '../blocks/VimeoBlock'
import SpotifyBlock from '../blocks/SpotifyBlock'
import SoundCloudBlock from '../blocks/SoundCloudBlock'
import TikTokBlock from '../blocks/TikTokBlock'
import InstagramBlock from '../blocks/InstagramBlock'
import TwitterBlock from '../blocks/TwitterBlock'

interface BiolinkEditorProps {
  blocks: BlockData[]
  onChange: (blocks: BlockData[]) => void
}

/**
 * Purpose: Executes SortableBlock functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
function SortableBlock({
  block,
  onUpdate,
  onDelete,
}: {
  block: BlockData
  onUpdate: (data: any) => void
  onDelete: () => void
}) {
  const { t } = useTranslation()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  /**
   * Purpose: Executes renderBlock functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
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
      case 'contact':
        return <ContactBlock block={block as any} isEditing onUpdate={onUpdate} />
      case 'email':
        return <EmailBlock block={block as any} isEditing onUpdate={onUpdate} />
      case 'phone':
        return <PhoneBlock block={block as any} isEditing onUpdate={onUpdate} />
      case 'location':
        return <LocationBlock block={block as any} isEditing onUpdate={onUpdate} />
      case 'embed':
        return <EmbedBlock block={block as any} isEditing onUpdate={onUpdate} />
      case 'download':
        return <DownloadBlock block={block as any} isEditing onUpdate={onUpdate} />
      case 'payment':
        return <PaymentBlock block={block as any} isEditing onUpdate={onUpdate} />
      case 'newsletter':
        return <NewsletterBlock block={block as any} isEditing onUpdate={onUpdate} />
      case 'faqs':
        return <FAQsBlock block={block as any} isEditing onUpdate={onUpdate} />
      case 'vcard':
        return <VCardBlock block={block as any} isEditing onUpdate={onUpdate} />
      case 'lead-form':
        return <LeadFormBlock block={block as any} isEditing onUpdate={onUpdate} />
      case 'opening-hours':
        return <OpeningHoursBlock block={block as any} isEditing onUpdate={onUpdate} />
      case 'table':
        return <TableBlock block={block as any} isEditing onUpdate={onUpdate} />
      case 'list':
        return <ListBlock block={block as any} isEditing onUpdate={onUpdate} />
      case 'image-grid':
        return <ImageGridBlock block={block as any} isEditing onUpdate={onUpdate} />
      case 'audio':
        return <AudioBlock block={block as any} isEditing onUpdate={onUpdate} />
      case 'profile':
        return <ProfileBlock block={block as any} isEditing onUpdate={onUpdate} />
      case 'custom-code':
        return <CustomCodeBlock block={block as any} isEditing onUpdate={onUpdate} />
      case 'copyable-data':
        return <CopyableDataBlock block={block as any} isEditing onUpdate={onUpdate} />
      case 'file':
        return <FileBlock block={block as any} isEditing onUpdate={onUpdate} />
      case 'information-popup':
        return <InformationPopupBlock block={block as any} isEditing onUpdate={onUpdate} />
      case 'paragraph':
        return <ParagraphBlock block={block as any} isEditing onUpdate={onUpdate} />
      case 'share':
        return <ShareBlock block={block as any} isEditing onUpdate={onUpdate} />
      case 'upi':
        return <UPIBlock block={block as any} isEditing onUpdate={onUpdate} />
      case 'countdown':
        return <CountdownBlock block={block as any} isEditing onUpdate={onUpdate} />
      case 'calendar':
        return <CalendarBlock block={block as any} isEditing onUpdate={onUpdate} />
      case 'header-banner':
        return <HeaderBannerBlock block={block as any} isEditing onUpdate={onUpdate} />
      case 'testimonial':
        return <TestimonialBlock block={block as any} isEditing onUpdate={onUpdate} />
      case 'carousel':
        return <CarouselBlock block={block as any} isEditing onUpdate={onUpdate} />
      case 'map':
        return <MapBlock block={block as any} isEditing onUpdate={onUpdate} />
      case 'app-download':
        return <AppDownloadBlock block={block as any} isEditing onUpdate={onUpdate} />
      case 'pricing':
        return <PricingBlock block={block as any} isEditing onUpdate={onUpdate} />
      case 'youtube':
        return <YouTubeBlock block={block as any} isEditing onUpdate={onUpdate} />
      case 'vimeo':
        return <VimeoBlock block={block as any} isEditing onUpdate={onUpdate} />
      case 'spotify':
        return <SpotifyBlock block={block as any} isEditing onUpdate={onUpdate} />
      case 'soundcloud':
        return <SoundCloudBlock block={block as any} isEditing onUpdate={onUpdate} />
      case 'tiktok':
        return <TikTokBlock block={block as any} isEditing onUpdate={onUpdate} />
      case 'instagram':
        return <InstagramBlock block={block as any} isEditing onUpdate={onUpdate} />
      case 'twitter':
        return <TwitterBlock block={block as any} isEditing onUpdate={onUpdate} />
      default:
        return <div>{t('Unknown block type')}</div>
    }
  }

  return (
    <div ref={setNodeRef} style={style} className="group relative">
      <div className="absolute -left-10 top-4 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab rounded bg-gray-200 p-1 text-gray-600 hover:bg-gray-300 active:cursor-grabbing"
          title={t('Drag to reorder')}
        >
          ⋮⋮
        </button>
      </div>
      <div className="relative">
        {renderBlock()}
        <button
          onClick={onDelete}
          className="absolute -right-10 top-4 rounded bg-red-100 p-1 text-red-600 opacity-0 transition-opacity hover:bg-red-200 group-hover:opacity-100"
          title={t('Delete block')}
        >
          🗑️
        </button>
      </div>
    </div>
  )
}

/**
 * Purpose: Executes BiolinkEditor functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export default function BiolinkEditor({ blocks, onChange }: BiolinkEditorProps) {
  const { t } = useTranslation();
  const [showBlockSelector, setShowBlockSelector] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  /**
   * Purpose: Executes handleDragEnd functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
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

  /**
   * Purpose: Executes addBlock functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const addBlock = (type: BlockType) => {
    const newBlock = createBlock(type, blocks.length)
    onChange([...blocks, newBlock as BlockData])
    setShowBlockSelector(false)
  }

  /**
   * Purpose: Updates the configuration or state.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const updateBlock = (id: string, data: any) => {
    onChange(
      blocks.map((block) =>
        block.id === id ? { ...block, data: { ...block.data, ...data } } : block
      )
    )
  }

  /**
   * Purpose: Deletes the specified resource.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
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
          <p className="text-gray-500">{t('No blocks yet. Add your first block below.')}</p>
        </div>
      )}

      <div className="flex justify-center">
        {showBlockSelector ? (
          <div className="w-full rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">{t('Add Block')}</h3>
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
            {t('+ Add Block')}
          </button>
        )}
      </div>
    </div>
  )
}
