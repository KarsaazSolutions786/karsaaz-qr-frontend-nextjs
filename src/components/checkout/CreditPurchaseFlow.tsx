"use client";

import { ArrowRight, Loader2, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
import { Label } from "@/components/ui/label";
import { Skeleton } from "../ui/skeleton";

import { cn } from "@/lib/utils";
import checkoutService from "@/services/checkout.service";
import userService from "@/services/user.service";
import { useAuthStore } from "@/store/useAuthStore";

const AMOUNTS = [5, 10, 20, 30, 40, 50];
const MIN_AMOUNT = 5;

export default function CreditPurchaseFlow() {
    const { user } = useAuthStore();
    const [balance, setBalance] = useState<number | null>(null);
    const [loadingBalance, setLoadingBalance] = useState(true);
    const [selectedAmount, setSelectedAmount] = useState<number>(10);
    const [isCustomAmount, setIsCustomAmount] = useState(false);
    const [processing, setProcessing] = useState(false);

    const { register, watch } = useForm<{ customAmount: number }>({
        defaultValues: { customAmount: 100 }
    });

    useEffect(() => {
        const fetchBalance = async () => {
            if (!user?.id) return;
            try {
                const res = await userService.getAccountBalance(user.id);
                // API response might be { account_balance: 123 } or just number
                const bal = (res as { data?: { account_balance?: number } })?.data?.account_balance ?? res.data ?? 0;
                setBalance(Number(bal));
            } catch (_error: unknown) { // Handle error as unknown
                console.error("Failed to load balance", _error);
            } finally {
                setLoadingBalance(false);
            }
        };
        fetchBalance();
    }, [user?.id]);

    const handleAmountSelect = (amount: number) => {
        setSelectedAmount(amount);
        setIsCustomAmount(false);
    };

    const handleCustomAmountClick = () => {
        setIsCustomAmount(true);
        // Don't verify amount immediately
    };

    const onPurchase = async () => {
        const finalAmount = isCustomAmount ? watch("customAmount") : selectedAmount;

        if (finalAmount < MIN_AMOUNT) {
            toast.error(`Minimum amount is $${MIN_AMOUNT}`);
            return;
        }

        setProcessing(true);
        try {
            const res = await checkoutService.buyCredits(finalAmount);
            const link = res.data.link;

            if (link) {
                window.location.href = link;
            } else {
                toast.error("Failed to generate payment link");
            }
        } catch (error: unknown) {
            const apiError = error as { response?: { data?: { message?: string } } };
            toast.error(apiError.response?.data?.message || "Payment initiation failed");
            setProcessing(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium">Current Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold flex items-center gap-2">
                            <Wallet className="h-8 w-8 text-primary" />
                            {loadingBalance ? (
                                <Skeleton className="h-8 w-24" />
                            ) : (
                                <span>${balance?.toFixed(2) ?? "0.00"}</span>
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            Use credits to pay for subscriptions or add-ons.
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-primary/5 border-primary/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium text-primary">Need more?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-primary/80">
                            Credits never expire and can be used for any purchase on the platform.
                            Instant delivery after payment.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Buy Credits</CardTitle>
                    <CardDescription>Select an amount to add to your account wallet.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                        {AMOUNTS.map((amount) => (
                            <button
                                key={amount}
                                onClick={() => handleAmountSelect(amount)}
                                className={cn(
                                    "flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all hover:bg-muted",
                                    !isCustomAmount && selectedAmount === amount
                                        ? "border-primary bg-primary/5 text-primary"
                                        : "border-transparent bg-muted/50"
                                )}
                            >
                                <span className="text-xl font-bold">${amount}</span>
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex-1 h-px bg-border"></div>
                        <span className="text-xs text-muted-foreground uppercase font-medium">Or</span>
                        <div className="flex-1 h-px bg-border"></div>
                    </div>

                    <div
                        onClick={handleCustomAmountClick}
                        className={cn(
                            "p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
                            isCustomAmount ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-primary/50"
                        )}
                    >
                        {!isCustomAmount ? (
                            <div className="text-center">
                                <span className="font-medium text-muted-foreground">Enter Custom Amount</span>
                            </div>
                        ) : (
                            <div className="max-w-xs mx-auto space-y-2">
                                <Label htmlFor="customAmount" className="text-center block">Enter Amount (Min $5)</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                    <Input
                                        id="customAmount"
                                        type="number"
                                        min={MIN_AMOUNT}
                                        className="pl-7 text-center text-lg font-bold"
                                        {...register("customAmount", { valueAsNumber: true })}
                                        autoFocus
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {isCustomAmount && watch("customAmount") < MIN_AMOUNT && (
                        <p className="text-sm text-red-500 text-center font-medium">
                            Minimum amount is ${MIN_AMOUNT}
                        </p>
                    )}
                </CardContent>
                <CardFooter className="flex justify-end pt-2">
                    <Button
                        size="lg"
                        onClick={onPurchase}
                        disabled={processing || (isCustomAmount && (watch("customAmount") || 0) < MIN_AMOUNT)}
                        className="w-full sm:w-auto min-w-[200px]"
                    >
                        {processing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                Pay Now <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}