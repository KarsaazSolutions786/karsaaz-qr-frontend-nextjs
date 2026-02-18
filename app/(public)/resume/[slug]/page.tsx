import { notFound } from 'next/navigation';
import ResumeDisplay from '@/components/public/resume/ResumeDisplay';

async function getResumeData(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/qrcodes/resume/${slug}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
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
