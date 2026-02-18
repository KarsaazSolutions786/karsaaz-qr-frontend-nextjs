import React from 'react';
import { Image as ImageIcon, GripVertical, Eye, EyeOff, Settings, Trash2 } from 'lucide-react';
import { ImageBlock as ImageBlockType } from '@/types/entities/biolinks';

interface ImageBlockProps {
  block: ImageBlockType;
  onEdit: (block: ImageBlockType) => void;
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  isDragging?: boolean;
}

export const ImageBlock: React.FC<ImageBlockProps> = ({
  block,
  onEdit,
  onDelete,
  onToggleVisibility,
  isDragging,
}) => {
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
            <img
              src={block.url}
              alt={block.alt || 'Image'}
              className="w-full h-48 object-cover rounded-lg"
            />
            {block.caption && (
              <p className="text-sm text-gray-600 text-center">{block.caption}</p>
            )}
            {block.link && (
              <p className="text-xs text-blue-600 truncate">Links to: {block.link}</p>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-gray-500">No image set</div>
          </div>
        )}
      </div>
    </div>
  );
};
