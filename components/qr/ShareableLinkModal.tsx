'use client'

import { useState } from 'react'
import { X, Link2, Copy, Check, MessageCircle, Mail, Twitter } from 'lucide-react'

export interface ShareableLinkModalProps {
  qrCodeId: string
  slug: string
  isOpen: boolean
  onClose: () => void
}

export function ShareableLinkModal({
  slug,
  isOpen,
  onClose,
}: ShareableLinkModalProps) {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const previewUrl = `${baseUrl}/s/${slug}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(previewUrl)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = previewUrl
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const socialButtons = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-green-600 hover:bg-green-700',
      href: `https://wa.me/?text=${encodeURIComponent(previewUrl)}`,
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'bg-gray-600 hover:bg-gray-700',
      href: `mailto:?subject=Check out this QR code&body=${encodeURIComponent(previewUrl)}`,
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-sky-500 hover:bg-sky-600',
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(previewUrl)}&text=Check out this QR code`,
    },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-bold text-gray-900">Shareable Link</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 transition hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-5 p-6">
          {/* QR code preview of the URL */}
          <div className="flex justify-center">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(previewUrl)}`}
              alt="QR code preview"
              width={160}
              height={160}
              className="rounded-lg border border-gray-200"
            />
          </div>

          {/* URL + copy button */}
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
            <span className="flex-1 truncate text-sm text-gray-700">
              {previewUrl}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="shrink-0 rounded-md bg-purple-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-purple-700"
            >
              {copied ? (
                <span className="flex items-center gap-1">
                  <Check className="h-3 w-3" /> Copied!
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Copy className="h-3 w-3" /> Copy
                </span>
              )}
            </button>
          </div>

          {/* Social share buttons */}
          <div className="grid grid-cols-3 gap-3">
            {socialButtons.map((btn) => {
              const Icon = btn.icon
              return (
                <a
                  key={btn.name}
                  href={btn.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${btn.color} flex flex-col items-center gap-2 rounded-lg p-3 text-white transition`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{btn.name}</span>
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
