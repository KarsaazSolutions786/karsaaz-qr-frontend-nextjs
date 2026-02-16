"use client";

import { useState } from 'react';
import { BlockEditorProps } from '../types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Type, Bold, Italic, AlignLeft, AlignCenter, AlignRight, X } from 'lucide-react';

/**
 * Title Block
 * A heading block with customizable level, alignment, and styling
 */

export default function TitleBlock({ block, onUpdate, onDelete, isEditing = false }: BlockEditorProps) {
  const { content, design } = block;
  const titleContent = content as {
    text: string;
    level?: 'h1' | 'h2' | 'h3' | 'h4';
    alignment?: 'left' | 'center' | 'right';
    fontSize?: 'small' | 'medium' | 'large' | 'xlarge';
    bold?: boolean;
    italic?: boolean;
  };

  // Handle content changes
  const handleContentChange = (field: string, value: string | number | boolean) => {
    onUpdate({
      content: {
        ...titleContent,
        [field]: value
      }
    });
  };

  // Get font size class based on selection
  const getFontSizeClass = () => {
    const sizeMap = {
      small: 'text-base',
      medium: 'text-lg',
      large: 'text-xl',
      xlarge: 'text-2xl'
    };
    return sizeMap[titleContent.fontSize || 'medium'];
  };

  // Get heading element based on level
  const renderHeading = (text: string) => {
    const baseClasses = [
      'font-semibold',
      'leading-tight',
      'm-0',
      getFontSizeClass(),
      titleContent.bold ? 'font-bold' : '',
      titleContent.italic ? 'italic' : ''
    ].filter(Boolean).join(' ');

    const style = {
      color: design.textColor,
      fontSize: design.fontSize,
      fontFamily: design.fontFamily
    };

    switch (titleContent.level) {
      case 'h1':
        return <h1 className={baseClasses} style={style}>{text}</h1>;
      case 'h2':
        return <h2 className={baseClasses} style={style}>{text}</h2>;
      case 'h3':
        return <h3 className={baseClasses} style={style}>{text}</h3>;
      case 'h4':
        return <h4 className={baseClasses} style={style}>{text}</h4>;
      default:
        return <h2 className={baseClasses} style={style}>{text}</h2>;
    }
  };

  // Render public view
  if (!isEditing) {
    return (
      <div 
        className="block-title"
        style={{ 
          backgroundColor: design.backgroundColor,
          padding: design.padding,
          margin: design.margin,
          borderRadius: design.borderRadius,
          textAlign: titleContent.alignment || 'left'
        }}
        role="heading"
        aria-level={titleContent.level === 'h1' ? 1 : titleContent.level === 'h2' ? 2 : titleContent.level === 'h3' ? 3 : 4}
      >
        {renderHeading(titleContent.text || 'Enter your title...')}
      </div>
    );
  }

  // Render editor interface
  return (
    <div className="block-editor-title space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Type size={20} />
          <h3 className="text-lg font-semibold">Title Block</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <X size={16} />
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Title Text</Label>
          <Input
            value={titleContent.text || ''}
            onChange={(e) => handleContentChange('text', e.target.value)}
            placeholder="Enter your title..."
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Heading Level</Label>
            <Select
              value={titleContent.level || 'h2'}
              onValueChange={(value) => handleContentChange('level', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="h1">H1 (Main)</SelectItem>
                <SelectItem value="h2">H2 (Section)</SelectItem>
                <SelectItem value="h3">H3 (Subsection)</SelectItem>
                <SelectItem value="h4">H4 (Minor)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Font Size</Label>
            <Select
              value={titleContent.fontSize || 'medium'}
              onValueChange={(value) => handleContentChange('fontSize', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
                <SelectItem value="xlarge">Extra Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Alignment</Label>
          <Select
            value={titleContent.alignment || 'left'}
            onValueChange={(value) => handleContentChange('alignment', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">
                <div className="flex items-center gap-2">
                  <AlignLeft size={16} />
                  Left
                </div>
              </SelectItem>
              <SelectItem value="center">
                <div className="flex items-center gap-2">
                  <AlignCenter size={16} />
                  Center
                </div>
              </SelectItem>
              <SelectItem value="right">
                <div className="flex items-center gap-2">
                  <AlignRight size={16} />
                  Right
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={titleContent.bold || false}
                onCheckedChange={(checked) => handleContentChange('bold', checked)}
              />
              <Label className="flex items-center gap-2">
                <Bold size={14} />
                Bold
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={titleContent.italic || false}
                onCheckedChange={(checked) => handleContentChange('italic', checked)}
              />
              <Label className="flex items-center gap-2">
                <Italic size={14} />
                Italic
              </Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}