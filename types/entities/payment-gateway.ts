export interface PaymentGateway {
  id: number;
  name: string;
  slug: string;
  enabled: boolean;
  mode: 'sandbox' | 'live';
  settings: Record<string, string>;
  webhook_url?: string;
  supports_recurring: boolean;
  created_at: string;
  updated_at: string;
}

export type PaymentProcessorSlug =
  | 'stripe' | 'paypal' | 'razorpay' | 'paystack' | 'flutterwave'
  | 'mercadopago' | 'mollie' | '2checkout' | 'alipay' | 'payfast'
  | 'payu-international' | 'payu-latam' | 'paddle' | 'xendit'
  | 'yookassa' | 'dintero' | 'paykickstart' | 'paytr' | 'postfinance'
  | 'orange-bf' | 'offline' | 'fib';

export interface ProcessorFormField {
  name: string;
  label: string;
  type: 'text' | 'password' | 'select' | 'toggle';
  required: boolean;
  options?: { value: string; label: string }[];
}
