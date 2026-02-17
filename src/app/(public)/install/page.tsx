"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function InstallPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to Karsaaz QR</CardTitle>
          <CardDescription>
            Installation Wizard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Welcome to the installation wizard. We will help you set up your application.
          </p>
          <div className="bg-yellow-50 text-yellow-800 p-4 rounded-md text-sm dark:bg-yellow-900/20 dark:text-yellow-200">
            <strong>Note:</strong> For this Next.js migration, please ensure your environment variables are configured in <code>.env</code> manually if this wizard is not fully functional.
          </div>
        </CardContent>
        <CardFooter>
          <Link href="/install/purchase-code" className="w-full">
            <Button className="w-full">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
