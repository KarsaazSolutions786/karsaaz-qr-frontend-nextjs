'use client'

import React, { createContext, useContext, useMemo } from 'react'
import { useDynamicBlockDefinitions } from '@/lib/api/dynamic-blocks'
import {
  DynamicBlockDefinition,
  DynamicBlockData,
  createDynamicBlock,
  isDynamicBlockType,
  getDynamicBlockDefinitionId,
} from '@/types/entities/dynamic-blocks'

interface DynamicBlocksContextValue {
  definitions: DynamicBlockDefinition[]
  isLoading: boolean
  isError: boolean
  getDefinition: (definitionId: string) => DynamicBlockDefinition | undefined
  getDefinitionByType: (blockType: string) => DynamicBlockDefinition | undefined
  createBlock: (definitionId: string, order: number) => DynamicBlockData | null
  isDynamicType: (type: string) => boolean
}

const DynamicBlocksContext = createContext<DynamicBlocksContextValue | null>(null)

export function DynamicBlocksProvider({ children }: { children: React.ReactNode }) {
  const { data: definitions = [], isLoading, isError } = useDynamicBlockDefinitions()

  // Build definitions map for quick lookup
  const definitionsMap = useMemo(() => {
    const map = new Map<string, DynamicBlockDefinition>()
    definitions.forEach(def => {
      map.set(def.id, def)
    })
    return map
  }, [definitions])

  const getDefinition = (definitionId: string): DynamicBlockDefinition | undefined => {
    return definitionsMap.get(definitionId)
  }

  const getDefinitionByType = (blockType: string): DynamicBlockDefinition | undefined => {
    if (!isDynamicBlockType(blockType)) return undefined
    const definitionId = getDynamicBlockDefinitionId(blockType)
    return definitionId ? definitionsMap.get(definitionId) : undefined
  }

  const createBlockFromDefinition = (
    definitionId: string,
    order: number
  ): DynamicBlockData | null => {
    const definition = definitionsMap.get(definitionId)
    if (!definition) return null
    return createDynamicBlock(definition, order)
  }

  const value: DynamicBlocksContextValue = {
    definitions: definitions.filter(d => d.is_active),
    isLoading,
    isError,
    getDefinition,
    getDefinitionByType,
    createBlock: createBlockFromDefinition,
    isDynamicType: isDynamicBlockType,
  }

  return <DynamicBlocksContext.Provider value={value}>{children}</DynamicBlocksContext.Provider>
}

export function useDynamicBlocks(): DynamicBlocksContextValue {
  const context = useContext(DynamicBlocksContext)
  if (!context) {
    // Return a default value if provider is not available
    return {
      definitions: [],
      isLoading: false,
      isError: false,
      getDefinition: () => undefined,
      getDefinitionByType: () => undefined,
      createBlock: () => null,
      isDynamicType: isDynamicBlockType,
    }
  }
  return context
}

// Component to add dynamic blocks to the block type menu
interface DynamicBlockTypeMenuProps {
  onSelect: (definition: DynamicBlockDefinition) => void
}

export function DynamicBlockTypeMenu({ onSelect }: DynamicBlockTypeMenuProps) {
  const { definitions, isLoading, isError } = useDynamicBlocks()

  if (isLoading) {
    return <div className="px-3 py-2 text-sm text-gray-500">Loading custom blocks...</div>
  }

  if (isError || definitions.length === 0) {
    return null
  }

  return (
    <>
      <div className="border-t my-2" />
      <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">Custom Blocks</div>
      {definitions.map(definition => (
        <button
          key={definition.id}
          onClick={() => onSelect(definition)}
          className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
        >
          <span className="text-xl">
            {definition.icon_emoji || (definition.icon_url ? '🔗' : '📦')}
          </span>
          <div>
            <span className="text-sm font-medium text-gray-700">{definition.name}</span>
            {definition.description && (
              <p className="text-xs text-gray-500 line-clamp-1">{definition.description}</p>
            )}
          </div>
        </button>
      ))}
    </>
  )
}

export default DynamicBlockTypeMenu
