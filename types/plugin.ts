export interface PluginMetadata {
  name: string;
  version: string;
  author?: string;
  description?: string;
  dependencies?: string[];
}

export interface PluginFilter {
  name: string;
  callback: (value: any, ...args: any[]) => any;
  priority?: number;
}

export interface PluginHook {
  name: string;
  callback: (...args: any[]) => void | Promise<void>;
  priority?: number;
}

export interface Plugin {
  metadata: PluginMetadata;
  filters?: PluginFilter[];
  hooks?: PluginHook[];
  initialize?: () => void | Promise<void>;
  cleanup?: () => void | Promise<void>;
}

export interface PluginRegistry {
  plugins: Map<string, Plugin>;
  filters: Map<string, PluginFilter[]>;
  hooks: Map<string, PluginHook[]>;
}

export interface FilterContext {
  pluginName: string;
  filterName: string;
  value: any;
  args: any[];
}

export interface HookContext {
  pluginName: string;
  hookName: string;
  args: any[];
}
