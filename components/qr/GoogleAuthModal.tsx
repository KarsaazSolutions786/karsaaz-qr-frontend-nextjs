/**
 * GoogleAuthModal Component
 * 
 * Modal wrapper for Google OAuth authentication flow.
 */

'use client';

import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { GoogleAuthButton } from './GoogleAuthButton';

export interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'signin' | 'signup';
  onSuccess?: (user: any) => void;
  onError?: (error: Error) => void;
}

export function GoogleAuthModal({
  isOpen,
  onClose,
  mode = 'signin',
  onSuccess,
  onError,
}: GoogleAuthModalProps) {
  const [authState, setAuthState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSuccess = async (_credential: string) => {
    setAuthState('loading');
    try {
      // In production, send credential to backend for verification
      // const response = await fetch('/api/auth/google/verify', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ credential }),
      // });
      // const user = await response.json();

      // Simulate success
      setTimeout(() => {
        setAuthState('success');
        const mockUser = {
          id: 'google-user-id',
          email: 'user@example.com',
          name: 'Google User',
        };
        onSuccess?.(mockUser);
        
        // Auto-close after success
        setTimeout(() => {
          onClose();
          setAuthState('idle');
        }, 1500);
      }, 1000);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Authentication failed');
      setAuthState('error');
      setErrorMessage(err.message);
      onError?.(err);
    }
  };

  const handleError = (error: Error) => {
    setAuthState('error');
    setErrorMessage(error.message);
    onError?.(error);
  };

  const handleClose = () => {
    if (authState !== 'loading') {
      onClose();
      // Reset state after close
      setTimeout(() => {
        setAuthState('idle');
        setErrorMessage('');
      }, 300);
    }
  };

  const title = mode === 'signin' ? 'Sign In' : 'Sign Up';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">{title} with Google</h2>
          <button
            type="button"
            onClick={handleClose}
            disabled={authState === 'loading'}
            className="text-gray-400 hover:text-gray-600 transition disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {authState === 'idle' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 text-center">
                {mode === 'signin'
                  ? 'Sign in to your account using Google'
                  : 'Create a new account using Google'}
              </p>
              <GoogleAuthButton
                text={mode === 'signin' ? 'signin_with' : 'signup_with'}
                onSuccess={handleSuccess}
                onError={handleError}
              />
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  By continuing, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          )}

          {authState === 'loading' && (
            <div className="py-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-sm text-gray-600">Authenticating with Google...</p>
            </div>
          )}

          {authState === 'success' && (
            <div className="py-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Success!
              </h3>
              <p className="text-sm text-gray-600">
                {mode === 'signin'
                  ? 'You have successfully signed in.'
                  : 'Your account has been created.'}
              </p>
            </div>
          )}

          {authState === 'error' && (
            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-red-900 mb-1">
                      Authentication Failed
                    </h4>
                    <p className="text-sm text-red-700">{errorMessage}</p>
                  </div>
                </div>
              </div>
              <GoogleAuthButton
                text={mode === 'signin' ? 'signin_with' : 'signup_with'}
                onSuccess={handleSuccess}
                onError={handleError}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        {authState === 'idle' && (
          <div className="px-6 py-4 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              {mode === 'signin' ? (
                <>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
