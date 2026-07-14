import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ToastContext } from "./ToastContext";

type ToastVariant = "success" | "error" | "info" | "warning";

type Toast = {
  id: string;
  title?: string;
  message: string;
  variant: ToastVariant;
  durationMs: number;
};

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

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timersRef = useRef<Record<string, number>>({});

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timersRef.current[id];
    if (timer) window.clearTimeout(timer);
    delete timersRef.current[id];
  }, []);

  const show = useCallback(
    (variant: ToastVariant, input: ToastInput) => {
      const id = uid();
      const durationMs = input.durationMs ?? 3500;

      const next: Toast = {
        id,
        title: input.title,
        message: input.message,
        variant,
        durationMs,
      };

      setToasts((prev) => [next, ...prev].slice(0, 4));

      timersRef.current[id] = window.setTimeout(() => {
        remove(id);
      }, durationMs);
    },
    [remove],
  );

  const api = useMemo<ToastApi>(
    () => ({
      show,
      success: (message, opts) => show("success", { message, ...opts }),
      error: (message, opts) => show("error", { message, ...opts }),
      info: (message, opts) => show("info", { message, ...opts }),
      warning: (message, opts) => show("warning", { message, ...opts }),
    }),
    [show],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={remove} />
    </ToastContext.Provider>
  );
}

function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div style={toastViewport}>
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          aria-live="polite"
          style={{
            ...toastCard,
            ...variantStyles[t.variant].card,
          }}
        >
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ marginTop: 2, ...variantStyles[t.variant].dot }} />
            <div style={{ minWidth: 0 }}>
              {t.title ? <div style={toastTitle}>{t.title}</div> : null}
              <div style={toastMsg}>{t.message}</div>
            </div>

            <button
              onClick={() => onDismiss(t.id)}
              aria-label="Cerrar"
              style={toastCloseBtn}
              type="button"
            >
              ✕
            </button>
          </div>

          <div
            style={{
              ...toastBar,
              ...variantStyles[t.variant].bar,
              animation: `toastBar ${t.durationMs}ms linear forwards`,
            }}
          />
        </div>
      ))}

      <style>
        {`
          @keyframes toastBar {
            from { transform: scaleX(1); }
            to { transform: scaleX(0); }
          }
        `}
      </style>
    </div>
  );
}

const toastViewport: React.CSSProperties = {
  position: "fixed",
  top: 16,
  right: 16,
  zIndex: 999999,
  display: "flex",
  flexDirection: "column",
  gap: 10,
  width: 360,
  maxWidth: "calc(100vw - 32px)",
  pointerEvents: "none",
};

const toastCard: React.CSSProperties = {
  pointerEvents: "auto",
  background: "rgba(255,255,255,0.92)",
  border: "1px solid rgba(0,0,0,0.08)",
  borderRadius: 16,
  boxShadow: "0 18px 50px rgba(0,0,0,0.18)",
  backdropFilter: "blur(10px)",
  padding: 12,
  overflow: "hidden",
};

const toastTitle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 750,
  letterSpacing: 0.1,
  marginBottom: 2,
};

const toastMsg: React.CSSProperties = {
  fontSize: 13,
  opacity: 0.9,
  lineHeight: 1.35,
  wordBreak: "break-word",
};

const toastCloseBtn: React.CSSProperties = {
  border: "none",
  background: "transparent",
  cursor: "pointer",
  opacity: 0.6,
  fontSize: 14,
  lineHeight: 1,
  padding: "6px 8px",
  borderRadius: 10,
};

const toastBar: React.CSSProperties = {
  height: 3,
  marginTop: 10,
  borderRadius: 999,
  transformOrigin: "left",
};

const variantStyles: Record<
  ToastVariant,
  {
    card: React.CSSProperties;
    dot: React.CSSProperties;
    bar: React.CSSProperties;
  }
> = {
  success: {
    card: { borderColor: "rgba(16,185,129,0.35)" },
    dot: {
      width: 10,
      height: 10,
      borderRadius: 999,
      background: "rgba(16,185,129,0.9)",
      boxShadow: "0 0 0 4px rgba(16,185,129,0.18)",
    },
    bar: { background: "rgba(16,185,129,0.9)" },
  },
  error: {
    card: { borderColor: "rgba(239,68,68,0.35)" },
    dot: {
      width: 10,
      height: 10,
      borderRadius: 999,
      background: "rgba(239,68,68,0.9)",
      boxShadow: "0 0 0 4px rgba(239,68,68,0.18)",
    },
    bar: { background: "rgba(239,68,68,0.9)" },
  },
  info: {
    card: { borderColor: "rgba(59,130,246,0.35)" },
    dot: {
      width: 10,
      height: 10,
      borderRadius: 999,
      background: "rgba(59,130,246,0.9)",
      boxShadow: "0 0 0 4px rgba(59,130,246,0.18)",
    },
    bar: { background: "rgba(59,130,246,0.9)" },
  },
  warning: {
    card: { borderColor: "rgba(245,158,11,0.35)" },
    dot: {
      width: 10,
      height: 10,
      borderRadius: 999,
      background: "rgba(245,158,11,0.9)",
      boxShadow: "0 0 0 4px rgba(245,158,11,0.18)",
    },
    bar: { background: "rgba(245,158,11,0.9)" },
  },
};
