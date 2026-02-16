# Map Block - Quick Start Guide

Get up and running with the Map Block in 5 minutes!

## Installation

The Map Block component is already created and ready to use. No additional installation required!

**Location**: `src/components/qr/biolinks/blocks/MapBlock.tsx`

## Basic Usage

### 1. Register the Block

Add to your block registry:

```typescript
import MapBlock, { defaultMapBlockData } from './blocks/MapBlock';
import { MapPin } from 'lucide-react';

const mapBlockConfig = {
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
    borderRadius: '0.5rem'
  }
};
```

### 2. Add to Block List

Include in your available blocks:

```typescript
const availableBlocks = [
  // ... other blocks
  mapBlockConfig
];
```

### 3. Use in Your Component

```tsx
import MapBlock from './blocks/MapBlock';

function MyComponent() {
  const [block, setBlock] = useState({
    id: 'map-1',
    type: 'map',
    title: 'Our Location',
    content: defaultMapBlockData,
    settings: { /* settings */ },
    design: { /* design */ }
  });

  const handleUpdate = (updates) => {
    setBlock(prev => ({ ...prev, ...updates }));
  };

  const handleDelete = () => {
    // Delete logic
  };

  return (
    <MapBlock
      block={block}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
      isEditing={true}  // or false for public view
    />
  );
}
```

## Quick Configuration

### Set a Location

**By Address:**
```typescript
onUpdate({
  content: {
    ...block.content,
    address: '1600 Pennsylvania Avenue, Washington, DC'
  }
});
```

**By Coordinates:**
```typescript
onUpdate({
  content: {
    ...block.content,
    latitude: 38.8977,
    longitude: -77.0365
  }
});
```

### Customize Appearance

```typescript
onUpdate({
  content: {
    ...block.content,
    zoom: 17,                    // 10-19 (city to building)
    mapType: 'satellite',        // 'roadmap', 'satellite', 'hybrid', 'terrain'
    showMarker: true,            // Show location pin
    markerTitle: 'Our Office',   // Pin title
    showDirectionsLink: true     // Show directions button
  }
});
```

### Add Business Information

```typescript
onUpdate({
  content: {
    ...block.content,
    showLocationInfo: true,
    locationName: 'Acme Corp',
    locationDescription: 'Our downtown office',
    phone: '+1 (555) 123-4567',
    website: 'https://acme.com'
  }
});
```

## Common Use Cases

### Restaurant
```typescript
const restaurantMap = {
  address: '123 Main St, New York, NY 10001',
  zoom: 17,
  showLocationInfo: true,
  locationName: "Bella Italia",
  phone: "+1 (212) 555-0123"
};
```

### Event Venue
```typescript
const eventMap = {
  latitude: 40.7589,
  longitude: -73.9851,
  zoom: 16,
  mapType: 'hybrid'
};
```

### Minimal Map
```typescript
const simpleMap = {
  address: 'Times Square, New York',
  zoom: 15
};
```

## Props Reference

### MapBlock Props
- `block: Block` - The block configuration object
- `onUpdate: (updates) => void` - Callback for updates
- `onDelete: () => void` - Callback for deletion
- `isEditing?: boolean` - Edit mode toggle

### Block.Content Properties
- `address` - Searchable address string
- `latitude` - Direct latitude coordinate
- `longitude` - Direct longitude coordinate
- `zoom` - Zoom level (10-19)
- `mapType` - 'roadmap' | 'satellite' | 'hybrid' | 'terrain'
- `showControls` - Show map controls
- `allowFullscreen` - Allow fullscreen mode
- `showMarker` - Show location marker
- `markerTitle` - Marker popup title
- `infoWindow` - Marker popup text
- `showLocationInfo` - Show location card
- `locationName` - Business/location name
- `locationDescription` - Location description
- `phone` - Contact phone
- `website` - Website URL
- `showDirectionsLink` - Show directions button
- `directionsText` - Directions button text

## Customization

### Change Colors
```typescript
onUpdate({
  design: {
    backgroundColor: '#f8f9fa',
    textColor: '#212529',
    borderRadius: '1rem'
  }
});
```

### Adjust Spacing
```typescript
onUpdate({
  design: {
    padding: '2rem',
    margin: '1rem'
  }
});
```

## API Requirements

### Google Maps Embed API
- API key required for production
- Place mode for location display
- Free tier available
- Referrer restrictions recommended

### Getting an API Key
1. Go to Google Cloud Console
2. Enable Maps Embed API
3. Create API key
4. Add referrer restrictions
5. Add to block content:
```typescript
onUpdate({
  content: {
    ...block.content,
    apiKey: 'YOUR_API_KEY'
  }
});
```

## Troubleshooting

### Map Not Loading
- Check API key configuration
- Verify address/coordinates
- Check browser console for errors
- Ensure HTTPS connection

### Search Not Working
- Verify network connection
- Check for API key restrictions
- Try different address format

### Responsive Issues
- Check parent container width
- Verify aspect ratio settings
- Test on different screen sizes

## Next Steps

- 📖 Read the full [MAPMLOCK_README.md](MAPMLOCK_README.md) for detailed documentation
- 👀 Check out [MapBlock.demo.tsx](MapBlock.demo.tsx) for working examples
- 🔧 Customize design to match your brand
- 🧪 Test with different locations and configurations
- 🔑 Add your Google Maps API key
- 📱 Test responsive behavior on mobile devices

## Support

For detailed information:
- Full documentation: `MAPMLOCK_README.md`
- Example implementations: `MapBlock.demo.tsx`
- Component source: `MapBlock.tsx`
- Type definitions: `types.ts`

---

**Ready to add maps to your biolinks! 🗺️**