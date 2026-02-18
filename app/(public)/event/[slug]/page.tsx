import { notFound } from 'next/navigation';
import EventPreview from '@/components/public/event/EventPreview';
import { getQRCodeRedirect } from '@/lib/api/public-qrcodes';

interface EventPageProps {
  params: {
    slug: string;
  };
}

async function getEventData(slug: string) {
  try {
    const qrData = await getQRCodeRedirect(slug);
    
    if (!qrData || qrData.type !== 'event') {
      return null;
    }

    return qrData.data;
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
}

export async function generateMetadata({ params }: EventPageProps) {
  const event = await getEventData(params.slug);

  if (!event) {
    return {
      title: 'Event Not Found',
    };
  }

  return {
    title: `${event.title} | Event`,
    description: event.description || `Join us for ${event.title}`,
    openGraph: {
      title: event.title,
      description: event.description,
      images: event.banner ? [event.banner] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: event.title,
      description: event.description,
      images: event.banner ? [event.banner] : [],
    },
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const event = await getEventData(params.slug);

  if (!event) {
    notFound();
  }

  return <EventPreview event={event} />;
}
