# ProfileBlock Component

A comprehensive, feature-rich profile block component for biolink pages with support for avatars, social links, custom fields, and both edit/public view modes.

## Features

### ✅ Implemented Features

1. **Avatar/Profile Image**
   - Image URL input with error handling
   - Automatic fallback to initials avatar
   - Circular profile image with border
   - Verified badge overlay support

2. **Name and Bio/Description**
   - Required name field
   - Rich text bio with multi-line support
   - Responsive text wrapping

3. **Title/Position**
   - Professional title/position field
   - Prominent display styling

4. **Company/Organization**
   - Company name with building icon
   - Clean, professional presentation

5. **Social Links Integration**
   - 11 supported platforms (Twitter, Facebook, Instagram, YouTube, LinkedIn, GitHub, Twitch, TikTok, Website, Email, Phone)
   - Dynamic add/remove functionality
   - Platform-specific icons and colors
   - URL validation

6. **Verified Badge Option**
   - Toggleable verification status
   - Blue checkmark badge display
   - Visible in both avatar and header

7. **Location**
   - Location input with map pin icon
   - Clean location display

8. **Custom Fields (Dynamic)**
   - Unlimited custom fields
   - Label and value pairs
   - Optional icon selection
   - Visibility toggle
   - Add/remove functionality

9. **Both Edit and Public View Modes**
   - Intuitive edit interface
   - Clean public display
   - Form validation
   - Real-time preview

10. **Responsive Layout (Mobile-First)**
    - Mobile-optimized design
    - Flexible grid system
    - Touch-friendly controls
    - Adaptive typography

11. **Additional Features**
    - Email and phone fields
    - Website URL support
    - Professional contact info display
    - Structured data support
    - TypeScript support

## Usage

### Basic Implementation

```tsx
import ProfileBlock from './ProfileBlock';
import { Block } from '../types';

const profileBlock: Block = {
  id: 'profile-1',
  type: 'profile',
  title: 'My Profile',
  content: {
    name: 'John Doe',
    bio: 'Full-stack developer passionate about web technologies',
    avatar: 'https://example.com/avatar.jpg',
    title: 'Senior Developer',
    company: 'Tech Corp',
    website: 'https://johndoe.com',
    location: 'San Francisco, CA',
    verified: true,
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    socialLinks: [
      { platform: 'twitter', url: 'https://twitter.com/johndoe' },
      { platform: 'github', url: 'https://github.com/johndoe' }
    ],
    customFields: [
      { id: 'field-1', label: 'Years Experience', value: '5+', icon: 'briefcase', visible: true }
    ]
  },
  settings: {
    visible: true,
    order: 0,
    customClasses: [],
    padding: '2rem',
    margin: '0.5rem 0'
  },
  design: {
    backgroundColor: '#ffffff',
    textColor: '#000000',
    borderRadius: '12px',
    padding: '2rem',
    margin: '0.5rem 0'
  }
};

// Public view
<ProfileBlock 
  block={profileBlock} 
  onUpdate={() => {}} 
  onDelete={() => {}}
  isEditing={false}
/>

// Edit view
<ProfileBlock 
  block={profileBlock} 
  onUpdate={handleUpdate} 
  onDelete={handleDelete}
  isEditing={true}
/>
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `block` | `Block` | Yes | The block data object |
| `onUpdate` | `function` | Yes | Callback when content is updated |
| `onDelete` | `function` | Yes | Callback when block is deleted |
| `isEditing` | `boolean` | No | Toggles between edit and public view |

### Content Interface

```typescript
interface ProfileBlockContent {
  name: string;                    // Required
  bio?: string;                    // Optional bio/description
  avatar?: string;                 // Image URL
  title?: string;                  // Professional title
  company?: string;                // Organization name
  website?: string;                // Website URL
  location?: string;               // Location/city
  verified?: boolean;              // Verified badge toggle
  email?: string;                  // Email address
  phone?: string;                  // Phone number
  socialLinks?: SocialMediaLink[]; // Array of social links
  customFields?: CustomField[];    // Array of custom fields
}

interface SocialMediaLink {
  platform: string;                // Platform key (e.g., 'twitter')
  url: string;                     // Profile URL
  icon?: string;                   // Icon identifier
  label?: string;                  // Display label
}

interface CustomField {
  id: string;                      // Unique identifier
  label: string;                   // Field label
  value: string;                   // Field value
  icon?: string;                   // Optional icon
  visible: boolean;                // Visibility toggle
}
```

## Supported Social Platforms

- **Twitter** - Social networking and microblogging
- **Facebook** - Social networking platform
- **Instagram** - Photo and video sharing
- **YouTube** - Video sharing platform
- **LinkedIn** - Professional networking
- **GitHub** - Code hosting and collaboration
- **Twitch** - Live streaming platform
- **TikTok** - Short-form video platform
- **Website** - Generic website link
- **Email** - Email contact link
- **Phone** - Phone contact link

## Styling

The component uses Tailwind CSS classes and supports custom styling through the `design` prop:

- `backgroundColor` - Block background color
- `textColor` - Text color
- `borderRadius` - Border radius
- `padding` - Internal spacing
- `margin` - External spacing

## Edit Mode Features

### Form Sections

1. **Basic Information**
   - Name (required)
   - Title/Position
   - Company
   - Location
   - Email
   - Phone
   - Website
   - Avatar URL

2. **Bio Section**
   - Multi-line text area
   - Supports plain text with line breaks

3. **Verified Badge**
   - Toggle switch
   - Real-time preview

4. **Social Links Management**
   - Add new links dynamically
   - Platform dropdown selection
   - URL validation
   - Remove existing links
   - Reorder capability

5. **Custom Fields**
   - Add/remove fields
   - Label and value inputs
   - Visibility toggles
   - Optional icons

### Validation

- Required fields (name)
- URL validation for websites and social links
- Email format validation
- Phone number format support

## Public View Features

### Responsive Layout

- **Mobile**: Single column, centered layout
- **Tablet**: Maintains mobile layout with larger touch targets
- **Desktop**: Two-column layout (avatar + info)

### Display Elements

1. **Header Section**
   - Profile avatar or initials
   - Verified badge (if enabled)
   - Name and title
   - Company and location

2. **Bio Section**
   - Formatted text display
   - Responsive typography

3. **Contact Information**
   - Email link
   - Phone link
   - Website link

4. **Custom Fields**
   - Label/value pairs
   - Optional icons
   - Filtered by visibility

5. **Social Links**
   - Platform-specific styling
   - Icons with brand colors
   - Hover effects
   - External link indicators

## Accessibility

- Semantic HTML structure
- ARIA labels for interactive elements
- Alt text for images
- Keyboard navigation support
- Screen reader friendly
- High contrast mode support

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Lazy loading for images
- Optimized re-renders
- Efficient state management
- Minimal bundle size
- Fast interaction response

## Examples

See `ProfileBlock.example.tsx` for comprehensive usage examples:
- Complete profile with all features
- Minimal profile setup
- Business profile configuration
- Public vs edit mode examples

## Integration

The ProfileBlock is registered in the block registry and can be added through the block editor interface. It integrates seamlessly with the existing biolinks block system and follows all established patterns and conventions.