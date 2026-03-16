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
import { useTranslation } from '@/lib/i18n';

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
  const { t } = useTranslation();
  return (
    <EmptyState
      icon={<QrCode className="w-full h-full" />}
      title={t('No QR Codes Yet')}
      description={t('Get started by creating your first QR code. Choose from 10+ types including URL, vCard, WiFi, and more.')}
      action={onCreate ? {
        label: t('Create QR Code'),
        onClick: onCreate,
      } : undefined}
    />
  );
}

/**
 * No Search Results Empty State
 */
export function NoSearchResultsEmptyState({ query }: { query?: string }) {
  const { t } = useTranslation();
  return (
    <EmptyState
      icon={<Search className="w-full h-full" />}
      title={t('No Results Found')}
      description={
        query
          ? `${t('No results found for')} "${query}". ${t('Try adjusting your search terms.')}`
          : t('Try a different search query or filter.')
      }
    />
  );
}

/**
 * No Data Empty State
 */
export function NoDataEmptyState({ message }: { message?: string }) {
  const { t } = useTranslation();
  return (
    <EmptyState
      icon={<Inbox className="w-full h-full" />}
      title={t('No Data Available')}
      description={message || t('There is no data to display at this time.')}
    />
  );
}

/**
 * Empty Folder State
 */
export function EmptyFolderState({ onAddItem }: { onAddItem?: () => void }) {
  const { t } = useTranslation();
  return (
    <EmptyState
      icon={<FolderOpen className="w-full h-full" />}
      title={t('Empty Folder')}
      description={t("This folder doesn't contain any items yet.")}
      action={onAddItem ? {
        label: t('Add Item'),
        onClick: onAddItem,
      } : undefined}
    />
  );
}

/**
 * No Analytics Empty State
 */
export function NoAnalyticsEmptyState() {
  const { t } = useTranslation();
  return (
    <EmptyState
      icon={<BarChart3 className="w-full h-full" />}
      title={t('No Analytics Data')}
      description={t('Analytics data will appear here once your QR code receives its first scan.')}
    />
  );
}

/**
 * Error Empty State
 */
export function ErrorEmptyState({
  title,
  message,
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  const { t } = useTranslation();
  return (
    <EmptyState
      icon={<AlertCircle className="w-full h-full text-red-300" />}
      title={title || t('Something Went Wrong')}
      description={message || t('An error occurred while loading the data. Please try again.')}
      action={onRetry ? {
        label: t('Retry'),
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
