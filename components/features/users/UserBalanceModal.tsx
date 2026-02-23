'use client'

import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { accountCreditsAPI } from '@/lib/api/endpoints/account-credits'
import apiClient from '@/lib/api/client'
import { queryKeys } from '@/lib/query/keys'
import type { User } from '@/types/entities/user'

interface UserBalanceModalProps {
  user: User
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function UserBalanceModal({ user, isOpen, onClose, onSuccess }: UserBalanceModalProps) {
  const queryClient = useQueryClient()
  const [operation, setOperation] = useState<'add' | 'subtract'>('add')
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')
  const [error, setError] = useState<string | null>(null)

  const { data: balanceData, isLoading: balanceLoading } = useQuery({
    queryKey: ['users', user.id, 'balance'],
    queryFn: () => accountCreditsAPI.getBalance(Number(user.id)),
    enabled: isOpen,
  })

  const mutation = useMutation({
    mutationFn: async () => {
      const value = operation === 'subtract' ? -Math.abs(Number(amount)) : Math.abs(Number(amount))
      const response = await apiClient.post(`/users/${user.id}/change-account-balance`, {
        account_balance: value,
        reason,
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all() })
      queryClient.invalidateQueries({ queryKey: ['users', user.id, 'balance'] })
      onSuccess?.()
      handleClose()
    },
    onError: (err: any) => {
      setError(err?.response?.data?.message || 'Failed to update balance.')
    },
  })

  const handleClose = () => {
    setAmount('')
    setReason('')
    setOperation('add')
    setError(null)
    onClose()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!amount || Number(amount) <= 0) {
      setError('Please enter a valid amount greater than 0.')
      return
    }

    mutation.mutate()
  }

  const currentBalance = balanceData?.account_balance ?? user.account_balance ?? 0

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adjust Account Balance</DialogTitle>
          <DialogDescription>
            {user.name || user.email} — Current balance:{' '}
            {balanceLoading ? (
              <Loader2 className="inline w-3 h-3 animate-spin" />
            ) : (
              <strong>${Number(currentBalance).toFixed(2)}</strong>
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Operation */}
          <div>
            <Label className="mb-2 block">Operation</Label>
            <RadioGroup
              value={operation}
              onValueChange={(val) => setOperation(val as 'add' | 'subtract')}
              className="flex gap-6"
            >
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <RadioGroupItem value="add" />
                Add
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <RadioGroupItem value="subtract" />
                Subtract
              </label>
            </RadioGroup>
          </div>

          {/* Amount */}
          <div>
            <Label htmlFor="balance-amount" className="mb-1.5 block">
              Amount
            </Label>
            <Input
              id="balance-amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          {/* Reason */}
          <div>
            <Label htmlFor="balance-reason" className="mb-1.5 block">
              Reason (optional)
            </Label>
            <Textarea
              id="balance-reason"
              placeholder="Describe the reason for this adjustment..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {operation === 'add' ? 'Add' : 'Subtract'} Balance
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
