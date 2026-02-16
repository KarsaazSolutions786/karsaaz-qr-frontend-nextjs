"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import apiClient from "@/lib/api-client";

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      await apiClient.post("/register", {
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.confirmPassword,
      });
      
      toast.success("Account created successfully. Please login.");
      router.push("/account/login");
    } catch (error: unknown) {
      const apiError = error as { response?: { data?: { message?: string } } };
      toast.error(apiError.response?.data?.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Join Karsaaz QR today and start creating trackable QR codes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Input placeholder="Full Name" {...form.register("name")} disabled={isLoading} />
            {form.formState.errors.name && <p className="text-xs text-red-500">{form.formState.errors.name.message as string}</p>}
          </div>
          <div className="space-y-2">
            <Input type="email" placeholder="Email Address" {...form.register("email")} disabled={isLoading} />
            {form.formState.errors.email && <p className="text-xs text-red-500">{form.formState.errors.email.message as string}</p>}
          </div>
          <div className="space-y-2">
            <Input type="password" placeholder="Password" {...form.register("password")} disabled={isLoading} />
            {form.formState.errors.password && <p className="text-xs text-red-500">{form.formState.errors.password.message as string}</p>}
          </div>
          <div className="space-y-2">
            <Input type="password" placeholder="Confirm Password" {...form.register("confirmPassword")} disabled={isLoading} />
            {form.formState.errors.confirmPassword && <p className="text-xs text-red-500">{form.formState.errors.confirmPassword.message as string}</p>}
          </div>
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Register
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/account/login" className="ml-1 font-medium text-blue-600 hover:underline">
          Sign in
        </Link>
      </CardFooter>
    </Card>
  );
}