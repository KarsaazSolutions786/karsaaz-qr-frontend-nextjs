"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import stripeService from "@/services/stripe.service";
import { Download, FileText, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface Invoice {
  id: string;
  number?: string;
  date: string;
  amount: number;
  currency: string;
  status: string;
  plan?: string;
  pdf_url?: string;
  hosted_invoice_url?: string;
}

export default function BillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await stripeService.getInvoices();
        const data = res.data ?? res;
        setInvoices(Array.isArray(data) ? data : data.data ?? []);
      } catch (err) {
        console.error("Failed to load invoices", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  const formatAmount = (amount: number, currency: string) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      minimumFractionDigits: 2,
    }).format(amount / 100);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Billing History</h1>

      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
          <CardDescription>View and download your past invoices.</CardDescription>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <div className="py-8 text-center">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-muted-foreground">No invoices yet.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead className="border-b bg-gray-50 dark:bg-gray-800">
                  <tr className="text-left">
                    <th className="p-4 font-medium text-muted-foreground">
                      Invoice
                    </th>
                    <th className="p-4 font-medium text-muted-foreground">
                      Date
                    </th>
                    <th className="p-4 font-medium text-muted-foreground">
                      Amount
                    </th>
                    <th className="p-4 font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="p-4 font-medium text-muted-foreground text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr
                      key={invoice.id}
                      className="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <td className="p-4 font-medium">
                        {invoice.number || invoice.id}
                      </td>
                      <td className="p-4">
                        {new Date(invoice.date).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        {formatAmount(invoice.amount, invoice.currency)}
                      </td>
                      <td className="p-4">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                            invoice.status === "paid"
                              ? "bg-green-100 text-green-800"
                              : invoice.status === "open"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                          )}
                        >
                          {invoice.status.charAt(0).toUpperCase() +
                            invoice.status.slice(1)}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {invoice.pdf_url && (
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                          >
                            <a
                              href={invoice.pdf_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              PDF
                            </a>
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
