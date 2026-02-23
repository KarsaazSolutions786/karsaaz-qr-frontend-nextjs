import type { OpeningHoursBlockData } from '@/types/entities/biolink'

interface OpeningHoursBlockProps {
  block: OpeningHoursBlockData
  isEditing?: boolean
  onUpdate?: (data: OpeningHoursBlockData['data']) => void
}

const DEFAULT_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function OpeningHoursBlock({ block, isEditing, onUpdate }: OpeningHoursBlockProps) {
  const { title, hours } = block.data

  if (isEditing) {
    const initHours = () => {
      onUpdate?.({
        ...block.data,
        hours: DEFAULT_DAYS.map((day) => ({ day, open: '09:00', close: '17:00', closed: false })),
      })
    }

    const updateHour = (index: number, field: string, value: string | boolean) => {
      const newHours = hours.map((h, i) =>
        i === index ? { day: h.day, open: h.open, close: h.close, closed: h.closed, [field]: value } : h
      )
      onUpdate?.({ ...block.data, hours: newHours })
    }

    return (
      <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title (optional)</label>
          <input
            type="text"
            value={title || ''}
            onChange={(e) => onUpdate?.({ ...block.data, title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        {hours.length === 0 ? (
          <button
            type="button"
            onClick={initHours}
            className="w-full rounded-md border-2 border-dashed border-gray-300 p-4 text-sm text-gray-500 hover:border-blue-500"
          >
            + Initialize Weekly Hours
          </button>
        ) : (
          <div className="space-y-2">
            {hours.map((h, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <span className="w-24 font-medium text-gray-700">{h.day}</span>
                <input
                  type="time"
                  value={h.open}
                  onChange={(e) => updateHour(index, 'open', e.target.value)}
                  disabled={h.closed}
                  className="rounded-md border-gray-300 text-sm shadow-sm"
                />
                <span className="text-gray-400">–</span>
                <input
                  type="time"
                  value={h.close}
                  onChange={(e) => updateHour(index, 'close', e.target.value)}
                  disabled={h.closed}
                  className="rounded-md border-gray-300 text-sm shadow-sm"
                />
                <label className="flex items-center gap-1 text-xs text-gray-500">
                  <input
                    type="checkbox"
                    checked={h.closed || false}
                    onChange={(e) => updateHour(index, 'closed', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  Closed
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  if (hours.length === 0) return null

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      {title && <h3 className="mb-3 text-center text-lg font-semibold text-gray-900">🕐 {title}</h3>}
      <div className="space-y-2">
        {hours.map((h, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700">{h.day}</span>
            <span className={h.closed ? 'text-red-500' : 'text-gray-600'}>
              {h.closed ? 'Closed' : `${h.open} – ${h.close}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
