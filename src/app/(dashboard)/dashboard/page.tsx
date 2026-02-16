"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Plus, TrendingUp, Users, Activity } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function DashboardHome() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name || "User"}! Here's an overview of your activity.
          </p>
        </div>
        <Link href="/dashboard/qrcodes/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create QR Code
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total QR Codes</CardTitle>
            <QrCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,350</div>
            <p className="text-xs text-muted-foreground">+18% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Plan</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Pro</div>
            <p className="text-xs text-muted-foreground">Renews in 12 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Referrals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">$45.00 earned</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">New QR Code Created</p>
                  <p className="text-sm text-muted-foreground">Marketing Campaign 2023</p>
                </div>
                <div className="ml-auto font-medium">Just now</div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Subscription Renewed</p>
                  <p className="text-sm text-muted-foreground">Pro Plan - Monthly</p>
                </div>
                <div className="ml-auto font-medium">2 days ago</div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">High Traffic Alert</p>
                  <p className="text-sm text-muted-foreground">Website QR reached 500 scans</p>
                </div>
                <div className="ml-auto font-medium">5 days ago</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
                <Link href="/dashboard/qrcodes" className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors dark:hover:bg-gray-800">
                    <span className="text-sm font-medium">Manage QR Codes</span>
                    <QrCode className="h-4 w-4 text-gray-500" />
                </Link>
                <Link href="/account/my-account" className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors dark:hover:bg-gray-800">
                    <span className="text-sm font-medium">Edit Profile</span>
                    <Users className="h-4 w-4 text-gray-500" />
                </Link>
                <Link href="/dashboard/billing/subscription" className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors dark:hover:bg-gray-800">
                    <span className="text-sm font-medium">View Subscription</span>
                    <TrendingUp className="h-4 w-4 text-gray-500" />
                </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
