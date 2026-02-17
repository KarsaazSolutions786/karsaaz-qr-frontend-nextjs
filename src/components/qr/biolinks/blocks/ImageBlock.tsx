import React from 'react';
import { BlockEditorProps, ImageBlockContent } from '../types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const ImageBlock: React.FC<BlockEditorProps> = ({ block, onUpdate, isPreview }) => {
  const content = block.content as ImageBlockContent;

  const updateContent = (updates: Partial<ImageBlockContent>) => {
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
      <div
        className="w-full flex flex-col items-center"
        style={{
          padding: block.settings.padding,
          margin: block.settings.margin,
          backgroundColor: block.settings.backgroundColor,
          borderRadius: block.settings.borderRadius,
        }}
      >
        {content.link ? (
          <a href={content.link} target="_blank" rel="noopener noreferrer" className="block w-full">
            <img
              src={content.url || "https://placehold.co/600x400?text=Image+Block"}
              alt={content.alt || "Biolink Image"}
              className="w-full h-auto object-cover"
              style={{
                borderRadius: block.settings.borderRadius || '8px',
                width: content.width || '100%',
                maxHeight: content.height || 'auto'
              }}
            />
          </a>
        ) : (
          <img
            src={content.url || "https://placehold.co/600x400?text=Image+Block"}
            alt={content.alt || "Biolink Image"}
            className="w-full h-auto object-cover"
            style={{
              borderRadius: block.settings.borderRadius || '8px',
              width: content.width || '100%',
              maxHeight: content.height || 'auto'
            }}
          />
        )}

        {content.title && (
          <h3 className="mt-2 text-lg font-semibold text-center" style={{ color: block.settings.textColor }}>
            {content.title}
          </h3>
        )}

        {content.caption && (
          <p className="mt-1 text-sm text-center opacity-80" style={{ color: block.settings.textColor }}>
            {content.caption}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="content">
        <TabsList className="w-full">
          <TabsTrigger value="content" className="flex-1">Content</TabsTrigger>
          <TabsTrigger value="style" className="flex-1">Style</TabsTrigger>
          <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Image URL</Label>
            <Input
              value={content.url}
              onChange={(e) => updateContent({ url: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-muted-foreground">
              Enter an image URL directly or upload (coming soon).
            </p>
          </div>

          <div className="space-y-2">
            <Label>Link (Optional)</Label>
            <Input
              value={content.link || ''}
              onChange={(e) => updateContent({ link: e.target.value })}
              placeholder="https://mysite.com"
            />
          </div>

          <div className="space-y-2">
            <Label>Title (Optional)</Label>
            <Input
              value={content.title || ''}
              onChange={(e) => updateContent({ title: e.target.value })}
              placeholder="Image Title"
            />
          </div>

          <div className="space-y-2">
            <Label>Caption (Optional)</Label>
            <Input
              value={content.caption || ''}
              onChange={(e) => updateContent({ caption: e.target.value })}
              placeholder="Add a caption..."
            />
          </div>

          <div className="space-y-2">
            <Label>Alt Text</Label>
            <Input
              value={content.alt || ''}
              onChange={(e) => updateContent({ alt: e.target.value })}
              placeholder="Description for accessibility"
            />
          </div>
        </TabsContent>

        <TabsContent value="style" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Width</Label>
            <Select
              value={content.width || '100%'}
              onValueChange={(value) => updateContent({ width: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select width" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="100%">Full Width (100%)</SelectItem>
                <SelectItem value="75%">75%</SelectItem>
                <SelectItem value="50%">50%</SelectItem>
                <SelectItem value="25%">25%</SelectItem>
                <SelectItem value="auto">Auto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Border Radius</Label>
            <Select
              value={block.settings.borderRadius || '8px'}
              onValueChange={(value) => updateSettings({ borderRadius: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select radius" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0px">None</SelectItem>
                <SelectItem value="4px">Small</SelectItem>
                <SelectItem value="8px">Medium</SelectItem>
                <SelectItem value="16px">Large</SelectItem>
                <SelectItem value="9999px">Full (Circle)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <Label>Visible</Label>
            <Switch
              checked={block.settings.visible}
              onCheckedChange={(checked) => updateSettings({ visible: checked })}
            />
          </div>

          <div className="space-y-2">
            <Label>Padding</Label>
            <Select
              value={block.settings.padding || '0px'}
              onValueChange={(value) => updateSettings({ padding: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select padding" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0px">None</SelectItem>
                <SelectItem value="8px">Small</SelectItem>
                <SelectItem value="16px">Medium</SelectItem>
                <SelectItem value="24px">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Background Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={block.settings.backgroundColor || '#ffffff'}
                className="w-12 h-10 p-1 cursor-pointer"
                onChange={(e) => updateSettings({ backgroundColor: e.target.value })}
              />
              <Input
                value={block.settings.backgroundColor || '#ffffff'}
                onChange={(e) => updateSettings({ backgroundColor: e.target.value })}
                placeholder="#ffffff"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ImageBlock;
