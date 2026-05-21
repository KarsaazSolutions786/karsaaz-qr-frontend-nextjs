'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n'
import { Loader2, Shield, Mail, Lock } from 'lucide-react'

interface MegaConnectorModalProps {
  open: boolean
  onClose: () => void
  onConnect: (email: string, password: string) => void
  isConnecting: boolean
}

/**
 * Purpose: Executes MegaConnectorModal functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export function MegaConnectorModal({
  open,
  onClose,
  onConnect,
  isConnecting,
}: MegaConnectorModalProps) {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  /**
   * Purpose: Executes handleSubmit functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: March 2026
   */
  const handleSubmit = () => {
    if (!email.trim()) {
      setError(t('Please enter your email'))
      return
    }
    if (!password.trim()) {
      setError(t('Please enter your password'))
      return
    }
    setError('')
    onConnect(email, password)
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && !isConnecting && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600">
              <span className="text-sm font-bold text-white">M</span>
            </div>
            {t('Connect MEGA Account')}
          </DialogTitle>
          <DialogDescription>
            {t('Enter your MEGA account credentials to connect. Your credentials are encrypted and stored securely.')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Email */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
              <Mail className="h-3.5 w-3.5" />
              {t('Email')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={isConnecting}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
              <Lock className="h-3.5 w-3.5" />
              {t('Password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              disabled={isConnecting}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Security note */}
          <div className="flex items-start gap-2 text-xs text-gray-500">
            <Shield className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
            <p>{t('Your credentials are encrypted using AES-256 before storage.')}</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isConnecting}>
            {t('Cancel')}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isConnecting || !email.trim() || !password.trim()}
          >
            {isConnecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('Connecting...')}
              </>
            ) : (
              t('Connect MEGA')
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
