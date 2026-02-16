"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2, CheckCircle2, DollarSign, Settings2, Users } from "lucide-react";
import { useApi } from "@/hooks/use-api";
import billingService, { SubscriptionPlan } from "@/services/billing.service";
import { toast } from "sonner";

export default function PlansManagementPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const { call, isLoading } = useApi();

  const fetchPlans = async () => {
    try {
      const response = await call(() => billingService.getPlans());
      const data = response.data || response;
      setPlans(Array.isArray(data) ? data : data.data || []);
    } catch (error) {}
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleDelete = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this plan? This may affect existing subscribers.")) return;
    try {
      await call(() => billingService.deletePlan(id));
      toast.success("Plan deleted");
      fetchPlans();
    } catch (error) {}
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Subscription Plans</h1>
          <p className="text-muted-foreground text-sm">Configure your product pricing and feature limits.</p>
        </div>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Create New Plan
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => <div key={i} className="h-64 rounded-xl bg-gray-100 animate-pulse" />)
        ) : plans.length > 0 ? (
          plans.map((plan) => (
            <Card key={plan.id} className="flex flex-col hover:border-blue-500 transition-colors shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription className="capitalize">{plan.frequency} Plan</CardDescription>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-2xl font-bold flex items-center">
                      <span className="text-sm font-normal text-muted-foreground mr-1">{plan.currency}</span>
                      {plan.price}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-4 pt-0">
                <div className="space-y-2.5">
                  <div className="flex items-center text-sm font-medium">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                    {plan.features?.length || 0} Enabled Features
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="mr-2 h-4 w-4" />
                    Limit: {plan.number_of_users === -1 ? "Unlimited" : plan.number_of_users} users
                  </div>
                  {plan.is_trial && (
                    <div className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold uppercase rounded w-fit">
                      {plan.trial_days} Days Trial
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="border-t bg-gray-50/50 p-4 flex justify-between dark:bg-gray-800/50 rounded-b-xl">
                 <Button variant="outline" size="sm" className="h-8">
                    <Edit2 className="mr-2 h-3.5 w-3.5" />
                    Edit
                 </Button>
                 <Button variant="ghost" size="sm" className="h-8 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(plan.id)}>
                    <Trash2 className="mr-2 h-3.5 w-3.5" />
                    Delete
                 </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-20 text-center border-2 border-dashed rounded-xl">
            <DollarSign className="h-10 w-10 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground">No subscription plans found.</p>
          </div>
        )}
      </div>
    </div>
  );
}