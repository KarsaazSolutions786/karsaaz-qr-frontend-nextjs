/**
 * PINProtectionModal Component
 * 
 * Modal for managing PIN protection on QR codes.
 */

'use client';

import React, { useState } from 'react';
import { X, Lock, Unlock, Eye, EyeOff, AlertCircle, Check } from 'lucide-react';
import { validatePIN } from '@/hooks/useQRActions';

export interface PINProtectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'add' | 'remove' | 'update';
  isPinProtected?: boolean;
  onAddPIN?: (pin: string, confirmPin: string, expiresAt?: Date) => Promise<void>;
  onRemovePIN?: (currentPin: string) => Promise<void>;
  onUpdatePIN?: (currentPin: string, newPin: string, confirmNewPin: string) => Promise<void>;
}

export function PINProtectionModal({
  isOpen,
  onClose,
  mode,
  isPinProtected: _isPinProtected = false,
  onAddPIN,
  onRemovePIN,
  onUpdatePIN,
}: PINProtectionModalProps) {
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPins, setShowPins] = useState(false);
  const [expiresEnabled, setExpiresEnabled] = useState(false);
  const [expiresDate, setExpiresDate] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  
  if (!isOpen) return null;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsProcessing(true);
    
    try {
      if (mode === 'add' && onAddPIN) {
        const validation = validatePIN(newPin);
        if (!validation.valid) {
          setError(validation.error || 'Invalid PIN');
          return;
        }
        
        if (newPin !== confirmPin) {
          setError('PINs do not match');
          return;
        }
        
        const expiresAt = expiresEnabled && expiresDate ? new Date(expiresDate) : undefined;
        await onAddPIN(newPin, confirmPin, expiresAt);
      } else if (mode === 'remove' && onRemovePIN) {
        if (!currentPin) {
          setError('Current PIN is required');
          return;
        }
        
        await onRemovePIN(currentPin);
      } else if (mode === 'update' && onUpdatePIN) {
        if (!currentPin) {
          setError('Current PIN is required');
          return;
        }
        
        const validation = validatePIN(newPin);
        if (!validation.valid) {
          setError(validation.error || 'Invalid new PIN');
          return;
        }
        
        if (newPin !== confirmPin) {
          setError('New PINs do not match');
          return;
        }
        
        await onUpdatePIN(currentPin, newPin, confirmPin);
      }
      
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const getTitle = () => {
    switch (mode) {
      case 'add': return 'Add PIN Protection';
      case 'remove': return 'Remove PIN Protection';
      case 'update': return 'Update PIN';
      default: return 'PIN Protection';
    }
  };
  
  const getDescription = () => {
    switch (mode) {
      case 'add': return 'Protect your QR code with a PIN';
      case 'remove': return 'Remove PIN protection from this QR code';
      case 'update': return 'Change your QR code PIN';
      default: return '';
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              mode === 'remove' ? 'bg-red-100' : 'bg-blue-100'
            }`}>
              {mode === 'remove' ? (
                <Unlock className={`w-5 h-5 ${mode === 'remove' ? 'text-red-600' : 'text-blue-600'}`} />
              ) : (
                <Lock className="w-5 h-5 text-blue-600" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{getTitle()}</h2>
              <p className="text-sm text-gray-500">{getDescription()}</p>
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
            {/* Info */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-blue-800">
                  {mode === 'add' && 'Users will need to enter this PIN to access the QR code content.'}
                  {mode === 'remove' && 'Removing PIN protection will make the QR code publicly accessible.'}
                  {mode === 'update' && 'You need to enter your current PIN to set a new one.'}
                </p>
              </div>
            </div>
            
            {/* Current PIN (for remove/update) */}
            {(mode === 'remove' || mode === 'update') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current PIN
                </label>
                <div className="relative">
                  <input
                    type={showPins ? 'text' : 'password'}
                    value={currentPin}
                    onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, ''))}
                    maxLength={8}
                    placeholder="Enter current PIN"
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPins(!showPins)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPins ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}
            
            {/* New PIN (for add/update) */}
            {(mode === 'add' || mode === 'update') && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {mode === 'update' ? 'New PIN' : 'PIN'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPins ? 'text' : 'password'}
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                      maxLength={8}
                      placeholder="Enter 4-8 digit PIN"
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPins(!showPins)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPins ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    PIN must be 4-8 digits
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm {mode === 'update' ? 'New ' : ''}PIN
                  </label>
                  <div className="relative">
                    <input
                      type={showPins ? 'text' : 'password'}
                      value={confirmPin}
                      onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                      maxLength={8}
                      placeholder="Re-enter PIN"
                      className={`
                        w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2
                        ${confirmPin && newPin === confirmPin
                          ? 'border-green-300 focus:ring-green-500'
                          : 'border-gray-300 focus:ring-blue-500'
                        }
                      `}
                    />
                    {confirmPin && newPin === confirmPin && (
                      <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                    )}
                  </div>
                </div>
                
                {/* Expiration (add only) */}
                {mode === 'add' && (
                  <div>
                    <label className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                      <input
                        type="checkbox"
                        checked={expiresEnabled}
                        onChange={(e) => setExpiresEnabled(e.target.checked)}
                        className="rounded"
                      />
                      Set expiration date
                    </label>
                    
                    {expiresEnabled && (
                      <input
                        type="date"
                        value={expiresDate}
                        onChange={(e) => setExpiresDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    )}
                  </div>
                )}
              </>
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
              className={`
                px-4 py-2 text-sm font-medium text-white rounded-lg
                ${mode === 'remove'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-blue-600 hover:bg-blue-700'
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {isProcessing ? 'Processing...' : 
                mode === 'add' ? 'Add PIN' :
                mode === 'remove' ? 'Remove PIN' :
                'Update PIN'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
