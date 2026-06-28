"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { onToast, type ToastMessage } from "@/lib/toast";

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const styleMap = {
  success: "border-success-500 text-success-700",
  error: "border-danger-500 text-danger-700",
  info: "border-info-500 text-info-700",
  warning: "border-warning-500 text-warning-700",
};

export default function Toaster() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const timersRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    return onToast((t) => {
      setToasts((prev) => [...prev, t]);
      const timer = setTimeout(() => {
        timersRef.current.delete(timer);
        remove(t.id);
      }, t.duration);
      timersRef.current.add(timer);
    });
  }, [remove]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current.clear();
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((t) => {
        const Icon = iconMap[t.type];
        return (
          <div
            key={t.id}
            className={`flex items-center gap-2 rounded-lg border-l-4 bg-surface px-4 py-3 shadow-card animate-slide-in-right ${styleMap[t.type]}`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <p className="text-sm text-foreground">{t.message}</p>
            <button onClick={() => remove(t.id)} className="ml-2 shrink-0 text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
