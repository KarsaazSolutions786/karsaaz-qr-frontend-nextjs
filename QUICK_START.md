# QR Designer Enhancements - Quick Start Guide

## Overview
This guide provides a quick reference for using the newly enhanced QR Designer components.

## New Components

### 1. ColorPicker
**Location:** `src/components/qr/ColorPicker.tsx`

Provides hex color input + color picker + preset colors.

**Basic Usage:**
```tsx
import { ColorPicker } from "@/components/qr/ColorPicker";
import { useFormContext } from "react-hook-form";

function MyComponent() {
  const { watch, setValue } = useFormContext();
  
  return (
    <ColorPicker
      value={watch("design.foregroundColor") || "#000000"}
      onChange={(color) => setValue("design.foregroundColor", color)}
      label="Foreground Color"
      showPresets={true}
    />
  );
}
```

**Props:**
```tsx
interface ColorPickerProps {
  value?: string;              // Hex color (#RRGGBB)
  onChange: (color: string) => void;  // Called on color change
  label?: string;              // Section label
  showPresets?: boolean;       // Show preset colors
  className?: string;          // Additional styles
}
```

**Preset Colors:**
- #000000 (Black)
- #FFFFFF (White)
- #FF0000 (Red)
- #00AA00 (Green)
- #0000FF (Blue)
- #FFAA00 (Orange)
- #AA00FF (Purple)
- #00AAAA (Cyan)

### 2. PatternSelector
**Location:** `src/components/qr/PatternSelector.tsx`

Visual grid for selecting QR code module patterns.

**Basic Usage:**
```tsx
import { PatternSelector } from "@/components/qr/PatternSelector";
import { useFormContext } from "react-hook-form";

function MyComponent() {
  const { watch, setValue } = useFormContext();
  
  return (
    <PatternSelector
      value={watch("design.module") || "square"}
      onChange={(pattern) => setValue("design.module", pattern)}
      label="Module Pattern"
    />
  );
}
```

**Props:**
```tsx
interface PatternSelectorProps {
  value?: string;              // Pattern ID
  onChange: (pattern: string) => void;
  label?: string;              // Section label
  className?: string;          // Additional styles
}
```

**Available Patterns:**
- `square` - ▢ Square modules
- `rounded` - ◉ Rounded modules
- `circle` - ● Circle modules
- `diamond` - ◆ Diamond modules
- `line` - ║ Line modules
- `dot` - · Dot modules

### 3. StickerPositioning
**Location:** `src/components/qr/StickerPositioning.tsx`

Advanced positioning controls for QR code stickers.

**Basic Usage:**
```tsx
import { StickerPositioning } from "@/components/qr/StickerPositioning";
import { useFormContext } from "react-hook-form";

function MyComponent() {
  const { watch, setValue } = useFormContext();
  
  return (
    <StickerPositioning
      value={{
        x: watch("design.advancedShapePositionX") || 50,
        y: watch("design.advancedShapePositionY") || 50,
        scale: watch("design.advancedShapeScale") || 100,
        rotation: watch("design.advancedShapeRotation") || 0,
        opacity: watch("design.advancedShapeOpacity") || 100,
      }}
      onChange={(state) => {
        setValue("design.advancedShapePositionX", state.x);
        setValue("design.advancedShapePositionY", state.y);
        setValue("design.advancedShapeScale", state.scale);
        setValue("design.advancedShapeRotation", state.rotation);
        setValue("design.advancedShapeOpacity", state.opacity);
      }}
      label="Sticker Positioning"
    />
  );
}
```

**Props:**
```tsx
interface StickerPositioningProps {
  value?: Partial<StickerPositioningState>;
  onChange: (state: StickerPositioningState) => void;
  label?: string;
  className?: string;
}

interface StickerPositioningState {
  x: number;        // 0-100 (%)
  y: number;        // 0-100 (%)
  scale: number;    // 1-200 (%)
  rotation: number; // 0-360 (degrees)
  opacity: number;  // 0-100 (%)
}
```

## Enhanced Components

### FillTypeFields.tsx
Now uses ColorPicker for:
- Main foreground color
- Gradient start color
- Gradient end color
- Eye inner color
- Eye outer color

### BackgroundFields.tsx
Now uses ColorPicker for background color selection.

### LogoFields.tsx
Now uses ColorPicker for logo background fill color.

### OutlinedShapesFields.tsx
Now uses ColorPicker for frame color.

### AdvancedShapeFields.tsx
**Now includes:**
- ColorPicker for sticker frame color
- New StickerPositioning component for advanced positioning
- Only appears when sticker type is selected

### DesignTabs.tsx
**Now includes:**
- PatternSelector as "Quick Pattern Reference"
- Located in Structural Modules section
- Works alongside existing ModuleFields

## Integration Examples

### Using ColorPicker in a custom component
```tsx
import { ColorPicker } from "@/components/qr/ColorPicker";

export function CustomColorControl() {
  const [color, setColor] = useState("#000000");
  
  return (
    <ColorPicker
      value={color}
      onChange={setColor}
      label="Choose Color"
      showPresets
    />
  );
}
```

### Using PatternSelector in a custom component
```tsx
import { PatternSelector } from "@/components/qr/PatternSelector";

export function CustomPatternControl() {
  const [pattern, setPattern] = useState("square");
  
  return (
    <PatternSelector
      value={pattern}
      onChange={setPattern}
      label="Choose Pattern"
    />
  );
}
```

### Full sticker positioning example
```tsx
import { StickerPositioning, type StickerPositioningState } from "@/components/qr/StickerPositioning";

export function StickerEditor() {
  const [position, setPosition] = useState<StickerPositioningState>({
    x: 50,
    y: 50,
    scale: 100,
    rotation: 0,
    opacity: 100,
  });
  
  return (
    <StickerPositioning
      value={position}
      onChange={setPosition}
      label="Positioning"
    />
  );
}
```

## Form Integration

All components work seamlessly with `react-hook-form`:

```tsx
import { useFormContext } from "react-hook-form";
import { ColorPicker } from "@/components/qr/ColorPicker";
import { PatternSelector } from "@/components/qr/PatternSelector";

function QRDesignForm() {
  const { watch, setValue } = useFormContext();
  
  return (
    <div className="space-y-6">
      <ColorPicker
        value={watch("design.foregroundColor")}
        onChange={(color) => setValue("design.foregroundColor", color)}
        label="QR Code Color"
      />
      
      <PatternSelector
        value={watch("design.module")}
        onChange={(pattern) => setValue("design.module", pattern)}
        label="Module Style"
      />
    </div>
  );
}
```

## Styling Notes

All components use Tailwind CSS and support:
- Dark mode (dark: prefix)
- Responsive design
- Custom className prop for additional styles

### Dark Mode Support
```tsx
<ColorPicker
  value={color}
  onChange={setColor}
  className="dark:bg-zinc-900"
/>
```

## TypeScript Support

Full TypeScript support with exported interfaces:

```tsx
import type { StickerPositioningState } from "@/components/qr/StickerPositioning";

const defaultState: StickerPositioningState = {
  x: 50,
  y: 50,
  scale: 100,
  rotation: 0,
  opacity: 100,
};
```

## Common Tasks

### Validate Hex Color
```tsx
const isValidHex = /^#[0-9A-F]{6}$/i.test(color);
```

### Reset to Default Colors
```tsx
const DEFAULT_COLORS = {
  foreground: "#000000",
  background: "#FFFFFF",
  accent: "#0066FF",
};
```

### Export Positioning
```tsx
function exportStickerPosition(state: StickerPositioningState) {
  return {
    position: { x: state.x, y: state.y },
    scale: state.scale,
    rotation: state.rotation,
    opacity: state.opacity / 100, // Convert to 0-1
  };
}
```

## Troubleshooting

### ColorPicker not updating form
Make sure you're using `setValue` from `useFormContext`:
```tsx
const { setValue } = useFormContext();
<ColorPicker onChange={(color) => setValue("fieldName", color)} />
```

### PatternSelector not showing
Ensure the component is within a form context and watch the correct field:
```tsx
const { watch, setValue } = useFormContext();
const value = watch("design.module"); // Must match form field
```

### StickerPositioning preview not visible
Check that all state values are being properly set:
```tsx
onChange={(state) => {
  setValue("design.advancedShapePositionX", state.x); // Required
  setValue("design.advancedShapePositionY", state.y); // Required
  // ... etc
}}
```

## Performance Tips

1. **Use with form context** - Components are optimized for react-hook-form
2. **Memoize callbacks** - If using with useState instead of form context
3. **Debounce expensive operations** - If connected to real-time preview
4. **Use conditional rendering** - Hide when not needed

## Browser Support

All components support:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires:
- React 16.8+
- Tailwind CSS 3.0+

## Getting Help

For detailed documentation, see:
- `QR_DESIGNER_ENHANCEMENTS.md` - Full feature documentation
- `ENHANCEMENTS_SUMMARY.md` - Implementation summary

---

**Version:** 1.0
**Last Updated:** 2024
**Status:** ✅ Production Ready
