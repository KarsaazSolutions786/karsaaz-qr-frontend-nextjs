'use client';

import { FilterCollection } from './FilterCollection';
import { ActionCollection } from './ActionCollection';
import type { BasePlugin } from './BasePlugin';

export class PluginManager {
  private static _instance: PluginManager | null = null;
  private plugins: BasePlugin[] = [];
  private filters: FilterCollection;
  private actions: ActionCollection;

  constructor() {
    this.filters = new FilterCollection();
    this.actions = new ActionCollection();
  }

  static instance(): PluginManager {
    if (!PluginManager._instance) {
      PluginManager._instance = new PluginManager();
    }
    return PluginManager._instance;
  }

  // Filter methods — chain transformations (reduce pattern)
  static applyFilters<T>(filterName: string, value: T, ...rest: unknown[]): T {
    return PluginManager.instance().filters.applyFilters(filterName, value, ...rest);
  }

  static addFilter(
    filterName: string,
    callback: (value: unknown, ...rest: unknown[]) => unknown,
    sortOrder = 0
  ): void {
    PluginManager.instance().filters.addFilter(filterName, callback, sortOrder);
  }

  // Action methods — collect outputs (map pattern)
  static doActions(actionName: string, ...rest: unknown[]): unknown[] {
    return PluginManager.instance().actions.doActions(actionName, ...rest);
  }

  static addAction(
    actionName: string,
    callback: (...args: unknown[]) => unknown,
    sortOrder = 0
  ): void {
    PluginManager.instance().actions.addAction(actionName, callback, sortOrder);
  }

  // Plugin registration
  static registerPlugin(plugin: BasePlugin): void {
    const manager = PluginManager.instance();
    manager.plugins.push(plugin);
    plugin.boot(manager);
  }

  static getPlugins(): BasePlugin[] {
    return PluginManager.instance().plugins;
  }

  static reset(): void {
    PluginManager._instance = null;
  }
}
