import { cn } from "@/lib/utils";
import { InputHTMLAttributes, ReactNode, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-muted-foreground">
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          className={cn(
            "w-full rounded border bg-surface px-3 py-2 text-sm transition-colors",
            "focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500",
            error ? "border-danger-500" : "border-border",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-danger-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
