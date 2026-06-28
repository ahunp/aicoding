export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration: number;
}

type Listener = (toast: ToastMessage) => void;

const listeners = new Set<Listener>();

export function onToast(cb: Listener) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function toast(message: string, type: ToastType = "info", duration = 4000) {
  const msg: ToastMessage = {
    id: Math.random().toString(36).slice(2),
    type,
    message,
    duration,
  };
  listeners.forEach((cb) => cb(msg));
}
