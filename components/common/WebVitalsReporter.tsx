'use client';

import { useEffect } from 'react';

export function WebVitalsReporter() {
  useEffect(() => {
    import('web-vitals').then(({ onCLS, onFCP, onLCP, onTTFB, onINP }) => {
      const report = (metric: any) => {
        if (process.env.NODE_ENV === 'development') {
          console.log(`[Web Vital] ${metric.name}: ${Math.round(metric.value)}${metric.name === 'CLS' ? '' : 'ms'} (${metric.rating})`);
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
