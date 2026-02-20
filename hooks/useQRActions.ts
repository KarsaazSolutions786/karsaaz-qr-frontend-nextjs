/**
 * useQRActions Hook
 * 
 * Hook for managing QR code actions using real API calls.
 * Uses qrcodesAPI endpoints for duplicate, archive, transfer, PIN, etc.
 */

'use client';

import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { qrcodesAPI } from '@/lib/api/endpoints/qrcodes';
import { foldersAPI } from '@/lib/api/endpoints/folders';
import { queryKeys } from '@/lib/query/keys';

export interface DuplicateOptions {
  count?: number;
  includeDesign?: boolean;
  includeSettings?: boolean;
  prefix?: string;
}

export interface ArchiveOptions {
  reason?: string;
}

export interface TransferOptions {
  newOwnerId: string;
  transferDesign?: boolean;
  transferAnalytics?: boolean;
  notifyNewOwner?: boolean;
}

export interface PINProtectionOptions {
  pin: string;
  confirmPin: string;
  expiresAt?: Date;
}

export function useQRActions() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  /** Invalidate QR-related caches after mutations */
  const invalidateQRCaches = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.qrcodes.all }),
      queryClient.invalidateQueries({ queryKey: queryKeys.folders.all }),
    ]);
  }, [queryClient]);

  /**
   * Duplicate / Clone a single QR code
   */
  const duplicateQRCode = useCallback(async (
    qrCodeId: string,
    _options: DuplicateOptions = {}
  ) => {
    setIsProcessing(true);
    setError(null);

    try {
      const cloned = await qrcodesAPI.copy(qrCodeId);
      await invalidateQRCaches();
      return cloned;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to duplicate QR code';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [invalidateQRCaches]);

  /**
   * Bulk duplicate QR codes (sequential copy calls)
   */
  const bulkDuplicateQRCodes = useCallback(async (
    qrCodeIds: string[],
    _options: DuplicateOptions = {}
  ) => {
    setIsProcessing(true);
    setError(null);

    try {
      const results = [];
      for (const id of qrCodeIds) {
        const cloned = await qrcodesAPI.copy(id);
        results.push(cloned);
      }
      await invalidateQRCaches();
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to bulk duplicate QR codes';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [invalidateQRCaches]);

  /**
   * Archive a single QR code
   */
  const archiveQRCode = useCallback(async (
    qrCodeId: string,
    _options: ArchiveOptions = {}
  ): Promise<void> => {
    setIsProcessing(true);
    setError(null);

    try {
      await qrcodesAPI.archive(qrCodeId);
      await invalidateQRCaches();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to archive QR code';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [invalidateQRCaches]);

  /**
   * Bulk archive QR codes
   */
  const bulkArchiveQRCodes = useCallback(async (
    qrCodeIds: string[],
    _options: ArchiveOptions = {}
  ): Promise<void> => {
    setIsProcessing(true);
    setError(null);

    try {
      await Promise.all(qrCodeIds.map(id => qrcodesAPI.archive(id)));
      await invalidateQRCaches();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to bulk archive QR codes';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [invalidateQRCaches]);

  /**
   * Unarchive a single QR code
   */
  const unarchiveQRCode = useCallback(async (
    qrCodeId: string
  ): Promise<void> => {
    setIsProcessing(true);
    setError(null);

    try {
      await qrcodesAPI.unarchive(qrCodeId);
      await invalidateQRCaches();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to unarchive QR code';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [invalidateQRCaches]);

  /**
   * Bulk unarchive QR codes
   */
  const bulkUnarchiveQRCodes = useCallback(async (
    qrCodeIds: string[]
  ): Promise<void> => {
    setIsProcessing(true);
    setError(null);

    try {
      await Promise.all(qrCodeIds.map(id => qrcodesAPI.unarchive(id)));
      await invalidateQRCaches();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to bulk unarchive QR codes';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [invalidateQRCaches]);

  /**
   * Change QR code status (activate/deactivate)
   */
  const changeStatus = useCallback(async (
    qrCodeId: string,
    status: 'active' | 'inactive'
  ): Promise<void> => {
    setIsProcessing(true);
    setError(null);

    try {
      await qrcodesAPI.changeStatus(qrCodeId, status);
      await invalidateQRCaches();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to change QR code status';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [invalidateQRCaches]);

  /**
   * Bulk change status
   */
  const bulkChangeStatus = useCallback(async (
    qrCodeIds: string[],
    status: 'active' | 'inactive'
  ): Promise<void> => {
    setIsProcessing(true);
    setError(null);

    try {
      await Promise.all(qrCodeIds.map(id => qrcodesAPI.changeStatus(id, status)));
      await invalidateQRCaches();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to bulk change status';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [invalidateQRCaches]);

  /**
   * Delete a single QR code
   */
  const deleteQRCode = useCallback(async (
    qrCodeId: string
  ): Promise<void> => {
    setIsProcessing(true);
    setError(null);

    try {
      await qrcodesAPI.delete(qrCodeId);
      await invalidateQRCaches();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete QR code';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [invalidateQRCaches]);

  /**
   * Bulk delete QR codes
   */
  const bulkDeleteQRCodes = useCallback(async (
    qrCodeIds: string[]
  ): Promise<void> => {
    setIsProcessing(true);
    setError(null);

    try {
      await Promise.all(qrCodeIds.map(id => qrcodesAPI.delete(id)));
      await invalidateQRCaches();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to bulk delete QR codes';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [invalidateQRCaches]);

  /**
   * Transfer QR code ownership
   */
  const transferQRCode = useCallback(async (
    qrCodeId: string,
    options: TransferOptions
  ): Promise<void> => {
    setIsProcessing(true);
    setError(null);

    try {
      const { newOwnerId } = options;
      if (!newOwnerId) {
        throw new Error('New owner ID is required');
      }
      await qrcodesAPI.transferOwnership(qrCodeId, newOwnerId);
      await invalidateQRCaches();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to transfer QR code';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [invalidateQRCaches]);

  /**
   * Add PIN protection
   */
  const addPINProtection = useCallback(async (
    qrCodeId: string,
    options: PINProtectionOptions
  ): Promise<void> => {
    setIsProcessing(true);
    setError(null);

    try {
      const { pin, confirmPin } = options;

      const validation = validatePIN(pin);
      if (!validation.valid) {
        throw new Error(validation.error);
      }
      if (pin !== confirmPin) {
        throw new Error('PINs do not match');
      }

      await qrcodesAPI.setPIN(qrCodeId, pin);
      await invalidateQRCaches();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add PIN protection';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [invalidateQRCaches]);

  /**
   * Remove PIN protection
   */
  const removePINProtection = useCallback(async (
    qrCodeId: string,
    _currentPin?: string
  ): Promise<void> => {
    setIsProcessing(true);
    setError(null);

    try {
      await qrcodesAPI.setPIN(qrCodeId, null);
      await invalidateQRCaches();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove PIN protection';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [invalidateQRCaches]);

  /**
   * Update PIN
   */
  const updatePIN = useCallback(async (
    qrCodeId: string,
    _currentPin: string,
    newPin: string,
    confirmNewPin: string
  ): Promise<void> => {
    setIsProcessing(true);
    setError(null);

    try {
      const validation = validatePIN(newPin);
      if (!validation.valid) {
        throw new Error(validation.error);
      }
      if (newPin !== confirmNewPin) {
        throw new Error('New PINs do not match');
      }

      await qrcodesAPI.setPIN(qrCodeId, newPin);
      await invalidateQRCaches();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update PIN';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [invalidateQRCaches]);

  /**
   * Convert QR code type
   */
  const convertQRType = useCallback(async (
    qrCodeId: string,
    newType: string,
    newData: Record<string, unknown>
  ): Promise<void> => {
    setIsProcessing(true);
    setError(null);

    try {
      if (!newType) {
        throw new Error('New QR type is required');
      }
      await qrcodesAPI.changeType(qrCodeId, { type: newType, data: newData });
      await invalidateQRCaches();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to convert QR type';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [invalidateQRCaches]);

  /**
   * Move QR codes to folder
   */
  const moveToFolder = useCallback(async (
    qrCodeIds: string[],
    folderId: string | null
  ): Promise<void> => {
    setIsProcessing(true);
    setError(null);

    try {
      await foldersAPI.moveQRCodes({
        qrcodeIds: qrCodeIds,
        folderId: folderId || '',
      });
      await invalidateQRCaches();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to move QR codes to folder';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [invalidateQRCaches]);

  /**
   * Download QR code image
   */
  const downloadQRCode = useCallback(async (
    qrCodeId: string,
    format: 'png' | 'svg' = 'png',
    filename?: string
  ): Promise<void> => {
    setIsProcessing(true);
    setError(null);

    try {
      const blob = await qrcodesAPI.getImage(qrCodeId, format);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || `qrcode-${qrCodeId}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to download QR code';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  /**
   * Bulk download QR codes as individual files
   */
  const bulkDownloadQRCodes = useCallback(async (
    qrCodeIds: string[],
    format: 'png' | 'svg' = 'png'
  ): Promise<void> => {
    setIsProcessing(true);
    setError(null);

    try {
      for (const id of qrCodeIds) {
        await downloadQRCode(id, format);
        // Small delay between downloads to avoid browser blocking
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to bulk download QR codes';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [downloadQRCode]);

  return {
    // State
    isProcessing,
    error,

    // Duplicate
    duplicateQRCode,
    bulkDuplicateQRCodes,

    // Archive
    archiveQRCode,
    bulkArchiveQRCodes,
    unarchiveQRCode,
    bulkUnarchiveQRCodes,

    // Status
    changeStatus,
    bulkChangeStatus,

    // Delete
    deleteQRCode,
    bulkDeleteQRCodes,

    // Transfer
    transferQRCode,

    // PIN Protection
    addPINProtection,
    removePINProtection,
    updatePIN,

    // Type Conversion
    convertQRType,

    // Folder Management
    moveToFolder,

    // Download
    downloadQRCode,
    bulkDownloadQRCodes,
  };
}

/**
 * Validate PIN format
 */
export function validatePIN(pin: string): { valid: boolean; error?: string } {
  if (!pin) {
    return { valid: false, error: 'PIN is required' };
  }
  if (pin.length < 4) {
    return { valid: false, error: 'PIN must be at least 4 digits' };
  }
  if (pin.length > 8) {
    return { valid: false, error: 'PIN must be at most 8 digits' };
  }
  if (!/^\d+$/.test(pin)) {
    return { valid: false, error: 'PIN must contain only digits' };
  }
  return { valid: true };
}
