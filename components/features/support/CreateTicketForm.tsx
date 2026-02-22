'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { CreateTicketPayload } from '@/types/entities/support-ticket'

const ticketSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']),
  department: z.enum(['Technical', 'Billing']),
})

type TicketFormData = z.infer<typeof ticketSchema>

interface CreateTicketFormProps {
  onSubmit: (data: CreateTicketPayload) => void | Promise<void>
  isLoading: boolean
  defaultEmail?: string
  defaultName?: string
}

export default function CreateTicketForm({
  onSubmit,
  isLoading,
  defaultEmail,
  defaultName,
}: CreateTicketFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      name: defaultName || '',
      email: defaultEmail || '',
      priority: 'Medium',
      department: 'Technical',
      subject: '',
      message: '',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white shadow-md rounded-lg p-6">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          {...register('name')}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          {...register('email')}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
          Subject <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="subject"
          {...register('subject')}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
        {errors.subject && <p className="mt-1 text-xs text-red-600">{errors.subject.message}</p>}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          rows={6}
          {...register('message')}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          placeholder="Describe your issue in detail..."
        />
        {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Priority */}
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
            Priority
          </label>
          <select
            id="priority"
            {...register('priority')}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>

        {/* Department */}
        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700">
            Department
          </label>
          <select
            id="department"
            {...register('department')}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            <option value="Technical">Technical</option>
            <option value="Billing">Billing</option>
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 border-t pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Submitting...' : 'Submit Ticket'}
        </button>
      </div>
    </form>
  )
}
