/**
 * Purpose: Executes PrivacyPolicy functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: April 2026
 */
export default function PrivacyPolicy() {
  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 md:p-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Privacy Policy
        </h1>

        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              1. Introduction
            </h2>
            <p>
              KarsaazQR (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or
              &ldquo;us&rdquo;) is committed to protecting your privacy. This
              Privacy Policy explains how we collect, use, disclose, and
              safeguard your information when you use our QR code generation and
              management service.
            </p>
            <p className="mt-4">
              We are registered with the Information Commissioner&apos;s Office
              (ICO) under registration number ZB891350 and comply with the UK
              General Data Protection Regulation (UK GDPR), the Data Protection
              Act 2018, and other applicable data protection laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              2. Information We Collect
            </h2>
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              2.1 Personal Information
            </h3>
            <p>
              We may collect personal information that you voluntarily provide
              to us when you:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Register for an account or sign up for our service</li>
              <li>Use our QR code generation and management services</li>
              <li>Subscribe to our newsletter or marketing communications</li>
              <li>Contact us for customer support or inquiries</li>
              <li>Participate in surveys, promotions, or contests</li>
              <li>Provide feedback or reviews</li>
            </ul>
            <p className="mt-4">This information may include:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Full name and email address</li>
              <li>Company name, business information, and website</li>
              <li>
                Payment and billing information (processed securely through
                third-party payment processors)
              </li>
              <li>
                QR code content, design preferences, and customization data
              </li>
              <li>
                Analytics data including scan statistics and geographic
                information
              </li>
              <li>Communication preferences and marketing consent</li>
              <li>Profile information and account settings</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              2.2 Automatically Collected Information
            </h3>
            <p>
              When you access our Service, we automatically collect certain
              information, including:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>
                IP address, device information, and unique device identifiers
              </li>
              <li>Browser type, version, and operating system</li>
              <li>Usage data, page views, and interaction analytics</li>
              <li>Referral sources and navigation paths</li>
              <li>Time zone settings and geographic location data</li>
              <li>Cookies and similar tracking technologies</li>
              <li>
                QR code scan data (when, where, and how codes are scanned)
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              2.3 QR Code Scan Analytics
            </h3>
            <p>
              When someone scans a QR code created through our service, we may
              collect:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Date, time, and frequency of scans</li>
              <li>Geographic location data (city, country)</li>
              <li>Device type and operating system of the scanner</li>
              <li>Referral information and user agent data</li>
            </ul>
            <p className="mt-4">
              This data is aggregated and used to provide you with analytics
              about your QR code performance. Individual scanner identities are
              not tracked or stored.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              3. How We Use Your Information
            </h2>
            <p>We use the information we collect for the following purposes:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Provide, maintain, improve, and personalize our services</li>
              <li>Process your transactions and manage your account</li>
              <li>Generate, customize, and manage QR codes</li>
              <li>Provide analytics and insights about QR code performance</li>
              <li>Send you technical notices, updates, and support messages</li>
              <li>
                Respond to your comments, questions, and customer service
                requests
              </li>
              <li>
                Send marketing communications (with your explicit consent)
              </li>
              <li>Monitor and analyze usage trends and user preferences</li>
              <li>
                Detect, prevent, and address technical issues, fraud, and
                security threats
              </li>
              <li>Comply with legal obligations and enforce our terms</li>
              <li>Conduct research and development for service improvements</li>
              <li>
                Fulfill any other purpose disclosed to you at the time of
                collection
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              4. Legal Basis for Processing (GDPR)
            </h2>
            <p>
              Under the UK GDPR, we process your personal data based on the
              following legal grounds:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>
                <strong>Contract Performance:</strong> Processing necessary to
                provide our services and fulfill our contractual obligations to
                you
              </li>
              <li>
                <strong>Consent:</strong> You have given explicit consent for
                marketing communications and certain data processing activities
              </li>
              <li>
                <strong>Legitimate Interests:</strong> Processing necessary for
                our legitimate business interests, such as improving services
                and fraud prevention
              </li>
              <li>
                <strong>Legal Obligation:</strong> Processing necessary to
                comply with legal requirements and regulations
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              5. Data Sharing and Disclosure
            </h2>
            <p>We may share your information in the following circumstances:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>
                <strong>Service Providers:</strong> With trusted third-party
                vendors who perform services on our behalf (hosting, analytics,
                payment processing, customer support), bound by confidentiality
                agreements
              </li>
              <li>
                <strong>Business Transfers:</strong> In connection with a
                merger, acquisition, reorganization, or sale of assets, with
                advance notice to users
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law, court
                order, or government request, or to protect our rights,
                property, and safety
              </li>
              <li>
                <strong>With Your Consent:</strong> When you have given us
                explicit permission to share specific information
              </li>
              <li>
                <strong>Aggregated Data:</strong> We may share anonymized,
                aggregated data that cannot identify individuals
              </li>
            </ul>
            <p className="mt-4">
              <strong>
                We do not sell, rent, or trade your personal information to
                third parties for their marketing purposes.
              </strong>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              6. International Data Transfers
            </h2>
            <p>
              Your information may be transferred to and processed in countries
              outside of your country of residence, including countries that may
              not have the same data protection laws. When we transfer data
              internationally, we ensure appropriate safeguards are in place,
              including:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>
                Standard Contractual Clauses approved by the European Commission
              </li>
              <li>Adequacy decisions recognizing equivalent data protection</li>
              <li>Other lawful transfer mechanisms as required</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              7. Data Security
            </h2>
            <p>
              We implement appropriate technical and organizational security
              measures to protect your personal information against unauthorized
              access, alteration, disclosure, or destruction, including:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>
                Encryption of data in transit and at rest using
                industry-standard protocols
              </li>
              <li>
                Secure socket layer (SSL/TLS) technology for data transmission
              </li>
              <li>Regular security assessments and vulnerability testing</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Employee training on data protection and security</li>
              <li>Regular backups and disaster recovery procedures</li>
            </ul>
            <p className="mt-4">
              However, no method of transmission over the Internet or electronic
              storage is 100% secure. While we strive to protect your personal
              information, we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              8. Your Rights (GDPR & Data Protection)
            </h2>
            <p>
              If you are a resident of the UK, European Economic Area (EEA), or
              other jurisdictions with data protection laws, you have the
              following rights:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>
                <strong>Right to Access:</strong> Request copies of your
                personal data and information about how we process it
              </li>
              <li>
                <strong>Right to Rectification:</strong> Request correction of
                inaccurate or incomplete personal data
              </li>
              <li>
                <strong>Right to Erasure:</strong> Request deletion of your
                personal data under certain circumstances
              </li>
              <li>
                <strong>Right to Restrict Processing:</strong> Request
                restriction of processing your data in specific situations
              </li>
              <li>
                <strong>Right to Data Portability:</strong> Request transfer of
                your data in a structured, machine-readable format
              </li>
              <li>
                <strong>Right to Object:</strong> Object to our processing of
                your data based on legitimate interests or for direct marketing
              </li>
              <li>
                <strong>Right to Withdraw Consent:</strong> Withdraw consent at
                any time where we rely on consent for processing
              </li>
              <li>
                <strong>Right to Lodge a Complaint:</strong> File a complaint
                with the ICO or your local data protection authority
              </li>
            </ul>
            <p className="mt-4">
              To exercise any of these rights, please contact us using the
              details below. We will respond to your request within one month,
              or inform you if we need additional time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              9. Data Retention
            </h2>
            <p>
              We retain your personal information for as long as necessary to
              fulfill the purposes outlined in this Privacy Policy, unless a
              longer retention period is required or permitted by law. Retention
              periods vary based on:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>The type of data and purpose of processing</li>
              <li>Legal, regulatory, or contractual obligations</li>
              <li>Your account status (active or inactive)</li>
              <li>Business and operational needs</li>
            </ul>
            <p className="mt-4">
              When we no longer need your data, we will securely delete or
              anonymize it. You may request deletion of your data at any time,
              subject to legal retention requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              10. Cookies and Tracking Technologies
            </h2>
            <p>
              We use cookies and similar tracking technologies to track activity
              on our Service and store certain information. You can instruct
              your browser to refuse all cookies or to indicate when a cookie is
              being sent. However, if you do not accept cookies, some parts of
              our Service may not function properly.
            </p>
            <p className="mt-4">
              For detailed information about our cookie usage, please see our
              separate Cookie Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              11. Third-Party Services and Links
            </h2>
            <p>
              Our Service may contain links to third-party websites or integrate
              with third-party services. We are not responsible for the privacy
              practices of these third parties. We encourage you to review their
              privacy policies before providing any personal information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              12. Children&apos;s Privacy
            </h2>
            <p>
              Our Service is not intended for children under 18 years of age. We
              do not knowingly collect personal information from children under
              18. If you are a parent or guardian and believe your child has
              provided us with personal information, please contact us
              immediately, and we will delete such information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              13. Marketing Communications
            </h2>
            <p>
              With your consent, we may send you marketing emails about our
              products, services, and promotions. You can opt out of marketing
              communications at any time by:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Clicking the unsubscribe link in any marketing email</li>
              <li>Adjusting your preferences in your account settings</li>
              <li>Contacting us directly to opt out</li>
            </ul>
            <p className="mt-4">
              Please note that even if you opt out of marketing communications,
              we will still send you essential service-related messages.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              14. California Privacy Rights (CCPA)
            </h2>
            <p>
              If you are a California resident, you have specific rights under
              the California Consumer Privacy Act (CCPA), including:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>
                Right to know what personal information we collect and how we
                use it
              </li>
              <li>Right to request deletion of your personal information</li>
              <li>
                Right to opt out of the sale of personal information (we do not
                sell data)
              </li>
              <li>
                Right to non-discrimination for exercising your privacy rights
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              15. Changes to This Privacy Policy
            </h2>
            <p>
              We may update our Privacy Policy from time to time to reflect
              changes in our practices, technology, legal requirements, or other
              factors. We will notify you of any material changes by:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Posting the new Privacy Policy on this page</li>
              <li>Updating the &ldquo;Last updated&rdquo; date</li>
              <li>
                Sending you an email notification (for significant changes)
              </li>
            </ul>
            <p className="mt-4">
              We encourage you to review this Privacy Policy periodically. Your
              continued use of our Service after changes are posted constitutes
              acceptance of the updated Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              16. Contact Us & Data Protection Officer
            </h2>
            <p>
              If you have any questions, concerns, or requests about this
              Privacy Policy or our data practices, or if you wish to exercise
              your data protection rights, please contact us at:
            </p>
            <p className="mt-4">
              <strong>Email:</strong> info@karsaazqr.com or
              privacy@karsaazqr.com
              <br />
              <strong>Address:</strong> 85 Great Portland Street, First Floor,
              London, W1W 7LT, United Kingdom
              <br />
              <strong>Phone:</strong> +44 7411 209240
              <br />
              <strong>ICO Registration Number:</strong> ZB891350
            </p>
            <p className="mt-4">
              <strong>Supervisory Authority:</strong> If you are not satisfied
              with our response, you have the right to lodge a complaint with
              the Information Commissioner&apos;s Office (ICO) at{" "}
              <a
                href="https://ico.org.uk"
                className="text-blue-600 hover:underline"
              >
                www.ico.org.uk
              </a>
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
  );
}

