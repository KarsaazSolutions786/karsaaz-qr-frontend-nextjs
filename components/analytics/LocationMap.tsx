/**
 * LocationMap Component
 * 
 * Interactive map showing scan locations.
 */

'use client';

import React, { useState, useMemo } from 'react';
import { MapPin, Globe, TrendingUp, Filter } from 'lucide-react';

export interface LocationData {
  country: string;
  countryCode: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  scans: number;
  percentage?: number;
}

export interface LocationMapProps {
  locations: LocationData[];
  totalScans: number;
  height?: number;
  showList?: boolean;
}

export function LocationMap({
  locations,
  totalScans,
  height = 400,
  showList = true,
}: LocationMapProps) {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  
  // Calculate percentages
  const locationsWithPercentage = useMemo(() => {
    return locations.map(loc => ({
      ...loc,
      percentage: totalScans > 0 ? (loc.scans / totalScans) * 100 : 0,
    })).sort((a, b) => b.scans - a.scans);
  }, [locations, totalScans]);
  
  // Get top 10 locations
  const topLocations = locationsWithPercentage.slice(0, 10);
  
  // Get max scans for scaling
  const maxScans = Math.max(...locations.map(l => l.scans), 1);
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Scan Locations</h3>
            <p className="text-sm text-gray-500">
              {locations.length} countries · {totalScans.toLocaleString()} total scans
            </p>
          </div>
        </div>
        
        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              viewMode === 'map'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Map
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            List
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        {viewMode === 'map' ? (
          <div>
            {/* Map Placeholder */}
            <div
              className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200"
              style={{ height }}
            >
              <div className="text-center">
                <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">Interactive Map</p>
                <p className="text-sm text-gray-400 mt-1">
                  Integrate with Mapbox, Google Maps, or Leaflet
                </p>
              </div>
            </div>
            
            {/* Legend */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-600 rounded-full" />
                  <span className="text-sm text-gray-600">High Activity</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-300 rounded-full" />
                  <span className="text-sm text-gray-600">Medium Activity</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-100 rounded-full" />
                  <span className="text-sm text-gray-600">Low Activity</span>
                </div>
              </div>
              
              <div className="text-sm text-gray-500">
                Click markers for details
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {topLocations.map((location, index) => (
              <div
                key={`${location.countryCode}-${location.city || 'all'}`}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => setSelectedCountry(
                  selectedCountry === location.country ? null : location.country
                )}
              >
                {/* Rank */}
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">{index + 1}</span>
                </div>
                
                {/* Location Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-900">
                      {location.city ? `${location.city}, ` : ''}{location.country}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mt-0.5">
                    {location.countryCode}
                  </div>
                </div>
                
                {/* Stats */}
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">
                    {location.scans.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    {location.percentage?.toFixed(1)}%
                  </div>
                </div>
                
                {/* Bar */}
                <div className="w-32">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all"
                      style={{ width: `${(location.scans / maxScans) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
            
            {locations.length > 10 && (
              <div className="text-center pt-2">
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View all {locations.length} locations →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Top Countries Summary */}
      {showList && viewMode === 'map' && (
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <h4 className="text-sm font-semibold text-gray-900 mb-4">
            Top 5 Countries
          </h4>
          <div className="grid grid-cols-5 gap-4">
            {topLocations.slice(0, 5).map((location) => (
              <div key={location.countryCode} className="text-center">
                <div className="text-2xl mb-2">{getCountryFlag(location.countryCode)}</div>
                <div className="text-sm font-medium text-gray-900">
                  {location.country}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {location.scans.toLocaleString()} scans
                </div>
                <div className="text-xs text-blue-600 font-medium">
                  {location.percentage?.toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Get country flag emoji (simplified)
 */
function getCountryFlag(countryCode: string): string {
  const flags: Record<string, string> = {
    US: '🇺🇸',
    CA: '🇨🇦',
    GB: '🇬🇧',
    DE: '🇩🇪',
    FR: '🇫🇷',
    JP: '🇯🇵',
    CN: '🇨🇳',
    IN: '🇮🇳',
    AU: '🇦🇺',
    BR: '🇧🇷',
  };
  
  return flags[countryCode] || '🌍';
}
