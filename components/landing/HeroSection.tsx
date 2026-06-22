'use client'

import { useState } from 'react'
import Hero from '@/components/landing/Hero'

export default function HeroSection() {
  const [activeType, setActiveType] = useState('PDF')
  return <Hero activeType={activeType} setActiveType={setActiveType} />
}
