# Business Hours Block Component

A comprehensive, production-ready React component for displaying and managing business hours with timezone support, special hours, and real-time status indicators.

## Features

✅ **Weekly Schedule Display** - Sunday through Saturday with full customization  
✅ **Multiple Time Ranges** - Support for lunch breaks, split shifts, and multiple open periods per day  
✅ **Closed Days** - Clear visual indicators for days when business is closed  
✅ **Timezone Support** - Full timezone awareness with current time display  
✅ **Current Status** - Real-time open/closed indicator with prominent styling  
✅ **Next Opening Time** - Smart calculation of when business will next be open  
✅ **Holiday/Special Hours** - Override regular hours for holidays and special events  
✅ **Dual View Modes** - Separate edit and public display modes  
✅ **Responsive Design** - Mobile-friendly table layout  
✅ **TypeScript** - Fully typed with comprehensive type definitions  

## Installation

No additional installation required beyond the existing project dependencies. The component uses:
- `date-fns` for date manipulation
- `date-fns-tz` for timezone support

## Basic Usage

```tsx
import { BusinessHoursBlock, defaultBusinessHoursData } from './BusinessHoursBlock';

// Public view mode (default)
<BusinessHoursBlock data={defaultBusinessHoursData} />

// Edit mode with updates
<BusinessHoursBlock 
  data={businessHoursData}
  isEditMode={true}
  onUpdate={handleUpdate}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `BusinessHoursData` | Required | Business hours configuration |
| `isEditMode` | `boolean` | `false` | Show edit controls when true |
| `onUpdate` | `(data: BusinessHoursData) => void` | Optional | Callback for updates in edit mode |

## Data Structure

### BusinessHoursData

```typescript
interface BusinessHoursData {
  timezone: string;              // IANA timezone (e.g., "America/New_York")
  holidayMode: boolean;          // Global closed override
  schedule: DaySchedule[];       // Weekly schedule
  specialHours: SpecialHours[];  // Holiday/special event hours
}
```

### Example Data

```typescript
const businessHoursData: BusinessHoursData = {
  timezone: 'America/New_York',
  holidayMode: false,
  schedule: [
    {
      day: 'monday',
      isClosed: false,
      timeRanges: [
        { open: '09:00', close: '12:00' },
        { open: '13:00', close: '17:00' }  // Lunch break from 12-1 PM
      ]
    },
    {
      day: 'sunday',
      isClosed: true,
      timeRanges: []
    }
    // ... other days
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
};
```

## Edit Mode Features

When `isEditMode={true}`, the component provides:

### Timezone Selection
- Dropdown with common timezones
- Automatic current time update
- Proper timezone offset handling

### Day Controls
- Toggle open/closed for each day
- Add/remove multiple time ranges per day
- Time inputs with validation
- Prevention of invalid time ranges

### Holiday Mode
- Global toggle to mark as temporarily closed
- Override all regular hours when enabled
- Clear visual status indicator

## Public View Features

When `isEditMode={false}` (default), the component displays:

### Status Indicator
- Prominent open/closed badge with live status
- Green "Open Now" with pulse indicator when open
- Red "Currently Closed" when closed
- Holiday mode display

### Next Opening Time
- Automatically calculates next available opening
- Considers special hours and holidays
- Displays date and time with timezone
- Shows labels for special events (e.g., "Christmas")

### Current Time Display
- Shows current time in selected timezone
- Updates every minute
- Includes full date for context

### Special Hours Indicators
- Shows when special hours are active
- Displays holiday/event name
- Overrides regular schedule display

## Timezone Support

The component includes comprehensive timezone support:

```typescript
// Supported timezones include:
- US: America/New_York, America/Chicago, America/Denver, America/Los_Angeles
- International: Europe/London, Europe/Paris, Asia/Tokyo, Australia/Sydney
- And many more...
```

All times are properly converted and displayed in the selected timezone.

## Advanced Features

### Multiple Time Ranges

Support for complex schedules with multiple open periods:

```typescript
timeRanges: [
  { open: '08:00', close: '12:00' },  // Morning shift
  { open: '13:00', close: '17:00' },  // Afternoon shift (lunch break)
  { open: '18:00', close: '22:00' }   // Evening shift
]
```

### Overnight Shifts

Handles times that cross midnight:

```typescript
// Open from 10 PM to 2 AM
{ open: '22:00', close: '02:00' }
```

### Special Hours Priority

Special hours override regular schedule:

1. Holiday mode (highest priority)
2. Special hours for the date
3. Regular weekly schedule

## Utility Functions

The component includes a comprehensive utility library:

```typescript
import { 
  getBusinessStatus,
  getNextOpeningTime,
  formatTime,
  isTimeInRange 
} from './businessHours.utils';

// Check if business is open right now
const status = getBusinessStatus(currentTime, businessHoursData);

// Find next opening time
const nextOpen = getNextOpeningTime(currentTime, businessHoursData);

// Format time for display
const formatted = formatTime('14:30', 'America/New_York'); // "2:30 PM"
```

## Validation

Built-in validation ensures data integrity:

```typescript
import { validateBusinessHours } from './businessHours.utils';

const errors = validateBusinessHours(businessHoursData);
if (errors.length > 0) {
  console.error('Invalid business hours:', errors);
}
```

Validation checks for:
- Invalid time ranges (close before open)
- Missing time ranges on open days
- Invalid timezone names
- Malformed schedule entries

## TypeScript Support

Full TypeScript support with exported types:

```typescript
import type { 
  BusinessHoursData,
  DaySchedule,
  SpecialHours,
  TimeRange 
} from './businessHours.types';
```

## Responsive Design

The component is fully responsive:
- Desktop: Table layout with clear columns
- Mobile: Horizontal scroll for table
- Touch-friendly controls in edit mode
- Appropriate text sizing and spacing

## Styling

Uses Tailwind CSS classes for styling:
- Clean, modern interface
- Consistent spacing and typography
- Clear visual hierarchy
- Accessible color contrast

All styles can be customized by:
1. Overriding Tailwind classes
2. Custom CSS with higher specificity
3. Component prop extensions

## Performance

Optimized for performance:
- Current time updates every minute (not every second)
- Memoized calculations for status and next opening
- Efficient re-renders with proper React patterns
- Small bundle size with tree-shakable imports

## Browser Support

Compatible with all modern browsers:
- Chrome, Firefox, Safari, Edge
- Mobile browsers on iOS and Android
- Time input support for easy time selection

## Examples

### Restaurant with Lunch/Dinner Hours

```typescript
const restaurantHours: BusinessHoursData = {
  timezone: 'America/New_York',
  schedule: [
    {
      day: 'tuesday',
      isClosed: false,
      timeRanges: [
        { open: '11:30', close: '14:30' },  // Lunch
        { open: '17:30', close: '22:00' }   // Dinner
      ]
    }
    // ... closed Monday
  ]
};
```

### Retail Store with Holiday Hours

```typescript
const retailHours: BusinessHoursData = {
  timezone: 'America/Los_Angeles',
  schedule: [
    {
      day: 'saturday',
      isClosed: false,
      timeRanges: [{ open: '09:00', close: '21:00' }]
    }
  ],
  specialHours: [
    {
      date: '2024-11-29',  // Black Friday
      name: 'Black Friday',
      isClosed: false,
      timeRanges: [{ open: '05:00', close: '23:00' }]
    }
  ]
};
```

## Future Enhancements

Planned features for future versions:
- [ ] Special hours management UI in edit mode
- [ ] Recurring special hours (e.g., "first Monday of month")
- [ ] Seasonal schedule templates
- [ ] Break time indicators
- [ ] Copy schedule between days
- [ ] Import/export functionality
- [ ] 24-hour format option

## License

This component is part of the Karsaaz QR project and follows the same license terms.