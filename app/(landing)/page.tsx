'use client'

import { useState } from 'react'
import Hero from '@/components/landing/Hero'
import HowItWorks from '@/components/landing/HowItWorks'
import InspirationFeed from '@/components/landing/InspirationFeed'
import LogoQR from '@/components/landing/LogoQR'
import FAQ from '@/components/landing/FAQ'
import Pricing from '@/components/landing/Pricing'
import ChatbotButton from '@/components/landing/chatbot/ChatbotButton'
import Chatbot from '@/components/landing/chatbot/Chatbot'

/**
 * Purpose: Executes HomePage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: April 2026
 */
export default function HomePage() {
  const [activeType, setActiveType] = useState('PDF')
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)

  return (
    <>
      <Hero activeType={activeType} setActiveType={setActiveType} />
      <HowItWorks />
      <InspirationFeed />
      <LogoQR />
      <FAQ />
      <Pricing />
      <ChatbotButton onClick={() => setIsChatbotOpen(true)} />
      <Chatbot isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </>
  )
}
