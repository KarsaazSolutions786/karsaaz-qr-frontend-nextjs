/**
 * ReferrerTracker Component
 * 
 * Track and display referrer sources for QR code scans.
 */

'use client';

import React, { useState, useMemo } from 'react';
import { Link2, ExternalLink, Search } from 'lucide-react';

export interface ReferrerData {
  url: string;
  domain: string;
  scans: number;
  percentage?: number;
  firstSeen?: Date;
  lastSeen?: Date;
}

export interface ReferrerTrackerProps {
  referrers: ReferrerData[];
  totalScans: number;
  directScans?: number;
  unknownScans?: number;
}

export function ReferrerTracker({
  referrers,
  totalScans,
  directScans = 0,
  unknownScans = 0,
}: ReferrerTrackerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'scans' | 'domain'>('scans');
  
  // Calculate percentages and sort
  const referrersWithPercentage = useMemo(() => {
    return referrers.map(r => ({
      ...r,
      percentage: totalScans > 0 ? (r.scans / totalScans) * 100 : 0,
    })).sort((a, b) => {
      if (sortBy === 'scans') return b.scans - a.scans;
      return a.domain.localeCompare(b.domain);
    });
  }, [referrers, totalScans, sortBy]);
  
  // Filter by search
  const filteredReferrers = useMemo(() => {
    if (!searchQuery) return referrersWithPercentage;
    
    const query = searchQuery.toLowerCase();
    return referrersWithPercentage.filter(r =>
      r.domain.toLowerCase().includes(query) ||
      r.url.toLowerCase().includes(query)
    );
  }, [referrersWithPercentage, searchQuery]);
  
  // Get top domains
  const topDomains = useMemo(() => {
    const domainMap = new Map<string, number>();
    referrers.forEach(r => {
      domainMap.set(r.domain, (domainMap.get(r.domain) || 0) + r.scans);
    });
    
    return Array.from(domainMap.entries())
      .map(([domain, scans]) => ({
        domain,
        scans,
        percentage: totalScans > 0 ? (scans / totalScans) * 100 : 0,
      }))
      .sort((a, b) => b.scans - a.scans)
      .slice(0, 5);
  }, [referrers, totalScans]);
  
  const maxScans = Math.max(...referrers.map(r => r.scans), 1);
  
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <Link2 className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Referrer Sources</h3>
            <p className="text-sm text-gray-500">
              {referrers.length} referrer{referrers.length !== 1 ? 's' : ''} tracked
            </p>
          </div>
        </div>
        
        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'scans' | 'domain')}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="scans">Sort by Scans</option>
          <option value="domain">Sort by Domain</option>
        </select>
      </div>
      
      {/* Stats Overview */}
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="grid grid-cols-4 gap-6">
          <div>
            <div className="text-sm text-gray-600 mb-1">Total Scans</div>
            <div className="text-2xl font-bold text-gray-900">
              {totalScans.toLocaleString()}
            </div>
          </div>
          
          <div>
            <div className="text-sm text-gray-600 mb-1">From Referrers</div>
            <div className="text-2xl font-bold text-indigo-600">
              {referrers.reduce((sum, r) => sum + r.scans, 0).toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {((referrers.reduce((sum, r) => sum + r.scans, 0) / totalScans) * 100).toFixed(1)}%
            </div>
          </div>
          
          <div>
            <div className="text-sm text-gray-600 mb-1">Direct Scans</div>
            <div className="text-2xl font-bold text-green-600">
              {directScans.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {((directScans / totalScans) * 100).toFixed(1)}%
            </div>
          </div>
          
          <div>
            <div className="text-sm text-gray-600 mb-1">Unknown</div>
            <div className="text-2xl font-bold text-gray-400">
              {unknownScans.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {((unknownScans / totalScans) * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>
      
      {/* Top Domains */}
      <div className="p-6 border-b border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">Top 5 Domains</h4>
        <div className="grid grid-cols-5 gap-4">
          {topDomains.map((domain, index) => (
            <div key={domain.domain} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold text-sm">{index + 1}</span>
              </div>
              <div className="text-sm font-medium text-gray-900 truncate" title={domain.domain}>
                {domain.domain}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {domain.scans.toLocaleString()} scans
              </div>
              <div className="text-xs text-indigo-600 font-medium">
                {domain.percentage.toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Search */}
      <div className="p-6 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search referrers..."
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      
      {/* Referrer List */}
      <div className="p-6">
        {filteredReferrers.length === 0 ? (
          <div className="text-center py-8">
            <Link2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              {searchQuery ? 'No referrers found' : 'No referrers tracked yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredReferrers.map((referrer) => (
              <div
                key={referrer.url}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {/* Icon */}
                <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Link2 className="w-5 h-5 text-gray-400" />
                </div>
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{referrer.domain}</span>
                    <a
                      href={referrer.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-indigo-600 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="text-sm text-gray-500 truncate mt-0.5" title={referrer.url}>
                    {referrer.url}
                  </div>
                  {referrer.lastSeen && (
                    <div className="text-xs text-gray-400 mt-1">
                      Last seen: {referrer.lastSeen.toLocaleDateString()}
                    </div>
                  )}
                </div>
                
                {/* Stats */}
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">
                    {referrer.scans.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    {referrer.percentage?.toFixed(1)}%
                  </div>
                </div>
                
                {/* Bar */}
                <div className="w-24">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all"
                      style={{ width: `${(referrer.scans / maxScans) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Compact Referrer Stats
 */
export function ReferrerStatsCompact({
  topReferrers,
  directScans,
  totalScans,
}: {
  topReferrers: ReferrerData[];
  directScans: number;
  totalScans: number;
}) {
  return (
    <div className="flex items-center gap-6">
      <div>
        <div className="text-xs text-gray-600 mb-1">Top Referrer</div>
        <div className="text-sm font-medium text-gray-900">
          {topReferrers[0]?.domain || 'N/A'}
        </div>
      </div>
      
      <div>
        <div className="text-xs text-gray-600 mb-1">Direct</div>
        <div className="text-sm font-medium text-gray-900">
          {((directScans / totalScans) * 100).toFixed(0)}%
        </div>
      </div>
      
      <div>
        <div className="text-xs text-gray-600 mb-1">Referrers</div>
        <div className="text-sm font-medium text-gray-900">
          {topReferrers.length}
        </div>
      </div>
    </div>
  );
}
