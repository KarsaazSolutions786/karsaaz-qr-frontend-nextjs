/**
 * ScansPerHour Component
 *
 * Line chart showing scan distribution across 24 hours.
 */

'use client';

import React, { useMemo } from 'react';
import { Clock } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export interface HourData {
  hour: number;
  count: number;
}

export interface ScansPerHourProps {
  data: HourData[];
  loading?: boolean;
}

function formatHour(hour: number): string {
  if (hour === 0) return '12AM';
  if (hour === 12) return '12PM';
  return hour < 12 ? `${hour}AM` : `${hour - 12}PM`;
}

export function ScansPerHour({ data, loading = false }: ScansPerHourProps) {
  const chartData = useMemo(
    () =>
      data
        .map((d) => ({ ...d, label: formatHour(d.hour) }))
        .sort((a, b) => a.hour - b.hour),
    [data]
  );

  const peakHour = useMemo(() => {
    if (data.length === 0) return null;
    return [...data].sort((a, b) => b.count - a.count)[0];
  }, [data]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
            <Clock className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Scans by Hour</h3>
            <p className="text-sm text-gray-500">24-hour scan distribution</p>
          </div>
        </div>

        {peakHour && (
          <div className="text-right">
            <p className="text-xs text-gray-500">Peak Hour</p>
            <p className="text-sm font-bold text-teal-600">
              {formatHour(peakHour.hour)}{' '}
              <span className="text-gray-500 font-normal">
                ({peakHour.count.toLocaleString()} scans)
              </span>
            </p>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-48 w-full animate-pulse rounded bg-gray-200" />
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No hourly data available</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="label"
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              interval={2}
            />
            <YAxis stroke="#6b7280" fontSize={12} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
              }}
              labelFormatter={(label) => `Time: ${label}`}
              formatter={(value: number | undefined) => [
                (value ?? 0).toLocaleString(),
                'Scans',
              ]}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#14b8a6"
              strokeWidth={2}
              dot={{ fill: '#14b8a6', r: 4 }}
              activeDot={{ r: 6, fill: '#0d9488' }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
