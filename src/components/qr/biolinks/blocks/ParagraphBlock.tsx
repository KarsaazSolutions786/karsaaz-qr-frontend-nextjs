import React from 'react';
import { BlockEditorProps, ParagraphBlockContent } from '../types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';

export const ParagraphBlock: React.FC<BlockEditorProps> = ({ block, onUpdate, isPreview }) => {
  const content = block.content as ParagraphBlockContent;

  const updateContent = (updates: Partial<ParagraphBlockContent>) => {
    onUpdate({
      content: { ...content, ...updates }
    });
  };

  const updateSettings = (updates: Partial<typeof block.settings>) => {
    onUpdate({
      settings: { ...block.settings, ...updates }
    });
  };

  if (isPreview) {
    return (
      <p
        className="w-full whitespace-pre-wrap"
        style={{
          textAlign: content.alignment || 'left',
          fontSize: content.fontSize || '1rem',
          lineHeight: content.lineHeight || 1.5,
          color: block.settings.textColor || '#000000',
          padding: block.settings.padding || '0px',
          margin: block.settings.margin || '0px',
          wordWrap: content.wordWrap || 'break-word',
        }}
      >
        {content.text || 'Add your text here...'}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Content</Label>
        <TextareaAutosize
          className="w-full min-h-[100px] p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background"
          value={content.text}
          onChange={(e) => updateContent({ text: e.target.value })}
          placeholder="Type your paragraph here..."
        />
      </div>

      <div className="flex gap-4">
        <div className="space-y-2 flex-1">
          <Label>Alignment</Label>
          <div className="flex gap-2">
            <Button
              variant={content.alignment === 'left' ? 'default' : 'outline'}
              size="icon"
              onClick={() => updateContent({ alignment: 'left' })}
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              variant={content.alignment === 'center' ? 'default' : 'outline'}
              size="icon"
              onClick={() => updateContent({ alignment: 'center' })}
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              variant={content.alignment === 'right' ? 'default' : 'outline'}
              size="icon"
              onClick={() => updateContent({ alignment: 'right' })}
            >
              <AlignRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Font Size</Label>
          <Select 
            value={content.fontSize || '1rem'} 
            onValueChange={(value) => updateContent({ fontSize: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0.875rem">Small</SelectItem>
              <SelectItem value="1rem">Normal</SelectItem>
              <SelectItem value="1.125rem">Medium</SelectItem>
              <SelectItem value="1.25rem">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Line Height</Label>
          <Select 
            value={String(content.lineHeight || 1.5)} 
            onValueChange={(value) => updateContent({ lineHeight: Number(value) })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select spacing" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Tight</SelectItem>
              <SelectItem value="1.25">Compact</SelectItem>
              <SelectItem value="1.5">Normal</SelectItem>
              <SelectItem value="1.75">Loose</SelectItem>
              <SelectItem value="2">Double</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Text Color</Label>
        <div className="flex gap-2">
          <Input 
            type="color" 
            value={block.settings.textColor || '#000000'}
            className="w-12 h-10 p-1 cursor-pointer"
            onChange={(e) => updateSettings({ textColor: e.target.value })}
          />
          <Input 
            value={block.settings.textColor || '#000000'}
            onChange={(e) => updateSettings({ textColor: e.target.value })}
            placeholder="#000000"
          />
        </div>
      </div>
    </div>
  );
};
