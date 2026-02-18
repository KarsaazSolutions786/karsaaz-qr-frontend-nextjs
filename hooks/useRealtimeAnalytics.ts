/**
 * useRealtimeAnalytics Hook
 * 
 * Hook for real-time scan updates and analytics tracking.
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface ScanEvent {
  id: string;
  qrCodeId: string;
  timestamp: Date;
  location?: {
    country: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  };
  device?: {
    type: 'mobile' | 'tablet' | 'desktop';
    os: string;
    browser: string;
  };
  referrer?: string;
  ipAddress?: string;
}

export interface RealtimeStats {
  totalScans: number;
  todayScans: number;
  weekScans: number;
  monthScans: number;
  liveScans: number; // Current active scans
  averageScansPerDay: number;
  peakHour: number;
  topCountry?: string;
  topDevice?: string;
}

export interface UseRealtimeAnalyticsOptions {
  qrCodeId?: string;
  enabled?: boolean;
  pollingInterval?: number; // milliseconds
  maxRecentScans?: number;
}

export function useRealtimeAnalytics({
  qrCodeId,
  enabled = true,
  pollingInterval = 5000,
  maxRecentScans = 50,
}: UseRealtimeAnalyticsOptions = {}) {
  const [stats, setStats] = useState<RealtimeStats>({
    totalScans: 0,
    todayScans: 0,
    weekScans: 0,
    monthScans: 0,
    liveScans: 0,
    averageScansPerDay: 0,
    peakHour: 0,
  });
  
  const [recentScans, setRecentScans] = useState<ScanEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const pollingTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  /**
   * Fetch current stats
   */
  const fetchStats = useCallback(async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Mock data
      const mockStats: RealtimeStats = {
        totalScans: Math.floor(Math.random() * 10000),
        todayScans: Math.floor(Math.random() * 100),
        weekScans: Math.floor(Math.random() * 500),
        monthScans: Math.floor(Math.random() * 2000),
        liveScans: Math.floor(Math.random() * 5),
        averageScansPerDay: Math.floor(Math.random() * 50),
        peakHour: Math.floor(Math.random() * 24),
        topCountry: 'United States',
        topDevice: 'mobile',
      };
      
      setStats(mockStats);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    }
  }, []);
  
  /**
   * Handle new scan event
   */
  const handleScanEvent = useCallback((event: ScanEvent) => {
    setRecentScans(prev => {
      const updated = [event, ...prev].slice(0, maxRecentScans);
      return updated;
    });
    
    // Update stats
    setStats(prev => ({
      ...prev,
      totalScans: prev.totalScans + 1,
      todayScans: prev.todayScans + 1,
      liveScans: prev.liveScans + 1,
    }));
    
    // Decrease live scans after 10 seconds
    setTimeout(() => {
      setStats(prev => ({
        ...prev,
        liveScans: Math.max(0, prev.liveScans - 1),
      }));
    }, 10000);
  }, [maxRecentScans]);
  
  /**
   * Connect to WebSocket for real-time updates
   */
  const connectWebSocket = useCallback(() => {
    if (!enabled || wsRef.current) return;
    
    try {
      // Mock WebSocket connection
      // In production, connect to actual WebSocket server
      const mockWs = {
        onopen: () => {
          setIsConnected(true);
          setError(null);
        },
        onclose: () => {
          setIsConnected(false);
        },
        onerror: () => {
          setError('WebSocket connection failed');
          setIsConnected(false);
        },
        close: () => {
          setIsConnected(false);
        },
      };
      
      wsRef.current = mockWs as any;
      mockWs.onopen();
      
      // Simulate random scan events
      const mockEventInterval = setInterval(() => {
        if (Math.random() > 0.7) {
          const mockEvent: ScanEvent = {
            id: `scan-${Date.now()}`,
            qrCodeId: qrCodeId || 'unknown',
            timestamp: new Date(),
            location: {
              country: ['United States', 'Canada', 'UK', 'Germany', 'Japan'][
                Math.floor(Math.random() * 5)
              ],
              city: ['New York', 'Toronto', 'London', 'Berlin', 'Tokyo'][
                Math.floor(Math.random() * 5)
              ],
            },
            device: {
              type: ['mobile', 'tablet', 'desktop'][Math.floor(Math.random() * 3)] as any,
              os: ['iOS', 'Android', 'Windows', 'macOS'][Math.floor(Math.random() * 4)],
              browser: ['Chrome', 'Safari', 'Firefox', 'Edge'][Math.floor(Math.random() * 4)],
            },
            referrer: Math.random() > 0.5 ? 'https://google.com' : undefined,
          };
          
          handleScanEvent(mockEvent);
        }
      }, 5000);
      
      // Store interval for cleanup
      (wsRef.current as any)._mockInterval = mockEventInterval;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect');
      setIsConnected(false);
    }
  }, [enabled, qrCodeId, handleScanEvent]);
  
  /**
   * Disconnect WebSocket
   */
  const disconnectWebSocket = useCallback(() => {
    if (wsRef.current) {
      const ws = wsRef.current as any;
      if (ws._mockInterval) {
        clearInterval(ws._mockInterval);
      }
      ws.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);
  
  /**
   * Start polling
   */
  const startPolling = useCallback(() => {
    if (!enabled || pollingTimerRef.current) return;
    
    fetchStats();
    pollingTimerRef.current = setInterval(fetchStats, pollingInterval);
  }, [enabled, pollingInterval, fetchStats]);
  
  /**
   * Stop polling
   */
  const stopPolling = useCallback(() => {
    if (pollingTimerRef.current) {
      clearInterval(pollingTimerRef.current);
      pollingTimerRef.current = null;
    }
  }, []);
  
  /**
   * Refresh stats manually
   */
  const refresh = useCallback(() => {
    fetchStats();
  }, [fetchStats]);
  
  /**
   * Setup and cleanup
   */
  useEffect(() => {
    if (enabled) {
      connectWebSocket();
      startPolling();
    }
    
    return () => {
      disconnectWebSocket();
      stopPolling();
    };
  }, [enabled, connectWebSocket, disconnectWebSocket, startPolling, stopPolling]);
  
  return {
    // Stats
    stats,
    recentScans,
    
    // Connection
    isConnected,
    error,
    
    // Actions
    refresh,
    connect: connectWebSocket,
    disconnect: disconnectWebSocket,
  };
}

/**
 * Calculate time-based analytics
 */
export function calculateTimeBasedStats(scans: ScanEvent[]) {
  const hourlyStats = new Array(24).fill(0);
  const dailyStats = new Map<string, number>();
  
  scans.forEach(scan => {
    const hour = scan.timestamp.getHours();
    hourlyStats[hour]++;
    
    const day = scan.timestamp.toISOString().split('T')[0];
    dailyStats.set(day, (dailyStats.get(day) || 0) + 1);
  });
  
  const peakHour = hourlyStats.indexOf(Math.max(...hourlyStats));
  
  return {
    hourlyStats,
    dailyStats: Array.from(dailyStats.entries()),
    peakHour,
  };
}
