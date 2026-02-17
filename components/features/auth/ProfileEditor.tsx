'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useUpdateProfile } from '@/lib/hooks/mutations/useUpdateProfile'
import { User } from '@/types/entities/user'

const profileSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    currentPassword: z.string().optional(),
    newPassword: z.string().min(8, 'Password must be at least 8 characters').optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.newPassword && !data.currentPassword) {
        return false
      }
      return true
    },
    {
      message: 'Current password is required to change password',
      path: ['currentPassword'],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword !== data.confirmPassword) {
        return false
      }
      return true
    },
    {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }
  )

type ProfileFormData = z.infer<typeof profileSchema>

interface ProfileEditorProps {
  user: User
}

export function ProfileEditor({ user }: ProfileEditorProps) {
  const [showPasswords, setShowPasswords] = useState(false)
  const updateProfileMutation = useUpdateProfile()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  })

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const updateData: any = {
        name: data.name,
        email: data.email,
      }

      if (data.newPassword && data.currentPassword) {
        updateData.currentPassword = data.currentPassword
        updateData.newPassword = data.newPassword
      }

      await updateProfileMutation.mutateAsync(updateData)
      reset(data)
    } catch (error) {
      // Error handled by mutation
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          {...register('name')}
          id="name"
          type="text"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          {...register('email')}
          id="email"
          type="email"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>

        <div className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
              Current Password
            </label>
            <input
              {...register('currentPassword')}
              id="currentPassword"
              type={showPasswords ? 'text' : 'password'}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
            {errors.currentPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              {...register('newPassword')}
              id="newPassword"
              type={showPasswords ? 'text' : 'password'}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              {...register('confirmPassword')}
              id="confirmPassword"
              type={showPasswords ? 'text' : 'password'}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="showPasswords"
              checked={showPasswords}
              onChange={(e) => setShowPasswords(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="showPasswords" className="ml-2 block text-sm text-gray-900">
              Show passwords
            </label>
          </div>
        </div>
      </div>

      {updateProfileMutation.isError && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">
            {(updateProfileMutation.error as any)?.message ||
              'Profile update failed. Please try again.'}
          </p>
        </div>
      )}

      {updateProfileMutation.isSuccess && (
        <div className="rounded-md bg-green-50 p-4">
          <p className="text-sm text-green-800">Profile updated successfully!</p>
        </div>
      )}

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={!isDirty || isSubmitting || updateProfileMutation.isPending}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting || updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
        </button>

        <button
          type="button"
          onClick={() => reset()}
          disabled={!isDirty || isSubmitting}
          className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
