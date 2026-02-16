"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useApi } from "@/hooks/use-api";
import authService from "@/services/auth.service";
import { Loader2, Mail, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function VerifyEmailPage() {
  const { isLoading, call } = useApi();

  const handleResend = async () => {
    try {
      await call(() => authService.resendVerificationEmail());
      toast.success("Verification email resent. Please check your inbox.");
    } catch {
      toast.error("Failed to resend verification email. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 p-4">
      <Card className="max-w-md w-full rounded-[2.5rem] border-2 shadow-xl overflow-hidden">
        <div className="h-2 bg-blue-600 w-full" />
        <CardHeader className="pt-10 pb-6 text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center">
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-black uppercase tracking-tight">Check your inbox</CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">We sent a verification link to your email</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-8 pb-10 space-y-8">
          <div className="bg-gray-50 dark:bg-zinc-900/50 p-6 rounded-3xl border-2 border-dashed border-gray-100 dark:border-zinc-800">
            <p className="text-xs font-medium text-center text-muted-foreground leading-relaxed">
              Please click the link in the email to verify your account. If you didn&apos;t receive it, check your spam folder or request a new one below.
            </p>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={handleResend} 
              disabled={isLoading}
              className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 dark:shadow-none uppercase font-black text-xs tracking-widest transition-all hover:scale-[1.02] active:scale-95"
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
              Resend Verification
            </Button>
            
            <p className="text-[10px] text-center font-bold text-muted-foreground uppercase tracking-widest">
              Verified? <Button variant="link" className="h-auto p-0 text-[10px] font-black uppercase tracking-widest text-blue-600" onClick={() => window.location.reload()}>Refresh status</Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
