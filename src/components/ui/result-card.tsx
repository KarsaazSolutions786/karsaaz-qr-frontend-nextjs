import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Button } from "./button";
import { Card, CardContent, CardFooter, CardHeader } from "./card";

interface ResultCardProps {
  status: "success" | "error" | "loading" | "warning";
  title: string;
  description?: string;
  icon?: LucideIcon;
  primaryAction?: {
    label: string;
    onClick: () => void;
    loading?: boolean;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const statusConfig = {
  success: {
    bg: "bg-green-50 dark:bg-green-900/20",
    text: "text-green-600 dark:text-green-400",
    border: "border-green-100 dark:border-green-900/50",
  },
  error: {
    bg: "bg-red-50 dark:bg-red-900/20",
    text: "text-red-600 dark:text-red-400",
    border: "border-red-100 dark:border-red-900/50",
  },
  warning: {
    bg: "bg-yellow-50 dark:bg-yellow-900/20",
    text: "text-yellow-600 dark:text-yellow-400",
    border: "border-yellow-100 dark:border-yellow-900/50",
  },
  loading: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-100 dark:border-blue-900/50",
  },
};

export function ResultCard({
  status,
  title,
  description,
  icon: Icon,
  primaryAction,
  secondaryAction,
  className,
}: ResultCardProps) {
  const styles = statusConfig[status];

  return (
    <div className={cn("flex min-h-[50vh] items-center justify-center p-4", className)}>
      <Card className="w-full max-w-md overflow-hidden border-2 shadow-lg">
        <div className={cn("flex justify-center py-8", styles.bg, styles.border)}>
          <div className={cn("rounded-full p-4 ring-8 ring-white dark:ring-background", styles.bg)}>
            {Icon && <Icon className={cn("h-12 w-12", styles.text)} />}
          </div>
        </div>
        <CardHeader className="text-center pb-2">
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          {description && <p className="text-muted-foreground">{description}</p>}
        </CardHeader>
        <CardFooter className="flex flex-col gap-2 pt-6">
          {primaryAction && (
            <Button 
              className="w-full" 
              size="lg" 
              onClick={primaryAction.onClick}
              disabled={primaryAction.loading}
            >
              {primaryAction.label}
            </Button>
          )}
          {secondaryAction && (
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
