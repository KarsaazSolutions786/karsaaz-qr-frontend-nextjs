/**
 * QR Data Encoder
 * 
 * Converts structured form data into QR-encodable strings based on type.
 * Used for live preview rendering during the wizard flow.
 */

export function encodeQRData(type: string, data: Record<string, any>): string {
  if (!data || Object.keys(data).length === 0) {
    return ''
  }

  switch (type) {
    case 'url':
      return data.url || ''

    case 'text':
      return data.text || data.content || ''

    case 'phone':
      return data.phone ? `tel:${data.phone}` : ''

    case 'email':
      return formatMailto(data)

    case 'sms':
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

    case 'whatsapp':
      return data.phone
        ? `https://wa.me/${data.phone.replace(/[^0-9]/g, '')}${data.message ? `?text=${encodeURIComponent(data.message)}` : ''}`
        : ''

    case 'telegram':
      return data.username
        ? `https://t.me/${data.username}`
        : ''

    case 'instagram':
      return data.username
        ? `https://instagram.com/${data.username}`
        : ''

    case 'facebook':
      return data.url || (data.username ? `https://facebook.com/${data.username}` : '')

    case 'youtube':
      return data.url || (data.channelId ? `https://youtube.com/channel/${data.channelId}` : '')

    case 'linkedin':
      return data.url || (data.username ? `https://linkedin.com/in/${data.username}` : '')

    case 'snapchat':
      return data.username
        ? `https://snapchat.com/add/${data.username}`
        : ''

    case 'spotify':
      return data.url || ''

    case 'tiktok':
      return data.username
        ? `https://tiktok.com/@${data.username}`
        : data.url || ''

    case 'x':
      return data.username
        ? `https://x.com/${data.username}`
        : data.url || ''

    case 'facebookmessenger':
      return data.username
        ? `https://m.me/${data.username}`
        : ''

    case 'viber':
      return data.phone
        ? `viber://chat?number=${data.phone.replace(/[^0-9]/g, '')}`
        : ''

    case 'facetime':
      return data.phone || data.email
        ? `facetime:${data.phone || data.email}`
        : ''

    case 'wechat':
      return data.wechatId || data.username || ''

    case 'skype':
      return data.username
        ? `skype:${data.username}?chat`
        : ''

    case 'zoom':
      return data.meetingUrl || data.url || ''

    case 'paypal':
      return data.url || (data.email ? `https://paypal.me/${data.email}` : '')

    case 'crypto':
      return formatCrypto(data)

    case 'brazilpix':
      return data.pixKey || ''

    case 'googlemaps':
      return data.url || (data.query ? `https://maps.google.com/?q=${encodeURIComponent(data.query)}` : '')

    case 'google-review':
      return data.url || ''

    case 'app-store':
      return data.url || data.appStoreUrl || data.playStoreUrl || ''

    case 'email-dynamic':
      return formatMailto(data)

    case 'sms-dynamic':
      return data.phone ? `smsto:${data.phone}:${data.message || ''}` : ''

    case 'file-upload':
      return data.fileUrl || data.url || ''

    case 'upi-dynamic':
    case 'upi':
      return formatUPI(data)

    default:
      // For complex types (business-profile, vcard-plus, restaurant, etc.)
      // fall back to the first URL-like field or JSON representation
      return data.url || data.link || data.website || JSON.stringify(data)
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
  if (data.organization) lines.push(`ORG:${data.organization}`)
  if (data.title) lines.push(`TITLE:${data.title}`)
  if (data.phone) lines.push(`TEL:${data.phone}`)
  if (data.email) lines.push(`EMAIL:${data.email}`)
  if (data.website) lines.push(`URL:${data.website}`)
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
  if (data.startDate) lines.push(`DTSTART:${formatICSDate(data.startDate)}`)
  if (data.endDate) lines.push(`DTEND:${formatICSDate(data.endDate)}`)
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
  const pa = data.vpa || data.upiId || ''
  if (!pa) return ''
  
  let uri = `upi://pay?pa=${pa}`
  if (data.name || data.payeeName) uri += `&pn=${encodeURIComponent(data.name || data.payeeName)}`
  if (data.amount) uri += `&am=${data.amount}`
  if (data.note || data.transactionNote) uri += `&tn=${encodeURIComponent(data.note || data.transactionNote)}`
  return uri
}
