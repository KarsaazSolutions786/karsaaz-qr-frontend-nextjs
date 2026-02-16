# Divider Block Component

## Overview
The Divider Block is a highly customizable visual section separator for biolink pages. It provides extensive styling options to create visual separation between content blocks.

## Features

### 1. Visual Section Separator
- Clear visual separation between content blocks
- Clean, minimal design that fits any theme
- Professional appearance for all biolink pages

### 2. Divider Types
Four distinct divider styles:
- **Line**: Solid continuous line
- **Dashed**: Broken line with dashes
- **Dotted**: Line with dot pattern
- **Space**: Invisible spacer for content separation without visual lines

### 3. Customizable Thickness
- Adjustable thickness from 1px to 20px
- Fine-tune visual weight to match your design
- Real-time preview of changes

### 4. Color Selection
- Full color picker support
- Use any hex color for the divider
- Matches text color by default or custom color override

### 5. Width Control
Four width options:
- **Full**: 100% width (default)
- **Large**: 80% width
- **Medium**: 60% width
- **Small**: 40% width
- Centered alignment for all partial widths

### 6. Label/Text in Middle
- Optional centered label text
- Perfect for "or", "and", "continue", etc.
- Automatically positions text centered between divider lines
- Customizable text styling

### 7. Icon Support
11 icon options from Lucide React:
- None (default)
- Heart
- Star
- Music
- Camera
- Rocket
- Sparkles
- Zap
- Alert Circle
- Check Circle
- Info
- Minus

Icons automatically resize based on thickness and appear centered with or without label text.

### 8. Dual View Modes
- **Edit Mode**: Full configuration interface with live preview
- **Public View**: Clean, minimal display for end users
- Seamless switching between modes

### 9. Spacing Controls
- Independent margin top control (0-10rem)
- Independent margin bottom control (0-10rem)
- 0.5rem step increments for precise spacing
- Visual preview of spacing adjustments

### 10. Responsive Behavior
- Fully responsive on all screen sizes
- Scales appropriately for mobile, tablet, and desktop
- Tailwind CSS responsive utilities for consistent behavior

## Usage Example

```typescript
// Create a divider block instance
const dividerBlock = {
  id: 'divider_123',
  type: 'divider',
  title: 'Divider',
  content: {
    type: 'line',
    thickness: 2,
    color: '#e5e5e5',
    width: 'full',
    label: 'or',
    icon: 'none',
    marginTop: 2,
    marginBottom: 2
  },
  settings: {
    visible: true,
    order: 0,
    customClasses: [],
    padding: '0.5rem 0',
    margin: '0.5rem 0'
  },
  design: {
    backgroundColor: 'transparent',
    textColor: '#000000',
    borderRadius: '0px',
    padding: '0.5rem 0',
    margin: '0.5rem 0'
  }
};

// Render in your component
<DividerBlock 
  block={dividerBlock}
  onUpdate={handleUpdate}
  onDelete={handleDelete}
  isEditing={true} // or false for public view
/>
```

## Configuration Fields

| Field | Type | Default | Options | Description |
|-------|------|---------|---------|-------------|
| type | select | 'line' | 'line', 'dashed', 'dotted', 'space' | Divider style |
| thickness | number | 1 | 1-20px | Line thickness |
| color | color | '#e5e5e5' | any hex | Divider color |
| width | select | 'full' | 'full', 'large', 'medium', 'small' | Divider width |
| marginTop | number | 1 | 0-10rem | Top spacing |
| marginBottom | number | 1 | 0-10rem | Bottom spacing |
| label | text | '' | any text | Center label text (optional) |
| icon | select | 'none' | 11 icon options | Center icon (optional) |

## Design Tokens

The Divider Block respects the following design tokens from the block's design object:

- `backgroundColor`: Container background
- `textColor`: Default divider color (can be overridden by content.color)
- `borderRadius`: Container border radius
- `padding`: Container padding
- `margin`: Container margin

## Default Configuration

```typescript
// Default content
{
  type: 'line' as const,
  thickness: 1,
  color: '#e5e5e5',
  width: 'full' as const,
  label: '',
  icon: 'none',
  marginTop: 1,
  marginBottom: 1
}

// Default settings
{
  visible: true,
  order: 0,
  customClasses: [],
  padding: '0.5rem 0',
  margin: '0.5rem 0'
}

// Default design
{
  backgroundColor: 'transparent',
  textColor: '#000000',
  borderRadius: '0px',
  padding: '0.5rem 0',
  margin: '0.5rem 0'
}
```

## Common Use Cases

### 1. Simple Section Break
```typescript
{
  type: 'line',
  thickness: 1,
  width: 'full',
  marginTop: 2,
  marginBottom: 2
}
```

### 2. Decorative Separator
```typescript
{
  type: 'dashed',
  thickness: 2,
  color: '#888',
  width: 'medium',
  marginTop: 3,
  marginBottom: 3
}
```

### 3. Labeled Divider
```typescript
{
  type: 'line',
  thickness: 1,
  width: 'large',
  label: 'Continue',
  icon: 'arrow-right',
  marginTop: 2,
  marginBottom: 2
}
```

### 4. Spacer Only
```typescript
{
  type: 'space',
  thickness: 40, // acts as height for space type
  marginTop: 0,
  marginBottom: 0
}
```

### 5. Decorative Accent
```typescript
{
  type: 'dotted',
  thickness: 3,
  color: '#ff6b6b',
  width: 'small',
  icon: 'star',
  marginTop: 1,
  marginBottom: 1
}
```

## Implementation Details

The Divider Block component:
- Uses React with TypeScript for type safety
- Leverages Tailwind CSS for responsive styling
- Integrates with shadcn/ui components for consistent UI
- Supports all block lifecycle methods (update, delete)
- Provides live preview in edit mode
- Maintains clean separation between edit and public views
- Fully accessible with proper ARIA attributes
- Mobile-responsive by default

## Dependencies

- React
- TypeScript
- Tailwind CSS
- shadcn/ui components (Input, Label, Switch, Select, Button)
- Lucide React icons