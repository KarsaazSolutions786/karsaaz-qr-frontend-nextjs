# Biolinks QR Type System

A comprehensive, production-ready landing page builder system for QR codes with drag-and-drop block management, theme customization, and live preview.

## 📁 File Structure

```
components/features/qrcodes/types/biolinks/
├── BiolinksForm.tsx          # Main form component with tabs
├── BlocksManager.tsx          # Drag-and-drop block management
├── BlockSettingsModal.tsx     # Modal for editing block settings
├── BiolinksDesigner.tsx       # Theme and styling customization
├── BiolinksPreview.tsx        # Live preview component
└── index.ts                   # Export barrel file

types/entities/
└── biolinks.ts               # Type definitions and interfaces

lib/api/endpoints/
└── biolinks.ts               # Enhanced API endpoints

app/
└── globals.css               # Added animations
```

## 🎨 Features

### 1. **Profile Section**
- Display name, bio, and avatar
- Cover image support
- Toggle visibility of profile elements
- Real-time preview

### 2. **15+ Block Types**

#### Content Blocks
- **Link** - Button links with icons and thumbnails
- **Text** - Rich text with alignment options
- **Heading** - H1-H6 headings
- **Image** - Images with optional links and captions
- **Video** - Video embeds (YouTube, Vimeo)
- **Divider** - Separators with different styles

#### Interactive Blocks
- **Social Links** - Multiple social media links
- **Contact** - Contact card with multiple fields
- **Email** - Email button with pre-filled subject
- **Phone** - Call button with WhatsApp option
- **Location** - Address with Google Maps integration
- **Newsletter** - Email signup form

#### Advanced Blocks
- **Embed** - Custom HTML/iframe embeds
- **Download** - File download buttons
- **Payment** - Payment links with amounts

### 3. **Drag-and-Drop Reordering**
- Built with @dnd-kit for smooth performance
- Visual feedback during drag operations
- Automatic order preservation

### 4. **Theme Customization**

#### Background Options
- Solid colors
- Gradients (with presets and custom)
- Background images with blur effect

#### Typography
- 8+ font families
- Primary and text color controls
- Responsive text sizing

#### Button Styling
- 3 button styles: Rounded, Square, Pill
- Custom colors and text colors
- Border controls
- Optional shadows

#### Layout Controls
- Max width (320px - 1200px)
- Padding adjustment
- Block spacing
- Border radius
- Custom CSS support

### 5. **Live Preview**
- Real-time updates
- Mobile-optimized preview
- Accurate rendering
- Responsive design

## 🚀 Usage

### Basic Implementation

```tsx
import { BiolinksForm } from '@/components/features/qrcodes/types/biolinks';
import { biolinksAPI } from '@/lib/api/endpoints/biolinks';

function CreateBiolinksPage() {
  const handleSubmit = async (data) => {
    try {
      const biolinks = await biolinksAPI.create({
        qrCodeId: 'qr-123',
        profile: data.profile,
        blocks: data.blocks,
        theme: data.theme,
      });
      console.log('Created:', biolinks);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <BiolinksForm
      onSubmit={handleSubmit}
      onCancel={() => router.back()}
    />
  );
}
```

### With Initial Data (Edit Mode)

```tsx
const [biolinks, setBiolinks] = useState(null);

useEffect(() => {
  biolinksAPI.getById(123).then(setBiolinks);
}, []);

return (
  <BiolinksForm
    initialData={biolinks}
    onSubmit={handleUpdate}
    isLoading={isLoading}
  />
);
```

### Using Individual Components

```tsx
import {
  BlocksManager,
  BiolinksDesigner,
  BiolinksPreview
} from '@/components/features/qrcodes/types/biolinks';

function CustomBuilder() {
  const [blocks, setBlocks] = useState([]);
  const [theme, setTheme] = useState(defaultTheme);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <BlocksManager blocks={blocks} onChange={setBlocks} />
        <BiolinksDesigner theme={theme} onChange={setTheme} />
      </div>
      <div>
        <BiolinksPreview
          profile={{ name: 'John Doe' }}
          blocks={blocks}
          theme={theme}
        />
      </div>
    </div>
  );
}
```

## 📡 API Integration

### Available Endpoints

```typescript
// Create biolinks
biolinksAPI.create(data);

// Get by ID
biolinksAPI.getById(id);

// Get by slug (public)
biolinksAPI.getBySlug(slug);

// Update
biolinksAPI.update({ id, ...data });

// Delete
biolinksAPI.delete(id);

// Toggle publish status
biolinksAPI.togglePublish(id, true);

// Analytics
biolinksAPI.getAnalytics(id, { startDate, endDate });

// Track view (public)
biolinksAPI.trackView(biolinksId, metadata);

// Track block click (public)
biolinksAPI.trackBlockClick(biolinksId, blockId, metadata);

// Clone
biolinksAPI.clone(id);

// Export
biolinksAPI.export(id);

// Templates
biolinksAPI.getTemplates();
biolinksAPI.createFromTemplate(templateId, qrCodeId);
```

### React Query Integration

```tsx
import { useQuery, useMutation } from '@tanstack/react-query';
import { biolinksAPI, biolinksKeys } from '@/lib/api/endpoints/biolinks';

function useBiolinks(id: number) {
  return useQuery({
    queryKey: biolinksKeys.detail(id),
    queryFn: () => biolinksAPI.getById(id),
  });
}

function useCreateBiolinks() {
  return useMutation({
    mutationFn: biolinksAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: biolinksKeys.lists() });
    },
  });
}
```

## 🎯 Type System

### Main Types

```typescript
// Profile settings
interface ProfileSettings {
  name: string;
  bio?: string;
  avatar?: string;
  coverImage?: string;
  showAvatar?: boolean;
  showBio?: boolean;
}

// Theme settings
interface ThemeSettings {
  backgroundColor?: string;
  backgroundGradient?: {
    type: 'linear' | 'radial';
    colors: string[];
    angle?: number;
  };
  buttonStyle?: 'rounded' | 'square' | 'pill';
  // ... and more
}

// Block types
enum BlockType {
  LINK = 'link',
  TEXT = 'text',
  HEADING = 'heading',
  // ... 15+ types
}
```

### Creating Blocks Programmatically

```typescript
import { createBlockTemplate, BlockType } from '@/types/entities/biolinks';

const linkBlock = createBlockTemplate(BlockType.LINK, 0);
linkBlock.title = 'Visit My Website';
linkBlock.url = 'https://example.com';

const textBlock = createBlockTemplate(BlockType.TEXT, 1);
textBlock.content = 'Welcome to my page!';
```

## 🎨 Customization

### Custom Block Settings

Extend `BlockSettingsModal.tsx` to add custom fields:

```tsx
case BlockType.CUSTOM:
  return (
    <div>
      <label>Custom Field</label>
      <input
        value={block.customField}
        onChange={(e) => updateField('customField', e.target.value)}
      />
    </div>
  );
```

### Custom Preview Rendering

Extend `BiolinksPreview.tsx`:

```tsx
case BlockType.CUSTOM:
  return <CustomBlockComponent block={block} theme={theme} />;
```

## 🔒 Security Considerations

1. **Sanitize user input** - All URLs and text should be sanitized
2. **Validate embed codes** - Check iframes for malicious content
3. **Rate limiting** - Apply rate limits on public tracking endpoints
4. **CORS** - Configure CORS for public biolinks pages

## 📊 Analytics

Track biolinks performance:

```tsx
const { data: analytics } = useQuery({
  queryKey: biolinksKeys.analytics(id),
  queryFn: () => biolinksAPI.getAnalytics(id, {
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    groupBy: 'day',
  }),
});

console.log(analytics.totalViews);
console.log(analytics.topBlocks);
console.log(analytics.deviceBreakdown);
```

## 🚀 Performance

- Optimized drag-and-drop with @dnd-kit
- Lazy loading for block settings modal
- Debounced preview updates
- Minimal re-renders with proper memoization

## 📱 Responsive Design

- Mobile-first approach
- Preview pane adapts to screen size
- Touch-friendly drag handles
- Optimized for all devices

## 🧪 Testing

```tsx
import { render, screen } from '@testing-library/react';
import { BiolinksForm } from './BiolinksForm';

test('renders biolinks form', () => {
  render(<BiolinksForm onSubmit={jest.fn()} />);
  expect(screen.getByText('Biolinks Page Builder')).toBeInTheDocument();
});
```

## 🎓 Best Practices

1. **Always provide initial data** when editing
2. **Validate blocks** before saving
3. **Use TypeScript** for type safety
4. **Implement error handling** for API calls
5. **Add loading states** during async operations
6. **Test on mobile devices** regularly

## 🔮 Future Enhancements

- [ ] Block templates library
- [ ] A/B testing for blocks
- [ ] Advanced analytics dashboard
- [ ] Social media preview cards
- [ ] Custom domain support
- [ ] Password protection
- [ ] Scheduling (publish/unpublish)
- [ ] Multi-language support

## 📄 License

Part of Karsaaz QR Code Management System
