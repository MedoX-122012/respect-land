"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx)
    throw new Error("useToast must be used within a <Toaster> provider");
  return ctx;
}

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 className="size-4 text-brand-green" />,
  error: <AlertCircle className="size-4 text-red-400" />,
  info: <Info className="size-4 text-brand-lime" />,
};

let idCounter = 0;

export function Toaster({ children }: { children?: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = "success") => {
    idCounter += 1;
    const id = idCounter;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        aria-live="polite"
        className="fixed bottom-5 inset-x-0 z-[100] flex flex-col items-center gap-2 px-4 pointer-events-none"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto flex items-center gap-2.5 rounded-xl border border-brand-border bg-brand-surface px-4 py-3 shadow-2xl shadow-black/40 animate-toast-in max-w-sm w-full sm:w-auto"
          >
            {icons[t.type]}
            <span className="text-sm font-medium text-brand-text">
              {t.message}
            </span>
            <button
              onClick={() =>
                setToasts((prev) => prev.filter((x) => x.id !== t.id))
              }
              className="mr-1 text-brand-muted transition-colors hover:text-brand-text"
              aria-label="إغلاق"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}