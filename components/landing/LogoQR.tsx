'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

/**
 * Purpose: Executes LogoQR functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: April 2026
 */
export default function LogoQR() {
  const router = useRouter()

  return (
    <section className="relative py-8 md:py-12 px-4 md:px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Main Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative rounded-2xl md:rounded-3xl px-6 md:px-16 py-6 md:py-2 overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, #8073E0 0%, #B048B0 70.6%)',
          }}
        >
          {/* Background Pattern/Texture (color overlay) */}
          <div className="absolute inset-0 bg-gradient-to-t from-purple-800/20 to-transparent"></div>

          {/* Shining Backdrop Image (on top of color overlay) */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
            <Image
              src="/img/shining.png"
              alt="Decorative backdrop"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Content Grid */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-white text-center lg:text-left"
            >
              <h1 className="text-2xl md:text-3xl lg:text-2xl font-bold mb-4 md:mb-8 leading-relaxed">
                Logo QR - Branded, Smart, Instantly Recognizable
                <br />
              </h1>

              <p className="text-sm md:text-base lg:text-lg mb-6 md:mb-10 text-white/90 leading-relaxed max-w-md mx-auto lg:mx-0">
                Turn your logo into a stylish QR with a unique dot pattern — on-brand and
                scan-perfect.
              </p>

              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/guest/create')}
                className="bg-white text-purple-600 font-medium text-sm md:text-base px-6 md:px-8 py-2.5 md:py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Try Karsaaz QR
              </motion.button>
            </motion.div>

            {/* Right Content - Main QR Code */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative h-[260px] md:h-[320px] lg:h-[380px] flex items-center justify-center order-first lg:order-last"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.6,
                  delay: 0.6,
                  type: 'spring',
                  stiffness: 100,
                }}
                className="flex items-center justify-center"
              >
                <div className="p-2 md:p-6 rounded-2xl transition-all duration-300">
                  <div className="w-[350px] h-[350px] md:w-[560px] md:h-[560px] relative">
                    <Image
                      src="/img/trylogo/1.png"
                      alt="Main QR Code"
                      fill
                      className="object-contain rounded-lg drop-shadow-lg"
                      priority
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
          {/* Decorative Elements */}
          {/* <div className="absolute top-10 right-20 w-16 h-16 bg-white/10 rounded-full blur-xl"></div> */}
          {/* <div className="absolute bottom-10 left-20 w-24 h-24 bg-pink-300/20 rounded-full blur-2xl"></div> */}
        </motion.div>
      </div>
    </section>
  )
}
