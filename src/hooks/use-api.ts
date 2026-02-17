import { ApiError, ValidationError } from '@/lib/error-handler';
import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';

interface UseApiOptions<T = unknown> {
  onSuccess?: (data: T) => void;
  onError?: (error: unknown) => void;
}

export function useApi<T = unknown>(options: UseApiOptions<T> = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  // Store options in a ref to keep `call` stable across renders
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const call = useCallback(async (apiFunc: () => Promise<T>) => {
    setIsLoading(true);
    setErrors({});

    try {
      const result = await apiFunc();
      optionsRef.current.onSuccess?.(result);
      return result;
    } catch (e: unknown) {
      if (e instanceof ValidationError) {
        const validationErrors = e.errors() as Record<string, string[]>;
        setErrors(validationErrors);
        const firstError = Object.values(validationErrors)[0]?.[0];
        if (firstError) toast.error(firstError);
      } else if (e instanceof ApiError) {
        toast.error('An unexpected server error occurred.');
      } else {
        toast.error((e as Error).message || 'Something went wrong.');
      }

      optionsRef.current.onError?.(e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    errors,
    call,
    setErrors,
  };
}
