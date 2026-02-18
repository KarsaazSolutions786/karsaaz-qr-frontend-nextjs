/**
 * TypeConversionModal Component
 * 
 * Modal for converting QR code from one type to another.
 */

'use client';

import React, { useState } from 'react';
import { X, RefreshCw, AlertCircle } from 'lucide-react';

export interface TypeConversionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentType: string;
  currentData: Record<string, any>;
  onConvert: (newType: string, newData: Record<string, any>) => Promise<void>;
}

const QR_TYPES = [
  { value: 'url', label: 'URL', fields: ['url'] },
  { value: 'text', label: 'Text', fields: ['text'] },
  { value: 'email', label: 'Email', fields: ['email', 'subject', 'body'] },
  { value: 'phone', label: 'Phone', fields: ['phone'] },
  { value: 'sms', label: 'SMS', fields: ['phone', 'message'] },
  { value: 'wifi', label: 'WiFi', fields: ['ssid', 'password', 'encryption'] },
  { value: 'vcard', label: 'vCard', fields: ['name', 'phone', 'email', 'organization'] },
  { value: 'location', label: 'Location', fields: ['latitude', 'longitude'] },
];

export function TypeConversionModal({
  isOpen,
  onClose,
  currentType,
  currentData: _currentData,
  onConvert,
}: TypeConversionModalProps) {
  const [selectedType, setSelectedType] = useState(currentType);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState('');
  
  if (!isOpen) return null;
  
  const selectedTypeConfig = QR_TYPES.find(t => t.value === selectedType);
  const canConvert = selectedType !== currentType;
  
  const handleConvert = async () => {
    setIsConverting(true);
    setError('');
    
    try {
      await onConvert(selectedType, formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed');
    } finally {
      setIsConverting(false);
    }
  };
  
  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Convert QR Code Type</h2>
              <p className="text-sm text-gray-500">
                Change from <span className="font-medium">{currentType}</span> to another type
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isConverting}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Warning */}
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-800">Important</p>
                <p className="text-xs text-yellow-700 mt-1">
                  Converting the QR code type will replace the current data. This action cannot be undone.
                  Make sure to save any important information before proceeding.
                </p>
              </div>
            </div>
            
            {/* Current Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Type
              </label>
              <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                <span className="font-medium text-gray-900 capitalize">{currentType}</span>
              </div>
            </div>
            
            {/* New Type Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Convert To
              </label>
              <div className="grid grid-cols-4 gap-2">
                {QR_TYPES.map(type => (
                  <button
                    key={type.value}
                    onClick={() => setSelectedType(type.value)}
                    disabled={type.value === currentType}
                    className={`
                      px-4 py-3 rounded-lg border-2 font-medium text-sm transition-all
                      ${selectedType === type.value
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : type.value === currentType
                        ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Form Fields */}
            {canConvert && selectedTypeConfig && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {selectedTypeConfig.label} Data
                </label>
                <div className="space-y-3">
                  {selectedTypeConfig.fields.map(field => (
                    <div key={field}>
                      <label className="block text-xs text-gray-600 mb-1 capitalize">
                        {field.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      <input
                        type="text"
                        value={formData[field] || ''}
                        onChange={(e) => updateFormData(field, e.target.value)}
                        placeholder={`Enter ${field}`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Error */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            disabled={isConverting}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConvert}
            disabled={!canConvert || isConverting}
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isConverting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Converting...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Convert QR Code</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
