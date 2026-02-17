import React from 'react';
import { CheckCircle2, Archive, Draft } from 'lucide-react';
import { cn } from '@/lib/utils';

export type StatusType = 'active' | 'archived' | 'draft';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<StatusType, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
  active: {
    color: 'text-green-700 dark:text-green-300',
    bg: 'bg-green-100 dark:bg-green-900/30',
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    label: 'Active',
  },
  archived: {
    color: 'text-gray-700 dark:text-gray-300',
    bg: 'bg-gray-100 dark:bg-gray-900/30',
    icon: <Archive className="h-3.5 w-3.5" />,
    label: 'Archived',
  },
  draft: {
    color: 'text-amber-700 dark:text-amber-300',
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    icon: <Draft className="h-3.5 w-3.5" />,
    label: 'Draft',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium',
        config.bg,
        config.color,
        className
      )}
    >
      {config.icon}
      <span>{config.label}</span>
    </div>
  );
}
