'use client';

import React from 'react';
import { useQRCodeAnalytics } from '@/lib/hooks/queries/useQRCodes';
import { LineChartWrapper } from '@/components/ui/charts';
import { DoughnutChartWrapper } from '@/components/ui/charts';
import { ScansPerLanguage } from '@/components/analytics/ScansPerLanguage';
import { ScansPerHour } from '@/components/analytics/ScansPerHour';

interface AnalyticsData {
  totalScans: number;
  uniqueVisitors: number;
  topCountries: { name: string; count: number }[];
  scanTimeline: { date: string; scans: number }[];
  deviceBreakdown: { name: string; value: number }[];
  topReferrers: { source: string; count: number }[];
  locations: { country: string; city: string; count: number }[];
}

export interface QRReportDashboardProps {
  qrCodeId: number;
}

const EMPTY_DATA: AnalyticsData = {
  totalScans: 0,
  uniqueVisitors: 0,
  topCountries: [],
  scanTimeline: [],
  deviceBreakdown: [],
  topReferrers: [],
  locations: [],
};

export function QRReportDashboard({ qrCodeId }: QRReportDashboardProps) {
  const { data: rawData, isLoading: loading, error: queryError } = useQRCodeAnalytics(qrCodeId);
  const data: AnalyticsData = rawData ?? EMPTY_DATA;
  const error = queryError ? (queryError as any)?.response?.data?.message || 'Failed to load analytics' : '';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard label="Total Scans" value={data.totalScans} />
        <SummaryCard label="Unique Visitors" value={data.uniqueVisitors} />
        <SummaryCard
          label="Top Country"
          value={data.topCountries?.[0]?.name ?? '—'}
          sub={data.topCountries?.[0] ? `${data.topCountries[0].count} scans` : undefined}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scan Timeline */}
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <LineChartWrapper
            data={data.scanTimeline}
            xKey="date"
            yKey="scans"
            title="Scan Timeline"
          />
        </div>

        {/* Device Breakdown */}
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <DoughnutChartWrapper
            data={data.deviceBreakdown}
            dataKey="value"
            nameKey="name"
            title="Device Breakdown"
          />
        </div>
      </div>

      {/* Language & Hourly Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ScansPerLanguage
          data={(data as any).scansByLanguage ?? []}
          loading={loading}
        />
        <ScansPerHour
          data={(data as any).scansByHour ?? []}
          loading={loading}
        />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Referring Sources */}
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <h3 className="mb-3 text-sm font-medium text-gray-700">Top Referring Sources</h3>
          {data.topReferrers.length === 0 ? (
            <p className="text-sm text-gray-400">No referrer data yet</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {data.topReferrers.map((r) => (
                <li key={r.source} className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-700 truncate">{r.source}</span>
                  <span className="text-sm font-semibold text-gray-900">{r.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Country / City Table */}
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <h3 className="mb-3 text-sm font-medium text-gray-700">Location Breakdown</h3>
          {data.locations.length === 0 ? (
            <p className="text-sm text-gray-400">No location data yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-200">
                    <th className="pb-2 font-medium">Country</th>
                    <th className="pb-2 font-medium">City</th>
                    <th className="pb-2 font-medium text-right">Scans</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.locations.map((loc, i) => (
                    <tr key={`${loc.country}-${loc.city}-${i}`}>
                      <td className="py-2 text-gray-700">{loc.country}</td>
                      <td className="py-2 text-gray-600">{loc.city}</td>
                      <td className="py-2 text-right font-semibold text-gray-900">{loc.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Internal helper                                                    */
/* ------------------------------------------------------------------ */

function SummaryCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-gray-400">{sub}</p>}
    </div>
  );
}
