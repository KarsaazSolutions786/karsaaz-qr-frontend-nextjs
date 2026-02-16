"use client";

import { BlockEditorProps } from '../types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Minus, VolumeX, X, Type, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// Import various icons for selector
import { Heart, Star, Music, Camera, Rocket, Sparkles, Zap, AlertCircle, CheckCircle, Info } from 'lucide-react';

/**
 * Divider Block
 * A visual section separator with extensive customization options
 */

// Available divider types
export type DividerType = 'line' | 'dashed' | 'dotted' | 'space';

// Available width options
export type DividerWidth = 'full' | 'large' | 'medium' | 'small';

// Available icon names (must match Lucide icon names)
export const ICON_OPTIONS = [
  { name: 'none', icon: VolumeX },
  { name: 'heart', icon: Heart },
  { name: 'star', icon: Star },
  { name: 'music', icon: Music },
  { name: 'camera', icon: Camera },
  { name: 'rocket', icon: Rocket },
  { name: 'sparkles', icon: Sparkles },
  { name: 'zap', icon: Zap },
  { name: 'alert-circle', icon: AlertCircle },
  { name: 'check-circle', icon: CheckCircle },
  { name: 'info', icon: Info },
  { name: 'minus', icon: Minus },
  { name: 'type', icon: Type }
];

// Helper function to get icon component by name
const getIconComponent = (iconName: string): LucideIcon | null => {
  const iconOption = ICON_OPTIONS.find(opt => opt.name === iconName);
  return iconOption ? iconOption.icon : null;
};

export default function DividerBlock({ block, onUpdate, onDelete, isEditing = false }: BlockEditorProps) {
  const { content, design } = block;
  const dividerContent = content as {
    type: DividerType;
    thickness: number;
    color?: string;
    width: DividerWidth;
    label?: string;
    icon?: string;
    marginTop: number;
    marginBottom: number;
  };

  // Handle content changes
  const handleContentChange = (field: string, value: string | number) => {
    onUpdate({
      content: {
        ...dividerContent,
        [field]: value
      }
    });
  };

  // Get width class based on selection
  const getWidthClass = () => {
    const widthMap = {
      full: 'w-full',
      large: 'w-4/5',
      medium: 'w-3/5',
      small: 'w-2/5'
    };
    return widthMap[dividerContent.width || 'full'];
  };

  // Get divider style based on type
  const getDividerStyle = (): React.CSSProperties => {
    const style: React.CSSProperties = {
      borderColor: dividerContent.color || design.textColor || '#e5e5e5',
      borderTopWidth: `${dividerContent.thickness || 1}px`,
      marginTop: `${dividerContent.marginTop || 1}rem`,
      marginBottom: `${dividerContent.marginBottom || 1}rem`
    };

    // Set border style based on type
    switch (dividerContent.type) {
      case 'dashed':
        style.borderTopStyle = 'dashed';
        break;
      case 'dotted':
        style.borderTopStyle = 'dotted';
        break;
      case 'line':
      default:
        style.borderTopStyle = 'solid';
        break;
      case 'space':
        style.borderTopStyle = 'none';
        style.height = `${Math.max(dividerContent.thickness || 1, 20)}px`;
        break;
    }

    return style;
  };

  // Render divider with optional label and icon
  const renderDivider = () => {
    const hasLabel = dividerContent.label && dividerContent.label.trim().length > 0;
    const hasIcon = dividerContent.icon && dividerContent.icon !== 'none';
    const IconComponent = hasIcon ? getIconComponent(dividerContent.icon) : null;

    // Simple divider without label/icon
    if (!hasLabel && !hasIcon) {
      return (
        <div className={cn("mx-auto", getWidthClass())} style={getDividerStyle()} />
      );
    }

    // Divider with label/icon (centered)
    return (
      <div className={cn("flex items-center mx-auto", getWidthClass())}>
        <div className="flex-1">
          <div style={getDividerStyle()} />
        </div>
        
        {hasLabel || hasIcon ? (
          <div className="flex items-center gap-2 px-3">
            {hasIcon && IconComponent && (
              <IconComponent 
                size={dividerContent.thickness ? (dividerContent.thickness * 2) : 16} 
                style={{ color: dividerContent.color || design.textColor || '#666' }} 
              />
            )}
            {hasLabel && (
              <span 
                className="font-medium text-sm whitespace-nowrap"
                style={{ color: dividerContent.color || design.textColor || '#666' }}
              >
                {dividerContent.label}
              </span>
            )}
          </div>
        ) : null}
        
        <div className="flex-1">
          <div style={getDividerStyle()} />
        </div>
      </div>
    );
  };

  // Render public view
  if (!isEditing) {
    return (
      <div 
        className="block-divider"
        style={{ 
          backgroundColor: design.backgroundColor,
          padding: design.padding,
          margin: design.margin,
          borderRadius: design.borderRadius
        }}
      >
        {renderDivider()}
      </div>
    );
  }

  // Render editor interface
  return (
    <div className="block-editor-divider space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Minus size={20} />
          <h3 className="text-lg font-semibold">Divider Block</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <X size={16} />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Divider Type</Label>
            <Select
              value={dividerContent.type || 'line'}
              onValueChange={(value) => handleContentChange('type', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="line">Line</SelectItem>
                <SelectItem value="dashed">Dashed</SelectItem>
                <SelectItem value="dotted">Dotted</SelectItem>
                <SelectItem value="space">Space</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Thickness (px)</Label>
            <Input
              type="number"
              min={1}
              max={20}
              value={dividerContent.thickness || 1}
              onChange={(e) => handleContentChange('thickness', parseInt(e.target.value) || 1)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Width</Label>
            <Select
              value={dividerContent.width || 'full'}
              onValueChange={(value) => handleContentChange('width', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full">Full Width</SelectItem>
                <SelectItem value="large">Large (80%)</SelectItem>
                <SelectItem value="medium">Medium (60%)</SelectItem>
                <SelectItem value="small">Small (40%)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Color</Label>
            <Input
              type="color"
              value={dividerContent.color || design.textColor || '#e5e5e5'}
              onChange={(e) => handleContentChange('color', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Margin Top (rem)</Label>
            <Input
              type="number"
              min={0}
              max={10}
              step={0.5}
              value={dividerContent.marginTop || 1}
              onChange={(e) => handleContentChange('marginTop', parseFloat(e.target.value) || 0)}
            />
          </div>

          <div>
            <Label>Margin Bottom (rem)</Label>
            <Input
              type="number"
              min={0}
              max={10}
              step={0.5}
              value={dividerContent.marginBottom || 1}
              onChange={(e) => handleContentChange('marginBottom', parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>

        <div>
          <Label>Label Text (Optional)</Label>
          <Input
            value={dividerContent.label || ''}
            onChange={(e) => handleContentChange('label', e.target.value)}
            placeholder="Center label (optional)"
          />
        </div>

        <div>
          <Label>Icon (Optional)</Label>
          <Select
            value={dividerContent.icon || 'none'}
            onValueChange={(value) => handleContentChange('icon', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">
                <div className="flex items-center gap-2">
                  <VolumeX size={16} />
                  None
                </div>
              </SelectItem>
              {ICON_OPTIONS.filter(opt => opt.name !== 'none').map((option) => {
                const Icon = option.icon;
                return (
                  <SelectItem key={option.name} value={option.name}>
                    <div className="flex items-center gap-2">
                      <Icon size={16} />
                      {option.name.charAt(0).toUpperCase() + option.name.slice(1).replace('-', ' ')}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Live Preview */}
      <div className="border-t pt-4">
        <Label className="text-sm font-medium text-muted-foreground">Preview</Label>
        <div className="mt-2 p-4 bg-muted/30 rounded-lg">
          {renderDivider()}
        </div>
      </div>
    </div>
  );
}