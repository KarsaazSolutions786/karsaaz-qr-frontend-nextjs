import React from 'react';
import { Phone, MessageCircle, GripVertical, Eye, EyeOff, Settings, Trash2 } from 'lucide-react';
import { PhoneBlock as PhoneBlockType } from '@/types/entities/biolinks';

interface PhoneBlockProps {
  block: PhoneBlockType;
  onEdit: (block: PhoneBlockType) => void;
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  isDragging?: boolean;
}

export const PhoneBlock: React.FC<PhoneBlockProps> = ({
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
        <div className="flex-shrink-0 w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
          <Phone className="w-5 h-5 text-green-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-900 truncate">
            {block.buttonText || 'Call Now'}
          </div>
          <div className="text-sm text-gray-500 truncate">{block.phone || 'No phone set'}</div>
          {block.showWhatsApp && (
            <div className="flex items-center gap-1 mt-1 text-xs text-green-600">
              <MessageCircle className="w-3 h-3" />
              <span>WhatsApp enabled</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
