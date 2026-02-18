import React from 'react';
import { Download, File, GripVertical, Eye, EyeOff, Settings, Trash2 } from 'lucide-react';
import { DownloadBlock as DownloadBlockType } from '@/types/entities/biolinks';

interface DownloadBlockProps {
  block: DownloadBlockType;
  onEdit: (block: DownloadBlockType) => void;
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  isDragging?: boolean;
}

export const DownloadBlock: React.FC<DownloadBlockProps> = ({
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
      <div className="absolute right-2 top-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onToggleVisibility(block.id)}
          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
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
          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
          title="Edit"
        >
          <Settings className="w-4 h-4 text-gray-600" />
        </button>
        <button
          onClick={() => onDelete(block.id)}
          className="p-1.5 hover:bg-red-50 rounded transition-colors"
          title="Delete"
        >
          <Trash2 className="w-4 h-4 text-red-600" />
        </button>
      </div>

      {/* Content */}
      <div className="flex items-center gap-3 pl-6 pr-20">
        <div className="flex-shrink-0 w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
          <Download className="w-5 h-5 text-amber-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-900 truncate">
            {block.fileName || 'Download File'}
          </div>
          <div className="flex items-center gap-2 mt-1">
            {block.fileType && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
                <File className="w-3 h-3" />
                {block.fileType.toUpperCase()}
              </span>
            )}
            {block.fileSize && (
              <span className="text-xs text-gray-500">{block.fileSize}</span>
            )}
          </div>
          {block.fileUrl && (
            <div className="text-xs text-blue-600 mt-1 truncate">
              {block.fileUrl}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
