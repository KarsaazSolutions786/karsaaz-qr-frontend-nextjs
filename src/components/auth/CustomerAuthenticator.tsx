"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApi } from "@/hooks/use-api";
import { authService } from "@/services/auth.service";
import { Loader2, Mail, Lock, User, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CustomerAuthenticatorProps {
  onSuccess: (data: { user: any; token: string }) => void;
  onFailure?: (error: any) => void;
  initialScenario?: "login" | "register";
}

export function CustomerAuthenticator({
  onSuccess,
  onFailure,
  initialScenario = "login"
}: CustomerAuthenticatorProps) {
  const [step, setStep] = useState<"email" | "password" | "otp" | "name">("email");
  const [scenario, setScenario] = useState<"login" | "register">(initialScenario);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");

  const { call, isLoading } = useApi();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      // Check if user exists to determine scenario
      const res = await call(() => authService.checkEmail(email));
      if (res.found) {
        setScenario("login");
        setStep("password");
      } else {
        setScenario("register");
        setStep("name");
      }
    } catch (error) {
      toast.error("Failed to verify email");
      onFailure?.(error);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await call(() => authService.login({ email, password }));
      onSuccess(res);
    } catch (error) {
      toast.error("Invalid credentials");
      onFailure?.(error);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await call(() => authService.sendOtpCode(email));
      setStep("otp");
    } catch (error) {
      toast.error("Failed to send verification code");
      onFailure?.(error);
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await call(() => authService.otpRegistration({ name, email, otp }));
      onSuccess(res);
    } catch (error) {
      toast.error("Invalid verification code");
      onFailure?.(error);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto space-y-6 bg-card p-6 rounded-2xl border shadow-sm">
      <div className="text-center space-y-1">
        <h3 className="font-bold text-lg">
          {step === "email" && "Identify Yourself"}
          {step === "password" && "Enter Password"}
          {step === "name" && "Create Account"}
          {step === "otp" && "Verify Email"}
        </h3>
        <p className="text-xs text-muted-foreground">
          {step === "email" && "Enter your email to continue"}
          {step === "password" && "Enter the password for your account"}
          {step === "name" && "Please provide your name to register"}
          {step === "otp" && "Enter the 5-digit code sent to your email"}
        </p>
      </div>

      <form className="space-y-4" onSubmit={
        step === "email" ? handleEmailSubmit :
        step === "password" ? handleLoginSubmit :
        step === "name" ? handleRegisterSubmit :
        handleOtpVerify
      }>
        {step === "email" && (
          <div className="space-y-2">
            <Label>Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                type="email" 
                placeholder="name@example.com" 
                className="pl-10" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
        )}

        {step === "password" && (
          <div className="space-y-2">
            <Label>Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                type="password" 
                placeholder="••••••••" 
                className="pl-10" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
        )}

        {step === "name" && (
          <div className="space-y-2">
            <Label>Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="John Doe" 
                className="pl-10" 
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
          </div>
        )}

        {step === "otp" && (
          <div className="space-y-2">
            <Label>Verification Code</Label>
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="12345" 
                className="pl-10 text-center tracking-[1em] font-mono" 
                maxLength={5}
                value={otp}
                onChange={e => setOtp(e.target.value)}
                required
              />
            </div>
          </div>
        )}

        <Button className="w-full h-11 rounded-xl" disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          {step === "email" ? "Continue" : step === "otp" ? "Verify & Register" : "Sign In"}
        </Button>

        {step !== "email" && (
          <Button 
            type="button" 
            variant="ghost" 
            className="w-full text-xs" 
            onClick={() => setStep("email")}
          >
            Use different email
          </Button>
        )}
      </form>
    </div>
  );
}
