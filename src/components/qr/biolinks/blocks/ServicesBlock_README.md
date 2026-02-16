# Services Block Component

A comprehensive service listing component for bio link pages with advanced features for showcasing services with categories, filtering, booking, and rating systems.

## Features

### Core Functionality
- **Multiple Service Listings** - Display unlimited services with detailed information
- **Service Details** - Each service includes title, description, price, duration, and more
- **Category Management** - Group services by categories with easy filtering
- **Featured Services** - Highlight premium or important services with special badges
- **Booking Integration** - Direct booking/appointment CTAs with external URL support
- **Service Images & Icons** - Visual representation with images or emoji icons
- **Reviews & Ratings** - Display star ratings and review counts for each service
- **View Modes** - Both public view and editing modes with full CRUD operations
- **Responsive Card Layout** - Adaptive grid layout that works on all devices
- **Filter & Search** - Real-time search and category filtering

### Editor Features
- Visual service editor with form validation
- Drag-free service management with add/edit/delete
- Category management system
- Real-time preview
- Bulk operations support

## Usage

### Basic Implementation

```tsx
import ServicesBlock from './blocks/ServicesBlock';
import { Block } from '../types';

// Create a services block
const servicesBlock: Block = {
  id: 'services-1',
  type: 'services',
  title: 'Services Block',
  subtitle: 'Showcase your services',
  content: {
    title: 'Our Services',
    description: 'Professional services tailored to your needs',
    services: [
      {
        id: '1',
        title: 'Web Development',
        description: 'Custom web applications built with modern technologies',
        price: '$2,500',
        duration: '4-6 weeks',
        category: 'Development',
        image: 'https://example.com/web-dev.jpg',
        icon: '💻',
        featured: true,
        rating: 4.8,
        reviewCount: 24,
        bookingUrl: 'https://calendly.com/consultation',
        tags: ['React', 'Node.js', 'Full-stack']
      }
    ],
    categories: ['Development', 'Design', 'Consulting'],
    showSearch: true,
    showFilters: true,
    showRatings: true,
    enableBooking: true
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
    textColor: '#333333',
    borderRadius: '8px',
    padding: '1.5rem',
    margin: '1rem'
  }
};

// Use in editor
<ServicesBlock 
  block={servicesBlock} 
  onUpdate={handleUpdate}
  onDelete={handleDelete}
  isEditing={true}
/>

// Use in public view
<ServicesBlock 
  block={servicesBlock}
  isEditing={false}
/>
```

## Content Structure

### ServicesContent Interface

```typescript
interface ServicesContent {
  title?: string;                    // Block title
  description?: string;              // Block description
  services: Service[];               // Array of services
  categories: string[];              // Available categories
  showSearch?: boolean;              // Show/hide search bar
  showFilters?: boolean;             // Show/hide category filters
  showRatings?: boolean;             // Show/hide ratings
  enableBooking?: boolean;           // Enable booking buttons
  featuredBadgeText?: string;        // Text for featured badge
  popularBadgeText?: string;         // Text for popular badge
  defaultView?: 'grid' | 'list';     // Default display mode
  columns?: 1 | 2 | 3;               // Number of columns
  filterType?: 'category' | 'all';   // Filter behavior
}
```

### Service Interface

```typescript
interface Service {
  id: string;              // Unique identifier
  title: string;           // Service title
  description?: string;    // Service description
  price?: string;          // Price (any format)
  duration?: string;       // Duration (any format)
  category?: string;       // Category name
  image?: string;          // Image URL
  icon?: string;           // Emoji or icon
  featured?: boolean;      // Featured service flag
  rating?: number;         // Rating (0-5)
  reviewCount?: number;    // Number of reviews
  reviews?: Review[];      // Detailed reviews
  bookingUrl?: string;     // Booking link
  popular?: boolean;       // Auto-calculated popularity
  tags?: string[];         // Service tags
}
```

## Features in Detail

### 1. Service Cards
- Rich card layout with images/icons
- Price and duration display
- Category badges
- Featured/popular indicators
- Rating stars with review count
- Booking call-to-action buttons

### 2. Filtering & Search
- **Real-time search** - Filter services by title, description, category, or tags
- **Category filters** - Button-based category filtering
- **Smart sorting** - Featured services appear first, then by rating
- **Results counter** - Shows number of matching services

### 3. Categories & Grouping
- **Category management** - Add/remove categories in editor
- **Auto-categorization** - Services grouped by category
- **Category filtering** - One-click category filtering in public view
- **All categories view** - Show all services or filter by specific category

### 4. Featured Services
- **Visual highlighting** - Special border and badge for featured services
- **Priority sorting** - Featured services appear at the top
- **Customizable badge** - Configurable "Featured" badge text
- **Editor toggle** - Easy feature/unfeature in editor

### 5. Ratings & Reviews
- **Star display** - Visual 5-star rating system
- **Half-star support** - Precise rating display (e.g., 4.5 stars)
- **Review count** - Shows number of reviews next to rating
- **Optional display** - Can be hidden in settings

### 6. Booking Integration
- **CTA buttons** - Prominent booking buttons on each service
- **External links** - Links to external booking systems (Calendly, etc.)
- **Configurable** - Can be enabled/disabled per block
- **New window** - Opens in new tab for better UX

### 7. Responsive Design
- **Grid layout** - Configurable 1, 2, or 3 column layout
- **Responsive** - Automatically adjusts for mobile, tablet, desktop
- **Card-based** - Clean card design with proper spacing
- **Mobile optimized** - Touch-friendly buttons and filters

## Editor Interface

### Adding Services
1. Click "Add Service" button
2. Fill in service details in the modal
3. Save to add service to list

### Editing Services
1. Click edit button (pencil icon) on any service card
2. Modify details in the edit modal
3. Save changes to update

### Managing Categories
1. Click "Add Category" button
2. Enter category name
3. Categories are automatically applied to services

### Block Settings
- **Title & Description** - Block header content
- **Columns** - Choose 1, 2, or 3 column layout
- **Display Options** - Toggle search, filters, ratings, booking
- **Badge Text** - Customize "Featured" and "Popular" badges

## Styling & Customization

### Design Props
The component accepts standard block design properties:
- `backgroundColor` - Block background
- `textColor` - Text color
- `padding` - Spacing inside block
- `margin` - Spacing around block
- `borderRadius` - Corner radius

### CSS Classes
Component uses consistent BEM-style classes:
- `.block-services` - Root container
- `.service-card` - Individual service cards
- `.featured-service` - Featured service styling
- `.category-filter` - Category filter buttons
- `.service-rating` - Rating display

## Examples

### Salon Services
```typescript
const salonServices = {
  title: "Our Services",
  description: "Professional hair and beauty treatments",
  services: [
    {
      title: "Hair Styling",
      description: "Professional cut, color, and style",
      price: "$75",
      duration: "2 hours",
      category: "Hair",
      rating: 4.9,
      reviewCount: 127,
      featured: true,
      bookingUrl: "https://calendly.com/salon",
      tags: ["Cut", "Color", "Style"]
    }
  ],
  categories: ["Hair", "Nails", "Skin", "Makeup"]
};
```

### Consulting Services
```typescript
const consultingServices = {
  title: "Consulting Packages",
  services: [
    {
      title: "Strategy Session",
      price: "$500",
      duration: "2 hours",
      category: "Strategy",
      icon: "🎯",
      featured: true
    }
  ],
  categories: ["Strategy", "Implementation", "Training"]
};
```

### Fitness Classes
```typescript
const fitnessServices = {
  title: "Classes & Training",
  services: [
    {
      title: "Personal Training",
      price: "$120/session",
      duration: "1 hour",
      category: "Training",
      image: "https://example.com/training.jpg",
      rating: 5.0,
      reviewCount: 89
    }
  ],
  categories: ["Classes", "Training", "Nutrition"]
};
```

## Dependencies

- React Hook Form (for form management)
- Lucide React (for icons)
- Tailwind CSS (for styling)
- shadcn/ui components (Button, Card, Input, Select, Switch, Badge)

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility

- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Screen reader compatible
- High contrast mode support
- Focus management in modals

## Performance

- Lazy loading for images
- Efficient re-rendering with React.memo
- Optimized filtering with useMemo
- Minimal external dependencies
- Tree-shakeable imports

## Future Enhancements

- [ ] Image upload integration
- [ ] Built-in booking system
- [ ] Service variants/options
- [ ] Package/bundle services
- [ ] Seasonal pricing
- [ ] Waitlist management
- [ ] Service scheduling
- [ ] Customer testimonials
- [ ] Social sharing
- [ ] Analytics integration