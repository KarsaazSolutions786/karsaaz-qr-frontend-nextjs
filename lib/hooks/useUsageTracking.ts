import { useCallback } from 'react';
import { usageApi } from '@/lib/api/endpoints/usage';

interface TrackingOptions {
  autoTrack?: boolean;
  onError?: (error: Error) => void;
}

export function useUsageTracking(options: TrackingOptions = {}) {
  const { autoTrack = true, onError } = options;

  const trackEvent = useCallback(
    async (eventType: 'qr_created' | 'qr_scanned' | 'qr_downloaded' | 'template_used', data?: Record<string, any>) => {
      if (!autoTrack) return;

      try {
        await usageApi.trackEvent(eventType, data);
      } catch (error) {
        if (onError) {
          onError(error as Error);
        } else {
          console.error('Failed to track usage event:', error);
        }
      }
    },
    [autoTrack, onError]
  );

  const trackQRCreation = useCallback(
    async (qrData: { type: string; id?: string }) => {
      await trackEvent('qr_created', qrData);
    },
    [trackEvent]
  );

  const trackScan = useCallback(
    async (scanData: { qrId: string; location?: string }) => {
      await trackEvent('qr_scanned', scanData);
    },
    [trackEvent]
  );

  const trackDownload = useCallback(
    async (downloadData: { qrId: string; format: string }) => {
      await trackEvent('qr_downloaded', downloadData);
    },
    [trackEvent]
  );

  const trackTemplateUsage = useCallback(
    async (templateData: { templateId: string; name?: string }) => {
      await trackEvent('template_used', templateData);
    },
    [trackEvent]
  );

  return {
    trackQRCreation,
    trackScan,
    trackDownload,
    trackTemplateUsage,
    trackEvent,
  };
}
