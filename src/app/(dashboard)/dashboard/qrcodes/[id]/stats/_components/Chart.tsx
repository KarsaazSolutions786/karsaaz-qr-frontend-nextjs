"use client";

import React from "react";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

export default function Chart({ data }: { data: Array<{ date: string; scans: number }> }) {
  return (
    <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="scans" stroke="#2563EB" fill="#3B82F6" fillOpacity={0.2} />
            </AreaChart>
        </ResponsiveContainer>
    </div>
  );
}
