'use client'

import type { ComponentType } from 'react'

type BlockComponent = ComponentType<any>

/**
 * DynamicBlockManager manages a registry of block type → component mappings.
 * Provides register, unregister, and get functions for dynamic block resolution.
 */
class DynamicBlockManagerClass {
  private registry: Map<string, BlockComponent> = new Map()

  register(type: string, component: BlockComponent): void {
    this.registry.set(type, component)
  }

  unregister(type: string): void {
    this.registry.delete(type)
  }

  get(type: string): BlockComponent | undefined {
    return this.registry.get(type)
  }

  has(type: string): boolean {
    return this.registry.has(type)
  }

  getAll(): Record<string, BlockComponent> {
    return Object.fromEntries(this.registry)
  }

  getRegisteredTypes(): string[] {
    return Array.from(this.registry.keys())
  }

  clear(): void {
    this.registry.clear()
  }
}

// Singleton instance
const dynamicBlockManager = new DynamicBlockManagerClass()

export default dynamicBlockManager
export { DynamicBlockManagerClass }
