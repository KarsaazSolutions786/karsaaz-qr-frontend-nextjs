import React, { useState } from 'react';
import { BusinessHoursBlock } from './BusinessHoursBlock';
import type { BusinessHoursData } from './businessHours.types';

/**
 * Example usage of BusinessHoursBlock component
 * Demonstrates both public view and edit modes
 */

export const BusinessHoursExample: React.FC = () => {
  const [businessHours, setBusinessHours] = useState<BusinessHoursData>({
    timezone: 'America/New_York',
    holidayMode: false,
    schedule: [
      { day: 'sunday', isClosed: true, timeRanges: [] },
      { day: 'monday', isClosed: false, timeRanges: [{ open: '09:00', close: '17:00' }] },
      { day: 'tuesday', isClosed: false, timeRanges: [{ open: '09:00', close: '17:00' }] },
      { day: 'wednesday', isClosed: false, timeRanges: [{ open: '09:00', close: '17:00' }] },
      { day: 'thursday', isClosed: false, timeRanges: [{ open: '09:00', close: '17:00' }] },
      { day: 'friday', isClosed: false, timeRanges: [{ open: '09:00', close: '17:00' }] },
      { day: 'saturday', isClosed: true, timeRanges: [] },
    ],
    specialHours: [
      {
        date: '2024-12-25',
        name: 'Christmas',
        isClosed: true
      },
      {
        date: '2024-11-28',
        name: 'Thanksgiving',
        isClosed: false,
        timeRanges: [{ open: '08:00', close: '14:00' }]
      }
    ]
  });

  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Business Hours Block Component
        </h1>
        <p className="text-gray-600">
          A comprehensive business hours component with timezone support, special hours,
          and real-time status indicators.
        </p>
      </div>

      {/* Toggle Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">View Mode</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsEditMode(false)}
            className={`px-4 py-2 rounded-lg font-medium ${
              !isEditMode
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Public View
          </button>
          <button
            onClick={() => setIsEditMode(true)}
            className={`px-4 py-2 rounded-lg font-medium ${
              isEditMode
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Edit Mode
          </button>
        </div>
        <p className="mt-3 text-sm text-gray-600">
          {isEditMode
            ? 'Edit mode allows you to modify business hours, timezone, and holiday settings.'
            : 'Public view shows the business hours with current status and next opening time.'}
        </p>
      </div>

      {/* Demo: Restaurant Hours */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Example 1: Restaurant Hours</h2>
        <p className="text-gray-600 mb-6">
          Restaurant with lunch and dinner service, closed on Mondays.
        </p>
        <BusinessHoursBlock
          data={{
            timezone: 'America/New_York',
            holidayMode: false,
            schedule: [
              { day: 'sunday', isClosed: false, timeRanges: [{ open: '11:30', close: '21:00' }] },
              { day: 'monday', isClosed: true, timeRanges: [] },
              { day: 'tuesday', isClosed: false, timeRanges: [{ open: '11:30', close: '14:30' }, { open: '17:30', close: '21:00' }] },
              { day: 'wednesday', isClosed: false, timeRanges: [{ open: '11:30', close: '14:30' }, { open: '17:30', close: '21:00' }] },
              { day: 'thursday', isClosed: false, timeRanges: [{ open: '11:30', close: '14:30' }, { open: '17:30', close: '21:00' }] },
              { day: 'friday', isClosed: false, timeRanges: [{ open: '11:30', close: '14:30' }, { open: '17:30', close: '22:00' }] },
              { day: 'saturday', isClosed: false, timeRanges: [{ open: '11:30', close: '14:30' }, { open: '17:30', close: '22:00' }] },
            ],
            specialHours: [
              {
                date: '2024-02-14',
                name: "Valentine's Day",
                isClosed: false,
                timeRanges: [{ open: '16:00', close: '23:00' }]
              }
            ]
          }}
          isEditMode={isEditMode}
        />
      </div>

      {/* Demo: 24/7 Gas Station */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Example 2: 24/7 Gas Station</h2>
        <p className="text-gray-600 mb-6">
          Always open business with 24-hour service every day.
        </p>
        <BusinessHoursBlock
          data={{
            timezone: 'America/Chicago',
            holidayMode: false,
            schedule: [
              { day: 'sunday', isClosed: false, timeRanges: [{ open: '00:00', close: '23:59' }] },
              { day: 'monday', isClosed: false, timeRanges: [{ open: '00:00', close: '23:59' }] },
              { day: 'tuesday', isClosed: false, timeRanges: [{ open: '00:00', close: '23:59' }] },
              { day: 'wednesday', isClosed: false, timeRanges: [{ open: '00:00', close: '23:59' }] },
              { day: 'thursday', isClosed: false, timeRanges: [{ open: '00:00', close: '23:59' }] },
              { day: 'friday', isClosed: false, timeRanges: [{ open: '00:00', close: '23:59' }] },
              { day: 'saturday', isClosed: false, timeRanges: [{ open: '00:00', close: '23:59' }] },
            ],
            specialHours: []
          }}
          isEditMode={isEditMode}
        />
      </div>

      {/* Demo: Retail Store (Editable) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Example 3: Retail Store {isEditMode && '(Interactive)'}
        </h2>
        <p className="text-gray-600 mb-6">
          Standard retail hours with holiday mode toggle. {isEditMode && 'Try editing the hours below:'}
        </p>
        <BusinessHoursBlock
          data={businessHours}
          isEditMode={isEditMode}
          onUpdate={setBusinessHours}
        />
      </div>

      {/* Demo: Holiday Mode Example */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Example 4: Holiday Mode Active</h2>
        <p className="text-gray-600 mb-6">
          Business with holiday mode enabled (temporarily closed).
        </p>
        <BusinessHoursBlock
          data={{
            timezone: 'America/Los_Angeles',
            holidayMode: true,
            schedule: [
              { day: 'sunday', isClosed: true, timeRanges: [] },
              { day: 'monday', isClosed: false, timeRanges: [{ open: '09:00', close: '18:00' }] },
              { day: 'tuesday', isClosed: false, timeRanges: [{ open: '09:00', close: '18:00' }] },
              { day: 'wednesday', isClosed: false, timeRanges: [{ open: '09:00', close: '18:00' }] },
              { day: 'thursday', isClosed: false, timeRanges: [{ open: '09:00', close: '18:00' }] },
              { day: 'friday', isClosed: false, timeRanges: [{ open: '09:00', close: '18:00' }] },
              { day: 'saturday', isClosed: false, timeRanges: [{ open: '10:00', close: '17:00' }] },
            ],
            specialHours: []
          }}
          isEditMode={isEditMode}
        />
      </div>

      {/* Features Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Component Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Core Features</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Weekly schedule display (Sunday-Saturday)</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Multiple time ranges per day</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Closed days indicator</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Timezone selection</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Current status indicator (open/closed)</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Next opening time highlight</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Holiday/special hours support</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Edit and public view modes</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Responsive table layout</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Technical Features</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> TypeScript support</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Real-time updates</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Timezone-aware calculations</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Overnight shift support</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Validation utilities</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Accessible design</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Mobile responsive</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Customizable styling</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Comprehensive utilities</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">How to Use</h2>
        <div className="bg-gray-50 rounded-lg p-4">
          <pre className="text-sm text-gray-800 overflow-x-auto">
{`import { BusinessHoursBlock } from './BusinessHoursBlock';

// Basic usage (public view)
<BusinessHoursBlock data={businessHoursData} />

// Edit mode with updates
<BusinessHoursBlock 
  data={businessHoursData}
  isEditMode={true}
  onUpdate={handleUpdate}
/>

// Default data for new instances
import { defaultBusinessHoursData } from './BusinessHoursBlock';`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default BusinessHoursExample;