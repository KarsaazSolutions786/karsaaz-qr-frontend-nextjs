import { PlainEmailLink } from '@/components/common/PlainEmailLink'
/**
 * Purpose: Executes CookiePolicy functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: April 2026
 */
export default function CookiePolicy() {
  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 md:p-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Cookie Policy</h1>

        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. What Are Cookies</h2>
            <p>
              Cookies are small text files that are placed on your device when you visit our
              website. They help us provide you with a better experience by remembering your
              preferences and understanding how you use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              2. How We Use Cookies
            </h2>
            <p>KarsaazQR uses cookies for the following purposes:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>To keep you signed in to your account</li>
              <li>To remember your preferences and settings</li>
              <li>To understand how you use our service</li>
              <li>To improve our website performance</li>
              <li>To provide personalized content and features</li>
              <li>To analyze traffic and usage patterns</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              3. Types of Cookies We Use
            </h2>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3.1 Essential Cookies</h3>
            <p>
              These cookies are necessary for the website to function properly. They enable core
              functionality such as security, authentication, and account access.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              3.2 Performance Cookies
            </h3>
            <p>
              These cookies collect information about how visitors use our website, such as which
              pages are visited most often. This helps us improve how our website works.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              3.3 Functionality Cookies
            </h3>
            <p>
              These cookies allow the website to remember choices you make (such as language or
              region) and provide enhanced features.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              3.4 Targeting/Advertising Cookies
            </h3>
            <p>
              These cookies are used to deliver advertisements that are relevant to you. They also
              limit the number of times you see an advertisement and help measure the effectiveness
              of campaigns.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3.5 Analytics Cookies</h3>
            <p>
              We use analytics cookies to understand how visitors interact with our website. This
              includes tracking page visits, time spent on pages, and navigation patterns.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              4. Third-Party Cookies
            </h2>
            <p>
              In addition to our own cookies, we may also use various third-party cookies to report
              usage statistics, deliver advertisements, and provide other services. These third
              parties include:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Google Analytics - for website analytics</li>
              <li>Payment processors - for secure transactions</li>
              <li>Social media platforms - for social sharing features</li>
              <li>Advertising networks - for targeted advertising</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Managing Cookies</h2>
            <p>You can control and manage cookies in several ways:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>
                <strong>Browser Settings:</strong> Most browsers allow you to refuse or delete
                cookies
              </li>
              <li>
                <strong>Cookie Preferences:</strong> Use our cookie consent tool to manage your
                preferences
              </li>
              <li>
                <strong>Opt-Out Tools:</strong> Use third-party opt-out tools for advertising
                cookies
              </li>
            </ul>
            <p className="mt-4">
              Please note that blocking or deleting cookies may impact your experience on our
              website and limit the features you can access.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Cookie Duration</h2>
            <p>Cookies may be either:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>
                <strong>Session Cookies:</strong> Temporary cookies that expire when you close your
                browser
              </li>
              <li>
                <strong>Persistent Cookies:</strong> Cookies that remain on your device for a set
                period or until you delete them
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Your Consent</h2>
            <p>
              By using our website, you consent to our use of cookies as described in this Cookie
              Policy. You can withdraw your consent at any time by adjusting your browser settings
              or using our cookie preference tool.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              8. Updates to This Policy
            </h2>
            <p>
              We may update this Cookie Policy from time to time to reflect changes in our practices
              or for other operational, legal, or regulatory reasons.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. Contact Us</h2>
            <p>If you have questions about our use of cookies, please contact us at:</p>
            <p className="mt-4">
              <strong>Email:</strong> <PlainEmailLink email="info@karsaazqr.com" /> or
              privacy@karsaazqr.com
              <br />
              <strong>Address:</strong> 85 Great Portland Street, First Floor, London, W1W 7LT,
              United Kingdom
              <br />
              <strong>Phone:</strong> +44 7411 209240
              <br />
              <strong>ICO Registration Number:</strong> ZB891350
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              10. Specific Cookie Details
            </h2>
            <p>Below are examples of cookies we may use:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>
                <strong>Session Cookies:</strong> Keep you logged in during your browsing session
              </li>
              <li>
                <strong>Authentication Cookies:</strong> Verify your identity and account access
              </li>
              <li>
                <strong>Preference Cookies:</strong> Remember your settings and customizations
              </li>
              <li>
                <strong>Analytics Cookies:</strong> Track usage patterns and service improvements
              </li>
              <li>
                <strong>Security Cookies:</strong> Detect fraudulent activity and enhance security
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              11. International Data Transfers
            </h2>
            <p>
              Some cookies may result in data being transferred outside your country of residence.
              We ensure appropriate safeguards are in place for such transfers, in accordance with
              applicable data protection laws.
            </p>
          </section>

          <p className="text-sm text-gray-500 mt-12 pt-8 border-t">
            <strong>Document Version:</strong> 2.0
            <br />
            Last updated: 19 November 2025
          </p>
        </div>
      </div>
    </div>
  )
}
