'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface TemplateCategory {
  id: number
  name: string
  image_url: string
  text_color: string
}

/**
 * Home Page - Template Category Selection
 * 
 * Replicates Lit Element frontend home page exactly:
 * - Shows template categories as large image cards in a flex grid
 * - Click category to navigate to template gallery with filter
 * - "Start from scratch" link at bottom
 * - Background image with opacity on left side
 * - Responsive: 5 columns on desktop, 2 columns on mobile
 */
export default function DashboardHomePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [templateCategories, setTemplateCategories] = useState<TemplateCategory[]>([])

  useEffect(() => {
    loadTemplateCategories()
  }, [])

  async function loadTemplateCategories() {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/template-categories?no-pagination=true')
      // const categories = await response.json()
      
      // Mock data matching Lit frontend structure
      const mockCategories: TemplateCategory[] = [
        {
          id: 1,
          name: 'Business',
          image_url: '/placeholder-category.jpg',
          text_color: '#ffffff'
        },
        {
          id: 2,
          name: 'Restaurant',
          image_url: '/placeholder-category.jpg',
          text_color: '#ffffff'
        },
        {
          id: 3,
          name: 'Event',
          image_url: '/placeholder-category.jpg',
          text_color: '#ffffff'
        },
        {
          id: 4,
          name: 'Social',
          image_url: '/placeholder-category.jpg',
          text_color: '#ffffff'
        },
        {
          id: 5,
          name: 'Marketing',
          image_url: '/placeholder-category.jpg',
          text_color: '#ffffff'
        },
      ]
      
      setTemplateCategories(mockCategories)
    } catch (error) {
      console.error('Failed to load template categories:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleStartFromScratch() {
    router.push('/qrcodes/new')
  }

  function handleCategoryClick(category: TemplateCategory) {
    // Navigate to templates page with category filter (matches Lit frontend behavior)
    router.push(`/qrcode-templates?category=${category.id}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen">
      {/* Background Image with Opacity - Left Side (matches Lit frontend) */}
      <div 
        className="absolute inset-0 w-[700px] h-[700px] opacity-40 bg-no-repeat bg-contain bg-left-center pointer-events-none"
        style={{
          backgroundImage: `url('/new-login-background.png')`
        }}
      />

      {/* Main Content - Template Categories (matches Lit frontend layout) */}
      <div className="relative z-10 px-4 py-8 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Template Categories Grid (matches qrcg-new-qrcode-form-adapter.scss) */}
        <div className="flex flex-wrap gap-4">
          {templateCategories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className="relative w-[calc(20%-0.8rem)] pb-[calc(20%-0.8rem)] rounded-[2rem] bg-cover bg-center bg-no-repeat cursor-pointer hover:scale-105 transition-transform max-[900px]:w-[calc(50%-0.5rem)] max-[900px]:pb-[calc(50%-0.5rem)]"
              style={{
                backgroundImage: `url(${category.image_url})`,
                backgroundColor: '#e5e7eb' // fallback color
              }}
              title={category.name}
            >
              {/* Category Name Overlay (matches .category-name) */}
              <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                <div 
                  className="font-bold text-[2.5rem] text-center max-w-[80%] overflow-hidden text-ellipsis whitespace-nowrap"
                  style={{ color: category.text_color }}
                >
                  {category.name}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Start From Scratch Link (matches .start-from-scratch) */}
        <div 
          onClick={handleStartFromScratch}
          className="mt-4 cursor-pointer italic text-gray-700 hover:text-gray-900"
        >
          &gt;&gt; Click here to start from scratch
        </div>
      </div>
    </div>
  )
}
