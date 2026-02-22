'use client';

import React, { useState } from 'react';
import {
  X,
  Share2,
  Facebook,
  Twitter,
  MessageCircle,
  Mail,
  Copy,
  Check,
} from 'lucide-react';

export interface ShareModalProps {
  url: string;
  title: string;
  open: boolean;
  onClose: () => void;
}

export function ShareModal({ url, title, open, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = url;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareButtons = [
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600 hover:bg-blue-700',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      name: 'X / Twitter',
      icon: Twitter,
      color: 'bg-sky-500 hover:bg-sky-600',
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-green-600 hover:bg-green-700',
      href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'bg-gray-600 hover:bg-gray-700',
      href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
    },
    {
      name: 'Copy Link',
      icon: copied ? Check : Copy,
      color: copied
        ? 'bg-green-600 hover:bg-green-700'
        : 'bg-indigo-600 hover:bg-indigo-700',
      onClick: handleCopyLink,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-bold text-gray-900">Share</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-1 truncate">{title}</p>
          <p className="text-xs text-gray-400 mb-5 truncate">{url}</p>

          {/* Share Buttons Grid */}
          <div className="grid grid-cols-3 gap-3">
            {shareButtons.map((btn) => {
              const Icon = btn.icon;
              const isLink = 'href' in btn && btn.href;

              if (isLink) {
                return (
                  <a
                    key={btn.name}
                    href={btn.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${btn.color} text-white p-3 rounded-lg transition flex flex-col items-center gap-2`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-medium">{btn.name}</span>
                  </a>
                );
              }

              return (
                <button
                  key={btn.name}
                  type="button"
                  onClick={(btn as any).onClick}
                  className={`${btn.color} text-white p-3 rounded-lg transition flex flex-col items-center gap-2`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">
                    {copied && btn.name === 'Copy Link' ? 'Copied!' : btn.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
