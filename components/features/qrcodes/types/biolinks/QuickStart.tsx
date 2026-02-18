/**
 * Biolinks Quick Start Component
 * 
 * This is a ready-to-use example showing how to integrate
 * the Biolinks form into your QR code creation flow.
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BiolinksForm } from './BiolinksForm';
import { biolinksAPI } from '@/lib/api/endpoints/biolinks';
import { BiolinksFormData } from '@/types/entities/biolinks';
import { toast } from 'sonner';

interface QuickStartBiolinksProps {
  /**
   * The QR code ID to associate with this biolinks page
   */
  qrCodeId: string;
  
  /**
   * Optional: Existing biolinks ID for edit mode
   */
  existingBiolinksId?: number;
  
  /**
   * Optional: Callback when save is successful
   */
  onSuccess?: (biolinksId: number) => void;
}

/**
 * Quick Start Component - Ready to use!
 * 
 * Usage:
 * <QuickStartBiolinks 
 *   qrCodeId="qr-123" 
 *   onSuccess={(id) => router.push(`/biolinks/${id}`)}
 * />
 */
export default function QuickStartBiolinks({
  qrCodeId,
  existingBiolinksId,
  onSuccess,
}: QuickStartBiolinksProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState<BiolinksFormData | undefined>();

  // Load existing data if in edit mode
  useState(() => {
    if (existingBiolinksId) {
      biolinksAPI
        .getById(existingBiolinksId)
        .then((data: any) => {
          setInitialData({
            profile: data.profile,
            blocks: data.blocks,
            theme: data.theme,
          });
        })
        .catch((error) => {
          console.error('Failed to load biolinks:', error);
          toast.error('Failed to load biolinks data');
        });
    }
  });

  const handleSubmit = async (formData: BiolinksFormData) => {
    setIsLoading(true);

    try {
      let result;

      if (existingBiolinksId) {
        // UPDATE existing biolinks
        result = await biolinksAPI.update({
          id: existingBiolinksId,
          title: formData.profile.name,
          blocks: formData.blocks as any,
          theme: formData.theme as any,
        });
        toast.success('✅ Biolinks page updated successfully!');
      } else {
        // CREATE new biolinks
        result = await biolinksAPI.create({
          slug: qrCodeId,
          title: formData.profile.name,
          blocks: formData.blocks as any,
          theme: formData.theme as any,
        });
        toast.success('✅ Biolinks page created successfully!');
      }

      // Call success callback or navigate
      if (onSuccess) {
        onSuccess(result.id);
      } else {
        router.push(`/dashboard/biolinks/${result.id}`);
      }
    } catch (error: any) {
      console.error('Failed to save biolinks:', error);
      
      // Show user-friendly error message
      const message = error.response?.data?.message || error.message || 'Failed to save biolinks';
      toast.error(`❌ ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Navigate back or show confirmation dialog
    if (confirm('Are you sure you want to cancel? Unsaved changes will be lost.')) {
      router.back();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <BiolinksForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </div>
  );
}

/**
 * Alternative: Minimal Integration Example
 * 
 * For when you just need the form without the wrapper
 */
export function MinimalBiolinksIntegration({ qrCodeId }: { qrCodeId: string }) {
  const handleSubmit = async (data: BiolinksFormData) => {
    const biolinks = await biolinksAPI.create({
      slug: qrCodeId,
      title: data.profile?.name || 'Untitled',
      ...data as any,
    });
    console.log('Created:', biolinks);
  };

  return <BiolinksForm onSubmit={handleSubmit} />;
}

/**
 * Example: Inline Usage in a Page
 */
export function ExampleUsageInPage() {
  // Get QR code ID from your route params or props
  const qrCodeId = 'qr-123'; // Replace with actual ID

  return (
    <QuickStartBiolinks
      qrCodeId={qrCodeId}
      onSuccess={(biolinksId) => {
        console.log('Biolinks created with ID:', biolinksId);
        // Redirect, update state, etc.
      }}
    />
  );
}

/**
 * Example: Edit Mode
 */
export function ExampleEditMode() {
  const biolinksId = 456; // From route params or props

  return (
    <QuickStartBiolinks
      qrCodeId="qr-123"
      existingBiolinksId={biolinksId}
      onSuccess={(id) => {
        console.log('Updated biolinks:', id);
      }}
    />
  );
}

/**
 * Example: With React Query
 */
/*
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { biolinksKeys } from '@/lib/api/endpoints/biolinks';

export function BiolinksWithReactQuery({ biolinksId }: { biolinksId?: number }) {
  const queryClient = useQueryClient();

  // Load existing data
  const { data: initialData } = useQuery({
    queryKey: biolinksKeys.detail(biolinksId!),
    queryFn: () => biolinksAPI.getById(biolinksId!),
    enabled: !!biolinksId,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: biolinksAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: biolinksKeys.lists() });
      toast.success('Created!');
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data) => biolinksAPI.update({ id: biolinksId!, ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: biolinksKeys.detail(biolinksId!) });
      toast.success('Updated!');
    },
  });

  const handleSubmit = (data: BiolinksFormData) => {
    if (biolinksId) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate({ qrCodeId: 'qr-123', ...data });
    }
  };

  return (
    <BiolinksForm
      initialData={initialData}
      onSubmit={handleSubmit}
      isLoading={createMutation.isPending || updateMutation.isPending}
    />
  );
}
*/
