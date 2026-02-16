# List Block Component

A comprehensive, dynamic list component for the biolinks block editor with support for multiple list types, nesting, and advanced editing features.

## Features

### Core Functionality
- **Dynamic List Management**: Add, remove, and reorder list items with ease
- **Three List Types**:
  - **Bulleted Lists**: Customizable bullet icons (disc, circle, square, dash, star, arrow)
  - **Numbered Lists**: Automatic numbering with configurable start value
  - **Checklists**: Interactive checkboxes with strikethrough completed items

### Advanced Features
- **Nested Lists**: Support for up to 3 levels of indentation
- **Item Reordering**: Drag handles and button controls for precise positioning
- **Rich Text Editing**: Optional rich text support for list items
- **Live Preview**: Real-time preview of the list as you edit
- **Accessibility**: WCAG 2.2 compliant with proper list markup and ARIA labels

### Customization Options
- **Bullet Icon Selection** (for bullet lists): Choose from multiple icon styles
- **Spacing Control**: Compact, normal, or relaxed spacing between items
- **Starting Number** (for numbered lists): Configure the initial number
- **Custom Styling**: Full integration with the block design system

## Usage

### Basic Implementation

```typescript
import ListBlock from './blocks/ListBlock';

// In your block registry
{
  type: 'list',
  name: 'List',
  description: 'Create dynamic lists',
  component: ListBlock,
  // ... other configuration
}
```

### Block Configuration

```typescript
{
  type: 'list',
  items: [
    {
      id: '1',
      text: 'First item',
      checked: false,
      indentLevel: 0,
      icon: null
    }
  ],
  type: 'bullet', // 'bullet' | 'numbered' | 'checklist'
  bulletIcon: 'disc',
  showRichText: false,
  spacing: 'normal',
  startNumber: 1
}
```

## Component Structure

### Public View Mode
- Renders as semantic `<ul>` or `<ol>` elements
- Proper list markup for screen readers
- Responsive design that adapts to container width
- Maintains indentation levels
- Checklist items show as checked/unchecked with visual feedback

### Edit Mode Features

#### List Type Selector
- Dropdown to choose between bullet, numbered, or checklist
- Dynamically updates the list rendering

#### Bullet Icon Selection
- Available only for bullet lists
- Options: disc, circle, square, dash, star, arrow
- Visual preview of each icon type

#### Item Management Controls
For each list item:
- **Drag Handle**: Grip icon for drag-and-drop reordering
- **Bullet/Number/Checkbox**: Visual indicator based on list type
- **Text Input**: Auto-resizing textarea for content editing
- **Indent Controls**: Up/down buttons for nesting (max 3 levels)
- **Reorder Controls**: Move up/down buttons
- **Remove Button**: Delete item (with minimum 1 item constraint)
- **Add Button**: Insert new item below current one

#### Live Preview Section
- Shows how the list will appear when published
- Updates in real-time as you make changes
- Uses the same rendering logic as public view

## Accessibility Features

### Screen Reader Support
- Proper `<ul>`, `<ol>`, and `<li>` semantic markup
- List item numbers announced for numbered lists
- Checkbox state announced for checklist items
- Indentation levels properly conveyed

### Keyboard Navigation
- Full keyboard support for all controls
- Tab order follows logical flow
- Interactive elements have clear focus indicators

### Visual Accessibility
- High contrast mode compatible
- Sufficient color contrast ratios
- Clear visual hierarchy
- Consistent spacing and alignment

## Technical Implementation

### State Management
- Uses React Hook Form with `useFieldArray` for optimal performance
- Efficient array operations for add/remove/reorder
- Automatic state synchronization with parent component

### Performance Optimizations
- Memoized rendering for list items
- Efficient re-rendering only for changed items
- Debounced updates to parent component
- Optimized for large lists (100+ items)

### Styling System
- Integrates with Tailwind CSS design system
- Responsive breakpoints for mobile devices
- Dark mode support
- Customizable via block design settings

## API Reference

### Props
```typescript
interface ListBlockProps {
  block: Block;
  onUpdate: (updates: Partial<Block>) => void;
  onDelete: () => void;
  isEditing?: boolean;
}
```

### Content Interface
```typescript
interface ExtendedListContent {
  type?: 'bullet' | 'numbered' | 'checklist';
  items: Array<{
    id: string;
    text: string;
    checked?: boolean;
    indentLevel?: number;
    icon?: string | null;
  }>;
  bulletIcon?: string;
  showRichText?: boolean;
  spacing?: 'compact' | 'normal' | 'relaxed';
  startNumber?: number;
  customBulletIcon?: string;
}
```

### Methods
- `handleAddItem(index?)`: Add new item at position or end
- `handleRemoveItem(index)`: Remove item at index
- `handleMoveUp(index)`: Move item up
- `handleMoveDown(index)`: Move item down
- `handleIndent(index)`: Increase indentation
- `handleOutdent(index)`: Decrease indentation
- `handleToggleCheck(index)`: Toggle checklist state

## Examples

### Simple Bullet List
```typescript
{
  type: 'bullet',
  items: [
    { id: '1', text: 'First item', indentLevel: 0 },
    { id: '2', text: 'Second item', indentLevel: 0 },
    { id: '3', text: 'Third item', indentLevel: 0 }
  ],
  bulletIcon: 'disc'
}
```

### Nested Numbered List
```typescript
{
  type: 'numbered',
  items: [
    { id: '1', text: 'Main item 1', indentLevel: 0 },
    { id: '2', text: 'Sub item 1.1', indentLevel: 1 },
    { id: '3', text: 'Sub item 1.2', indentLevel: 1 },
    { id: '4', text: 'Main item 2', indentLevel: 0 }
  ],
  startNumber: 1
}
```

### Interactive Checklist
```typescript
{
  type: 'checklist',
  items: [
    { id: '1', text: 'Task 1', checked: true },
    { id: '2', text: 'Task 2', checked: false },
    { id: '3', text: 'Task 3', checked: false }
  ]
}
```

## Integration Notes

### Dependencies
- React Hook Form (`react-hook-form`)
- Lucide React icons
- Tailwind CSS
- Auto-resizing textarea (`react-textarea-autosize`)

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Progressive enhancement for older browsers

### Future Enhancements
- Rich text formatting (bold, italic, links)
- Image support in list items
- Custom color schemes
- Import/export functionality
- Collaborative editing
- Template presets

## Testing

### Unit Tests
- Component rendering in both public and edit modes
- List type switching functionality
- Item add/remove/reorder operations
- Indentation level management
- Accessibility validation

### Integration Tests
- Block registry integration
- State management with parent component
- Design system integration
- Responsive behavior

### Accessibility Testing
- Screen reader compatibility (NVDA, JAWS, VoiceOver)
- Keyboard navigation validation
- Color contrast compliance
- Focus management verification

## Contributing

When adding new features:
1. Maintain accessibility standards
2. Follow existing code patterns
3. Add comprehensive tests
4. Update documentation
5. Consider performance impact
6. Verify responsive behavior

## License

Part of the Karsaaz QR Frontend Next.js project.