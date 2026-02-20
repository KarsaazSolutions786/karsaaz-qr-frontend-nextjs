import { PluginManager } from './PluginManager';
import { FILTER_MENU_GROUPS, FILTER_PLUGIN_SETTINGS_PAGE } from './filters';
import type { ReactNode } from 'react';

export interface MenuGroupItem {
  label: string;
  href: string;
  icon?: string;
  badge?: number;
}

export interface MenuGroup {
  title: string;
  items: MenuGroupItem[];
  collapsed?: boolean;
}

export abstract class BasePlugin {
  abstract slug(): string;
  abstract name(): string;

  isEnabled(): boolean {
    return true;
  }

  boot(_manager: PluginManager): void {
    this.registerFilters();
    this.registerActions();
  }

  registerFilters(): void {
    if (this.menuGroup()) {
      PluginManager.addFilter(
        FILTER_MENU_GROUPS,
        (groups: unknown) => this.modifyMenuGroups(groups as MenuGroup[]),
        0
      );
    }
    if (this.renderPluginPage) {
      PluginManager.addFilter(
        FILTER_PLUGIN_SETTINGS_PAGE,
        (pages: unknown) => {
          const p = pages as Record<string, () => ReactNode>;
          p[this.slug()] = () => this.renderPluginPage();
          return p;
        },
        0
      );
    }
  }

  registerActions(): void {
    // Override in subclass to register actions
  }

  menuGroup(): MenuGroup | null {
    return null;
  }

  modifyMenuGroups(defaultGroups: MenuGroup[]): MenuGroup[] {
    const group = this.menuGroup();
    if (group) {
      return [...defaultGroups, group];
    }
    return defaultGroups;
  }

  renderPluginPage(): ReactNode {
    return null;
  }
}
