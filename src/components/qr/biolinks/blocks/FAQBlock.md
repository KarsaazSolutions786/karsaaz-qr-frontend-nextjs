# FAQ Block

A powerful and interactive FAQ (Frequently Asked Questions) block with collapsible items, search functionality, and SEO optimization.

## Features

### ✅ Core Features

1. **Collapsible Q&A Items**
   - Smooth accordion-style collapse/expand animations
   - Built on Radix UI Accordion component
   - Accessible keyboard navigation

2. **Multiple Items Support**
   - Add unlimited FAQ items
   - Each item has independent question and answer fields

3. **Flexible Opening Modes**
   - **Single Mode**: Only one FAQ item can be open at a time (traditional accordion)
   - **Multiple Mode**: Multiple items can be open simultaneously
   - Configurable per block instance

4. **Animated Transitions**
   - Smooth slide-down/slide-up animations
   - Hardware-accelerated CSS transitions
   - Optimized for performance

5. **Rich Text Support**
   - Questions and answers support full text content
   - Preserves whitespace and formatting
   - Suitable for long-form answers

6. **Item Management**
   - **Add**: Create new FAQ items with one click
   - **Remove**: Delete items individually
   - **Reorder**: Move items up/down in the list
   - **Edit**: Update question and answer text inline

7. **Dual View Modes**
   - **Edit Mode**: Full management interface with controls
   - **Public Mode**: Clean, user-facing FAQ display
   - Seamless transition between modes

8. **Custom Styling**
   - Open/closed state styling via CSS classes
   - Hover effects and focus states
   - Responsive design support

9. **Search & Filter**
   - Real-time search across questions and answers
   - Instant filtering as user types
   - Search result count display
   - Customizable placeholder text

10. **Schema.org Structured Data**
    - Automatic FAQPage schema generation
    - Question and Answer structured data
    - SEO-optimized for search engines
    - Google-rich snippets compatible

## Usage

### Adding FAQ Block

```typescript
import FAQBlock from './blocks/FAQBlock';
import { createBlock } from './block-registry';

// Create a new FAQ block
const faqBlock = createBlock('faq');

// Block structure
{
  id: 'block_123',
  type: 'faq',
  title: 'FAQ',
  content: {
    items: [
      {
        id: 'faq-1',
        question: 'What is your return policy?',
        answer: 'We offer a 30-day return policy...'
      }
    ],
    allowMultipleOpen: false,
    searchPlaceholder: 'Search FAQs...'
  }
}
```

### Public View Example

```tsx
<FAQBlock
  block={faqBlock}
  isEditing={false}
  onUpdate={handleUpdate}
  onDelete={handleDelete}
/>
```

### Edit View Example

```tsx
<FAQBlock
  block={faqBlock}
  isEditing={true}
  onUpdate={handleUpdate}
  onDelete={handleDelete}
/>
```

## Configuration

### Block Settings

```typescript
interface FAQBlockContent {
  items: FAQItem[];
  allowMultipleOpen?: boolean;
  searchPlaceholder?: string;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  open?: boolean;
}
```

### Design Customization

```typescript
interface BlockDesign {
  backgroundColor: string;
  textColor: string;
  borderRadius: string;
  padding: string;
  margin: string;
}
```

## Public View Features

### Search Functionality
- Search input with icon
- Real-time filtering
- Results count display
- Case-insensitive matching
- Searches both questions and answers

### Accordion Behavior
- Smooth animations
- Keyboard accessibility (Enter/Space to toggle)
- Arrow key navigation
- Focus management
- Visual feedback on hover

### SEO Features
- FAQPage structured data
- Question/Answer schema
- Google rich snippet compatible
- Semantic HTML structure

## Edit View Features

### Item Management
- **Add Item**: Quick add button
- **Edit Items**: Inline text editing
- **Reorder**: Up/down arrows for positioning
- **Delete**: Remove items individually
- **Drag Handle**: Visual reordering indicator

### Configuration Options
- **Multiple Open**: Toggle between single/multiple open items
- **Search Placeholder**: Customize search box placeholder text
- **Item Count**: Visual feedback on number of items

### Editor Interface
- Clean, organized layout
- Collapsible sections
- Real-time preview feedback
- Responsive design

## Styling

### CSS Classes

```css
/* Main container */
.block-faq { }

/* Search input container */
.block-faq .search-container { }

/* Individual FAQ item */
.block-faq .accordion-item { }

/* Open state */
.block-faq .accordion-item[data-state="open"] { }

/* Closed state */
.block-faq .accordion-item[data-state="closed"] { }

/* Question trigger */
.block-faq .accordion-trigger { }

/* Answer content */
.block-faq .accordion-content { }
```

### Theme Variables

```css
:root {
  --faq-border-color: rgba(0, 0, 0, 0.1);
  --faq-hover-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  --faq-transition-duration: 200ms;
}
```

## Accessibility

### ARIA Support
- `aria-expanded` for open/closed state
- `aria-controls` for content relationship
- `role="region"` for accordion sections
- Keyboard navigation support

### Keyboard Shortcuts
- `Enter` / `Space`: Toggle item
- `ArrowDown`: Next item
- `ArrowUp`: Previous item
- `Home`: First item
- `End`: Last item

## Performance

### Optimizations
- React `useMemo` for filtered results
- Efficient re-renders with proper state management
- Lazy loading of accordion content
- Hardware-accelerated animations

### Bundle Size
- Uses existing Radix UI accordion
- No additional dependencies
- Tree-shakeable imports

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Mobile Responsiveness

- Full mobile support
- Touch-friendly interactions
- Responsive typography
- Optimized for small screens

## Examples

### Basic FAQ

```typescript
const basicFAQ = {
  type: 'faq',
  content: {
    items: [
      {
        id: '1',
        question: 'How do I get started?',
        answer: 'Simply click the sign up button and follow the instructions.'
      }
    ],
    allowMultipleOpen: false
  }
};
```

### Advanced FAQ with Search

```typescript
const advancedFAQ = {
  type: 'faq',
  content: {
    items: [
      {
        id: '1',
        question: 'What is your refund policy?',
        answer: 'We offer a 30-day money-back guarantee on all purchases.'
      },
      {
        id: '2',
        question: 'Do you offer support?',
        answer: 'Yes, we provide 24/7 customer support via email and chat.'
      }
    ],
    allowMultipleOpen: true,
    searchPlaceholder: 'Search our knowledge base...'
  }
};
```

## Integration

### With Block Editor

```typescript
import { BlockEditor } from './BlockEditor';
import FAQBlock from './blocks/FAQBlock';

function App() {
  return (
    <BlockEditor>
      <FAQBlock
        block={faqBlock}
        isEditing={isEditing}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </BlockEditor>
  );
}
```

### With Theme System

```typescript
const theme = {
  colors: {
    primary: '#3b82f6',
    background: '#ffffff',
    text: '#1f2937'
  },
  spacing: {
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem'
  }
};
```

## Testing

### Test Scenarios

1. **Empty State**: No FAQ items
2. **Single Item**: One FAQ item
3. **Multiple Items**: Many FAQ items
4. **Search**: Filter functionality
5. **Accordion**: Open/close behavior
6. **Responsive**: Mobile layout
7. **Accessibility**: Keyboard navigation
8. **SEO**: Structured data validation

### Performance Tests

- Large FAQ sets (100+ items)
- Rapid search typing
- Multiple simultaneous opens
- Mobile performance

## Troubleshooting

### Common Issues

**Q: Search is not working**
A: Check that items have both question and answer fields populated

**Q: Accordion animations are choppy**
A: Ensure hardware acceleration is enabled in browser

**Q: Structured data not appearing**
A: Verify that FAQ items exist and are published

**Q: Mobile layout issues**
A: Check viewport meta tag and responsive styles

### Debug Mode

Enable debug logging:

```typescript
<FAQBlock
  block={faqBlock}
  isEditing={isEditing}
  debug={true}
/>
```

## Future Enhancements

- [ ] Category/grouping support
- [ ] Vote/helpful rating system
- [ ] Analytics integration
- [ ] A/B testing support
- [ ] Multi-language support
- [ ] Rich text editor for answers
- [ ] Image support in answers
- [ ] Video embed support
- [ ] Export/import functionality

## License

MIT License - see LICENSE file for details

## Support

For support, please open an issue on GitHub or contact the development team.