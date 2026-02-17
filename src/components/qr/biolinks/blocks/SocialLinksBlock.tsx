"use client";

import { useState, useEffect } from 'react';
import { BlockEditorProps } from '../types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  Share2,
  X,
  GripVertical,
  Plus,
  Trash2,
  Globe,
  Phone,
  MapPin,
  Mail,
} from 'lucide-react';
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Github,
  Dribbble,
  Twitch,
  Apple,
} from 'lucide-react';

// Custom Icons for those missing in lucide-react
const Tiktok = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const Behance = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    <rect width="20" height="14" x="2" y="6" rx="2" />
  </svg>
); // Placeholder, actual Behance logo is complex, using generic layout or better path if available.
// Actually, let's use a more accurate path for Behance if possible, or just a generic one.
// The user just wants it to build. A simplified path is fine. Used a generic one above but let's try to be better if we assume standard shapes.
// Re-defining Behance properly:

const Pinterest = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const Spotify = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M8 14.5c2.5-1 5.5-1 8 0" />
    <path d="M7 11.5c3-1.5 7-1.5 10 0" />
    <path d="M6.5 8.5c3.5-2 7.5-2 11 0" />
  </svg>
);

const Discord = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="9" cy="12" r="1" />
    <circle cx="15" cy="12" r="1" />
    <path d="M7.5 7.5c3.5-1 5.5-1 9 0" />
    <path d="M7 16.5c3.5 1 6.5 1 10 0" />
    <path d="M15.5 17c0 1 1.5 2 2 1" />
    <path d="M8.5 17c0 1-1.5 2-2 1" />
  </svg>
);

const Snapchat = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2a9 9 0 0 1 8.6 6.5c.3.2 2.4.9 2.4 2.5 0 1.2-1.6 1.8-1.6 1.8v3.2s1.7.5 1.7 1.8c0 1.9-2.2 2.2-2.2 2.2s-.5 4-6 4-6-4-6-4-2.2-.3-2.2-2.2c0-1.3 1.7-1.8 1.7-1.8v-3.2s-1.6-.6-1.6-1.8c0-1.6 2.1-2.3 2.4-2.5A9 9 0 0 1 12 2z" />
  </svg>
);

const Whatsapp = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 21l1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
  </svg>
);

const Telegram = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

// Import DnD for reordering
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import {
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Social Platform Configuration
interface SocialPlatform {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  placeholder: string;
  domains: string[];
  validateUrl: (url: string) => boolean;
  formatUrl: (url: string) => string;
}

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  title?: string;
  openInNewTab?: boolean;
}

// Social platforms configuration
const SOCIAL_PLATFORMS: Record<string, SocialPlatform> = {
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    icon: Facebook,
    color: '#1877f2',
    placeholder: 'https://facebook.com/username',
    domains: ['facebook.com', 'www.facebook.com', 'fb.com'],
    validateUrl: (url: string) => {
      try {
        const urlObj = new URL(url);
        return SOCIAL_PLATFORMS.facebook.domains.some(domain =>
          urlObj.hostname.includes(domain)
        ) && urlObj.pathname.length > 1;
      } catch {
        return /^https?:\/\/(www\.)?(facebook|fb)\.com\/[^\/]+$/.test(url);
      }
    },
    formatUrl: (url: string) => {
      if (!url.startsWith('http')) {
        return `https://facebook.com/${url.replace(/^[@\/]/, '')}`;
      }
      return url;
    }
  },
  twitter: {
    id: 'twitter',
    name: 'Twitter / X',
    icon: Twitter,
    color: '#000000',
    placeholder: 'https://twitter.com/username',
    domains: ['twitter.com', 'x.com', 'www.twitter.com', 'www.x.com'],
    validateUrl: (url: string) => {
      try {
        const urlObj = new URL(url);
        return SOCIAL_PLATFORMS.twitter.domains.some(domain =>
          urlObj.hostname.includes(domain)
        ) && urlObj.pathname.length > 1;
      } catch {
        return /^https?:\/\/(www\.)?(twitter|x)\.com\/[^\/]+$/.test(url);
      }
    },
    formatUrl: (url: string) => {
      if (!url.startsWith('http')) {
        return `https://twitter.com/${url.replace(/^[@\/]/, '')}`;
      }
      return url;
    }
  },
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    color: '#E4405F',
    placeholder: 'https://instagram.com/username',
    domains: ['instagram.com', 'www.instagram.com'],
    validateUrl: (url: string) => {
      try {
        const urlObj = new URL(url);
        return SOCIAL_PLATFORMS.instagram.domains.some(domain =>
          urlObj.hostname.includes(domain)
        ) && urlObj.pathname.length > 1;
      } catch {
        return /^https?:\/\/(www\.)?instagram\.com\/[^\/]+$/.test(url);
      }
    },
    formatUrl: (url: string) => {
      if (!url.startsWith('http')) {
        return `https://instagram.com/${url.replace(/^[@\/]/, '')}`;
      }
      return url;
    }
  },
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: Linkedin,
    color: '#0A66C2',
    placeholder: 'https://linkedin.com/in/username',
    domains: ['linkedin.com', 'www.linkedin.com'],
    validateUrl: (url: string) => {
      try {
        const urlObj = new URL(url);
        return SOCIAL_PLATFORMS.linkedin.domains.some(domain =>
          urlObj.hostname.includes(domain)
        ) && (urlObj.pathname.includes('/in/') || urlObj.pathname.includes('/company/'));
      } catch {
        return /^https?:\/\/(www\.)?linkedin\.com\/(in|company)\/[^\/]+$/.test(url);
      }
    },
    formatUrl: (url: string) => {
      if (!url.startsWith('http')) {
        if (url.includes('/')) {
          return `https://linkedin.com/${url}`;
        }
        return `https://linkedin.com/in/${url.replace(/^[@\/]/, '')}`;
      }
      return url;
    }
  },
  youtube: {
    id: 'youtube',
    name: 'YouTube',
    icon: Youtube,
    color: '#FF0000',
    placeholder: 'https://youtube.com/@username',
    domains: ['youtube.com', 'www.youtube.com', 'youtu.be'],
    validateUrl: (url: string) => {
      try {
        const urlObj = new URL(url);
        return SOCIAL_PLATFORMS.youtube.domains.some(domain =>
          urlObj.hostname.includes(domain)
        ) && (urlObj.pathname.includes('/@') || urlObj.pathname.includes('/channel/') || urlObj.pathname.includes('/c/'));
      } catch {
        return /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/(channel\/|c\/|@)?[^\/]+$/.test(url);
      }
    },
    formatUrl: (url: string) => {
      if (!url.startsWith('http')) {
        return `https://youtube.com/@${url.replace(/^[@\/]/, '')}`;
      }
      return url;
    }
  },
  tiktok: {
    id: 'tiktok',
    name: 'TikTok',
    icon: Tiktok,
    color: '#000000',
    placeholder: 'https://tiktok.com/@username',
    domains: ['tiktok.com', 'www.tiktok.com'],
    validateUrl: (url: string) => {
      try {
        const urlObj = new URL(url);
        return SOCIAL_PLATFORMS.tiktok.domains.some(domain =>
          urlObj.hostname.includes(domain)
        ) && urlObj.pathname.length > 1;
      } catch {
        return /^https?:\/\/(www\.)?tiktok\.com\/@[^\/]+$/.test(url);
      }
    },
    formatUrl: (url: string) => {
      if (!url.startsWith('http')) {
        return `https://tiktok.com/@${url.replace(/^[@\/]/, '')}`;
      }
      return url;
    }
  },
  github: {
    id: 'github',
    name: 'GitHub',
    icon: Github,
    color: '#181717',
    placeholder: 'https://github.com/username',
    domains: ['github.com', 'www.github.com'],
    validateUrl: (url: string) => {
      try {
        const urlObj = new URL(url);
        return SOCIAL_PLATFORMS.github.domains.some(domain =>
          urlObj.hostname.includes(domain)
        ) && urlObj.pathname.length > 1;
      } catch {
        return /^https?:\/\/(www\.)?github\.com\/[^\/]+$/.test(url);
      }
    },
    formatUrl: (url: string) => {
      if (!url.startsWith('http')) {
        return `https://github.com/${url.replace(/^[@\/]/, '')}`;
      }
      return url;
    }
  },
  dribbble: {
    id: 'dribbble',
    name: 'Dribbble',
    icon: Dribbble,
    color: '#EA4C89',
    placeholder: 'https://dribbble.com/username',
    domains: ['dribbble.com', 'www.dribbble.com'],
    validateUrl: (url: string) => {
      try {
        const urlObj = new URL(url);
        return SOCIAL_PLATFORMS.dribbble.domains.some(domain =>
          urlObj.hostname.includes(domain)
        ) && urlObj.pathname.length > 1;
      } catch {
        return /^https?:\/\/(www\.)?dribbble\.com\/[^\/]+$/.test(url);
      }
    },
    formatUrl: (url: string) => {
      if (!url.startsWith('http')) {
        return `https://dribbble.com/${url.replace(/^[@\/]/, '')}`;
      }
      return url;
    }
  },
  behance: {
    id: 'behance',
    name: 'Behance',
    icon: Behance,
    color: '#1769FF',
    placeholder: 'https://behance.net/username',
    domains: ['behance.net', 'www.behance.net'],
    validateUrl: (url: string) => {
      try {
        const urlObj = new URL(url);
        return SOCIAL_PLATFORMS.behance.domains.some(domain =>
          urlObj.hostname.includes(domain)
        ) && urlObj.pathname.length > 1;
      } catch {
        return /^https?:\/\/(www\.)?behance\.net\/[^\/]+$/.test(url);
      }
    },
    formatUrl: (url: string) => {
      if (!url.startsWith('http')) {
        return `https://behance.net/${url.replace(/^[@\/]/, '')}`;
      }
      return url;
    }
  },
  pinterest: {
    id: 'pinterest',
    name: 'Pinterest',
    icon: Pinterest,
    color: '#E60023',
    placeholder: 'https://pinterest.com/username',
    domains: ['pinterest.com', 'www.pinterest.com'],
    validateUrl: (url: string) => {
      try {
        const urlObj = new URL(url);
        return SOCIAL_PLATFORMS.pinterest.domains.some(domain =>
          urlObj.hostname.includes(domain)
        ) && urlObj.pathname.length > 1;
      } catch {
        return /^https?:\/\/(www\.)?pinterest\.com\/[^\/]+$/.test(url);
      }
    },
    formatUrl: (url: string) => {
      if (!url.startsWith('http')) {
        return `https://pinterest.com/${url.replace(/^[@\/]/, '')}`;
      }
      return url;
    }
  },
  spotify: {
    id: 'spotify',
    name: 'Spotify',
    icon: Spotify,
    color: '#1DB954',
    placeholder: 'https://open.spotify.com/user/username',
    domains: ['spotify.com', 'open.spotify.com', 'www.spotify.com'],
    validateUrl: (url: string) => {
      try {
        const urlObj = new URL(url);
        return SOCIAL_PLATFORMS.spotify.domains.some(domain =>
          urlObj.hostname.includes(domain)
        ) && urlObj.pathname.includes('/user/');
      } catch {
        return /^https?:\/\/open\.spotify\.com\/user\/[^\/]+$/.test(url);
      }
    },
    formatUrl: (url: string) => {
      if (!url.startsWith('http')) {
        return `https://open.spotify.com/user/${url.replace(/^[@\/]/, '')}`;
      }
      return url;
    }
  },
  apple: {
    id: 'apple',
    name: 'Apple',
    icon: Apple,
    color: '#000000',
    placeholder: 'https://apple.com',
    domains: ['apple.com', 'www.apple.com'],
    validateUrl: (url: string) => {
      try {
        const urlObj = new URL(url);
        return SOCIAL_PLATFORMS.apple.domains.some(domain =>
          urlObj.hostname.includes(domain)
        );
      } catch {
        return /^https?:\/\/(www\.)?apple\.com/.test(url);
      }
    },
    formatUrl: (url: string) => {
      if (!url.startsWith('http')) {
        return `https://apple.com/${url.replace(/^[@\/]/, '')}`;
      }
      return url;
    }
  },
  discord: {
    id: 'discord',
    name: 'Discord',
    icon: Discord,
    color: '#5865F2',
    placeholder: 'https://discord.gg/invite',
    domains: ['discord.gg', 'discord.com', 'www.discord.com'],
    validateUrl: (url: string) => {
      try {
        const urlObj = new URL(url);
        return SOCIAL_PLATFORMS.discord.domains.some(domain =>
          urlObj.hostname.includes(domain)
        ) && (urlObj.pathname.includes('/invite/') || urlObj.pathname.includes('/gg/'));
      } catch {
        return /^https?:\/\/(www\.)?(discord\.gg|discord\.com\/invite)\/[^\/]+$/.test(url);
      }
    },
    formatUrl: (url: string) => {
      if (!url.startsWith('http')) {
        return `https://discord.gg/${url.replace(/^[@\/]/, '')}`;
      }
      return url;
    }
  },
  twitch: {
    id: 'twitch',
    name: 'Twitch',
    icon: Twitch,
    color: '#9146FF',
    placeholder: 'https://twitch.tv/username',
    domains: ['twitch.tv', 'www.twitch.tv'],
    validateUrl: (url: string) => {
      try {
        const urlObj = new URL(url);
        return SOCIAL_PLATFORMS.twitch.domains.some(domain =>
          urlObj.hostname.includes(domain)
        ) && urlObj.pathname.length > 1;
      } catch {
        return /^https?:\/\/(www\.)?twitch\.tv\/[^\/]+$/.test(url);
      }
    },
    formatUrl: (url: string) => {
      if (!url.startsWith('http')) {
        return `https://twitch.tv/${url.replace(/^[@\/]/, '')}`;
      }
      return url;
    }
  },
  snapchat: {
    id: 'snapchat',
    name: 'Snapchat',
    icon: Snapchat,
    color: '#FFFC00',
    placeholder: 'https://snapchat.com/add/username',
    domains: ['snapchat.com', 'www.snapchat.com'],
    validateUrl: (url: string) => {
      try {
        const urlObj = new URL(url);
        return SOCIAL_PLATFORMS.snapchat.domains.some(domain =>
          urlObj.hostname.includes(domain)
        ) && urlObj.pathname.includes('/add/');
      } catch {
        return /^https?:\/\/(www\.)?snapchat\.com\/add\/[^\/]+$/.test(url);
      }
    },
    formatUrl: (url: string) => {
      if (!url.startsWith('http')) {
        return `https://snapchat.com/add/${url.replace(/^[@\/]/, '')}`;
      }
      return url;
    }
  },
  whatsapp: {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: Whatsapp,
    color: '#25D366',
    placeholder: 'https://wa.me/phone-number',
    domains: ['wa.me', 'www.wa.me', 'whatsapp.com'],
    validateUrl: (url: string) => {
      try {
        const urlObj = new URL(url);
        return SOCIAL_PLATFORMS.whatsapp.domains.some(domain =>
          urlObj.hostname.includes(domain)
        );
      } catch {
        return /^https?:\/\/(www\.)?(wa\.me|whatsapp\.com).*$/.test(url);
      }
    },
    formatUrl: (url: string) => {
      if (!url.startsWith('http')) {
        if (url.match(/^\+?[1-9]\d{1,14}$/)) {
          return `https://wa.me/${url.replace(/\D/g, '')}`;
        }
        return `https://wa.me/${url}`;
      }
      return url;
    }
  },
  telegram: {
    id: 'telegram',
    name: 'Telegram',
    icon: Telegram,
    color: '#0088CC',
    placeholder: 'https://t.me/username',
    domains: ['t.me', 'www.t.me'],
    validateUrl: (url: string) => {
      try {
        const urlObj = new URL(url);
        return SOCIAL_PLATFORMS.telegram.domains.some(domain =>
          urlObj.hostname.includes(domain)
        ) && urlObj.pathname.length > 1;
      } catch {
        return /^https?:\/\/t\.me\/[^\/]+$/.test(url);
      }
    },
    formatUrl: (url: string) => {
      if (!url.startsWith('http')) {
        return `https://t.me/${url.replace(/^[@\/]/, '')}`;
      }
      return url;
    }
  },
  website: {
    id: 'website',
    name: 'Website',
    icon: Globe,
    color: '#6B7280',
    placeholder: 'https://example.com',
    domains: [],
    validateUrl: (url: string) => {
      try {
        new URL(url);
        return true;
      } catch {
        return /^https?:\/\/.+/.test(url);
      }
    },
    formatUrl: (url: string) => {
      if (!url.startsWith('http')) {
        return `https://${url}`;
      }
      return url;
    }
  },
  email: {
    id: 'email',
    name: 'Email',
    icon: Mail,
    color: '#EA4335',
    placeholder: 'email@example.com',
    domains: [],
    validateUrl: (url: string) => {
      return /^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/.test(url) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(url);
    },
    formatUrl: (url: string) => {
      if (url.startsWith('mailto:')) {
        return url;
      }
      return `mailto:${url}`;
    }
  },
  phone: {
    id: 'phone',
    name: 'Phone',
    icon: Phone,
    color: '#10B981',
    placeholder: '+1 (555) 123-4567',
    domains: [],
    validateUrl: (url: string) => {
      return /^tel:\+?\d+$/.test(url) || /^\+?\d+$/.test(url.replace(/[\s\-\(\)]/g, ''));
    },
    formatUrl: (url: string) => {
      const cleaned = url.replace(/[\s\-\(\)]/g, '');
      if (url.startsWith('tel:')) {
        return url;
      }
      return `tel:${cleaned}`;
    }
  },
  location: {
    id: 'location',
    name: 'Location',
    icon: MapPin,
    color: '#F59E0B',
    placeholder: 'Enter address or coordinates',
    domains: [],
    validateUrl: (url: string) => {
      return /^https?:\/\/.*$/.test(url) || url.length > 5;
    },
    formatUrl: (url: string) => {
      if (url.startsWith('http')) {
        return url;
      }
      return `https://maps.google.com?q=${encodeURIComponent(url)}`;
    }
  }
};

// Size configurations
const SIZE_CONFIGS = {
  small: {
    iconSize: 16,
    buttonPadding: '0.5rem',
    fontSize: '0.875rem',
    gridCols: 'repeat(auto-fit, minmax(2rem, 1fr))'
  },
  medium: {
    iconSize: 24,
    buttonPadding: '0.75rem',
    fontSize: '1rem',
    gridCols: 'repeat(auto-fit, minmax(2.5rem, 1fr))'
  },
  large: {
    iconSize: 32,
    buttonPadding: '1rem',
    fontSize: '1.125rem',
    gridCols: 'repeat(auto-fit, minmax(3rem, 1fr))'
  }
};

// Sortable link item component
function SortableLinkItem({
  link,
  platform,
  onUpdate,
  onRemove,
  showOpenInNewTab,
  index
}: {
  link: SocialLink;
  platform: SocialPlatform;
  onUpdate: (id: string, updates: Partial<SocialLink>) => void;
  onRemove: (id: string) => void;
  showOpenInNewTab: boolean;
  index: number;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const IconComponent = platform.icon;
  const [urlError, setUrlError] = useState<string | null>(null);
  const [urlValue, setUrlValue] = useState(link.url);

  useEffect(() => {
    requestAnimationFrame(() => {
      setUrlValue(link.url);
    });
  }, [link.url]);

  const validateAndFormatUrl = (url: string) => {
    if (!url) {
      setUrlError('URL is required');
      return null;
    }

    if (!platform.validateUrl(url)) {
      setUrlError(`Please enter a valid ${platform.name} URL`);
      return null;
    }

    setUrlError(null);
    return platform.formatUrl(url);
  };

  const handleUrlChange = (value: string) => {
    setUrlValue(value);
    const formattedUrl = validateAndFormatUrl(value);
    if (formattedUrl !== null) {
      onUpdate(link.id, { url: formattedUrl });
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
    >
      <div className="flex items-center gap-3 mb-3">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
          <GripVertical size={20} className="text-gray-400" />
        </div>
        <IconComponent size={20} style={{ color: platform.color }} />
        <h4 className="font-medium">{platform.name}</h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(link.id)}
          className="ml-auto text-red-500 hover:text-red-700"
        >
          <Trash2 size={16} />
        </Button>
      </div>

      <div className="space-y-3 pl-8">
        <div>
          <Label>Profile URL</Label>
          <Input
            type="url"
            value={urlValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUrlChange(e.target.value)}
            placeholder={platform.placeholder}
            className={urlError ? 'border-red-500' : ''}
          />
          {urlError && (
            <p className="text-sm text-red-500 mt-1">{urlError}</p>
          )}
        </div>

        <div>
          <Label>Custom Title (Optional)</Label>
          <Input
            type="text"
            value={link.title || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdate(link.id, { title: e.target.value })}
            placeholder={`${platform.name} Profile`}
          />
        </div>

        {showOpenInNewTab && (
          <div className="flex items-center space-x-2">
            <Switch
              checked={link.openInNewTab !== false}
              onCheckedChange={(checked) => onUpdate(link.id, { openInNewTab: checked })}
            />
            <Label>Open in New Tab</Label>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SocialLinksBlock({ block, onUpdate, onDelete, isEditing = false }: BlockEditorProps) {
  // const [isHovered, setIsHovered] = useState(false);
  const [newPlatform, setNewPlatform] = useState('facebook');
  const { content, design } = block;

  const linksContent = content as {
    links: SocialLink[];
    style?: 'icons' | 'buttons' | 'list';
    showPlatformName?: boolean;
    size?: 'small' | 'medium' | 'large';
    useBrandColors?: boolean;
    customColor?: string;
    openInNewTab?: boolean;
  };

  // Handle content changes
  const handleContentChange = (field: string, value: SocialLink[] | string | boolean) => {
    onUpdate({
      content: {
        ...linksContent,
        [field]: value
      }
    });
  };



  // Add a new link
  const addLink = (platformId: string) => {
    const platform = SOCIAL_PLATFORMS[platformId];
    if (!platform) return;

    const newLink: SocialLink = {
      id: `social_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      platform: platformId,
      url: '',
      title: '',
      openInNewTab: linksContent.openInNewTab ?? true
    };

    handleContentChange('links', [...(linksContent.links || []), newLink]);
    setNewPlatform('facebook');
  };

  // Remove a link
  const removeLink = (linkId: string) => {
    const updatedLinks = linksContent.links?.filter(link => link.id !== linkId) || [];
    handleContentChange('links', updatedLinks);
  };

  // Update a link
  const updateLink = (linkId: string, updates: Partial<SocialLink>) => {
    const updatedLinks = linksContent.links?.map(link =>
      link.id === linkId ? { ...link, ...updates } : link
    ) || [];
    handleContentChange('links', updatedLinks);
  };

  // Handle drag end for reordering
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = linksContent.links?.findIndex(link => link.id === active.id) ?? -1;
      const newIndex = linksContent.links?.findIndex(link => link.id === over?.id) ?? -1;

      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedLinks = arrayMove(linksContent.links || [], oldIndex, newIndex);
        handleContentChange('links', reorderedLinks);
      }
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Render public view
  if (!isEditing) {
    if (!linksContent.links || linksContent.links.length === 0) {
      return null;
    }

    const style = linksContent.style || 'icons';
    const size = linksContent.size || 'medium';
    const showPlatformName = linksContent.showPlatformName || false;
    const useBrandColors = linksContent.useBrandColors !== false;
    const customColor = linksContent.customColor || '#6B7280';

    const sizeConfig = SIZE_CONFIGS[size];

    return (
      <div
        className="block-social-links"
        style={{
          backgroundColor: design.backgroundColor,
          padding: design.padding,
          margin: design.margin,
          borderRadius: design.borderRadius,
        }}
      >
        <div
          className={`social-links-${style} grid gap-4 justify-items-center`}
          style={{
            gridTemplateColumns: sizeConfig.gridCols,
          }}
        >
          {linksContent.links.map((link) => {
            const platform = SOCIAL_PLATFORMS[link.platform];
            if (!platform || !link.url) return null;

            const IconComponent = platform.icon;
            const color = useBrandColors ? platform.color : customColor;

            const handleClick = (e: React.MouseEvent) => {
              e.preventDefault();
              window.open(link.url, link.openInNewTab !== false ? '_blank' : '_self', 'noopener,noreferrer');
            };

            if (style === 'icons') {
              return (
                <a
                  key={link.id}
                  href={link.url}
                  onClick={handleClick}
                  title={link.title || platform.name}
                  className="social-link-icon flex items-center justify-center rounded-full text-white transition-all duration-200 no-underline hover:scale-110 hover:opacity-90"
                  style={{
                    width: sizeConfig.iconSize * 2.5,
                    height: sizeConfig.iconSize * 2.5,
                    backgroundColor: color,
                  }}
                >
                  <IconComponent size={sizeConfig.iconSize} />
                </a>
              );
            } else if (style === 'buttons') {
              return (
                <a
                  key={link.id}
                  href={link.url}
                  onClick={handleClick}
                  className="social-link-button flex items-center justify-center rounded-lg text-white no-underline w-full max-w-50 transition-all duration-200 gap-2 hover:scale-[1.02] hover:opacity-90"
                  style={{
                    padding: sizeConfig.buttonPadding,
                    backgroundColor: color,
                    fontSize: sizeConfig.fontSize,
                  }}
                >
                  <IconComponent size={sizeConfig.iconSize} />
                  {showPlatformName && <span>{link.title || platform.name}</span>}
                </a>
              );
            } else {
              // list style
              return (
                <a
                  key={link.id}
                  href={link.url}
                  onClick={handleClick}
                  className="social-link-list-item flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-500/10 no-underline w-full max-w-75 transition-colors duration-200 hover:bg-gray-500/20"
                  style={{
                    color: color,
                    fontSize: sizeConfig.fontSize
                  }}
                >
                  <IconComponent size={sizeConfig.iconSize} style={{ color }} />
                  <span>{link.title || platform.name}</span>
                </a>
              );
            }
          })}
        </div>
      </div>
    );
  }

  // Render editor view
  return (
    <div className="block-editor-social-links space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Share2 size={20} />
          <h3 className="text-lg font-semibold">Social Links Block</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <X size={16} />
        </Button>
      </div>

      {/* Global Settings */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Display Style</Label>
          <Select
            value={linksContent.style || 'icons'}
            onValueChange={(value) => handleContentChange('style', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="icons">Icons Only</SelectItem>
              <SelectItem value="buttons">Icon Buttons</SelectItem>
              <SelectItem value="list">List View</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Size</Label>
          <Select
            value={linksContent.size || 'medium'}
            onValueChange={(value) => handleContentChange('size', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={linksContent.showPlatformName || false}
          onCheckedChange={(checked) => handleContentChange('showPlatformName', checked)}
        />
        <Label>Show Platform Names</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={linksContent.useBrandColors !== false}
          onCheckedChange={(checked) => handleContentChange('useBrandColors', checked)}
        />
        <Label>Use Brand Colors</Label>
      </div>

      {!linksContent.useBrandColors && (
        <div>
          <Label>Custom Color</Label>
          <Input
            type="color"
            value={linksContent.customColor || '#6B7280'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleContentChange('customColor', e.target.value)}
          />
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Switch
          checked={linksContent.openInNewTab !== false}
          onCheckedChange={(checked) => handleContentChange('openInNewTab', checked)}
        />
        <Label>Open All Links in New Tab</Label>
      </div>

      {/* Add New Link */}
      <div className="border-t pt-4">
        <h4 className="text-sm font-semibold mb-3">Add New Link</h4>
        <div className="flex gap-2">
          <Select
            value={newPlatform}
            onValueChange={setNewPlatform}
          >
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(SOCIAL_PLATFORMS).map(([key, platform]) => (
                <SelectItem key={key} value={key}>
                  <div className="flex items-center gap-2">
                    <platform.icon size={16} style={{ color: platform.color }} />
                    {platform.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => addLink(newPlatform)}>
            <Plus size={16} />
            Add
          </Button>
        </div>
      </div>

      {/* Links List - Sortable */}
      {(linksContent.links && linksContent.links.length > 0) && (
        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold mb-3">Social Links ({linksContent.links.length})</h4>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={linksContent.links.map(link => link.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {linksContent.links.map((link, index) => {
                  const platform = SOCIAL_PLATFORMS[link.platform];
                  if (!platform) return null;

                  return (
                    <SortableLinkItem
                      key={link.id}
                      link={link}
                      platform={platform}
                      onUpdate={updateLink}
                      onRemove={removeLink}
                      showOpenInNewTab={false} // Controlled globally
                      index={index}
                    />
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
}