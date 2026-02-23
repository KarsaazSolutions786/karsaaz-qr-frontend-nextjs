'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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
import { useRoles } from '@/lib/hooks/queries/useRoles'
import { usersAPI } from '@/lib/api/endpoints/users'
import { queryKeys } from '@/lib/query/keys'

interface SubuserInviteModalProps {
  parentUserId: number | string
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function SubuserInviteModal({ parentUserId, isOpen, onClose, onSuccess }: SubuserInviteModalProps) {
  const queryClient = useQueryClient()
  const { data: rolesData } = useRoles()
  const roles = rolesData?.data ?? []

  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [roleId, setRoleId] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: () =>
      usersAPI.inviteSubUser(Number(parentUserId), {
        name,
        email,
        folder_id: roleId || '',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(String(parentUserId)) })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all() })
      onSuccess?.()
      handleClose()
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        Object.values(err?.response?.data?.errors || {}).flat().join(' ') ||
        'Failed to send invitation.'
      setError(msg as string)
    },
  })

  const handleClose = () => {
    setEmail('')
    setName('')
    setRoleId('')
    setMessage('')
    setError(null)
    onClose()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email) {
      setError('Email is required.')
      return
    }

    mutation.mutate()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Sub-User</DialogTitle>
          <DialogDescription>
            Send an invitation to join as a sub-user under this account.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <Label htmlFor="invite-name" className="mb-1.5 block">
              Name
            </Label>
            <Input
              id="invite-name"
              type="text"
              placeholder="Sub-user name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="invite-email" className="mb-1.5 block">
              Email Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="invite-email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Role */}
          <div>
            <Label htmlFor="invite-role" className="mb-1.5 block">
              Role
            </Label>
            <select
              id="invite-role"
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">— Select a role —</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          {/* Message */}
          <div>
            <Label htmlFor="invite-message" className="mb-1.5 block">
              Message (optional)
            </Label>
            <Textarea
              id="invite-message"
              placeholder="Add a personal message to the invitation..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Send Invitation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
