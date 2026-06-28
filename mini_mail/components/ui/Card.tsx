import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: boolean;
}

export default function Card({
  className,
  padding = true,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-surface shadow-card",
        padding && "p-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
