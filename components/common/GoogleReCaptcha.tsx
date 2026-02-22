'use client';

import React, { useEffect, useRef, useCallback } from 'react';

interface GoogleReCaptchaProps {
  siteKey: string;
  onVerify: (token: string) => void;
  action?: string;
}

declare global {
  interface Window {
    grecaptcha: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
      render: (container: HTMLElement, options: Record<string, unknown>) => number;
    };
    onRecaptchaLoad?: () => void;
  }
}

export function GoogleReCaptcha({
  siteKey,
  onVerify,
  action = 'submit',
}: GoogleReCaptchaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);

  const executeRecaptcha = useCallback(() => {
    if (!window.grecaptcha) return;
    window.grecaptcha.ready(() => {
      window.grecaptcha
        .execute(siteKey, { action })
        .then((token) => {
          onVerify(token);
        })
        .catch(console.error);
    });
  }, [siteKey, action, onVerify]);

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    const existingScript = document.querySelector(
      `script[src*="recaptcha/api.js"]`
    );
    if (existingScript) {
      executeRecaptcha();
      return;
    }

    window.onRecaptchaLoad = () => {
      executeRecaptcha();
    };

    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}&onload=onRecaptchaLoad`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      delete window.onRecaptchaLoad;
    };
  }, [siteKey, executeRecaptcha]);

  return (
    <div
      ref={containerRef}
      className="g-recaptcha"
      data-sitekey={siteKey}
      data-size="invisible"
    />
  );
}
