'use client';

import { useEffect, useRef } from 'react';

/**
 * Purpose: Executes WebVitalsReporter functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function WebVitalsReporter() {
  const reported = useRef<Set<string>>(new Set());

  useEffect(() => {
    import('web-vitals').then(({ onCLS, onFCP, onLCP, onTTFB, onINP }) => {
      /**
       * Purpose: Executes report functionality.
       * Owner/Author: Syed Ashhad
       * Created: February 2026
       * Last Editor: Syed Ashhad
       * Last Updated: March 2026
       */
      const report = (metric: { id: string; name: string; value: number; rating: string }) => {
        // Deduplicate — web-vitals can fire the same metric id twice
        if (reported.current.has(metric.id)) return;
        reported.current.add(metric.id);

        if (process.env.NODE_ENV === 'development') {
          if (process.env.NODE_ENV === 'development') console.log(`[Web Vital] ${metric.name}: ${Math.round(metric.value)}${metric.name === 'CLS' ? '' : 'ms'} (${metric.rating})`);
        }
      };
      onCLS(report);
      onFCP(report);
      onLCP(report);
      onTTFB(report);
      onINP(report);
    }).catch(() => {});
  }, []);

  return null;
}
