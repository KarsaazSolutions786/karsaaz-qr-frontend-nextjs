# Share Block Component

A comprehensive social sharing component for biolink pages with support for multiple platforms, analytics tracking, and mobile optimization.

## Features

✅ **Multi-Platform Support**
- Facebook
- Twitter
- LinkedIn
- WhatsApp
- Email

✅ **Core Functionality**
- Copy link to clipboard with visual feedback
- QR code generation for mobile sharing
- Share count tracking
- Customizable button styles
- Pre-populated share messages

✅ **Advanced Features**
- Web Share API integration with fallbacks
- Mobile-optimized sharing
- Analytics tracking
- Responsive design
- Accessibility compliant

## Usage

### Edit Mode
In edit mode, you can configure:
- Title and description
- Selected sharing platforms
- Button styles (default, minimal, pill, outline)
- QR code display options
- Share count visibility
- Web Share API settings
- Custom share message

### Public Mode
In public view, users can:
- Share directly to selected social platforms
- Copy link to clipboard
- Scan QR code for mobile access
- View share counts (if enabled)
- Use native sharing on mobile devices

## Configuration Options

### Content Settings
- `title`: Block title (e.g., "Share this page")
- `description`: Descriptive text
- `customMessage`: Pre-populated message for shares
- `url`: Custom URL to share (defaults to current page)
- `platforms`: Array of selected platforms

### Display Settings
- `buttonStyle`: Visual style of share buttons
- `showCounts`: Toggle share count visibility
- `showQRCode`: Enable/disable QR code
- `qrCodeSize`: Size of QR code in pixels
- `useWebShareApi`: Enable Web Share API

### Design Settings
- `backgroundColor`: Block background color
- `textColor`: Text color
- `padding`: CSS padding value
- `margin`: CSS margin value
- `borderRadius`: CSS border radius

## Analytics

The component tracks share events in localStorage:
- Platform-specific share counts
- Copy link events
- QR code interactions (implied by visits)

### Accessing Analytics
```javascript
// Get share counts for a block
const analytics = JSON.parse(localStorage.getItem('share_analytics') || '{}');
const blockCounts = analytics[blockId] || {};

// Example structure:
{
  "block_123": {
    "facebook": 15,
    "twitter": 8,
    "linkedin": 3,
    "whatsapp": 12,
    "email": 5,
    "copy": 25
  }
}
```

## Implementation Details

### Web Share API
When enabled and supported:
- Triggers native sharing on mobile devices
- Falls back to platform-specific URLs on desktop
- Provides seamless sharing experience

### QR Code
- Generated using `qrcode.react` library
- Click to expand/collapse
- Optimized for mobile scanning
- Customizable size

### Clipboard Integration
- Modern Clipboard API when available
- Fallback for older browsers
- Visual feedback on success/error

### Mobile Optimization
- Touch-friendly buttons
- Responsive layout
- Native app deep linking (WhatsApp)
- Mobile share sheet integration

## Styling

The component uses Tailwind CSS classes and supports custom styling through:
- Block-level design settings
- Button style variants
- Custom CSS classes (via settings)

## Example Usage

```typescript
import ShareBlock from './blocks/ShareBlock';
import { BlockEditorProps } from '../types';

export function MyComponent({ block, onUpdate, onDelete }: BlockEditorProps) {
  return (
    <ShareBlock
      block={block}
      onUpdate={onUpdate}
      onDelete={onDelete}
      isEditing={false}
    />
  );
}
```

## Browser Support

- Chrome/Edge: Full support (Web Share API, Clipboard API)
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Native sharing integration
- Fallbacks provided for older browsers

## Dependencies

- `qrcode.react` - QR code generation
- `lucide-react` - Icons
- `sonner` - Toast notifications
- Tailwind CSS - Styling

## Notes

- Share counts are stored locally in user's browser
- For production analytics, integrate with your backend API
- Consider privacy implications when tracking shares
- Web Share API requires HTTPS in most browsers