"use client";

import SocialLinksBlock from './SocialLinksBlock';
import { useState } from 'react';
import { Block } from '../types';

/**
 * Social Links Block Demo
 * 
 * This demo showcases the Social Links Block component with various configurations
 * and interactive examples for testing and documentation purposes.
 */

export function SocialLinksBlockDemo() {
  // Default configuration
  const [block1, setBlock1] = useState<Block>({
    id: 'social-demo-1',
    type: 'social-links',
    title: 'Social Links - Icons Style',
    content: {
      links: [
        {
          id: 'link-1',
          platform: 'facebook',
          url: 'https://facebook.com/example',
          title: 'Facebook',
          openInNewTab: true
        },
        {
          id: 'link-2',
          platform: 'twitter',
          url: 'https://twitter.com/example',
          title: 'Twitter',
          openInNewTab: true
        },
        {
          id: 'link-3',
          platform: 'instagram',
          url: 'https://instagram.com/example',
          title: 'Instagram',
          openInNewTab: true
        },
        {
          id: 'link-4',
          platform: 'linkedin',
          url: 'https://linkedin.com/in/example',
          title: 'LinkedIn',
          openInNewTab: true
        },
        {
          id: 'link-5',
          platform: 'github',
          url: 'https://github.com/example',
          title: 'GitHub',
          openInNewTab: true
        },
        {
          id: 'link-6',
          platform: 'youtube',
          url: 'https://youtube.com/@example',
          title: 'YouTube',
          openInNewTab: true
        }
      ],
      style: 'icons',
      showPlatformName: false,
      size: 'medium',
      useBrandColors: true,
      openInNewTab: true
    },
    settings: {
      visible: true,
      order: 0,
      customClasses: [],
      padding: '1rem',
      margin: '0.5rem 0'
    },
    design: {
      backgroundColor: 'transparent',
      textColor: '#000000',
      borderRadius: '8px',
      padding: '1rem',
      margin: '0.5rem 0'
    }
  });

  // Buttons style with platform names
  const [block2, setBlock2] = useState<Block>({
    id: 'social-demo-2',
    type: 'social-links',
    title: 'Social Links - Buttons Style',
    content: {
      links: [
        {
          id: 'link-1',
          platform: 'facebook',
          url: 'https://facebook.com/example',
          title: 'Facebook',
          openInNewTab: true
        },
        {
          id: 'link-2',
          platform: 'twitter',
          url: 'https://twitter.com/example',
          title: 'Twitter',
          openInNewTab: true
        },
        {
          id: 'link-3',
          platform: 'instagram',
          url: 'https://instagram.com/example',
          title: 'Instagram',
          openInNewTab: true
        },
        {
          id: 'link-4',
          platform: 'linkedin',
          url: 'https://linkedin.com/in/example',
          title: 'LinkedIn',
          openInNewTab: true
        }
      ],
      style: 'buttons',
      showPlatformName: true,
      size: 'medium',
      useBrandColors: true,
      openInNewTab: true
    },
    settings: {
      visible: true,
      order: 0,
      customClasses: [],
      padding: '1rem',
      margin: '0.5rem 0'
    },
    design: {
      backgroundColor: 'transparent',
      textColor: '#000000',
      borderRadius: '8px',
      padding: '1rem',
      margin: '0.5rem 0'
    }
  });

  // List style with contact links
  const [block3, setBlock3] = useState<Block>({
    id: 'social-demo-3',
    type: 'social-links',
    title: 'Social Links - Contact Info',
    content: {
      links: [
        {
          id: 'link-1',
          platform: 'email',
          url: 'mailto:hello@example.com',
          title: 'Email Us',
          openInNewTab: false
        },
        {
          id: 'link-2',
          platform: 'phone',
          url: 'tel:+1234567890',
          title: 'Call Us',
          openInNewTab: false
        },
        {
          id: 'link-3',
          platform: 'website',
          url: 'https://example.com',
          title: 'Visit Website',
          openInNewTab: true
        },
        {
          id: 'link-4',
          platform: 'location',
          url: 'https://maps.google.com?q=New+York',
          title: 'Find Us',
          openInNewTab: true
        }
      ],
      style: 'list',
      showPlatformName: true,
      size: 'medium',
      useBrandColors: true,
      openInNewTab: true
    },
    settings: {
      visible: true,
      order: 0,
      customClasses: [],
      padding: '1rem',
      margin: '0.5rem 0'
    },
    design: {
      backgroundColor: 'transparent',
      textColor: '#000000',
      borderRadius: '8px',
      padding: '1rem',
      margin: '0.5rem 0'
    }
  });

  // Small size with custom color
  const [block4, setBlock4] = useState<Block>({
    id: 'social-demo-4',
    type: 'social-links',
    title: 'Social Links - Custom Style',
    content: {
      links: [
        {
          id: 'link-1',
          platform: 'facebook',
          url: 'https://facebook.com/example',
          title: 'Facebook',
          openInNewTab: true
        },
        {
          id: 'link-2',
          platform: 'instagram',
          url: 'https://instagram.com/example',
          title: 'Instagram',
          openInNewTab: true
        },
        {
          id: 'link-3',
          platform: 'tiktok',
          url: 'https://tiktok.com/@example',
          title: 'TikTok',
          openInNewTab: true
        },
        {
          id: 'link-4',
          platform: 'spotify',
          url: 'https://open.spotify.com/user/example',
          title: 'Spotify',
          openInNewTab: true
        }
      ],
      style: 'icons',
      showPlatformName: false,
      size: 'small',
      useBrandColors: false,
      customColor: '#8B5CF6',
      openInNewTab: true
    },
    settings: {
      visible: true,
      order: 0,
      customClasses: [],
      padding: '1rem',
      margin: '0.5rem 0'
    },
    design: {
      backgroundColor: '#F3F4F6',
      textColor: '#000000',
      borderRadius: '12px',
      padding: '1.5rem',
      margin: '0.5rem 0'
    }
  });

  const handleUpdate = (blockId: string, updates: any) => {
    const updateBlock = (block: Block) => {
      if (block.id === blockId) {
        return { ...block, ...updates };
      }
      return block;
    };

    if (blockId === block1.id) setBlock1(updateBlock(block1));
    if (blockId === block2.id) setBlock2(updateBlock(block2));
    if (blockId === block3.id) setBlock3(updateBlock(block3));
    if (blockId === block4.id) setBlock4(updateBlock(block4));
  };

  const handleDelete = (blockId: string) => {
    console.log('Delete block:', blockId);
    alert('Delete functionality would be handled by parent component');
  };

  return (
    <div className="space-y-8 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-bold">Social Links Block Demo</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Interactive examples showcasing different configurations and features.
          </p>
        </div>

        <div className="p-6 space-y-12">
          {/* Icons Style Demo */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">1. Icons Style (Default)</h3>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                Public View
              </span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Preview</h4>
                <SocialLinksBlock
                  block={block1}
                  onUpdate={(updates) => handleUpdate(block1.id, updates)}
                  onDelete={() => handleDelete(block1.id)}
                  isEditing={false}
                />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Editor</h4>
                <SocialLinksBlock
                  block={block1}
                  onUpdate={(updates) => handleUpdate(block1.id, updates)}
                  onDelete={() => handleDelete(block1.id)}
                  isEditing={true}
                />
              </div>
            </div>
            <div className="mt-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold">Features:</span> Brand colors, medium size, 
                6 social platforms, hover effects, responsive grid
              </p>
            </div>
          </section>

          {/* Buttons Style Demo */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">2. Buttons Style with Platform Names</h3>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                Public View
              </span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Preview</h4>
                <SocialLinksBlock
                  block={block2}
                  onUpdate={(updates) => handleUpdate(block2.id, updates)}
                  onDelete={() => handleDelete(block2.id)}
                  isEditing={false}
                />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Editor</h4>
                <SocialLinksBlock
                  block={block2}
                  onUpdate={(updates) => handleUpdate(block2.id, updates)}
                  onDelete={() => handleDelete(block2.id)}
                  isEditing={true}
                />
              </div>
            </div>
            <div className="mt-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold">Features:</span> Button style displays platform names, 
                brand colors, medium size, hover scale effect
              </p>
            </div>
          </section>

          {/* Contact Links Demo */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">3. Contact Information (List Style)</h3>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                Public View
              </span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Preview</h4>
                <SocialLinksBlock
                  block={block3}
                  onUpdate={(updates) => handleUpdate(block3.id, updates)}
                  onDelete={() => handleDelete(block3.id)}
                  isEditing={false}
                />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Editor</h4>
                <SocialLinksBlock
                  block={block3}
                  onUpdate={(updates) => handleUpdate(block3.id, updates)}
                  onDelete={() => handleDelete(block3.id)}
                  isEditing={true}
                />
              </div>
            </div>
            <div className="mt-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold">Features:</span> List style for contact links, 
                mixed platforms (email, phone, website, location), background hover effect
              </p>
            </div>
          </section>

          {/* Custom Style Demo */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">4. Custom Style (Purple Theme)</h3>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                Public View
              </span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Preview</h4>
                <SocialLinksBlock
                  block={block4}
                  onUpdate={(updates) => handleUpdate(block4.id, updates)}
                  onDelete={() => handleDelete(block4.id)}
                  isEditing={false}
                />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Editor</h4>
                <SocialLinksBlock
                  block={block4}
                  onUpdate={(updates) => handleUpdate(block4.id, updates)}
                  onDelete={() => handleDelete(block4.id)}
                  isEditing={true}
                />
              </div>
            </div>
            <div className="mt-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold">Features:</span> Custom purple color scheme, 
                small size, custom background, compact layout
              </p>
            </div>
          </section>

          {/* Feature Summary */}
          <section className="border-t border-gray-200 dark:border-gray-800 pt-8">
            <h3 className="text-xl font-semibold mb-4">Component Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">20+ Platforms</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Support for all major social media and contact platforms
                </p>
              </div>
              <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 dark:text-green-100">Drag & Drop</h4>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Intuitive reordering with smooth animations
                </p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 dark:text-purple-100">URL Validation</h4>
                <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                  Real-time validation with platform-specific rules
                </p>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-100">Responsive</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  Auto-adjusting grid layout for all screen sizes
                </p>
              </div>
              <div className="bg-red-50 dark:bg-red-900 rounded-lg p-4">
                <h4 className="font-semibold text-red-900 dark:text-red-100">Customizable</h4>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  Brand colors, custom colors, sizes, and styles
                </p>
              </div>
              <div className="bg-indigo-50 dark:bg-indigo-900 rounded-lg p-4">
                <h4 className="font-semibold text-indigo-900 dark:text-indigo-100">Validation</h4>
                <p className="text-sm text-indigo-700 dark:text-indigo-300 mt-1">
                  Smart URL validation and auto-formatting
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default SocialLinksBlockDemo;