/**
 * Axe-core development setup.
 * Import this in your root layout/app component during development
 * to get real-time accessibility violation reports in the browser console.
 *
 * Usage:
 *   import '@/lib/utils/axe-setup';
 */

async function initAxe() {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    const React = await import('react')
    const ReactDOM = await import('react-dom')
    const axe = await import('@axe-core/react')

    // Run axe checks every 1 second after DOM mutations settle
    axe.default(React.default, ReactDOM.default, 1000)
  }
}

initAxe()

export {}
