import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

type BadgeVariant =
  | "default" | "success" | "warning" | "danger" | "info"
  | "pending" | "paid" | "shipped" | "delivered" | "cancelled"
  | "bronze" | "silver" | "gold" | "platinum" | "diamond";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-muted text-muted-foreground",
  success: "bg-success-50 text-success-700",
  warning: "bg-warning-50 text-warning-700",
  danger: "bg-danger-50 text-danger-700",
  info: "bg-info-50 text-info-700",
  pending: "bg-warning-50 text-warning-700",
  paid: "bg-info-50 text-info-700",
  shipped: "bg-primary-50 text-primary-700",
  delivered: "bg-success-50 text-success-700",
  cancelled: "bg-danger-50 text-danger-700",
  bronze: "bg-amber-100 text-amber-800",
  silver: "bg-muted text-muted-foreground",
  gold: "bg-warning-50 text-warning-700",
  platinum: "bg-info-50 text-info-700",
  diamond: "bg-purple-100 text-purple-800",
};

export default function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
