// useFirebase Hook (T017)
// Wraps firebase-driver for phone OTP auth in components

'use client';

import { useState, useCallback } from 'react';
import { firebaseDriver } from '@/lib/services/firebase-driver';

interface UseFirebaseReturn {
  isInitialized: boolean;
  isSending: boolean;
  isVerifying: boolean;
  error: string | null;
  otpSent: boolean;
  init: (config: { apiKey: string; authDomain: string; projectId: string }) => Promise<void>;
  sendOTP: (phoneNumber: string) => Promise<boolean>;
  verifyOTP: (code: string) => Promise<any>;
  reset: () => void;
}

export function useFirebase(): UseFirebaseReturn {
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);

  const init = useCallback(async (config: { apiKey: string; authDomain: string; projectId: string }) => {
    try {
      await firebaseDriver.init(config);
    } catch (e: any) {
      setError(e.message || 'Failed to initialize Firebase');
    }
  }, []);

  const sendOTP = useCallback(async (phoneNumber: string): Promise<boolean> => {
    setIsSending(true);
    setError(null);
    try {
      await firebaseDriver.sendOTP(phoneNumber);
      setOtpSent(true);
      return true;
    } catch (e: any) {
      setError(e.message || 'Failed to send OTP');
      return false;
    } finally {
      setIsSending(false);
    }
  }, []);

  const verifyOTP = useCallback(async (code: string) => {
    setIsVerifying(true);
    setError(null);
    try {
      const user = await firebaseDriver.verifyOTP(code);
      return user;
    } catch (e: any) {
      setError(e.message || 'Invalid OTP code');
      return null;
    } finally {
      setIsVerifying(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setOtpSent(false);
    firebaseDriver.reset();
  }, []);

  return {
    isInitialized: firebaseDriver.isInitialized,
    isSending,
    isVerifying,
    error,
    otpSent,
    init,
    sendOTP,
    verifyOTP,
    reset,
  };
}
