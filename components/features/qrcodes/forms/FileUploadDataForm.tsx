'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { fileUploadDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'
import { useRef } from 'react'

type FileUploadDataFormData = z.infer<typeof fileUploadDataSchema>

interface FileUploadDataFormProps {
  defaultValues?: FileUploadDataFormData
  onSubmit: (data: FileUploadDataFormData) => void
}

export function FileUploadDataForm({ defaultValues, onSubmit }: FileUploadDataFormProps) {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FileUploadDataFormData>({
    resolver: zodResolver(fileUploadDataSchema),
    defaultValues,
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      const token = localStorage.getItem('token')
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://app.karsaazqr.com/api'
      const res = await fetch(`${baseUrl}/qrcodes/data-file`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      const data = await res.json()
      if (data?.id) {
        setValue('file_id', String(data.id))
      }
    } catch {
      // Upload failed silently
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input {...register('name')} id="name" type="text" placeholder="File name" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>
      <div>
        <label htmlFor="file" className="block text-sm font-medium text-gray-700">Upload File</label>
        <input ref={fileInputRef} id="file" type="file" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        <input {...register('file_id')} type="hidden" />
        {errors.file_id && <p className="mt-1 text-sm text-red-600">{errors.file_id.message}</p>}
      </div>
      <div>
        <label htmlFor="expires_at" className="block text-sm font-medium text-gray-700">Expires At</label>
        <input {...register('expires_at')} id="expires_at" type="date" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
        {errors.expires_at && <p className="mt-1 text-sm text-red-600">{errors.expires_at.message}</p>}
      </div>
    </form>
  )
}
