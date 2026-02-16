# Paragraph Block Component

A comprehensive rich text paragraph block for the biolinks system with advanced editing features.

## Features

### ✨ Core Features
- **Multi-line Text Area**: Auto-resizing textarea that grows with content
- **Alignment Options**: Left, center, and right text alignment
- **HTML Support**: Optional HTML rendering with XSS protection
- **Character Count**: Real-time character counting with validation
- **Max Length Validation**: Configurable maximum length with warnings
- **Dual View Modes**: Edit mode and public view mode
- **Auto-resizing**: Automatically resizes based on content using react-textarea-autosize
- **Placeholder Text**: Configurable placeholder for empty states
- **Word Wrapping**: Control over word break behavior
- **Readability Optimization**: Built-in readability scoring

### 🎨 Customization
- **Font Size**: Small (14px), Normal (16px), Large (18px), Extra Large (20px)
- **Line Spacing**: Compact (1.2), Normal (1.4), Relaxed (1.6), Loose (1.8)
- **Word Wrapping**: Normal, Break Word, Break All
- **Max Length**: 500, 1,000, 2,000, 5,000, 10,000 characters
- **Placeholder**: Custom placeholder text
- **HTML Support**: Toggle for rendering HTML content

### 🔒 Security
- **HTML Sanitization**: Built-in XSS protection for HTML content
- **Character Limits**: Prevents excessive content length
- **Safe Rendering**: Scripts and dangerous attributes are stripped

## Usage

### Basic Usage
```tsx
import ParagraphBlock from '@/components/qr/biolinks/blocks/ParagraphBlock';
import { Block } from '@/components/qr/biolinks/types';

const block: Block = {
  id: 'para-001',
  type: 'paragraph',
  title: 'My Paragraph',
  content: {
    text: 'This is my paragraph content',
    alignment: 'left',
    enableHtml: false,
    maxLength: 5000,
    placeholder: 'Enter your paragraph...',
    wordWrap: 'normal',
    lineHeight: 1.6,
    fontSize: '1rem'
  },
  settings: { /* ... */ },
  design: { /* ... */ }
};

<ParagraphBlock
  block={block}
  onUpdate={(updates) => console.log('Update:', updates)}
  onDelete={() => console.log('Delete')}
  isEditing={true}
/>
```

### Edit Mode
In edit mode, users get access to:
- Auto-resizing textarea
- Real-time character count
- Alignment controls
- Font size selection
- Line spacing options
- Word wrapping settings
- Maximum length configuration
- Placeholder text customization
- Readability score indicator
- HTML toggle (advanced)

### Public View Mode
In public view mode, the block renders:
- Clean, readable text
- Applied styling (font size, line height, alignment)
- Sanitized HTML (if enabled)
- Responsive word wrapping

## Content Interface

```typescript
interface ParagraphBlockContent {
  text: string;                    // Main paragraph text
  alignment?: 'left' | 'center' | 'right'; // Text alignment
  enableHtml?: boolean;           // Enable HTML rendering
  maxLength?: number;             // Maximum character limit
  placeholder?: string;           // Placeholder for empty state
  wordWrap?: 'normal' | 'break-word' | 'break-all'; // Word wrapping
  lineHeight?: number;            // Line spacing (1.2-1.8)
  fontSize?: string;              // Font size in CSS units
}
```

## Default Values

- **text**: '' (empty string)
- **alignment**: 'left'
- **enableHtml**: false
- **maxLength**: 5000
- **placeholder**: 'Enter your paragraph...'
- **wordWrap**: 'normal'
- **lineHeight**: 1.6
- **fontSize**: '1rem' (16px)

## Readability Scoring

The component includes a built-in readability calculator that provides:
- **Score Range**: 0-100 (higher is better)
- **Formula**: Simplified Flesch Reading Ease
- **Factors**: Sentence length and word complexity
- **Labels**:
  - 90-100: Very Easy
  - 80-89: Easy
  - 70-79: Fairly Easy
  - 60-69: Standard
  - 50-59: Fairly Difficult
  - 30-49: Difficult
  - 0-29: Very Difficult

## HTML Sanitization

When HTML is enabled, the component sanitizes content by:
1. Removing all `<script>` tags
2. Stripping inline event handlers (`on*` attributes)
3. Removing dangerous URL protocols (javascript:, data:text/html, vbscript:)
4. Returning safe, cleaned HTML for rendering

## Dependencies

- **react-textarea-autosize**: ^8.5.9 (automatically installed)
- **lucide-react**: ^0.563.0 (icons)
- **@radix-ui/react-select**: ^2.2.6 (select dropdowns)
- **@radix-ui/react-label**: ^2.1.8 (labels)
- **@radix-ui/react-switch**: ^1.2.6 (toggles)

## Styling

The component uses:
- Tailwind CSS classes
- CSS-in-JS for dynamic styles
- Responsive design patterns
- Consistent with biolinks design system

## Performance

- **Auto-resize**: Efficiently resizes using react-textarea-autosize
- **Memoization**: Readability score calculated with useMemo
- **Controlled Input**: Prevents unnecessary re-renders
- **Sanitization**: Client-side only (for SSR compatibility)

## Accessibility

- **ARIA Labels**: Proper labeling for form controls
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Compatible with screen readers
- **High Contrast**: Readable text in all modes

## Examples

### Example 1: Simple Paragraph
```typescript
{
  text: 'Welcome to my bio link page! This is where I share my content and connect with my audience.',
  alignment: 'center',
  fontSize: '1.125rem'
}
```

### Example 2: With HTML Support
```typescript
{
  text: '<strong>Important:</strong> Please <a href="https://example.com">visit my website</a> for more info.',
  enableHtml: true,
  maxLength: 1000
}
```

### Example 3: Optimized for Readability
```typescript
{
  text: 'This is a longer paragraph that has been optimized for readability. The line spacing is relaxed and the font size is slightly larger for better reading experience.',
  lineHeight: 1.8,
  fontSize: '1.125rem',
  wordWrap: 'break-word'
}
```

## Block Registry Configuration

The block is registered in `block-registry.ts` with:
- Type: 'paragraph'
- Name: 'Paragraph'
- Category: 'content'
- Default values for all fields
- Comprehensive field definitions for editor

## Integration

The component integrates seamlessly with:
- BlockEditor component
- Biolinks design system
- Drag and drop functionality
- Theme customization
- Responsive layouts