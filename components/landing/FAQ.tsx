'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'

/**
 * Purpose: Executes FAQ functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: April 2026
 */
export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(-1) // All closed by default

  const faqs = [
    {
      id: 1,
      question: 'What types of QR codes can I create with KarsaazQR?',
      answer:
        'KarsaazQR supports multiple QR code types including PDF sharing, website links, mobile app downloads, event invitations, image galleries, audio content, discount coupons, and direct website access. Each type is optimized for its specific use case.',
    },
    {
      id: 2,
      question: 'How do I track the performance of my QR codes?',
      answer:
        'Our platform provides comprehensive analytics including scan counts, geographic data, device types, and time-based insights. You can monitor performance in real-time through your dashboard and receive detailed reports.',
    },
    {
      id: 3,
      question: 'Can I customize the design of my QR codes?',
      answer:
        'Yes! KarsaazQR offers extensive customization options including colors, logos, frames, and patterns. You can match your brand identity while maintaining optimal scannability across all devices.',
    },
    {
      id: 4,
      question: 'Is there a limit to how many QR codes I can create?',
      answer:
        'It depends on your plan. Our Basic plan includes 50 QR codes per month, Standard offers 500 per month, and Premium provides unlimited QR code generation. All plans include our core features and analytics.',
    },
    {
      id: 5,
      question: 'How secure are my QR codes and data?',
      answer:
        'Security is our top priority. All QR codes are generated with enterprise-grade encryption, and your data is stored securely with regular backups. We comply with GDPR and other privacy regulations to ensure your information is protected.',
    },
    {
      id: 6,
      question: 'Can I integrate KarsaazQR with my existing tools?',
      answer:
        'Absolutely! KarsaazQR offers API integrations with popular platforms like WordPress, Shopify, Mailchimp, and more. We also provide webhook support and bulk import/export functionality for seamless workflow integration.',
    },
  ]

  /**
   * Purpose: Executes toggleFAQ functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: April 2026
   */
  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index)
  }

  /**
   * Purpose: Executes PlusIcon functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: April 2026
   */
  const PlusIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 6V18M6 12H18" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )

  /**
   * Purpose: Executes MinusIcon functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: April 2026
   */
  const MinusIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M6 12H18" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )

  return (
    <section id="faq" className="py-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            className="text-5xl font-bold mb-4"
            style={{
              background:
                'linear-gradient(90.77deg, #B048B0 9.76%, #A550B9 31.16%, #8073E0 98.02%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Frequently Asked Questions
          </h2>
        </motion.div>

        {/* FAQ Grid Layout */}
        {openIndex === -1 ? (
          // All Closed - Two Column Layout
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={`closed-${faq.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 hover:border-purple-200"
                onClick={() => toggleFAQ(index)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-800 pr-4 flex-1">{faq.question}</h3>
                  <div className="flex-shrink-0">
                    <PlusIcon />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          // One Expanded - Original Two Column Layout
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Left Column - Expanded FAQ */}
            <div className="space-y-6">
              {faqs.map(
                (faq, index) =>
                  openIndex === index && (
                    <motion.div
                      key={`expanded-${faq.id}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                      className="bg-purple-100 rounded-3xl p-8 shadow-lg border border-purple-200"
                    >
                      {/* Question Header */}
                      <div
                        className="flex items-start justify-between cursor-pointer mb-4"
                        onClick={() => toggleFAQ(index)}
                      >
                        <h3 className="text-xl font-semibold text-gray-800 pr-4 flex-1 leading-relaxed">
                          {faq.question}
                        </h3>
                        <div className="flex-shrink-0 mt-1">
                          <MinusIcon />
                        </div>
                      </div>

                      {/* Answer */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        <p className="text-gray-700 text-base leading-relaxed">{faq.answer}</p>
                      </motion.div>
                    </motion.div>
                  )
              )}
            </div>

            {/* Right Column - Collapsed FAQs */}
            <div className="space-y-4">
              {faqs.map(
                (faq, index) =>
                  openIndex !== index && (
                    <motion.div
                      key={`collapsed-${faq.id}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 hover:border-purple-200"
                      onClick={() => toggleFAQ(index)}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-800 pr-4 flex-1">
                          {faq.question}
                        </h3>
                        <div className="flex-shrink-0">
                          <PlusIcon />
                        </div>
                      </div>
                    </motion.div>
                  )
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
