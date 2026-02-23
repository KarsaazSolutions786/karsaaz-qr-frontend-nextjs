'use client';

import { useState, useCallback, FormEvent } from 'react';
import { ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LeadForm, LeadFormField, ValidationRule } from '@/types/entities/lead-form';
import { submitLeadForm } from '@/lib/api/public-qrcodes';
import QuestionRenderer from '@/components/features/lead-forms/questions/QuestionRenderer';

interface FormDisplayProps {
  form: LeadForm;
  onSuccess: () => void;
}

function validateField(field: LeadFormField, value: unknown): string | null {
  if (
    field.required &&
    (!value ||
      (typeof value === 'string' && !value.trim()) ||
      (Array.isArray(value) && value.length === 0))
  ) {
    return `${field.label} is required`;
  }
  if (!value) return null;

  const validation: ValidationRule | undefined = field.validation;
  if (!validation) return null;

  if (typeof value === 'string') {
    if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Please enter a valid email address';
    }
    if (field.type === 'tel' && !/^[\d\s\-+()]+$/.test(value)) {
      return 'Please enter a valid phone number';
    }
    if (validation.minLength && value.length < validation.minLength) {
      return `${field.label} must be at least ${validation.minLength} characters`;
    }
    if (validation.maxLength && value.length > validation.maxLength) {
      return `${field.label} must be no more than ${validation.maxLength} characters`;
    }
    if (validation.pattern) {
      try {
        if (!new RegExp(validation.pattern).test(value)) {
          return `${field.label} format is invalid`;
        }
      } catch {
        // Invalid regex
      }
    }
  }

  if (field.type === 'number' && typeof value === 'string') {
    const num = parseFloat(value);
    if (isNaN(num)) return 'Please enter a valid number';
    if (validation.min !== undefined && num < validation.min) {
      return `${field.label} must be at least ${validation.min}`;
    }
    if (validation.max !== undefined && num > validation.max) {
      return `${field.label} must be no more than ${validation.max}`;
    }
  }

  return null;
}

export default function FormDisplay({ form, onSuccess }: FormDisplayProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const sortedFields = [...form.fields].sort((a, b) => a.order - b.order);

  const handleChange = useCallback((fieldName: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    setErrors(prev => {
      if (!prev[fieldName]) return prev;
      const next = { ...prev };
      delete next[fieldName];
      return next;
    });
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    sortedFields.forEach(field => {
      const error = validateField(field, formData[field.name]);
      if (error) newErrors[field.name] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await submitLeadForm(form.slug, {
        data: formData,
        fingerprint: generateFingerprint(),
      });
      onSuccess();
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError(error instanceof Error ? error.message : 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {sortedFields.map((field) => (
        <QuestionRenderer
          key={field.id}
          field={field}
          value={formData[field.name] ?? ''}
          onChange={(v) => handleChange(field.name, v)}
          error={errors[field.name]}
        />
      ))}

      {/* Submit Error */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-900 mb-1">Submission Failed</h4>
            <p className="text-sm text-red-700">{submitError}</p>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            {form.settings.submitButtonText || 'Submit'}
            <ArrowRight className="w-5 h-5 ml-2" />
          </>
        )}
      </Button>

      {/* Required Fields Notice */}
      {sortedFields.some(f => f.required) && (
        <p className="text-sm text-gray-500 text-center">
          <span className="text-red-500">*</span> Required fields
        </p>
      )}
    </form>
  );
}

// Generate simple browser fingerprint for duplicate detection
function generateFingerprint(): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('browser fingerprint', 2, 2);
  }
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.colorDepth,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvas.toDataURL(),
  ].join('|');

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  return Math.abs(hash).toString(36);
}
