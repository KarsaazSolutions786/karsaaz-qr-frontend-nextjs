'use client';

import React from 'react';
import { QRCode } from '@/services/qr.service';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  BarChart2,
  CheckSquare,
  Copy,
  Edit,
  MessageSquare,
  MoreHorizontal,
  Square,
  Trash,
  UserCog,
} from 'lucide-react';
import Link from 'next/link';

interface QRCodeRowProps {
  qr: QRCode;
  isSelected: boolean;
  onSelectChange: (id: string) => void;
  onStats: (qr: QRCode) => void;
  onReviews?: (qr: QRCode) => void;
  onEdit: (qr: QRCode) => void;
  onDuplicate: (qr: QRCode) => void;
  onTransfer: (qr: QRCode) => void;
  onDelete: (qr: QRCode) => void;
}

export function QRCodeRow({
  qr,
  isSelected,
  onSelectChange,
  onStats,
  onReviews,
  onEdit,
  onDuplicate,
  onTransfer,
  onDelete,
}: QRCodeRowProps) {
  // Determine status based on archived and active state
  const getStatus = () => {
    if (qr.archived) return 'archived' as const;
    if (qr.status === 'disabled') return 'draft' as const;
    return 'active' as const;
  };

  const getTypeLabel = (type: string) => {
    return type
      .replace(/-/g, ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors last:border-b-0">
      {/* Checkbox */}
      <button
        onClick={() => onSelectChange(qr.id.toString())}
        className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
      >
        {isSelected ? (
          <CheckSquare className="h-4 w-4 text-blue-600" />
        ) : (
          <Square className="h-4 w-4" />
        )}
      </button>

      {/* QR Thumbnail */}
      <div className="flex-shrink-0">
        <div className="h-10 w-10 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${qr.short_url}`}
            alt={`QR Code for ${qr.name}`}
            className="h-8 w-8"
            loading="lazy"
          />
        </div>
      </div>

      {/* QR Name */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-foreground truncate">{qr.name}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{qr.short_url}</p>
      </div>

      {/* Type Badge */}
      <div className="flex-shrink-0">
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
          {getTypeLabel(qr.type)}
        </span>
      </div>

      {/* Status Badge */}
      <div className="flex-shrink-0">
        <StatusBadge status={getStatus()} />
      </div>

      {/* Scans Count */}
      <div className="flex-shrink-0 text-center">
        <p className="text-sm font-medium text-foreground">{qr.scans_count || 0}</p>
        <p className="text-xs text-muted-foreground">scans</p>
      </div>

      {/* Created Date */}
      <div className="flex-shrink-0 text-right">
        <p className="text-xs text-muted-foreground">
          {qr.created_at ? new Date(qr.created_at).toLocaleDateString() : 'N/A'}
        </p>
      </div>

      {/* Actions Menu */}
      <div className="flex-shrink-0 flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onStats(qr)}
          className="h-8 w-8"
          title="View stats"
        >
          <BarChart2 className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {qr.type === 'business-reviews' && onReviews && (
              <>
                <DropdownMenuItem onClick={() => onReviews(qr)}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Reviews
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem onClick={() => onEdit(qr)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDuplicate(qr)}>
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onTransfer(qr)}>
              <UserCog className="h-4 w-4 mr-2" />
              Transfer
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(qr)}
              className="text-red-600 dark:text-red-400"
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
