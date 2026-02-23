'use client'

import { useState } from 'react'
import type { Biolink, BlockData } from '@/types/entities/biolink'
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
import { blockRegistry } from '../block-registry'
import SimplePagination from '@/components/common/SimplePagination'

interface BiolinkPreviewProps {
  biolink: Partial<Biolink>
  blocks: BlockData[]
}

export default function BiolinkPreview({ biolink, blocks }: BiolinkPreviewProps) {
  const BLOCKS_PER_PAGE = 10
  const [visibleBlocksCount, setVisibleBlocksCount] = useState(BLOCKS_PER_PAGE)

  const theme = biolink.theme || {
    backgroundColor: '#ffffff',
    textColor: '#000000',
    buttonColor: '#3b82f6',
    buttonTextColor: '#ffffff',
  }

  const totalBlocks = blocks.length
  const visibleBlocks = blocks.slice(0, visibleBlocksCount)
  const hasMoreBlocks = visibleBlocksCount < totalBlocks
  const showPagination = totalBlocks > BLOCKS_PER_PAGE

  const handleLoadMore = () => {
    setVisibleBlocksCount(prev => Math.min(prev + BLOCKS_PER_PAGE, totalBlocks))
  }

  const renderBlock = (block: BlockData) => {
    switch (block.type) {
      case 'link':
        return <LinkBlock key={block.id} block={block} />
      case 'text':
        return <TextBlock key={block.id} block={block} />
      case 'image':
        return <ImageBlock key={block.id} block={block} />
      case 'title':
        return <TitleBlock key={block.id} block={block} />
      case 'social-links':
        return <SocialLinksBlock key={block.id} block={block} />
      case 'video':
        return <VideoBlock key={block.id} block={block} />
      case 'divider':
        return <DividerBlock key={block.id} block={block} />
      case 'contact':
        return <ContactBlock key={block.id} block={block} />
      case 'email':
        return <EmailBlock key={block.id} block={block} />
      case 'phone':
        return <PhoneBlock key={block.id} block={block} />
      case 'location':
        return <LocationBlock key={block.id} block={block} />
      case 'embed':
        return <EmbedBlock key={block.id} block={block} />
      case 'download':
        return <DownloadBlock key={block.id} block={block} />
      case 'payment':
        return <PaymentBlock key={block.id} block={block} />
      case 'newsletter':
        return <NewsletterBlock key={block.id} block={block} />
      case 'faqs':
        return <FAQsBlock key={block.id} block={block} />
      case 'vcard':
        return <VCardBlock key={block.id} block={block} />
      case 'lead-form':
        return <LeadFormBlock key={block.id} block={block} />
      case 'opening-hours':
        return <OpeningHoursBlock key={block.id} block={block} />
      case 'table':
        return <TableBlock key={block.id} block={block} />
      case 'list':
        return <ListBlock key={block.id} block={block} />
      case 'image-grid':
        return <ImageGridBlock key={block.id} block={block} />
      case 'audio':
        return <AudioBlock key={block.id} block={block} />
      case 'profile':
        return <ProfileBlock key={block.id} block={block} />
      case 'custom-code':
        return <CustomCodeBlock key={block.id} block={block} />
      case 'copyable-data':
        return <CopyableDataBlock key={block.id} block={block} />
      case 'file':
        return <FileBlock key={block.id} block={block} />
      case 'information-popup':
        return <InformationPopupBlock key={block.id} block={block} />
      case 'paragraph':
        return <ParagraphBlock key={block.id} block={block} />
      case 'share':
        return <ShareBlock key={block.id} block={block} />
      case 'upi':
        return <UPIBlock key={block.id} block={block} />
      default: {
        // Check block registry for dynamic/custom block types
        const dynamicBlock = block as BlockData
        const definition = blockRegistry[dynamicBlock.type]
        if (definition) {
          return (
            <div key={dynamicBlock.id} className="rounded-lg border p-4 text-sm text-gray-500">
              Unsupported block: {definition.label}
            </div>
          )
        }
        return null
      }
    }
  }

  return (
    <div
      className="mx-auto min-h-screen max-w-2xl p-8"
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
      }}
    >
      {/* Header */}
      <div className="mb-8 text-center">
        {biolink.avatar && (
          <img
            src={biolink.avatar}
            alt={biolink.title || 'Avatar'}
            className="mx-auto mb-4 h-24 w-24 rounded-full object-cover"
          />
        )}
        <h1 className="mb-2 text-2xl font-bold">{biolink.title || 'Untitled'}</h1>
        {biolink.description && <p className="text-gray-600">{biolink.description}</p>}
      </div>

      {/* Blocks */}
      <div className="space-y-4">
        {blocks.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
            <p className="text-gray-500">No blocks added yet</p>
          </div>
        ) : (
          <>
            {visibleBlocks.map(block => renderBlock(block))}
            {showPagination && (
              <div className="pt-4">
                <SimplePagination
                  currentPage={1}
                  totalPages={1}
                  onPageChange={handleLoadMore}
                  variant="load-more"
                  hasMore={hasMoreBlocks}
                  loadMoreText={`Load More (${totalBlocks - visibleBlocksCount} remaining)`}
                  showPageIndicator={false}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
