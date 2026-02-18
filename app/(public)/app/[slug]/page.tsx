import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import AppPreview from '@/components/public/app-download/AppPreview'

async function getAppData(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'}/qrcodes/app-download/${slug}`, {
      cache: 'no-store',
    })
    
    if (!res.ok) {
      return null
    }
    
    const data = await res.json()
    return data.data
  } catch (error) {
    console.error('Failed to fetch app data:', error)
    return null
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const app = await getAppData(params.slug)

  if (!app) {
    return {
      title: 'App Not Found',
      description: 'The requested app could not be found.',
    }
  }

  return {
    title: `${app.appName || 'App'} - Download Now`,
    description: app.description || `Download ${app.appName} on iOS and Android. ${app.shortDescription || ''}`,
    openGraph: {
      title: app.appName,
      description: app.description || app.shortDescription,
      images: app.icon ? [app.icon] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: app.appName,
      description: app.description || app.shortDescription,
      images: app.icon ? [app.icon] : [],
    },
    keywords: app.keywords || [app.appName, 'app', 'download', 'mobile app'],
  }
}

export default async function PublicAppDownloadPage({ params }: { params: { slug: string } }) {
  const app = await getAppData(params.slug)

  if (!app) {
    notFound()
  }

  return <AppPreview app={app} />
}
