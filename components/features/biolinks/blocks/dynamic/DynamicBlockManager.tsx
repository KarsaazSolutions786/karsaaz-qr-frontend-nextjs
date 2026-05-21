'use client'

import type { ComponentType } from 'react'

type BlockComponent = ComponentType<any>

/**
 * Purpose: DynamicBlockManager manages a registry of block type → component mappings. Provides register, unregister, and get functions for dynamic block resolution.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

class DynamicBlockManagerClass {
  private registry: Map<string, BlockComponent> = new Map()

  /**
   * Purpose: Executes register functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  register(type: string, component: BlockComponent): void {
    this.registry.set(type, component)
  }

  /**
   * Purpose: Executes unregister functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  unregister(type: string): void {
    this.registry.delete(type)
  }

  /**
   * Purpose: Retrieves .
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  get(type: string): BlockComponent | undefined {
    return this.registry.get(type)
  }

  /**
   * Purpose: Checks if has .
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  has(type: string): boolean {
    return this.registry.has(type)
  }

  /**
   * Purpose: Retrieves all.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  getAll(): Record<string, BlockComponent> {
    return Object.fromEntries(this.registry)
  }

  /**
   * Purpose: Retrieves registeredtypes.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  getRegisteredTypes(): string[] {
    return Array.from(this.registry.keys())
  }

  /**
   * Purpose: Clears or resets the local cache/state.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  clear(): void {
    this.registry.clear()
  }
}

// Singleton instance
const dynamicBlockManager = new DynamicBlockManagerClass()

export default dynamicBlockManager
export { DynamicBlockManagerClass }
