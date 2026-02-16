# Social Links Block Component

A comprehensive social media and contact links block for the Karsaaz QR Biolinks system.

## Overview

The Social Links Block allows users to add multiple social media profiles and contact links to their biolink pages with extensive customization options.

## Features

### 1. **Multiple Social Platforms**
- **20+ Supported Platforms:**
  - Facebook, Twitter/X, Instagram, LinkedIn
  - YouTube, TikTok, GitHub, Dribbble, Behance
  - Pinterest, Spotify, Apple, Discord, Twitch
  - Snapchat, WhatsApp, Telegram
  - Generic: Website, Email, Phone, Location

### 2. **Platform Icons**
- All icons from lucide-react library
- Consistent, high-quality SVG icons
- Brand-accurate styling

### 3. **Visual Style Options**
- **Icons Only**: Clean circular icons with brand colors
- **Icon Buttons**: Larger buttons with icons (optional text)
- **List View**: Horizontal list with icons and text

### 4. **Color Customization**
- **Brand Colors**: Automatic platform-specific brand colors
- **Custom Color**: Single custom color for all icons
- **Dynamic Switching**: Toggle between brand/custom colors

### 5. **Size Options**
- **Small**: Compact size (16px icons, tight spacing)
- **Medium**: Standard size (24px icons, balanced spacing)  
- **Large**: Prominent size (32px icons, generous spacing)

### 6. **Link Validation**
- **URL Validation**: Each platform has specific validation rules
- **Domain Matching**: Validates against platform domains
- **Path Validation**: Ensures proper profile URLs
- **Real-time Feedback**: Shows validation errors in editor
- **Format Normalization**: Auto-formats URLs to proper format

### 7. **Open in New Tab**
- **Global Setting**: Apply to all links at once
- **Per-Link Override**: Individual link settings (future enhancement)
- **Security**: Automatic `rel="noopener noreferrer"` attributes

### 8. **View Modes**
- **Edit Mode**: Full-featured editor with drag-and-drop reordering
- **Public View**: Clean, interactive display with hover effects
- **Responsive**: Adapts to all screen sizes

### 9. **Reorder Links**
- **Drag & Drop**: Intuitive drag-and-drop interface
- **Visual Feedback**: Opacity change during dragging
- **Smooth Animations**: CSS transitions for reordering
- **Keyboard Support**: DnD Kit keyboard sensors

### 10. **Responsive Grid Layout**
- **Auto-fit Grid**: Automatically adjusts columns based on container
- **Flexible Sizing**: Minimum/maximum widths for each item
- **Center Alignment**: Proper centering in available space
- **Mobile Optimized**: Stacks appropriately on smaller screens

## Technical Implementation

### Dependencies
- **@dnd-kit/core**: Drag and drop functionality
- **@dnd-kit/sortable**: Sortable list components
- **@dnd-kit/utilities**: DnD utility functions
- **lucide-react**: Icon library
- **Radix UI**: Form components (Input, Select, Switch, Button)

### TypeScript Interfaces

```typescript
interface SocialPlatform {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  placeholder: string;
  domains: string[];
  validateUrl: (url: string) => boolean;
  formatUrl: (url: string) => string;
}

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  title?: string;
  openInNewTab?: boolean;
}
```

### Component Structure

```
SocialLinksBlock/
├── DndContext (Drag & Drop wrapper)
├── SortableContext (Sortable list)
├── Global Settings Panel
│   ├── Style Selector (icons/buttons/list)
│   ├── Size Selector (small/medium/large)
│   ├── Platform Names Toggle
│   ├── Brand Colors Toggle
│   ├── Custom Color Picker
│   └── Open in New Tab Toggle
├── Add Link Section
│   ├── Platform Selector
│   └── Add Button
└── Links List
    └── SortableLinkItem (for each link)
        ├── Drag Handle
        ├── Platform Icon
        ├── URL Input (validated)
        ├── Title Input
        └── Remove Button
```

### URL Validation Rules

Each platform has specific validation:

- **Facebook**: `facebook.com/username` or `fb.com/username`
- **Twitter/X**: `twitter.com/username` or `x.com/username`
- **LinkedIn**: `linkedin.com/in/username` or `linkedin.com/company/name`
- **YouTube**: `youtube.com/@username`, `/c/name`, or `/channel/ID`
- **Email**: `mailto:user@example.com` or plain email
- **Phone**: `tel:+1234567890` or formatted number
- **Website**: Any valid HTTP/HTTPS URL

### Responsive Grid System

The component uses CSS Grid with auto-fit:

```css
grid-template-columns: repeat(auto-fit, minmax(2.5rem, 1fr));
```

Sizes adjust based on selection:
- **Small**: `minmax(2rem, 1fr)`
- **Medium**: `minmax(2.5rem, 1fr)`
- **Large**: `minmax(3rem, 1fr)`

### Hover Effects

Different effects for each style:

- **Icons**: Scale up + opacity change
- **Buttons**: Scale up + opacity change
- **List**: Background color change

### Design Settings

All standard block design settings supported:
- Background color
- Text color
- Padding
- Margin
- Border radius
- Border
- Shadow

## Usage Examples

### Basic Example

```tsx
import SocialLinksBlock from './blocks/SocialLinksBlock';

const block = {
  id: 'social_123',
  type: 'social-links',
  content: {
    links: [
      {
        id: 'link_1',
        platform: 'facebook',
        url: 'https://facebook.com/myprofile',
        title: 'Facebook'
      },
      {
        id: 'link_2',
        platform: 'twitter',
        url: 'https://twitter.com/myprofile',
        title: 'Twitter'
      }
    ],
    style: 'icons',
    size: 'medium',
    useBrandColors: true
  }
};

<SocialLinksBlock 
  block={block} 
  onUpdate={handleUpdate}
  isEditing={false}
/>
```

### Icons Only (Default)

```json
{
  "style": "icons",
  "size": "medium",
  "useBrandColors": true,
  "showPlatformName": false
}
```

### Buttons with Text

```json
{
  "style": "buttons",
  "size": "large",
  "useBrandColors": true,
  "showPlatformName": true
}
```

### Custom Color Scheme

```json
{
  "style": "icons",
  "size": "small",
  "useBrandColors": false,
  "customColor": "#6366f1"
}
```

### Mixed Contact Links

```json
{
  "links": [
    {
      "platform": "email",
      "url": "mailto:hello@example.com",
      "title": "Email Us"
    },
    {
      "platform": "phone",
      "url": "tel:+1234567890",
      "title": "Call Us"
    },
    {
      "platform": "website",
      "url": "https://example.com",
      "title": "Visit Website"
    }
  ],
  "style": "list",
  "size": "medium"
}
```

## Editor Features

### Add Links
1. Select platform from dropdown
2. Click "Add" button
3. Configure URL and title
4. Links automatically appear in public view

### Edit Links
1. Modify URL in input field
2. Validation runs automatically
3. See real-time validation feedback
4. Changes save immediately

### Reorder Links
1. Click and hold drag handle (GripVertical icon)
2. Drag to new position
3. Drop to reorder
4. Changes save automatically

### Remove Links
1. Click trash icon on link item
2. Link removed immediately
3. Public view updates automatically

### Global Settings
- **Style**: Changes entire display format
- **Size**: Scales all icons and spacing
- **Colors**: Toggle between brand/custom colors
- **Platform Names**: Show/hide platform labels
- **New Tab**: Control link behavior globally

## Platform Support

### Social Media
- Facebook: Profile and page URLs
- Twitter/X: Profile URLs
- Instagram: Profile URLs
- LinkedIn: Personal and company pages
- YouTube: Channel URLs (@username, /c/, /channel/)
- TikTok: Profile URLs
- GitHub: Profile URLs
- Dribbble: Profile URLs
- Behance: Profile URLs
- Pinterest: Profile URLs
- Spotify: User profiles
- Discord: Invite links
- Twitch: Channel URLs
- Snapchat: Profile URLs

### Contact
- Email: `mailto:` links
- Phone: `tel:` links with international support
- Website: Any valid URL
- Location: Google Maps links

## Validation Examples

### Valid URLs
```javascript
// Facebook
"https://facebook.com/myprofile"
"https://www.facebook.com/myprofile"

// LinkedIn
"https://linkedin.com/in/john-doe"
"https://linkedin.com/company/company-name"

// Email
"mailto:john@example.com"
"john@example.com" // Auto-formatted

// Phone
"tel:+1234567890"
"+1 (555) 123-4567" // Auto-formatted
```

### Invalid URLs
```javascript
// Facebook (no username)
"https://facebook.com"

// LinkedIn (wrong path)
"https://linkedin.com/john-doe"

// Email (invalid format)
"john@.com"
```

## Styling

### Custom CSS Classes
The component supports custom CSS classes through the `settings.customClasses` array:

```css
/* Icon hover effects */
.social-link-icon:hover {
  transform: scale(1.1);
  opacity: 0.9;
}

/* Button animations */
.social-link-button {
  transition: all 0.2s ease;
}

/* List item hover */
.social-link-list-item:hover {
  background-color: rgba(107, 114, 128, 0.2);
}
```

### Responsive Design
The component is fully responsive:
- Grid automatically adjusts column count
- Icons scale appropriately
- Touch-friendly sizing on mobile
- Proper spacing at all breakpoints

## Future Enhancements

Potential future features:
- [ ] Analytics tracking for link clicks
- [ ] Individual link open-in-new-tab settings
- [ ] Custom icon upload
- [ ] Additional animation options
- [ ] Icon shape options (circle, square, rounded)
- [ ] Social sharing buttons
- [ ] Follow/subscribe counts
- [ ] Link click statistics

## Troubleshooting

### Icons not showing
- Ensure lucide-react is installed: `npm install lucide-react`
- Check imports are correct
- Verify icon names match platform configuration

### Validation errors
- Check URL format matches platform requirements
- Ensure domain is correct for platform
- Verify path structure (e.g., `/in/` for LinkedIn)

### Drag and drop not working
- Ensure @dnd-kit packages are installed
- Check for CSS conflicts with draggable elements
- Verify React version compatibility

### Links not opening
- Confirm `url` field has value
- Check `openInNewTab` setting
- Verify browser popup blocker settings

## Contributing

When adding new platforms:
1. Add platform configuration to `SOCIAL_PLATFORMS`
2. Include proper icon from lucide-react
3. Add validation and format functions
4. Test URL patterns thoroughly
5. Update documentation

## License

Part of the Karsaaz QR Biolinks system.