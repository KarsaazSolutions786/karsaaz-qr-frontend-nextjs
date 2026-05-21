/**
 * Helpers for generating common ARIA attribute sets.
 */

/**
 * Purpose: * Props for a button that opens/closes something (dropdown, accordion, dialog) 
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function ariaExpander(isExpanded: boolean, controlsId: string) {
  return {
    'aria-expanded': isExpanded,
    'aria-controls': controlsId,
  } as const
}

/**
 * Purpose: * Props for the content region controlled by an expander 
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function ariaExpandable(id: string, isExpanded: boolean) {
  return {
    id,
    role: 'region' as const,
    'aria-hidden': !isExpanded,
  }
}

/**
 * Purpose: * Props for a tab button 
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function ariaTab(isSelected: boolean, panelId: string) {
  return {
    role: 'tab' as const,
    'aria-selected': isSelected,
    'aria-controls': panelId,
    tabIndex: isSelected ? 0 : -1,
  }
}

/**
 * Purpose: * Props for a tab panel 
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function ariaTabPanel(id: string, tabId: string) {
  return {
    id,
    role: 'tabpanel' as const,
    'aria-labelledby': tabId,
    tabIndex: 0,
  }
}

/**
 * Purpose: * Props for a live region (announcements, toasts) 
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function ariaLive(politeness: 'polite' | 'assertive' = 'polite') {
  return {
    role: 'status' as const,
    'aria-live': politeness,
    'aria-atomic': true,
  }
}

/**
 * Purpose: * Props for a labeled dialog/modal 
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function ariaDialog(titleId: string, descriptionId?: string) {
  return {
    role: 'dialog' as const,
    'aria-modal': true,
    'aria-labelledby': titleId,
    ...(descriptionId && { 'aria-describedby': descriptionId }),
  }
}

/**
 * Purpose: * Generate a unique id from a prefix and index 
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function ariaId(prefix: string, index?: number | string) {
  return index !== undefined ? `${prefix}-${index}` : prefix
}
