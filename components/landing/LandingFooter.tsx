"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer
      id="contact"
      className="relative bg-[#1E1E1E] text-white px-4 sm:px-6 md:px-8 lg:px-12 py-10 bg-no-repeat bg-right-bottom bg-contain"
    >
      {/* Top grid */}
      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8">
        {/* Brand / About */}
        <div className="lg:col-span-3 sm:pr-8 lg:pr-12 text-center sm:text-left">
          <div className=" font-bold mb-3 flex items-center justify-center sm:justify-start gap-2">
            <Link href="/" className="flex items-center">
              <Image
                src="/img/logo-white.png"
                alt="KarsaazQR Logo"
                width={200}
                height={64}
                className="h-16 w-auto"
                priority
              />
            </Link>
          </div>
          <p className="font-['Poppins'] text-gray-300 text-[14px] sm:text-[15px] leading-relaxed">
            Your ultimate QR code solution for businesses. Create custom QR
            codes, track analytics, and manage your digital presence with
            advanced features including logo integration, time scheduling, and
            lead generation.
          </p>
        </div>

        {/* Legal */}
        <div className="lg:col-span-3 flex justify-center sm:justify-start lg:justify-center">
          <div className="w-full sm:w-max text-center sm:text-left">
            <h3 className="font-semibold text-lg sm:text-xl mb-3">Legal</h3>
            <ul className="space-y-2 font-['Poppins'] text-gray-300 leading-relaxed font-medium">
              {[
                { href: "/terms", label: "Terms of Service" },
                { href: "/privacy-policy", label: "Privacy Policy" },
                { href: "/refund-policy", label: "Refund Policy" },
                { href: "/cookie-policy", label: "Cookie Policy" },
                { href: "/disclaimer-policy", label: "Disclaimer Policy" },
                { href: "/au-policy", label: "Acceptable Use Policy" },
                {
                  href: "/subscription-billing-policy",
                  label: "Subscription & Billing Policy",
                },
              ].map((x) => (
                <li key={x.href} className="text-[14px]">
                  <Link
                    href={x.href}
                    className="hover:text-purple-600 transition-colors"
                  >
                    {x.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Company */}
        <div className="lg:col-span-3 flex justify-center sm:justify-start lg:justify-center">
          <div className="w-full sm:w-max text-center sm:text-left">
            <h3 className="font-semibold text-lg sm:text-xl mb-3">Company</h3>
            <ul className="space-y-2 font-['Poppins'] text-gray-300 font-medium">
              {[
                { href: "/", label: "Home" },
                { href: "/#how-to", label: "How It Works" },
                { href: "/#faq", label: "FAQs" },
                { href: "/#pricing", label: "Pricing Plan" },
              ].map((x) => (
                <li key={x.href} className="text-[14px]">
                  <Link
                    href={x.href}
                    className="hover:text-purple-600 transition-colors"
                  >
                    {x.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div> 
        {/* Links + Social */}
        <div className="lg:col-span-3 flex flex-col items-center sm:items-start">
          <div className="w-full sm:w-max text-center sm:text-left">
            {/* <h3 className="font-semibold text-lg sm:text-xl mb-3">Links</h3>
            <ul className="space-y-2 font-['Poppins'] text-gray-300 font-medium">
              <li>
                <a
                  href="https://www.iafcertsearch.org/certified-entity/FKORrk6uJKVv3P5JrlKAw7kZ"
                  className="hover:text-purple-600"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  IAF Certification Validation - IAF CertSearch
                </a>
              </li>
            </ul> */}

            {/* Social */}
            <div className="mt-6">
              <div className="flex justify-center sm:justify-start gap-4">
                <a
                  href="https://www.facebook.com/karsaazqr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center bg-gray-700 hover:bg-blue-600 transition-colors"
                >
                  <svg
                    className="w-5 h-5 lg:w-6 lg:h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.675 0h-21.35C.589 0 0 .589 0 1.325v21.351C0 23.411.589 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h5.713c.737 0 1.325-.589 1.325-1.325V1.325C24 .589 23.411 0 22.675 0z" />
                  </svg>
                </a>

                <a
                  href="https://www.instagram.com/karsaazqr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center bg-gray-700 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500 transition-all"
                >
                  <svg
                    className="w-5 h-5 lg:w-6 lg:h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.012 3.584-.07 4.85c-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.85s.012-3.584.07-4.85c.148-3.225 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0 1.802C9.042 3.965 8.769 3.977 7.371 4.03c-2.432.11-3.665 1.344-3.775 3.775-.053 1.398-.064 1.67-.064 4.195s.011 2.797.064 4.195c.11 2.432 1.343 3.665 3.775 3.775 1.398.053 1.67.064 4.195.064s2.797-.011 4.195-.064c2.432-.11 3.665-1.343 3.775-3.775.053-1.398.064-1.67.064-4.195s-.011-2.797-.064-4.195c-.11-2.432-1.343-3.665-3.775-3.775C15.231 3.977 14.958 3.965 12 3.965zM12 6.837c-2.839 0-5.163 2.324-5.163 5.163s2.324 5.163 5.163 5.163 5.163-2.324 5.163-5.163S14.839 6.837 12 6.837zm0 8.533c-1.861 0-3.37-1.509-3.37-3.37s1.509-3.37 3.37-3.37 3.37 1.509 3.37 3.37-1.509 3.37-3.37 3.37zM18.802 6.002c-.618 0-1.118.5-1.118 1.118s.5 1.118 1.118 1.118 1.118-.5 1.118-1.118-.5-1.118-1.118-1.118z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8 border-t border-gray-700 mt-10 pt-6">
        {/* Copyright */}
        <div className="lg:col-span-3 text-center sm:text-left">
          <p className="text-[14px]">
            Copyright KarsaazEBS <span className="text-xl">®️</span> 2025
          </p>
        </div>

        {/* Address */}
        <div className="lg:col-span-3 flex justify-center sm:justify-start lg:justify-end">
          <div className="sm:w-max text-center sm:text-left">
            <div className="flex items-start gap-2 text-gray-300 font-['Poppins'] text-[14px] leading-relaxed justify-center sm:justify-start">
              <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span>
                85 Great Portland Street, First Floor,
                <br />
                London, W1W 7LT, United Kingdom
              </span>
            </div>
          </div>
        </div>

        {/* Phone */}
        {/* <div className="lg:col-span-3 flex justify-center sm:justify-start lg:justify-end">
          <div className="sm:w-max text-center sm:text-left">
            <div className="flex items-start gap-2 text-gray-300 font-['Poppins'] text-[14px] leading-relaxed justify-center sm:justify-start">
              <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <a
                href="https://wa.me/447411209240"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-purple-600 transition-colors"
              >
                +44 7411 209240
                <br />
                <span className="text-gray-400">
                  (WhatsApp) · Mon–Fri 9am–6pm, UK time
                </span>
              </a>
            </div>
          </div>
        </div> */}

        {/* Email */}
        <div className="lg:col-span-3 flex justify-center sm:justify-start lg:justify-end">
          <div className="sm:w-max text-center sm:text-left">
            <div className="flex items-start gap-2 text-gray-300 font-['Poppins'] text-[14px] leading-relaxed justify-center sm:justify-start">
              <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <a
                href="mailto:info@karsaazQR.com"
                className="hover:text-purple-600 transition-colors"
              >
                info@karsaazQR.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Legal line */}
      <div className="text-center mt-10 sm:mt-12 text-[12px] sm:text-[13px] leading-relaxed px-2 text-gray-300">
        <p>
          © 2025 Karsaaz EBS | A Globally Certified & UK-Trademarked Technology
          Group | Certified under International ISO & GDPR Standards | A Product
          of Karsaaz EBS | www.karsaazebs.com
        </p>
      </div>
    </footer>
  );
}

