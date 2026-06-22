'use client'

import { useState } from 'react'
import ChatbotButton from '@/components/landing/chatbot/ChatbotButton'
import Chatbot from '@/components/landing/chatbot/Chatbot'

export default function HomePageChatbot() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)
  return (
    <>
      <ChatbotButton onClick={() => setIsChatbotOpen(true)} />
      <Chatbot isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </>
  )
}
