'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ChevronRightIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { designAssetsAPI } from '@/lib/api/endpoints/design-assets'
import { useAdminDesignAssets } from '@/lib/hooks/queries/useDesignAssets'
import {
  useCreateDesignAsset,
  useUpdateDesignAsset,
  useDeleteDesignAsset,
  useReorderDesignAssets,
  useToggleDesignAsset,
} from '@/lib/hooks/mutations/useDesignAssetMutations'
import type { DesignAsset, DesignAssetType } from '@/types/entities/design-asset'

const ASSET_TABS: { value: DesignAssetType; label: string }[] = [
  { value: 'module_style', label: 'Module Shapes' },
  { value: 'finder_outer_style', label: 'Finder Frames' },
  { value: 'finder_inner_style', label: 'Finder Inner' },
  { value: 'finder_dot_style', label: 'Finder Dots' },
  { value: 'outline_style', label: 'Outlined Shapes' },
  { value: 'advanced_shape', label: 'Advanced Shapes' },
  { value: 'preset_logo', label: 'Preset Logos' },
]

function AssetRow({
  asset,
  index,
  total,
  onToggle,
  onMoveUp,
  onMoveDown,
  onLabelSave,
  onDelete,
}: {
  asset: DesignAsset
  index: number
  total: number
  onToggle: (id: number) => void
  onMoveUp: (index: number) => void
  onMoveDown: (index: number) => void
  onLabelSave: (id: number, label: string) => void
  onDelete: (id: number, label: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [label, setLabel] = useState(asset.label)

  const handleSave = useCallback(() => {
    if (label.trim() && label !== asset.label) {
      onLabelSave(asset.id, label.trim())
    }
    setEditing(false)
  }, [label, asset.id, asset.label, onLabelSave])

  return (
    <tr className={asset.is_active ? '' : 'opacity-50'}>
      {/* Thumbnail */}
      <td className="px-4 py-3 whitespace-nowrap">
        {asset.thumbnail_url ? (
          <Image
            src={asset.thumbnail_url}
            alt={asset.label}
            width={40}
            height={40}
            className="rounded border border-gray-200 object-contain bg-white"
            unoptimized
          />
        ) : (
          <div className="h-10 w-10 rounded border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-gray-400 text-xs">
            N/A
          </div>
        )}
      </td>

      {/* Label (editable) */}
      <td className="px-4 py-3">
        {editing ? (
          <input
            type="text"
            value={label}
            onChange={e => setLabel(e.target.value)}
            onBlur={handleSave}
            onKeyDown={e => {
              if (e.key === 'Enter') handleSave()
              if (e.key === 'Escape') {
                setLabel(asset.label)
                setEditing(false)
              }
            }}
            autoFocus
            className="w-full rounded border border-blue-400 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="text-sm text-gray-900 hover:text-blue-600 cursor-pointer text-left"
            title="Click to edit"
          >
            {asset.label}
          </button>
        )}
      </td>

      {/* Slug (read-only) */}
      <td className="px-4 py-3 whitespace-nowrap">
        <code className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
          {asset.slug}
        </code>
      </td>

      {/* Category */}
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{asset.category || '—'}</td>

      {/* Active toggle */}
      <td className="px-4 py-3 whitespace-nowrap">
        <Switch checked={asset.is_active} onCheckedChange={() => onToggle(asset.id)} />
      </td>

      {/* Sort arrows */}
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center gap-1">
          <button
            disabled={index === 0}
            onClick={() => onMoveUp(index)}
            className="rounded p-1 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Move up"
          >
            <ArrowUpIcon className="h-4 w-4 text-gray-600" />
          </button>
          <button
            disabled={index === total - 1}
            onClick={() => onMoveDown(index)}
            className="rounded p-1 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Move down"
          >
            <ArrowDownIcon className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </td>

      {/* Delete */}
      <td className="px-4 py-3 whitespace-nowrap">
        <button
          onClick={() => onDelete(asset.id, asset.label)}
          className="rounded p-1 text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          title="Delete asset"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </td>
    </tr>
  )
}

function AddAssetForm({ type, onClose }: { type: DesignAssetType; onClose: () => void }) {
  const createMutation = useCreateDesignAsset()
  const [slug, setSlug] = useState('')
  const [label, setLabel] = useState('')
  const [category, setCategory] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return
    setFile(selected)
    setError(null)

    const reader = new FileReader()
    reader.onload = ev => setFilePreview(ev.target?.result as string)
    reader.readAsDataURL(selected)
  }

  const clearFile = () => {
    setFile(null)
    setFilePreview(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!slug.trim() || !label.trim()) return
    setError(null)

    let thumbnailUrl: string | undefined

    if (file) {
      try {
        setUploading(true)
        const result = await designAssetsAPI.uploadThumbnail(file)
        thumbnailUrl = result.url
      } catch {
        setError('Failed to upload file. Max 2MB, allowed: png, jpg, svg, webp, gif.')
        setUploading(false)
        return
      } finally {
        setUploading(false)
      }
    }

    createMutation.mutate(
      {
        type,
        slug: slug.trim(),
        label: label.trim(),
        thumbnail_url: thumbnailUrl,
        category: category.trim() || undefined,
        is_active: true,
      },
      {
        onSuccess: () => onClose(),
        onError: () => setError('Failed to create asset. Check slug is unique.'),
      }
    )
  }

  const isSubmitting = uploading || createMutation.isPending

  return (
    <form onSubmit={handleSubmit} className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-900">Add New Asset</h4>
        <button type="button" onClick={onClose} className="rounded p-1 hover:bg-blue-100">
          <XMarkIcon className="h-4 w-4 text-gray-500" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Slug <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={slug}
            onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
            placeholder="e.g. heart-shape"
            required
            className="w-full rounded border border-gray-300 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Label <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={label}
            onChange={e => setLabel(e.target.value)}
            placeholder="e.g. Heart Shape"
            required
            className="w-full rounded border border-gray-300 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Thumbnail</label>
          {filePreview ? (
            <div className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={filePreview}
                alt="Preview"
                className="h-10 w-10 rounded border border-gray-300 object-contain bg-white"
              />
              <span className="text-xs text-gray-600 truncate max-w-[120px]">{file?.name}</span>
              <button
                type="button"
                onClick={clearFile}
                className="text-xs text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ) : (
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp,image/gif"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
            />
          )}
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
          <input
            type="text"
            value={category}
            onChange={e => setCategory(e.target.value)}
            placeholder="e.g. shapes"
            className="w-full rounded border border-gray-300 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button
          type="submit"
          disabled={isSubmitting || !slug.trim() || !label.trim()}
          className="rounded bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {uploading ? 'Uploading...' : createMutation.isPending ? 'Adding...' : 'Add Asset'}
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="rounded border border-gray-300 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          Cancel
        </button>
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>
    </form>
  )
}

function AssetTable({ type }: { type: DesignAssetType }) {
  const { data: assets, isLoading, isError } = useAdminDesignAssets(type)
  const toggleMutation = useToggleDesignAsset()
  const updateMutation = useUpdateDesignAsset()
  const deleteMutation = useDeleteDesignAsset()
  const reorderMutation = useReorderDesignAssets()
  const [showAddForm, setShowAddForm] = useState(false)

  const handleToggle = useCallback((id: number) => toggleMutation.mutate(id), [toggleMutation])

  const handleLabelSave = useCallback(
    (id: number, label: string) => updateMutation.mutate({ id, label }),
    [updateMutation]
  )

  const handleDelete = useCallback(
    (id: number, label: string) => {
      if (window.confirm(`Delete "${label}"? This cannot be undone.`)) {
        deleteMutation.mutate(id)
      }
    },
    [deleteMutation]
  )

  const handleMove = useCallback(
    (fromIndex: number, direction: 'up' | 'down') => {
      if (!assets) return
      const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1
      if (toIndex < 0 || toIndex >= assets.length) return

      const reordered = [...assets]
      const moved = reordered.splice(fromIndex, 1)[0]!
      reordered.splice(toIndex, 0, moved)

      const order = reordered.map((a, i) => ({ id: a.id, sort_order: i }))
      reorderMutation.mutate(order)
    },
    [assets, reorderMutation]
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
        Failed to load design assets. Please try again.
      </div>
    )
  }

  return (
    <div>
      {/* Add button */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-gray-500">
          {assets?.length ?? 0} asset{(assets?.length ?? 0) !== 1 ? 's' : ''}
        </span>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
        >
          <PlusIcon className="h-4 w-4" />
          Add Asset
        </button>
      </div>

      {/* Add form */}
      {showAddForm && <AddAssetForm type={type} onClose={() => setShowAddForm(false)} />}

      {/* Table */}
      {!assets || assets.length === 0 ? (
        <div className="rounded-lg bg-gray-50 p-8 text-center text-sm text-gray-500">
          No assets found for this type. Click "Add Asset" to create one.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Preview
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Label
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Slug
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Active
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Order
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {assets.map((asset, index) => (
                <AssetRow
                  key={asset.id}
                  asset={asset}
                  index={index}
                  total={assets.length}
                  onToggle={handleToggle}
                  onMoveUp={i => handleMove(i, 'up')}
                  onMoveDown={i => handleMove(i, 'down')}
                  onLabelSave={handleLabelSave}
                  onDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default function DesignAssetsPage() {
  const [activeTab, setActiveTab] = useState<string>('module_style')

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1 text-sm text-gray-500">
        <Link href="/system/settings" className="hover:text-gray-700 transition-colors">
          Settings
        </Link>
        <ChevronRightIcon className="h-3.5 w-3.5" />
        <span className="font-medium text-gray-900">Design Assets</span>
      </nav>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Design Assets</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage QR code design elements — control visibility, ordering, and labels for module
          shapes, finder patterns, outlined shapes, advanced stickers, and preset logos.
        </p>
      </div>

      {/* Tabs */}
      <div className="mt-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex flex-wrap gap-1">
            {ASSET_TABS.map(tab => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {ASSET_TABS.map(tab => (
            <TabsContent key={tab.value} value={tab.value}>
              <AssetTable type={tab.value} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
