const BLOCKED_HOSTS = new Set(['localhost', '127.0.0.1', '0.0.0.0', '::1'])

function isPrivateIpv4(host: string): boolean {
  const parts = host.split('.').map(Number)
  if (parts.length !== 4 || parts.some(n => Number.isNaN(n))) return false
  const a = parts[0]!
  const b = parts[1]!
  if (a === 10) return true
  if (a === 127) return true
  if (a === 0) return true
  if (a === 169 && b === 254) return true
  if (a === 172 && b >= 16 && b <= 31) return true
  if (a === 192 && b === 168) return true
  return false
}

export function isPublicHttpUrl(value: string): boolean {
  if (!value?.trim()) return true
  try {
    const url = new URL(value.includes('://') ? value : `https://${value}`)
    const scheme = url.protocol.replace(':', '')
    if (scheme !== 'http' && scheme !== 'https') return false
    const host = url.hostname.toLowerCase()
    if (BLOCKED_HOSTS.has(host)) return false
    if (host.endsWith('.local') || host.endsWith('.internal')) return false
    if (isPrivateIpv4(host)) return false
    return true
  } catch {
    return false
  }
}
