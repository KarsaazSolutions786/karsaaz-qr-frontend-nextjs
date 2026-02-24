'use client'

import React, { useState, useCallback, createContext, useContext } from 'react'
import {
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline'

type ConfirmationType = 'danger' | 'warning' | 'info' | 'success'

interface ConfirmationOptions {
  title: string
  message: string | React.ReactNode
  type?: ConfirmationType
  confirmText?: string
  cancelText?: string
  confirmButtonClassName?: string
  showCancel?: boolean
}

interface ConfirmationContextValue {
  confirm: (options: ConfirmationOptions) => Promise<boolean>
  alert: (options: Omit<ConfirmationOptions, 'showCancel'>) => Promise<void>
}

const ConfirmationContext = createContext<ConfirmationContextValue | null>(null)

interface ConfirmationState extends ConfirmationOptions {
  isOpen: boolean
  resolve: ((value: boolean) => void) | null
}

const typeConfig: Record<
  ConfirmationType,
  {
    icon: React.ComponentType<{ className?: string }>
    iconBg: string
    iconColor: string
    confirmButtonClass: string
  }
> = {
  danger: {
    icon: ExclamationTriangleIcon,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    confirmButtonClass: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
  },
  warning: {
    icon: ExclamationTriangleIcon,
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    confirmButtonClass: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
  },
  info: {
    icon: InformationCircleIcon,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    confirmButtonClass: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
  },
  success: {
    icon: CheckCircleIcon,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    confirmButtonClass: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
  },
}

export function ConfirmationProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ConfirmationState>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    showCancel: true,
    resolve: null,
  })

  const confirm = useCallback((options: ConfirmationOptions): Promise<boolean> => {
    return new Promise(resolve => {
      setState({
        isOpen: true,
        title: options.title,
        message: options.message,
        type: options.type || 'info',
        confirmText: options.confirmText || 'Confirm',
        cancelText: options.cancelText || 'Cancel',
        confirmButtonClassName: options.confirmButtonClassName,
        showCancel: options.showCancel !== false,
        resolve,
      })
    })
  }, [])

  const alert = useCallback((options: Omit<ConfirmationOptions, 'showCancel'>): Promise<void> => {
    return new Promise(resolve => {
      setState({
        isOpen: true,
        title: options.title,
        message: options.message,
        type: options.type || 'info',
        confirmText: options.confirmText || 'OK',
        cancelText: '',
        showCancel: false,
        resolve: () => resolve(),
      })
    })
  }, [])

  const handleClose = (result: boolean) => {
    if (state.resolve) {
      state.resolve(result)
    }
    setState(prev => ({ ...prev, isOpen: false, resolve: null }))
  }

  const config = typeConfig[state.type || 'info']
  const IconComponent = config.icon

  return (
    <ConfirmationContext.Provider value={{ confirm, alert }}>
      {children}

      {/* Modal Overlay */}
      {state.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => state.showCancel && handleClose(false)}
            />

            {/* Center modal */}
            <span className="hidden sm:inline-block sm:h-screen sm:align-middle">&#8203;</span>

            {/* Modal content */}
            <div className="relative inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div
                    className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${config.iconBg} sm:mx-0 sm:h-10 sm:w-10`}
                  >
                    <IconComponent className={`h-6 w-6 ${config.iconColor}`} />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">{state.title}</h3>
                    <div className="mt-2">
                      {typeof state.message === 'string' ? (
                        <p className="text-sm text-gray-500">{state.message}</p>
                      ) : (
                        state.message
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={() => handleClose(true)}
                  className={`inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${
                    state.confirmButtonClassName || config.confirmButtonClass
                  }`}
                >
                  {state.confirmText}
                </button>
                {state.showCancel && (
                  <button
                    type="button"
                    onClick={() => handleClose(false)}
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {state.cancelText}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </ConfirmationContext.Provider>
  )
}

export function useConfirmation(): ConfirmationContextValue {
  const context = useContext(ConfirmationContext)
  if (!context) {
    throw new Error('useConfirmation must be used within a ConfirmationProvider')
  }
  return context
}

// Standalone confirmation modal component for use without context
interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string | React.ReactNode
  type?: ConfirmationType
  confirmText?: string
  cancelText?: string
  confirmButtonClassName?: string
  showCancel?: boolean
  isLoading?: boolean
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'info',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmButtonClassName,
  showCancel = true,
  isLoading = false,
}: ConfirmationModalProps) {
  if (!isOpen) return null

  const config = typeConfig[type]
  const IconComponent = config.icon

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={showCancel && !isLoading ? onClose : undefined}
        />

        {/* Center modal */}
        <span className="hidden sm:inline-block sm:h-screen sm:align-middle">&#8203;</span>

        {/* Modal content */}
        <div className="relative inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div
                className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${config.iconBg} sm:mx-0 sm:h-10 sm:w-10`}
              >
                <IconComponent className={`h-6 w-6 ${config.iconColor}`} />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
                <div className="mt-2">
                  {typeof message === 'string' ? (
                    <p className="text-sm text-gray-500">{message}</p>
                  ) : (
                    message
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={`inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 ${
                confirmButtonClassName || config.confirmButtonClass
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </>
              ) : (
                confirmText
              )}
            </button>
            {showCancel && (
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                {cancelText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Utility function for quick confirmation
export async function confirmAction(options: ConfirmationOptions): Promise<boolean> {
  return new Promise(resolve => {
    // This is a fallback using window.confirm if no provider is available
    const result = window.confirm(`${options.title}\n\n${options.message}`)
    resolve(result)
  })
}

export default ConfirmationModal
