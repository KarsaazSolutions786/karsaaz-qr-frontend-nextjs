/**
 * Biolinks Usage Example
 * Demonstrates how to use the Biolinks QR Type System
 */

'use client';

import { useState } from 'react';
import { BiolinksForm } from './BiolinksForm';
import { biolinksAPI } from '@/lib/api/endpoints/biolinks';
import { BiolinksFormData } from '@/types/entities/biolinks';
import { toast } from 'sonner';

interface BiolinksPageProps {
  qrCodeId: string;
  mode?: 'create' | 'edit';
  biolinksId?: number;
  onSuccess?: (biolinks: any) => void;
  onCancel?: () => void;
}

/**
 * Example component for creating/editing biolinks
 */
export function BiolinksPage({
  qrCodeId,
  mode = 'create',
  biolinksId,
  onSuccess,
  onCancel,
}: BiolinksPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState<BiolinksFormData | undefined>();

  // Load existing biolinks data in edit mode
  useState(() => {
    if (mode === 'edit' && biolinksId) {
      biolinksAPI
        .getById(biolinksId)
        .then((data: any) => {
          setInitialData({
            profile: data.profile,
            blocks: data.blocks,
            theme: data.theme,
          });
        })
        .catch((error) => {
          toast.error('Failed to load biolinks data');
          console.error(error);
        });
    }
  });

  const handleSubmit = async (data: BiolinksFormData) => {
    setIsLoading(true);

    try {
      let result;

      if (mode === 'create') {
        // Create new biolinks
        result = await biolinksAPI.create({
          slug: qrCodeId,
          title: data.profile.name,
          blocks: data.blocks as any,
          theme: data.theme as any,
        });
        toast.success('Biolinks page created successfully!');
      } else {
        // Update existing biolinks
        result = await biolinksAPI.update({
          id: biolinksId!,
          title: data.profile.name,
          blocks: data.blocks as any,
          theme: data.theme as any,
        });
        toast.success('Biolinks page updated successfully!');
      }

      onSuccess?.(result);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save biolinks');
      console.error('Save error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen">
      <BiolinksForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={onCancel}
        isLoading={isLoading}
      />
    </div>
  );
}

/**
 * Example: Create biolinks with default data
 */
export function QuickBiolinksExample() {
  const handleCreate = async () => {
    try {
      const biolinks = await biolinksAPI.create({
        slug: 'qr-123',
        title: 'John Doe',
        blocks: [
          {
            id: 'block-1',
            type: 'link',
            order: 0,
            data: {
              title: 'Visit My Website',
              url: 'https://johndoe.com',
              icon: '🌐',
            },
          },
          {
            id: 'block-2',
            type: 'email',
            order: 1,
            data: {
              email: 'john@example.com',
              buttonText: 'Send Email',
            },
          },
          {
            id: 'block-3',
            type: 'social_links',
            order: 2,
            data: {
              links: [
                { platform: 'Twitter', url: 'https://twitter.com/johndoe', icon: '𝕏' },
                { platform: 'LinkedIn', url: 'https://linkedin.com/in/johndoe', icon: '💼' },
                { platform: 'GitHub', url: 'https://github.com/johndoe', icon: '💻' },
              ],
              style: 'icons',
            },
          },
        ] as any,
        theme: {
          backgroundColor: '#ffffff',
          textColor: '#1f2937',
          buttonColor: '#3b82f6',
          buttonTextColor: '#ffffff',
        },
      });

      console.log('Created biolinks:', biolinks);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <button onClick={handleCreate} className="px-4 py-2 bg-blue-600 text-white rounded">
      Create Quick Biolinks
    </button>
  );
}

/**
 * Example: Clone existing biolinks
 */
export function CloneBiolinksExample({ sourceId }: { sourceId: number }) {
  const handleClone = async () => {
    try {
      const cloned = await biolinksAPI.clone(sourceId);
      toast.success('Biolinks cloned successfully!');
      console.log('Cloned biolinks:', cloned);
    } catch (error) {
      toast.error('Failed to clone biolinks');
      console.error(error);
    }
  };

  return (
    <button onClick={handleClone} className="px-4 py-2 bg-green-600 text-white rounded">
      Clone Biolinks
    </button>
  );
}

/**
 * Example: Analytics Dashboard
 */
export function BiolinksAnalyticsExample({ biolinksId }: { biolinksId: number }) {
  const [analytics, setAnalytics] = useState<any>(null);

  const loadAnalytics = async () => {
    try {
      const data = await biolinksAPI.getAnalytics(biolinksId, {
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date().toISOString(),
        groupBy: 'day',
      });
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };

  useState(() => {
    loadAnalytics();
  });

  if (!analytics) return <div>Loading analytics...</div>;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Total Views</div>
          <div className="text-2xl font-bold">{analytics.totalViews}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Total Clicks</div>
          <div className="text-2xl font-bold">{analytics.totalClicks}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Click Rate</div>
          <div className="text-2xl font-bold">
            {((analytics.totalClicks / analytics.totalViews) * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold mb-2">Top Performing Blocks</h3>
        <div className="space-y-2">
          {analytics.topBlocks.map((block: any) => (
            <div key={block.blockId} className="flex justify-between">
              <span>{block.title || block.blockType}</span>
              <span className="font-semibold">{block.clicks} clicks</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Example: Public Biolinks Viewer
 */
export function PublicBiolinksViewer({ slug }: { slug: string }) {
  const [biolinks, setBiolinks] = useState<any>(null);

  useState(() => {
    biolinksAPI
      .getBySlug(slug)
      .then((data) => {
        setBiolinks(data);
        // Track view
        biolinksAPI.trackView(String(data.id), {
          userAgent: navigator.userAgent,
          referrer: document.referrer,
        });
      })
      .catch((error) => {
        console.error('Failed to load biolinks:', error);
      });
  });

  if (!biolinks) return <div>Loading...</div>;

  const handleBlockClick = (blockId: string) => {
    biolinksAPI.trackBlockClick(biolinks.id, blockId, {
      userAgent: navigator.userAgent,
    });
  };

  return (
    <div className="min-h-screen" style={{ background: biolinks.theme.backgroundColor }}>
      {/* Render biolinks content */}
      <div className="max-w-2xl mx-auto p-6">
        <h1>{biolinks.profile.name}</h1>
        <p>{biolinks.profile.bio}</p>
        
        {biolinks.blocks.map((block: any) => (
          <div key={block.id} onClick={() => handleBlockClick(block.id)}>
            {/* Render block based on type */}
          </div>
        ))}
      </div>
    </div>
  );
}
