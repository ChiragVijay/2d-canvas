import { useSyncExternalStore } from "react";

export type ToastVariant = "default" | "success" | "error" | "warning";

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
}

type ToastInput = Omit<Toast, "id">;

const TOAST_DURATION = 4000;

let toasts: Toast[] = [];
const listeners: Set<() => void> = new Set();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

export function toast(input: ToastInput): string {
  const id = generateId();
  const newToast: Toast = {
    id,
    variant: "default",
    ...input,
  };

  toasts = [...toasts, newToast];
  emitChange();

  setTimeout(() => {
    dismissToast(id);
  }, TOAST_DURATION);

  return id;
}

export function dismissToast(id: string) {
  toasts = toasts.filter((t) => t.id !== id);
  emitChange();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return toasts;
}

export function useToasts() {
  const currentToasts = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const dismiss = (id: string) => {
    dismissToast(id);
  };

  return { toasts: currentToasts, dismiss };
}
