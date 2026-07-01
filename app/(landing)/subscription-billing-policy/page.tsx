import { PlainEmailLink } from '@/components/common/PlainEmailLink'
/**
 * Purpose: Executes SubscriptionBillingPolicy functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: April 2026
 */
export default function SubscriptionBillingPolicy() {
  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 md:p-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Subscription & Billing Policy</h1>

        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              1. Subscription Plans
            </h2>
            <p>
              KarsaazQR offers various subscription plans with different features and pricing.
              Details of each plan are available on our pricing page. By subscribing to a plan, you
              agree to pay the applicable fees.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Billing Cycles</h2>
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              2.1 Monthly Subscriptions
            </h3>
            <p>
              Monthly subscriptions are billed on a recurring basis every 30 days from the date of
              your initial subscription. You will be charged automatically on each billing date
              unless you cancel before the renewal.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              2.2 Annual Subscriptions
            </h3>
            <p>
              Annual subscriptions are billed once per year from the date of your initial
              subscription. Annual plans typically offer savings compared to monthly billing.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Payment Methods</h2>
            <p>We accept the following payment methods:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Credit cards (Visa, Mastercard, American Express)</li>
              <li>Debit cards</li>
              <li>PayPal</li>
              <li>Other payment methods as available in your region</li>
            </ul>
            <p className="mt-4">
              You must provide valid payment information and keep it up to date. You authorize us to
              charge your payment method for all fees incurred.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Automatic Renewal</h2>
            <p>
              Your subscription will automatically renew at the end of each billing cycle unless you
              cancel before the renewal date. You will be charged the then-current subscription fee
              for your plan.
            </p>
            <p className="mt-4">
              We will send you a reminder email before each renewal. It is your responsibility to
              cancel if you do not wish to continue.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Price Changes</h2>
            <p>
              We reserve the right to change our subscription fees at any time. We will provide at
              least 30 days&apos; advance notice of any price changes. If you do not agree to the
              price change, you may cancel your subscription before the change takes effect.
            </p>
            <p className="mt-4">
              Existing subscribers will be grandfathered at their current price for at least one
              full billing cycle after the price change announcement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Failed Payments</h2>
            <p>If your payment fails, we will:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Attempt to charge your payment method again</li>
              <li>Send you a notification about the failed payment</li>
              <li>Provide a grace period to update your payment information</li>
              <li>Suspend your account if payment is not received within the grace period</li>
              <li>Terminate your account if payment issues are not resolved</li>
            </ul>
            <p className="mt-4">
              You are responsible for any fees charged by your bank or payment provider for failed
              transactions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Cancellation</h2>
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">7.1 How to Cancel</h3>
            <p>You may cancel your subscription at any time through:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Your account settings page</li>
              <li>
                Contacting our support team at <PlainEmailLink email="info@karsaazqr.com" />
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              7.2 Effect of Cancellation
            </h3>
            <p>When you cancel:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>
                Your subscription will remain active until the end of the current billing period
              </li>
              <li>You will retain access to all features until the end of the paid period</li>
              <li>You will not be charged for subsequent billing periods</li>
              <li>Your account will be downgraded to the free plan (if available) or closed</li>
              <li>Some data may be deleted according to our data retention policy</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              8. Upgrades and Downgrades
            </h2>
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">8.1 Upgrades</h3>
            <p>You may upgrade your plan at any time. When you upgrade:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>You will be charged the prorated difference immediately</li>
              <li>Your billing date will remain the same</li>
              <li>New features will be available immediately</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">8.2 Downgrades</h3>
            <p>You may downgrade your plan at any time. When you downgrade:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>The change will take effect at the end of your current billing period</li>
              <li>You will retain access to current features until then</li>
              <li>No prorated refund will be issued for the current period</li>
              <li>Some features or data may be limited after the downgrade</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. Free Trials</h2>
            <p>We may offer free trial periods for certain subscription plans. During the trial:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>You have full access to the plan&apos;s features</li>
              <li>You must provide payment information</li>
              <li>You will be automatically charged when the trial ends unless you cancel</li>
              <li>Trial periods are typically limited to one per customer</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">10. Taxes</h2>
            <p>
              All fees are exclusive of taxes. You are responsible for paying all applicable taxes,
              including VAT, sales tax, or other similar taxes, unless you provide a valid tax
              exemption certificate.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              11. Invoices and Receipts
            </h2>
            <p>
              We will provide electronic invoices and receipts for all transactions. You can access
              your billing history and download invoices from your account dashboard.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">12. Disputes</h2>
            <p>
              If you have a billing dispute, you must notify us within 60 days of the charge. We
              will investigate and work with you to resolve the issue. Failure to notify us within
              this timeframe waives your right to dispute the charge.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">13. Usage Limits</h2>
            <p>
              Each subscription plan has specific usage limits (e.g., number of QR codes, scans per
              month). If you exceed these limits:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>You may be asked to upgrade to a higher plan</li>
              <li>Additional usage fees may apply</li>
              <li>Service may be temporarily restricted</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              14. Contact Information
            </h2>
            <p>For billing questions or support, contact us at:</p>
            <p className="mt-4">
              <strong>Email:</strong> <PlainEmailLink email="info@karsaazqr.com" /> or
              billing@karsaazqr.com
              <br />
              <strong>Address:</strong> 85 Great Portland Street, First Floor, London, W1W 7LT,
              United Kingdom
              <br />
              <strong>Phone:</strong> +44 7411 209240
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              15. Currency and Exchange Rates
            </h2>
            <p>
              Prices are displayed in GBP (British Pounds Sterling) unless otherwise stated. If you
              pay in a different currency, the exchange rate applied will be determined by your
              payment provider or credit card company.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">16. Payment Security</h2>
            <p>
              All payment information is processed securely through our third-party payment
              processors. We do not store your full credit card details on our servers. All
              transactions are encrypted using industry-standard SSL/TLS protocols.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              17. Right to Modify Terms
            </h2>
            <p>
              We reserve the right to modify this Subscription & Billing Policy at any time.
              Material changes will be communicated to active subscribers with reasonable advance
              notice. Continued use of the service after changes constitutes acceptance of the
              updated policy.
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
