# Map Block Component

A comprehensive, interactive Google Maps embed component for the biolinks system with address search, marker placement, and extensive customization options.

## Features

### Core Functionality
- 🗺️ **Google Maps Embed** - Full-featured interactive map using Google Maps iframe API
- 🔍 **Address Search** - Search and locate any address, city, or coordinates
- 📍 **Marker Placement** - Custom markers with titles and info windows
- 🎛️ **Map Controls** - Toggle controls, fullscreen mode, and interactive features
- 🔍 **Zoom Controls** - Configurable zoom levels from city view to building detail
- 🗺️ **Map Types** - Roadmap, satellite, hybrid, and terrain views
- 👁️ **Dual View Modes** - Both edit and public view modes with full functionality
- 📋 **Location Information** - Rich location cards with name, description, contact info
- 📱 **Responsive Design** - Maintains 16:9 aspect ratio across all screen sizes
- 🧭 **Directions Link** - One-click directions to any location

### Map Configuration
- **Place Mode** - Display specific locations with custom markers
- **Zoom Levels** - 10 (City) to 19 (Close-up)
- **Map Types**:
  - Roadmap (default)
  - Satellite
  - Hybrid (satellite + labels)
  - Terrain
- **Interactive Controls** - Pan, zoom, street view access
- **Fullscreen Support** - Allow users to view map in fullscreen

### Location Management
- **Address Search** - Type any address for instant geocoding
- **Coordinate Support** - Direct latitude/longitude input
- **Location Details** - Name, description, phone, website
- **Info Windows** - Custom text for marker popups
- **Marker Customization** - Custom titles for map pins

### User Experience
- **Directions Integration** - Direct link to Google Maps directions
- **Location Cards** - Beautiful display of location information
- **Responsive Layout** - Perfect aspect ratio on all devices
- **Loading States** - Smooth loading indicators
- **Error Handling** - Graceful error messages for invalid locations

## Usage

### Basic Implementation

```tsx
import MapBlock, { defaultMapBlockData } from './MapBlock';

// In your block registry
const mapBlockConfig: BlockConfig = {
  type: 'map',
  name: 'Map',
  description: 'Interactive map with address search',
  icon: MapPin,
  category: 'business',
  component: MapBlock,
  defaultData: defaultMapBlockData,
  defaultSettings: {
    visible: true,
    order: 0,
    customClasses: [],
    padding: '1rem',
    margin: '0.5rem',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    borderRadius: '0.5rem',
  },
  defaultDesign: {
    backgroundColor: '#ffffff',
    textColor: '#000000',
    borderRadius: '0.5rem',
    padding: '1rem',
    margin: '0.5rem',
  },
};
```

### Block Structure

```typescript
interface MapBlockContent {
  // Location Details
  address: string;                    // Searchable address
  latitude?: number;                  // Direct coordinates
  longitude?: number;
  placeId?: string;                   // Google Place ID
  
  // Map Configuration
  zoom: number;                       // 10-19 (city to building)
  mapType: 'roadmap' | 'satellite' | 'hybrid' | 'terrain';
  showControls: boolean;              // Show map controls
  allowFullscreen: boolean;           // Allow fullscreen mode
  
  // Display Options
  showMarker: boolean;                // Show location marker
  markerTitle?: string;               // Marker title
  infoWindow?: string;                // Popup text
  
  // Directions
  showDirectionsLink: boolean;        // Show directions button
  directionsText?: string;            // Button text
  
  // Location Info
  showLocationInfo: boolean;          // Show location card
  locationName?: string;              // Business/location name
  locationDescription?: string;       // Description
  phone?: string;                     // Contact phone
  website?: string;                   // Website URL
  
  // API Configuration
  apiKey?: string;                    // Google API key
  language?: string;                  // Language code
  region?: string;                    // Region code
}
```

### Default Configuration

```typescript
export const defaultMapBlockData: MapBlockContent = {
  address: '',
  latitude: 40.7128,      // New York City
  longitude: -74.0060,
  zoom: 15,               // Street level
  mapType: 'roadmap',
  showControls: true,
  allowFullscreen: true,
  showMarker: true,
  markerTitle: 'Location',
  infoWindow: '',
  showDirectionsLink: true,
  directionsText: 'Get Directions',
  showLocationInfo: false,
  locationName: '',
  locationDescription: '',
  phone: '',
  website: '',
  language: 'en',
  region: 'us'
};
```

## Edit Mode Features

### Address Search
- **Smart Search** - Search any address, city, landmark, or coordinates
- **Instant Results** - Real-time map updates as you search
- **Coordinate Support** - Direct latitude/longitude input
- **Error Handling** - Clear error messages for invalid locations

### Map Configuration Panel
- **Zoom Control** - Dropdown with predefined zoom levels
- **Map Type Selector** - Visual selection of map styles
- **Toggle Controls** - Enable/disable map controls and fullscreen
- **Marker Settings** - Custom title and info window text
- **Live Preview** - Real-time preview of map changes

### Location Information
- **Rich Cards** - Comprehensive location details
- **Contact Info** - Phone and website fields
- **Custom Description** - Rich text area for descriptions
- **Visual Toggle** - Show/hide location card

### Directions Integration
- **Custom Button Text** - Personalized CTA text
- **Smart URLs** - Automatic Google Maps direction links
- **Toggle Visibility** - Show/hide directions button

## Public View Features

### Interactive Map
- **Full Google Maps** - Complete interactive experience
- **Responsive Display** - Perfect 16:9 aspect ratio
- **Touch Friendly** - Mobile-optimized controls
- **Loading States** - Smooth user experience

### Location Information
- **Beautiful Cards** - Professional location display
- **Clickable Links** - Phone and website integration
- **Address Display** - Formatted address with icon
- **Responsive Layout** - Adapts to screen size

### Directions Link
- **One-Click Access** - Direct to Google Maps
- **Custom Text** - Personalized button messaging
- **Smart Recognition** - Opens in native app when available
- **New Tab Safety** - Opens in new tab with proper security

## Styling and Design

### Design Controls
- **Background Color** - Custom block background
- **Text Color** - Content text color
- **Padding** - Internal spacing
- **Margin** - External spacing
- **Border Radius** - Corner rounding

### Responsive Behavior
- **Aspect Ratio** - Maintains 16:9 ratio
- **Minimum Height** - 300px minimum height
- **Full Width** - Responsive container
- **Mobile Optimized** - Touch-friendly controls

### Visual Hierarchy
- **Map Priority** - Map takes visual focus
- **Information Cards** - Secondary information display
- **Action Buttons** - Clear call-to-action
- **Consistent Spacing** - Balanced layout

## API Integration

### Google Maps Embed API
```
https://www.google.com/maps/embed/v1/place
  ?key=YOUR_API_KEY
  &q=ADDRESS_OR_COORDINATES
  &zoom=ZOOM_LEVEL
  &maptype=MAP_TYPE
```

### Required Parameters
- **key** - Google Maps API key
- **q** - Location query (address or coordinates)

### Optional Parameters
- **zoom** - Zoom level (0-21)
- **maptype** - Map style selection
- **center** - Map center coordinates
- **language** - UI language
- **region** - Region localization

## Advanced Usage

### Custom Markers
```typescript
// Custom marker with info window
showMarker: true,
markerTitle: 'Our Headquarters',
infoWindow: 'Visit us at our main office!',
```

### Business Information
```typescript
// Complete business listing
showLocationInfo: true,
locationName: 'Acme Corp Headquarters',
locationDescription: 'Main office located in downtown',
phone: '+1 (555) 123-4567',
website: 'https://acme.com',
```

### Custom Directions
```typescript
// Personalized directions button
showDirectionsLink: true,
directionsText: 'Navigate to Our Store',
```

## Error Handling

### Search Errors
- **Empty Query** - "Please enter an address to search"
- **Invalid Location** - "Unable to find location"
- **API Errors** - Graceful fallback messages

### Map Loading
- **Invalid API Key** - Shows error placeholder
- **Network Issues** - Retry mechanisms
- **Missing Location** - Helpful setup prompts

## Performance Considerations

### Optimization
- **Lazy Loading** - Map loads when visible
- **URL Encoding** - Proper parameter encoding
- **Caching** - Efficient URL building
- **Error Boundaries** - Graceful error handling

### Accessibility
- **Screen Reader Support** - Proper alt text and labels
- **Keyboard Navigation** - Full keyboard support
- **Color Contrast** - WCAG compliant colors
- **Focus Indicators** - Clear focus states

## Browser Support

### Supported Browsers
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Mobile Support
- iOS Safari 12+
- Android Chrome 60+
- Responsive design
- Touch-optimized controls

## Security Considerations

### Safe Implementation
- **HTTPS Only** - All Google Maps requests over HTTPS
- **CSP Compliance** - Content Security Policy friendly
- **No Sensitive Data** - No personal data in URLs
- **API Key Security** - Client-side restrictions

### Privacy
- **Referrer Policy** - Controlled referrer information
- **Consent Ready** - GDPR compliant implementation
- **No Tracking** - No additional tracking beyond Google Maps

## Examples

### Restaurant Location
```typescript
{
  address: '123 Main St, New York, NY 10001',
  zoom: 17,
  mapType: 'roadmap',
  showLocationInfo: true,
  locationName: 'Bella Italia Restaurant',
  locationDescription: 'Authentic Italian cuisine in the heart of NYC',
  phone: '+1 (212) 555-0123',
  website: 'https://bellaitalia.com',
  directionsText: 'Get Directions to Restaurant'
}
```

### Event Venue
```typescript
{
  latitude: 40.7589,
  longitude: -73.9851,
  zoom: 15,
  mapType: 'hybrid',
  markerTitle: 'Event Location',
  infoWindow: 'Annual Tech Conference 2024',
  showDirectionsLink: true,
  directionsText: 'Navigate to Venue'
}
```

### Store Locator
```typescript
{
  address: 'Times Square, Manhattan, NY',
  zoom: 16,
  mapType: 'roadmap',
  showMarker: true,
  showLocationInfo: true,
  locationName: 'Flagship Store',
  phone: '+1 (212) 555-0456',
  showDirectionsLink: true,
  directionsText: 'Find Store Directions'
}
```

## Contributing

When adding new features:
1. Update TypeScript interfaces for type safety
2. Add comprehensive error handling
3. Test responsive behavior across devices
4. Update this documentation
5. Test with various Google API configurations
6. Ensure accessibility compliance
7. Validate with multiple address formats

## Support

For issues or questions:
- Check Google Maps Embed API documentation
- Verify API key configuration
- Test with different address formats
- Check browser console for errors
- Validate network connectivity