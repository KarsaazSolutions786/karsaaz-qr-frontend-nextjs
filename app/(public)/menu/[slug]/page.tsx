import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import MenuPreview from '@/components/public/restaurant-menu/MenuPreview'
import { getQRCodeRedirect, trackQRView } from '@/lib/api/public-qrcodes'

async function getRestaurantMenu(slug: string) {
  try {
    const qrData = await getQRCodeRedirect(slug)
    
    if (!qrData || !qrData.data) {
      return null
    }
    
    // Validate type is 'restaurant-menu' or 'menu'
    if (qrData.type !== 'restaurant-menu' && qrData.type !== 'menu') {
      return null
    }
    
    trackQRView(slug)
    
    return qrData.data
  } catch (error) {
    console.error('Failed to fetch restaurant menu:', error)
    return null
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const menu = await getRestaurantMenu(params.slug)

  if (!menu) {
    return {
      title: 'Menu Not Found',
    }
  }

  return {
    title: `${menu.restaurantName || 'Restaurant'} Menu`,
    description: menu.description || `View the menu for ${menu.restaurantName}`,
    openGraph: {
      title: `${menu.restaurantName || 'Restaurant'} Menu`,
      description: menu.description || `View the menu for ${menu.restaurantName}`,
      images: menu.logo ? [menu.logo] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${menu.restaurantName || 'Restaurant'} Menu`,
      description: menu.description || `View the menu for ${menu.restaurantName}`,
      images: menu.logo ? [menu.logo] : [],
    },
  }
}

export default async function PublicMenuPage({ params }: { params: { slug: string } }) {
  const menu = await getRestaurantMenu(params.slug)

  if (!menu) {
    notFound()
  }

  return <MenuPreview menu={menu} />
}
