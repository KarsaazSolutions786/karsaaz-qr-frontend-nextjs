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

/**
 * Purpose: Class definition for BasePlugin.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export abstract class BasePlugin {
  /**
   * Purpose: Executes slug functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  abstract slug(): string;
  /**
   * Purpose: Executes name functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  abstract name(): string;

  /**
   * Purpose: Checks if enabled.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  isEnabled(): boolean {
    return true;
  }

  /**
   * Purpose: Executes boot functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  boot(_manager: PluginManager): void {
    this.registerFilters();
    this.registerActions();
  }

  /**
   * Purpose: Executes registerFilters functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
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

  /**
   * Purpose: Executes registerActions functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  registerActions(): void {
    // Override in subclass to register actions
  }

  /**
   * Purpose: Executes menuGroup functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  menuGroup(): MenuGroup | null {
    return null;
  }

  /**
   * Purpose: Executes modifyMenuGroups functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  modifyMenuGroups(defaultGroups: MenuGroup[]): MenuGroup[] {
    const group = this.menuGroup();
    if (group) {
      return [...defaultGroups, group];
    }
    return defaultGroups;
  }

  /**
   * Purpose: Executes renderPluginPage functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  renderPluginPage(): ReactNode {
    return null;
  }
}
