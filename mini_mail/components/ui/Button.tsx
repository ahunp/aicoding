import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "outline" | "danger" | "ghost" | "accent" | "success" | "link";
type Size = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantStyles: Record<Variant, string> = {
  primary: "bg-primary-600 text-white hover:bg-primary-700 disabled:bg-primary-300 active:bg-primary-800",
  secondary: "bg-muted text-foreground hover:bg-muted-foreground/20 disabled:opacity-50",
  outline: "border border-border text-foreground hover:bg-muted disabled:opacity-50",
  danger: "bg-danger-500 text-white hover:bg-danger-700 disabled:bg-danger-300",
  ghost: "text-muted-foreground hover:bg-muted disabled:opacity-50",
  accent: "bg-accent-500 text-white hover:bg-accent-600 disabled:bg-accent-300",
  success: "bg-success-500 text-white hover:bg-success-700 disabled:bg-success-300",
  link: "text-primary-600 hover:text-primary-700 underline-offset-2 hover:underline",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
  icon: "h-9 w-9 p-0",
};

export function buttonVariants({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
} = {}) {
  return cn(
    "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 active:scale-[0.97]",
    variantStyles[variant],
    sizeStyles[size],
    className
  );
}

export default function Button({
  className,
  variant = "primary",
  size = "md",
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={buttonVariants({ variant, size, className })}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
