import React from 'react';
import { Video, GripVertical, Eye, EyeOff, Settings, Trash2 } from 'lucide-react';
import { VideoBlock as VideoBlockType } from '@/types/entities/biolinks';

interface VideoBlockProps {
  block: VideoBlockType;
  onEdit: (block: VideoBlockType) => void;
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  isDragging?: boolean;
}

export const VideoBlock: React.FC<VideoBlockProps> = ({
  block,
  onEdit,
  onDelete,
  onToggleVisibility,
  isDragging,
}) => {
  const getEmbedUrl = (url: string, platform?: string) => {
    if (platform === 'youtube') {
      const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }
    if (platform === 'vimeo') {
      const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
      return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
    }
    return url;
  };

  return (
    <div
      className={`group relative bg-white border rounded-lg p-4 transition-all ${
        isDragging ? 'opacity-50 shadow-lg' : 'hover:shadow-md'
      } ${!block.visible ? 'opacity-60' : ''}`}
    >
      {/* Drag Handle */}
      <div className="absolute left-2 top-1/2 -translate-y-1/2 cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="w-4 h-4 text-gray-400" />
      </div>

      {/* Controls */}
      <div className="absolute right-2 top-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button
          onClick={() => onToggleVisibility(block.id)}
          className="p-1.5 hover:bg-gray-100 rounded transition-colors bg-white"
          title={block.visible ? 'Hide' : 'Show'}
        >
          {block.visible ? (
            <Eye className="w-4 h-4 text-gray-600" />
          ) : (
            <EyeOff className="w-4 h-4 text-gray-400" />
          )}
        </button>
        <button
          onClick={() => onEdit(block)}
          className="p-1.5 hover:bg-gray-100 rounded transition-colors bg-white"
          title="Edit"
        >
          <Settings className="w-4 h-4 text-gray-600" />
        </button>
        <button
          onClick={() => onDelete(block.id)}
          className="p-1.5 hover:bg-red-50 rounded transition-colors bg-white"
          title="Delete"
        >
          <Trash2 className="w-4 h-4 text-red-600" />
        </button>
      </div>

      {/* Content */}
      <div className="pl-6">
        {block.url ? (
          <div className="space-y-2">
            {block.title && (
              <div className="font-medium text-gray-900">{block.title}</div>
            )}
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              {block.platform === 'youtube' || block.platform === 'vimeo' ? (
                <iframe
                  src={getEmbedUrl(block.url, block.platform)}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={block.url}
                  controls
                  className="w-full h-full object-cover"
                  poster={block.thumbnail}
                />
              )}
            </div>
            <div className="text-xs text-gray-500 capitalize">
              {block.platform || 'custom'} video
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <Video className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-gray-500">No video set</div>
          </div>
        )}
      </div>
    </div>
  );
};
