'use client'

import React from 'react'
import { BaseDesigner, DesignSettings, DesignerTab } from '../base/BaseDesigner'
import { cn } from '@/lib/utils'

export interface EventDesignSettings extends DesignSettings {
  // Event-specific settings
  eventHeaderStyle?: 'banner' | 'minimal' | 'centered'
  showCountdown?: boolean
  countdownStyle?: 'digital' | 'flip' | 'minimal'
  mapStyle?: 'standard' | 'satellite' | 'dark'
  showAddToCalendar?: boolean
  calendarButtonStyle?: 'filled' | 'outline' | 'link'
  calendarButtonColor?: string
  showShareButtons?: boolean
  ticketButtonColor?: string
  ticketButtonText?: string
  showOrganizer?: boolean
  showVenue?: boolean
  showSchedule?: boolean
  scheduleStyle?: 'timeline' | 'list' | 'cards'
}

interface EventDesignerProps {
  design: EventDesignSettings
  onChange: (design: EventDesignSettings) => void
}

const tabs: DesignerTab[] = [
  { id: 'colors', label: 'Colors', icon: '🎨' },
  { id: 'typography', label: 'Typography', icon: '📝' },
  { id: 'buttons', label: 'Buttons', icon: '🔘' },
  { id: 'layout', label: 'Layout', icon: '📐' },
  { id: 'event', label: 'Event Options', icon: '📅' },
]

export function EventDesigner({ design, onChange }: EventDesignerProps) {
  const updateDesign = (updates: Partial<EventDesignSettings>) => {
    onChange({ ...design, ...updates })
  }

  const renderEventOptionsContent = () => (
    <div className="space-y-6 mt-4 pt-4 border-t">
      <h4 className="font-medium text-gray-900">Event Display Options</h4>

      {/* Header Style */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Header Style</label>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'banner', label: 'Full Banner' },
            { value: 'minimal', label: 'Minimal' },
            { value: 'centered', label: 'Centered' },
          ].map(option => (
            <button
              key={option.value}
              onClick={() =>
                updateDesign({
                  eventHeaderStyle: option.value as EventDesignSettings['eventHeaderStyle'],
                })
              }
              className={cn(
                'px-3 py-2 border rounded-lg text-sm',
                design.eventHeaderStyle === option.value
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-300'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Countdown */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showCountdown"
            checked={design.showCountdown ?? true}
            onChange={e => updateDesign({ showCountdown: e.target.checked })}
            className="rounded border-gray-300"
          />
          <label htmlFor="showCountdown" className="text-sm text-gray-700">
            Show Countdown Timer
          </label>
        </div>

        {design.showCountdown && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Countdown Style</label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'digital', label: 'Digital' },
                { value: 'flip', label: 'Flip Cards' },
                { value: 'minimal', label: 'Minimal' },
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() =>
                    updateDesign({
                      countdownStyle: option.value as EventDesignSettings['countdownStyle'],
                    })
                  }
                  className={cn(
                    'px-3 py-2 border rounded-lg text-sm',
                    design.countdownStyle === option.value
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-300'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Map Style */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Map Style</label>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'standard', label: 'Standard' },
            { value: 'satellite', label: 'Satellite' },
            { value: 'dark', label: 'Dark Mode' },
          ].map(option => (
            <button
              key={option.value}
              onClick={() =>
                updateDesign({ mapStyle: option.value as EventDesignSettings['mapStyle'] })
              }
              className={cn(
                'px-3 py-2 border rounded-lg text-sm',
                design.mapStyle === option.value
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-300'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar Button */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showAddToCalendar"
            checked={design.showAddToCalendar ?? true}
            onChange={e => updateDesign({ showAddToCalendar: e.target.checked })}
            className="rounded border-gray-300"
          />
          <label htmlFor="showAddToCalendar" className="text-sm text-gray-700">
            Show Add to Calendar Button
          </label>
        </div>

        {design.showAddToCalendar && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calendar Button Style
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'filled', label: 'Filled' },
                  { value: 'outline', label: 'Outline' },
                  { value: 'link', label: 'Link' },
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() =>
                      updateDesign({
                        calendarButtonStyle:
                          option.value as EventDesignSettings['calendarButtonStyle'],
                      })
                    }
                    className={cn(
                      'px-3 py-2 border rounded-lg text-sm',
                      design.calendarButtonStyle === option.value
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-300'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Calendar Button Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={design.calendarButtonColor || '#3b82f6'}
                  onChange={e => updateDesign({ calendarButtonColor: e.target.value })}
                  className="h-10 w-16 rounded border cursor-pointer"
                />
                <input
                  type="text"
                  value={design.calendarButtonColor || '#3b82f6'}
                  onChange={e => updateDesign({ calendarButtonColor: e.target.value })}
                  className="flex-1 px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Ticket Button */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ticket Button Text</label>
          <input
            type="text"
            value={design.ticketButtonText || 'Get Tickets'}
            onChange={e => updateDesign({ ticketButtonText: e.target.value })}
            placeholder="Get Tickets"
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ticket Button Color
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={design.ticketButtonColor || '#10b981'}
              onChange={e => updateDesign({ ticketButtonColor: e.target.value })}
              className="h-10 w-16 rounded border cursor-pointer"
            />
            <input
              type="text"
              value={design.ticketButtonColor || '#10b981'}
              onChange={e => updateDesign({ ticketButtonColor: e.target.value })}
              className="flex-1 px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Display Options */}
      <div className="space-y-2">
        <h5 className="text-sm font-medium text-gray-700">Display Options</h5>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showOrganizer"
            checked={design.showOrganizer ?? true}
            onChange={e => updateDesign({ showOrganizer: e.target.checked })}
            className="rounded border-gray-300"
          />
          <label htmlFor="showOrganizer" className="text-sm text-gray-700">
            Show Organizer Info
          </label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showVenue"
            checked={design.showVenue ?? true}
            onChange={e => updateDesign({ showVenue: e.target.checked })}
            className="rounded border-gray-300"
          />
          <label htmlFor="showVenue" className="text-sm text-gray-700">
            Show Venue Details
          </label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showSchedule"
            checked={design.showSchedule ?? true}
            onChange={e => updateDesign({ showSchedule: e.target.checked })}
            className="rounded border-gray-300"
          />
          <label htmlFor="showSchedule" className="text-sm text-gray-700">
            Show Event Schedule
          </label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showShareButtons"
            checked={design.showShareButtons ?? true}
            onChange={e => updateDesign({ showShareButtons: e.target.checked })}
            className="rounded border-gray-300"
          />
          <label htmlFor="showShareButtons" className="text-sm text-gray-700">
            Show Share Buttons
          </label>
        </div>
      </div>

      {/* Schedule Style */}
      {design.showSchedule && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Schedule Style</label>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'timeline', label: 'Timeline' },
              { value: 'list', label: 'List' },
              { value: 'cards', label: 'Cards' },
            ].map(option => (
              <button
                key={option.value}
                onClick={() =>
                  updateDesign({
                    scheduleStyle: option.value as EventDesignSettings['scheduleStyle'],
                  })
                }
                className={cn(
                  'px-3 py-2 border rounded-lg text-sm',
                  design.scheduleStyle === option.value
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-300'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <BaseDesigner design={design} onChange={onChange} tabs={tabs}>
      {renderEventOptionsContent()}
    </BaseDesigner>
  )
}

export default EventDesigner
