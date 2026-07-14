import { createContext } from "react";

type ToastVariant = "success" | "error" | "info" | "warning";

type ToastInput = {
  title?: string;
  message: string;
  durationMs?: number;
};

type ToastApi = {
  show: (variant: ToastVariant, input: ToastInput) => void;
  success: (message: string, opts?: Omit<ToastInput, "message">) => void;
  error: (message: string, opts?: Omit<ToastInput, "message">) => void;
  info: (message: string, opts?: Omit<ToastInput, "message">) => void;
  warning: (message: string, opts?: Omit<ToastInput, "message">) => void;
};

export const ToastContext = createContext<ToastApi | null>(null);
