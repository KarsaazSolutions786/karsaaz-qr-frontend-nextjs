import React, { useMemo } from 'react';
import { BlockEditorProps, VideoBlockContent } from '../types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const getEmbedUrl = (url: string): { url: string; platform: 'youtube' | 'vimeo' | 'custom' } => {
  if (!url) return { url: '', platform: 'custom' };

  // YouTube
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const youtubeMatch = url.match(youtubeRegex);
  if (youtubeMatch && youtubeMatch[1]) {
    return {
      url: `https://www.youtube.com/embed/${youtubeMatch[1]}`,
      platform: 'youtube'
    };
  }

  // Vimeo
  const vimeoRegex = /(?:vimeo\.com\/)(\d+)/i;
  const vimeoMatch = url.match(vimeoRegex);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      url: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
      platform: 'vimeo'
    };
  }

  return { url, platform: 'custom' };
};

export const VideoBlock: React.FC<BlockEditorProps> = ({ block, onUpdate, isPreview }) => {
  const content = block.content as VideoBlockContent;

  const updateContent = (updates: Partial<VideoBlockContent>) => {
    onUpdate({
      content: { ...content, ...updates }
    });
  };

  const updateSettings = (updates: Partial<typeof block.settings>) => {
    onUpdate({
      settings: { ...block.settings, ...updates }
    });
  };

  const embedData = useMemo(() => getEmbedUrl(content.url), [content.url]);

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
        <div
          className="w-full relative overflow-hidden aspect-video"
          style={{ borderRadius: block.settings.borderRadius || '8px' }} // 16:9 Aspect Ratio
        >
          {embedData.url ? (
            <iframe
              src={embedData.url}
              title={content.title || "Video player"}
              className="absolute top-0 left-0 w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
              Enter a video URL
            </div>
          )}
        </div>

        {content.title && (
          <h3 className="mt-2 text-lg font-semibold text-center" style={{ color: block.settings.textColor }}>
            {content.title}
          </h3>
        )}

        {content.description && (
          <p className="mt-1 text-sm text-center opacity-80" style={{ color: block.settings.textColor }}>
            {content.description}
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
          <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Video URL</Label>
            <Input
              value={content.url}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateContent({ url: e.target.value })}
              placeholder="https://youtube.com/watch?v=..."
            />
            <p className="text-xs text-muted-foreground">
              Supports YouTube and Vimeo URLs.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Title (Optional)</Label>
            <Input
              value={content.title || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateContent({ title: e.target.value })}
              placeholder="Video Title"
            />
          </div>

          <div className="space-y-2">
            <Label>Description (Optional)</Label>
            <Input
              value={content.description || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateContent({ description: e.target.value })}
              placeholder="Add a description..."
            />
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <Label>Autoplay</Label>
            <Switch
              checked={content.autoplay}
              onCheckedChange={(checked) => updateContent({ autoplay: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Show Controls</Label>
            <Switch
              checked={content.controls !== false}
              onCheckedChange={(checked) => updateContent({ controls: checked })}
            />
          </div>

          <div className="space-y-2">
            <Label>Padding</Label>
            <Input
              value={block.settings.padding || '0px'}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSettings({ padding: e.target.value })}
              placeholder="e.g. 10px"
            />
          </div>

          <div className="space-y-2">
            <Label>Background Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={block.settings.backgroundColor || '#ffffff'}
                className="w-12 h-10 p-1 cursor-pointer"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSettings({ backgroundColor: e.target.value })}
              />
              <Input
                value={block.settings.backgroundColor || '#ffffff'}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSettings({ backgroundColor: e.target.value })}
                placeholder="#ffffff"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VideoBlock;
