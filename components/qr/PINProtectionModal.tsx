'use client';

import React, { useState } from 'react';
import { X, Lock, Unlock, Eye, EyeOff, AlertCircle, Check } from 'lucide-react';
import apiClient from '@/lib/api/client';

export interface PINProtectionModalProps {
  qrCodeId: number | string;
  hasPIN: boolean;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type FlowState = 'set' | 'verify' | 'clear';

export function PINProtectionModal({
  qrCodeId,
  hasPIN,
  open,
  onClose,
  onSuccess,
}: PINProtectionModalProps) {
  const initialFlow: FlowState = hasPIN ? 'verify' : 'set';
  const [flow, setFlow] = useState<FlowState>(initialFlow);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const resetForm = () => {
    setPin('');
    setConfirmPin('');
    setError('');
    setShowPin(false);
  };

  const handleSetPIN = async () => {
    if (pin.length < 4 || pin.length > 6) {
      setError('PIN must be 4–6 digits');
      return;
    }
    if (pin !== confirmPin) {
      setError('PINs do not match');
      return;
    }

    setIsProcessing(true);
    setError('');
    try {
      await apiClient.post(`/qrcodes/${qrCodeId}/pin`, { pin });
      resetForm();
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to set PIN');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerifyPIN = async () => {
    if (!pin) {
      setError('Please enter the PIN');
      return;
    }

    setIsProcessing(true);
    setError('');
    try {
      await apiClient.post(`/qrcodes/${qrCodeId}/pin/verify`, { pin });
      resetForm();
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Invalid PIN');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearPIN = async () => {
    setIsProcessing(true);
    setError('');
    try {
      await apiClient.delete(`/qrcodes/${qrCodeId}/pin`);
      resetForm();
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to clear PIN');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (flow === 'set') handleSetPIN();
    else if (flow === 'verify') handleVerifyPIN();
    else if (flow === 'clear') handleClearPIN();
  };

  const title =
    flow === 'set' ? 'Set PIN Protection' :
    flow === 'verify' ? 'Verify PIN' :
    'Clear PIN Protection';

  const description =
    flow === 'set' ? 'Protect access to this QR code with a 4–6 digit PIN.' :
    flow === 'verify' ? 'Enter the current PIN to verify.' :
    'Are you sure you want to remove PIN protection?';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              flow === 'clear' ? 'bg-red-100' : 'bg-blue-100'
            }`}>
              {flow === 'clear' ? (
                <Unlock className="w-5 h-5 text-red-600" />
              ) : (
                <Lock className="w-5 h-5 text-blue-600" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{title}</h2>
              <p className="text-sm text-gray-500">{description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Flow switcher for hasPIN */}
            {hasPIN && flow !== 'set' && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setFlow('verify'); resetForm(); }}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg border-2 font-medium transition ${
                    flow === 'verify'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  Verify PIN
                </button>
                <button
                  type="button"
                  onClick={() => { setFlow('clear'); resetForm(); }}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg border-2 font-medium transition ${
                    flow === 'clear'
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  Clear PIN
                </button>
              </div>
            )}

            {/* Set PIN flow */}
            {flow === 'set' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PIN (4–6 digits)
                  </label>
                  <div className="relative">
                    <input
                      type={showPin ? 'text' : 'password'}
                      value={pin}
                      onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      maxLength={6}
                      placeholder="Enter PIN"
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm PIN
                  </label>
                  <div className="relative">
                    <input
                      type={showPin ? 'text' : 'password'}
                      value={confirmPin}
                      onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      maxLength={6}
                      placeholder="Re-enter PIN"
                      className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 ${
                        confirmPin && pin === confirmPin
                          ? 'border-green-300 focus:ring-green-500'
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    />
                    {confirmPin && pin === confirmPin && (
                      <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Verify PIN flow */}
            {flow === 'verify' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter PIN
                </label>
                <div className="relative">
                  <input
                    type={showPin ? 'text' : 'password'}
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    placeholder="Enter PIN"
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Clear PIN flow */}
            {flow === 'clear' && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">
                  This will permanently remove PIN protection. Anyone with the link will be able
                  to access this QR code&apos;s content.
                </p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                flow === 'clear'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isProcessing
                ? 'Processing...'
                : flow === 'set'
                ? 'Set PIN'
                : flow === 'verify'
                ? 'Verify'
                : 'Clear PIN'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
