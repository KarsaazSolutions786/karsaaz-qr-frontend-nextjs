/**
 * Helpers for generating common ARIA attribute sets.
 */

/** Props for a button that opens/closes something (dropdown, accordion, dialog) */
export function ariaExpander(isExpanded: boolean, controlsId: string) {
  return {
    'aria-expanded': isExpanded,
    'aria-controls': controlsId,
  } as const
}

/** Props for the content region controlled by an expander */
export function ariaExpandable(id: string, isExpanded: boolean) {
  return {
    id,
    role: 'region' as const,
    'aria-hidden': !isExpanded,
  }
}

/** Props for a tab button */
export function ariaTab(isSelected: boolean, panelId: string) {
  return {
    role: 'tab' as const,
    'aria-selected': isSelected,
    'aria-controls': panelId,
    tabIndex: isSelected ? 0 : -1,
  }
}

/** Props for a tab panel */
export function ariaTabPanel(id: string, tabId: string) {
  return {
    id,
    role: 'tabpanel' as const,
    'aria-labelledby': tabId,
    tabIndex: 0,
  }
}

/** Props for a live region (announcements, toasts) */
export function ariaLive(politeness: 'polite' | 'assertive' = 'polite') {
  return {
    role: 'status' as const,
    'aria-live': politeness,
    'aria-atomic': true,
  }
}

/** Props for a labeled dialog/modal */
export function ariaDialog(titleId: string, descriptionId?: string) {
  return {
    role: 'dialog' as const,
    'aria-modal': true,
    'aria-labelledby': titleId,
    ...(descriptionId && { 'aria-describedby': descriptionId }),
  }
}

/** Generate a unique id from a prefix and index */
export function ariaId(prefix: string, index?: number | string) {
  return index !== undefined ? `${prefix}-${index}` : prefix
}
