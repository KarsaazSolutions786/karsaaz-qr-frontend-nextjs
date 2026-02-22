'use client';

import { useState } from 'react';
import { CheckCircle2, Shield } from 'lucide-react';
import PreviewHeader from '@/components/public/shared/PreviewHeader';
import PreviewFooter from '@/components/public/shared/PreviewFooter';
import SocialShare from '@/components/public/shared/SocialShare';
import QRCodeBadge from '@/components/public/shared/QRCodeBadge';
import FormDisplay from './FormDisplay';
import { LeadForm } from '@/types/entities/lead-form';
import { isSafeUrl } from '@/lib/utils/dom-safety';

interface FormPreviewProps {
  form: LeadForm;
}

export default function FormPreview({ form }: FormPreviewProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleSubmitSuccess = () => {
    setIsSubmitted(true);
    
    // Scroll to top to show success message
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Redirect if configured
    if (form.settings.redirectUrl && isSafeUrl(form.settings.redirectUrl)) {
      setTimeout(() => {
        window.location.href = form.settings.redirectUrl!;
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Header with Share */}
      <PreviewHeader
        title={form.name}
        subtitle={form.description || undefined}
        actions={
          <SocialShare
            url={currentUrl}
            title={form.name}
            description={form.description || `Fill out this form to connect with us`}
            size="md"
          />
        }
      />

      <main className="flex-1 pb-16">
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          {isSubmitted ? (
            // Success State
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 md:p-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {form.settings.successMessage || 'Thank You!'}
              </h2>
              
              <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                Your submission has been received. We'll get back to you soon.
              </p>

              {form.settings.redirectUrl && (
                <p className="text-sm text-gray-500">
                  Redirecting you shortly...
                </p>
              )}
            </div>
          ) : (
            // Form State
            <div className="space-y-6">
              {/* Form Header Card */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl shadow-xl p-8 md:p-12 text-white">
                <h1 className="text-4xl font-bold mb-4">{form.name}</h1>
                {form.description && (
                  <p className="text-xl text-blue-50 leading-relaxed">
                    {form.description}
                  </p>
                )}
                
                {/* Trust Indicators */}
                <div className="mt-8 flex items-center gap-2 text-blue-100">
                  <Shield className="w-5 h-5" />
                  <span className="text-sm">Your information is secure and encrypted</span>
                </div>
              </div>

              {/* Form Card */}
              <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 md:p-12">
                <FormDisplay form={form} onSuccess={handleSubmitSuccess} />
              </div>

              {/* Privacy Policy Footer */}
              <div className="text-center text-sm text-gray-600">
                <p>
                  By submitting this form, you agree to our{' '}
                  <a
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    Privacy Policy
                  </a>
                  {' '}and{' '}
                  <a
                    href="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    Terms of Service
                  </a>
                </p>
              </div>

              {/* Social Proof */}
              {form.responseCount > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
                  <p className="text-gray-700">
                    <span className="font-bold text-blue-600 text-2xl">{form.responseCount.toLocaleString()}</span>
                    <span className="text-gray-600 ml-2">
                      {form.responseCount === 1 ? 'person has' : 'people have'} already submitted this form
                    </span>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <PreviewFooter 
        showCTA={!isSubmitted}
        customLinks={[
          { label: 'Privacy Policy', href: '/privacy' },
          { label: 'Terms of Service', href: '/terms' },
        ]}
      />
      <QRCodeBadge variant="branded" position="bottom-right" />
    </div>
  );
}
