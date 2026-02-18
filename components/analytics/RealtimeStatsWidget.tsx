/**
 * RealtimeStatsWidget Component
 * 
 * Real-time analytics dashboard widget.
 */

'use client';

import React from 'react';
import { Activity, TrendingUp, Globe, Smartphone, Clock, RefreshCw } from 'lucide-react';
import { useRealtimeAnalytics } from '@/hooks/useRealtimeAnalytics';

export interface RealtimeStatsWidgetProps {
  qrCodeId?: string;
  showRecentScans?: boolean;
  compact?: boolean;
}

export function RealtimeStatsWidget({
  qrCodeId,
  showRecentScans = true,
  compact = false,
}: RealtimeStatsWidgetProps) {
  const { stats, recentScans, isConnected, error, refresh } = useRealtimeAnalytics({
    qrCodeId,
    enabled: true,
  });
  
  if (compact) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Live Stats</h3>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-300'}`} />
            <span className="text-xs text-gray-500">
              {isConnected ? 'Live' : 'Offline'}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.todayScans}</div>
            <div className="text-xs text-gray-500">Today</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.liveScans}</div>
            <div className="text-xs text-gray-500">Live Now</div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Real-Time Analytics</h3>
            <p className="text-sm text-gray-500">Live scan tracking and statistics</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Connection Status */}
          <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg">
            <div className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-300'
            }`} />
            <span className="text-sm font-medium text-gray-700">
              {isConnected ? 'Live' : 'Offline'}
            </span>
          </div>
          
          {/* Refresh Button */}
          <button
            onClick={refresh}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Refresh stats"
          >
            <RefreshCw className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
      
      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border-b border-red-200">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
      
      {/* Stats Grid */}
      <div className="p-6">
        <div className="grid grid-cols-4 gap-6">
          {/* Total Scans */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">Total Scans</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {stats.totalScans.toLocaleString()}
            </div>
          </div>
          
          {/* Today */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">Today</span>
            </div>
            <div className="text-3xl font-bold text-blue-600">
              {stats.todayScans.toLocaleString()}
            </div>
          </div>
          
          {/* This Week */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">This Week</span>
            </div>
            <div className="text-3xl font-bold text-green-600">
              {stats.weekScans.toLocaleString()}
            </div>
          </div>
          
          {/* Live Now */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-600">Live Now</span>
            </div>
            <div className="text-3xl font-bold text-purple-600">
              {stats.liveScans}
            </div>
          </div>
        </div>
        
        {/* Additional Stats */}
        <div className="grid grid-cols-3 gap-6 mt-6 pt-6 border-t border-gray-200">
          <div>
            <div className="text-sm text-gray-600 mb-1">Avg. Scans/Day</div>
            <div className="text-xl font-semibold text-gray-900">
              {stats.averageScansPerDay}
            </div>
          </div>
          
          <div>
            <div className="text-sm text-gray-600 mb-1">Peak Hour</div>
            <div className="text-xl font-semibold text-gray-900">
              {stats.peakHour}:00
            </div>
          </div>
          
          <div>
            <div className="text-sm text-gray-600 mb-1">Top Location</div>
            <div className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-gray-400" />
              {stats.topCountry || 'N/A'}
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Scans */}
      {showRecentScans && recentScans.length > 0 && (
        <div className="border-t border-gray-200">
          <div className="p-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-4">
              Recent Scans ({recentScans.length})
            </h4>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {recentScans.slice(0, 10).map((scan) => (
                <div
                  key={scan.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <Smartphone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900">
                      {scan.location?.city || 'Unknown'}, {scan.location?.country || 'Unknown'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {scan.device?.type} · {scan.device?.browser} · {scan.device?.os}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 whitespace-nowrap">
                    {formatTimeAgo(scan.timestamp)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Format time ago
 */
function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
