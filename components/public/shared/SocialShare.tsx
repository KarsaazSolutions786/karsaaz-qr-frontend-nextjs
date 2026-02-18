'use client';

import { useState } from 'react';
import { Share2, Facebook, Twitter, Linkedin, Mail, Link2, Check } from 'lucide-react';

interface SocialShareProps {
  url: string;
  title?: string;
  description?: string;
  className?: string;
  buttonVariant?: 'icon' | 'full';
  size?: 'sm' | 'md' | 'lg';
}

export default function SocialShare({
  url,
  title = 'Check this out!',
  description = '',
  className = '',
  buttonVariant = 'icon',
  size = 'md',
}: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        });
      } catch (error) {
        // User cancelled or error occurred
        setShowMenu(true);
      }
    } else {
      setShowMenu(!showMenu);
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main Share Button */}
      <button
        onClick={handleShare}
        className={`flex items-center justify-center gap-2 ${sizeClasses[size]} rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg`}
        title="Share"
      >
        <Share2 className={iconSizes[size]} />
        {buttonVariant === 'full' && <span>Share</span>}
      </button>

      {/* Share Menu */}
      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50 p-4">
            <div className="text-sm font-semibold text-gray-900 mb-3">
              Share via
            </div>
            
            <div className="space-y-2">
              {/* Facebook */}
              <a
                href={shareLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Facebook className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm text-gray-700">Facebook</span>
              </a>

              {/* Twitter */}
              <a
                href={shareLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
                  <Twitter className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm text-gray-700">Twitter</span>
              </a>

              {/* LinkedIn */}
              <a
                href={shareLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
                  <Linkedin className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm text-gray-700">LinkedIn</span>
              </a>

              {/* Email */}
              <a
                href={shareLinks.email}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm text-gray-700">Email</span>
              </a>

              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors w-full"
              >
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  {copied ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <Link2 className="w-5 h-5 text-white" />
                  )}
                </div>
                <span className="text-sm text-gray-700">
                  {copied ? 'Copied!' : 'Copy Link'}
                </span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
