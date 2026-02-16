import { ApiError, ValidationError } from '@/lib/error-handler';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export function useApi(options: UseApiOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const call = useCallback(async (apiFunc: () => Promise<any>) => {
    setIsLoading(true);
    setErrors({});

    try {
      const result = await apiFunc();
      if (options.onSuccess) options.onSuccess(result);
      return result;
    } catch (e: any) {
      if (e instanceof ValidationError) {
        const validationErrors = e.errors() as Record<string, string[]>;
        setErrors(validationErrors);
        // Map first error to toast for immediate feedback
        const firstError = Object.values(validationErrors)[0]?.[0];
        if (firstError) toast.error(firstError);
      } else if (e instanceof ApiError) {
        toast.error('An unexpected server error occurred.');
      } else {
        toast.error(e.message || 'Something went wrong.');
      }

      if (options.onError) options.onError(e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  return {
    isLoading,
    errors,
    call,
    setErrors,
  };
}
