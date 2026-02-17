"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApi } from "@/hooks/use-api";
import { abuseReportService } from "@/services/abuse-report.service";
import { qrCodeService } from "@/services/qr.service";
import { useAuthStore } from "@/store/useAuthStore";
import { AlertTriangle, Loader2, Search, CheckCircle2 } from "lucide-react";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";
import React from "react";

export default function ReportAbusePage() {
  const { user } = useAuthStore();
  const { call, isLoading } = useApi();
  
  const [search, setSearch] = useState("");
  const [qrResults, setQrResults] = useState<any[]>([]);
  const [selectedQr, setSelectedQr] = useState<any>(null);
  const [searching, setSearching] = useState(false);
  
  const [category, setCategory] = useState("");
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSearch = useCallback(async (query: string) => {
    if (query.length < 2) {
      setQrResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await qrCodeService.getAll({ keyword: query, page_size: 5 });
      setQrResults(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setSearching(false);
    }
  }, []);

  // Simple debounce logic
  const debouncedSearch = useDebounce(search, 500);
  React.useEffect(() => {
    handleSearch(debouncedSearch);
  }, [debouncedSearch, handleSearch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQr || !category) {
      toast.error("Please select a QR code and a reason.");
      return;
    }

    try {
      await call(() => abuseReportService.submit({
        qrcode_id: selectedQr.id,
        qrcode_hash: selectedQr.hash,
        reported_by_email: user?.email || "",
        category: category,
        details: details
      }));
      setSubmitted(true);
      toast.success("Abuse report submitted. Thank you for keeping Karsaaz safe.");
    } catch (error) {
      toast.error("Failed to submit report.");
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <Card className="w-full max-w-md text-center p-8 rounded-[2rem] border-2">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-green-50 p-4 border-2 border-green-100">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Report Received</h2>
          <p className="text-sm text-muted-foreground uppercase font-bold tracking-widest mb-8">
            Our team will investigate this QR code promptly.
          </p>
          <Button className="w-full rounded-xl" onClick={() => window.location.href = "/dashboard"}>
            Return to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8 max-w-2xl">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-2xl text-red-600">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight">Report Abuse</h1>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Help us identify and remove malicious content
          </p>
        </div>
      </div>

      <Card className="rounded-[2rem] border-2 shadow-sm">
        <CardHeader>
          <CardTitle className="uppercase font-black text-lg">Submit a Report</CardTitle>
          <CardDescription className="uppercase font-bold text-[10px] tracking-widest">
            Please provide details about the violation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 relative">
              <Label className="text-[10px] font-black uppercase tracking-widest">QR Code Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  className="pl-10 rounded-xl h-11" 
                  placeholder="Type name or scan URL..." 
                  value={selectedQr ? selectedQr.name : search}
                  onChange={e => {
                    setSearch(e.target.value);
                    if (selectedQr) setSelectedQr(null);
                  }}
                  readOnly={!!selectedQr}
                />
                {searching && <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />}
                {selectedQr && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="absolute right-2 top-1.5 h-7 text-[9px] font-black uppercase"
                    onClick={() => { setSelectedQr(null); setSearch(""); }}
                  >
                    Change
                  </Button>
                )}
              </div>
              
              {!selectedQr && qrResults.length > 0 && (
                <div className="absolute z-10 w-full bg-card border-2 rounded-xl mt-1 shadow-xl overflow-hidden">
                  {qrResults.map(qr => (
                    <button
                      key={qr.id}
                      type="button"
                      className="w-full text-left p-3 hover:bg-muted transition-colors flex items-center justify-between border-b last:border-0"
                      onClick={() => setSelectedQr(qr)}
                    >
                      <div>
                        <div className="font-bold text-sm">{qr.name}</div>
                        <div className="text-[9px] text-muted-foreground font-black uppercase">{qr.type}</div>
                      </div>
                      <CheckCircle2 className="h-4 w-4 text-muted-foreground opacity-20" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest">Reason for Report</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="rounded-xl h-11">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scam">Phishing / Scam</SelectItem>
                  <SelectItem value="malware">Malware / Virus</SelectItem>
                  <SelectItem value="illegal">Illegal Content</SelectItem>
                  <SelectItem value="copyright">Copyright Infringement</SelectItem>
                  <SelectItem value="impersonation">Impersonation</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest">Details (Optional)</Label>
              <Textarea 
                className="rounded-xl min-h-[120px] p-4" 
                placeholder="Provide more information to help us investigate..." 
                value={details}
                onChange={e => setDetails(e.target.value)}
              />
            </div>

            <div className="pt-4 border-t border-dashed flex justify-end">
              <Button 
                type="submit" 
                variant="destructive" 
                className="w-full sm:w-auto px-8 rounded-xl h-11 uppercase font-black text-[10px] tracking-widest"
                disabled={isLoading || !selectedQr || !category}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Submit Abuse Report
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
