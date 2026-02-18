import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import MenuPreview from '@/components/public/restaurant-menu/MenuPreview'

async function getRestaurantMenu(slug: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'}/qrcodes/restaurant-menu/${slug}`,
      {
        cache: 'no-store',
      }
    )
    
    if (!res.ok) {
      return null
    }
    
    const data = await res.json()
    return data.data
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
  }
}

export default async function PublicMenuPage({ params }: { params: { slug: string } }) {
  const menu = await getRestaurantMenu(params.slug)

  if (!menu) {
    notFound()
  }

  return <MenuPreview menu={menu} />
}
