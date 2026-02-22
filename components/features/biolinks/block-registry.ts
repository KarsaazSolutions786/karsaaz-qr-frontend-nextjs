import type { BlockType, BlockDefinition } from '@/types/entities/biolink'
import type { DynamicBiolinkBlock, BiolinkBlockField } from '@/types/entities/dynamic-biolink-block'
import type { ComponentType } from 'react'

// Extended definition supporting dynamic blocks with field configuration
export interface DynamicBlockDefinition extends BlockDefinition {
  isDynamic?: boolean
  fields?: BiolinkBlockField[]
  component?: ComponentType<any>
}

export const blockRegistry: Record<string, DynamicBlockDefinition> = {
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

/**
 * Register a dynamic block type from a DynamicBiolinkBlock definition.
 */
export function registerDynamicBlock(
  slug: string,
  dynamicBlock: DynamicBiolinkBlock,
  component?: ComponentType<any>
) {
  const defaultData: Record<string, string> = {}
  if (dynamicBlock.fields) {
    dynamicBlock.fields.forEach((field) => {
      defaultData[field.name] = ''
    })
  }

  blockRegistry[slug] = {
    type: slug as BlockType,
    label: dynamicBlock.name,
    icon: '🧩',
    category: 'content',
    defaultData,
    isDynamic: true,
    fields: dynamicBlock.fields,
    component,
  }
}

/**
 * Unregister a dynamic block type.
 */
export function unregisterDynamicBlock(slug: string) {
  const definition = blockRegistry[slug]
  if (definition?.isDynamic) {
    delete blockRegistry[slug]
  }
}

/**
 * Get all registered block definitions, optionally filtered by category or dynamic flag.
 */
export function getBlockDefinitions(filter?: {
  category?: string
  dynamicOnly?: boolean
}): DynamicBlockDefinition[] {
  return Object.values(blockRegistry).filter((def) => {
    if (filter?.category && def.category !== filter.category) return false
    if (filter?.dynamicOnly && !def.isDynamic) return false
    return true
  })
}

export function createBlock(type: BlockType | string, order: number) {
  const definition = blockRegistry[type]
  return {
    id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    order,
    data: definition ? { ...definition.defaultData } : {},
  }
}
