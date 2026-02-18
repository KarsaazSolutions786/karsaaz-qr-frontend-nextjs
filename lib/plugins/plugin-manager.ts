import type { Plugin, PluginRegistry, PluginFilter, PluginHook } from './plugin-types';

class PluginManager {
  private registry: PluginRegistry = {
    plugins: new Map(),
    filters: new Map(),
    hooks: new Map(),
  };

  private initialized = false;

  async registerPlugin(plugin: Plugin): Promise<void> {
    const { name } = plugin.metadata;

    if (this.registry.plugins.has(name)) {
      console.warn(`Plugin "${name}" is already registered`);
      return;
    }

    this.registry.plugins.set(name, plugin);

    if (plugin.filters) {
      plugin.filters.forEach((filter) => {
        this.registerFilter(name, filter);
      });
    }

    if (plugin.hooks) {
      plugin.hooks.forEach((hook) => {
        this.registerHook(name, hook);
      });
    }

    if (plugin.initialize) {
      try {
        await plugin.initialize();
      } catch (error) {
        console.error(`Failed to initialize plugin "${name}":`, error);
      }
    }
  }

  private registerFilter(_pluginName: string, filter: PluginFilter): void {
    const filterName = filter.name;
    const filters = this.registry.filters.get(filterName) || [];

    filters.push({
      ...filter,
      priority: filter.priority ?? 10,
    });

    filters.sort((a, b) => (a.priority ?? 10) - (b.priority ?? 10));

    this.registry.filters.set(filterName, filters);
  }

  private registerHook(_pluginName: string, hook: PluginHook): void {
    const hookName = hook.name;
    const hooks = this.registry.hooks.get(hookName) || [];

    hooks.push({
      ...hook,
      priority: hook.priority ?? 10,
    });

    hooks.sort((a, b) => (a.priority ?? 10) - (b.priority ?? 10));

    this.registry.hooks.set(hookName, hooks);
  }

  applyFilters<T = any>(filterName: string, value: T, ...args: any[]): T {
    const filters = this.registry.filters.get(filterName);

    if (!filters || filters.length === 0) {
      return value;
    }

    let result = value;

    for (const filter of filters) {
      try {
        result = filter.callback(result, ...args);
      } catch (error) {
        console.error(`Error in filter "${filterName}":`, error);
      }
    }

    return result;
  }

  async executeHook(hookName: string, ...args: any[]): Promise<void> {
    const hooks = this.registry.hooks.get(hookName);

    if (!hooks || hooks.length === 0) {
      return;
    }

    for (const hook of hooks) {
      try {
        await hook.callback(...args);
      } catch (error) {
        console.error(`Error in hook "${hookName}":`, error);
      }
    }
  }

  unregisterPlugin(pluginName: string): void {
    const plugin = this.registry.plugins.get(pluginName);

    if (!plugin) {
      console.warn(`Plugin "${pluginName}" is not registered`);
      return;
    }

    if (plugin.cleanup) {
      try {
        plugin.cleanup();
      } catch (error) {
        console.error(`Failed to cleanup plugin "${pluginName}":`, error);
      }
    }

    this.registry.filters.forEach((filters, filterName) => {
      this.registry.filters.set(
        filterName,
        filters.filter((f) => !f.name.startsWith(`${pluginName}.`))
      );
    });

    this.registry.hooks.forEach((hooks, hookName) => {
      this.registry.hooks.set(
        hookName,
        hooks.filter((h) => !h.name.startsWith(`${pluginName}.`))
      );
    });

    this.registry.plugins.delete(pluginName);
  }

  getPlugin(pluginName: string): Plugin | undefined {
    return this.registry.plugins.get(pluginName);
  }

  getRegisteredPlugins(): Plugin[] {
    return Array.from(this.registry.plugins.values());
  }

  hasFilter(filterName: string): boolean {
    return this.registry.filters.has(filterName);
  }

  hasHook(hookName: string): boolean {
    return this.registry.hooks.has(hookName);
  }

  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    this.initialized = true;
  }

  async cleanup(): Promise<void> {
    const plugins = Array.from(this.registry.plugins.values());

    for (const plugin of plugins) {
      if (plugin.cleanup) {
        try {
          await plugin.cleanup();
        } catch (error) {
          console.error(`Failed to cleanup plugin "${plugin.metadata.name}":`, error);
        }
      }
    }

    this.registry.plugins.clear();
    this.registry.filters.clear();
    this.registry.hooks.clear();
    this.initialized = false;
  }
}

export const pluginManager = new PluginManager();

export function registerPlugin(plugin: Plugin): Promise<void> {
  return pluginManager.registerPlugin(plugin);
}

export function applyFilters<T = any>(filterName: string, value: T, ...args: any[]): T {
  return pluginManager.applyFilters(filterName, value, ...args);
}

export function executeHook(hookName: string, ...args: any[]): Promise<void> {
  return pluginManager.executeHook(hookName, ...args);
}

export default pluginManager;
