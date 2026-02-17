import type { BlockType, BlockDefinition } from '@/types/entities/biolink'

export const blockRegistry: Record<BlockType, BlockDefinition> = {
  link: {
    type: 'link',
    label: 'Link Button',
    icon: '🔗',
    category: 'core',
    defaultData: {
      url: 'https://example.com',
      title: 'My Link',
      icon: '',
      style: 'button',
    },
  },
  text: {
    type: 'text',
    label: 'Text',
    icon: '📝',
    category: 'core',
    defaultData: {
      content: 'Add your text here',
      align: 'center',
      size: 'md',
    },
  },
  image: {
    type: 'image',
    label: 'Image',
    icon: '🖼️',
    category: 'content',
    defaultData: {
      url: '',
      alt: '',
      link: '',
      caption: '',
    },
  },
  title: {
    type: 'title',
    label: 'Title',
    icon: '📌',
    category: 'core',
    defaultData: {
      text: 'Heading',
      level: 'h2',
      align: 'center',
    },
  },
  'social-links': {
    type: 'social-links',
    label: 'Social Links',
    icon: '📱',
    category: 'social',
    defaultData: {
      links: [],
    },
  },
  video: {
    type: 'video',
    label: 'Video',
    icon: '🎥',
    category: 'content',
    defaultData: {
      url: '',
      title: '',
    },
  },
  divider: {
    type: 'divider',
    label: 'Divider',
    icon: '➖',
    category: 'core',
    defaultData: {
      style: 'solid',
      color: '#e5e7eb',
    },
  },
}

export function createBlock(type: BlockType, order: number) {
  const definition = blockRegistry[type]
  return {
    id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    order,
    data: definition.defaultData,
  }
}
