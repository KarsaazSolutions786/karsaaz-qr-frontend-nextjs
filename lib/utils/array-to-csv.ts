/**
 * CSV export utilities.
 */

interface CSVOptions {
  separator?: string
}

/**
 * Purpose: Executes escapeCell functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
function escapeCell(value: unknown, separator: string): string {
  const str = value == null ? '' : String(value)
  if (str.includes(separator) || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

/**
 * Purpose: Executes arrayToCSV functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function arrayToCSV(data: Record<string, unknown>[], options?: CSVOptions): string {
  if (data.length === 0) return ''
  const sep = options?.separator ?? ','
  const headers = Object.keys(data[0]!)
  const headerRow = headers.map(h => escapeCell(h, sep)).join(sep)
  const rows = data.map(row => headers.map(h => escapeCell(row[h], sep)).join(sep))
  return [headerRow, ...rows].join('\n')
}

/**
 * Purpose: Executes downloadCSV functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function downloadCSV(data: Record<string, unknown>[], filename = 'export.csv'): void {
  const csv = arrayToCSV(data)
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
