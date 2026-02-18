export const FILTER_NAMES = {
  QR_GENERATION_OPTIONS: 'qr.generation.options',
  QR_STYLE_OPTIONS: 'qr.style.options',
  QR_EXPORT_FORMAT: 'qr.export.format',
  QR_DOWNLOAD_FILENAME: 'qr.download.filename',
  ANALYTICS_DATA: 'analytics.data',
  SUBSCRIPTION_FEATURES: 'subscription.features',
  USER_PERMISSIONS: 'user.permissions',
  TEMPLATE_LIST: 'template.list',
  TEMPLATE_DATA: 'template.data',
} as const;

export type FilterName = typeof FILTER_NAMES[keyof typeof FILTER_NAMES];

export const DEFAULT_FILTER_VALUES: Record<FilterName, any> = {
  [FILTER_NAMES.QR_GENERATION_OPTIONS]: {},
  [FILTER_NAMES.QR_STYLE_OPTIONS]: {},
  [FILTER_NAMES.QR_EXPORT_FORMAT]: 'png',
  [FILTER_NAMES.QR_DOWNLOAD_FILENAME]: 'qr-code',
  [FILTER_NAMES.ANALYTICS_DATA]: {},
  [FILTER_NAMES.SUBSCRIPTION_FEATURES]: [],
  [FILTER_NAMES.USER_PERMISSIONS]: [],
  [FILTER_NAMES.TEMPLATE_LIST]: [],
  [FILTER_NAMES.TEMPLATE_DATA]: {},
};

export function getDefaultFilterValue(filterName: FilterName): any {
  return DEFAULT_FILTER_VALUES[filterName];
}
