'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FolderTree } from '@/components/qr/FolderTree'
import { useFolders } from '@/hooks/useFolders'
import {
  Lock,
  Calendar,
  FolderOpen,
  Download,
  Tag,
  FileText,
} from 'lucide-react'

interface Step4SettingsProps {
  settings: any
  onChange: (settings: any) => void
  folders?: any[]
}

export default function Step4Settings({
  settings,
  onChange,
  folders = [],
}: Step4SettingsProps) {
  const [showFolderPicker, setShowFolderPicker] = useState(false)
  const folderManager = useFolders(folders)

  const handleChange = (field: string, value: any) => {
    onChange({ ...settings, [field]: value })
  }

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      const newTag = e.currentTarget.value.trim()
      const currentTags = settings.tags || []
      if (!currentTags.includes(newTag)) {
        handleChange('tags', [...currentTags, newTag])
        e.currentTarget.value = ''
      }
    }
  }

  const removeTag = (tagToRemove: string) => {
    const currentTags = settings.tags || []
    handleChange(
      'tags',
      currentTags.filter((tag: string) => tag !== tagToRemove)
    )
  }

  const selectedFolder = settings.folderId
    ? folderManager.getFolder(settings.folderId)
    : null

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          QR Code Settings
        </h2>
        <p className="text-gray-600">
          Configure name, organization, and security options
        </p>
      </div>

      <div className="space-y-6">
        {/* QR Code Name */}
        <div>
          <label
            htmlFor="name"
            className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
          >
            <FileText className="w-4 h-4" />
            QR Code Name *
          </label>
          <Input
            id="name"
            type="text"
            value={settings.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g., Product Landing Page QR"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Give your QR code a descriptive name for easy identification
          </p>
        </div>

        {/* Folder Selection */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <FolderOpen className="w-4 h-4" />
            Folder (Optional)
          </label>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Input
                type="text"
                value={selectedFolder?.name || 'No folder selected'}
                readOnly
                className="flex-1 bg-gray-50"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowFolderPicker(!showFolderPicker)}
              >
                {showFolderPicker ? 'Close' : 'Select'}
              </Button>
            </div>

            {showFolderPicker && (
              <div className="border border-gray-200 rounded-md p-4 bg-gray-50 max-h-64 overflow-y-auto">
                <FolderTree
                  folders={folders}
                  selectedFolderId={settings.folderId}
                  onSelectFolder={(folderId) => {
                    handleChange('folderId', folderId)
                    setShowFolderPicker(false)
                  }}
                  onToggleExpanded={() => {}}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    handleChange('folderId', null)
                    setShowFolderPicker(false)
                  }}
                  className="w-full mt-2"
                >
                  Clear Selection
                </Button>
              </div>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Organize your QR codes into folders
          </p>
        </div>

        {/* PIN Protection */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Lock className="w-4 h-4" />
            PIN Protection
          </label>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="pinProtection"
                checked={settings.pinProtected || false}
                onChange={(e) => handleChange('pinProtected', e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="pinProtection" className="text-sm text-gray-700">
                Require PIN to access this QR code
              </label>
            </div>

            {settings.pinProtected && (
              <Input
                type="text"
                value={settings.pin || ''}
                onChange={(e) => handleChange('pin', e.target.value)}
                placeholder="Enter 4-6 digit PIN"
                maxLength={6}
                pattern="[0-9]*"
              />
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Add an extra layer of security by requiring a PIN
          </p>
        </div>

        {/* Expiration Date */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4" />
            Expiration Date (Optional)
          </label>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="hasExpiration"
                checked={settings.hasExpiration || false}
                onChange={(e) =>
                  handleChange('hasExpiration', e.target.checked)
                }
                className="rounded border-gray-300"
              />
              <label htmlFor="hasExpiration" className="text-sm text-gray-700">
                Set an expiration date for this QR code
              </label>
            </div>

            {settings.hasExpiration && (
              <Input
                type="datetime-local"
                value={settings.expiresAt || ''}
                onChange={(e) => handleChange('expiresAt', e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
              />
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            The QR code will become inactive after this date
          </p>
        </div>

        {/* Tags */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Tag className="w-4 h-4" />
            Tags (Optional)
          </label>
          <Input
            type="text"
            placeholder="Type a tag and press Enter"
            onKeyDown={handleTagInput}
          />
          {settings.tags && settings.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {settings.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-blue-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Add tags to help categorize and search for this QR code
          </p>
        </div>

        {/* Download Settings */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Download className="w-4 h-4" />
            Download Settings
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Default Size
              </label>
              <select
                value={settings.defaultSize || '500'}
                onChange={(e) => handleChange('defaultSize', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="300">300x300</option>
                <option value="500">500x500</option>
                <option value="1000">1000x1000</option>
                <option value="2000">2000x2000</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Default Format
              </label>
              <select
                value={settings.defaultFormat || 'png'}
                onChange={(e) => handleChange('defaultFormat', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="png">PNG</option>
                <option value="svg">SVG</option>
                <option value="jpg">JPG</option>
                <option value="pdf">PDF</option>
              </select>
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Set default download preferences for this QR code
          </p>
        </div>
      </div>
    </div>
  )
}
