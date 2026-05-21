/**
 * Purpose: Dynamic CSS injection utilities.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
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

/**
 * Purpose: Deletes the specified resource.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function removeStyle(id: string): void {
  document.getElementById(id)?.remove()
}

/**
 * Purpose: Executes injectTheme functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function injectTheme(variables: Record<string, string>): void {
  const css = Object.entries(variables)
    .map(([key, value]) => `${key.startsWith('--') ? key : `--${key}`}: ${value};`)
    .join('\n')
  injectStyle('__theme-variables', `:root {\n${css}\n}`)
}
