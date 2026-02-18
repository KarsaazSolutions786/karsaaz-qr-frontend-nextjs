'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  BiolinksFormData,
  BiolinkBlock,
  ThemeSettings,
  defaultTheme,
} from '@/types/entities/biolinks';
import { BlocksManager } from './BlocksManager';
import { BiolinksDesigner } from './BiolinksDesigner';
import { BiolinksPreview } from './BiolinksPreview';

const biolinksSchema = z.object({
  profile: z.object({
    name: z.string().min(1, 'Name is required'),
    bio: z.string().optional(),
    avatar: z.string().url().optional().or(z.literal('')),
    coverImage: z.string().url().optional().or(z.literal('')),
    showAvatar: z.boolean().optional(),
    showBio: z.boolean().optional(),
  }),
});

interface BiolinksFormProps {
  initialData?: Partial<BiolinksFormData>;
  onSubmit: (data: BiolinksFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function BiolinksForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: BiolinksFormProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'blocks' | 'design'>('profile');
  const [blocks, setBlocks] = useState<BiolinkBlock[]>(initialData?.blocks || []);
  const [theme, setTheme] = useState<ThemeSettings>(initialData?.theme || defaultTheme);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BiolinksFormData>({
    resolver: zodResolver(biolinksSchema) as any,
    defaultValues: {
      profile: {
        name: initialData?.profile?.name || '',
        bio: initialData?.profile?.bio || '',
        avatar: initialData?.profile?.avatar || '',
        coverImage: initialData?.profile?.coverImage || '',
        showAvatar: initialData?.profile?.showAvatar ?? true,
        showBio: initialData?.profile?.showBio ?? true,
      },
    },
  });

  const profileData = watch('profile');

  const handleFormSubmit = (data: any) => {
    const formData: BiolinksFormData = {
      profile: data.profile,
      blocks,
      theme,
    };
    onSubmit(formData);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header with Tabs */}
      <div className="border-b bg-white">
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-900">Biolinks Page Builder</h2>
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

        <div className="flex gap-1 px-6">
          {[
            { id: 'profile', label: '👤 Profile', icon: '' },
            { id: 'blocks', label: '🧩 Blocks', badge: blocks.length },
            { id: 'design', label: '🎨 Design', icon: '' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`relative px-6 py-3 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-600 rounded-full">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Form */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-3xl mx-auto">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg border p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Display Name *
                      </label>
                      <input
                        {...register('profile.name')}
                        type="text"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Your Name"
                      />
                      {errors.profile?.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.profile.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                      <textarea
                        {...register('profile.bio')}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        placeholder="A short bio about yourself..."
                      />
                      <div className="flex items-center mt-2">
                        <input
                          {...register('profile.showBio')}
                          type="checkbox"
                          id="showBio"
                          className="mr-2"
                        />
                        <label htmlFor="showBio" className="text-sm text-gray-700">
                          Show bio on page
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Avatar URL
                      </label>
                      <input
                        {...register('profile.avatar')}
                        type="url"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="https://example.com/avatar.jpg"
                      />
                      <div className="flex items-center mt-2">
                        <input
                          {...register('profile.showAvatar')}
                          type="checkbox"
                          id="showAvatar"
                          className="mr-2"
                        />
                        <label htmlFor="showAvatar" className="text-sm text-gray-700">
                          Show avatar on page
                        </label>
                      </div>
                      {profileData.avatar && profileData.showAvatar && (
                        <div className="mt-3">
                          <img
                            src={profileData.avatar}
                            alt="Avatar preview"
                            className="w-20 h-20 rounded-full object-cover border-2"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cover Image URL (optional)
                      </label>
                      <input
                        {...register('profile.coverImage')}
                        type="url"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="https://example.com/cover.jpg"
                      />
                      {profileData.coverImage && (
                        <div className="mt-3">
                          <img
                            src={profileData.coverImage}
                            alt="Cover preview"
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setActiveTab('blocks')}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Next: Add Blocks →
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'blocks' && (
              <BlocksManager blocks={blocks} onChange={setBlocks} />
            )}

            {activeTab === 'design' && (
              <BiolinksDesigner theme={theme} onChange={setTheme} />
            )}
          </div>
        </div>

        {/* Right Panel - Live Preview */}
        <div className="w-96 border-l bg-white">
          <BiolinksPreview profile={profileData} blocks={blocks} theme={theme} />
        </div>
      </div>
    </div>
  );
}
