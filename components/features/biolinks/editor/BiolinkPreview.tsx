import type { Biolink, BlockData } from '@/types/entities/biolink'
import LinkBlock from '../blocks/LinkBlock'
import TextBlock from '../blocks/TextBlock'
import ImageBlock from '../blocks/ImageBlock'
import TitleBlock from '../blocks/TitleBlock'
import SocialLinksBlock from '../blocks/SocialLinksBlock'
import VideoBlock from '../blocks/VideoBlock'
import DividerBlock from '../blocks/DividerBlock'

interface BiolinkPreviewProps {
  biolink: Partial<Biolink>
  blocks: BlockData[]
}

export default function BiolinkPreview({ biolink, blocks }: BiolinkPreviewProps) {
  const theme = biolink.theme || {
    backgroundColor: '#ffffff',
    textColor: '#000000',
    buttonColor: '#3b82f6',
    buttonTextColor: '#ffffff',
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
      default:
        return null
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
          blocks.map((block) => renderBlock(block))
        )}
      </div>
    </div>
  )
}
