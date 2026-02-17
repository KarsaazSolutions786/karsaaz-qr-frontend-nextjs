const fs = require('fs');
const path = require('path');

// Define paths
const baseDir = 'C:\\Dev\\karsaaz qr\\karsaaz-qr-frontend-nextjs\\src\\components\\billing';

// Create directory if it doesn't exist
if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir, { recursive: true });
  console.log(`✓ Created directory: ${baseDir}`);
}

// PlanCard.tsx content
const planCardContent = `"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BillingPlan } from "@/services/billing-management.service";
import { Check } from "lucide-react";

interface PlanCardProps {
  plan: BillingPlan;
  isCurrentPlan?: boolean;
  onUpgrade?: () => void;
  onDowngrade?: () => void;
  onCancel?: () => void;
}

export function PlanCard({
  plan,
  isCurrentPlan,
  onUpgrade,
  onDowngrade,
  onCancel,
}: PlanCardProps) {
  return (
    <Card className="p-6 flex flex-col h-full">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">{plan.name}</h3>
          {isCurrentPlan && (
            <Badge variant="default" className="bg-green-600">
              Current Plan
            </Badge>
          )}
        </div>
        {plan.description && (
          <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
        )}
      </div>

      <div className="mb-6">
        <div className="text-3xl font-bold">
          $\{plan.price}
          <span className="text-base font-normal text-gray-600 ml-2">
            /{plan.frequency === "monthly" ? "month" : "year"}
          </span>
        </div>
        {plan.is_trial && plan.trial_days && (
          <p className="text-sm text-blue-600 mt-2">
            {plan.trial_days} day free trial
          </p>
        )}
      </div>

      <div className="mb-6 flex-grow">
        <h4 className="font-medium mb-3">Features & Limits:</h4>
        <ul className="space-y-2">
          <li className="flex items-center text-sm">
            <Check className="w-4 h-4 mr-2 text-green-600" />
            {plan.limits.qr_codes.toLocaleString()} QR Codes
          </li>
          <li className="flex items-center text-sm">
            <Check className="w-4 h-4 mr-2 text-green-600" />
            {plan.limits.api_calls.toLocaleString()} API Calls
          </li>
          <li className="flex items-center text-sm">
            <Check className="w-4 h-4 mr-2 text-green-600" />
            {plan.limits.storage_gb} GB Storage
          </li>
          <li className="flex items-center text-sm">
            <Check className="w-4 h-4 mr-2 text-green-600" />
            {plan.limits.team_members} Team Members
          </li>
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-center text-sm">
              <Check className="w-4 h-4 mr-2 text-green-600" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-2">
        {isCurrentPlan ? (
          <>
            <Button variant="outline" className="w-full" onClick={onDowngrade}>
              Downgrade Plan
            </Button>
            <Button variant="destructive" className="w-full" onClick={onCancel}>
              Cancel Subscription
            </Button>
          </>
        ) : (
          <Button className="w-full" onClick={onUpgrade}>
            Upgrade to {plan.name}
          </Button>
        )}
      </div>
    </Card>
  );
}`;

// UsageCard.tsx content
const usageCardContent = `"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UsageMetrics } from "@/services/billing-management.service";
import { AlertTriangle } from "lucide-react";

interface UsageCardProps {
  usage: UsageMetrics | null;
}

export function UsageCard({ usage }: UsageCardProps) {
  if (!usage) {
    return <Card className="p-6">Loading usage metrics...</Card>;
  }

  const qrPercentage = (usage.qr_codes_created / usage.qr_codes_limit) * 100;
  const apiPercentage = (usage.api_calls_made / usage.api_calls_limit) * 100;
  const storagePercentage = (usage.storage_used / usage.storage_limit) * 100;

  const isNearLimit = (percentage: number) => percentage >= 80;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">Current Usage</h3>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium">QR Codes</label>
            <span className="text-sm text-gray-600">
              {usage.qr_codes_created} / {usage.qr_codes_limit}
            </span>
          </div>
          <Progress value={Math.min(qrPercentage, 100)} className="h-2" />
          {isNearLimit(qrPercentage) && (
            <Alert className="mt-2 border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                You're using {qrPercentage.toFixed(0)}% of your QR code quota
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium">API Calls</label>
            <span className="text-sm text-gray-600">
              {usage.api_calls_made} / {usage.api_calls_limit}
            </span>
          </div>
          <Progress value={Math.min(apiPercentage, 100)} className="h-2" />
          {isNearLimit(apiPercentage) && (
            <Alert className="mt-2 border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                You're using {apiPercentage.toFixed(0)}% of your API call quota
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium">Storage</label>
            <span className="text-sm text-gray-600">
              {usage.storage_used} / {usage.storage_limit} GB
            </span>
          </div>
          <Progress value={Math.min(storagePercentage, 100)} className="h-2" />
          {isNearLimit(storagePercentage) && (
            <Alert className="mt-2 border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                You're using {storagePercentage.toFixed(0)}% of your storage quota
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium">Team Members</label>
            <span className="text-sm text-gray-600">
              {usage.team_members} / {usage.team_members_limit}
            </span>
          </div>
          <Progress
            value={(usage.team_members / usage.team_members_limit) * 100}
            className="h-2"
          />
        </div>
      </div>
    </Card>
  );
}`;

// Create files
fs.writeFileSync(path.join(baseDir, 'PlanCard.tsx'), planCardContent);
console.log(`✓ Created: ${path.join(baseDir, 'PlanCard.tsx')}`);

fs.writeFileSync(path.join(baseDir, 'UsageCard.tsx'), usageCardContent);
console.log(`✓ Created: ${path.join(baseDir, 'UsageCard.tsx')}`);

// List directory
console.log('\n✓ Directory Contents:');
const files = fs.readdirSync(baseDir);
files.forEach(file => {
  console.log(`  ${path.join(baseDir, file)}`);
});
