const FAQ_ITEMS: Array<{ q: string; a: string }> = [
  {
    q: 'What types of QR codes can I create with KarsaazQR?',
    a: 'KarsaazQR supports multiple QR code types including PDF sharing, website links, mobile app downloads, event invitations, image galleries, audio content, discount coupons, and direct website access.',
  },
  {
    q: 'How do I track the performance of my QR codes?',
    a: 'Our platform provides comprehensive analytics including scan counts, geographic data, device types, and time-based insights.',
  },
  {
    q: 'Can I customize the design of my QR codes?',
    a: 'Yes! KarsaazQR offers extensive customization options including colors, logos, frames, and patterns.',
  },
  {
    q: 'Is there a limit to how many QR codes I can create?',
    a: 'Limits depend on your plan. Trial, Starter, Lite, and Pro tiers offer increasing QR code quotas.',
  },
  {
    q: 'How secure are my QR codes and data?',
    a: 'All QR codes use enterprise-grade encryption. We comply with GDPR and UK data protection regulations.',
  },
  {
    q: 'Can I integrate KarsaazQR with my existing tools?',
    a: 'KarsaazQR offers API integrations with popular platforms and webhook support.',
  },
]

/** SSR FAQ with answers in HTML (audit F-21). Hidden after client FAQ hydrates. */
export default function FAQStatic() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section
        id="faq-ssr"
        className="py-20 px-6 bg-gray-50"
        aria-label="Frequently asked questions"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-900">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {FAQ_ITEMS.map((item, i) => (
              <details key={i} className="rounded-2xl border border-gray-200 bg-white p-4">
                <summary className="cursor-pointer text-lg font-medium text-gray-800">
                  {item.q}
                </summary>
                <p className="mt-3 text-gray-700 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
