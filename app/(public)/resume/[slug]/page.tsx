import { notFound } from 'next/navigation';
import ResumeDisplay from '@/components/public/resume/ResumeDisplay';
import { getQRCodeRedirect, trackQRView } from '@/lib/api/public-qrcodes';

async function getResumeData(slug: string) {
  try {
    const qrData = await getQRCodeRedirect(slug);
    
    if (!qrData) {
      return null;
    }

    // Validate type is resume, cv, or curriculum-vitae
    const validTypes = ['resume', 'cv', 'curriculum-vitae'];
    if (!validTypes.includes(qrData.type)) {
      console.error('Invalid QR code type for resume page:', qrData.type);
      return null;
    }

    // Track view
    await trackQRView(slug);

    return qrData.data;
  } catch (error) {
    console.error('Error fetching resume:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const data = await getResumeData(params.slug);

  if (!data) {
    return {
      title: 'Resume Not Found',
    };
  }

  return {
    title: `${data.personalInfo?.name || 'Resume'} - Professional CV`,
    description: data.personalInfo?.summary || 'Professional Resume/CV',
  };
}

export default async function ResumePage({ params }: { params: { slug: string } }) {
  const data = await getResumeData(params.slug);

  if (!data) {
    notFound();
  }

  return <ResumeDisplay data={data} />;
}
