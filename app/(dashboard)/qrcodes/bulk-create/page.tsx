'use client'

import { useState, useCallback, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { qrcodesAPI, CreateQRCodeRequest } from '@/lib/api/endpoints/qrcodes'
import { QR_TYPES } from '@/lib/constants/qr-types'
import { queryKeys } from '@/lib/query/keys'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { useTranslation } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { LottieLoader } from '@/components/ui/lottie-loader'

// ---------------------------------------------------------------------------
// CSV parsing (handles quoted fields with commas and newlines within quotes)
// ---------------------------------------------------------------------------
function parseCSV(text: string): { headers: string[]; rows: string[][] } {
  const lines = text.trim().split('\n')
  if (lines.length === 0) return { headers: [], rows: [] }

  const parseLine = (line: string): string[] => {
    const result: string[] = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (char === '"') {
        // Handle escaped quote ("")
        if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
          current += '"'
          i++ // skip next quote
        } else {
          inQuotes = !inQuotes
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    result.push(current.trim())
    return result
  }

  const headers = parseLine(lines[0] ?? '').map(h => h.toLowerCase().replace(/\s+/g, '_'))
  const rows = lines
    .slice(1)
    .filter(line => line.trim().length > 0)
    .map(parseLine)

  return { headers, rows }
}

// ---------------------------------------------------------------------------
// Type-specific field mappings and validators
// ---------------------------------------------------------------------------
interface TypeFieldConfig {
  required: string[]
  optional: string[]
  /** Build the `data` object for CreateQRCodeRequest from a row record */
  buildData: (record: Record<string, string>) => Record<string, unknown>
  /** Validate a row record; returns error string or null if valid */
  validate: (record: Record<string, string>) => string | null
}

const TYPE_FIELD_MAP: Record<string, TypeFieldConfig> = {
  url: {
    required: ['name', 'url'],
    optional: [],
    buildData: (r) => ({ url: r.url }),
    validate: (r) => {
      if (!r.name?.trim()) return 'Name is required'
      if (!r.url?.trim()) return 'URL is required'
      try { new URL(r.url); return null } catch { return 'Invalid URL format' }
    },
  },
  text: {
    required: ['name', 'text'],
    optional: [],
    buildData: (r) => ({ url: r.text }), // backend stores static text in url field
    validate: (r) => {
      if (!r.name?.trim()) return 'Name is required'
      if (!r.text?.trim()) return 'Text content is required'
      return null
    },
  },
  email: {
    required: ['name', 'email'],
    optional: ['subject', 'body'],
    buildData: (r) => ({
      email: r.email,
      ...(r.subject ? { subject: r.subject } : {}),
      ...(r.body ? { body: r.body } : {}),
    }),
    validate: (r) => {
      if (!r.name?.trim()) return 'Name is required'
      if (!r.email?.trim()) return 'Email is required'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email)) return 'Invalid email format'
      return null
    },
  },
  call: {
    required: ['name', 'phone'],
    optional: [],
    buildData: (r) => ({ phone: r.phone }),
    validate: (r) => {
      if (!r.name?.trim()) return 'Name is required'
      if (!r.phone?.trim()) return 'Phone number is required'
      return null
    },
  },
  sms: {
    required: ['name', 'phone'],
    optional: ['message'],
    buildData: (r) => ({
      phone: r.phone,
      ...(r.message ? { message: r.message } : {}),
    }),
    validate: (r) => {
      if (!r.name?.trim()) return 'Name is required'
      if (!r.phone?.trim()) return 'Phone number is required'
      return null
    },
  },
  wifi: {
    required: ['name', 'ssid', 'password'],
    optional: ['encryption', 'hidden'],
    buildData: (r) => ({
      ssid: r.ssid,
      password: r.password,
      encryption: r.encryption || 'WPA',
      hidden: r.hidden?.toLowerCase() === 'true',
    }),
    validate: (r) => {
      if (!r.name?.trim()) return 'Name is required'
      if (!r.ssid?.trim()) return 'SSID (network name) is required'
      if (!r.password?.trim()) return 'Password is required'
      const enc = (r.encryption || 'WPA').toUpperCase()
      if (!['WPA', 'WEP', 'NOPASS'].includes(enc)) return 'Encryption must be WPA, WEP, or nopass'
      return null
    },
  },
  vcard: {
    required: ['name', 'first_name', 'last_name'],
    optional: ['email', 'phone', 'organization', 'title', 'website', 'address'],
    buildData: (r) => ({
      first_name: r.first_name,
      last_name: r.last_name,
      ...(r.email ? { email: r.email } : {}),
      ...(r.phone ? { phone: r.phone } : {}),
      ...(r.organization ? { organization: r.organization } : {}),
      ...(r.title ? { title: r.title } : {}),
      ...(r.website ? { website: r.website } : {}),
      ...(r.address ? { address: r.address } : {}),
    }),
    validate: (r) => {
      if (!r.name?.trim()) return 'Name is required'
      if (!r.first_name?.trim()) return 'First name is required'
      if (!r.last_name?.trim()) return 'Last name is required'
      return null
    },
  },
  location: {
    required: ['name', 'latitude', 'longitude'],
    optional: ['address'],
    buildData: (r) => ({
      latitude: parseFloat(r.latitude ?? '0'),
      longitude: parseFloat(r.longitude ?? '0'),
      ...(r.address ? { address: r.address } : {}),
    }),
    validate: (r) => {
      if (!r.name?.trim()) return 'Name is required'
      const lat = parseFloat(r.latitude ?? '')
      const lng = parseFloat(r.longitude ?? '')
      if (isNaN(lat) || lat < -90 || lat > 90) return 'Latitude must be between -90 and 90'
      if (isNaN(lng) || lng < -180 || lng > 180) return 'Longitude must be between -180 and 180'
      return null
    },
  },
  whatsapp: {
    required: ['name', 'phone'],
    optional: ['message'],
    buildData: (r) => ({
      phone: r.phone,
      ...(r.message ? { message: r.message } : {}),
    }),
    validate: (r) => {
      if (!r.name?.trim()) return 'Name is required'
      if (!r.phone?.trim()) return 'Phone number is required'
      return null
    },
  },
}

// Subset of QR types suitable for bulk creation (simple data types)
const BULK_SUPPORTED_TYPES = QR_TYPES.filter(t => TYPE_FIELD_MAP[t.id])

// ---------------------------------------------------------------------------
// Sample CSV template generator
// ---------------------------------------------------------------------------
function generateSampleCSV(typeId: string): string {
  const config = TYPE_FIELD_MAP[typeId]
  if (!config) return 'name,data\nMy QR Code,https://example.com'

  const allFields = [...config.required, ...config.optional]
  const header = allFields.join(',')

  const sampleValues: Record<string, string> = {
    name: 'My QR Code',
    url: 'https://example.com',
    text: 'Hello World',
    email: 'user@example.com',
    subject: 'Hello',
    body: 'Message body',
    phone: '+1234567890',
    message: 'Hello from SMS',
    ssid: 'MyWiFi',
    password: 'password123',
    encryption: 'WPA',
    hidden: 'false',
    first_name: 'John',
    last_name: 'Doe',
    organization: 'Acme Inc',
    title: 'Engineer',
    website: 'https://example.com',
    address: '123 Main St',
    latitude: '40.7128',
    longitude: '-74.0060',
  }

  const sampleRow = allFields.map(f => sampleValues[f] || '').join(',')
  return `${header}\n${sampleRow}`
}

// ---------------------------------------------------------------------------
// Row status type
// ---------------------------------------------------------------------------
interface ParsedRow {
  index: number
  record: Record<string, string>
  error: string | null
  status: 'pending' | 'creating' | 'success' | 'error'
  apiError?: string
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function BulkCreatePage() {
  const { t } = useTranslation()
  const router = useRouter()
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // State
  const [selectedType, setSelectedType] = useState<string>('')
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([])
  const [fileName, setFileName] = useState<string>('')
  const [isDragging, setIsDragging] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [creationProgress, setCreationProgress] = useState(0)
  const [creationComplete, setCreationComplete] = useState(false)

  const typeConfig = TYPE_FIELD_MAP[selectedType]
  const selectedTypeDef = QR_TYPES.find(t => t.id === selectedType)

  // Counts
  const validCount = parsedRows.filter(r => r.error === null).length
  const errorCount = parsedRows.filter(r => r.error !== null).length
  const successCount = parsedRows.filter(r => r.status === 'success').length
  const failedCount = parsedRows.filter(r => r.status === 'error').length

  // Visible columns for the preview table
  const visibleColumns = useMemo(() => {
    if (!typeConfig) return ['name']
    return [...typeConfig.required, ...typeConfig.optional].slice(0, 5) // cap at 5 columns
  }, [typeConfig])

  // ------------------------------------------------------------------
  // CSV processing
  // ------------------------------------------------------------------
  const processCSV = useCallback(
    (text: string) => {
      if (!selectedType || !typeConfig) {
        toast.error(t('Please select a QR code type first'))
        return
      }

      const { headers, rows: rawRows } = parseCSV(text)

      if (headers.length === 0 || rawRows.length === 0) {
        toast.error(t('CSV file appears to be empty or has no data rows'))
        return
      }

      // Check required headers are present
      const missingHeaders = typeConfig.required.filter(h => !headers.includes(h))
      if (missingHeaders.length > 0) {
        toast.error(t('Missing required CSV columns'), {
          description: `${t('Expected')}: ${missingHeaders.join(', ')}. ${t('Found')}: ${headers.join(', ')}`,
        })
        return
      }

      // Build row records
      const allFields = [...typeConfig.required, ...typeConfig.optional]
      const newRows: ParsedRow[] = rawRows.map((row, index) => {
        const record: Record<string, string> = {}
        headers.forEach((header, i) => {
          if (allFields.includes(header)) {
            record[header] = row[i] || ''
          }
        })

        const error = typeConfig.validate(record)

        return {
          index,
          record,
          error,
          status: 'pending' as const,
        }
      })

      setParsedRows(newRows)
      setCreationComplete(false)
      setCreationProgress(0)

      const valid = newRows.filter(r => r.error === null).length
      toast.success(`${t('Parsed')} ${newRows.length} ${t('rows')}`, {
        description: `${valid} ${t('valid')}, ${newRows.length - valid} ${t('with errors')}`,
      })
    },
    [selectedType, typeConfig]
  )

  // ------------------------------------------------------------------
  // File handling
  // ------------------------------------------------------------------
  const handleFile = useCallback(
    (file: File) => {
      if (!file.name.endsWith('.csv') && !file.type.includes('csv') && !file.type.includes('text')) {
        toast.error(t('Please upload a CSV file'))
        return
      }

      setFileName(file.name)
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result
        if (typeof text === 'string') {
          processCSV(text)
        }
      }
      reader.onerror = () => toast.error(t('Failed to read file'))
      reader.readAsText(file)
    },
    [processCSV]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files?.[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFile(file)
      // Reset input so re-uploading the same file triggers change
      e.target.value = ''
    },
    [handleFile]
  )

  // ------------------------------------------------------------------
  // Sample CSV download
  // ------------------------------------------------------------------
  const downloadSample = useCallback(() => {
    if (!selectedType) return
    const csv = generateSampleCSV(selectedType)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bulk-${selectedType}-template.csv`
    a.click()
    URL.revokeObjectURL(url)
  }, [selectedType])

  // ------------------------------------------------------------------
  // Bulk creation (sequential, one at a time)
  // ------------------------------------------------------------------
  const handleCreateAll = useCallback(async () => {
    if (!selectedType || !typeConfig) return

    const validRows = parsedRows.filter(r => r.error === null)
    if (validRows.length === 0) return

    setIsCreating(true)
    setCreationProgress(0)
    setCreationComplete(false)

    let completed = 0
    let succeeded = 0
    let failed = 0

    // Process one at a time to avoid overwhelming the backend
    for (const row of validRows) {
      // Mark row as creating
      setParsedRows(prev =>
        prev.map(r =>
          r.index === row.index ? { ...r, status: 'creating' as const } : r
        )
      )

      try {
        const payload: CreateQRCodeRequest = {
          type: selectedType,
          name: row.record.name || `Bulk ${selectedType} #${row.index + 1}`,
          data: typeConfig.buildData(row.record),
        }

        await qrcodesAPI.create(payload)

        setParsedRows(prev =>
          prev.map(r =>
            r.index === row.index ? { ...r, status: 'success' as const } : r
          )
        )
        succeeded++
      } catch (err: any) {
        const errorMsg =
          err?.response?.data?.message ||
          err?.message ||
          'Failed to create'

        setParsedRows(prev =>
          prev.map(r =>
            r.index === row.index
              ? { ...r, status: 'error' as const, apiError: errorMsg }
              : r
          )
        )
        failed++
      }

      completed++
      setCreationProgress(Math.round((completed / validRows.length) * 100))
    }

    setIsCreating(false)
    setCreationComplete(true)

    // Invalidate QR code queries
    queryClient.invalidateQueries({ queryKey: queryKeys.qrcodes.all() })

    if (failed === 0) {
      toast.success(`${t('All')} ${succeeded} ${t('QR codes created successfully')}`)
    } else {
      toast.warning(`${t('Created')} ${succeeded} ${t('QR codes')}, ${failed} ${t('failed')}`)
    }
  }, [selectedType, typeConfig, parsedRows, queryClient])

  // ------------------------------------------------------------------
  // Reset state when type changes
  // ------------------------------------------------------------------
  const handleTypeChange = useCallback((value: string) => {
    setSelectedType(value)
    setParsedRows([])
    setFileName('')
    setCreationComplete(false)
    setCreationProgress(0)
  }, [])

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          {t('Bulk Create QR Codes')}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t('Upload a CSV file to create multiple QR codes at once. Select a type, download the template, fill in your data, and upload.')}
        </p>
      </div>

      <div className="space-y-6">
        {/* ---- Section 1: Type Selection ---- */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('Step 1: Select QR Code Type')}</CardTitle>
            <CardDescription>
              {t('Choose the type of QR codes you want to create. All rows in the CSV must be the same type.')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-sm">
              <Select value={selectedType} onValueChange={handleTypeChange}>
                <SelectTrigger>
                  <span className={cn('block truncate', !selectedType && 'text-muted-foreground')}>
                    {selectedTypeDef
                      ? `${selectedTypeDef.name} (${selectedTypeDef.cat})`
                      : t('Choose a QR code type...')}
                  </span>
                </SelectTrigger>
                <SelectContent className="max-h-64 overflow-y-auto">
                  {BULK_SUPPORTED_TYPES.map(t => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name} ({t.cat})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedTypeDef && (
              <p className="mt-3 text-sm text-muted-foreground">
                {selectedTypeDef.description}
                {' '}&mdash;{' '}
                {t('Required fields')}:{' '}
                <span className="font-medium text-foreground">
                  {typeConfig?.required.join(', ')}
                </span>
                {typeConfig?.optional.length ? (
                  <>
                    , {t('Optional')}:{' '}
                    <span className="text-foreground">
                      {typeConfig.optional.join(', ')}
                    </span>
                  </>
                ) : null}
              </p>
            )}
          </CardContent>
        </Card>

        {/* ---- Section 2: CSV Upload ---- */}
        {selectedType && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('Step 2: Upload CSV')}</CardTitle>
              <CardDescription>
                {t('Drag and drop a CSV file or click to browse. Need a starting point?')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Template download */}
              <Button variant="outline" size="sm" onClick={downloadSample}>
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"
                  />
                </svg>
                {t('Download CSV Template for')} {selectedTypeDef?.name}
              </Button>

              {/* Drop zone */}
              <div
                className={cn(
                  'relative flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors',
                  isDragging
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500',
                  isCreating && 'pointer-events-none opacity-60'
                )}
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDragging(true)
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,text/csv"
                  className="hidden"
                  onChange={handleFileInput}
                />

                <svg
                  className="mb-3 h-10 w-10 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15"
                  />
                </svg>

                {fileName ? (
                  <p className="text-sm text-foreground">
                    <span className="font-medium">{fileName}</span>
                    <span className="text-muted-foreground">
                      {' '}&mdash; {t('Drop a new file to replace')}
                    </span>
                  </p>
                ) : (
                  <>
                    <p className="text-sm font-medium text-foreground">
                      {t('Drop your CSV file here, or click to browse')}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t('CSV files only (.csv)')}
                    </p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* ---- Section 3: Preview & Validation ---- */}
        {parsedRows.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {t('Step 3: Preview & Validation')}
              </CardTitle>
              <CardDescription>
                <span className="inline-flex items-center gap-2">
                  {validCount > 0 && (
                    <Badge variant="default">
                      {validCount} {t('valid')}
                    </Badge>
                  )}
                  {errorCount > 0 && (
                    <Badge variant="destructive">
                      {errorCount} {errorCount === 1 ? t('error') : t('errors')}
                    </Badge>
                  )}
                  <span>
                    {parsedRows.length} {t('total')} {parsedRows.length === 1 ? t('row') : t('rows')}
                  </span>
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-md border dark:border-gray-700">
                <table className="w-full text-left text-sm">
                  <thead className="border-b bg-gray-50 text-xs font-medium uppercase text-gray-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
                    <tr>
                      <th className="px-4 py-3 w-12">#</th>
                      {visibleColumns.map(col => (
                        <th key={col} className="px-4 py-3">
                          {col.replace(/_/g, ' ')}
                        </th>
                      ))}
                      <th className="px-4 py-3 w-40">{t('Status')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-gray-700">
                    {parsedRows.map(row => (
                      <tr
                        key={row.index}
                        className={cn(
                          'transition-colors',
                          row.error
                            ? 'bg-red-50 dark:bg-red-900/10'
                            : row.status === 'success'
                            ? 'bg-green-50 dark:bg-green-900/10'
                            : row.status === 'error'
                            ? 'bg-red-50 dark:bg-red-900/10'
                            : row.status === 'creating'
                            ? 'bg-blue-50 dark:bg-blue-900/10'
                            : ''
                        )}
                      >
                        <td className="px-4 py-2.5 text-xs text-muted-foreground">
                          {row.index + 1}
                        </td>
                        {visibleColumns.map(col => (
                          <td
                            key={col}
                            className="max-w-[200px] truncate px-4 py-2.5 dark:text-gray-300"
                          >
                            {row.record[col] || (
                              <span className="text-muted-foreground italic">{t('empty')}</span>
                            )}
                          </td>
                        ))}
                        <td className="px-4 py-2.5">
                          <RowStatus row={row} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {parsedRows.length > 20 && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {t('Showing all')} {parsedRows.length} {t('rows')}. {t('Scroll to see more.')}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* ---- Section 4: Creation Progress ---- */}
        {(isCreating || creationComplete) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {isCreating ? t('Creating QR Codes...') : t('Creation Complete')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={creationProgress} className="h-3" />
              <p className="text-sm text-muted-foreground">
                {isCreating
                  ? `${t('Processing...')} ${Math.round(
                      (creationProgress / 100) * validCount
                    )} ${t('of')} ${validCount}`
                  : `${t('Finished')}: ${successCount} ${t('created')}, ${failedCount} ${t('failed')}`}
              </p>
            </CardContent>
          </Card>
        )}

        {/* ---- Section 5: Results Summary ---- */}
        {creationComplete && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('Results')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex items-center gap-2 rounded-lg border bg-green-50 px-4 py-3 dark:bg-green-900/20 dark:border-green-800">
                  <svg
                    className="h-5 w-5 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-sm font-medium text-green-700 dark:text-green-400">
                    {successCount} {t('Created')}
                  </span>
                </div>

                {failedCount > 0 && (
                  <div className="flex items-center gap-2 rounded-lg border bg-red-50 px-4 py-3 dark:bg-red-900/20 dark:border-red-800">
                    <svg
                      className="h-5 w-5 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    <span className="text-sm font-medium text-red-700 dark:text-red-400">
                      {failedCount} {t('Failed')}
                    </span>
                  </div>
                )}

                {errorCount > 0 && (
                  <div className="flex items-center gap-2 rounded-lg border bg-yellow-50 px-4 py-3 dark:bg-yellow-900/20 dark:border-yellow-800">
                    <svg
                      className="h-5 w-5 text-yellow-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                      {errorCount} {t('Skipped (validation errors)')}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button onClick={() => router.push('/qrcodes')}>
                  {t('View All QR Codes')}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setParsedRows([])
                    setFileName('')
                    setCreationComplete(false)
                    setCreationProgress(0)
                  }}
                >
                  {t('Create More')}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ---- Action Buttons ---- */}
        <div className="flex items-center gap-4">
          <Button
            onClick={handleCreateAll}
            disabled={validCount === 0 || isCreating || creationComplete}
            size="lg"
          >
            {isCreating ? (
              <>
                <LottieLoader size={80} />
                {t('Creating...')}
              </>
            ) : (
              `${t('Create')} ${validCount > 0 ? validCount : ''} ${t('QR Code')}${validCount !== 1 ? 's' : ''}`
            )}
          </Button>

          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={isCreating}
          >
            {t('Cancel')}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Row status sub-component
// ---------------------------------------------------------------------------
function RowStatus({ row }: { row: ParsedRow }) {
  const { t } = useTranslation()
  if (row.error) {
    return (
      <span className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400" title={row.error}>
        <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        <span className="truncate max-w-[120px]">{t(row.error)}</span>
      </span>
    )
  }

  switch (row.status) {
    case 'creating':
      return (
        <span className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400">
          <LottieLoader size={80} />
          {t('Creating...')}
        </span>
      )
    case 'success':
      return (
        <span className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
          <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          {t('Created')}
        </span>
      )
    case 'error':
      return (
        <span className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400" title={row.apiError}>
          <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span className="truncate max-w-[120px]">{row.apiError || t('Failed')}</span>
        </span>
      )
    default:
      return (
        <span className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
          <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          {t('Valid')}
        </span>
      )
  }
}
