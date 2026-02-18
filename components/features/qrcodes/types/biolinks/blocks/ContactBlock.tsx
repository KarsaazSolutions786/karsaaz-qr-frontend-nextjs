import React from 'react';
import { User, Mail, Phone, MapPin, GripVertical, Eye, EyeOff, Settings, Trash2 } from 'lucide-react';
import { ContactBlock as ContactBlockType } from '@/types/entities/biolinks';

interface ContactBlockProps {
  block: ContactBlockType;
  onEdit: (block: ContactBlockType) => void;
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  isDragging?: boolean;
}

export const ContactBlock: React.FC<ContactBlockProps> = ({
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
      <div className="flex items-start gap-3 pl-6 pr-20">
        <div className="flex-shrink-0 w-10 h-10 bg-cyan-50 rounded-lg flex items-center justify-center">
          <User className="w-5 h-5 text-cyan-600" />
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <div className="font-medium text-gray-900">{block.name || 'Contact Card'}</div>
          {block.email && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{block.email}</span>
            </div>
          )}
          {block.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="w-4 h-4 flex-shrink-0" />
              <span>{block.phone}</span>
            </div>
          )}
          {block.address && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{block.address}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
