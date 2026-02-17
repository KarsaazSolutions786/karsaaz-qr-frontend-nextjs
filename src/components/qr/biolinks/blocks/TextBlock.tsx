"use client";

import { BlockEditorProps } from '../types';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

/**
 * Text Block
 * A simple text block with optional markdown support
 */

export default function TextBlock({ block, onUpdate, onDelete, isEditing = false }: BlockEditorProps) {
  const { content, design } = block;
  const textContent = content as {
    content: string;
    alignment?: 'left' | 'center' | 'right';
    enableMarkdown?: boolean;
  };

  // Handle input changes
  const updateContent = (updates: Partial<typeof textContent>) => {
    onUpdate({
      content: {
        ...textContent,
        ...updates
      }
    });
  };

  // Render text content (public view)
  if (!isEditing) {
    return (
      <div
        className="block-text"
        style={{
          backgroundColor: design.backgroundColor,
          color: design.textColor,
          padding: design.padding,
          margin: design.margin,
          borderRadius: design.borderRadius,
          textAlign: textContent.alignment || 'left'
        }}
      >
        <div style={{
          whiteSpace: 'pre-wrap',
          lineHeight: '1.5',
          fontSize: '1rem'
        }}>
          {textContent.content || 'Enter your text...'}
        </div>
      </div>
    );
  }

  // Render editor interface
  return (
    <div className="block-editor-text space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Text Block</h3>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <X size={16} />
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Content</Label>
          <Textarea
            value={textContent.content || ''}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateContent({ content: e.target.value })}
            placeholder="Enter your text..."
            rows={6}
          />
        </div>

        <div>
          <Label>Alignment</Label>
          <Select
            value={textContent.alignment || 'left'}
            onValueChange={(value) => updateContent({ alignment: value as 'left' | 'center' | 'right' })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="right">Right</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            checked={textContent.enableMarkdown || false}
            onCheckedChange={(checked) => updateContent({ enableMarkdown: checked })}
          />
          <Label>Enable Markdown</Label>
        </div>
      </div>
    </div>
  );
}
