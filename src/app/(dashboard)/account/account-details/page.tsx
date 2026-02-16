"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import billingService, { UserSubscription } from "@/services/billing.service";
import userService from "@/services/user.service";
import { useAuthStore } from "@/store/useAuthStore";
import {
  ArrowUpCircle,
  CheckCircle,
  Key,
  Loader2,
  QrCode,
  Save,
  ScanLine,
  User,
  Users,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function AccountDetailsPage() {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, setUser } = useAuthStore();

  const profileForm = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    }
  });

  const passwordForm = useForm({
    defaultValues: {
      current_password: "",
      password: "",
      password_confirmation: "",
    }
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [subRes, balRes] = await Promise.all([
          billingService.getUserSubscriptions(),
          user?.id ? userService.getAccountBalance(user.id).catch(() => null) : Promise.resolve(null),
        ]);

        const subData = subRes.data ?? subRes;
        const subs = Array.isArray(subData) ? subData : subData.data ?? [];
        const activeSub = subs.find((s: UserSubscription) => s.status === "active") || subs[0] || null;
        setSubscription(activeSub);

        if (balRes) {
          const balData = balRes.data ?? balRes;
          setBalance(typeof balData === "number" ? balData : balData?.balance ?? null);
        }
      } catch (err: unknown) {
        console.error("Failed to load account details", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.id]);

  const onProfileSubmit = async (data: Record<string, unknown>) => {
    if (!user?.id) return;
    setIsSubmitting(true);
    try {
      const updatedUser = await userService.updateProfile(user.id, data);
      setUser(updatedUser);
      toast.success("Profile updated successfully");
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } } };
      toast.error(apiError.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onPasswordSubmit = async (data: Record<string, unknown>) => {
    if (!user?.id) return;
    setIsSubmitting(true);
    try {
      await userService.updatePassword(user.id, {
        current_password: data.current_password as string,
        password: data.password as string,
        password_confirmation: data.password_confirmation as string,
      });
      toast.success("Password updated successfully");
      passwordForm.reset();
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } } };
      toast.error(apiError.response?.data?.message || "Failed to update password. Check your current password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const plan = subscription?.subscription_plan;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200 dark:shadow-none">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight uppercase">Account Hub</h1>
            <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-[0.2em]">Manage your high-fidelity profile</p>
          </div>
        </div>
        <Link href="/pricing">
          <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200 dark:shadow-none uppercase font-black text-[10px] tracking-widest px-6 h-11">
            <ArrowUpCircle className="mr-2 h-4 w-4" />
            {plan ? "Scale Architecture" : "Deploy Subscription"}
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="profile" className="space-y-8">
        <TabsList className="bg-transparent border-b-2 border-gray-100 dark:border-zinc-800 w-full justify-start rounded-none h-auto p-0 gap-8">
          <TabsTrigger value="profile" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-0 py-4 text-[10px] font-black uppercase tracking-[0.2em]">Personal Identity</TabsTrigger>
          <TabsTrigger value="subscription" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-0 py-4 text-[10px] font-black uppercase tracking-[0.2em]">Subscription Pipeline</TabsTrigger>
          <TabsTrigger value="security" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-0 py-4 text-[10px] font-black uppercase tracking-[0.2em]">Security Protocol</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="rounded-[2.5rem] border-2 shadow-sm">
            <CardHeader className="p-8">
              <CardTitle className="text-lg font-black uppercase tracking-tight">Identity Details</CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Update your personal account information</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Display Name</Label>
                    <Input {...profileForm.register("name")} className="h-12 rounded-xl border-2 px-4 font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Email Endpoint</Label>
                    <Input {...profileForm.register("email")} type="email" className="h-12 rounded-xl border-2 px-4 font-bold" />
                  </div>
                </div>
                <Button disabled={isSubmitting} className="h-12 rounded-xl px-8 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 uppercase font-black text-[10px] tracking-widest">
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                  Synchronize Profile
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription" className="space-y-6">
          <Card className="rounded-[2.5rem] border-2 shadow-sm">
            <CardHeader className="p-8">
              <CardTitle className="text-lg font-black uppercase tracking-tight">Active Plan Pipeline</CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest">
                {plan ? `Your infrastructure is currently running on ${plan.name}` : "No active pipeline detected"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              {plan ? (
                <div className="space-y-8">
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="p-6 rounded-[2rem] bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-100 dark:border-blue-900/30">
                      <QrCode className="h-6 w-6 text-blue-600 mb-4" />
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">QR Capacity</p>
                      <p className="text-lg font-black">{plan.qr_types?.length || "Unlimited"}</p>
                    </div>
                    <div className="p-6 rounded-[2rem] bg-green-50 dark:bg-green-900/20 border-2 border-green-100 dark:border-green-900/30">
                      <ScanLine className="h-6 w-6 text-green-600 mb-4" />
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Throughput</p>
                      <p className="text-lg font-black capitalize">{plan.frequency || "Standard"}</p>
                    </div>
                    <div className="p-6 rounded-[2rem] bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-100 dark:border-purple-900/30">
                      <Users className="h-6 w-6 text-purple-600 mb-4" />
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">User Nodes</p>
                      <p className="text-lg font-black">{plan.number_of_users || 1}</p>
                    </div>
                    {balance !== null && (
                      <div className="p-6 rounded-[2rem] bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-100 dark:border-amber-900/30">
                        <Wallet className="h-6 w-6 text-amber-600 mb-4" />
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Credit Balance</p>
                        <p className="text-lg font-black">
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: plan.currency || "USD",
                          }).format(balance)}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-900 dark:text-blue-300">Feature Streams</h4>
                      <div className="grid gap-3">
                        {plan.features?.map((f: string, i: number) => (
                          <div key={i} className="flex items-center gap-3 text-xs font-bold">
                            <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                            {f}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-900 dark:text-blue-300">High-Fidelity Types</h4>
                      <div className="flex flex-wrap gap-2">
                        {plan.qr_types?.map((t: string) => (
                          <span key={t} className="px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg bg-gray-50 dark:bg-zinc-900 border-2">
                            {t.replace(/-/g, " ")}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center space-y-6">
                  <div className="mx-auto w-16 h-16 bg-gray-50 dark:bg-zinc-900 rounded-2xl flex items-center justify-center border-2 border-dashed">
                    <QrCode className="h-8 w-8 text-muted-foreground opacity-50" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-bold uppercase tracking-tight">No Active Subscription</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Initialize your subscription to unlock pro architecture</p>
                  </div>
                  <Link href="/pricing">
                    <Button className="rounded-xl h-11 px-8 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 uppercase font-black text-[10px] tracking-widest transition-all hover:scale-[1.02]">Explore Plans</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="rounded-[2.5rem] border-2 shadow-sm">
            <CardHeader className="p-8">
              <CardTitle className="text-lg font-black uppercase tracking-tight">Password Rotation</CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Update your authentication credentials</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Current Password</Label>
                    <Input {...passwordForm.register("current_password")} type="password" placeholder="••••••••" className="h-12 rounded-xl border-2 px-4 font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">New Neural Secret</Label>
                    <Input {...passwordForm.register("password")} type="password" placeholder="••••••••" className="h-12 rounded-xl border-2 px-4 font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Confirm Secret</Label>
                    <Input {...passwordForm.register("password_confirmation")} type="password" placeholder="••••••••" className="h-12 rounded-xl border-2 px-4 font-bold" />
                  </div>
                </div>
                <Button disabled={isSubmitting} className="h-12 rounded-xl px-8 bg-zinc-900 hover:bg-zinc-800 shadow-lg uppercase font-black text-[10px] tracking-widest">
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Key className="h-4 w-4 mr-2" />}
                  Rotate Secret Key
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
