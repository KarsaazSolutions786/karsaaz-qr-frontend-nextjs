import React from 'react';
import { BlockEditorProps, TitleBlockContent } from '../types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { AlignLeft, AlignCenter, AlignRight, Bold, Italic } from 'lucide-react';

export const TitleBlock: React.FC<BlockEditorProps> = ({ block, onUpdate, isPreview }) => {
  const content = block.content as TitleBlockContent;

  const updateContent = (updates: Partial<TitleBlockContent>) => {
    onUpdate({
      content: { ...content, ...updates }
    });
  };

  const updateSettings = (updates: Partial<typeof block.settings>) => {
    onUpdate({
      settings: { ...block.settings, ...updates }
    });
  };

  const getFontSize = (size: string) => {
    switch (size) {
      case 'small': return '1.25rem';
      case 'medium': return '1.5rem';
      case 'large': return '2rem';
      case 'xlarge': return '2.5rem';
      default: return '1.5rem';
    }
  };

  const HeadingTag = (content.level || 'h2') as keyof JSX.IntrinsicElements;

  if (isPreview) {
    return (
      <HeadingTag
        className="w-full"
        style={{
          textAlign: content.alignment || 'left',
          fontSize: getFontSize(content.fontSize || 'medium'),
          fontWeight: content.bold ? 'bold' : 'normal',
          fontStyle: content.italic ? 'italic' : 'normal',
          color: block.settings.textColor || '#000000',
          padding: block.settings.padding || '0px',
          margin: block.settings.margin || '0px',
        }}
      >
        {content.text || 'Add a title...'}
      </HeadingTag>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Title Text</Label>
        <Input 
          value={content.text} 
          onChange={(e) => updateContent({ text: e.target.value })}
          placeholder="Enter your title"
        />
      </div>

      <div className="flex gap-4">
        <div className="space-y-2 flex-1">
          <Label>Level</Label>
          <Select 
            value={content.level || 'h2'} 
            onValueChange={(value) => updateContent({ level: value as any })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="h1">H1 (Main)</SelectItem>
              <SelectItem value="h2">H2 (Section)</SelectItem>
              <SelectItem value="h3">H3 (Subsection)</SelectItem>
              <SelectItem value="h4">H4 (Small)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 flex-1">
          <Label>Size</Label>
          <Select 
            value={content.fontSize || 'medium'} 
            onValueChange={(value) => updateContent({ fontSize: value as any })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select size" />
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

      <div className="flex justify-between items-center">
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

        <div className="flex gap-2">
           <Button
              variant={content.bold ? 'default' : 'outline'}
              size="icon"
              onClick={() => updateContent({ bold: !content.bold })}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant={content.italic ? 'default' : 'outline'}
              size="icon"
              onClick={() => updateContent({ italic: !content.italic })}
            >
              <Italic className="h-4 w-4" />
            </Button>
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
