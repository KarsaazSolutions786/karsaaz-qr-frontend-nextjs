import MapBlock, { defaultMapBlockData } from './MapBlock';
import { Block } from '../types';

/**
 * Map Block Examples
 * Demonstrates various configurations and use cases for the Map Block component
 */

// Example 1: Restaurant Location
export const restaurantMapBlock: Block = {
  id: 'map-restaurant-001',
  type: 'map',
  title: 'Restaurant Location Map',
  subtitle: 'Find our restaurant easily with interactive map',
  content: {
    ...defaultMapBlockData,
    address: '123 Main Street, New York, NY 10001',
    latitude: 40.7128,
    longitude: -74.0060,
    zoom: 17,
    mapType: 'roadmap',
    showMarker: true,
    markerTitle: 'Bella Italia Restaurant',
    infoWindow: 'Authentic Italian cuisine - Open daily 11am-10pm',
    showLocationInfo: true,
    locationName: 'Bella Italia Restaurant',
    locationDescription: 'Family-owned Italian restaurant serving authentic pasta, pizza, and wine in the heart of Manhattan.',
    phone: '+1 (212) 555-0123',
    website: 'https://bellaitalia-nyc.com',
    showDirectionsLink: true,
    directionsText: '🧭 Get Directions to Restaurant'
  },
  settings: {
    visible: true,
    order: 1,
    customClasses: ['restaurant-location'],
    padding: '1rem',
    margin: '1rem',
    backgroundColor: '#f8f9fa',
    textColor: '#212529',
    borderRadius: '0.75rem'
  },
  design: {
    backgroundColor: '#f8f9fa',
    textColor: '#212529',
    borderRadius: '0.75rem',
    padding: '1rem',
    margin: '1rem'
  }
};

// Example 2: Event Venue
export const eventVenueMapBlock: Block = {
  id: 'map-event-002',
  type: 'map',
  title: 'Conference Venue',
  subtitle: 'Tech Summit 2024 Location',
  content: {
    ...defaultMapBlockData,
    address: 'Javits Center, 655 West 34th Street, New York, NY 10001',
    latitude: 40.7589,
    longitude: -73.9851,
    zoom: 16,
    mapType: 'hybrid',
    showMarker: true,
    markerTitle: 'Tech Summit 2024 Venue',
    infoWindow: 'Annual Technology Conference - March 15-17, 2024',
    showLocationInfo: true,
    locationName: 'Javits Center',
    locationDescription: 'New York\'s premier convention center hosting Tech Summit 2024 with over 5,000 attendees.',
    phone: '+1 (212) 216-2000',
    website: 'https://javits-center.com',
    showDirectionsLink: true,
    directionsText: '🚗 Navigate to Venue',
    showControls: true,
    allowFullscreen: true
  },
  settings: {
    visible: true,
    order: 2,
    customClasses: ['event-venue'],
    padding: '1.5rem',
    margin: '1rem',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    borderRadius: '1rem'
  },
  design: {
    backgroundColor: '#ffffff',
    textColor: '#000000',
    borderRadius: '1rem',
    padding: '1.5rem',
    margin: '1rem'
  }
};

// Example 3: Retail Store
export const retailStoreMapBlock: Block = {
  id: 'map-retail-003',
  type: 'map',
  title: 'Store Locator',
  subtitle: 'Find our flagship store',
  content: {
    ...defaultMapBlockData,
    address: 'Times Square, Manhattan, New York, NY',
    latitude: 40.7580,
    longitude: -73.9855,
    zoom: 18,
    mapType: 'roadmap',
    showMarker: true,
    markerTitle: 'Fashion Forward Flagship Store',
    infoWindow: 'Visit our flagship store for exclusive collections',
    showLocationInfo: true,
    locationName: 'Fashion Forward - Times Square',
    locationDescription: 'Our flagship store featuring the latest fashion trends, personal styling services, and exclusive collections.',
    phone: '+1 (212) 555-7890',
    website: 'https://fashionforward.com/stores/times-square',
    showDirectionsLink: true,
    directionsText: '🗺️ Get Store Directions',
    showControls: true,
    allowFullscreen: true
  },
  settings: {
    visible: true,
    order: 3,
    customClasses: ['store-locator'],
    padding: '1rem',
    margin: '0.5rem',
    backgroundColor: '#f8f8f8',
    textColor: '#333333',
    borderRadius: '0.5rem'
  },
  design: {
    backgroundColor: '#f8f8f8',
    textColor: '#333333',
    borderRadius: '0.5rem',
    padding: '1rem',
    margin: '0.5rem'
  }
};

// Example 4: Office Location (Satellite View)
export const officeLocationMapBlock: Block = {
  id: 'map-office-004',
  type: 'map',
  title: 'Corporate Headquarters',
  subtitle: 'Our main office location',
  content: {
    ...defaultMapBlockData,
    address: '1 World Trade Center, New York, NY 10007',
    latitude: 40.7127,
    longitude: -74.0134,
    zoom: 19,
    mapType: 'satellite',
    showMarker: true,
    markerTitle: 'Corporate Headquarters',
    infoWindow: 'Global headquarters on the 85th floor',
    showLocationInfo: true,
    locationName: 'Acme Corporation HQ',
    locationDescription: 'Our global headquarters located in the iconic One World Trade Center, offering stunning views of Manhattan and beyond.',
    phone: '+1 (212) 555-3456',
    website: 'https://acme-corp.com/contact',
    showDirectionsLink: true,
    directionsText: '🏢 Visit Our Office',
    showControls: true,
    allowFullscreen: true
  },
  settings: {
    visible: true,
    order: 4,
    customClasses: ['office-location'],
    padding: '1rem',
    margin: '1rem',
    backgroundColor: '#1a1a1a',
    textColor: '#ffffff',
    borderRadius: '0.75rem'
  },
  design: {
    backgroundColor: '#1a1a1a',
    textColor: '#ffffff',
    borderRadius: '0.75rem',
    padding: '1rem',
    margin: '1rem'
  }
};

// Example 5: Tourist Attraction
export const touristAttractionMapBlock: Block = {
  id: 'map-tourist-005',
  type: 'map',
  title: 'Central Park',
  subtitle: 'Visit New York\'s famous park',
  content: {
    ...defaultMapBlockData,
    address: 'Central Park, New York, NY',
    latitude: 40.7829,
    longitude: -73.9654,
    zoom: 14,
    mapType: 'hybrid',
    showMarker: true,
    markerTitle: 'Central Park',
    infoWindow: '843 acres of green space in the heart of Manhattan',
    showLocationInfo: true,
    locationName: 'Central Park',
    locationDescription: 'New York City\'s iconic 843-acre public park featuring meadows, lakes, bridges, and world-famous attractions.',
    phone: '+1 (212) 310-6600',
    website: 'https://centralparknyc.org',
    showDirectionsLink: true,
    directionsText: '🌳 Explore Central Park',
    showControls: true,
    allowFullscreen: true
  },
  settings: {
    visible: true,
    order: 5,
    customClasses: ['tourist-attraction'],
    padding: '1rem',
    margin: '1rem',
    backgroundColor: '#e8f5e9',
    textColor: '#2e7d32',
    borderRadius: '1rem'
  },
  design: {
    backgroundColor: '#e8f5e9',
    textColor: '#2e7d32',
    borderRadius: '1rem',
    padding: '1rem',
    margin: '1rem'
  }
};

// Export all examples
export const mapExamples = [
  restaurantMapBlock,
  eventVenueMapBlock, 
  retailStoreMapBlock,
  officeLocationMapBlock,
  touristAttractionMapBlock
];

// Demo component showcasing all examples
export function MapBlockExamples() {
  const handleUpdate = (updates: Partial<Block>) => {
    console.log('Block updated:', updates);
  };

  const handleDelete = () => {
    console.log('Block deleted');
  };

  return (
    <div className="space-y-8 p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Map Block Examples</h1>
        <p className="text-lg text-muted-foreground">
          Interactive Google Maps with address search, markers, and customizable controls
        </p>
      </div>

      {/* Restaurant Example */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-2">🏪 Restaurant Location</h2>
        <p className="text-muted-foreground mb-4">
          Perfect for restaurants, cafes, and food businesses
        </p>
        <div className="border rounded-lg">
          <MapBlock 
            block={restaurantMapBlock} 
            onUpdate={handleUpdate} 
            onDelete={handleDelete} 
            isEditing={false}
          />
        </div>
      </div>

      {/* Event Venue Example */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-2">🏢 Event Venue</h2>
        <p className="text-muted-foreground mb-4">
          Ideal for conferences, exhibitions, and event spaces
        </p>
        <div className="border rounded-lg">
          <MapBlock 
            block={eventVenueMapBlock} 
            onUpdate={handleUpdate} 
            onDelete={handleDelete} 
            isEditing={false}
          />
        </div>
      </div>

      {/* Retail Store Example */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-2">🛍️ Retail Store</h2>
        <p className="text-muted-foreground mb-4">
          Great for stores, boutiques, and retail locations
        </p>
        <div className="border rounded-lg">
          <MapBlock 
            block={retailStoreMapBlock} 
            onUpdate={handleUpdate} 
            onDelete={handleDelete} 
            isEditing={false}
          />
        </div>
      </div>

      {/* Office Location Example */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-2">🏢 Corporate Office</h2>
        <p className="text-muted-foreground mb-4">
          Professional office and headquarters locations
        </p>
        <div className="border rounded-lg">
          <MapBlock 
            block={officeLocationMapBlock} 
            onUpdate={handleUpdate} 
            onDelete={handleDelete} 
            isEditing={false}
          />
        </div>
      </div>

      {/* Tourist Attraction Example */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-2">🌳 Tourist Attraction</h2>
        <p className="text-muted-foreground mb-4">
          Parks, landmarks, and tourist destinations
        </p>
        <div className="border rounded-lg">
          <MapBlock 
            block={touristAttractionMapBlock} 
            onUpdate={handleUpdate} 
            onDelete={handleDelete} 
            isEditing={false}
          />
        </div>
      </div>

      {/* Edit Mode Example */}
      <div className="bg-blue-50 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-2">⚙️ Edit Mode</h2>
        <p className="text-muted-foreground mb-4">
          Configuration interface for content editors
        </p>
        <div className="border rounded-lg">
          <MapBlock 
            block={restaurantMapBlock} 
            onUpdate={handleUpdate} 
            onDelete={handleDelete} 
            isEditing={true}
          />
        </div>
      </div>
    </div>
  );
}

export default MapBlockExamples;