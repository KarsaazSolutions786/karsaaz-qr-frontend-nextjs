"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import analyticsService from "@/services/analytics.service";
import { ArrowLeft, BarChart2, Calendar, Globe, Loader2, Monitor, Smartphone } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface StatsData {
  total_scans: number;
  unique_scans: number;
  scans_by_date: { date: string; scans: number }[];
  scans_by_device: { device: string; count: number }[];
  scans_by_os: { os: string; count: number }[];
  scans_by_country: { country: string; count: number }[];
}

export default function QRCodeStatsPage() {
  const params = useParams();
  const qrId = params.id as string;
  const [stats, setStats] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  useEffect(() => {
    if (qrId) fetchStats();
  }, [qrId]);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const data = await analyticsService.getQRCodeStats(qrId, dateRange.start && dateRange.end ? dateRange : undefined);
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats", error);
      toast.error("Failed to load analytics data");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/qrcodes">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">QR Code Analytics</h1>
          <p className="text-muted-foreground">Detailed scan statistics for QR code #{qrId}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_scans ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Scans</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.unique_scans ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Countries</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.scans_by_country?.length ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Devices</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.scans_by_device?.length ?? 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" /> Scans Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats?.scans_by_date?.length ? (
            <div className="space-y-2">
              {stats.scans_by_date.map((item) => (
                <div key={item.date} className="flex items-center justify-between py-1 border-b last:border-0">
                  <span className="text-sm text-muted-foreground">{item.date}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{
                          width: `${Math.min((item.scans / Math.max(...stats.scans_by_date.map(d => d.scans))) * 100, 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium w-12 text-right">{item.scans}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No scan data available yet.</p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Smartphone className="h-4 w-4" /> By Device</CardTitle></CardHeader>
          <CardContent>
            {stats?.scans_by_device?.length ? (
              <div className="space-y-2">{stats.scans_by_device.map((item) => (
                <div key={item.device} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground capitalize">{item.device}</span>
                  <span className="font-medium">{item.count}</span>
                </div>
              ))}</div>
            ) : (<p className="text-muted-foreground text-sm text-center py-4">No data</p>)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Monitor className="h-4 w-4" /> By OS</CardTitle></CardHeader>
          <CardContent>
            {stats?.scans_by_os?.length ? (
              <div className="space-y-2">{stats.scans_by_os.map((item) => (
                <div key={item.os} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.os}</span>
                  <span className="font-medium">{item.count}</span>
                </div>
              ))}</div>
            ) : (<p className="text-muted-foreground text-sm text-center py-4">No data</p>)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Globe className="h-4 w-4" /> By Country</CardTitle></CardHeader>
          <CardContent>
            {stats?.scans_by_country?.length ? (
              <div className="space-y-2">{stats.scans_by_country.map((item) => (
                <div key={item.country} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.country}</span>
                  <span className="font-medium">{item.count}</span>
                </div>
              ))}</div>
            ) : (<p className="text-muted-foreground text-sm text-center py-4">No data</p>)}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}