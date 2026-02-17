'use client'

import { useState } from 'react'
import { useQRCode } from '@/lib/hooks/queries/useQRCode'
import { useUpdateQRCode } from '@/lib/hooks/mutations/useUpdateQRCode'
import { URLDataForm } from '@/components/features/qrcodes/forms/URLDataForm'
import { VCardDataForm } from '@/components/features/qrcodes/forms/VCardDataForm'

export default function EditQRCodePage({ params }: { params: { id: string } }) {
  const { data: qrcode, isLoading } = useQRCode(params.id)
  const updateMutation = useUpdateQRCode(params.id)
  
  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [qrData, setQRData] = useState<any>(null)

  // Initialize state when qrcode loads
  if (qrcode && !name && !type) {
    setName(qrcode.name)
    setType(qrcode.type)
    setQRData(qrcode.data)
  }

  const handleDataSubmit = (data: any) => {
    setQRData(data)
  }

  const handleUpdate = async () => {
    if (!name || !qrData) return

    try {
      await updateMutation.mutateAsync({
        name,
        data: qrData,
      })
    } catch (error) {
      // Error handled by mutation
    }
  }

  const renderDataForm = () => {
    switch (type) {
      case 'url':
        return <URLDataForm defaultValues={qrcode?.data as any} onSubmit={handleDataSubmit} />
      case 'vcard':
        return <VCardDataForm defaultValues={qrcode?.data as any} onSubmit={handleDataSubmit} />
      default:
        return (
          <div className="rounded-md bg-yellow-50 p-4">
            <p className="text-sm text-yellow-800">
              Form for type "{type}" coming soon.
            </p>
          </div>
        )
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!qrcode) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">QR Code Not Found</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit QR Code</h1>
        <p className="mt-2 text-sm text-gray-600">Update your QR code details</p>
      </div>

      <div className="space-y-8">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Name</h2>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Type: {type}</h2>
          <p className="text-sm text-gray-500">QR code type cannot be changed after creation</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Data</h2>
          {renderDataForm()}
        </div>

        {updateMutation.isError && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">
              {(updateMutation.error as any)?.message || 'Failed to update QR code'}
            </p>
          </div>
        )}

        {updateMutation.isSuccess && (
          <div className="rounded-md bg-green-50 p-4">
            <p className="text-sm text-green-800">QR code updated successfully!</p>
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleUpdate}
            disabled={!name || !qrData || updateMutation.isPending}
            className="rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="rounded-md border border-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
