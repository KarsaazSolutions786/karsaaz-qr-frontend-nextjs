'use client'

import type { PaymentGateway } from '@/types/entities/payment-gateway'

interface PaymentGatewayListProps {
  gateways: PaymentGateway[]
  onToggle: (id: number, enabled: boolean) => void
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}

export default function PaymentGatewayList({ gateways, onToggle, onEdit, onDelete }: PaymentGatewayListProps) {
  if (gateways.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
        <p className="text-sm text-gray-500">No payment gateways configured yet.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Slug</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Mode</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Enabled</th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {gateways.map((gw) => (
            <tr key={gw.id} className="hover:bg-gray-50 transition-colors">
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{gw.name}</td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 font-mono">{gw.slug}</td>
              <td className="whitespace-nowrap px-6 py-4">
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    gw.mode === 'live'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {gw.mode}
                </span>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <button
                  onClick={() => onToggle(gw.id, !gw.enabled)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    gw.enabled ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                  role="switch"
                  aria-checked={gw.enabled}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      gw.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                <button
                  onClick={() => onEdit(gw.id)}
                  className="mr-3 font-medium text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(gw.id)}
                  className="font-medium text-red-600 hover:text-red-800 transition-colors"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
