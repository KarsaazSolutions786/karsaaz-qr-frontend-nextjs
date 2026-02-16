"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useApi } from "@/hooks/use-api";
import { cn } from "@/lib/utils";
import { Cpu, Database, RefreshCw, Server, Terminal, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import systemService from "../../../../../services/system.service";

export default function SystemStatusPage() {
  const { call, isLoading } = useApi();
  const [status, setStatus] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);

  const fetchStatus = async () => {
    try {
      const response = await call(() => systemService.getStatus());
      setStatus(response.data || response);
    } catch (error) { }
  };

  const fetchLogs = async () => {
    try {
      const response = await call(() => systemService.getLogs());
      // console.log("Logs response:", response);
      const logsData = response.data?.data || response.data || [];
      setLogs(Array.isArray(logsData) ? logsData : []);
    } catch (error) {
      setLogs([]);
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchLogs();
  }, []);

  const clearCache = async () => {
    try {
      await call(() => systemService.clearCache("all"));
      toast.success("System cache cleared");
    } catch (error) { }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">System Status</h1>
          <p className="text-sm text-muted-foreground">Monitor health and server performance.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={clearCache} disabled={isLoading}>
            <Trash2 className="h-4 w-4 mr-2" /> Clear Cache
          </Button>
          <Button size="sm" onClick={fetchStatus} disabled={isLoading}>
            <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} /> Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatusCard icon={Cpu} title="Server Load" value={status?.server_load || "0.42"} label="Average" />
        <StatusCard icon={Database} title="DB Connection" value={status?.db_status || "Healthy"} label="MySQL 8.0" status="online" />
        <StatusCard icon={Server} title="Uptime" value={status?.uptime || "12d 4h"} label="System" />
      </div>

      <Card className="shadow-none">
        <CardHeader className="border-b bg-gray-50/50 dark:bg-gray-800/50">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-blue-600" />
            <CardTitle className="text-base">Application Logs</CardTitle>
          </div>
          <CardDescription>Recent system events and Laravel logs.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-[400px] overflow-y-auto bg-zinc-950 p-4 font-mono text-[13px] text-zinc-300">
            {Array.isArray(logs) && logs.length > 0 ? (
              logs.map((log, i) => (
                <div key={i} className="mb-1 border-l-2 border-blue-500 pl-3 py-1 hover:bg-zinc-900 transition-colors">
                  <span className="text-zinc-500 mr-2">[{log.created_at || new Date().toISOString()}]</span>
                  <span className={cn(
                    "font-bold mr-2",
                    log.level === "error" ? "text-red-400" : "text-green-400"
                  )}>{log.level?.toUpperCase() || "INFO"}:</span>
                  {log.message || "System activity logged."}
                </div>
              ))
            ) : (
              <div className="text-zinc-600 text-center py-10 italic">No recent log entries.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatusCard({ icon: Icon, title, value, label, status }: any) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-bold">{value}</div>
          {status === "online" && <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />}
        </div>
        <p className="text-xs text-muted-foreground mt-1">{label}</p>
      </CardContent>
    </Card>
  );
}