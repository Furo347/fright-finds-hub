import { toast as sonnerToast } from 'sonner';
import { useCallback } from 'react';

export type ToastOptions = Parameters<typeof sonnerToast>[1] | undefined;

export const toast = (message: string, opts?: ToastOptions) => {
  return sonnerToast(message, opts as any);
};

export function useToast() {
  const show = useCallback((message: string, opts?: ToastOptions) => {
    return toast(message, opts);
  }, []);

  return { toast: show };
}

export default useToast;

