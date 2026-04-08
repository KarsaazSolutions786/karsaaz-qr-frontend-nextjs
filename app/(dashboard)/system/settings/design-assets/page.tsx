'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  ChevronRightIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
  PhotoIcon,
  DocumentArrowUpIcon,
  InformationCircleIcon,
  Cog6ToothIcon,
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
import { useQueryClient } from '@tanstack/react-query'
import type { DesignAsset, DesignAssetType } from '@/types/entities/design-asset'
import { queryKeys } from '@/lib/query/keys'
import { resolveBackendUrl } from '@/lib/utils/resolve-backend-url'
import { useTranslation } from '@/lib/i18n'
import { usePermissions } from '@/lib/hooks/usePermissions'
import { showSuccessToast, showErrorToast } from '@/lib/hooks/useToast'
import { RenderConfigEditor } from '@/components/admin/RenderConfigEditor'
import type { RenderConfig } from '@/components/admin/RenderConfigEditor'
import { LottieLoader } from '@/components/ui/lottie-loader'

const ASSET_TABS: { value: DesignAssetType; label: string }[] = [
  { value: 'module_style', label: 'Module Shapes' },
  { value: 'finder_outer_style', label: 'Finder Frames' },
  // finder_inner_style removed — no backend renderer exists for this type
  { value: 'finder_dot_style', label: 'Finder Dots' },
  { value: 'outline_style', label: 'Outlined Shapes' },
  { value: 'advanced_shape', label: 'Advanced Shapes' },
  { value: 'preset_logo', label: 'Preset Logos' },
]

function AssetRow({
  asset,
  index,
  total,
  assetType,
  onToggle,
  onMoveUp,
  onMoveDown,
  onLabelSave,
  onCategorySave,
  onMetadataSave,
  onDelete,
  onThumbnailReplace,
  onSvgUpload,
}: {
  asset: DesignAsset
  index: number
  total: number
  assetType: DesignAssetType
  onToggle: (id: number) => void
  onMoveUp: (index: number) => void
  onMoveDown: (index: number) => void
  onLabelSave: (id: number, label: string) => void
  onCategorySave: (id: number, category: string) => void
  onMetadataSave: (id: number, metadata: Record<string, unknown>) => void
  onDelete: (id: number, label: string) => void
  onThumbnailReplace: (id: number, file: File) => void
  onSvgUpload?: (id: number, file: File) => void
}) {
  const { t } = useTranslation()
  const [editing, setEditing] = useState(false)
  const [label, setLabel] = useState(asset.label)
  const [editingCategory, setEditingCategory] = useState(false)
  const [categoryVal, setCategoryVal] = useState(asset.category || '')
  const [showMetaEditor, setShowMetaEditor] = useState(false)
  const [showRenderConfig, setShowRenderConfig] = useState(false)
  const meta = asset.metadata as Record<string, unknown> | null
  const currentRenderConfig = (meta?.render as RenderConfig | undefined) ?? null
  const [hasText, setHasText] = useState(!!meta?.hasText)
  const [textLines, setTextLines] = useState(Number(meta?.textLines) || 1)

  const handleSave = useCallback(() => {
    if (label.trim() && label !== asset.label) {
      onLabelSave(asset.id, label.trim())
    }
    setEditing(false)
  }, [label, asset.id, asset.label, onLabelSave])

  const handleCategorySave = useCallback(() => {
    const trimmed = categoryVal.trim()
    if (trimmed !== (asset.category || '')) {
      onCategorySave(asset.id, trimmed)
    }
    setEditingCategory(false)
  }, [categoryVal, asset.id, asset.category, onCategorySave])

  const handleMetadataSave = useCallback(() => {
    onMetadataSave(asset.id, { hasText, textLines: hasText ? textLines : 0 })
    setShowMetaEditor(false)
  }, [asset.id, hasText, textLines, onMetadataSave])

  const handleThumbnailClick = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/png,image/jpeg,image/svg+xml,image/webp,image/gif'
    input.onchange = () => {
      const selected = input.files?.[0]
      if (selected) onThumbnailReplace(asset.id, selected)
    }
    input.click()
  }, [asset.id, onThumbnailReplace])

  return (
    <tr className={asset.is_active ? '' : 'opacity-50'}>
      {/* Thumbnail + replace button */}
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="group relative inline-block">
          {asset.thumbnail_url ? (
            <Image
              src={resolveBackendUrl(asset.thumbnail_url) || asset.thumbnail_url}
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
          <button
            type="button"
            onClick={handleThumbnailClick}
            title={t('Replace thumbnail')}
            className="absolute inset-0 flex items-center justify-center rounded bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <PhotoIcon className="h-4 w-4 text-white" />
          </button>
        </div>
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
            title={t('Click to edit')}
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

      {/* Category (editable) */}
      <td className="px-4 py-3 whitespace-nowrap">
        {editingCategory ? (
          <input
            type="text"
            value={categoryVal}
            onChange={e => setCategoryVal(e.target.value)}
            onBlur={handleCategorySave}
            onKeyDown={e => {
              if (e.key === 'Enter') handleCategorySave()
              if (e.key === 'Escape') {
                setCategoryVal(asset.category || '')
                setEditingCategory(false)
              }
            }}
            autoFocus
            className="w-24 rounded border border-blue-400 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <button
            onClick={() => setEditingCategory(true)}
            className="text-sm text-gray-500 hover:text-blue-600 cursor-pointer text-left"
            title={t('Click to edit category')}
          >
            {asset.category || '—'}
          </button>
        )}
      </td>

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
            title={t('Move up')}
          >
            <ArrowUpIcon className="h-4 w-4 text-gray-600" />
          </button>
          <button
            disabled={index === total - 1}
            onClick={() => onMoveDown(index)}
            className="rounded p-1 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
            title={t('Move down')}
          >
            <ArrowDownIcon className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </td>

      {/* Actions */}
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center gap-1">
          <div className="relative">
            <button
              onClick={() => {
                if (assetType === 'advanced_shape') {
                  setShowMetaEditor(!showMetaEditor)
                } else {
                  setShowRenderConfig(true)
                }
              }}
              className="rounded p-1 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              title={assetType === 'advanced_shape' ? t('Text config') : t('Render config')}
            >
              <Cog6ToothIcon className="h-4 w-4" />
            </button>
            {showMetaEditor && assetType === 'advanced_shape' && (
              <div className="absolute right-0 top-full z-20 mt-1 w-52 rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
                <div className="text-xs font-medium text-gray-700 mb-2">
                  {t('Sticker Text Config')}
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-600">{t('Has text input')}</span>
                  <Switch checked={hasText} onCheckedChange={setHasText} />
                </div>
                {hasText && (
                  <div className="mb-2">
                    <label className="text-xs text-gray-600">{t('Text lines (1-3)')}</label>
                    <input
                      type="number"
                      min={1}
                      max={3}
                      value={textLines}
                      onChange={e => setTextLines(Math.min(3, Math.max(1, Number(e.target.value))))}
                      className="mt-1 w-full rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleMetadataSave}
                    className="rounded bg-indigo-600 px-2 py-1 text-xs font-medium text-white hover:bg-indigo-700"
                  >
                    {t('Save')}
                  </button>
                  <button
                    onClick={() => {
                      setHasText(!!meta?.hasText)
                      setTextLines(Number(meta?.textLines) || 1)
                      setShowMetaEditor(false)
                    }}
                    className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
                  >
                    {t('Cancel')}
                  </button>
                </div>
              </div>
            )}
          </div>
          {showRenderConfig && (
            <RenderConfigEditor
              config={currentRenderConfig}
              onSave={renderConfig => {
                onMetadataSave(asset.id, { ...meta, render: renderConfig })
                setShowRenderConfig(false)
              }}
              onClose={() => setShowRenderConfig(false)}
            />
          )}
          {onSvgUpload && (
            <button
              onClick={() => {
                const input = document.createElement('input')
                input.type = 'file'
                input.accept = '.svg,image/svg+xml'
                input.onchange = () => {
                  const selected = input.files?.[0]
                  if (selected) onSvgUpload(asset.id, selected)
                }
                input.click()
              }}
              className={`rounded p-1 transition-colors ${
                meta?.svg_path
                  ? 'text-green-500 hover:text-green-700 hover:bg-green-50'
                  : 'text-amber-400 hover:text-amber-600 hover:bg-amber-50'
              }`}
              title={
                meta?.svg_path
                  ? t('Replace shape SVG (auto-analyzed)')
                  : t('Upload shape SVG — auto-analyzed & aligned')
              }
            >
              <DocumentArrowUpIcon className="h-4 w-4" />
            </button>
          )}
          {/* Show analysis badge if SVG has been analyzed */}
          {!!meta?.analysis && (
            <span
              className="inline-flex items-center rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700"
              title={`ViewBox: ${(meta.analysis as Record<string, unknown>)?.viewBox ?? 'N/A'}, Paths: ${(meta.analysis as Record<string, unknown>)?.pathCount ?? '?'}`}
            >
              ✓ analyzed
            </span>
          )}
          <button
            onClick={() => onDelete(asset.id, asset.label)}
            className="rounded p-1 text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title={t('Delete asset')}
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  )
}

function AddAssetForm({ type, onClose }: { type: DesignAssetType; onClose: () => void }) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const createMutation = useCreateDesignAsset()
  const [slug, setSlug] = useState('')
  const [label, setLabel] = useState('')
  const [category, setCategory] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [svgFile, setSvgFile] = useState<File | null>(null)
  const [hasText, setHasText] = useState(false)
  const [textLines, setTextLines] = useState(1)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const needsSvg = type === 'outline_style' || type === 'advanced_shape'
  const isAdvanced = type === 'advanced_shape'

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
        setError(t('Failed to upload file. Max 2MB, allowed: png, jpg, svg, webp, gif.'))
        setUploading(false)
        return
      } finally {
        setUploading(false)
      }
    }

    const metadata: Record<string, unknown> | undefined = isAdvanced
      ? { hasText, textLines: hasText ? textLines : 0 }
      : undefined

    createMutation.mutate(
      {
        type,
        slug: slug.trim(),
        label: label.trim(),
        thumbnail_url: thumbnailUrl,
        category: category.trim() || undefined,
        is_active: true,
        metadata,
      },
      {
        onSuccess: async newAsset => {
          // Auto-upload SVG if one was selected — analyzer runs on backend
          if (svgFile && newAsset?.id) {
            try {
              const result = await designAssetsAPI.uploadShapeSvg(newAsset.id, svgFile)
              const warnings = result.analysis?.warnings ?? []
              let msg = t('Asset created with SVG template.')
              if (result.analysis) {
                msg += ` (${result.analysis.pathCount} paths, viewBox: ${result.analysis.viewBox ?? 'auto'})`
              }
              if (warnings.length > 0) {
                msg += ` ⚠ ${warnings.join('; ')}`
              }
              showSuccessToast(msg)
              queryClient.invalidateQueries({ queryKey: queryKeys.designAssets.all() })
            } catch (err: unknown) {
              const msg = (err as { response?: { data?: { message?: string } } })?.response?.data
                ?.message
              showErrorToast(msg || t('Asset created but SVG upload failed.'))
            }
          } else {
            showSuccessToast(t('Asset created.'))
          }
          onClose()
        },
        onError: () => setError(t('Failed to create asset. Check slug is unique.')),
      }
    )
  }

  const isSubmitting = uploading || createMutation.isPending

  return (
    <form onSubmit={handleSubmit} className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-900">{t('Add New Asset')}</h4>
        <button type="button" onClick={onClose} className="rounded p-1 hover:bg-blue-100">
          <XMarkIcon className="h-4 w-4 text-gray-500" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            {t('Slug')} <span className="text-red-500">*</span>
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
            {t('Label')} <span className="text-red-500">*</span>
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
          <label className="block text-xs font-medium text-gray-700 mb-1">{t('Thumbnail')}</label>
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
                {t('Remove')}
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
          <label className="block text-xs font-medium text-gray-700 mb-1">{t('Category')}</label>
          <input
            type="text"
            value={category}
            onChange={e => setCategory(e.target.value)}
            placeholder="e.g. shapes"
            className="w-full rounded border border-gray-300 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* SVG Template upload for outline/advanced types */}
        {needsSvg && (
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              {t('SVG Template')}
            </label>
            {svgFile ? (
              <div className="flex items-center gap-2">
                <DocumentArrowUpIcon className="h-5 w-5 text-green-500" />
                <span className="text-xs text-gray-600 truncate max-w-[200px]">{svgFile.name}</span>
                <button
                  type="button"
                  onClick={() => setSvgFile(null)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  {t('Remove')}
                </button>
              </div>
            ) : (
              <input
                type="file"
                accept=".svg,image/svg+xml"
                onChange={e => {
                  const selected = e.target.files?.[0]
                  if (selected) setSvgFile(selected)
                }}
                className="w-full text-sm text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
              />
            )}
            {type === 'outline_style' && (
              <p className="mt-1 text-xs text-gray-400">
                {t('Placeholders (dummy-data-area, qrcode-rect) will be auto-injected if missing.')}
              </p>
            )}
            {type === 'advanced_shape' && (
              <p className="mt-1 text-xs text-gray-400">
                {t('QR code placeholder will be auto-detected and injected if needed.')}
              </p>
            )}
            {['module_style', 'finder_outer_style', 'finder_dot_style'].includes(type) && (
              <p className="mt-1 text-xs text-gray-400">
                {t('SVG paths will be auto-normalized to the correct viewBox.')}
              </p>
            )}
          </div>
        )}

        {/* Metadata fields for advanced_shape */}
        {isAdvanced && (
          <>
            <div className="flex items-center gap-3">
              <label className="text-xs font-medium text-gray-700">{t('Has text input')}</label>
              <Switch checked={hasText} onCheckedChange={setHasText} />
            </div>
            {hasText && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  {t('Text lines (1-3)')}
                </label>
                <input
                  type="number"
                  min={1}
                  max={3}
                  value={textLines}
                  onChange={e => setTextLines(Math.min(3, Math.max(1, Number(e.target.value))))}
                  className="w-full rounded border border-gray-300 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button
          type="submit"
          disabled={isSubmitting || !slug.trim() || !label.trim()}
          className="rounded bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {uploading
            ? t('Uploading...')
            : createMutation.isPending
              ? t('Adding...')
              : t('Add Asset')}
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="rounded border border-gray-300 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          {t('Cancel')}
        </button>
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>
    </form>
  )
}

function AssetTable({ type }: { type: DesignAssetType }) {
  const { t } = useTranslation()
  const { data: assets, isLoading, isError } = useAdminDesignAssets(type)
  const toggleMutation = useToggleDesignAsset()
  const updateMutation = useUpdateDesignAsset()
  const deleteMutation = useDeleteDesignAsset()
  const reorderMutation = useReorderDesignAssets()
  const [showAddForm, setShowAddForm] = useState(false)

  const handleToggle = useCallback(
    (id: number) =>
      toggleMutation.mutate(id, {
        onSuccess: data => {
          const active = (data as DesignAsset)?.is_active
          showSuccessToast(active ? t('Asset activated') : t('Asset deactivated'))
        },
        onError: () => showErrorToast(t('Failed to toggle asset.')),
      }),
    [toggleMutation, t]
  )

  const handleLabelSave = useCallback(
    (id: number, label: string) =>
      updateMutation.mutate(
        { id, label },
        {
          onSuccess: () => showSuccessToast(t('Label updated')),
          onError: () => showErrorToast(t('Failed to update label.')),
        }
      ),
    [updateMutation, t]
  )

  const handleCategorySave = useCallback(
    (id: number, category: string) =>
      updateMutation.mutate(
        { id, category: category || undefined },
        {
          onSuccess: () => showSuccessToast(t('Category updated')),
          onError: () => showErrorToast(t('Failed to update category.')),
        }
      ),
    [updateMutation, t]
  )

  const handleMetadataSave = useCallback(
    (id: number, metadata: Record<string, unknown>) =>
      updateMutation.mutate(
        { id, metadata },
        {
          onSuccess: () => showSuccessToast(t('Metadata updated')),
          onError: () => showErrorToast(t('Failed to update metadata.')),
        }
      ),
    [updateMutation, t]
  )

  const handleDelete = useCallback(
    (id: number, label: string) => {
      if (window.confirm(`Delete "${label}"? This cannot be undone.`)) {
        deleteMutation.mutate(id, {
          onSuccess: () => showSuccessToast(t('Asset deleted')),
          onError: () => showErrorToast(t('Failed to delete asset.')),
        })
      }
    },
    [deleteMutation, t]
  )

  const handleThumbnailReplace = useCallback(
    async (id: number, file: File) => {
      try {
        const result = await designAssetsAPI.uploadThumbnail(file)
        updateMutation.mutate(
          { id, thumbnail_url: result.url },
          {
            onSuccess: () => showSuccessToast(t('Thumbnail updated')),
            onError: () => showErrorToast(t('Failed to update thumbnail.')),
          }
        )
      } catch {
        showErrorToast(t('Failed to upload thumbnail. Max 2MB, allowed: png, jpg, svg, webp, gif.'))
      }
    },
    [updateMutation, t]
  )

  const queryClient = useQueryClient()

  const handleSvgUpload = useCallback(
    async (id: number, file: File) => {
      try {
        const result = await designAssetsAPI.uploadShapeSvg(id, file)
        const analysis = result.analysis
        const warnings = analysis?.warnings ?? []

        let msg = t('SVG analyzed and uploaded successfully.')
        if (analysis) {
          msg += ` ViewBox: ${analysis.viewBox ?? 'auto'}, Paths: ${analysis.pathCount}`
          if (analysis.autoInjected) msg += ` (placeholders auto-injected)`
        }
        if (warnings.length > 0) {
          msg += ` ⚠ ${warnings.join('; ')}`
        }

        showSuccessToast(msg)
        queryClient.invalidateQueries({ queryKey: queryKeys.designAssets.all() })
      } catch (err: unknown) {
        const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        showErrorToast(msg || t('Failed to upload SVG.'))
      }
    },
    [queryClient, type, t]
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
      reorderMutation.mutate(order, {
        onSuccess: () => showSuccessToast(t('Order updated')),
        onError: () => showErrorToast(t('Failed to reorder.')),
      })
    },
    [assets, reorderMutation, t]
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LottieLoader size={80} />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
        {t('Failed to load design assets. Please try again.')}
      </div>
    )
  }

  // All types are now extensible — new shapes are rendered via dynamic render config
  const canAddNew = true

  return (
    <div>
      {/* Extensibility info banners */}
      {type === 'outline_style' && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
          <InformationCircleIcon className="h-5 w-5 mt-0.5 shrink-0" />
          <div>
            <strong>{t('Extensible via SVG upload.')}</strong>{' '}
            {t('Add new outline shapes by uploading SVG templates. Each SVG must contain a')}{' '}
            <code className="bg-green-100 px-1 rounded text-xs">
              {'<path id="dummy-data-area">'}
            </code>{' '}
            {t('and a')}{' '}
            <code className="bg-green-100 px-1 rounded text-xs">{'<rect id="qrcode-rect">'}</code>.
            {t('Use the upload icon per row to attach the SVG.')}
          </div>
        </div>
      )}
      {type === 'preset_logo' && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
          <InformationCircleIcon className="h-5 w-5 mt-0.5 shrink-0" />
          <div>
            <strong>{t('Extensible via image upload.')}</strong>{' '}
            {t(
              'Upload logo images to add new presets. Images are embedded directly in generated QR codes.'
            )}
          </div>
        </div>
      )}
      {type === 'advanced_shape' && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
          <InformationCircleIcon className="h-5 w-5 mt-0.5 shrink-0" />
          <div>
            <strong>{t('Extensible via SVG upload.')}</strong>{' '}
            {t(
              'Add new sticker shapes by uploading SVG templates. Use the upload icon per row to attach the SVG.'
            )}
          </div>
        </div>
      )}

      {/* Add button — only for extensible types */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-gray-500">
          {assets?.length ?? 0} asset{(assets?.length ?? 0) !== 1 ? 's' : ''}
        </span>
        {canAddNew && (
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
            {t('Add Asset')}
          </button>
        )}
      </div>

      {/* Add form */}
      {showAddForm && <AddAssetForm type={type} onClose={() => setShowAddForm(false)} />}

      {/* Table */}
      {!assets || assets.length === 0 ? (
        <div className="rounded-lg bg-gray-50 p-8 text-center text-sm text-gray-500">
          {t('No assets found for this type. Click "Add Asset" to create one.')}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  {t('Preview')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  {t('Label')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  {t('Slug')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  {t('Category')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  {t('Active')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  {t('Order')}
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
                  assetType={type}
                  onToggle={handleToggle}
                  onMoveUp={i => handleMove(i, 'up')}
                  onMoveDown={i => handleMove(i, 'down')}
                  onLabelSave={handleLabelSave}
                  onCategorySave={handleCategorySave}
                  onMetadataSave={handleMetadataSave}
                  onDelete={handleDelete}
                  onThumbnailReplace={handleThumbnailReplace}
                  onSvgUpload={
                    type === 'outline_style' || type === 'advanced_shape'
                      ? handleSvgUpload
                      : undefined
                  }
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
  const { t } = useTranslation()
  const router = useRouter()
  const { isAdmin } = usePermissions()
  const [activeTab, setActiveTab] = useState<string>('module_style')

  useEffect(() => {
    if (!isAdmin()) {
      router.replace('/qrcodes/new')
    }
  }, [isAdmin, router])

  if (!isAdmin()) {
    return null
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1 text-sm text-gray-500">
        <Link href="/system/settings" className="hover:text-gray-700 transition-colors">
          {t('Settings')}
        </Link>
        <ChevronRightIcon className="h-3.5 w-3.5" />
        <span className="font-medium text-gray-900">{t('Design Assets')}</span>
      </nav>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('Design Assets')}</h1>
        <p className="mt-2 text-sm text-gray-600">
          {t(
            'Manage QR code design elements — control visibility, ordering, and labels for module shapes, finder patterns, outlined shapes, advanced stickers, and preset logos.'
          )}
        </p>
      </div>

      {/* Tabs */}
      <div className="mt-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex flex-wrap gap-1">
            {ASSET_TABS.map(tab => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {t(tab.label)}
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
