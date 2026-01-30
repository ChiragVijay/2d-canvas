import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Toast as ToastType } from "@/hooks/use-toast";

const toastVariants = cva(
  "pointer-events-auto relative flex w-full items-center justify-between gap-3 overflow-hidden rounded-md border p-4 shadow-lg transition-all animate-in fade-in slide-in-from-bottom-4 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:slide-out-to-right-full",
  {
    variants: {
      variant: {
        default: "border-border bg-card text-card-foreground",
        success:
          "border-[oklch(0.5_0.12_145)] bg-[oklch(0.35_0.08_145)] text-[oklch(0.92_0.03_145)] dark:border-[oklch(0.45_0.1_145)] dark:bg-[oklch(0.25_0.06_145)]",
        error: "border-destructive bg-destructive text-white dark:border-destructive dark:bg-destructive",
        warning:
          "border-[oklch(0.6_0.12_70)] bg-[oklch(0.45_0.1_70)] text-[oklch(0.95_0.02_70)] dark:border-[oklch(0.5_0.1_70)] dark:bg-[oklch(0.35_0.08_70)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof toastVariants> {
  toast: ToastType;
  onDismiss?: (id: string) => void;
}

function Toast({ className, variant, toast, onDismiss, ...props }: ToastProps) {
  const [state, setState] = React.useState<"open" | "closed">("open");

  const handleDismiss = () => {
    setState("closed");
    setTimeout(() => {
      onDismiss?.(toast.id);
    }, 150);
  };

  return (
    <div
      data-state={state}
      className={cn(toastVariants({ variant: toast.variant ?? variant }), className)}
      {...props}
    >
      <div className="flex flex-col gap-1">
        <div className="text-sm font-medium">{toast.title}</div>
        {toast.description && <div className="text-sm opacity-80">{toast.description}</div>}
      </div>
      <button
        onClick={handleDismiss}
        className="shrink-0 rounded-md p-1 opacity-60 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

export { Toast, toastVariants };
