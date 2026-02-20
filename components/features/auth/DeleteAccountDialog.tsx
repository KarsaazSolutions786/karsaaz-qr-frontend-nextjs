'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { authAPI } from '@/lib/api/endpoints/auth'
import { useAuth } from '@/lib/hooks/useAuth'

interface DeleteAccountDialogProps {
  open: boolean
  onClose: () => void
}

export function DeleteAccountDialog({ open, onClose }: DeleteAccountDialogProps) {
  const [password, setPassword] = useState('')
  const [confirmText, setConfirmText] = useState('')
  const [error, setError] = useState('')
  const { logout } = useAuth()

  const deleteAccountMutation = useMutation({
    mutationFn: (pwd: string) => authAPI.deleteAccount(pwd),
    onSuccess: () => {
      // After successful deletion, log out and redirect
      logout()
    },
    onError: (err: any) => {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to delete account. Please check your password and try again.'
      )
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (confirmText !== 'DELETE') {
      setError('Please type DELETE to confirm.')
      return
    }

    if (!password) {
      setError('Password is required.')
      return
    }

    deleteAccountMutation.mutate(password)
  }

  const handleClose = () => {
    setPassword('')
    setConfirmText('')
    setError('')
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={handleClose} />
      <div className="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
            <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Delete Account</h3>
            <p className="text-sm text-gray-500">This action cannot be undone.</p>
          </div>
        </div>

        <div className="mb-4 rounded-md bg-red-50 p-3">
          <p className="text-sm text-red-800">
            Deleting your account will permanently remove all your data, including:
          </p>
          <ul className="mt-2 list-disc pl-5 text-sm text-red-700 space-y-1">
            <li>All QR codes and their scan data</li>
            <li>Your subscription and billing history</li>
            <li>All files and custom designs</li>
            <li>Sub-user accounts (if any)</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="delete-confirm" className="block text-sm font-medium text-gray-700">
              Type <span className="font-bold text-red-600">DELETE</span> to confirm
            </label>
            <input
              id="delete-confirm"
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500"
              placeholder="DELETE"
              autoComplete="off"
            />
          </div>

          <div>
            <label htmlFor="delete-password" className="block text-sm font-medium text-gray-700">
              Enter your password
            </label>
            <input
              id="delete-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={deleteAccountMutation.isPending}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                deleteAccountMutation.isPending ||
                confirmText !== 'DELETE' ||
                !password
              }
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleteAccountMutation.isPending ? 'Deleting...' : 'Delete My Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
