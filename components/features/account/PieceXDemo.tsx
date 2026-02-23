'use client'

import { useState } from 'react'

interface MarketplaceItem {
  id: string
  name: string
  description: string
  category: string
}

const DEMO_ITEMS: MarketplaceItem[] = [
  {
    id: 'qr-analytics',
    name: 'Advanced Analytics',
    description: 'Detailed scan analytics with geographic heatmaps and device breakdowns.',
    category: 'Analytics',
  },
  {
    id: 'qr-bulk',
    name: 'Bulk QR Generator',
    description: 'Generate hundreds of QR codes at once from CSV or spreadsheet data.',
    category: 'Productivity',
  },
  {
    id: 'qr-branding',
    name: 'Brand Kit',
    description: 'Custom logos, colors, and frames for branded QR code designs.',
    category: 'Design',
  },
  {
    id: 'qr-api',
    name: 'API Access',
    description: 'Programmatic QR code creation and management via REST API.',
    category: 'Developer',
  },
]

export function PieceXDemo() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const categories = ['All', ...new Set(DEMO_ITEMS.map(item => item.category))]

  const filtered =
    selectedCategory === 'All'
      ? DEMO_ITEMS
      : DEMO_ITEMS.filter(item => item.category === selectedCategory)

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Marketplace</h3>
        <p className="mt-1 text-sm text-gray-500">
          Explore add-ons and extensions to enhance your QR code experience.
        </p>
      </div>

      {/* Category filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              selectedCategory === cat
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Items grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map(item => (
          <div
            key={item.id}
            className="rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md"
          >
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-900">{item.name}</h4>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                {item.category}
              </span>
            </div>
            <p className="text-sm text-gray-600">{item.description}</p>
            <button
              type="button"
              className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Learn more →
            </button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-8 text-center text-sm text-gray-500">No items in this category yet.</p>
      )}
    </div>
  )
}
