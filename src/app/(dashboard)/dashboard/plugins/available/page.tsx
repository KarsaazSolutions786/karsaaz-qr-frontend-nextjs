"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Printer, Ticket } from "lucide-react";

export default function AvailablePluginsPage() {
  const plugins = [
    {
      name: "Affiliates & Coupons",
      description: "Manage affiliate programs and discount coupons.",
      price: "$45",
      icon: Ticket,
    },
    {
      name: "Pre Printed QR Codes",
      description: "Generate batches of QR codes for printing.",
      price: "$300",
      icon: Printer,
    },
    {
      name: "Product Store",
      description: "Simple e-commerce functionality for your bio links.",
      price: "$300",
      icon: ShoppingBag,
    },
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Available Plugins</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plugins.map((plugin, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-4 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <plugin.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">{plugin.name}</CardTitle>
              </div>
              <CardDescription>{plugin.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="text-2xl font-bold">{plugin.price}</div>
              <div className="text-sm text-muted-foreground">One-time payment</div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Buy Now</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
