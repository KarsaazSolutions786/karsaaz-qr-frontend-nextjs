/**
 * Analytics CSV Export
 *
 * Builds a multi-section CSV from QRCodeStats and triggers a browser download.
 * Sections: Daily Scans, Country, City, OS, Browser, Device breakdowns.
 */

import type { QRCodeStats } from '@/types/entities/analytics'

// ---------- Helpers ----------

/**
 * Purpose: Executes escapeCsvCell functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
function escapeCsvCell(val: string | number | null | undefined): string {
  const str = String(val ?? '')
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

/**
 * Purpose: Executes row functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
function row(...cells: (string | number | null | undefined)[]): string {
  return cells.map(escapeCsvCell).join(',')
}

// ---------- Export ----------

/**
 * Purpose: Builds a CSV string containing all analytics data grouped by section.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export function buildAnalyticsCsv(stats: QRCodeStats): string {
  const lines: string[] = []

  // --- Daily Scans ---
  lines.push(row('=== Daily Scans ==='))
  lines.push(row('Date', 'Count'))
  for (const point of stats.scansByDay) {
    lines.push(row(point.date, point.count))
  }
  lines.push('') // blank separator

  // --- Country Breakdown ---
  lines.push(row('=== Country Breakdown ==='))
  lines.push(row('Country', 'Count', 'Percentage'))
  const countrySorted = [...stats.countryBreakdown].sort((a, b) => b.value - a.value)
  for (const item of countrySorted) {
    lines.push(row(item.label, item.value, `${item.percentage.toFixed(1)}%`))
  }
  lines.push('')

  // --- City Breakdown ---
  lines.push(row('=== City Breakdown ==='))
  lines.push(row('City', 'Country', 'Count'))
  const citySorted = [...stats.cityBreakdown].sort((a, b) => b.value - a.value)
  for (const item of citySorted) {
    lines.push(row(item.label, item.country ?? '', item.value))
  }
  lines.push('')

  // --- OS Breakdown ---
  lines.push(row('=== OS Breakdown ==='))
  lines.push(row('OS', 'Count', 'Percentage'))
  const osSorted = [...stats.osBreakdown].sort((a, b) => b.value - a.value)
  for (const item of osSorted) {
    lines.push(row(item.label, item.value, `${item.percentage.toFixed(1)}%`))
  }
  lines.push('')

  // --- Browser Breakdown ---
  lines.push(row('=== Browser Breakdown ==='))
  lines.push(row('Browser', 'Count', 'Percentage'))
  const browserSorted = [...stats.browserBreakdown].sort((a, b) => b.value - a.value)
  for (const item of browserSorted) {
    lines.push(row(item.label, item.value, `${item.percentage.toFixed(1)}%`))
  }
  lines.push('')

  // --- Device Breakdown ---
  lines.push(row('=== Device Breakdown ==='))
  lines.push(row('Device', 'Count', 'Percentage'))
  const deviceSorted = [...stats.deviceBreakdown].sort((a, b) => b.value - a.value)
  for (const item of deviceSorted) {
    lines.push(row(item.label, item.value, `${item.percentage.toFixed(1)}%`))
  }

  return lines.join('\n')
}

/**
 * Purpose: Exports analytics stats as a CSV file download.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export function exportAnalyticsCsv(stats: QRCodeStats): void {
  const csv = buildAnalyticsCsv(stats)
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  const date = new Date().toISOString().slice(0, 10)
  a.download = `analytics-${stats.qrcodeId}-${date}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
