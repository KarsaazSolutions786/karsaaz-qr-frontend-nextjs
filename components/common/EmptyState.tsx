/**
 * Empty States
 * 
 * Empty state components for better UX.
 */

'use client';

import React from 'react';
import { 
  Search, 
  Inbox, 
  AlertCircle, 
  Plus,
  FolderOpen,
  QrCode,
  BarChart3
} from 'lucide-react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
      {icon && (
        <div className="w-16 h-16 mb-4 text-gray-300">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 text-center max-w-md mb-6">
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {action.label}
        </button>
      )}
    </div>
  );
}

/**
 * No QR Codes Empty State
 */
export function NoQRCodesEmptyState({ onCreate }: { onCreate?: () => void }) {
  return (
    <EmptyState
      icon={<QrCode className="w-full h-full" />}
      title="No QR Codes Yet"
      description="Get started by creating your first QR code. Choose from 10+ types including URL, vCard, WiFi, and more."
      action={onCreate ? {
        label: 'Create QR Code',
        onClick: onCreate,
      } : undefined}
    />
  );
}

/**
 * No Search Results Empty State
 */
export function NoSearchResultsEmptyState({ query }: { query?: string }) {
  return (
    <EmptyState
      icon={<Search className="w-full h-full" />}
      title="No Results Found"
      description={
        query
          ? `No results found for "${query}". Try adjusting your search terms.`
          : 'Try a different search query or filter.'
      }
    />
  );
}

/**
 * No Data Empty State
 */
export function NoDataEmptyState({ message }: { message?: string }) {
  return (
    <EmptyState
      icon={<Inbox className="w-full h-full" />}
      title="No Data Available"
      description={message || 'There is no data to display at this time.'}
    />
  );
}

/**
 * Empty Folder State
 */
export function EmptyFolderState({ onAddItem }: { onAddItem?: () => void }) {
  return (
    <EmptyState
      icon={<FolderOpen className="w-full h-full" />}
      title="Empty Folder"
      description="This folder doesn't contain any items yet."
      action={onAddItem ? {
        label: 'Add Item',
        onClick: onAddItem,
      } : undefined}
    />
  );
}

/**
 * No Analytics Empty State
 */
export function NoAnalyticsEmptyState() {
  return (
    <EmptyState
      icon={<BarChart3 className="w-full h-full" />}
      title="No Analytics Data"
      description="Analytics data will appear here once your QR code receives its first scan."
    />
  );
}

/**
 * Error Empty State
 */
export function ErrorEmptyState({ 
  title = 'Something Went Wrong',
  message,
  onRetry,
}: { 
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <EmptyState
      icon={<AlertCircle className="w-full h-full text-red-300" />}
      title={title}
      description={message || 'An error occurred while loading the data. Please try again.'}
      action={onRetry ? {
        label: 'Retry',
        onClick: onRetry,
      } : undefined}
    />
  );
}

/**
 * Generic Empty State with Custom Content
 */
export function CustomEmptyState({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
      {children}
    </div>
  );
}
