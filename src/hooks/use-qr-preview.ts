import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useDebounce } from "./use-debounce";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.100.17:8000/api';

/**
 * QR Preview URL Hook
 * Mirrors legacy QRCodePreviewUrlBuilder.js
 * 
 * Important: The backend expects specific design keys and uses a custom hashCode for caching.
 */
export function useQRPreviewUrl(externalId?: string | number) {
  const { watch } = useFormContext();
  const formData = watch();
  
  // Debounce form data to prevent excessive API calls during rapid changes
  const debouncedFormData = useDebounce(formData, 500);

  const previewUrl = useMemo(() => {
    // Destructure known reserved keys to isolate content fields
    const {
      design,
      id,
      type: formType,
      name,
      logoFile,
      data: explicitData,
      ...rest
    } = debouncedFormData;

    const activeType = formType;
    const activeId = externalId || id;

    // Content is either explicit 'data' or the remaining fields
    const contentData = explicitData || rest;

    // Must have at least a type and some content to preview
    if (!activeType) {
      return null;
    }

    if (Object.keys(contentData).length === 0 && !explicitData) {
      return null;
    }

    // Helper to stringify sub-objects mirroring legacy logic
    const stringifySubObjects = (obj: any) => {
      const result: any = { ...obj };
      for (const key in result) {
        if (typeof result[key] === 'object' && result[key] !== null) {
          result[key] = JSON.stringify(result[key]);
        }
      }
      return result;
    };

    // Prepare parameters for backend
    const paramsObj: any = {
      data: typeof contentData === 'object' ? JSON.stringify(contentData) : contentData,
      type: activeType,
      design: design || {},
      renderText: true,
    };

    if (activeId) {
      paramsObj.id = activeId;
    }

    const finalParams = stringifySubObjects(paramsObj);
    const params = new URLSearchParams(finalParams).toString();

    const hashCode = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash = hash & hash;
      }
      return Math.abs(hash).toString(36);
    };

    const h = hashCode(params);
    const url = `${API_URL}/qrcodes/preview?${params}&h=${h}`;

    return url;
  }, [debouncedFormData, externalId]);

  return previewUrl;
}