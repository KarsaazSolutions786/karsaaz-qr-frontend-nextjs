"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, MessageSquare, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const mockTickets = [
  { id: "101", subject: "QR code not updating", status: "Open", priority: "High", lastUpdate: "2 hours ago" },
  { id: "102", subject: "Billing issue", status: "In Progress", priority: "Medium", lastUpdate: "1 day ago" },
  { id: "103", subject: "How to export analytics?", status: "Resolved", priority: "Low", lastUpdate: "3 days ago" },
];

export default function SupportPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Support Tickets</h1>
          <p className="text-muted-foreground">Get help with your account and QR codes.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Ticket
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Open Tickets</span>
              <AlertCircle className="h-4 w-4 text-orange-500" />
            </div>
            <div className="text-2xl font-bold mt-2">5</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">In Progress</span>
              <Clock className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold mt-2">2</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Resolved</span>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold mt-2">124</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tickets..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockTickets.map((ticket) => (
              <Link 
                key={ticket.id} 
                href={`/dashboard/support/${ticket.id}`}
                className="block group"
              >
                <div className="flex items-center justify-between p-4 rounded-lg border hover:border-blue-500 hover:bg-blue-50/50 transition-all dark:hover:bg-blue-900/10">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center dark:bg-gray-800">
                      <MessageSquare className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <h4 className="font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {ticket.subject}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Ticket #{ticket.id} • Last activity: {ticket.lastUpdate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={cn(
                      "px-2 py-0.5 text-xs font-medium rounded-full",
                      ticket.priority === "High" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"
                    )}>
                      {ticket.priority}
                    </span>
                    <span className={cn(
                      "px-2.5 py-0.5 text-xs font-medium rounded-full",
                      ticket.status === "Open" ? "bg-orange-100 text-orange-700" :
                      ticket.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                      "bg-green-100 text-green-700"
                    )}>
                      {ticket.status}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
