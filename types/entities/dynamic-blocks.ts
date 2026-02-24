/**
 * Dynamic Biolink Blocks Type Definitions
 * These blocks are defined via API and rendered dynamically
 */

export interface DynamicBlockField {
  id: string
  name: string
  type: 'text' | 'textarea' | 'image' | 'custom-code' | 'number' | 'url' | 'email' | 'color'
  placeholder?: string
  label?: string
  required?: boolean
  sort_order: number
  default_value?: string
  validation?: {
    min?: number
    max?: number
    pattern?: string
  }
}

export interface DynamicBlockDefinition {
  id: string
  name: string
  slug: string
  description?: string
  icon_id?: string
  icon_url?: string
  icon_emoji?: string
  fields: DynamicBlockField[]
  default_styles?: {
    text_color?: string
    background_color?: string
    font_family?: string
    font_size?: string
  }
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface DynamicBlockData {
  id: string
  type: string // Format: 'dynamic-{definition.id}'
  definition_id: string
  visible: boolean
  order: number
  field_values: Record<string, string>
  styles: {
    text_color?: string
    background_color?: string
    font_family?: string
    font_size?: string
  }
}

// Helper to check if a block type is dynamic
export function isDynamicBlockType(type: string): boolean {
  return type.startsWith('dynamic-')
}

// Extract definition ID from dynamic block type
export function getDynamicBlockDefinitionId(type: string): string | null {
  if (!isDynamicBlockType(type)) return null
  return type.replace('dynamic-', '')
}

// Create a dynamic block type from definition
export function createDynamicBlockType(definitionId: string): string {
  return `dynamic-${definitionId}`
}

// Create a new dynamic block instance from definition
export function createDynamicBlock(
  definition: DynamicBlockDefinition,
  order: number
): DynamicBlockData {
  const fieldValues: Record<string, string> = {}

  definition.fields.forEach(field => {
    fieldValues[field.name] = field.default_value || ''
  })

  return {
    id: `dynamic-block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: createDynamicBlockType(definition.id),
    definition_id: definition.id,
    visible: true,
    order,
    field_values: fieldValues,
    styles: definition.default_styles || {},
  }
}
