/**
 * QR Data Encoder
 *
 * Converts structured form data into QR-encodable strings based on type.
 * Field names match the Vue.js backend API schemas exactly.
 * Used for live preview rendering during the wizard flow.
 */

export function encodeQRData(type: string, data: Record<string, any>): string {
  if (!data || Object.keys(data).length === 0) {
    return ''
  }

  switch (type) {
    // ── Static simple types ──────────────────────────────────────────

    case 'url':
      return data.url || ''

    case 'text':
      return data.text || data.content || ''

    case 'call':
    case 'phone':
      return data.phone ? `tel:${data.phone}` : ''

    case 'email':
      return formatMailto(data)

    case 'sms':
      // schema field: phone
      return data.phone ? `smsto:${data.phone}:${data.message || ''}` : ''

    case 'wifi':
      return formatWifi(data)

    case 'vcard':
      return formatVCard(data)

    case 'location':
      return data.latitude && data.longitude
        ? `geo:${data.latitude},${data.longitude}`
        : ''

    case 'calendar':
      return formatCalendar(data)

    // ── Messaging / Social – schema field names are the type id ───────

    // WhatsApp – schema field: mobile_number
    case 'whatsapp': {
      const num = data.mobile_number || data.phone || ''
      if (!num) return ''
      const clean = num.replace(/[^0-9+]/g, '')
      const msg = data.message ? `?text=${encodeURIComponent(data.message)}` : ''
      return `https://wa.me/${clean}${msg}`
    }

    // Telegram – schema field: username
    case 'telegram':
      return data.username ? `https://t.me/${data.username.replace(/^@/, '')}` : ''

    // Instagram – schema field: instagram
    case 'instagram': {
      const val = data.instagram || data.username || ''
      if (!val) return ''
      if (val.startsWith('http')) return val
      return `https://instagram.com/${val.replace(/^@/, '')}`
    }

    // Facebook – schema field: facebook
    case 'facebook': {
      const val = data.facebook || data.url || data.username || ''
      if (!val) return ''
      if (val.startsWith('http')) return val
      return `https://facebook.com/${val}`
    }

    // YouTube – schema field: youtube
    case 'youtube': {
      const val = data.youtube || data.url || ''
      if (!val) return ''
      if (val.startsWith('http')) return val
      return `https://youtube.com/@${val}`
    }

    // LinkedIn – schema field: linkedin
    case 'linkedin': {
      const val = data.linkedin || data.url || data.username || ''
      if (!val) return ''
      if (val.startsWith('http')) return val
      return `https://linkedin.com/in/${val}`
    }

    // Snapchat – schema field: snapchat
    case 'snapchat': {
      const val = data.snapchat || data.username || ''
      if (!val) return ''
      if (val.startsWith('http')) return val
      return `https://snapchat.com/add/${val.replace(/^@/, '')}`
    }

    // Spotify – schema field: spotify
    case 'spotify': {
      const val = data.spotify || data.url || ''
      return val
    }

    // TikTok – schema field: tiktok
    case 'tiktok': {
      const val = data.tiktok || data.username || data.url || ''
      if (!val) return ''
      if (val.startsWith('http')) return val
      return `https://tiktok.com/@${val.replace(/^@/, '')}`
    }

    // Twitter / X – schema field: x
    case 'x': {
      const val = data.x || data.username || data.url || ''
      if (!val) return ''
      if (val.startsWith('http')) return val
      return `https://x.com/${val.replace(/^@/, '')}`
    }

    // Facebook Messenger – schema field: facebook_page_name
    case 'facebookmessenger': {
      const val = data.facebook_page_name || data.username || ''
      if (!val) return ''
      if (val.startsWith('http')) return val
      return `https://m.me/${val}`
    }

    // Viber – schema field: viber_number
    case 'viber': {
      const num = data.viber_number || data.phone || ''
      if (!num) return ''
      return `viber://chat?number=${num.replace(/[^0-9+]/g, '')}`
    }

    // FaceTime – schema field: target
    case 'facetime': {
      const val = data.target || data.phone || data.email || ''
      return val ? `facetime:${val}` : ''
    }

    // WeChat – schema field: username
    case 'wechat':
      return data.username || ''

    // Skype – schema field: skype_name, type = call|chat
    case 'skype': {
      const name = data.skype_name || data.username || ''
      if (!name) return ''
      const action = data.type || 'chat'
      return `skype:${name}?${action}`
    }

    // Zoom – schema fields: meeting_id, meeting_password
    case 'zoom': {
      const id = (data.meeting_id || '').replace(/\s/g, '')
      if (!id) return data.url || ''
      const pwd = data.meeting_password ? `?pwd=${data.meeting_password}` : ''
      return `https://zoom.us/j/${id}${pwd}`
    }

    // PayPal – schema fields: type, email, item_name, amount, currency
    case 'paypal': {
      const email = data.email || ''
      if (!email) return data.url || ''
      const payType = data.type || '_xclick'
      const params = new URLSearchParams({
        cmd: payType,
        business: email,
      })
      if (data.item_name) params.append('item_name', data.item_name)
      if (data.amount) params.append('amount', String(data.amount))
      if (data.currency) params.append('currency_code', data.currency)
      return `https://www.paypal.com/cgi-bin/webscr?${params.toString()}`
    }

    case 'crypto':
      return formatCrypto(data)

    // BrazilPIX – schema field: key
    case 'brazilpix':
      return data.key || data.pixKey || ''

    // Google Maps – schema field: googlemaps (URL)
    case 'googlemaps': {
      const val = data.googlemaps || data.url || ''
      if (!val) return ''
      if (val.startsWith('http')) return val
      return `https://maps.google.com/?q=${encodeURIComponent(val)}`
    }

    // Google Review – schema field: place (URL/place ID)
    case 'google-review': {
      const val = data.place || data.url || ''
      return val
    }

    // App Download – schema fields: iosUrl, androidUrl, appName
    case 'app-store':
    case 'app-download':
      return data.iosUrl || data.androidUrl || data.url || data.appStoreUrl || data.playStoreUrl || ''

    // Dynamic Email – schema fields: email, subject, message
    case 'email-dynamic':
      return formatMailto({ email: data.email, subject: data.subject, body: data.message })

    // Dynamic SMS – schema fields: phone, message
    case 'sms-dynamic':
      return data.phone ? `smsto:${data.phone}:${data.message || ''}` : ''

    // File Upload – returns backend reference (no static encoding)
    case 'file-upload':
      return data.fileUrl || data.url || ''

    // UPI Dynamic – schema fields: upi_id, payee_name, amount
    case 'upi-dynamic':
    case 'upi':
      return formatUPI(data)

    default:
      // Complex dynamic types (business-profile, vcard-plus, etc.) rely on backend URL
      return data.url || data.link || data.website || ''
  }
}

function formatMailto(data: Record<string, any>): string {
  if (!data.email) return ''
  let mailto = `mailto:${data.email}`
  const params: string[] = []
  if (data.subject) params.push(`subject=${encodeURIComponent(data.subject)}`)
  if (data.body || data.message) params.push(`body=${encodeURIComponent(data.body || data.message)}`)
  if (params.length > 0) mailto += `?${params.join('&')}`
  return mailto
}

function formatWifi(data: Record<string, any>): string {
  const type = data.encryption || data.type || 'WPA'
  const ssid = data.ssid || data.networkName || ''
  const password = data.password || ''
  const hidden = data.hidden ? 'true' : 'false'
  return `WIFI:T:${type};S:${ssid};P:${password};H:${hidden};;`
}

function formatVCard(data: Record<string, any>): string {
  const lines: string[] = ['BEGIN:VCARD', 'VERSION:3.0']

  const fn = data.firstName || ''
  const ln = data.lastName || ''
  if (fn || ln) {
    lines.push(`N:${ln};${fn};;;`)
    lines.push(`FN:${fn} ${ln}`.trim())
  }
  // organization / company
  const org = data.organization || data.company || ''
  if (org) lines.push(`ORG:${org}`)
  // title / job
  const title = data.title || data.job || ''
  if (title) lines.push(`TITLE:${title}`)
  // phones (Vue.js stores as `phones`; vCard standard stores as `phone`)
  const phone = data.phone || data.phones || ''
  if (phone) lines.push(`TEL:${phone}`)
  // emails (Vue.js stores as `emails`; standard field is `email`)
  const email = data.email || data.emails || ''
  if (email) lines.push(`EMAIL:${email}`)
  // website (Vue.js stores as `website_list`)
  const website = data.website || data.website_list || ''
  if (website) lines.push(`URL:${website}`)
  if (data.address) lines.push(`ADR:;;${data.address};;;;`)

  lines.push('END:VCARD')
  return lines.join('\n')
}

function formatCalendar(data: Record<string, any>): string {
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
  ]
  if (data.title || data.summary) lines.push(`SUMMARY:${data.title || data.summary}`)
  if (data.location) lines.push(`LOCATION:${data.location}`)
  if (data.description) lines.push(`DESCRIPTION:${data.description}`)
  // schema uses startTime / endTime (ISO datetime strings)
  const start = data.startTime || data.startDate || ''
  const end = data.endTime || data.endDate || ''
  if (start) lines.push(`DTSTART:${formatICSDate(start)}`)
  if (end) lines.push(`DTEND:${formatICSDate(end)}`)
  lines.push('END:VEVENT', 'END:VCALENDAR')
  return lines.join('\n')
}

function formatICSDate(date: string): string {
  try {
    return new Date(date).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  } catch {
    return date
  }
}

function formatCrypto(data: Record<string, any>): string {
  const currency = (data.currency || data.coin || 'bitcoin').toLowerCase()
  const address = data.address || ''
  if (!address) return ''
  
  let uri = `${currency}:${address}`
  const params: string[] = []
  if (data.amount) params.push(`amount=${data.amount}`)
  if (data.label) params.push(`label=${encodeURIComponent(data.label)}`)
  if (data.message) params.push(`message=${encodeURIComponent(data.message)}`)
  if (params.length > 0) uri += `?${params.join('&')}`
  return uri
}

function formatUPI(data: Record<string, any>): string {
  // schema fields: upi_id, payee_name, amount
  const pa = data.upi_id || data.vpa || data.upiId || ''
  if (!pa) return ''

  let uri = `upi://pay?pa=${encodeURIComponent(pa)}`
  const pn = data.payee_name || data.name || data.payeeName || ''
  if (pn) uri += `&pn=${encodeURIComponent(pn)}`
  if (data.amount) uri += `&am=${data.amount}`
  if (data.note || data.transactionNote) uri += `&tn=${encodeURIComponent(data.note || data.transactionNote)}`
  return uri
}
