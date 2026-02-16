"use client";

import { useState, useEffect } from 'react';
import { BlockEditorProps } from '../types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';
import { 
  Share2, 
  Copy, 
  Check, 
  X, 
  Mail, 
  Link2,
  ExternalLink,
  Heart,
  MessageCircle,
  Smartphone
} from 'lucide-react';

// Social platform icons
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Share as WhatsApp 
} from 'lucide-react';

/**
 * Share Block
 * Social sharing component with multiple platforms, QR code, and analytics tracking
 */

// Platform configuration
const PLATFORMS = {
  facebook: {
    name: 'Facebook',
    icon: Facebook,
    color: '#1877f2',
    generateUrl: (url: string, text: string) => 
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`
  },
  twitter: {
    name: 'Twitter',
    icon: Twitter,
    color: '#1da1f2',
    generateUrl: (url: string, text: string) => 
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
  },
  linkedin: {
    name: 'LinkedIn',
    icon: Linkedin,
    color: '#0077b5',
    generateUrl: (url: string, text: string) => 
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${encodeURIComponent(text)}`
  },
  whatsapp: {
    name: 'WhatsApp',
    icon: WhatsApp,
    color: '#25d366',
    generateUrl: (url: string, text: string) => 
      `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`
  },
  email: {
    name: 'Email',
    icon: Mail,
    color: '#34495e',
    generateUrl: (url: string, text: string) => 
      `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`
  }
};

type PlatformKey = keyof typeof PLATFORMS;

// Analytics tracking
const trackShareEvent = (platform: string, blockId: string, url: string) => {
  // Track in localStorage for now - in production, this would be an API call
  try {
    const analytics = JSON.parse(localStorage.getItem('share_analytics') || '{}');
    if (!analytics[blockId]) {
      analytics[blockId] = {};
    }
    if (!analytics[blockId][platform]) {
      analytics[blockId][platform] = 0;
    }
    analytics[blockId][platform]++;
    localStorage.setItem('share_analytics', JSON.stringify(analytics));
    
    // Also track as a custom event
    if (typeof window !== 'undefined' && (window as { gtag: (...args: unknown[]) => void }).gtag) {
      (window as { gtag: (...args: unknown[]) => void }).gtag('event', 'share', {
        platform: platform,
        block_id: blockId,
        url: url
      });
    }
  } catch (error) {
    console.error('Failed to track share event:', error);
  }
};

// Get share counts from localStorage
const getShareCounts = (blockId: string) => {
  try {
    const analytics = JSON.parse(localStorage.getItem('share_analytics') || '{}');
    return analytics[blockId] || {};
  } catch (error) {
    console.error('Failed to get share counts:', error);
    return {};
  }
};

// Web Share API support check
const isWebShareSupported = () => {
  return typeof navigator !== 'undefined' && 'share' in navigator;
};

// Clipboard API support check
const isClipboardSupported = () => {
  return typeof navigator !== 'undefined' && 'clipboard' in navigator;
};

export default function ShareBlock({ block, onUpdate, onDelete, isEditing = false }: BlockEditorProps) {
  const { content, design, id } = block;
  const shareContent = content as {
    platforms: PlatformKey[];
    url: string;
    title: string;
    description: string;
    buttonStyle: 'default' | 'minimal' | 'pill' | 'outline';
    showCounts: boolean;
    showQRCode: boolean;
    qrCodeSize: number;
    customMessage: string;
    useWebShareApi: boolean;
  };

  const [copied, setCopied] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [shareCounts, setShareCounts] = useState<Record<string, number>>({});
  const [isQRCodeExpanded, setIsQRCodeExpanded] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  // Load current URL on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(shareContent.url || window.location.href);
      // Load share counts
      setShareCounts(getShareCounts(id));
    }
  }, [shareContent.url, id]);

  // Handle content changes
  const handleContentChange = (field: string, value: string | number | boolean | PlatformKey[]) => {
    onUpdate({
      content: {
        ...shareContent,
        [field]: value
      }
    });
  };

  // Handle design changes
  const handleDesignChange = (field: keyof typeof design, value: string) => {
    onUpdate({
      design: {
        ...design,
        [field]: value
      }
    });
  };

  // Copy to clipboard
  const copyToClipboard = async () => {
    try {
      if (isClipboardSupported()) {
        await navigator.clipboard.writeText(currentUrl);
        setCopyStatus('success');
        setCopied(true);
        toast.success('Link copied to clipboard!');
        
        // Track copy event
        trackShareEvent('copy', id, currentUrl);
        
        setTimeout(() => {
          setCopied(false);
          setCopyStatus('idle');
        }, 2000);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = currentUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        setCopyStatus('success');
        setCopied(true);
        toast.success('Link copied to clipboard!');
        
        setTimeout(() => {
          setCopied(false);
          setCopyStatus('idle');
        }, 2000);
      }
    } catch (error) {
      setCopyStatus('error');
      toast.error('Failed to copy link');
      setTimeout(() => setCopyStatus('idle'), 2000);
    }
  };

  // Handle platform share
  const handlePlatformShare = (platform: PlatformKey) => {
    const text = shareContent.customMessage || shareContent.title || shareContent.description || '';
    
    // Track the share event
    trackShareEvent(platform, id, currentUrl);
    
    // Update local share counts
    setShareCounts(prev => ({
      ...prev,
      [platform]: (prev[platform] || 0) + 1
    }));
    
    // Use Web Share API if enabled and supported
    if (shareContent.useWebShareApi && isWebShareSupported()) {
      const shareData = {
        title: shareContent.title,
        text: shareContent.customMessage || shareContent.description,
        url: currentUrl
      };
      
      navigator.share(shareData).catch((error) => {
        console.log('Web Share API failed, falling back to platform URL:', error);
        openShareWindow(platform, text);
      });
    } else {
      // Fallback to platform-specific URLs
      openShareWindow(platform, text);
    }
  };

  // Open share window or redirect
  const openShareWindow = (platform: PlatformKey, text: string) => {
    const platformConfig = PLATFORMS[platform];
    const shareUrl = platformConfig.generateUrl(currentUrl, text);
    
    if (platform === 'whatsapp' && typeof window !== 'undefined') {
      // WhatsApp mobile deep linking
      window.open(shareUrl, '_self');
    } else if (platform === 'email') {
      window.open(shareUrl, '_self');
    } else {
      // Open in popup window
      const width = 600;
      const height = 400;
      const left = (window.screen.width / 2) - (width / 2);
      const top = (window.screen.height / 2) - (height / 2);
      
      window.open(
        shareUrl,
        `Share on ${platformConfig.name}`,
        `width=${width},height=${height},left=${left},top=${top},toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes`
      );
    }
  };

  // Get button style classes
  const getButtonStyle = (style: string) => {
    switch (style) {
      case 'minimal':
        return 'bg-transparent hover:bg-gray-100 border border-gray-300 text-gray-700';
      case 'pill':
        return 'bg-gray-900 hover:bg-gray-800 text-white rounded-full px-6';
      case 'outline':
        return 'bg-transparent border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white';
      default:
        return 'bg-gray-900 hover:bg-gray-800 text-white';
    }
  };

  // Public view (display mode)
  if (!isEditing) {
    const hasPlatforms = shareContent.platforms && shareContent.platforms.length > 0;
    const hasQRCode = shareContent.showQRCode;
    const showHeader = shareContent.title || shareContent.description;

    return (
      <div 
        className="block-share" 
        style={{ 
          backgroundColor: design.backgroundColor,
          padding: design.padding,
          margin: design.margin,
          borderRadius: design.borderRadius,
        }}
      >
        {/* Share Header */}
        {showHeader && (
          <div className="mb-6 text-center">
            {shareContent.title && (
              <h3 className="text-xl font-semibold mb-2" style={{ color: design.textColor }}>
                {shareContent.title}
              </h3>
            )}
            {shareContent.description && (
              <p className="text-sm" style={{ color: design.textColor, opacity: 0.8 }}>
                {shareContent.description}
              </p>
            )}
          </div>
        )}

        {/* Share Buttons */}
        {hasPlatforms && (
          <div className="flex flex-wrap gap-3 justify-center mb-6">
            {shareContent.platforms.map((platform) => {
              const platformConfig = PLATFORMS[platform];
              const Icon = platformConfig.icon;
              const count = shareContent.showCounts ? shareCounts[platform] || 0 : 0;
              
              return (
                <Button
                  key={platform}
                  onClick={() => handlePlatformShare(platform)}
                  className={`flex items-center gap-2 ${getButtonStyle(shareContent.buttonStyle)}`}
                  style={{
                    backgroundColor: shareContent.buttonStyle === 'default' ? platformConfig.color : undefined,
                  }}
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">
                    {platformConfig.name}
                  </span>
                  {shareContent.showCounts && count > 0 && (
                    <span className="text-xs bg-white bg-opacity-20 px-1.5 py-0.5 rounded-full">
                      {count}
                    </span>
                  )}
                </Button>
              );
            })}
            
            {/* Copy Link Button */}
            <Button
              onClick={copyToClipboard}
              className={`flex items-center gap-2 ${getButtonStyle(shareContent.buttonStyle)}`}
              style={{
                backgroundColor: shareContent.buttonStyle === 'default' ? '#10b981' : undefined,
              }}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              <span className="text-sm font-medium">
                {copied ? 'Copied!' : 'Copy Link'}
              </span>
              {shareContent.showCounts && shareCounts['copy'] > 0 && (
                <span className="text-xs bg-white bg-opacity-20 px-1.5 py-0.5 rounded-full">
                  {shareCounts['copy']}
                </span>
              )}
            </Button>

            {/* Web Share API Button (if supported and multiple platforms are selected) */}
            {shareContent.useWebShareApi && isWebShareSupported() && shareContent.platforms.length > 1 && (
              <Button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: shareContent.title,
                      text: shareContent.customMessage || shareContent.description,
                      url: currentUrl
                    });
                    trackShareEvent('web-share', id, currentUrl);
                  }
                }}
                className={`flex items-center gap-2 ${getButtonStyle(shareContent.buttonStyle)}`}
                style={{
                  backgroundColor: shareContent.buttonStyle === 'default' ? '#8b5cf6' : undefined,
                }}
              >
                <Share2 size={18} />
                <span className="text-sm font-medium">More Options</span>
              </Button>
            )}
          </div>
        )}

        {/* QR Code Section */}
        {hasQRCode && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <button
                onClick={() => setIsQRCodeExpanded(!isQRCodeExpanded)}
                className="flex items-center justify-center gap-2 mx-auto text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Smartphone size={16} />
                {isQRCodeExpanded ? 'Hide QR Code' : 'Scan QR Code to Share'}
                <ExternalLink size={14} />
              </button>
              
              {isQRCodeExpanded && (
                <div className="mt-4 inline-block p-4 bg-white rounded-lg shadow-md">
                  <QRCodeSVG
                    value={currentUrl}
                    size={shareContent.qrCodeSize || 200}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="H"
                    includeMargin={true}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Scan to open on mobile
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Custom Message (if provided) */}
        {shareContent.customMessage && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg text-center">
            <p className="text-sm italic text-gray-600">
              {shareContent.customMessage}
            </p>
          </div>
        )}

        {/* Share via Native Mobile Share (if supported and using mobile) */}
        {shareContent.useWebShareApi && isWebShareSupported() && typeof navigator !== 'undefined' && 'maxTouchPoints' in navigator && (navigator as any).maxTouchPoints > 0 && (
          <div className="mt-4 text-center">
            <Button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: shareContent.title,
                    text: shareContent.customMessage || shareContent.description,
                    url: currentUrl
                  });
                  trackShareEvent('mobile-native', id, currentUrl);
                }
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <MessageCircle size={18} className="mr-2" />
              Share via Phone Apps
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Edit mode
  return (
    <div className="block-editor-share space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Share2 size={20} />
          <h3 className="text-lg font-semibold">Share Block</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <X size={16} />
        </Button>
      </div>

      <div className="space-y-6">
        {/* Header Section */}
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={shareContent.title || ''}
              onChange={(e) => handleContentChange('title', e.target.value)}
              placeholder="Share this page"
            />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={shareContent.description || ''}
              onChange={(e) => handleContentChange('description', e.target.value)}
              placeholder="Share this page with your friends and colleagues"
              rows={2}
            />
          </div>

          <div>
            <Label>Custom Share Message</Label>
            <Textarea
              value={shareContent.customMessage || ''}
              onChange={(e) => handleContentChange('customMessage', e.target.value)}
              placeholder="Optional custom message to include in shares"
              rows={3}
            />
            <p className="text-xs text-muted-foreground mt-1">
              This message will be pre-filled when users share on social platforms
            </p>
          </div>

          <div>
            <Label>Share URL</Label>
            <Input
              value={shareContent.url || ''}
              onChange={(e) => handleContentChange('url', e.target.value)}
              placeholder="Leave empty to use current page URL"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Leave empty to automatically use the current page URL
            </p>
          </div>
        </div>

        {/* Platform Selection */}
        <div>
          <Label>Select Sharing Platforms</Label>
          <div className="grid grid-cols-2 gap-3 mt-2">
            {(Object.keys(PLATFORMS) as PlatformKey[]).map((platform) => {
              const PlatformIcon = PLATFORMS[platform].icon;
              const isSelected = shareContent.platforms?.includes(platform);
              
              return (
                <div
                  key={platform}
                  onClick={() => {
                    const currentPlatforms = shareContent.platforms || [];
                    if (currentPlatforms.includes(platform)) {
                      handleContentChange('platforms', currentPlatforms.filter(p => p !== platform));
                    } else {
                      handleContentChange('platforms', [...currentPlatforms, platform]);
                    }
                  }}
                  className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400 bg-white'
                  }`}
                >
                  <PlatformIcon 
                    size={20} 
                    color={PLATFORMS[platform].color}
                    className={isSelected ? 'opacity-100' : 'opacity-60'}
                  />
                  <span className={`text-sm font-medium ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                    {PLATFORMS[platform].name}
                  </span>
                  {isSelected && <Check size={16} className="ml-auto text-blue-500" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Button Style */}
        <div>
          <Label>Button Style</Label>
          <Select
            value={shareContent.buttonStyle || 'default'}
            onValueChange={(value) => handleContentChange('buttonStyle', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default (Colored)</SelectItem>
              <SelectItem value="minimal">Minimal</SelectItem>
              <SelectItem value="pill">Pill Shaped</SelectItem>
              <SelectItem value="outline">Outline</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* QR Code Settings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Show QR Code</Label>
            <Switch
              checked={shareContent.showQRCode || false}
              onCheckedChange={(checked) => handleContentChange('showQRCode', checked)}
            />
          </div>
          
          {shareContent.showQRCode && (
            <div>
              <Label>QR Code Size (pixels)</Label>
              <Input
                type="number"
                value={shareContent.qrCodeSize || 200}
                onChange={(e) => handleContentChange('qrCodeSize', parseInt(e.target.value) || 200)}
                min="100"
                max="400"
              />
            </div>
          )}
        </div>

        {/* Analytics Settings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Show Share Counts</Label>
              <p className="text-xs text-muted-foreground">
                Display the number of shares for each platform
              </p>
            </div>
            <Switch
              checked={shareContent.showCounts || false}
              onCheckedChange={(checked) => handleContentChange('showCounts', checked)}
            />
          </div>

          {shareContent.showCounts && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Heart size={16} className="text-blue-500" />
                <span className="text-sm font-medium text-blue-900">Share Analytics</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {(Object.keys(shareCounts) as string[]).map((platform) => (
                  <div key={platform} className="flex justify-between">
                    <span className="text-blue-700 capitalize">{platform}:</span>
                    <span className="font-semibold text-blue-900">{shareCounts[platform]}</span>
                  </div>
                ))}
                {Object.keys(shareCounts).length === 0 && (
                  <p className="text-blue-600">No shares yet. Share counts will appear here.</p>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <Label>Use Web Share API</Label>
              <p className="text-xs text-muted-foreground">
                Use native sharing on supported devices
              </p>
              {!isWebShareSupported() && (
                <p className="text-xs text-orange-600 mt-1">
                  ⚠️ Web Share API not supported in this browser
                </p>
              )}
            </div>
            <Switch
              checked={shareContent.useWebShareApi || false}
              onCheckedChange={(checked) => handleContentChange('useWebShareApi', checked)}
              disabled={!isWebShareSupported()}
            />
          </div>
        </div>

        {/* Preview Section */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold mb-3">Preview</h4>
          <div className="border rounded-lg p-4 bg-muted/10">
            <ShareBlock 
              block={{
                ...block,
                settings: { ...block.settings, visible: true }
              }} 
              onUpdate={() => {}} 
              onDelete={() => {}} 
              isEditing={false} 
              isPreview={true}
            />
          </div>
        </div>

        {/* Design Controls */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold mb-3">Design Settings</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Background Color</Label>
                <Input
                  type="color"
                  value={design.backgroundColor || '#ffffff'}
                  onChange={(e) => handleDesignChange('backgroundColor', e.target.value)}
                />
              </div>
              <div>
                <Label>Text Color</Label>
                <Input
                  type="color"
                  value={design.textColor || '#000000'}
                  onChange={(e) => handleDesignChange('textColor', e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Padding</Label>
                <Input
                  value={design.padding || ''}
                  onChange={(e) => handleDesignChange('padding', e.target.value)}
                  placeholder="1rem"
                />
              </div>
              <div>
                <Label>Margin</Label>
                <Input
                  value={design.margin || ''}
                  onChange={(e) => handleDesignChange('margin', e.target.value)}
                  placeholder="0.5rem 0"
                />
              </div>
            </div>
            
            <div>
              <Label>Border Radius</Label>
              <Input
                value={design.borderRadius || ''}
                onChange={(e) => handleDesignChange('borderRadius', e.target.value)}
                placeholder="0.5rem"
              />
            </div>
          </div>
        </div>

        {/* Features Info */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold mb-2">✨ Features Included</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Multiple social platforms (Facebook, Twitter, LinkedIn, WhatsApp, Email)</li>
            <li>• Copy link to clipboard with visual feedback</li>
            <li>• Optional QR code for mobile sharing</li>
            <li>• Share count analytics tracking</li>
            <li>• Customizable button styles</li>
            <li>• Pre-populated share messages</li>
            <li>• Web Share API integration with fallbacks</li>
            <li>• Mobile-optimized sharing experience</li>
            <li>• Share event tracking for analytics</li>
          </ul>
        </div>
      </div>
    </div>
  );
}