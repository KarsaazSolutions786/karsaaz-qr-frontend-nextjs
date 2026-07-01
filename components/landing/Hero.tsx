'use client'

import Image from 'next/image'
import Link from 'next/link'

/**
 * Purpose: Executes ActiveBorder functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: April 2026
 */
const ActiveBorder = () => (
  <Image
    src="/img/Group 1000004911.png"
    alt="Active item border"
    width={130}
    height={130}
    className="absolute top-1 inset-0  object-contain z-10"
  />
)

/**
 * Purpose: Executes Hero functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: April 2026
 */
export default function Hero({
  activeType,
  setActiveType,
}: {
  activeType: string
  setActiveType: (t: string) => void
}) {
  const qrTypes = [
    { name: 'PDF', icon: 'file' },
    { name: 'Link', icon: 'link' },
    { name: 'Apps', icon: 'mobile' },
    { name: 'Event', icon: 'calendar' },
    { name: 'Image', icon: 'image' },
    // { name: "Audio", icon: "audio" },
    // { name: "Coupon", icon: "coupon" },
    { name: 'Website', icon: 'website' },
  ]

  /**
   * Purpose: Cycle the active QR type via the carousel arrows.
   * Owner/Author: Syed Ashhad
   * Created/Updated: June 2026
   */
  const handleCarouselNav = (direction: 1 | -1) => {
    const currentIndex = qrTypes.findIndex(type => type.name === activeType)
    const safeIndex = currentIndex === -1 ? 0 : currentIndex
    const nextIndex = (safeIndex + direction + qrTypes.length) % qrTypes.length
    const nextType = qrTypes[nextIndex]
    if (nextType) setActiveType(nextType.name)
  }

  return (
    <>
      {/* Full Width Backdrop Image */}
      <div className="absolute inset-x-0 -z-10 h-[932px] w-full -top-20">
        <div className="relative w-full h-full">
          <Image
            src="/img/backdropHero.png"
            alt="Hero backdrop"
            fill
            className="object-cover object-center"
            priority
            quality={90}
          />
        </div>
      </div>

      <div
        id="home"
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10 text-center"
      >
        <div className="grid md:grid-cols-2 gap-16 items-center relative">
          {/* Left Column */}
          <div className="text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
              <span
                style={{
                  background:
                    'linear-gradient(90.77deg, #B048B0 9.76%, #A550B9 31.16%, #8073E0 98.02%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Create & Customize
              </span>
              <span className="text-gray-800 ml-1">Your</span>
              <span className="block text-gray-800">
                Dynamic QR Code with{' '}
                <span
                  style={{
                    background:
                      'linear-gradient(90.77deg, #B048B0 9.76%, #A550B9 31.16%, #8073E0 98.02%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  KarsaazQR
                </span>
              </span>
            </h1>
            <p className="mt-6 text-2xl text-gray-600 max-w-lg">
              Quickly Generate, Control, and Monitor the Performance of Your{' '}
              <span className="text-black font-bold">QR Codes</span>
            </p>
            <div className="mt-10">
              <Link
                href="/guest/create"
                style={{
                  width: '150px',
                  height: '50px',
                  paddingLeft: 20.1,
                  paddingRight: 20.1,
                  paddingTop: 22.05,
                  paddingBottom: 22.05,
                  background:
                    'radial-gradient(ellipse 85.59% 107.08% at 86.30% 87.50%, rgba(0, 0, 0, 0.23) 0%, rgba(0, 0, 0, 0) 86%), radial-gradient(ellipse 83.94% 83.94% at 26.39% 20.83%, rgba(255, 255, 255, 0.41) 0%, rgba(255, 255, 255, 0) 70%, rgba(255, 255, 255, 0) 100%), #8073E0',
                  boxShadow:
                    '3.3924050331115723px 32.227848052978516px 52.582279205322266px rgba(0, 0, 0, 0.20)',
                  borderRadius: 92.44,
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 8.48,
                  display: 'inline-flex',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.70)',
                    fontSize: 15.66,
                    fontFamily: 'Inter',
                    fontWeight: '400',
                    wordWrap: 'break-word',
                    textShadow: '1px 1px 1px rgba(0, 0, 0, 0.25)',
                  }}
                >
                  Generate QR
                </div>
              </Link>
            </div>
          </div>

          {/* Curved Arrow */}
          <div className="absolute top-34 left-[48%] transform -translate-x-1/4 hidden md:block z-10">
            <Image
              src="/img/arrow.png"
              alt="Decorative arrow"
              width={100}
              height={100}
              className="object-contain"
            />
          </div>
          <div className="absolute top-[367px] left-[22.3%] transform -translate-x-1/4 hidden md:block z-10">
            <Image
              src="/img/underline.png"
              alt="Decorative arrow"
              width={115}
              height={115}
              className="object-contain"
            />
          </div>
          {/* Right Column - QR Showcase */}
          <div className="relative flex justify-center items-center hidden md:flex h-[550px] w-full">
            {/* Container for scattered QR codes */}
            <div className="relative w-full h-full">
              {/* 4 - Fades in fourth */}
              <div className="absolute top-8 left-25 transform -rotate-10 qr-hover transition-all duration-300 hover:rotate-6 hover:z-20 opacity-0 animate-fade-in-4">
                <div className="rounded-2xl p-0 transition-shadow">
                  <Image
                    src="/img/qr-showcase/1.png"
                    alt="WhatsApp QR Code"
                    width={120}
                    height={120}
                    className="object-contain rounded-2xl "
                  />
                </div>
              </div>

              {/* 3 - Fades in third */}
              <div className="absolute bottom-76 right-36 transform qr-hover transition-all duration-300 hover:rotate-6 hover:z-20 opacity-0 animate-fade-in-3">
                <div className="rounded-2xl p-0 transition-shadow">
                  <Image
                    src="/img/qr-showcase/5.png"
                    alt="Google QR Code"
                    width={160}
                    height={160}
                    className="object-contain rounded-2xl "
                  />
                </div>
              </div>

              {/* 2 - Fades in second */}
              <div className="absolute bottom-32 left-50 transform rotate-6 qr-hover transition-all duration-300 hover:rotate-2 hover:z-20 opacity-0 animate-fade-in-2">
                <div className="rounded-2xl p-0 transition-shadow">
                  <Image
                    src="/img/qr-showcase/3.png"
                    alt="Purple QR Code"
                    width={180}
                    height={180}
                    className="object-contain rounded-2xl "
                  />
                </div>
              </div>

              {/* 1 - Fades in first */}
              <div className="absolute top-60 right-100 transform  qr-hover transition-all duration-300 hover:-rotate-3 hover:z-20 opacity-0 animate-fade-in-1">
                <div className="rounded-2xl p-0 transition-shadow">
                  <Image
                    src="/img/qr-showcase/2.png"
                    alt="Colorful Google QR Code"
                    width={160}
                    height={160}
                    className="object-contain rounded-2xl"
                  />
                </div>
              </div>

              {/* Subtle background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 to-blue-100/20 rounded-3xl blur-3xl opacity-30"></div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Types Carousel Section */}
      <div className="pb-1">
        <div className="max-w-4xl mx-auto p-4 md:p-6 bg-white/70 backdrop-blur-md rounded-[50px] md:rounded-[102.49px] shadow-lg mt-10">
          <div className="relative">
            {/* Mobile: Grid layout for 2-3 items per row */}
            <div className="md:hidden">
              <div className="grid grid-cols-3 gap-3 md:gap-4">
                {qrTypes.map(type => (
                  <div
                    key={type.name}
                    onClick={() => setActiveType(type.name)}
                    className="flex flex-col items-center space-y-2 text-center cursor-pointer"
                  >
                    <div className="relative">
                      {activeType === type.name && <ActiveBorder />}
                      <div
                        className={`w-16 h-16 md:w-20 md:h-20 flex items-center justify-center transition-opacity duration-300 bg-white rounded-2xl md:rounded-3xl shadow-[3.7074687480926514px_3.7074687480926514px_9.639418601989746px_0px_rgba(230,230,230,0.90)] shadow-[-3.7074687480926514px_-3.7074687480926514px_7.414937496185303px_0px_rgba(255,255,255,0.90)] shadow-[3.7074687480926514px_-3.7074687480926514px_7.414937496185303px_0px_rgba(230,230,230,0.20)] shadow-[-3.7074687480926514px_3.7074687480926514px_7.414937496185303px_0px_rgba(230,230,230,0.20)] shadow-[inset_-0.7414937615394592px_-0.7414937615394592px_1.4829875230789185px_0px_rgba(186,186,211,0.30)] shadow-[inset_0.7414937615394592px_0.7414937615394592px_1.4829875230789185px_0px_rgba(208,208,223,0.30)] ${
                          activeType === type.name
                            ? 'opacity-100'
                            : 'opacity-40 border border-neutral-300'
                        }`}
                      >
                        <Icon type={type.icon} isActive={activeType === type.name} />
                      </div>
                    </div>
                    <p
                      className={`text-xs font-medium transition-colors text-gray-700 ${
                        activeType === type.name ? 'text-purple-600' : ''
                      }`}
                    >
                      {type.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop: Horizontal slider with navigation */}
            <div className="hidden md:flex items-center justify-between">
              <button
                type="button"
                aria-label="Previous QR type"
                onClick={() => handleCarouselNav(-1)}
                className="rounded-full text-purple-600 hover:bg-purple-100/50 transition-colors"
              >
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-center items-center space-x-2">
                  {qrTypes.map(type => (
                    <div
                      key={type.name}
                      onClick={() => setActiveType(type.name)}
                      className="flex flex-col items-center space-y-2 text-center cursor-pointer group min-w-0 flex-shrink-0"
                    >
                      <div className="relative">
                        {activeType === type.name && <ActiveBorder />}
                        <div
                          className={`w-20 h-20 flex items-center justify-center transition-opacity duration-300 bg-white rounded-3xl shadow-[3.7074687480926514px_3.7074687480926514px_9.639418601989746px_0px_rgba(230,230,230,0.90)] shadow-[-3.7074687480926514px_-3.7074687480926514px_7.414937496185303px_0px_rgba(255,255,255,0.90)] shadow-[3.7074687480926514px_-3.7074687480926514px_7.414937496185303px_0px_rgba(230,230,230,0.20)] shadow-[-3.7074687480926514px_3.7074687480926514px_7.414937496185303px_0px_rgba(230,230,230,0.20)] shadow-[inset_-0.7414937615394592px_-0.7414937615394592px_1.4829875230789185px_0px_rgba(186,186,211,0.30)] shadow-[inset_0.7414937615394592px_0.7414937615394592px_1.4829875230789185px_0px_rgba(208,208,223,0.30)] ${
                            activeType === type.name
                              ? 'opacity-100'
                              : 'opacity-40 border border-neutral-300'
                          }`}
                        >
                          <Icon type={type.icon} isActive={activeType === type.name} />
                        </div>
                      </div>
                      <p
                        className={`text-xs font-medium transition-colors text-gray-700 ${
                          activeType === type.name ? 'text-purple-600' : ''
                        }`}
                      >
                        {type.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <button
                type="button"
                aria-label="Next QR type"
                onClick={() => handleCarouselNav(1)}
                className=" rounded-full text-purple-600 hover:bg-purple-100/50 transition-colors"
              >
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Content Section Based on Active Type */}
        <div className="max-w-7xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
          <QRTypeContent activeType={activeType} />
        </div>
      </div>
    </>
  )
}

/**
 * Purpose: Executes Icon functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: April 2026
 */
const Icon = ({ type, isActive }: { type: string; isActive: boolean }) => {
  const iconMap = {
    file: '/icons/proicons_pdf-2.svg',
    link: '/icons/line-md_link.svg',
    mobile: '/icons/circum_mobile-4.svg',
    calendar: '/icons/material-symbols-light_event-note-outline-rounded.svg',
    image: '/icons/mage_image.svg',
    audio: '/icons/Vector.svg', // Using Vector.svg for audio
    coupon: '/icons/hugeicons_coupon-02.svg',
    website: '/icons/streamline-plump_browser-website-1.svg',
  }

  const iconSrc = iconMap[type as keyof typeof iconMap]

  if (!iconSrc) return null

  return (
    <div className="w-8 h-8 transition-colors relative">
      <Image
        src={iconSrc}
        alt={`${type} icon`}
        width={40}
        height={40}
        className="object-contain"
        style={{
          filter: isActive
            ? 'brightness(0) saturate(100%) invert(36%) sepia(88%) saturate(2298%) hue-rotate(258deg) brightness(92%) contrast(92%)' // #7E4CDE active color filter
            : 'brightness(0) saturate(100%)', // Pure black color for inactive icons
        }}
      />
    </div>
  )
}

/**
 * Purpose: Executes QRTypeContent functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: April 2026
 */
const QRTypeContent = ({ activeType }: { activeType: string }) => {
  const qrContent = {
    PDF: {
      title: 'PDF',
      subtitle: 'PDF QR CODE',
      description:
        'Transform your documents into easily scannable PDF QR codes! With KarsaazQR, you can securely share important PDFs by embedding them into custom QR codes.',
      details:
        "Whether you're sharing brochures, eBooks, or official documents, our PDF QR codes ensure that users can access the file instantly, with one simple scan. Enhance your digital document sharing today!",
      buttonText: 'Generate QR code for PDF',
      bgGradient: 'from-red-400 to-orange-500',
      image: '/img/card_imgs/1.png',
    },
    Link: {
      title: 'Link',
      subtitle: 'LINK QR CODE',
      description:
        'Convert any URL into a scannable QR code! Perfect for sharing websites, social media profiles, or any online content instantly.',
      details:
        'Drive traffic to your website, share your portfolio, or promote your social media with ease. Create professional QR codes that redirect users to any link you choose.',
      buttonText: 'Generate QR code for Link',
      bgGradient: 'from-blue-400 to-purple-500',
      image: '/img/card_imgs/2.png',
    },
    Apps: {
      title: 'Apps',
      subtitle: 'APP QR CODE',
      description:
        'Promote your mobile applications with QR codes! Direct users straight to your app store listing for instant downloads.',
      details:
        "Whether it's iOS App Store or Google Play Store, make it easy for users to find and download your apps. Boost your app installation rates with custom QR codes.",
      buttonText: 'Generate QR code for Apps',
      bgGradient: 'from-green-400 to-blue-500',
      image: '/img/card_imgs/3.png',
    },
    Event: {
      title: 'Event',
      subtitle: 'EVENT QR CODE',
      description:
        'Create QR codes for your events! Share event details, calendar invites, or registration links effortlessly.',
      details:
        'Perfect for conferences, workshops, parties, or any gathering. Let attendees quickly access event information, save dates to their calendar, or register instantly.',
      buttonText: 'Generate QR code for Event',
      bgGradient: 'from-purple-400 to-pink-500',
      image: '/img/card_imgs/4.png',
    },
    Image: {
      title: 'Image',
      subtitle: 'IMAGE QR CODE',
      description:
        'Share images instantly with QR codes! Perfect for portfolios, galleries, or any visual content you want to share.',
      details:
        'Upload your images and create QR codes that lead directly to your visual content. Great for photographers, artists, or businesses showcasing products.',
      buttonText: 'Generate QR code for Image',
      bgGradient: 'from-pink-400 to-red-500',
      image: '/img/card_imgs/5.png',
    },
    Audio: {
      title: 'Audio',
      subtitle: 'AUDIO QR CODE',
      description:
        'Share audio content through QR codes! Perfect for music, podcasts, voicemails, or audio instructions.',
      details:
        'Let users instantly access your audio content by scanning a QR code. Great for musicians, podcasters, or businesses providing audio guides.',
      buttonText: 'Generate QR code for Audio',
      bgGradient: 'from-yellow-400 to-orange-500',
      image: '/img/card_imgs/6.png',
    },
    Coupon: {
      title: 'Coupon',
      subtitle: 'COUPON QR CODE',
      description:
        'Create digital coupons with QR codes! Offer discounts, deals, and promotions that customers can easily redeem.',
      details:
        'Boost your marketing campaigns with scannable coupons. Perfect for restaurants, retail stores, or any business offering promotions and discounts.',
      buttonText: 'Generate QR code for Coupon',
      bgGradient: 'from-green-400 to-teal-500',
      image: '/img/card_imgs/7.png',
    },
    Website: {
      title: 'Website',
      subtitle: 'WEBSITE QR CODE',
      description:
        'Promote your website with professional QR codes! Make it easy for customers to visit your online presence.',
      details:
        'Drive traffic to your business website, landing pages, or online store. Perfect for business cards, flyers, or any marketing material.',
      buttonText: 'Generate QR code for Website',
      bgGradient: 'from-indigo-400 to-purple-500',
      image: '/img/card_imgs/8.png',
    },
  }

  const content = qrContent[activeType as keyof typeof qrContent] || qrContent.PDF

  return (
    <div key={activeType} className="transition-all duration-700 ease-in-out">
      <div className="grid md:grid-cols-2 gap-8 items-center rounded-3xl p-8">
        {/* Left Content */}
        <div className="space-y-6 animate-fade-slide-left">
          <div className="transform transition-all duration-500 delay-100">
            <h2 className="text-4xl font-bold text-gray-800 mb-2 transform transition-all duration-500 delay-200">
              {content.title}
            </h2>
            <p className="text-sm font-medium text-gray-500 tracking-wide uppercase transform transition-all duration-500 delay-300">
              {content.subtitle}
            </p>
          </div>

          <div className="space-y-4 transform transition-all duration-500 delay-400">
            <div className="flex items-start space-x-3 transform transition-all duration-500 delay-500">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transform transition-all duration-500 delay-600">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed transform transition-all duration-500 delay-600">
                {content.description}
              </p>
            </div>

            <div className="flex items-start space-x-3 transform transition-all duration-500 delay-700">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transform transition-all duration-500 delay-800">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed transform transition-all duration-500 delay-800">
                {content.details}
              </p>
            </div>
          </div>

          <Link
            href="/guest/create"
            style={{
              minWidth: '200px',
              width: 'auto',
              height: '60px',
              paddingLeft: 20.1,
              paddingRight: 20.1,
              paddingTop: 22.05,
              paddingBottom: 22.05,
              background:
                'radial-gradient(ellipse 85.59% 107.08% at 86.30% 87.50%, rgba(0, 0, 0, 0.23) 0%, rgba(0, 0, 0, 0) 86%), radial-gradient(ellipse 83.94% 83.94% at 26.39% 20.83%, rgba(255, 255, 255, 0.41) 0%, rgba(255, 255, 255, 0) 70%, rgba(255, 255, 255, 0) 100%), #8073E0',
              boxShadow:
                '3.3924050331115723px 32.227848052978516px 52.582279205322266px rgba(0, 0, 0, 0.20)',
              borderRadius: 92.44,
              justifyContent: 'center',
              alignItems: 'center',
              gap: 8.48,
              display: 'inline-flex',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              whiteSpace: 'nowrap',
            }}
            className="hover:scale-105 hover:shadow-2xl transform transition-all duration-500 delay-900 animate-fade-slide-up"
          >
            <div
              style={{
                color: 'rgba(255, 255, 255, 0.90)',
                fontSize: 16,
                fontFamily: 'Inter',
                fontWeight: '500',
                wordWrap: 'break-word',
                textShadow: '1px 1px 1px rgba(0, 0, 0, 0.25)',
              }}
            >
              {content.buttonText}
            </div>
          </Link>
        </div>

        {/* Right Image */}
        <div className="relative flex items-center justify-center animate-fade-slide-right">
          <div className="transform transition-all duration-700 hover:scale-105 delay-300">
            <Image
              src={content.image}
              alt={`${content.title} QR Code Illustration`}
              width={500}
              height={400}
              className="object-contain rounded-2xl shadow-2xl transition-all duration-700"
              sizes="(max-width: 768px) 100vw, 500px"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  )
}


