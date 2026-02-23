/**
 * Dynamic CSS injection utilities.
 */

export function injectStyle(id: string, css: string): void {
  const existing = document.getElementById(id) as HTMLStyleElement | null
  if (existing) {
    existing.textContent = css
    return
  }
  const style = document.createElement('style')
  style.id = id
  style.textContent = css
  document.head.appendChild(style)
}

export function removeStyle(id: string): void {
  document.getElementById(id)?.remove()
}

export function injectTheme(variables: Record<string, string>): void {
  const css = Object.entries(variables)
    .map(([key, value]) => `${key.startsWith('--') ? key : `--${key}`}: ${value};`)
    .join('\n')
  injectStyle('__theme-variables', `:root {\n${css}\n}`)
}
