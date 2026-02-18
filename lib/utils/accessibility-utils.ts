/**
 * Accessibility Utilities
 * 
 * Utilities and hooks for improving accessibility.
 */

'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * useFocusTrap Hook
 * 
 * Traps focus within a container (useful for modals).
 */
export function useFocusTrap(enabled: boolean = true) {
  const containerRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    if (!enabled || !containerRef.current) return;
    
    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };
    
    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();
    
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, [enabled]);
  
  return containerRef;
}

/**
 * useAriaLive Hook
 * 
 * Announces messages to screen readers.
 */
export function useAriaLive() {
  const [message, setMessage] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  const announce = (text: string, timeout: number = 3000) => {
    setMessage(text);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setMessage('');
    }, timeout);
  };
  
  const LiveRegion = () => (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
  
  return { announce, LiveRegion };
}

/**
 * useKeyboardNavigation Hook
 * 
 * Handles arrow key navigation for lists.
 */
export function useKeyboardNavigation(itemCount: number) {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % itemCount);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + itemCount) % itemCount);
        break;
      case 'Home':
        e.preventDefault();
        setActiveIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setActiveIndex(itemCount - 1);
        break;
    }
  };
  
  return { activeIndex, setActiveIndex, handleKeyDown };
}

/**
 * VisuallyHidden Component
 * 
 * Hides content visually but keeps it accessible to screen readers.
 */
export function VisuallyHidden({ 
  children,
  as: Component = 'span',
}: { 
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
}) {
  return (
    <Component className="sr-only">
      {children}
    </Component>
  );
}

/**
 * SkipLink Component
 * 
 * Skip navigation link for keyboard users.
 */
export function SkipLink({ href = '#main-content', children = 'Skip to main content' }: {
  href?: string;
  children?: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:shadow-lg"
    >
      {children}
    </a>
  );
}

/**
 * A11yButton Component
 * 
 * Accessible button with proper ARIA attributes.
 */
export function A11yButton({
  children,
  onClick,
  disabled = false,
  ariaLabel,
  ariaPressed,
  ariaExpanded,
  className = '',
  ...props
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
  ariaPressed?: boolean;
  ariaExpanded?: boolean;
  className?: string;
  [key: string]: any;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
      aria-expanded={ariaExpanded}
      aria-disabled={disabled}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}

/**
 * getFocusableElements
 * 
 * Gets all focusable elements within a container.
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
  return Array.from(container.querySelectorAll<HTMLElement>(selector));
}

/**
 * announceToScreenReader
 * 
 * Announces a message to screen readers.
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('role', 'status');
  liveRegion.setAttribute('aria-live', priority);
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.className = 'sr-only';
  liveRegion.textContent = message;
  
  document.body.appendChild(liveRegion);
  
  setTimeout(() => {
    document.body.removeChild(liveRegion);
  }, 3000);
}

/**
 * Keyboard shortcuts reference
 */
export const KEYBOARD_SHORTCUTS = {
  ESCAPE: 'Escape',
  ENTER: 'Enter',
  SPACE: ' ',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  TAB: 'Tab',
  HOME: 'Home',
  END: 'End',
  PAGE_UP: 'PageUp',
  PAGE_DOWN: 'PageDown',
} as const;

/**
 * ARIA roles reference
 */
export const ARIA_ROLES = {
  BUTTON: 'button',
  DIALOG: 'dialog',
  MENU: 'menu',
  MENUITEM: 'menuitem',
  NAVIGATION: 'navigation',
  SEARCH: 'search',
  TAB: 'tab',
  TABPANEL: 'tabpanel',
  ALERT: 'alert',
  STATUS: 'status',
  PROGRESSBAR: 'progressbar',
} as const;
