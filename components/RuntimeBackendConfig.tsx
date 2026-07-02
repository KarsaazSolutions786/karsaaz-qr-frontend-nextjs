/**
 * Injects window.BACKEND_URL at runtime so Docker can point at a LAN API
 * without rebuilding the Next.js bundle.
 */
export function RuntimeBackendScript() {
  const raw = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || ''

  if (!raw) return null

  const backendUrl = raw.replace(/\/api\/?$/, '').replace(/\/$/, '')

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `window.BACKEND_URL=${JSON.stringify(backendUrl)};`,
      }}
    />
  )
}
