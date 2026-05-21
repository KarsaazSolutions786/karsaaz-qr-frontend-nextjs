'use client'

import React, { useState, useRef } from 'react'
import { CloudArrowUpIcon, DocumentTextIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useTranslation } from '@/lib/i18n'
import { cn } from '@/lib/utils'

interface AlipayChineseConfig {
  mode: 'sandbox' | 'live'
  app_id: string
  app_secret_cert: string
  app_public_cert: File | null
  app_public_cert_name?: string
  alipay_public_cert: File | null
  alipay_public_cert_name?: string
  alipay_root_cert: File | null
  alipay_root_cert_name?: string
  app_auth_token: string
}

interface AlipayChineseFormProps {
  config: AlipayChineseConfig
  onChange: (config: AlipayChineseConfig) => void
  fieldPrefix?: string
  disabled?: boolean
}

interface CertificateUploadProps {
  label: string
  name: string
  value: File | null
  fileName?: string
  onChange: (file: File | null) => void
  accept?: string
  disabled?: boolean
  description?: string
}

/**
 * Purpose: Executes CertificateUpload functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
function CertificateUpload({
  label,
  name,
  value,
  fileName,
  onChange,
  accept = '.crt',
  disabled = false,
  description,
}: CertificateUploadProps) {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  /**
   * Purpose: Executes handleFileChange functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    onChange(file)
  }

  /**
   * Purpose: Executes handleDrop functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file && file.name.endsWith('.crt')) {
      onChange(file)
    }
  }

  /**
   * Purpose: Executes handleDragOver functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  /**
   * Purpose: Executes handleDragLeave functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handleDragLeave = () => {
    setIsDragging(false)
  }

  /**
   * Purpose: Executes handleClear functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handleClear = () => {
    onChange(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const displayName = value?.name || fileName

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {description && <p className="text-xs text-gray-500">{description}</p>}

      {displayName ? (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
          <DocumentTextIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
          <span className="text-sm text-green-800 flex-1 truncate">{displayName}</span>
          <button
            type="button"
            onClick={handleClear}
            disabled={disabled}
            className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded disabled:opacity-50"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          className={cn(
            'relative border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer',
            isDragging
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50',
            disabled && 'cursor-not-allowed opacity-50'
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !disabled && inputRef.current?.click()}
        >
          <CloudArrowUpIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">
            <span className="font-medium text-blue-600">{t('Click to upload')}</span> {t('or drag and drop')}
          </p>
          <p className="text-xs text-gray-500 mt-1">{accept} {t('files only')}</p>

          <input
            ref={inputRef}
            type="file"
            name={name}
            accept={accept}
            onChange={handleFileChange}
            disabled={disabled}
            className="sr-only"
          />
        </div>
      )}
    </div>
  )
}

/**
 * Purpose: Executes AlipayChineseForm functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function AlipayChineseForm({
  config,
  onChange,
  fieldPrefix = 'alipay_china',
  disabled = false,
}: AlipayChineseFormProps) {
  const { t } = useTranslation()
  /**
   * Purpose: Updates the configuration or state.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const update = <K extends keyof AlipayChineseConfig>(field: K, value: AlipayChineseConfig[K]) => {
    onChange({ ...config, [field]: value })
  }

  /**
   * Purpose: Executes fieldName functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const fieldName = (name: string) => `${fieldPrefix}[${name}]`

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-1">{t('AliPay China Payment Processor')}</h3>
        <p className="text-sm text-blue-700">
          {t('Configure AliPay China payment integration with certificate-based authentication.')}
        </p>
      </div>

      {/* Mode Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('Mode')}</label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => update('mode', 'sandbox')}
            disabled={disabled}
            className={cn(
              'flex-1 py-2 px-4 rounded-lg border-2 text-sm font-medium transition-all',
              config.mode === 'sandbox'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
            )}
          >
            {t('Sandbox')}
          </button>
          <button
            type="button"
            onClick={() => update('mode', 'live')}
            disabled={disabled}
            className={cn(
              'flex-1 py-2 px-4 rounded-lg border-2 text-sm font-medium transition-all',
              config.mode === 'live'
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
            )}
          >
            {t('Live')}
          </button>
        </div>
        {config.mode === 'sandbox' && (
          <p className="mt-2 text-xs text-yellow-600">
            {t('Sandbox mode is for testing only. Switch to Live for production.')}
          </p>
        )}
      </div>

      {/* App ID */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('App ID')}</label>
        <input
          type="text"
          name={fieldName('app_id')}
          value={config.app_id}
          onChange={e => update('app_id', e.target.value)}
          placeholder="54654658"
          disabled={disabled}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:opacity-50"
        />
      </div>

      {/* App Secret Cert */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('App Secret Cert')}</label>
        <textarea
          name={fieldName('app_secret_cert')}
          value={config.app_secret_cert}
          onChange={e => update('app_secret_cert', e.target.value)}
          placeholder="-----BEGIN RSA PRIVATE KEY-----&#10;...&#10;-----END RSA PRIVATE KEY-----"
          disabled={disabled}
          rows={6}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-mono focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:opacity-50"
        />
        <p className="mt-1 text-xs text-gray-500">
          {t("Paste your application's private key certificate content")}
        </p>
      </div>

      {/* Certificate Files */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-900 border-b pb-2">{t('Certificate Files')}</h4>

        <CertificateUpload
          label={t('App Public Certificate')}
          name={fieldName('app_public_cert')}
          value={config.app_public_cert}
          fileName={config.app_public_cert_name}
          onChange={file => {
            update('app_public_cert', file)
            update('app_public_cert_name', file?.name || '')
          }}
          accept=".crt"
          disabled={disabled}
          description={t("Your application's public certificate file")}
        />

        <CertificateUpload
          label={t('AliPay Public Cert')}
          name={fieldName('alipay_public_cert')}
          value={config.alipay_public_cert}
          fileName={config.alipay_public_cert_name}
          onChange={file => {
            update('alipay_public_cert', file)
            update('alipay_public_cert_name', file?.name || '')
          }}
          accept=".crt"
          disabled={disabled}
          description={t("AliPay's public certificate for verification")}
        />

        <CertificateUpload
          label={t('AliPay Root Cert')}
          name={fieldName('alipay_root_cert')}
          value={config.alipay_root_cert}
          fileName={config.alipay_root_cert_name}
          onChange={file => {
            update('alipay_root_cert', file)
            update('alipay_root_cert_name', file?.name || '')
          }}
          accept=".crt"
          disabled={disabled}
          description={t("AliPay's root CA certificate")}
        />
      </div>

      {/* App Auth Token (Optional) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('App Auth Token')}
          <span className="text-gray-400 font-normal ml-1">{t('(Optional)')}</span>
        </label>
        <input
          type="text"
          name={fieldName('app_auth_token')}
          value={config.app_auth_token}
          onChange={e => update('app_auth_token', e.target.value)}
          placeholder="Optional"
          disabled={disabled}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:opacity-50"
        />
        <p className="mt-1 text-xs text-gray-500">
          {t('Required for third-party authorization scenarios')}
        </p>
      </div>

      {/* Validation Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">{t('Configuration Status')}</h4>
        <ul className="space-y-1 text-sm">
          <li className="flex items-center gap-2">
            <span
              className={cn('w-2 h-2 rounded-full', config.app_id ? 'bg-green-500' : 'bg-gray-300')}
            />
            <span className={config.app_id ? 'text-gray-700' : 'text-gray-400'}>
              {t('App ID')} {config.app_id ? t('configured') : t('required')}
            </span>
          </li>
          <li className="flex items-center gap-2">
            <span
              className={cn(
                'w-2 h-2 rounded-full',
                config.app_secret_cert ? 'bg-green-500' : 'bg-gray-300'
              )}
            />
            <span className={config.app_secret_cert ? 'text-gray-700' : 'text-gray-400'}>
              {t('App Secret Cert')} {config.app_secret_cert ? t('configured') : t('required')}
            </span>
          </li>
          <li className="flex items-center gap-2">
            <span
              className={cn(
                'w-2 h-2 rounded-full',
                config.app_public_cert || config.app_public_cert_name
                  ? 'bg-green-500'
                  : 'bg-gray-300'
              )}
            />
            <span
              className={
                config.app_public_cert || config.app_public_cert_name
                  ? 'text-gray-700'
                  : 'text-gray-400'
              }
            >
              {t('App Public Certificate')}{' '}
              {config.app_public_cert || config.app_public_cert_name ? t('uploaded') : t('required')}
            </span>
          </li>
          <li className="flex items-center gap-2">
            <span
              className={cn(
                'w-2 h-2 rounded-full',
                config.alipay_public_cert || config.alipay_public_cert_name
                  ? 'bg-green-500'
                  : 'bg-gray-300'
              )}
            />
            <span
              className={
                config.alipay_public_cert || config.alipay_public_cert_name
                  ? 'text-gray-700'
                  : 'text-gray-400'
              }
            >
              {t('AliPay Public Cert')}{' '}
              {config.alipay_public_cert || config.alipay_public_cert_name
                ? t('uploaded')
                : t('required')}
            </span>
          </li>
          <li className="flex items-center gap-2">
            <span
              className={cn(
                'w-2 h-2 rounded-full',
                config.alipay_root_cert || config.alipay_root_cert_name
                  ? 'bg-green-500'
                  : 'bg-gray-300'
              )}
            />
            <span
              className={
                config.alipay_root_cert || config.alipay_root_cert_name
                  ? 'text-gray-700'
                  : 'text-gray-400'
              }
            >
              {t('AliPay Root Cert')}{' '}
              {config.alipay_root_cert || config.alipay_root_cert_name ? t('uploaded') : t('required')}
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}

// Default configuration factory
/**
 * Purpose: Executes createDefaultAlipayChineseConfig functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function createDefaultAlipayChineseConfig(): AlipayChineseConfig {
  return {
    mode: 'sandbox',
    app_id: '',
    app_secret_cert: '',
    app_public_cert: null,
    alipay_public_cert: null,
    alipay_root_cert: null,
    app_auth_token: '',
  }
}

export default AlipayChineseForm
