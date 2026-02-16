# ServicesBlock Integration Guide

## Quick Start

### 1. Verify Files Are in Place

Your ServicesBlock component should be located at:
```
src/components/qr/biolinks/blocks/ServicesBlock.tsx
```

### 2. Import and Register the Block

In your block registry file (likely `src/components/qr/biolinks/BlockRegistry.tsx` or similar):

```typescript
import ServicesBlock from './blocks/ServicesBlock';
import { Tag } from 'lucide-react';

// Add to your blockConfigs array
const blockConfigs = [
  // ... other blocks
  {
    type: 'services',
    name: 'Services',
    description: 'Showcase services with booking and ratings',
    icon: Tag, // Lucide icon
    category: 'business',
    component: ServicesBlock,
    defaultData: {
      title: 'Our Services',
      description: '',
      services: [],
      categories: [],
      showSearch: true,
      showFilters: true,
      showRatings: true,
      enableBooking: true,
      featuredBadgeText: 'Featured',
      popularBadgeText: 'Popular',
      columns: 2
    },
    defaultSettings: {
      visible: true,
      order: 0,
      customClasses: [],
      padding: '1.5rem',
      margin: '1rem'
    },
    defaultDesign: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      borderRadius: '8px',
      padding: '1.5rem',
      margin: '1rem'
    }
  }
];
```

### 3. Basic Usage

```typescript
import ServicesBlock from './blocks/ServicesBlock';
import { Block } from '../types';

// Create a services block
const servicesBlock: Block = {
  id: 'services-001',
  type: 'services',
  title: 'Services Block',
  content: {
    title: 'Our Services',
    description: 'Professional services tailored to your needs',
    services: [
      {
        id: 'service-1',
        title: 'Web Development',
        description: 'Custom websites built with modern technologies',
        price: '$5,000',
        duration: '4-6 weeks',
        category: 'Development',
        image: 'https://example.com/image.jpg',
        rating: 4.9,
        reviewCount: 156,
        featured: true,
        bookingUrl: 'https://calendly.com/consultation',
        tags: ['React', 'Next.js', 'Full-stack']
      }
    ],
    categories: ['Development', 'Design', 'Marketing'],
    showSearch: true,
    showFilters: true,
    showRatings: true,
    enableBooking: true,
    columns: 2
  },
  settings: {
    visible: true,
    order: 1,
    customClasses: [],
    padding: '1.5rem',
    margin: '1rem'
  },
  design: {
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    borderRadius: '8px',
    padding: '1.5rem',
    margin: '1rem'
  }
};

// In your editor component
<ServicesBlock
  block={servicesBlock}
  onUpdate={(updates) => handleBlockUpdate(servicesBlock.id, updates)}
  onDelete={() => handleBlockDelete(servicesBlock.id)}
  isEditing={true}
/>

// In your public view
<ServicesBlock
  block={servicesBlock}
  isEditing={false}
/>
```

## API Reference

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `block` | `Block` | Yes | The block data object |
| `onUpdate` | `function` | Yes (editor) | Called when block is updated |
| `onDelete` | `function` | Yes (editor) | Called when block is deleted |
| `isEditing` | `boolean` | No | Whether in editor mode |

### Block Content Structure

```typescript
interface ServicesBlockContent {
  title?: string;                    // Block title
  description?: string;              // Block description
  services: Array<{
    id: string;                      // Unique ID
    title: string;                   // Service title
    description?: string;            // Service description
    price?: string;                  // Price (any format)
    duration?: string;               // Duration (any format)
    category?: string;               // Category name
    image?: string;                  // Image URL
    icon?: string;                   // Emoji/icon
    featured?: boolean;              // Featured flag
    rating?: number;                 // Rating (0-5)
    reviewCount?: number;            // Review count
    bookingUrl?: string;             // Booking link
    tags?: string[];                 // Service tags
  }>;
  categories: string[];              // Available categories
  showSearch?: boolean;              // Show search bar
  showFilters?: boolean;             // Show category filters
  showRatings?: boolean;             // Show ratings
  enableBooking?: boolean;           // Enable booking buttons
  featuredBadgeText?: string;        // Featured badge text
  popularBadgeText?: string;         // Popular badge text
  columns?: 1 | 2 | 3;               // Number of columns
}
```

## Common Patterns

### Adding a New Service (Programmatically)

```typescript
const addService = (block: Block, newServiceData: Partial<Service>) => {
  const currentServices = block.content.services || [];
  const newService = {
    id: Date.now().toString(),
    title: newServiceData.title || 'New Service',
    description: newServiceData.description || '',
    price: newServiceData.price || '',
    duration: newServiceData.duration || '',
    category: newServiceData.category || block.content.categories[0],
    image: newServiceData.image,
    rating: newServiceData.rating || 0,
    reviewCount: newServiceData.reviewCount || 0,
    tags: newServiceData.tags || [],
    ...newServiceData
  };
  
  const updatedBlock = {
    ...block,
    content: {
      ...block.content,
      services: [...currentServices, newService]
    }
  };
  
  return updatedBlock;
};
```

### Updating a Service

```typescript
const updateService = (block: Block, serviceId: string, updates: Partial<Service>) => {
  const updatedServices = block.content.services.map(service => 
    service.id === serviceId ? { ...service, ...updates } : service
  );
  
  return {
    ...block,
    content: {
      ...block.content,
      services: updatedServices
    }
  };
};
```

### Filtering Services (Client-Side)

```typescript
const filterServices = (services: Service[], query: string, category: string) => {
  return services.filter(service => {
    const matchesSearch = !query || 
      service.title.toLowerCase().includes(query.toLowerCase()) ||
      service.description?.toLowerCase().includes(query.toLowerCase()) ||
      service.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
    
    const matchesCategory = !category || category === 'all' || service.category === category;
    
    return matchesSearch && matchesCategory;
  });
};
```

### Sorting Services

```typescript
const sortServices = (services: Service[]) => {
  return [...services].sort((a, b) => {
    // Featured first
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    
    // Then by rating
    return (b.rating || 0) - (a.rating || 0);
  });
};
```

## Styling Customization

### Using Design Props

```typescript
const block = {
  // ... other props
  design: {
    backgroundColor: '#f8f9fa',
    textColor: '#212529',
    borderRadius: '12px',
    padding: '2rem',
    margin: '1rem'
  }
};
```

### Custom CSS Classes

```typescript
const block = {
  // ... other props
  settings: {
    // ... other settings
    customClasses: ['my-custom-class', 'another-class']
  }
};
```

### Overriding Styles

Add to your global CSS:

```css
/* Service cards */
.block-services .service-card {
  transition: transform 0.2s ease;
}

.block-services .service-card:hover {
  transform: translateY(-4px);
}

/* Featured services */
.block-services .service-card.featured {
  border: 2px solid #3b82f6;
  background: linear-gradient(135deg, #3b82f61a 0%, #1d4ed81a 100%);
}

/* Category filters */
.block-services .category-filter.active {
  background: #3b82f6;
  color: white;
}
```

## Integrations

### Booking Systems

The ServicesBlock works with any booking system that provides a URL:

- **Calendly**: `https://calendly.com/your-event`
- **Acuity Scheduling**: `https://app.acuityscheduling.com/schedule.php`
- **Mindbody**: `https://clients.mindbodyonline.com/classic/home`
- **Custom Forms**: Any URL to your booking form

### Analytics

Track service interactions:

```typescript
const handleBooking = (service: Service) => {
  // Track with your analytics
  analytics.track('service_booking_clicked', {
    serviceId: service.id,
    serviceTitle: service.title,
    servicePrice: service.price
  });
  
  if (service.bookingUrl) {
    window.open(service.bookingUrl, '_blank');
  }
};

// In your component
<ServiceCard 
  // ... other props
  onBook={handleBooking}
/>
```

### CRM Integration

Save service inquiries to your CRM:

```typescript
const handleBooking = async (service: Service) => {
  try {
    await fetch('/api/crm/service-inquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service: service.title,
        price: service.price,
        timestamp: new Date().toISOString()
      })
    });
  } catch (error) {
    console.error('Failed to track service inquiry:', error);
  }
  
  if (service.bookingUrl) {
    window.open(service.bookingUrl, '_blank');
  }
};
```

## Troubleshooting

### Services Not Showing
- Check that `services` array has items
- Verify `block.content.services` is not empty
- Ensure `block.settings.visible` is true

### Images Not Loading
- Verify image URLs are accessible
- Check CORS policies on image host
- Ensure URL includes protocol (http:// or https://)

### Categories Not Filtering
- Verify `categories` array has items
- Check that services have `category` property
- Ensure category names match exactly (case-sensitive)

### Booking Button Not Working
- Verify `bookingUrl` is set on service
- Check that `enableBooking` is true in content
- Ensure URL includes protocol (http:// or https://)

### Ratings Not Showing
- Verify `showRatings` is true in content
- Check that services have `rating` property
- Ensure rating is between 0 and 5

## Performance Tips

### Large Service Lists

For 50+ services, consider:

```typescript
// Implement virtual scrolling
import { VirtualScroll } from 'react-virtual-scrolled';

<VirtualScroll
  items={services}
  itemHeight={400}
  renderItem={(service) => <ServiceCard service={service} />}
/>
```

### Image Optimization

Use optimized images:

```typescript
// In service data
image: 'https://cdn.example.com/image-800w.jpg', // Not full resolution
// Or use image CDN with parameters
image: 'https://images.unsplash.com/photo-...?w=800&h=600&fit=crop'
```

### Filter Debouncing

Debounce search input for better performance:

```typescript
const [searchQuery, setSearchQuery] = useState('');
const debouncedQuery = useDebounce(searchQuery, 300);

const filteredServices = useMemo(() => {
  return services.filter(service => 
    service.title.toLowerCase().includes(debouncedQuery.toLowerCase())
  );
}, [services, debouncedQuery]);
```

## Additional Resources

- **Full Documentation**: `ServicesBlock_README.md`
- **Usage Examples**: `ServicesBlock_Usage_Example.tsx`
- **Implementation Summary**: `ServicesBlock_SUMMARY.md`
- **Type Definitions**: `types.ts` (search for ServicesBlockContent)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the README.md for detailed documentation
3. Check the usage examples for implementation patterns
4. Review the type definitions in types.ts

## Migration from Other Systems

### From Link Block
If migrating from simple link blocks:

```typescript
// Old link block
{
  type: 'link',
  content: { title: 'Book Now', url: 'https://calendly.com' }
}

// New services block  
{
  type: 'services',
  content: {
    services: [{
      title: 'Consultation',
      bookingUrl: 'https://calendly.com'
    }]
  }
}
```

### From List Block
If migrating from list blocks:

```typescript
// Old list block
{
  type: 'list',
  content: {
    items: [
      { text: 'Web Dev - $5000' },
      { text: 'Design - $3500' }
    ]
  }
}

// New services block
{
  type: 'services',
  content: {
    services: [
      { title: 'Web Dev', price: '$5000' },
      { title: 'Design', price: '$3500' }
    ]
  }
}
```