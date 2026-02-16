/**
 * Block Registry
 * Central registry for all available block types
 */

import { Link, FileText, Image as ImageIcon, Type, MessageSquare, Video, Music as _Music, GalleryVertical, Minus, HelpCircle, List, Share2, Mail, MessageCircle as _MessageCircle, User, Code, File } from 'lucide-react';
import { BlockConfig } from './types';

// Import block components
import LinkBlock from './blocks/LinkBlock';
import TextBlock from './blocks/TextBlock';
import ImageBlock from './blocks/ImageBlock';
import TitleBlock from './blocks/TitleBlock';
import ParagraphBlock from './blocks/ParagraphBlock';
import VideoBlock from './blocks/VideoBlock';
import DividerBlock from './blocks/DividerBlock';
import FAQBlock from './blocks/FAQBlock';
import ListBlock from './blocks/ListBlock';
import SocialLinksBlock from './blocks/SocialLinksBlock';
import ShareBlock from './blocks/ShareBlock';
import ContactBlock from './blocks/ContactBlock';
// import AudioBlock from './blocks/AudioBlock';
// import ImageGridBlock from './blocks/ImageGridBlock';
import ProfileBlock from './blocks/ProfileBlock';
import CustomCodeBlock from './blocks/CustomCodeBlock';
import ReviewSitesBlock from './blocks/ReviewSitesBlock';
import PortfolioBlock from './blocks/PortfolioBlock';
import FileBlock from './blocks/FileBlock';

export const BLOCK_CATEGORIES = {
  BASIC: 'basic',
  MEDIA: 'media',
  CONTENT: 'content',
  SOCIAL: 'social',
  BUSINESS: 'business',
  ADVANCED: 'advanced'
} as const;

export const blockRegistry: BlockConfig[] = [
  // Basic Blocks
  {
    type: 'link',
    name: 'Link',
    description: 'Add a clickable link button',
    icon: Link,
    category: BLOCK_CATEGORIES.BASIC,
    component: LinkBlock,
    defaultData: {
      title: '',
      url: '',
      icon: 'link',
      openInNewTab: true
    },
    defaultSettings: {
      visible: true,
      order: 0,
      customClasses: [],
      padding: '1rem',
      margin: '0.5rem 0'
    },
    defaultDesign: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      borderRadius: '8px',
      padding: '1rem',
      margin: '0.5rem 0'
    },
    fieldDefinitions: [
      { name: 'title', label: 'Link Text', type: 'text', required: true, placeholder: 'Click here' },
      { name: 'url', label: 'URL', type: 'url', required: true, placeholder: 'https://example.com' },
      { name: 'icon', label: 'Icon', type: 'select', options: [
        { label: 'Link', value: 'link' },
        { label: 'External Link', value: 'external-link' },
        { label: 'Website', value: 'globe' },
        { label: 'Document', value: 'file' },
        { label: 'None', value: 'none' }
      ]},
      { name: 'openInNewTab', label: 'Open in New Tab', type: 'boolean' }
    ]
  },

  {
    type: 'text',
    name: 'Text',
    description: 'Add a text block',
    icon: FileText,
    category: BLOCK_CATEGORIES.BASIC,
    component: TextBlock,
    defaultData: {
      content: '',
      alignment: 'left'
    },
    defaultSettings: {
      visible: true,
      order: 0,
      customClasses: [],
      padding: '1rem',
      margin: '0.5rem 0'
    },
    defaultDesign: {
      backgroundColor: 'transparent',
      textColor: '#000000',
      borderRadius: '0px',
      padding: '1rem',
      margin: '0.5rem 0'
    },
    fieldDefinitions: [
      { name: 'content', label: 'Content', type: 'textarea', required: true, placeholder: 'Enter your text...' },
      { name: 'alignment', label: 'Alignment', type: 'select', options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' }
      ]},
      { name: 'enableMarkdown', label: 'Enable Markdown', type: 'boolean' }
    ]
  },

  {
    type: 'image',
    name: 'Image',
    description: 'Add a single image',
    icon: ImageIcon,
    category: BLOCK_CATEGORIES.MEDIA,
    component: ImageBlock,
    defaultData: {
      url: '',
      alt: '',
      title: '',
      caption: '',
      link: ''
    },
    defaultSettings: {
      visible: true,
      order: 0,
      customClasses: [],
      padding: '1rem',
      margin: '0.5rem 0'
    },
    defaultDesign: {
      backgroundColor: 'transparent',
      textColor: '#000000',
      borderRadius: '8px',
      padding: '1rem',
      margin: '0.5rem 0'
    },
    fieldDefinitions: [
      { name: 'url', label: 'Image URL', type: 'url', required: true, placeholder: 'https://example.com/image.jpg' },
      { name: 'alt', label: 'Alt Text', type: 'text', placeholder: 'Description for accessibility' },
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'caption', label: 'Caption', type: 'text' },
      { name: 'link', label: 'Link (optional)', type: 'url', placeholder: 'https://example.com' }
    ]
  },

  {
    type: 'title',
    name: 'Title',
    description: 'Add a heading',
    icon: Type,
    category: BLOCK_CATEGORIES.CONTENT,
    component: TitleBlock,
    defaultData: {
      text: '',
      level: 'h2',
      alignment: 'left',
      fontSize: 'medium',
      bold: false,
      italic: false
    },
    defaultSettings: {
      visible: true,
      order: 0,
      customClasses: [],
      padding: '1rem 0',
      margin: '1rem 0 0.5rem 0'
    },
    defaultDesign: {
      backgroundColor: 'transparent',
      textColor: '#000000',
      borderRadius: '0px',
      padding: '0.5rem 0',
      margin: '0.5rem 0'
    },
    fieldDefinitions: [
      { name: 'text', label: 'Title Text', type: 'text', required: true },
      { name: 'level', label: 'Heading Level', type: 'select', options: [
        { label: 'H1 (Main)', value: 'h1' },
        { label: 'H2 (Section)', value: 'h2' },
        { label: 'H3 (Subsection)', value: 'h3' },
        { label: 'H4 (Minor)', value: 'h4' }
      ]},
      { name: 'alignment', label: 'Alignment', type: 'select', options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' }
      ]},
      { name: 'fontSize', label: 'Font Size', type: 'select', options: [
        { label: 'Small', value: 'small' },
        { label: 'Medium', value: 'medium' },
        { label: 'Large', value: 'large' },
        { label: 'Extra Large', value: 'xlarge' }
      ]},
      { name: 'bold', label: 'Bold', type: 'boolean' },
      { name: 'italic', label: 'Italic', type: 'boolean' }
    ]
  },

  {
    type: 'paragraph',
    name: 'Paragraph',
    description: 'Add a paragraph with rich text features',
    icon: MessageSquare,
    category: BLOCK_CATEGORIES.CONTENT,
    component: ParagraphBlock,
    defaultData: {
      text: '',
      alignment: 'left',
      enableHtml: false,
      maxLength: 5000,
      placeholder: 'Enter your paragraph...',
      wordWrap: 'normal' as const,
      lineHeight: 1.6,
      fontSize: '1rem'
    },
    defaultSettings: {
      visible: true,
      order: 0,
      customClasses: [],
      padding: '1rem',
      margin: '0.5rem 0'
    },
    defaultDesign: {
      backgroundColor: 'transparent',
      textColor: '#000000',
      borderRadius: '0px',
      padding: '1rem',
      margin: '0.5rem 0'
    },
    fieldDefinitions: [
      { name: 'text', label: 'Paragraph Text', type: 'textarea', required: true, placeholder: 'Enter your paragraph...' },
      { name: 'alignment', label: 'Text Alignment', type: 'select', options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' }
      ]},
      { name: 'fontSize', label: 'Font Size', type: 'select', options: [
        { label: 'Small (14px)', value: '0.875rem' },
        { label: 'Normal (16px)', value: '1rem' },
        { label: 'Large (18px)', value: '1.125rem' },
        { label: 'Extra Large (20px)', value: '1.25rem' }
      ]},
      { name: 'lineHeight', label: 'Line Spacing', type: 'select', options: [
        { label: 'Compact', value: '1.2' },
        { label: 'Normal', value: '1.4' },
        { label: 'Relaxed', value: '1.6' },
        { label: 'Loose', value: '1.8' }
      ]},
      { name: 'wordWrap', label: 'Word Wrapping', type: 'select', options: [
        { label: 'Normal', value: 'normal' },
        { label: 'Break Word', value: 'break-word' },
        { label: 'Break All', value: 'break-all' }
      ]},
      { name: 'maxLength', label: 'Max Character Limit', type: 'select', options: [
        { label: '500 characters', value: '500' },
        { label: '1,000 characters', value: '1000' },
        { label: '2,000 characters', value: '2000' },
        { label: '5,000 characters', value: '5000' },
        { label: '10,000 characters', value: '10000' }
      ]},
      { name: 'placeholder', label: 'Placeholder Text', type: 'text', placeholder: 'Enter placeholder text...' },
      { name: 'enableHtml', label: 'Enable HTML (Advanced)', type: 'boolean' }
    ]
  },

  {
    type: 'list',
    name: 'List',
    description: 'Create dynamic lists with bullets, numbers, or checklists',
    icon: List,
    category: BLOCK_CATEGORIES.CONTENT,
    component: ListBlock,
    defaultData: {
      type: 'bullet',
      items: [{ id: Date.now().toString(), text: '', checked: false, indentLevel: 0 }],
      bulletIcon: 'disc',
      showRichText: false,
      spacing: 'normal',
      startNumber: 1
    },
    defaultSettings: {
      visible: true,
      order: 0,
      customClasses: [],
      padding: '1rem',
      margin: '0.5rem 0'
    },
    defaultDesign: {
      backgroundColor: 'transparent',
      textColor: '#000000',
      borderRadius: '0px',
      padding: '1rem',
      margin: '0.5rem 0'
    },
    fieldDefinitions: [
      { name: 'type', label: 'List Type', type: 'select', options: [
        { label: 'Bulleted List', value: 'bullet' },
        { label: 'Numbered List', value: 'numbered' },
        { label: 'Checklist', value: 'checklist' }
      ]},
      { name: 'bulletIcon', label: 'Bullet Icon', type: 'select', options: [
        { label: 'Disc (•)', value: 'disc' },
        { label: 'Circle (○)', value: 'circle' },
        { label: 'Square (■)', value: 'square' },
        { label: 'Dash (—)', value: 'dash' },
        { label: 'Star (★)', value: 'star' },
        { label: 'Arrow (→)', value: 'arrow' }
      ]},
      { name: 'spacing', label: 'Item Spacing', type: 'select', options: [
        { label: 'Compact', value: 'compact' },
        { label: 'Normal', value: 'normal' },
        { label: 'Relaxed', value: 'relaxed' }
      ]},
      { name: 'startNumber', label: 'Starting Number', type: 'number' },
      { name: 'showRichText', label: 'Enable Rich Text', type: 'boolean' }
    ]
  },

  {
    type: 'faq',
    name: 'FAQ',
    description: 'Add a frequently asked questions section',
    icon: HelpCircle,
    category: BLOCK_CATEGORIES.CONTENT,
    component: FAQBlock,
    defaultData: {
      items: [],
      allowMultipleOpen: false,
      searchPlaceholder: 'Search FAQs...'
    },
    defaultSettings: {
      visible: true,
      order: 0,
      customClasses: [],
      padding: '1rem',
      margin: '0.5rem 0'
    },
    defaultDesign: {
      backgroundColor: 'transparent',
      textColor: '#000000',
      borderRadius: '8px',
      padding: '1rem',
      margin: '0.5rem 0'
    },
    fieldDefinitions: [
      { name: 'items', label: 'FAQ Items', type: 'array' },
      { name: 'allowMultipleOpen', label: 'Allow Multiple Open Items', type: 'boolean' },
      { name: 'searchPlaceholder', label: 'Search Placeholder', type: 'text', placeholder: 'Search FAQs...' }
    ]
  },

  // Media Blocks
  {
    type: 'video',
    name: 'Video',
    description: 'Embed a video',
    icon: Video,
    category: BLOCK_CATEGORIES.MEDIA,
    component: VideoBlock,
    defaultData: {
      url: '',
      title: '',
      description: '',
      platform: 'youtube' as const,
      autoplay: false,
      controls: true,
      privacyMode: false
    },
    defaultSettings: {
      visible: true,
      order: 0,
      customClasses: [],
      padding: '1rem',
      margin: '0.5rem 0'
    },
    defaultDesign: {
      backgroundColor: 'transparent',
      textColor: '#000000',
      borderRadius: '8px',
      padding: '1rem',
      margin: '0.5rem 0'
    },
    fieldDefinitions: [
      { name: 'url', label: 'Video URL', type: 'url', required: true, placeholder: 'https://youtube.com/watch?v=...' },
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'platform', label: 'Platform', type: 'select', options: [
        { label: 'YouTube', value: 'youtube' },
        { label: 'Vimeo', value: 'vimeo' },
        { label: 'Custom', value: 'custom' }
      ]},
      { name: 'controls', label: 'Show Controls', type: 'boolean' },
      { name: 'autoplay', label: 'Autoplay', type: 'boolean' },
      { name: 'privacyMode', label: 'Privacy Mode (YouTube)', type: 'boolean' }
    ]
  },

  // {
  //   type: 'audio',
  //   name: 'Audio',
  //   description: 'Add an audio player',
  //   icon: Music,
  //   category: BLOCK_CATEGORIES.MEDIA,
  //   component: AudioBlock,
  //   defaultData: {
  //     url: '',
  //     title: '',
  //     artist: '',
  //     cover: '',
  //     autoplay: false,
  //     controls: true
  //   },
  //   defaultSettings: {
  //     visible: true,
  //     order: 0,
  //     customClasses: [],
  //     padding: '1rem',
  //     margin: '0.5rem 0'
  //   },
  //   defaultDesign: {
  //     backgroundColor: '#f9f9f9',
  //     textColor: '#000000',
  //     borderRadius: '8px',
  //     padding: '1rem',
  //     margin: '0.5rem 0'
  //   },
  //   fieldDefinitions: [
  //     { name: 'url', label: 'Audio URL', type: 'url', required: true, placeholder: 'https://example.com/audio.mp3' },
  //     { name: 'title', label: 'Track Title', type: 'text' },
  //     { name: 'artist', label: 'Artist', type: 'text' },
  //     { name: 'cover', label: 'Cover Image', type: 'url', placeholder: 'https://example.com/cover.jpg' },
  //     { name: 'autoplay', label: 'Autoplay', type: 'boolean' }
  //   ]
  // },

  {
    type: 'image-grid',
    name: 'Image Grid',
    description: 'Display multiple images in a grid',
    icon: GalleryVertical,
    category: BLOCK_CATEGORIES.MEDIA,
    component: ImageGridBlock,
    defaultData: {
      images: [],
      columns: 2,
      gap: '1rem'
    },
    defaultSettings: {
      visible: true,
      order: 0,
      customClasses: [],
      padding: '1rem',
      margin: '0.5rem 0'
    },
    defaultDesign: {
      backgroundColor: 'transparent',
      textColor: '#000000',
      borderRadius: '8px',
      padding: '1rem',
      margin: '0.5rem 0'
    },
    fieldDefinitions: [
      // This is a complex block with array items
      // Configuration handled through modal interface
    ]
  },

  // Portfolio Block
  {
    type: 'portfolio',
    name: 'Portfolio',
    description: 'Showcase projects with images, categories, and filtering',
    icon: GalleryVertical,
    category: BLOCK_CATEGORIES.MEDIA,
    component: PortfolioBlock,
    defaultData: {
      title: 'My Portfolio',
      description: 'Showcase of my work and projects',
      projects: [],
      categories: ['Web Development', 'Design', 'Mobile Apps'],
      showSearch: true,
      showFilters: true,
      showTags: true,
      columns: 2,
      layout: 'grid'
    },
    defaultSettings: {
      visible: true,
      order: 0,
      customClasses: [],
      padding: '1rem',
      margin: '0.5rem 0'
    },
    defaultDesign: {
      backgroundColor: 'transparent',
      textColor: '#000000',
      borderRadius: '8px',
      padding: '1rem',
      margin: '0.5rem 0'
    },
    fieldDefinitions: []
  },

  // Social Blocks
  {
    type: 'share',
    name: 'Share',
    description: 'Add social sharing buttons and link sharing',
    icon: Share2,
    category: BLOCK_CATEGORIES.SOCIAL,
    component: ShareBlock,
    defaultData: {
      platforms: ['facebook', 'twitter', 'linkedin', 'whatsapp', 'email'],
      url: '',
      title: 'Share this page',
      description: 'Share this page with your friends and colleagues',
      buttonStyle: 'default',
      showCounts: true,
      showQRCode: true,
      qrCodeSize: 200,
      customMessage: '',
      useWebShareApi: true
    },
    defaultSettings: {
      visible: true,
      order: 0,
      customClasses: [],
      padding: '1.5rem',
      margin: '0.5rem 0'
    },
    defaultDesign: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      borderRadius: '12px',
      padding: '1.5rem',
      margin: '0.5rem 0'
    },
    fieldDefinitions: [
      { name: 'title', label: 'Title', type: 'text', placeholder: 'Share this page' },
      { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Share this page with...' },
      { name: 'customMessage', label: 'Custom Share Message', type: 'textarea', placeholder: 'Optional message for shares' },
      { name: 'url', label: 'Share URL', type: 'url', placeholder: 'Leave empty for current page URL' },
      { name: 'buttonStyle', label: 'Button Style', type: 'select', options: [
        { label: 'Default (Colored)', value: 'default' },
        { label: 'Minimal', value: 'minimal' },
        { label: 'Pill Shaped', value: 'pill' },
        { label: 'Outline', value: 'outline' }
      ]},
      { name: 'showCounts', label: 'Show Share Counts', type: 'boolean' },
      { name: 'showQRCode', label: 'Show QR Code', type: 'boolean' },
      { name: 'qrCodeSize', label: 'QR Code Size', type: 'number', placeholder: '200' },
      { name: 'useWebShareApi', label: 'Use Web Share API', type: 'boolean' }
    ]
  },

  // Profile Block
  {
    type: 'profile',
    name: 'Profile',
    description: 'Professional profile with avatar, bio, and social links',
    icon: User,
    category: BLOCK_CATEGORIES.CONTENT,
    component: ProfileBlock,
    defaultData: {
      name: '',
      bio: '',
      avatar: '',
      title: '',
      company: '',
      website: '',
      location: '',
      verified: false,
      email: '',
      phone: '',
      socialLinks: [],
      customFields: []
    },
    defaultSettings: {
      visible: true,
      order: 0,
      customClasses: [],
      padding: '2rem',
      margin: '0.5rem 0'
    },
    defaultDesign: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      borderRadius: '12px',
      padding: '2rem',
      margin: '0.5rem 0'
    },
    fieldDefinitions: [
      { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'John Doe' },
      { name: 'title', label: 'Title/Position', type: 'text', placeholder: 'Senior Developer' },
      { name: 'company', label: 'Company', type: 'text', placeholder: 'Acme Corp' },
      { name: 'bio', label: 'Bio', type: 'textarea', placeholder: 'Tell us about yourself...' },
      { name: 'avatar', label: 'Avatar URL', type: 'url', placeholder: 'https://example.com/avatar.jpg' },
      { name: 'location', label: 'Location', type: 'text', placeholder: 'San Francisco, CA' },
      { name: 'email', label: 'Email', type: 'email', placeholder: 'john@example.com' },
      { name: 'phone', label: 'Phone', type: 'tel', placeholder: '+1 (555) 123-4567' },
      { name: 'website', label: 'Website', type: 'url', placeholder: 'https://johndoe.com' },
      { name: 'verified', label: 'Verified Badge', type: 'boolean' }
    ]
  },

  // Divider Block
  {
    type: 'divider',
    name: 'Divider',
    description: 'Add a visual section separator',
    icon: Minus,
    category: BLOCK_CATEGORIES.CONTENT,
    component: DividerBlock,
    defaultData: {
      type: 'line' as const,
      thickness: 1,
      color: '#e5e5e5',
      width: 'full' as const,
      label: '',
      icon: 'none',
      marginTop: 1,
      marginBottom: 1
    },
    defaultSettings: {
      visible: true,
      order: 0,
      customClasses: [],
      padding: '0.5rem 0',
      margin: '0.5rem 0'
    },
    defaultDesign: {
      backgroundColor: 'transparent',
      textColor: '#000000',
      borderRadius: '0px',
      padding: '0.5rem 0',
      margin: '0.5rem 0'
    },
    fieldDefinitions: [
      { name: 'type', label: 'Divider Type', type: 'select', options: [
        { label: 'Line', value: 'line' },
        { label: 'Dashed', value: 'dashed' },
        { label: 'Dotted', value: 'dotted' },
        { label: 'Space', value: 'space' }
      ]},
      { name: 'thickness', label: 'Thickness (px)', type: 'number', placeholder: '1' },
      { name: 'width', label: 'Width', type: 'select', options: [
        { label: 'Full Width', value: 'full' },
        { label: 'Large (80%)', value: 'large' },
        { label: 'Medium (60%)', value: 'medium' },
        { label: 'Small (40%)', value: 'small' }
      ]},
      { name: 'color', label: 'Color', type: 'color' },
      { name: 'marginTop', label: 'Margin Top (rem)', type: 'number', placeholder: '1' },
      { name: 'marginBottom', label: 'Margin Bottom (rem)', type: 'number', placeholder: '1' },
      { name: 'label', label: 'Label Text (optional)', type: 'text', placeholder: 'Center label' },
      { name: 'icon', label: 'Icon (optional)', type: 'select', options: [
        { label: 'None', value: 'none' },
        { label: 'Heart', value: 'heart' },
        { label: 'Star', value: 'star' },
        { label: 'Music', value: 'music' },
        { label: 'Camera', value: 'camera' },
        { label: 'Rocket', value: 'rocket' },
        { label: 'Sparkles', value: 'sparkles' },
        { label: 'Zap', value: 'zap' },
        { label: 'Alert Circle', value: 'alert-circle' },
        { label: 'Check Circle', value: 'check-circle' },
        { label: 'Info', value: 'info' }
      ]}
    ]
  },

  // Social Blocks
  {
    type: 'social-links',
    name: 'Social Links',
    description: 'Add multiple social media and contact links',
    icon: Share2,
    category: BLOCK_CATEGORIES.SOCIAL,
    component: SocialLinksBlock,
    defaultData: {
      links: [],
      style: 'icons' as const,
      showPlatformName: false,
      size: 'medium' as const,
      useBrandColors: true,
      customColor: '#6B7280',
      openInNewTab: true
    },
    defaultSettings: {
      visible: true,
      order: 0,
      customClasses: [],
      padding: '1rem',
      margin: '0.5rem 0'
    },
    defaultDesign: {
      backgroundColor: 'transparent',
      textColor: '#000000',
      borderRadius: '8px',
      padding: '1rem',
      margin: '0.5rem 0'
    },
    fieldDefinitions: []
  },

  // Contact Block
  {
    type: 'contact',
    name: 'Contact',
    description: 'Contact form with business hours, map, and multiple contact methods',
    icon: Mail,
    category: BLOCK_CATEGORIES.BUSINESS,
    component: ContactBlock,
    defaultData: {
      methods: [],
      showForm: true,
      formTitle: 'Get In Touch',
      formSubtitle: 'Fill out the form below and we\'ll get back to you as soon as possible.',
      showBusinessHours: false,
      businessHours: [
        { day: 'Monday', open: '09:00', close: '17:00', closed: false },
        { day: 'Tuesday', open: '09:00', close: '17:00', closed: false },
        { day: 'Wednesday', open: '09:00', close: '17:00', closed: false },
        { day: 'Thursday', open: '09:00', close: '17:00', closed: false },
        { day: 'Friday', open: '09:00', close: '17:00', closed: false },
        { day: 'Saturday', open: '09:00', close: '17:00', closed: false },
        { day: 'Sunday', open: '09:00', close: '17:00', closed: false }
      ],
      timezone: 'UTC',
      showMap: false,
      mapUrl: '',
      mapHeight: '300px',
      showResponseTime: true,
      responseTime: 'Within 24 hours',
      requirePhone: false,
      requireSubject: false,
      emailTo: '',
      enableHoneypot: true,
      honeypotField: 'website_url',
      successMessage: 'Thank you! Your message has been sent successfully.',
      errorMessage: 'Sorry, there was an error sending your message. Please try again later.',
      buttonText: 'Send Message',
      privacyText: 'We respect your privacy and will never share your information.'
    },
    defaultSettings: {
      visible: true,
      order: 0,
      customClasses: [],
      padding: '1.5rem',
      margin: '0.5rem 0'
    },
    defaultDesign: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      borderRadius: '12px',
      padding: '1.5rem',
      margin: '0.5rem 0'
    },
    fieldDefinitions: [
      { name: 'emailTo', label: 'Send To Email', type: 'email', required: true },
      { name: 'showForm', label: 'Show Contact Form', type: 'boolean' }
    ]
  },

  // Review Sites Block
  {
    type: 'review-sites',
    name: 'Review Sites',
    description: 'Display customer reviews from multiple platforms with ratings and review counts',
    icon: MessageSquare,
    category: BLOCK_CATEGORIES.BUSINESS,
    component: ReviewSitesBlock,
    defaultData: {
      platforms: [],
      showAverageRating: true,
      showPlatformIcons: true,
      showReviewCount: true,
      showTrustIndicators: true,
      enableReviewCollection: true,
      collectionTitle: 'Share Your Experience',
      collectionSubtitle: 'Your feedback helps us improve and helps others make informed decisions.',
      customReviewUrl: '',
      headerAlignment: 'center',
      columns: 3,
      style: 'cards'
    },
    defaultSettings: {
      visible: true,
      order: 0,
      customClasses: [],
      padding: '1rem',
      margin: '0.5rem 0'
    },
    defaultDesign: {
      backgroundColor: 'transparent',
      textColor: '#000000',
      borderRadius: '8px',
      padding: '1.5rem',
      margin: '0.5rem 0'
    },
    fieldDefinitions: [
      { name: 'showAverageRating', label: 'Show Average Rating', type: 'boolean' },
      { name: 'showTrustIndicators', label: 'Show Trust Indicators', type: 'boolean' },
      { name: 'enableReviewCollection', label: 'Enable Review Collection CTA', type: 'boolean' },
      { name: 'collectionTitle', label: 'Collection Title', type: 'text', placeholder: 'Share Your Experience' },
      { name: 'collectionSubtitle', label: 'Collection Subtitle', type: 'textarea', placeholder: 'Your feedback helps us...' },
      { name: 'customReviewUrl', label: 'Custom Review URL', type: 'url', placeholder: 'https://example.com/leave-review' },
      { name: 'headerAlignment', label: 'Header Alignment', type: 'select', options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' }
      ]},
      { name: 'columns', label: 'Columns', type: 'select', options: [
        { label: '1 Column', value: '1' },
        { label: '2 Columns', value: '2' },
        { label: '3 Columns', value: '3' },
        { label: '4 Columns', value: '4' }
      ]},
      { name: 'style', label: 'Display Style', type: 'select', options: [
        { label: 'Cards', value: 'cards' },
        { label: 'Compact', value: 'compact' },
        { label: 'List', value: 'list' }
      ]}
    ]
  },

  // File Block - Media
  {
    type: 'file',
    name: 'File',
    description: 'Upload and share files with download tracking and previews',
    icon: File,
    category: BLOCK_CATEGORIES.MEDIA,
    component: FileBlock,
    defaultData: {
      files: [],
      title: '',
      description: '',
      showFileSize: true,
      showFileType: true,
      allowMultiple: true,
      downloadTracking: true
    },
    defaultSettings: {
      visible: true,
      order: 0,
      customClasses: [],
      padding: '1rem',
      margin: '0.5rem 0'
    },
    defaultDesign: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      borderRadius: '8px',
      padding: '1rem',
      margin: '0.5rem 0'
    },
    fieldDefinitions: [
      { name: 'title', label: 'Title', type: 'text', placeholder: 'File Downloads' },
      { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Description of the files' },
      { name: 'allowMultiple', label: 'Allow Multiple Files', type: 'boolean' },
      { name: 'showFileSize', label: 'Show File Size', type: 'boolean' },
      { name: 'showFileType', label: 'Show File Type', type: 'boolean' },
      { name: 'downloadTracking', label: 'Track Downloads', type: 'boolean' }
    ]
  },

  // Advanced Blocks
  {
    type: 'custom-code',
    name: 'Custom Code',
    description: 'Add custom HTML, CSS, and JavaScript with sandboxed execution',
    icon: Code,
    category: BLOCK_CATEGORIES.ADVANCED,
    component: CustomCodeBlock,
    defaultData: {
      html: '',
      css: '',
      javascript: '',
      codeType: 'combined',
      showPreview: true,
      autoRun: false,
      enableHtml: true,
      enableCss: true,
      enableJs: false,
      securityWarnings: true,
      sandboxMode: true
    },
    defaultSettings: {
      visible: true,
      order: 0,
      customClasses: [],
      padding: '1rem',
      margin: '0.5rem 0'
    },
    defaultDesign: {
      backgroundColor: 'transparent',
      textColor: '#000000',
      borderRadius: '8px',
      padding: '1rem',
      margin: '0.5rem 0'
    },
    fieldDefinitions: [
      { name: 'html', label: 'HTML Code', type: 'textarea' },
      { name: 'css', label: 'CSS Code', type: 'textarea' },
      { name: 'javascript', label: 'JavaScript Code', type: 'textarea' },
      { name: 'codeType', label: 'Code Type', type: 'select', options: [
        { label: 'Combined (HTML + CSS + JS)', value: 'combined' },
        { label: 'HTML Only', value: 'html' },
        { label: 'CSS Only', value: 'css' },
        { label: 'JavaScript Only', value: 'javascript' }
      ]},
      { name: 'enableJs', label: 'Enable JavaScript', type: 'boolean' },
      { name: 'sandboxMode', label: 'Sandboxed Execution', type: 'boolean' },
      { name: 'securityWarnings', label: 'Show Security Warnings', type: 'boolean' }
    ]
  }
];

// Helper functions

/**
 * Get block configuration by type
 */
export const getBlockConfig = (type: string): BlockConfig | undefined => {
  return blockRegistry.find(block => block.type === type);
};

/**
 * Get all blocks by category
 */
export const getBlocksByCategory = (category: string): BlockConfig[] => {
  return blockRegistry.filter(block => block.category === category);
};

/**
 * Get blocks for the add block menu (sorted by category)
 */
export const getBlocksForMenu = (): BlockConfig[] => {
  // Sort by category order, then by name
  const categoryOrder = [
    BLOCK_CATEGORIES.BASIC,
    BLOCK_CATEGORIES.MEDIA,
    BLOCK_CATEGORIES.CONTENT,
    BLOCK_CATEGORIES.SOCIAL,
    BLOCK_CATEGORIES.BUSINESS,
    BLOCK_CATEGORIES.ADVANCED
  ];

  return [...blockRegistry].sort((a, b) => {
    const aIndex = categoryOrder.indexOf(a.category);
    const bIndex = categoryOrder.indexOf(b.category);
    
    if (aIndex !== bIndex) {
      return aIndex - bIndex;
    }
    
    return a.name.localeCompare(b.name);
  });
};

/**
 * Check if a block type is valid
 */
export const isValidBlockType = (type: string): boolean => {
  return blockRegistry.some(block => block.type === type);
};

/**
 * Create a new block instance with default values
 */
export const createBlock = (type: string): Block => {
  const config = getBlockConfig(type);
  
  if (!config) {
    throw new Error(`Unknown block type: ${type}`);
  }

  return {
    id: generateBlockId(),
    type: type,
    title: config.name,
    content: JSON.parse(JSON.stringify(config.defaultData)), // Deep clone
    settings: JSON.parse(JSON.stringify(config.defaultSettings)),
    design: JSON.parse(JSON.stringify(config.defaultDesign))
  };
};

/**
 * Generate a unique block ID
 */
export const generateBlockId = (): string => {
  return `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Get block category metadata
 */
export const getCategoryMetadata = (category: string) => {
  const metadata = {
    [BLOCK_CATEGORIES.BASIC]: {
      label: 'Basic',
      description: 'Essential building blocks',
      color: 'blue'
    },
    [BLOCK_CATEGORIES.MEDIA]: {
      label: 'Media',
      description: 'Images, videos, and audio',
      color: 'purple'
    },
    [BLOCK_CATEGORIES.CONTENT]: {
      label: 'Content',
      description: 'Text and layout blocks',
      color: 'green'
    },
    [BLOCK_CATEGORIES.SOCIAL]: {
      label: 'Social',
      description: 'Social media and sharing',
      color: 'pink'
    },
    [BLOCK_CATEGORIES.BUSINESS]: {
      label: 'Business',
      description: 'Business and contact info',
      color: 'orange'
    },
    [BLOCK_CATEGORIES.ADVANCED]: {
      label: 'Advanced',
      description: 'Specialized blocks',
      color: 'red'
    }
  };

  return metadata[category as keyof typeof metadata] || metadata[BLOCK_CATEGORIES.BASIC];
};
