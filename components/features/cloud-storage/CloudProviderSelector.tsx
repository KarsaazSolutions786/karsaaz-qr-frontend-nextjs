'use client'

import React, { useState } from 'react'
import { ArrowLeftIcon, CloudIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import { CLOUD_PROVIDERS, CloudProvider, CloudProviderType } from '@/types/entities/cloud-storage'
import { MegaConnector } from './MegaConnector'
import { OAuthConnector } from './OAuthConnector'

interface CloudProviderSelectorProps {
  isOpen: boolean
  onClose: () => void
  onConnectionSuccess: (provider: CloudProviderType) => void
}

type Step = 'select' | 'connect'

export function CloudProviderSelector({
  isOpen,
  onClose,
  onConnectionSuccess,
}: CloudProviderSelectorProps) {
  const [step, setStep] = useState<Step>('select')
  const [selectedProvider, setSelectedProvider] = useState<CloudProvider | null>(null)

  const handleProviderSelect = (provider: CloudProvider) => {
    setSelectedProvider(provider)
    setStep('connect')
  }

  const handleBack = () => {
    setStep('select')
    setSelectedProvider(null)
  }

  const handleSuccess = () => {
    if (selectedProvider) {
      onConnectionSuccess(selectedProvider.id)
    }
    onClose()
    // Reset state
    setStep('select')
    setSelectedProvider(null)
  }

  if (!isOpen) return null

  const title =
    step === 'connect' && selectedProvider
      ? `Connect ${selectedProvider.name}`
      : 'Choose Cloud Provider'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>

        {/* Body */}
        <div className="p-6">
          {step === 'select' ? (
            <div className="grid grid-cols-2 gap-3">
              {CLOUD_PROVIDERS.map(provider => (
                <button
                  key={provider.id}
                  type="button"
                  onClick={() => handleProviderSelect(provider)}
                  className="flex flex-col items-center gap-2 p-5 border border-gray-200 rounded-xl bg-white hover:border-blue-400 hover:bg-blue-50 transition-all"
                >
                  {provider.icon ? (
                    <img
                      src={provider.icon}
                      alt={provider.name}
                      className="w-10 h-10 object-contain"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <CloudIcon className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-900">{provider.name}</span>
                </button>
              ))}
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mb-4"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                Back to providers
              </button>

              {selectedProvider?.type === 'credentials' ? (
                <MegaConnector onSuccess={handleSuccess} />
              ) : (
                <OAuthConnector
                  provider={selectedProvider!.id}
                  providerName={selectedProvider!.name}
                  onSuccess={handleSuccess}
                />
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {step === 'select' && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Connection Card Component
interface CloudConnectionCardProps {
  connection: {
    id: string
    provider: CloudProviderType
    providerName: string
    email?: string
    connected_at: string
    status: 'active' | 'expired' | 'error'
  }
  onTest: () => void
  onDelete: () => void
  isDeleting?: boolean
  isTesting?: boolean
}

export function CloudConnectionCard({
  connection,
  onTest,
  onDelete,
  isDeleting,
  isTesting,
}: CloudConnectionCardProps) {
  const provider = CLOUD_PROVIDERS.find(p => p.id === connection.provider)

  return (
    <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg bg-white">
      {/* Provider Icon */}
      <div className="flex-shrink-0">
        {provider?.icon ? (
          <img
            src={provider.icon}
            alt={connection.providerName}
            className="w-10 h-10 object-contain"
          />
        ) : (
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <CloudIcon className="w-6 h-6 text-gray-400" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900">{connection.providerName}</h4>
        {connection.email && <p className="text-sm text-gray-500 truncate">{connection.email}</p>}
        <div className="flex items-center gap-2 mt-1">
          <span
            className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', {
              'bg-green-100 text-green-700': connection.status === 'active',
              'bg-yellow-100 text-yellow-700': connection.status === 'expired',
              'bg-red-100 text-red-700': connection.status === 'error',
            })}
          >
            {connection.status}
          </span>
          <span className="text-xs text-gray-400">
            Connected {new Date(connection.connected_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onTest}
          disabled={isTesting}
          className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-50"
        >
          {isTesting ? 'Testing...' : 'Test'}
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={isDeleting}
          className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
        >
          {isDeleting ? 'Removing...' : 'Remove'}
        </button>
      </div>
    </div>
  )
}

export default CloudProviderSelector
