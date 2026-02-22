export interface BioLinkTemplate {
  id: string
  name: string
  description: string
  icon: string
  category: 'personal' | 'business' | 'creator' | 'event'
  blocks: Array<{
    type: string
    config: Record<string, unknown>
  }>
}

export const BIOLINK_TEMPLATES: BioLinkTemplate[] = [
  {
    id: 'personal-basic',
    name: 'Personal Profile',
    description: 'Simple personal bio with social links and contact info',
    icon: '👤',
    category: 'personal',
    blocks: [
      { type: 'title', config: { text: 'Your Name', level: 'h1', align: 'center' } },
      { type: 'text', config: { content: 'A brief bio about yourself...', align: 'center', size: 'md' } },
      { type: 'social-links', config: { links: [{ platform: 'twitter' }, { platform: 'instagram' }, { platform: 'linkedin' }] } },
      { type: 'link', config: { url: '', title: 'My Website', icon: '', style: 'button' } },
    ],
  },
  {
    id: 'business-card',
    name: 'Business Card',
    description: 'Professional business card with contact details and company links',
    icon: '💼',
    category: 'business',
    blocks: [
      { type: 'title', config: { text: 'Company Name', level: 'h1', align: 'center' } },
      { type: 'text', config: { content: 'Your role & company tagline', align: 'center', size: 'sm' } },
      { type: 'divider', config: { style: 'solid', color: '#e5e7eb' } },
      { type: 'link', config: { url: '', title: '📧 Email Us', icon: '', style: 'button' } },
      { type: 'link', config: { url: '', title: '📞 Call Us', icon: '', style: 'button' } },
      { type: 'social-links', config: { links: [{ platform: 'linkedin' }, { platform: 'twitter' }] } },
    ],
  },
  {
    id: 'content-creator',
    name: 'Content Creator',
    description: 'Showcase your content with video, social links, and merch',
    icon: '🎬',
    category: 'creator',
    blocks: [
      { type: 'title', config: { text: 'Creator Name', level: 'h1', align: 'center' } },
      { type: 'text', config: { content: 'Welcome to my page! Check out my latest content 👇', align: 'center', size: 'md' } },
      { type: 'video', config: { url: '', title: 'Latest Video' } },
      { type: 'divider', config: { style: 'solid', color: '#e5e7eb' } },
      { type: 'link', config: { url: '', title: '🛍️ Merch Store', icon: '', style: 'button' } },
      { type: 'social-links', config: { links: [{ platform: 'youtube' }, { platform: 'tiktok' }, { platform: 'instagram' }] } },
    ],
  },
  {
    id: 'event-page',
    name: 'Event Page',
    description: 'Promote an event with details, schedule, and registration link',
    icon: '🎉',
    category: 'event',
    blocks: [
      { type: 'title', config: { text: 'Event Name', level: 'h1', align: 'center' } },
      { type: 'image', config: { url: '', alt: 'Event banner', link: '', caption: '' } },
      { type: 'text', config: { content: '📅 Date & Time\n📍 Location\n\nEvent description goes here...', align: 'center', size: 'md' } },
      { type: 'divider', config: { style: 'solid', color: '#e5e7eb' } },
      { type: 'link', config: { url: '', title: '🎟️ Register Now', icon: '', style: 'button' } },
      { type: 'link', config: { url: '', title: '📍 Get Directions', icon: '', style: 'button' } },
    ],
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    description: 'Display your work with images, project links, and bio',
    icon: '🎨',
    category: 'creator',
    blocks: [
      { type: 'title', config: { text: 'My Portfolio', level: 'h1', align: 'center' } },
      { type: 'text', config: { content: 'Designer & Developer — crafting digital experiences', align: 'center', size: 'md' } },
      { type: 'image', config: { url: '', alt: 'Featured project', link: '', caption: 'Featured Work' } },
      { type: 'link', config: { url: '', title: '🔗 View All Projects', icon: '', style: 'button' } },
      { type: 'link', config: { url: '', title: '📄 Download Resume', icon: '', style: 'button' } },
      { type: 'social-links', config: { links: [{ platform: 'github' }, { platform: 'dribbble' }, { platform: 'linkedin' }] } },
    ],
  },
  {
    id: 'restaurant-menu',
    name: 'Restaurant Menu',
    description: 'Digital menu with ordering links, location, and hours',
    icon: '🍽️',
    category: 'business',
    blocks: [
      { type: 'title', config: { text: 'Restaurant Name', level: 'h1', align: 'center' } },
      { type: 'text', config: { content: '🕐 Open daily 11am–10pm\n📍 123 Main Street', align: 'center', size: 'sm' } },
      { type: 'image', config: { url: '', alt: 'Restaurant photo', link: '', caption: '' } },
      { type: 'divider', config: { style: 'solid', color: '#e5e7eb' } },
      { type: 'link', config: { url: '', title: '📋 View Full Menu', icon: '', style: 'button' } },
      { type: 'link', config: { url: '', title: '🛵 Order Online', icon: '', style: 'button' } },
      { type: 'link', config: { url: '', title: '📞 Make a Reservation', icon: '', style: 'button' } },
    ],
  },
]
