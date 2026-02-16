# Share Block Quick Start Guide

## 🚀 Getting Started in 30 Seconds

### 1. Import and Use

```typescript
import { BlockEditorProps } from '../types';

// The component is already registered in block-registry.ts
// Just create a new share block using the registry:

import { createBlock } from '../block-registry';

const newShareBlock = createBlock('share');
```

### 2. Minimal Configuration

```typescript
const shareBlock = {
  id: 'my_share_block',
  type: 'share',
  content: {
    platforms: ['facebook', 'twitter', 'whatsapp'],
    title: 'Share this!',
    description: 'Share this page with your friends'
  }
};
```

### 3. Render the Component

```typescript
import ShareBlock from './blocks/ShareBlock';

<ShareBlock
  block={shareBlock}
  onUpdate={handleUpdate}
  onDelete={handleDelete}
  isEditing={false}
/>
```

## 📋 Common Configurations

### Basic Social Sharing
```typescript
{
  platforms: ['facebook', 'twitter', 'linkedin'],
  title: 'Share this content',
  description: 'Help us reach more people'
}
```

### Mobile-First with QR Code
```typescript
{
  platforms: ['whatsapp', 'email'],
  showQRCode: true,
  qrCodeSize: 250,
  customMessage: 'Scan to open on mobile!'
}
```

### Analytics-Enabled
```typescript
{
  platforms: ['facebook', 'twitter', 'linkedin', 'whatsapp', 'email'],
  showCounts: true,
  useWebShareApi: true
}
```

### Minimal Design
```typescript
{
  platforms: ['twitter', 'facebook'],
  buttonStyle: 'minimal',
  showCounts: false
}
```

## 🎨 Styling Examples

### Brand Colors
```typescript
{
  design: {
    backgroundColor: '#your-brand-color',
    textColor: '#ffffff',
    borderRadius: '16px',
    padding: '2rem'
  }
}
```

### Dark Theme
```typescript
{
  design: {
    backgroundColor: '#1a1a1a',
    textColor: '#ffffff',
    padding: '1.5rem'
  }
}
```

## 🎯 Platform-Specific URLs

The component automatically generates correct URLs:

- **Facebook**: `https://www.facebook.com/sharer/sharer.php?u={url}&quote={text}`
- **Twitter**: `https://twitter.com/intent/tweet?url={url}&text={text}`
- **LinkedIn**: `https://www.linkedin.com/sharing/share-offsite/?url={url}&summary={text}`
- **WhatsApp**: `https://wa.me/?text={text}%20{url}`
- **Email**: `mailto:?subject={text}&body={text}%0A%0A{url}`

## 📊 Tracking Shares

### Check Share Counts
```javascript
const analytics = JSON.parse(localStorage.getItem('share_analytics') || '{}');
const myBlockCounts = analytics['my_block_id'] || {};

console.log('Facebook shares:', myBlockCounts.facebook);
console.log('Twitter shares:', myBlockCounts.twitter);
console.log('Copy link:', myBlockCounts.copy);
```

### Track in Google Analytics
```javascript
// Already integrated - you just need gtag installed
gtag('event', 'share', {
  platform: 'facebook',
  block_id: 'my_block_id'
});
```

## 🔧 Advanced Configuration

### Custom Share URL
```typescript
{
  url: 'https://example.com/?utm_source=share&utm_medium=social'
}
```

### Custom Message
```typescript
{
  customMessage: 'Check out this amazing content! 🚀'
}
```

### All Options
```typescript
{
  platforms: ['facebook', 'twitter', 'linkedin', 'whatsapp', 'email'],
  url: '', // defaults to current page
  title: 'Share this page',
  description: 'Description text',
  customMessage: 'Custom message for shares',
  buttonStyle: 'default', // or 'minimal', 'pill', 'outline'
  showCounts: true,
  showQRCode: true,
  qrCodeSize: 200,
  useWebShareApi: true,
  design: {
    backgroundColor: '#ffffff',
    textColor: '#000000',
    borderRadius: '12px',
    padding: '1.5rem',
    margin: '0.5rem 0'
  }
}
```

## 🐛 Troubleshooting

### Web Share API Not Working?
- Must use HTTPS (except localhost)
- User must have triggered the share via user gesture
- Check browser compatibility

### QR Code Not Showing?
- Make sure `showQRCode: true`
- Click "Scan QR Code" to expand
- Check that QRCodeSVG component is installed

### Share Counts Not Updating?
- Clear localStorage and test again
- Share events only tracked in public view
- Check browser console for errors

### Clipboard Copy Fails?
- Ensure HTTPS or localhost
- User must interact with page first
- Check browser permissions
- Component has fallback for older browsers

## 📱 Mobile Optimization

The component is fully optimized for mobile:

- ✅ Native share sheet integration
- ✅ WhatsApp deep linking
- ✅ Touch-friendly buttons (44x44px+)
- ✅ Responsive layout
- ✅ QR code for mobile scanning
- ✅ Web Share API support

## 🎉 Ready to Use!

The Share Block is now fully integrated into your biolinks system and ready for production use. All configuration options are available in the edit mode, and the public view provides a seamless sharing experience for your users.

See `ShareBlock_README.md` for complete documentation.
See `ShareBlock.demo.tsx` for live examples.