import type { Metric } from 'web-vitals';

export function reportWebVitals(metric: Metric) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vital] ${metric.name}: ${metric.value.toFixed(2)}ms (${metric.rating})`);
  }

  // In production, send to analytics endpoint
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_ANALYTICS_URL) {
    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
      navigationType: metric.navigationType,
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon(`${process.env.NEXT_PUBLIC_ANALYTICS_URL}/vitals`, body);
    }
  }
}
