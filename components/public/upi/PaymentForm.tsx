'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface PaymentFormProps {
  merchantName: string;
  vpa: string;
  fixedAmount?: number;
  minAmount?: number;
  maxAmount?: number;
  currency?: string;
  allowCustomAmount?: boolean;
  transactionNote?: string;
  onPaymentInitiate: (amount: number, note: string) => void;
  isProcessing?: boolean;
}

export default function PaymentForm({
  merchantName,
  vpa,
  fixedAmount,
  minAmount = 1,
  maxAmount = 100000,
  currency: _currency = 'INR',
  allowCustomAmount = true,
  transactionNote = '',
  onPaymentInitiate,
  isProcessing = false,
}: PaymentFormProps) {
  const [amount, setAmount] = useState<string>(fixedAmount?.toString() || '');
  const [note, setNote] = useState<string>(transactionNote || '');
  const [errors, setErrors] = useState<{ amount?: string; note?: string }>({});

  const validateAmount = (value: string): boolean => {
    const numValue = parseFloat(value);
    
    if (!value || isNaN(numValue)) {
      setErrors(prev => ({ ...prev, amount: 'Please enter a valid amount' }));
      return false;
    }

    if (numValue < minAmount) {
      setErrors(prev => ({ ...prev, amount: `Minimum amount is ₹${minAmount}` }));
      return false;
    }

    if (numValue > maxAmount) {
      setErrors(prev => ({ ...prev, amount: `Maximum amount is ₹${maxAmount}` }));
      return false;
    }

    setErrors(prev => ({ ...prev, amount: undefined }));
    return true;
  };

  const validateNote = (value: string): boolean => {
    if (value.length > 200) {
      setErrors(prev => ({ ...prev, note: 'Note cannot exceed 200 characters' }));
      return false;
    }

    setErrors(prev => ({ ...prev, note: undefined }));
    return true;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    
    if (value) {
      validateAmount(value);
    } else {
      setErrors(prev => ({ ...prev, amount: undefined }));
    }
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNote(value);
    validateNote(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isAmountValid = validateAmount(amount);
    const isNoteValid = validateNote(note);

    if (isAmountValid && isNoteValid) {
      onPaymentInitiate(parseFloat(amount), note);
    }
  };

  const quickAmounts = [100, 500, 1000, 2000];

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amount Input */}
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-base font-semibold">
            Payment Amount {!fixedAmount && <span className="text-red-500">*</span>}
          </Label>
          
          {fixedAmount ? (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-2 border-green-500">
              <span className="text-2xl font-bold text-gray-900">₹{fixedAmount.toFixed(2)}</span>
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            </div>
          ) : allowCustomAmount ? (
            <>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg font-semibold">₹</span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min={minAmount}
                  max={maxAmount}
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="0.00"
                  className={`pl-8 text-lg font-semibold ${errors.amount ? 'border-red-500' : ''}`}
                  disabled={isProcessing}
                  required
                />
              </div>
              
              {errors.amount && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.amount}</span>
                </div>
              )}

              {/* Quick Amount Buttons */}
              <div className="flex gap-2 flex-wrap">
                {quickAmounts.map((quickAmount) => (
                  <Button
                    key={quickAmount}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setAmount(quickAmount.toString());
                      validateAmount(quickAmount.toString());
                    }}
                    disabled={isProcessing}
                    className="flex-1"
                  >
                    ₹{quickAmount}
                  </Button>
                ))}
              </div>

              <p className="text-xs text-gray-500">
                Min: ₹{minAmount} | Max: ₹{maxAmount.toLocaleString('en-IN')}
              </p>
            </>
          ) : null}
        </div>

        {/* Transaction Note */}
        <div className="space-y-2">
          <Label htmlFor="note" className="text-base font-semibold">
            Transaction Note (Optional)
          </Label>
          <Input
            id="note"
            type="text"
            value={note}
            onChange={handleNoteChange}
            placeholder="e.g., Payment for Order #12345"
            maxLength={200}
            className={errors.note ? 'border-red-500' : ''}
            disabled={isProcessing}
          />
          
          {errors.note && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span>{errors.note}</span>
            </div>
          )}
          
          <p className="text-xs text-gray-500">{note.length}/200 characters</p>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full text-lg font-semibold py-6"
          disabled={isProcessing || (!!errors.amount || !!errors.note)}
        >
          {isProcessing ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Processing...
            </>
          ) : (
            `Pay ₹${amount || '0.00'} to ${merchantName}`
          )}
        </Button>

        {/* UPI ID Display */}
        <div className="text-center pt-2 border-t">
          <p className="text-xs text-gray-500">Paying to UPI ID</p>
          <p className="text-sm font-mono font-semibold text-gray-700 mt-1">{vpa}</p>
        </div>
      </form>
    </Card>
  );
}
