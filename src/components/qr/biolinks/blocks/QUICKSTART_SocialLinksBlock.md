# Social Links Block - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Verify Installation

The Social Links Block is already integrated into your Karsaaz QR Biolinks system!

**Files created:**
```
src/components/qr/biolinks/blocks/
├── SocialLinksBlock.tsx          # Main component
├── SocialLinksBlock_README.md    # Documentation
├── SocialLinksBlock_SUMMARY.md   # Implementation details
└── SocialLinksBlock.demo.tsx     # Interactive examples
```

### Step 2: Use in Your Biolink Page

#### Option A: Add via UI (Recommended)

1. Open your biolink editor
2. Click "Add Block"
3. Navigate to "Social" category
4. Select "Social Links"
5. Click "Add Block"

#### Option B: Programmatically

```typescript
import { createBlock } from '@/components/qr/biolinks/block-registry';

// Create a new social links block
const socialBlock = createBlock('social-links');

// Customize it
socialBlock.content.links = [
  {
    platform: 'facebook',
    url: 'https://facebook.com/yourprofile',
    title: 'Facebook'
  },
  {
    platform: 'instagram', 
    url: 'https://instagram.com/yourprofile',
    title: 'Instagram'
  }
];

// Add to your page
addBlockToPage(socialBlock);
```

### Step 3: Configure Your Links

#### In the Editor:

1. **Add Links:**
   - Select platform from dropdown
   - Click "Add"
   - Enter your profile URL

2. **Reorder Links:**
   - Click and hold drag handle
   - Drag to new position
   - Drop to reorder

3. **Customize Appearance:**
   - **Style**: Icons / Buttons / List
   - **Size**: Small / Medium / Large
   - **Colors**: Brand colors or custom
   - **Names**: Show/hide platform names

### Step 4: Platform-Specific URL Formats

| Platform | Correct Format | Example |
|----------|---------------|---------|
| Facebook | `facebook.com/username` | `https://facebook.com/myprofile` |
| Instagram | `instagram.com/username` | `https://instagram.com/myprofile` |
| LinkedIn | `linkedin.com/in/username` | `https://linkedin.com/in/john-doe` |
| Twitter/X | `twitter.com/username` | `https://twitter.com/myprofile` |
| YouTube | `youtube.com/@username` | `https://youtube.com/@mychannel` |
| Email | Any email format | `hello@example.com` |
| Phone | International format | `+1234567890` |
| Website | Full URL | `https://example.com` |

### Step 5: View Your Page

Your social links will appear automatically in the public view of your biolink page!

## 💡 Common Configurations

### 1. Minimal Social Icons
```json
{
  "links": [
    {"platform": "facebook", "url": "https://facebook.com/..."},
    {"platform": "instagram", "url": "https://instagram.com/..."},
    {"platform": "twitter", "url": "https://twitter.com/..."}
  ],
  "style": "icons",
  "size": "medium"
}
```

### 2. Business Contact Info
```json
{
  "links": [
    {"platform": "email", "url": "mailto:hello@company.com"},
    {"platform": "phone", "url": "tel:+15551234567"},
    {"platform": "location", "url": "https://..."},
    {"platform": "website", "url": "https://company.com"}
  ],
  "style": "list",
  "size": "large"
}
```

### 3. Custom Brand Colors
```json
{
  "links": [...],
  "style": "buttons",
  "showPlatformName": true,
  "useBrandColors": false,
  "customColor": "#8B5CF6",
  "size": "medium"
}
```

## 🎨 Styling Tips

### Custom CSS Classes

Add these to your block's `settings.customClasses`:

```css
/* Add shadow to icons */
.social-link-icon {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Button hover effect */
.social-link-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

/* List item styling */
.social-link-list-item {
  border: 1px solid #e5e7eb;
}
```

### Design Settings

Access through block settings:
- **Background Color**: Set container background
- **Padding**: Adjust internal spacing
- **Margin**: Control external spacing
- **Border Radius**: Round container corners

## 🔧 Troubleshooting

### Links not showing?
- Check that each link has a valid URL
- Verify URLs match platform format
- Ensure block is set to "visible"

### Validation errors?
- Double-check URL format matches platform
- Make sure domain is correct (facebook.com, not fb.com for validation)
- Try using the auto-formatting (just enter username)

### Icons not displaying?
- Social links require internet connection for brand colors
- Check browser console for errors
- Verify icons appear in demo component

### Drag & drop not working?
- Ensure JavaScript is enabled
- Try refreshing the page
- Check for browser extension conflicts

## 📚 Next Steps

- **Read the README**: Complete documentation at `SocialLinksBlock_README.md`
- **Try the Demo**: Check `SocialLinksBlock.demo.tsx` for examples
- **View Implementation Details**: See `SocialLinksBlock_SUMMARY.md` for technical info
- **Add More Platforms**: Follow patterns in component to add new platforms

## 🎉 Success!

Your Social Links Block is ready to use! It automatically handles:
- ✅ URL validation and formatting
- ✅ Responsive design on all devices
- ✅ Accessible keyboard navigation
- ✅ Beautiful hover effects
- ✅ Brand-consistent colors
- ✅ Smooth drag & drop reordering

**Happy linking!** 🚀

---

*Need help? Check the full documentation in SocialLinksBlock_README.md*