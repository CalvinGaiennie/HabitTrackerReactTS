import React, { createContext, useContext, useState, useCallback } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, type: ToastType = "info", duration: number = 3000) => {
      const id = Math.random().toString(36).substring(7);
      const newToast: Toast = { id, message, type, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

function ToastContainer({
  toasts,
  removeToast,
}: {
  toasts: Toast[];
  removeToast: (id: string) => void;
}) {
  return (
    <div
      className="toast-container"
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 10000,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const getToastStyles = () => {
    switch (toast.type) {
      case "success":
        return {
          backgroundColor: "#d1e7dd",
          borderColor: "#badbcc",
          color: "#0f5132",
        };
      case "error":
        return {
          backgroundColor: "#f8d7da",
          borderColor: "#f5c2c7",
          color: "#842029",
        };
      case "warning":
        return {
          backgroundColor: "#fff3cd",
          borderColor: "#ffecb5",
          color: "#664d03",
        };
      default:
        return {
          backgroundColor: "#cff4fc",
          borderColor: "#b6effb",
          color: "#055160",
        };
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return "✓";
      case "error":
        return "✕";
      case "warning":
        return "⚠";
      default:
        return "ℹ";
    }
  };

  return (
    <div
      className="toast-item"
      style={{
        ...getToastStyles(),
        padding: "12px 16px",
        borderRadius: "8px",
        border: "1px solid",
        minWidth: "300px",
        maxWidth: "400px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        animation: "slideIn 0.3s ease-out",
      }}
    >
      <div
        style={{
          fontSize: "18px",
          fontWeight: "bold",
          flexShrink: 0,
        }}
      >
        {getIcon()}
      </div>
      <div style={{ flex: 1, fontSize: "14px", lineHeight: "1.5" }}>{toast.message}</div>
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          fontSize: "18px",
          cursor: "pointer",
          padding: "0",
          lineHeight: "1",
          color: "inherit",
          opacity: 0.7,
        }}
        aria-label="Close"
      >
        ×
      </button>
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
