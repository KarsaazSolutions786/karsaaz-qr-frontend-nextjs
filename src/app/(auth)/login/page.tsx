"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { usePermission } from "@/hooks/use-permission";
import apiClient from "@/lib/api-client";
import { useAuthStore } from "@/store/useAuthStore";

const emailSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

const otpSchema = z.object({
  otp: z.string().length(5, { message: "OTP must be 5 digits" }),
});

const passwordSchema = z.object({
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type Step = 'email' | 'otp' | 'password';

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();
  const { userHomePage } = usePermission();

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCountdown]);

  const startCountdown = () => setResendCountdown(60);

  const onEmailSubmit = async (data: { email: string }) => {
    setIsLoading(true);
    try {
      // Check login preference
      const prefResponse = await apiClient.post("passwordless-auth/check-preference", {
        email: data.email,
      });

      setEmail(data.email);

      if (prefResponse.login_method === 'traditional') {
        setStep('password');
      } else {
        // Init OTP
        const response = await apiClient.post("passwordless-auth/init", {
          email: data.email,
        });

        if (response.success) {
          setStep('otp');
          startCountdown();
          toast.success("Verification code sent to your email");
        } else {
          toast.error(response.message || "Failed to send verification code");
        }
      }
    } catch (error: unknown) {
      const apiError = error as { response?: { data?: { message?: string } } };
      toast.error(apiError.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const onOtpSubmit = async (data: { otp: string }) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post("passwordless-auth/verify", {
        email,
        otp: data.otp,
      });

      if (response.success) {
        handleAuthSuccess(response);
      } else {
        toast.error(response.message || "Invalid verification code");
      }
    } catch (error: unknown) {
      const apiError = error as { response?: { data?: { message?: string } } };
      toast.error(apiError.response?.data?.message || "Invalid code");
    } finally {
      setIsLoading(false);
    }
  };

  const onPasswordSubmit = async (data: { password: string }) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post("login", {
        email,
        password: data.password,
      });
      handleAuthSuccess(response);
    } catch (error: unknown) {
      const apiError = error as { response?: { data?: { message?: string } } };
      toast.error(apiError.response?.data?.message || "Invalid password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthSuccess = (response: Record<string, any>) => {
    const token = response.token || response.access_token;
    const user = response.user || response.data;

    if (token && user) {
      setAuth(user, token);
      toast.success(response.is_new_user ? "Account created!" : "Login successful!");

      const redirectPath = searchParams.get("from") || userHomePage();
      router.refresh();
      router.push(redirectPath);
    }
  };

  const resendOtp = async () => {
    if (resendCountdown > 0) return;
    setIsLoading(true);
    try {
      const response = await apiClient.post("passwordless-auth/resend", { email });
      if (response.success) {
        startCountdown();
        toast.success("Code resent successfully");
      }
    } catch (error: unknown) {
      const apiError = error as { response?: { data?: { message?: string } } };
      toast.error(apiError.response?.data?.message || "Failed to resend code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            {step === 'email' && "Sign In"}
            {step === 'otp' && "Verify Identity"}
            {step === 'password' && "Enter Password"}
          </CardTitle>
          {step !== 'email' && (
            <button onClick={() => setStep('email')} className="text-sm text-gray-500 flex items-center hover:text-gray-900">
              <ArrowLeft className="mr-1 h-3 w-3" /> Back
            </button>
          )}
        </div>
        <CardDescription>
          {step === 'email' && "Enter your email to continue"}
          {step === 'otp' && `Enter the 5-digit code sent to ${email}`}
          {step === 'password' && `Logging in as ${email}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 'email' && (
          <EmailForm onSubmit={onEmailSubmit} isLoading={isLoading} />
        )}
        {step === 'otp' && (
          <OtpForm
            onSubmit={onOtpSubmit}
            isLoading={isLoading}
            resendCountdown={resendCountdown}
            onResend={resendOtp}
          />
        )}
        {step === 'password' && (
          <PasswordForm onSubmit={onPasswordSubmit} isLoading={isLoading} />
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        {step === 'email' && (
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500 dark:bg-gray-800">Or continue with</span>
            </div>
          </div>
        )}
        {step === 'email' && (
          <Button variant="outline" className="w-full" disabled={isLoading}>
            Google
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>}>
      <LoginPageContent />
    </Suspense>
  );
}

function EmailForm({ onSubmit, isLoading }: { onSubmit: (data: { email: string }) => void, isLoading: boolean }) {
  const form = useForm({ resolver: zodResolver(emailSchema) });
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Input type="email" placeholder="name@example.com" {...form.register("email")} disabled={isLoading} />
        {form.formState.errors.email && <p className="text-xs text-red-500">{form.formState.errors.email.message as string}</p>}
      </div>
      <Button className="w-full" type="submit" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Continue
      </Button>
    </form>
  );
}

function OtpForm({ onSubmit, isLoading, resendCountdown, onResend }: { onSubmit: (data: { otp: string }) => void, isLoading: boolean, resendCountdown: number, onResend: () => void }) {
  const form = useForm({ resolver: zodResolver(otpSchema) });
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2 text-center">
        <Input
          type="text"
          placeholder="12345"
          maxLength={5}
          className="text-center text-2xl tracking-[0.5em] font-bold"
          {...form.register("otp")}
          disabled={isLoading}
        />
        {form.formState.errors.otp && <p className="text-xs text-red-500">{form.formState.errors.otp.message as string}</p>}
      </div>
      <Button className="w-full" type="submit" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Verify & Login
      </Button>
      <div className="text-center">
        <button
          type="button"
          onClick={onResend}
          disabled={resendCountdown > 0 || isLoading}
          className="text-sm text-blue-600 hover:underline disabled:text-gray-400"
        >
          {resendCountdown > 0 ? `Resend code in ${resendCountdown}s` : "Resend code"}
        </button>
      </div>
    </form>
  );
}

function PasswordForm({ onSubmit, isLoading }: { onSubmit: (data: { password: string }) => void, isLoading: boolean }) {
  const form = useForm({ resolver: zodResolver(passwordSchema) });
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Input type="password" placeholder="••••••••" {...form.register("password")} disabled={isLoading} />
        {form.formState.errors.password && <p className="text-xs text-red-500">{form.formState.errors.password.message as string}</p>}
      </div>
      <Button className="w-full" type="submit" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Login
      </Button>
      <div className="text-center">
        <Link href="/account/forgot-password" className="text-sm text-blue-600 hover:underline">
          Forgot password?
        </Link>
      </div>
    </form>
  );
}
