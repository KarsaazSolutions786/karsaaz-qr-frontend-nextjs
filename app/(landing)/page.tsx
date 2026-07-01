import HeroSection from '@/components/landing/HeroSection'
import HowItWorks from '@/components/landing/HowItWorks'
import InspirationFeed from '@/components/landing/InspirationFeed'
import LogoQR from '@/components/landing/LogoQR'
import FAQStatic from '@/components/landing/FAQStatic'
import PricingStatic from '@/components/landing/PricingStatic'
import dynamic from 'next/dynamic'
import { LandingStaticHide } from '@/components/landing/LandingStaticHide'

const FAQ = dynamic(() => import('@/components/landing/FAQ'), {
  ssr: false,
  loading: () => null,
})

const Pricing = dynamic(() => import('@/components/landing/Pricing'), {
  ssr: false,
  loading: () => null,
})

const HomePageChatbot = dynamic(() => import('@/components/landing/HomePageChatbot'), {
  ssr: false,
  loading: () => null,
})

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HowItWorks />
      <InspirationFeed />
      <LogoQR />
      <FAQStatic />
      <LandingStaticHide targetId="faq-ssr" />
      <FAQ />
      <PricingStatic />
      <LandingStaticHide targetId="pricing-ssr" />
      <Pricing />
      <HomePageChatbot />
    </>
  )
}
