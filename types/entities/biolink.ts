// Biolink Entity Types

// Block Types
export type BlockType =
  | 'link'
  | 'text'
  | 'image'
  | 'title'
  | 'social-links'
  | 'video'
  | 'divider'
  | 'contact'
  | 'email'
  | 'phone'
  | 'location'
  | 'embed'
  | 'download'
  | 'payment'
  | 'newsletter'
  | 'faqs'
  | 'vcard'
  | 'lead-form'
  | 'opening-hours'
  | 'table'
  | 'list'
  | 'image-grid'
  | 'audio'
  | 'profile'
  | 'custom-code'
  | 'copyable-data'
  | 'file'
  | 'information-popup'
  | 'paragraph'
  | 'share'
  | 'upi'
  | 'countdown'
  | 'calendar'
  | 'header-banner'
  | 'testimonial'
  | 'carousel'
  | 'map'
  | 'app-download'
  | 'pricing'
  | 'youtube'
  | 'vimeo'
  | 'spotify'
  | 'soundcloud'
  | 'tiktok'
  | 'instagram'
  | 'twitter'

// Base Block Interface
export interface BlockBase {
  id: string
  type: BlockType
  order: number
}

// Specific Block Data Types
export interface LinkBlockData extends BlockBase {
  type: 'link'
  data: {
    url: string
    title: string
    icon?: string
    style?: 'button' | 'card' | 'minimal'
  }
}

export interface TextBlockData extends BlockBase {
  type: 'text'
  data: {
    content: string
    align?: 'left' | 'center' | 'right'
    size?: 'sm' | 'md' | 'lg'
  }
}

export interface ImageBlockData extends BlockBase {
  type: 'image'
  data: {
    url: string
    alt?: string
    link?: string
    caption?: string
  }
}

export interface TitleBlockData extends BlockBase {
  type: 'title'
  data: {
    text: string
    level?: 'h1' | 'h2' | 'h3'
    align?: 'left' | 'center' | 'right'
  }
}

export interface SocialLinksBlockData extends BlockBase {
  type: 'social-links'
  data: {
    links: Array<{
      platform: string
      url: string
      icon: string
    }>
  }
}

export interface VideoBlockData extends BlockBase {
  type: 'video'
  data: {
    url: string // YouTube or Vimeo URL
    title?: string
  }
}

export interface DividerBlockData extends BlockBase {
  type: 'divider'
  data: {
    style?: 'solid' | 'dashed' | 'dotted'
    color?: string
  }
}

export interface ContactBlockData extends BlockBase {
  type: 'contact'
  data: {
    name: string
    phone?: string
    email?: string
    address?: string
  }
}

export interface EmailBlockData extends BlockBase {
  type: 'email'
  data: {
    email: string
    subject?: string
    buttonText?: string
  }
}

export interface PhoneBlockData extends BlockBase {
  type: 'phone'
  data: {
    phone: string
    buttonText?: string
    showWhatsApp?: boolean
  }
}

export interface LocationBlockData extends BlockBase {
  type: 'location'
  data: {
    address: string
    coordinates?: { lat: number; lng: number }
    mapUrl?: string
  }
}

export interface EmbedBlockData extends BlockBase {
  type: 'embed'
  data: {
    embedCode: string
    height?: number
  }
}

export interface DownloadBlockData extends BlockBase {
  type: 'download'
  data: {
    fileName: string
    fileUrl: string
    fileSize?: string
    fileType?: string
  }
}

export interface PaymentBlockData extends BlockBase {
  type: 'payment'
  data: {
    amount: number
    currency: string
    description: string
    paymentUrl: string
  }
}

export interface NewsletterBlockData extends BlockBase {
  type: 'newsletter'
  data: {
    title: string
    description?: string
    placeholder?: string
    buttonText?: string
    apiEndpoint: string
  }
}

export interface FAQsBlockData extends BlockBase {
  type: 'faqs'
  data: {
    title?: string
    subtitle?: string
    faqs: Array<{ question: string; answer: string }>
  }
}

export interface VCardBlockData extends BlockBase {
  type: 'vcard'
  data: {
    firstName: string
    lastName?: string
    organization?: string
    phone?: string
    email?: string
    website?: string
    address?: string
    title?: string
    logo?: string
  }
}

export interface LeadFormBlockData extends BlockBase {
  type: 'lead-form'
  data: {
    title?: string
    fields: Array<{
      name: string
      label: string
      type: 'text' | 'email' | 'phone' | 'textarea'
      required?: boolean
    }>
    buttonText?: string
    apiEndpoint?: string
  }
}

export interface OpeningHoursBlockData extends BlockBase {
  type: 'opening-hours'
  data: {
    title?: string
    hours: Array<{
      day: string
      open: string
      close: string
      closed?: boolean
    }>
  }
}

export interface TableBlockData extends BlockBase {
  type: 'table'
  data: {
    tableData: string
    textColor?: string
    bordered?: boolean
  }
}

export interface ListBlockData extends BlockBase {
  type: 'list'
  data: {
    title?: string
    items: Array<{ text: string; icon?: string }>
  }
}

export interface ImageGridBlockData extends BlockBase {
  type: 'image-grid'
  data: {
    title?: string
    items: Array<{ url: string; alt?: string; link?: string }>
    gridGap?: number
    columns?: 2 | 3 | 4
    lightbox?: boolean
  }
}

export interface AudioBlockData extends BlockBase {
  type: 'audio'
  data: {
    audioUrl: string
    title?: string
    autoplay?: boolean
  }
}

export interface ProfileBlockData extends BlockBase {
  type: 'profile'
  data: {
    profileImage?: string
    backgroundImage?: string
    text?: string
    borderStyle?: 'circle' | 'default'
    size?: number
  }
}

export interface CustomCodeBlockData extends BlockBase {
  type: 'custom-code'
  data: {
    htmlCode?: string
    cssCode?: string
    jsCode?: string
  }
}

export interface CopyableDataBlockData extends BlockBase {
  type: 'copyable-data'
  data: {
    label: string
    value: string
  }
}

export interface FileBlockData extends BlockBase {
  type: 'file'
  data: {
    fileUrl: string
    fileName: string
    fileSize?: string
    downloadCount?: number
  }
}

export interface InformationPopupBlockData extends BlockBase {
  type: 'information-popup'
  data: {
    triggerText: string
    title: string
    content: string
  }
}

export interface ParagraphBlockData extends BlockBase {
  type: 'paragraph'
  data: {
    content: string
  }
}

export interface ShareBlockData extends BlockBase {
  type: 'share'
  data: {
    url: string
    title?: string
  }
}

export interface UPIBlockData extends BlockBase {
  type: 'upi'
  data: {
    vpa: string
    amount?: number
    name?: string
    note?: string
  }
}

// Countdown Block
export interface CountdownBlockData extends BlockBase {
  type: 'countdown'
  data: {
    title?: string
    targetDate: string
    expiredMessage?: string
    style?: 'cards' | 'inline' | 'minimal'
  }
}

// Calendar Event Block
export interface CalendarBlockData extends BlockBase {
  type: 'calendar'
  data: {
    eventName: string
    startDate?: string
    endDate?: string
    location?: string
    description?: string
  }
}

// Header/Banner Block
export interface HeaderBannerBlockData extends BlockBase {
  type: 'header-banner'
  data: {
    title: string
    subtitle?: string
    backgroundImage?: string
    backgroundColor?: string
    textColor?: string
    height?: number
    align?: 'left' | 'center' | 'right'
    overlayOpacity?: number
    buttonText?: string
    buttonUrl?: string
  }
}

// Testimonial Block
export interface TestimonialBlockData extends BlockBase {
  type: 'testimonial'
  data: {
    testimonials: Array<{
      name: string
      photo?: string
      rating: number
      text: string
      title?: string
    }>
  }
}

// Carousel Block
export interface CarouselBlockData extends BlockBase {
  type: 'carousel'
  data: {
    images: Array<{
      url: string
      alt?: string
      caption?: string
    }>
    autoplay?: boolean
    interval?: number
    showDots?: boolean
    showArrows?: boolean
    height?: number
  }
}

// Map Block (embedded map with coordinates)
export interface MapBlockData extends BlockBase {
  type: 'map'
  data: {
    lat?: number
    lng?: number
    zoom?: number
    address?: string
    title?: string
    height?: number
    provider?: 'google' | 'openstreetmap'
  }
}

// App Download Block
export interface AppDownloadBlockData extends BlockBase {
  type: 'app-download'
  data: {
    appName: string
    description?: string
    appIcon?: string
    iosUrl?: string
    androidUrl?: string
    style?: 'badges' | 'buttons' | 'card'
  }
}

// Pricing Block
export interface PricingBlockData extends BlockBase {
  type: 'pricing'
  data: {
    title?: string
    plans: Array<{
      name: string
      price: string
      currency: string
      period: string
      features: string[]
      buttonText: string
      buttonUrl?: string
      highlighted?: boolean
    }>
  }
}

// Social Media Embed Block Types
export interface YouTubeBlockData extends BlockBase {
  type: 'youtube'
  data: {
    url: string
    autoplay?: boolean
    startTime?: number
  }
}

export interface VimeoBlockData extends BlockBase {
  type: 'vimeo'
  data: {
    url: string
    autoplay?: boolean
    loop?: boolean
  }
}

export interface SpotifyBlockData extends BlockBase {
  type: 'spotify'
  data: {
    url: string
    theme?: 'dark' | 'light'
    compact?: boolean
  }
}

export interface SoundCloudBlockData extends BlockBase {
  type: 'soundcloud'
  data: {
    url: string
    color?: string
    autoplay?: boolean
  }
}

export interface TikTokBlockData extends BlockBase {
  type: 'tiktok'
  data: {
    url: string
  }
}

export interface InstagramBlockData extends BlockBase {
  type: 'instagram'
  data: {
    url: string
  }
}

export interface TwitterBlockData extends BlockBase {
  type: 'twitter'
  data: {
    url: string
    theme?: 'dark' | 'light'
  }
}

// Union type of all blocks
export type BlockData =
  | LinkBlockData
  | TextBlockData
  | ImageBlockData
  | TitleBlockData
  | SocialLinksBlockData
  | VideoBlockData
  | DividerBlockData
  | ContactBlockData
  | EmailBlockData
  | PhoneBlockData
  | LocationBlockData
  | EmbedBlockData
  | DownloadBlockData
  | PaymentBlockData
  | NewsletterBlockData
  | FAQsBlockData
  | VCardBlockData
  | LeadFormBlockData
  | OpeningHoursBlockData
  | TableBlockData
  | ListBlockData
  | ImageGridBlockData
  | AudioBlockData
  | ProfileBlockData
  | CustomCodeBlockData
  | CopyableDataBlockData
  | FileBlockData
  | InformationPopupBlockData
  | ParagraphBlockData
  | ShareBlockData
  | UPIBlockData
  | CountdownBlockData
  | CalendarBlockData
  | HeaderBannerBlockData
  | TestimonialBlockData
  | CarouselBlockData
  | MapBlockData
  | AppDownloadBlockData
  | PricingBlockData
  | YouTubeBlockData
  | VimeoBlockData
  | SpotifyBlockData
  | SoundCloudBlockData
  | TikTokBlockData
  | InstagramBlockData
  | TwitterBlockData

// Biolink Theme
export interface BiolinkTheme {
  backgroundColor: string
  textColor: string
  buttonColor: string
  buttonTextColor: string
  fontFamily?: string
}

// Biolink Entity
export interface Biolink {
  id: number
  userId: number
  slug: string
  title: string
  description: string | null
  avatar?: string | null
  theme: BiolinkTheme
  blocks: BlockData[]
  isPublished: boolean
  views: number
  createdAt: string
  updatedAt: string
}

// API Response Types
export interface BiolinksResponse {
  data: Biolink[]
  pagination: {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
  }
}

// Create/Update DTOs
export interface CreateBiolinkRequest {
  slug: string
  title: string
  description?: string
  avatar?: string
  theme?: Partial<BiolinkTheme>
  blocks?: BlockData[]
  isPublished?: boolean
}

export interface UpdateBiolinkRequest extends Partial<CreateBiolinkRequest> {
  id: number
}

// Block Registry
export interface BlockDefinition {
  type: BlockType
  label: string
  icon: string
  category: 'core' | 'content' | 'social' | 'business'
  defaultData: any
}
