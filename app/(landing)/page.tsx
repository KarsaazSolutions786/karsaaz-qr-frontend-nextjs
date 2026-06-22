import HeroSection from '@/components/landing/HeroSection'
import HowItWorks from '@/components/landing/HowItWorks'
import InspirationFeed from '@/components/landing/InspirationFeed'
import LogoQR from '@/components/landing/LogoQR'
import FAQStatic from '@/components/landing/FAQStatic'
import FAQ from '@/components/landing/FAQ'
import PricingStatic from '@/components/landing/PricingStatic'
import Pricing from '@/components/landing/Pricing'
import HomePageChatbot from '@/components/landing/HomePageChatbot'
import { LandingStaticHide } from '@/components/landing/LandingStaticHide'

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
