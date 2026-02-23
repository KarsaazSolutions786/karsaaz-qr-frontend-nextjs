'use client'

import { cn } from '@/lib/utils'
import {
  Link,
  FileText,
  Wifi,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Image,
  QrCode,
} from 'lucide-react'

const typeConfig: Record<
  string,
  { label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  url: { label: 'URL', icon: Link },
  text: { label: 'Text', icon: FileText },
  wifi: { label: 'Wi-Fi', icon: Wifi },
  email: { label: 'Email', icon: Mail },
  phone: { label: 'Phone', icon: Phone },
  location: { label: 'Location', icon: MapPin },
  event: { label: 'Event', icon: Calendar },
  vcard: { label: 'vCard', icon: CreditCard },
  image: { label: 'Image', icon: Image },
}

interface QrTypeNameProps {
  type: string
  showIcon?: boolean
  className?: string
}

export function QrTypeName({ type, showIcon = true, className }: QrTypeNameProps) {
  const config = typeConfig[type] ?? { label: type, icon: QrCode }
  const Icon = config.icon

  return (
    <span className={cn('inline-flex items-center gap-1.5 text-sm text-gray-700', className)}>
      {showIcon && <Icon className="h-4 w-4" />}
      {config.label}
    </span>
  )
}
