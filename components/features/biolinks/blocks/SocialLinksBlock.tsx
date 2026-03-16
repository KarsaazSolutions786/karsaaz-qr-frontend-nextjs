'use client'

import { useTranslation } from '@/lib/i18n'
import type { SocialLinksBlockData } from '@/types/entities/biolink'

interface SocialLinksBlockProps {
  block: SocialLinksBlockData
  isEditing?: boolean
  onUpdate?: (data: SocialLinksBlockData['data']) => void
}

const socialPlatforms = [
  { value: 'twitter', label: 'Twitter/X', icon: '𝕏' },
  { value: 'instagram', label: 'Instagram', icon: '📷' },
  { value: 'facebook', label: 'Facebook', icon: '👥' },
  { value: 'linkedin', label: 'LinkedIn', icon: '💼' },
  { value: 'youtube', label: 'YouTube', icon: '▶️' },
  { value: 'tiktok', label: 'TikTok', icon: '🎵' },
  { value: 'github', label: 'GitHub', icon: '⚡' },
  { value: 'website', label: 'Website', icon: '🌐' },
]

export default function SocialLinksBlock({ block, isEditing, onUpdate }: SocialLinksBlockProps) {
  const { links } = block.data
  const { t } = useTranslation()

  if (isEditing) {
    const addLink = () => {
      onUpdate?.({
        links: [...links, { platform: 'twitter', url: '', icon: '𝕏' }],
      })
    }

    const removeLink = (index: number) => {
      onUpdate?.({
        links: links.filter((_, i) => i !== index),
      })
    }

    const updateLink = (index: number, field: string, value: string) => {
      const newLinks = [...links]
      const currentLink = newLinks[index]
      newLinks[index] = { ...currentLink, [field]: value } as { platform: string; url: string; icon: string }
      if (field === 'platform') {
        const platform = socialPlatforms.find((p) => p.value === value)
        if (platform) {
          newLinks[index].icon = platform.icon
        }
      }
      onUpdate?.({ links: newLinks })
    }

    return (
      <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">{t('Social Links')}</label>
          <button
            type="button"
            onClick={addLink}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {t('+ Add Link')}
          </button>
        </div>
        {links.length === 0 ? (
          <p className="text-sm text-gray-500">{t('No social links added')}</p>
        ) : (
          <div className="space-y-2">
            {links.map((link, index) => (
              <div key={index} className="flex gap-2">
                <select
                  value={link.platform}
                  onChange={(e) => updateLink(index, 'platform', e.target.value)}
                  className="block w-32 rounded-md border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {socialPlatforms.map((platform) => (
                    <option key={platform.value} value={platform.value}>
                      {platform.label}
                    </option>
                  ))}
                </select>
                <input
                  type="url"
                  value={link.url}
                  onChange={(e) => updateLink(index, 'url', e.target.value)}
                  placeholder="https://"
                  className="block flex-1 rounded-md border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => removeLink(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  if (links.length === 0) return null

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {links.map((link, index) => (
        <a
          key={index}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-2xl transition-colors hover:bg-gray-300"
          title={link.platform}
        >
          {link.icon}
        </a>
      ))}
    </div>
  )
}
