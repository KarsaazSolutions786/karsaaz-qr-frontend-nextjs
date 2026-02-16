"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

import { ChartProps } from "./AnalyticsChart";

// Optimized: Lazy load Recharts as they are heavy
const LazyAnalyticsChart = dynamic(() => 
  import("./AnalyticsChart").then(mod => mod.AnalyticsChart), {
    loading: () => <div className="h-[300px] flex items-center justify-center bg-muted/20 animate-pulse rounded-lg"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>,
    ssr: false // Recharts relies on window/DOM
  }
);

export function OptimizedChart(props: ChartProps) {
  return (
    <Suspense fallback={<div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-lg" />}>
      <LazyAnalyticsChart {...props} />
    </Suspense>
  );
}
