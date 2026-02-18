/**
 * Filter Types
 * 
 * Defines filtering and sorting options for QR code lists
 * including filter presets and URL parameter sync.
 */

import { QRCodeType } from './qrcode';

// QR Code Status
export type QRCodeStatus = 'active' | 'inactive' | 'archived';

// Sort Fields
export type SortField =
  | 'createdAt'
  | 'updatedAt'
  | 'name'
  | 'scans'
  | 'type';

// Sort Direction
export type SortDirection = 'asc' | 'desc';

// Sort Option
export interface SortOption {
  field: SortField;
  direction: SortDirection;
}

// Date Range
export interface DateRange {
  startDate: string | null; // ISO 8601 or null
  endDate: string | null; // ISO 8601 or null
}

// Scan Count Range
export interface ScanCountRange {
  min: number | null;
  max: number | null;
}

// QR Code Filter
export interface QRCodeFilter {
  // Search
  search?: string; // Search by name or data
  
  // Type filter
  types?: QRCodeType[]; // Filter by QR code types
  
  // Status filter
  statuses?: QRCodeStatus[]; // Filter by status
  
  // Folder filter
  folderId?: string | null; // Filter by folder (null for root)
  
  // Date range filter
  createdDateRange?: DateRange; // Filter by creation date
  updatedDateRange?: DateRange; // Filter by last update
  
  // Scan count filter
  scanCount?: ScanCountRange; // Filter by scan count
  
  // Sort
  sort?: SortOption; // Sort option
  
  // Tags filter (if implemented)
  tags?: string[]; // Filter by tags
}

// Filter Preset
export interface FilterPreset {
  id: string; // UUID
  userId: string; // Owner ID
  name: string; // Preset name
  description?: string; // Optional description
  filter: QRCodeFilter; // Saved filter configuration
  isDefault?: boolean; // Default preset
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

// Create/Update Filter Preset
export interface CreateFilterPresetData {
  name: string;
  description?: string;
  filter: QRCodeFilter;
  isDefault?: boolean;
}

export interface UpdateFilterPresetData {
  name?: string;
  description?: string;
  filter?: QRCodeFilter;
  isDefault?: boolean;
}

// Built-in Filter Presets
export const BUILTIN_FILTER_PRESETS: Partial<FilterPreset>[] = [
  {
    id: 'all',
    name: 'All QR Codes',
    description: 'Show all QR codes',
    filter: {},
    isDefault: true,
  },
  {
    id: 'active',
    name: 'Active Only',
    description: 'Show only active QR codes',
    filter: {
      statuses: ['active'],
    },
  },
  {
    id: 'archived',
    name: 'Archived',
    description: 'Show archived QR codes',
    filter: {
      statuses: ['archived'],
    },
  },
  {
    id: 'recent',
    name: 'Recently Created',
    description: 'Created in the last 7 days',
    filter: {
      sort: {
        field: 'createdAt',
        direction: 'desc',
      },
    },
  },
  {
    id: 'popular',
    name: 'Most Scanned',
    description: 'Sorted by scan count',
    filter: {
      sort: {
        field: 'scans',
        direction: 'desc',
      },
    },
  },
  {
    id: 'unused',
    name: 'Never Scanned',
    description: 'QR codes with zero scans',
    filter: {
      scanCount: {
        min: null,
        max: 0,
      },
    },
  },
];

// Sort Option Labels
export const SORT_OPTIONS: Record<SortField, string> = {
  createdAt: 'Date Created',
  updatedAt: 'Last Modified',
  name: 'Name',
  scans: 'Scan Count',
  type: 'Type',
};

// Status Labels
export const STATUS_LABELS: Record<QRCodeStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
  archived: 'Archived',
};

// Helper Functions

/**
 * Check if filter is empty (no filters applied)
 */
export function isEmptyFilter(filter: QRCodeFilter): boolean {
  return (
    !filter.search &&
    (!filter.types || filter.types.length === 0) &&
    (!filter.statuses || filter.statuses.length === 0) &&
    filter.folderId === undefined &&
    !filter.createdDateRange &&
    !filter.updatedDateRange &&
    !filter.scanCount &&
    !filter.sort &&
    (!filter.tags || filter.tags.length === 0)
  );
}

/**
 * Convert filter to URL query parameters
 */
export function filterToQueryParams(filter: QRCodeFilter): URLSearchParams {
  const params = new URLSearchParams();
  
  if (filter.search) {
    params.set('search', filter.search);
  }
  
  if (filter.types && filter.types.length > 0) {
    params.set('types', filter.types.join(','));
  }
  
  if (filter.statuses && filter.statuses.length > 0) {
    params.set('statuses', filter.statuses.join(','));
  }
  
  if (filter.folderId) {
    params.set('folder', filter.folderId);
  }
  
  if (filter.createdDateRange) {
    if (filter.createdDateRange.startDate) {
      params.set('createdFrom', filter.createdDateRange.startDate);
    }
    if (filter.createdDateRange.endDate) {
      params.set('createdTo', filter.createdDateRange.endDate);
    }
  }
  
  if (filter.updatedDateRange) {
    if (filter.updatedDateRange.startDate) {
      params.set('updatedFrom', filter.updatedDateRange.startDate);
    }
    if (filter.updatedDateRange.endDate) {
      params.set('updatedTo', filter.updatedDateRange.endDate);
    }
  }
  
  if (filter.scanCount) {
    if (filter.scanCount.min !== null) {
      params.set('scansMin', filter.scanCount.min.toString());
    }
    if (filter.scanCount.max !== null) {
      params.set('scansMax', filter.scanCount.max.toString());
    }
  }
  
  if (filter.sort) {
    params.set('sortBy', filter.sort.field);
    params.set('sortDir', filter.sort.direction);
  }
  
  if (filter.tags && filter.tags.length > 0) {
    params.set('tags', filter.tags.join(','));
  }
  
  return params;
}

/**
 * Convert URL query parameters to filter
 */
export function queryParamsToFilter(params: URLSearchParams): QRCodeFilter {
  const filter: QRCodeFilter = {};
  
  const search = params.get('search');
  if (search) filter.search = search;
  
  const types = params.get('types');
  if (types) filter.types = types.split(',') as QRCodeType[];
  
  const statuses = params.get('statuses');
  if (statuses) filter.statuses = statuses.split(',') as QRCodeStatus[];
  
  const folderId = params.get('folder');
  if (folderId) filter.folderId = folderId;
  
  const createdFrom = params.get('createdFrom');
  const createdTo = params.get('createdTo');
  if (createdFrom || createdTo) {
    filter.createdDateRange = {
      startDate: createdFrom,
      endDate: createdTo,
    };
  }
  
  const updatedFrom = params.get('updatedFrom');
  const updatedTo = params.get('updatedTo');
  if (updatedFrom || updatedTo) {
    filter.updatedDateRange = {
      startDate: updatedFrom,
      endDate: updatedTo,
    };
  }
  
  const scansMin = params.get('scansMin');
  const scansMax = params.get('scansMax');
  if (scansMin || scansMax) {
    filter.scanCount = {
      min: scansMin ? parseInt(scansMin, 10) : null,
      max: scansMax ? parseInt(scansMax, 10) : null,
    };
  }
  
  const sortBy = params.get('sortBy');
  const sortDir = params.get('sortDir');
  if (sortBy && sortDir) {
    filter.sort = {
      field: sortBy as SortField,
      direction: sortDir as SortDirection,
    };
  }
  
  const tags = params.get('tags');
  if (tags) filter.tags = tags.split(',');
  
  return filter;
}

/**
 * Get active filter count
 */
export function getActiveFilterCount(filter: QRCodeFilter): number {
  let count = 0;
  
  if (filter.search) count++;
  if (filter.types && filter.types.length > 0) count++;
  if (filter.statuses && filter.statuses.length > 0) count++;
  if (filter.folderId) count++;
  if (filter.createdDateRange) count++;
  if (filter.updatedDateRange) count++;
  if (filter.scanCount) count++;
  if (filter.tags && filter.tags.length > 0) count++;
  
  return count;
}
