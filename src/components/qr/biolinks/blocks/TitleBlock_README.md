# TitleBlock Component

## Overview
A complete Title Block component for the Biolink block editor system with full editing capabilities and public view rendering.

## Location
`C:\Dev\karsaaz qr\karsaaz-qr-frontend-nextjs\src\components\qr\biolinks\blocks\TitleBlock.tsx`

## Features Implemented

### 1. Heading Levels (H1-H4)
- Configurable heading level selection (H1, H2, H3, H4)
- Renders correct semantic HTML5 heading element
- Includes accessibility attributes (role="heading", aria-level)

### 2. Text Input
- Text field for heading content
- Required field validation
- Placeholder text for user guidance

### 3. Alignment Options
- Left alignment
- Center alignment
- Right alignment
- Visual icons for each alignment option

### 4. Font Size Controls
- Small (text-base)
- Medium (text-lg)
- Large (text-xl)
- Extra Large (text-2xl)

### 5. Style Variants
- **Bold**: Toggle switch for font-weight bold
- **Italic**: Toggle switch for italic style
- Both can be used independently or together

### 6. View Modes
- **Edit Mode**: Full editing interface with all controls
- **Public View**: Clean rendering with correct semantic elements

### 7. shadcn/ui Components Used
- `Input` - Text input field
- `Label` - Form labels
- `Switch` - Toggle controls for bold/italic
- `Select` - Dropdown menus for level, alignment, font size
- `Button` - Delete button

### 8. Semantic HTML5
- Correct heading elements (h1, h2, h3, h4)
- Proper heading hierarchy
- Semantic markup for accessibility

### 9. Accessibility Support
- ARIA level attributes
- Semantic heading elements
- Keyboard accessible controls
- Screen reader friendly

### 10. Responsive Design
- Tailwind CSS responsive classes
- Flexible container layout
- Mobile-friendly controls

## Data Structure

### TitleBlockContent Interface
```typescript
interface TitleBlockContent {
  text: string;
  level?: 'h1' | 'h2' | 'h3' | 'h4';
  alignment?: 'left' | 'center' | 'right';
  fontSize?: 'small' | 'medium' | 'large' | 'xlarge';
  bold?: boolean;
  italic?: boolean;
}
```

### Default Values
```typescript
defaultData: {
  text: '',
  level: 'h2',
  alignment: 'left',
  fontSize: 'medium',
  bold: false,
  italic: false
}
```

## Editor Interface

### Layout
1. **Header**: Title with Type icon and delete button
2. **Text Input**: Primary heading text field
3. **Dual Controls Row**:
   - Heading Level selector (H1-H4)
   - Font Size selector (Small-XLarge)
4. **Alignment**: Visual alignment options with icons
5. **Style Toggles**: Bold and Italic switches with icons

### User Experience
- Intuitive form layout
- Visual feedback for selections
- Consistent with other block editors
- Real-time preview updates

## Public View Rendering

### Features
- Semantic heading element based on level selection
- Applied styles (bold, italic, font size)
- Alignment and design settings
- Accessible attributes
- Responsive layout

### Example Output
```html
<div class="block-title" style="..." role="heading" aria-level="2">
  <h2 class="font-semibold leading-tight m-0 text-lg">Your Title Text</h2>
</div>
```

## Integration

### Block Registry
- Registered in `block-registry.ts`
- Category: CONTENT
- Icon: Type (from lucide-react)
- Position: After ImageBlock, before ParagraphBlock

### Field Definitions
1. `text` - Title Text (text input, required)
2. `level` - Heading Level (select: h1, h2, h3, h4)
3. `alignment` - Alignment (select: left, center, right)
4. `fontSize` - Font Size (select: small, medium, large, xlarge)
5. `bold` - Bold (boolean toggle)
6. `italic` - Italic (boolean toggle)

## Dependencies

### Imports
- React (useState)
- BlockEditorProps (types)
- shadcn/ui components (Input, Label, Switch, Select, Button)
- lucide-react icons (Type, Bold, Italic, AlignLeft, AlignCenter, AlignRight, X)

### Styling
- Tailwind CSS classes
- Inline styles for dynamic values
- Consistent with block design system

## Usage Example

### Edit Mode
```typescript
<TitleBlock 
  block={block}
  onUpdate={handleUpdate}
  onDelete={handleDelete}
  isEditing={true}
/>
```

### Public View
```typescript
<TitleBlock 
  block={block}
  isEditing={false}
/>
```

## File Changes

### Created Files
1. `TitleBlock.tsx` - Main component file

### Modified Files
1. `types.ts` - Updated TitleBlockContent interface
2. `block-registry.ts` - Updated defaultData and fieldDefinitions

## Testing Checklist

- [x] Heading levels render correct semantic elements
- [x] Text input updates content
- [x] Alignment controls work (left, center, right)
- [x] Font size controls apply correct classes
- [x] Bold toggle applies font-weight
- [x] Italic toggle applies italic style
- [x] Edit mode shows all controls
- [x] Public view renders clean HTML
- [x] Accessibility attributes present
- [x] Responsive design works
- [x] Delete button functional
- [x] Update callbacks work
- [x] Default values applied correctly
- [x] TypeScript types are correct
- [x] Follows established patterns

## Notes

- Component follows the established pattern from TextBlock and LinkBlock
- Uses consistent styling with other blocks
- Maintains type safety with TypeScript
- Includes proper error handling
- Supports all required features from the specification