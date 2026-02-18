/**
 * DeviceBrowserCharts Component
 * 
 * Charts showing device and browser breakdown.
 */

'use client';

import React, { useMemo } from 'react';
import { Smartphone, Monitor, Tablet, Globe } from 'lucide-react';

export interface DeviceData {
  type: 'mobile' | 'tablet' | 'desktop';
  count: number;
  percentage?: number;
}

export interface BrowserData {
  name: string;
  count: number;
  percentage?: number;
}

export interface OSData {
  name: string;
  count: number;
  percentage?: number;
}

export interface DeviceBrowserChartsProps {
  devices: DeviceData[];
  browsers: BrowserData[];
  operatingSystems: OSData[];
  totalScans: number;
}

export function DeviceBrowserCharts({
  devices,
  browsers,
  operatingSystems,
  totalScans,
}: DeviceBrowserChartsProps) {
  // Calculate percentages
  const devicesWithPercentage = useMemo(() => {
    return devices.map(d => ({
      ...d,
      percentage: totalScans > 0 ? (d.count / totalScans) * 100 : 0,
    })).sort((a, b) => b.count - a.count);
  }, [devices, totalScans]);
  
  const browsersWithPercentage = useMemo(() => {
    return browsers.map(b => ({
      ...b,
      percentage: totalScans > 0 ? (b.count / totalScans) * 100 : 0,
    })).sort((a, b) => b.count - a.count);
  }, [browsers, totalScans]);
  
  const osWithPercentage = useMemo(() => {
    return operatingSystems.map(os => ({
      ...os,
      percentage: totalScans > 0 ? (os.count / totalScans) * 100 : 0,
    })).sort((a, b) => b.count - a.count);
  }, [operatingSystems, totalScans]);
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Device Types */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Device Types</h3>
            <p className="text-sm text-gray-500">Scan breakdown by device</p>
          </div>
        </div>
        
        {/* Donut Chart */}
        <div className="relative w-48 h-48 mx-auto mb-6">
          <svg viewBox="0 0 100 100" className="transform -rotate-90">
            {devicesWithPercentage.map((device, index) => {
              const colors = ['#8B5CF6', '#EC4899', '#06B6D4'];
              const startAngle = devicesWithPercentage
                .slice(0, index)
                .reduce((sum, d) => sum + (d.percentage || 0), 0) * 3.6;
              const angle = (device.percentage || 0) * 3.6;
              
              return (
                <circle
                  key={device.type}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={colors[index] || '#E5E7EB'}
                  strokeWidth="20"
                  strokeDasharray={`${angle * 2.51} 251.2`}
                  strokeDashoffset={-startAngle * 2.51}
                  className="transition-all"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{totalScans}</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="space-y-3">
          {devicesWithPercentage.map((device, index) => {
            const colors = ['bg-purple-600', 'bg-pink-600', 'bg-cyan-600'];
            const Icon = device.type === 'mobile' ? Smartphone : 
                        device.type === 'tablet' ? Tablet : Monitor;
            
            return (
              <div key={device.type} className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${colors[index]}`} />
                <Icon className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700 capitalize flex-1">
                  {device.type}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {device.percentage?.toFixed(1)}%
                </span>
                <span className="text-sm text-gray-500">
                  ({device.count.toLocaleString()})
                </span>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Browsers */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Browsers</h3>
            <p className="text-sm text-gray-500">Top browsers used</p>
          </div>
        </div>
        
        {/* Bar Chart */}
        <div className="space-y-4">
          {browsersWithPercentage.slice(0, 5).map((browser) => {
            const maxCount = browsersWithPercentage[0]?.count || 1;
            const barWidth = (browser.count / maxCount) * 100;
            
            return (
              <div key={browser.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {browser.name}
                  </span>
                  <span className="text-sm text-gray-500">
                    {browser.count.toLocaleString()} ({browser.percentage?.toFixed(1)}%)
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Other Browsers */}
        {browsersWithPercentage.length > 5 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                Other ({browsersWithPercentage.length - 5})
              </span>
              <span className="text-gray-500">
                {browsersWithPercentage
                  .slice(5)
                  .reduce((sum, b) => sum + b.count, 0)
                  .toLocaleString()
                }
              </span>
            </div>
          </div>
        )}
      </div>
      
      {/* Operating Systems */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Monitor className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Operating Systems</h3>
            <p className="text-sm text-gray-500">Platform distribution</p>
          </div>
        </div>
        
        {/* Horizontal Bar Chart */}
        <div className="space-y-4">
          {osWithPercentage.slice(0, 6).map((os, index) => {
            const colors = [
              'bg-green-600',
              'bg-blue-600',
              'bg-purple-600',
              'bg-pink-600',
              'bg-orange-600',
              'bg-cyan-600',
            ];
            
            return (
              <div key={os.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{os.name}</span>
                  <span className="text-sm text-gray-500">
                    {os.percentage?.toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${colors[index]} rounded-full transition-all`}
                      style={{ width: `${os.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-16 text-right">
                    {os.count.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * Compact Device Stats Component
 */
export function DeviceStatsCompact({
  devices,
  totalScans,
}: {
  devices: DeviceData[];
  totalScans: number;
}) {
  const devicesWithPercentage = devices.map(d => ({
    ...d,
    percentage: totalScans > 0 ? (d.count / totalScans) * 100 : 0,
  }));
  
  return (
    <div className="flex items-center gap-4">
      {devicesWithPercentage.map((device) => {
        const Icon = device.type === 'mobile' ? Smartphone : 
                    device.type === 'tablet' ? Tablet : Monitor;
        
        return (
          <div key={device.type} className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-700 capitalize">{device.type}</span>
            <span className="text-sm font-medium text-gray-900">
              {device.percentage?.toFixed(0)}%
            </span>
          </div>
        );
      })}
    </div>
  );
}
