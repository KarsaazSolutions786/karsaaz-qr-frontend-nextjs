'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '@/lib/utils'

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  phone: z.string().optional(),
  message: z.string().min(1, 'Message is required').max(2000),
})

export type ContactFormValues = z.infer<typeof contactSchema>

interface ContactFormProps {
  onSubmit: (data: ContactFormValues) => void | Promise<void>
  isLoading?: boolean
  defaultValues?: Partial<ContactFormValues>
  className?: string
}

const inputClass = cn(
  'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm',
  'placeholder:text-gray-400',
  'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
  'disabled:cursor-not-allowed disabled:opacity-50'
)

export function ContactForm({ onSubmit, isLoading, defaultValues, className }: ContactFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', phone: '', message: '', ...defaultValues },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn('space-y-4', className)}>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Name *</label>
        <input {...register('name')} placeholder="Your name" disabled={isLoading} className={inputClass} />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Email *</label>
        <input {...register('email')} type="email" placeholder="you@example.com" disabled={isLoading} className={inputClass} />
        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Phone</label>
        <input {...register('phone')} type="tel" placeholder="+1 (555) 000-0000" disabled={isLoading} className={inputClass} />
        {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Message *</label>
        <textarea
          {...register('message')}
          rows={4}
          placeholder="Your message…"
          disabled={isLoading}
          className={cn(inputClass, 'h-auto resize-y')}
        />
        {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={cn(
          'inline-flex h-10 w-full items-center justify-center rounded-md bg-blue-600 px-4 text-sm font-medium text-white',
          'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50'
        )}
      >
        {isLoading ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  )
}
