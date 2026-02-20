'use client';

import React, { useState } from 'react';
import apiClient from '@/lib/api/client';

interface CreatePasswordModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreatePasswordModal({ open, onClose, onSuccess }: CreatePasswordModalProps) {
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (password.length < 6) {
      setErrors({ password: ['Password must be at least 6 characters.'] });
      return;
    }
    if (password !== passwordConfirmation) {
      setErrors({ password_confirmation: ['Passwords do not match.'] });
      return;
    }

    setLoading(true);
    try {
      await apiClient.put('/passwordless-auth/preference', {
        preference: 'disabled',
        password,
        password_confirmation: passwordConfirmation,
      });
      setPassword('');
      setPasswordConfirmation('');
      onSuccess();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { errors?: Record<string, string[]> } } };
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ password: ['Failed to set password. Please try again.'] });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900">Create Password</h3>
        <p className="mt-1 text-sm text-gray-600">
          Set a password to switch from passwordless to password-based login.
        </p>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="pwd_password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="pwd_password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              minLength={6}
              required
            />
            {errors.password?.map((err) => (
              <p key={err} className="mt-1 text-xs text-red-600">{err}</p>
            ))}
          </div>
          <div>
            <label htmlFor="pwd_password_confirmation" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              id="pwd_password_confirmation"
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              minLength={6}
              required
            />
            {errors.password_confirmation?.map((err) => (
              <p key={err} className="mt-1 text-xs text-red-600">{err}</p>
            ))}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Set Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
