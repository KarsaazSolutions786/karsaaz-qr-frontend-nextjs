'use client';

import { FilterCollection } from './FilterCollection';
import { ActionCollection } from './ActionCollection';
import type { BasePlugin } from './BasePlugin';

/**
 * Purpose: Class definition for PluginManager.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export class PluginManager {
  private static _instance: PluginManager | null = null;
  private plugins: BasePlugin[] = [];
  private filters: FilterCollection;
  private actions: ActionCollection;

  /**
   * Purpose: Constructor for constructor.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  constructor() {
    this.filters = new FilterCollection();
    this.actions = new ActionCollection();
  }

  /**
   * Purpose: Executes instance functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  static instance(): PluginManager {
    if (!PluginManager._instance) {
      PluginManager._instance = new PluginManager();
    }
    return PluginManager._instance;
  }

  // Filter methods — chain transformations (reduce pattern)
  /**
   * Purpose: Executes applyFilters functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  static applyFilters<T>(filterName: string, value: T, ...rest: unknown[]): T {
    return PluginManager.instance().filters.applyFilters(filterName, value, ...rest);
  }

  /**
   * Purpose: Executes addFilter functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  static addFilter(
    filterName: string,
    callback: (value: unknown, ...rest: unknown[]) => unknown,
    sortOrder = 0
  ): void {
    PluginManager.instance().filters.addFilter(filterName, callback, sortOrder);
  }

  // Action methods — collect outputs (map pattern)
  /**
   * Purpose: Executes doActions functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  static doActions(actionName: string, ...rest: unknown[]): unknown[] {
    return PluginManager.instance().actions.doActions(actionName, ...rest);
  }

  /**
   * Purpose: Executes addAction functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  static addAction(
    actionName: string,
    callback: (...args: unknown[]) => unknown,
    sortOrder = 0
  ): void {
    PluginManager.instance().actions.addAction(actionName, callback, sortOrder);
  }

  // Plugin registration
  /**
   * Purpose: Executes registerPlugin functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  static registerPlugin(plugin: BasePlugin): void {
    const manager = PluginManager.instance();
    manager.plugins.push(plugin);
    plugin.boot(manager);
  }

  /**
   * Purpose: Retrieves plugins.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  static getPlugins(): BasePlugin[] {
    return PluginManager.instance().plugins;
  }

  /**
   * Purpose: Executes reset functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  static reset(): void {
    PluginManager._instance = null;
  }
}
