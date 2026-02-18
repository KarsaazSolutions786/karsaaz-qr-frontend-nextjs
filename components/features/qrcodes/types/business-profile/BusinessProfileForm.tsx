'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Building2,
  Contact,
  Briefcase,
  Clock,
  Users,
  Image as ImageIcon,
  Palette,
} from 'lucide-react';
import {
  BusinessProfileFormData,
  Service,
  OpeningHours,
  TeamMember,
  GalleryImage,
  BusinessTheme,
  defaultOpeningHours,
  defaultBusinessTheme,
} from '@/types/entities/business-profile';
import { OpeningHoursInput } from './OpeningHoursInput';
import { ServicesInput } from './ServicesInput';
import { TeamMembersInput } from './TeamMembersInput';
import { GalleryInput } from './GalleryInput';

const businessProfileSchema = z.object({
  basicInfo: z.object({
    name: z.string().min(1, 'Business name is required'),
    tagline: z.string().optional(),
    description: z.string().optional(),
    logo: z.string().url().optional().or(z.literal('')),
    category: z.string().optional(),
  }),
  contact: z.object({
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
    website: z.string().url().optional().or(z.literal('')),
  }),
});

interface BusinessProfileFormProps {
  initialData?: Partial<BusinessProfileFormData>;
  onSubmit: (data: BusinessProfileFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

type TabKey = 'basic' | 'contact' | 'services' | 'hours' | 'team' | 'gallery' | 'theme';

const TABS = [
  { key: 'basic' as TabKey, label: 'Basic Info', icon: Building2 },
  { key: 'contact' as TabKey, label: 'Contact', icon: Contact },
  { key: 'services' as TabKey, label: 'Services', icon: Briefcase },
  { key: 'hours' as TabKey, label: 'Hours', icon: Clock },
  { key: 'team' as TabKey, label: 'Team', icon: Users },
  { key: 'gallery' as TabKey, label: 'Gallery', icon: ImageIcon },
  { key: 'theme' as TabKey, label: 'Theme', icon: Palette },
];

export function BusinessProfileForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: BusinessProfileFormProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('basic');
  const [services, setServices] = useState<Service[]>(initialData?.services || []);
  const [openingHours, setOpeningHours] = useState<OpeningHours>(
    initialData?.openingHours || defaultOpeningHours
  );
  const [team, setTeam] = useState<TeamMember[]>(initialData?.team || []);
  const [gallery, setGallery] = useState<GalleryImage[]>(initialData?.gallery || []);
  const [theme, setTheme] = useState<BusinessTheme>(
    initialData?.theme || defaultBusinessTheme
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BusinessProfileFormData>({
    resolver: zodResolver(businessProfileSchema) as any,
    defaultValues: {
      basicInfo: {
        name: initialData?.basicInfo?.name || '',
        tagline: initialData?.basicInfo?.tagline || '',
        description: initialData?.basicInfo?.description || '',
        logo: initialData?.basicInfo?.logo || '',
        category: initialData?.basicInfo?.category || '',
      },
      contact: {
        address: initialData?.contact?.address || '',
        city: initialData?.contact?.city || '',
        state: initialData?.contact?.state || '',
        zipCode: initialData?.contact?.zipCode || '',
        country: initialData?.contact?.country || '',
        phone: initialData?.contact?.phone || '',
        email: initialData?.contact?.email || '',
        website: initialData?.contact?.website || '',
        socialMedia: initialData?.contact?.socialMedia || {},
      },
    },
  });

  const basicInfo = watch('basicInfo');

  const handleFormSubmit = (data: any) => {
    const formData: BusinessProfileFormData = {
      basicInfo: data.basicInfo,
      contact: data.contact,
      services,
      openingHours,
      team,
      gallery,
      theme,
    };
    onSubmit(formData);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-900">Business Profile Builder</h2>
          <div className="flex gap-2">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleSubmit(handleFormSubmit)}
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Saving...' : 'Save & Generate QR'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto border-t">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-6 py-3 whitespace-nowrap border-b-2 transition-colors ${
                activeTab === key
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6">
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-6 bg-white rounded-lg border p-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Basic Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business Name *
                    </label>
                    <input
                      {...register('basicInfo.name')}
                      type="text"
                      placeholder="e.g., Acme Corporation"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.basicInfo?.name && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.basicInfo.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tagline
                    </label>
                    <input
                      {...register('basicInfo.tagline')}
                      type="text"
                      placeholder="e.g., Your trusted partner in digital solutions"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      {...register('basicInfo.description')}
                      rows={4}
                      placeholder="Tell people about your business..."
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      {...register('basicInfo.category')}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a category</option>
                      <option value="restaurant">Restaurant & Food</option>
                      <option value="retail">Retail & Shopping</option>
                      <option value="services">Professional Services</option>
                      <option value="health">Health & Wellness</option>
                      <option value="beauty">Beauty & Spa</option>
                      <option value="fitness">Fitness & Sports</option>
                      <option value="education">Education & Training</option>
                      <option value="technology">Technology & IT</option>
                      <option value="entertainment">Entertainment & Events</option>
                      <option value="real-estate">Real Estate</option>
                      <option value="automotive">Automotive</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Logo URL
                    </label>
                    <input
                      {...register('basicInfo.logo')}
                      type="url"
                      placeholder="https://example.com/logo.png"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {basicInfo.logo && (
                      <div className="mt-2">
                        <img
                          src={basicInfo.logo}
                          alt="Logo preview"
                          className="h-20 object-contain border rounded-lg p-2"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="space-y-6 bg-white rounded-lg border p-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address
                    </label>
                    <input
                      {...register('contact.address')}
                      type="text"
                      placeholder="123 Main Street"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        {...register('contact.city')}
                        type="text"
                        placeholder="San Francisco"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State/Province
                      </label>
                      <input
                        {...register('contact.state')}
                        type="text"
                        placeholder="CA"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP/Postal Code
                      </label>
                      <input
                        {...register('contact.zipCode')}
                        type="text"
                        placeholder="94102"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <input
                        {...register('contact.country')}
                        type="text"
                        placeholder="United States"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        {...register('contact.phone')}
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        {...register('contact.email')}
                        type="email"
                        placeholder="info@example.com"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.contact?.email && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.contact.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website
                    </label>
                    <input
                      {...register('contact.website')}
                      type="url"
                      placeholder="https://www.example.com"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium text-gray-900 mb-3">Social Media</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Facebook
                        </label>
                        <input
                          {...register('contact.socialMedia.facebook')}
                          type="url"
                          placeholder="https://facebook.com/yourpage"
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Instagram
                        </label>
                        <input
                          {...register('contact.socialMedia.instagram')}
                          type="url"
                          placeholder="https://instagram.com/yourprofile"
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Twitter
                        </label>
                        <input
                          {...register('contact.socialMedia.twitter')}
                          type="url"
                          placeholder="https://twitter.com/yourhandle"
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          LinkedIn
                        </label>
                        <input
                          {...register('contact.socialMedia.linkedin')}
                          type="url"
                          placeholder="https://linkedin.com/company/yourcompany"
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          YouTube
                        </label>
                        <input
                          {...register('contact.socialMedia.youtube')}
                          type="url"
                          placeholder="https://youtube.com/@yourchannel"
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          WhatsApp
                        </label>
                        <input
                          {...register('contact.socialMedia.whatsapp')}
                          type="tel"
                          placeholder="+1 555 123 4567"
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            <div className="bg-white rounded-lg border p-6">
              <ServicesInput value={services} onChange={setServices} />
            </div>
          )}

          {/* Hours Tab */}
          {activeTab === 'hours' && (
            <div className="bg-white rounded-lg border p-6">
              <OpeningHoursInput value={openingHours} onChange={setOpeningHours} />
            </div>
          )}

          {/* Team Tab */}
          {activeTab === 'team' && (
            <div className="bg-white rounded-lg border p-6">
              <TeamMembersInput value={team} onChange={setTeam} />
            </div>
          )}

          {/* Gallery Tab */}
          {activeTab === 'gallery' && (
            <div className="bg-white rounded-lg border p-6">
              <GalleryInput value={gallery} onChange={setGallery} />
            </div>
          )}

          {/* Theme Tab */}
          {activeTab === 'theme' && (
            <div className="space-y-6 bg-white rounded-lg border p-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Theme & Styling
                </h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Colors</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Primary Color
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={theme.primaryColor}
                            onChange={(e) =>
                              setTheme({ ...theme, primaryColor: e.target.value })
                            }
                            className="h-10 w-16 rounded border cursor-pointer"
                          />
                          <input
                            type="text"
                            value={theme.primaryColor}
                            onChange={(e) =>
                              setTheme({ ...theme, primaryColor: e.target.value })
                            }
                            className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Secondary Color
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={theme.secondaryColor}
                            onChange={(e) =>
                              setTheme({ ...theme, secondaryColor: e.target.value })
                            }
                            className="h-10 w-16 rounded border cursor-pointer"
                          />
                          <input
                            type="text"
                            value={theme.secondaryColor}
                            onChange={(e) =>
                              setTheme({ ...theme, secondaryColor: e.target.value })
                            }
                            className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Background Color
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={theme.backgroundColor}
                            onChange={(e) =>
                              setTheme({ ...theme, backgroundColor: e.target.value })
                            }
                            className="h-10 w-16 rounded border cursor-pointer"
                          />
                          <input
                            type="text"
                            value={theme.backgroundColor}
                            onChange={(e) =>
                              setTheme({ ...theme, backgroundColor: e.target.value })
                            }
                            className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Text Color
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={theme.textColor}
                            onChange={(e) =>
                              setTheme({ ...theme, textColor: e.target.value })
                            }
                            className="h-10 w-16 rounded border cursor-pointer"
                          />
                          <input
                            type="text"
                            value={theme.textColor}
                            onChange={(e) =>
                              setTheme({ ...theme, textColor: e.target.value })
                            }
                            className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Layout</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Layout Style
                        </label>
                        <select
                          value={theme.layout}
                          onChange={(e) =>
                            setTheme({
                              ...theme,
                              layout: e.target.value as BusinessTheme['layout'],
                            })
                          }
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="modern">Modern</option>
                          <option value="classic">Classic</option>
                          <option value="minimal">Minimal</option>
                          <option value="corporate">Corporate</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Card Style
                        </label>
                        <select
                          value={theme.cardStyle}
                          onChange={(e) =>
                            setTheme({
                              ...theme,
                              cardStyle: e.target.value as BusinessTheme['cardStyle'],
                            })
                          }
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="rounded">Rounded</option>
                          <option value="square">Square</option>
                          <option value="elevated">Elevated</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Header Style
                        </label>
                        <select
                          value={theme.headerStyle}
                          onChange={(e) =>
                            setTheme({
                              ...theme,
                              headerStyle: e.target
                                .value as BusinessTheme['headerStyle'],
                            })
                          }
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="center">Center</option>
                          <option value="left">Left</option>
                          <option value="full-width">Full Width</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Logo Size
                        </label>
                        <select
                          value={theme.logoSize}
                          onChange={(e) =>
                            setTheme({
                              ...theme,
                              logoSize: e.target.value as BusinessTheme['logoSize'],
                            })
                          }
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="small">Small</option>
                          <option value="medium">Medium</option>
                          <option value="large">Large</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      Visible Sections
                    </h4>
                    <div className="space-y-2">
                      {[
                        { key: 'basicInfo', label: 'Basic Information' },
                        { key: 'contact', label: 'Contact Information' },
                        { key: 'services', label: 'Services' },
                        { key: 'hours', label: 'Opening Hours' },
                        { key: 'team', label: 'Team Members' },
                        { key: 'gallery', label: 'Gallery' },
                      ].map(({ key, label }) => (
                        <label key={key} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={theme.showSections?.[key as keyof typeof theme.showSections] ?? true}
                            onChange={(e) =>
                              setTheme({
                                ...theme,
                                showSections: {
                                  ...theme.showSections,
                                  [key]: e.target.checked,
                                },
                              })
                            }
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
