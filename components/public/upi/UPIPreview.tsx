'use client';

import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Smartphone,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Share2,
  Copy,
  AlertCircle,
  Building2,
  CreditCard,
  Shield,
} from 'lucide-react';
import PreviewHeader from '@/components/public/shared/PreviewHeader';
import PreviewFooter from '@/components/public/shared/PreviewFooter';
import SocialShare from '@/components/public/shared/SocialShare';
import QRCodeBadge from '@/components/public/shared/QRCodeBadge';
import PaymentForm from './PaymentForm';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface UPIData {
  merchantName: string;
  vpa: string;
  merchantCode?: string;
  amount?: number;
  minAmount?: number;
  maxAmount?: number;
  currency?: string;
  transactionNote?: string;
  transactionId?: string;
  logo?: string;
  description?: string;
  allowCustomAmount?: boolean;
  theme?: {
    primaryColor?: string;
    accentColor?: string;
    backgroundColor?: string;
  };
}

interface UPIPreviewProps {
  upiData: UPIData;
}

type PaymentStatus = 'idle' | 'processing' | 'success' | 'failed' | 'pending';

interface PaymentReceipt {
  transactionId: string;
  amount: number;
  note: string;
  timestamp: string;
  merchantName: string;
  vpa: string;
  status: PaymentStatus;
}

const UPI_APPS = [
  { name: 'PhonePe', icon: '📱', packageName: 'com.phonepe.app', color: '#5f259f' },
  { name: 'Google Pay', icon: '💳', packageName: 'com.google.android.apps.nbu.paisa.user', color: '#4285f4' },
  { name: 'Paytm', icon: '💰', packageName: 'net.one97.paytm', color: '#00b9f5' },
  { name: 'BHIM', icon: '🏦', packageName: 'in.org.npci.upiapp', color: '#097ebd' },
  { name: 'Amazon Pay', icon: '🛒', packageName: 'in.amazon.mShop.android.shopping', color: '#ff9900' },
  { name: 'WhatsApp', icon: '💬', packageName: 'com.whatsapp', color: '#25d366' },
];

export default function UPIPreview({ upiData }: UPIPreviewProps) {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [paymentReceipt, setPaymentReceipt] = useState<PaymentReceipt | null>(null);
  const [upiString, setUpiString] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [currentAmount, setCurrentAmount] = useState<number>(upiData.amount || 0);
  const [currentNote, setCurrentNote] = useState<string>(upiData.transactionNote || '');

  const theme = {
    primary: upiData.theme?.primaryColor || '#5f259f',
    accent: upiData.theme?.accentColor || '#00b9f5',
    background: upiData.theme?.backgroundColor || '#f8f9fa',
  };

  useEffect(() => {
    if (currentAmount > 0) {
      generateUPIString(currentAmount, currentNote);
    }
  }, [currentAmount, currentNote]);

  const generateUPIString = (amount: number, note: string) => {
    const params = new URLSearchParams({
      pa: upiData.vpa,
      pn: upiData.merchantName,
      am: amount.toFixed(2),
      cu: upiData.currency || 'INR',
      tn: note || upiData.transactionNote || `Payment to ${upiData.merchantName}`,
    });

    if (upiData.merchantCode) {
      params.append('mc', upiData.merchantCode);
    }

    if (upiData.transactionId) {
      params.append('tr', upiData.transactionId);
    }

    const upiUri = `upi://pay?${params.toString()}`;
    setUpiString(upiUri);
  };

  const handlePaymentInitiate = (amount: number, note: string) => {
    setCurrentAmount(amount);
    setCurrentNote(note);
    generateUPIString(amount, note);
    setPaymentStatus('processing');

    const receipt: PaymentReceipt = {
      transactionId: `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      amount,
      note,
      timestamp: new Date().toISOString(),
      merchantName: upiData.merchantName,
      vpa: upiData.vpa,
      status: 'pending',
    };

    setPaymentReceipt(receipt);
  };

  const handleUPIAppClick = (packageName: string) => {
    if (upiString) {
      window.location.href = upiString;
      
      setTimeout(() => {
        setPaymentStatus('pending');
      }, 2000);
    }
  };

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiData.vpa);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById('upi-qr-code');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `UPI-QR-${upiData.merchantName.replace(/\s+/g, '-')}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    }
  };

  const resetPayment = () => {
    setPaymentStatus('idle');
    setPaymentReceipt(null);
  };

  if (paymentStatus === 'success' && paymentReceipt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <PreviewHeader title="Payment Successful" />
        
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Card className="p-8 text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-12 w-12 text-white" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-8">Your payment has been processed successfully</p>

            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left space-y-4">
              <div className="flex justify-between items-center pb-4 border-b">
                <span className="text-gray-600">Amount Paid</span>
                <span className="text-2xl font-bold text-green-600">₹{paymentReceipt.amount.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Transaction ID</span>
                <span className="font-mono text-sm font-semibold">{paymentReceipt.transactionId}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Paid to</span>
                <span className="font-semibold">{paymentReceipt.merchantName}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">UPI ID</span>
                <span className="font-mono text-sm">{paymentReceipt.vpa}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Date & Time</span>
                <span className="text-sm">{new Date(paymentReceipt.timestamp).toLocaleString('en-IN')}</span>
              </div>
              
              {paymentReceipt.note && (
                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="text-gray-600">Note</span>
                  <span className="text-sm">{paymentReceipt.note}</span>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Button variant="outline" className="flex-1" onClick={() => window.print()}>
                <Download className="mr-2 h-4 w-4" />
                Download Receipt
              </Button>
              <Button className="flex-1" onClick={resetPayment}>
                Make Another Payment
              </Button>
            </div>
          </Card>
        </div>

        <PreviewFooter />
      </div>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100">
        <PreviewHeader title="Payment Failed" />
        
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Card className="p-8 text-center">
            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="h-12 w-12 text-white" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Failed</h1>
            <p className="text-gray-600 mb-8">Your payment could not be processed. Please try again.</p>

            <div className="flex gap-4">
              <Button variant="outline" className="flex-1" onClick={resetPayment}>
                Try Again
              </Button>
              <Button className="flex-1" onClick={() => window.history.back()}>
                Go Back
              </Button>
            </div>
          </Card>
        </div>

        <PreviewFooter />
      </div>
    );
  }

  if (paymentStatus === 'pending' && paymentReceipt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <PreviewHeader title="Payment Pending" />
        
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Card className="p-8 text-center">
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Clock className="h-12 w-12 text-white" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Pending</h1>
            <p className="text-gray-600 mb-8">Please complete the payment in your UPI app</p>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <p className="text-sm text-gray-600 mb-4">Check your UPI app to complete the payment</p>
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-gray-700">Transaction ID:</span>
                <span className="font-mono text-sm font-semibold">{paymentReceipt.transactionId}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                className="w-full"
                onClick={() => setPaymentStatus('success')}
              >
                I've Completed the Payment
              </Button>
              <Button variant="outline" className="w-full" onClick={resetPayment}>
                Cancel Payment
              </Button>
            </div>
          </Card>
        </div>

        <PreviewFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.background }}>
      <PreviewHeader title={`Pay ${upiData.merchantName}`} />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Merchant Info Card */}
        <Card className="p-6 mb-6">
          <div className="flex items-start gap-4">
            {upiData.logo ? (
              <img
                src={upiData.logo}
                alt={upiData.merchantName}
                className="w-20 h-20 rounded-lg object-cover border-2"
                style={{ borderColor: theme.primary }}
              />
            ) : (
              <div
                className="w-20 h-20 rounded-lg flex items-center justify-center text-white text-2xl font-bold"
                style={{ backgroundColor: theme.primary }}
              >
                {upiData.merchantName.charAt(0).toUpperCase()}
              </div>
            )}
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{upiData.merchantName}</h1>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Building2 className="h-4 w-4" />
                <span className="font-mono text-sm">{upiData.vpa}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyUPI}
                  className="h-6 px-2"
                >
                  {copied ? <CheckCircle2 className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
              {upiData.description && (
                <p className="text-gray-700 text-sm">{upiData.description}</p>
              )}
            </div>
          </div>

          {/* Security Badge */}
          <div className="mt-4 pt-4 border-t flex items-center gap-2 text-sm text-gray-600">
            <Shield className="h-4 w-4 text-green-600" />
            <span>Secured by UPI - Certified by NPCI</span>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Payment Form */}
          <div>
            <PaymentForm
              merchantName={upiData.merchantName}
              vpa={upiData.vpa}
              fixedAmount={upiData.amount}
              minAmount={upiData.minAmount}
              maxAmount={upiData.maxAmount}
              currency={upiData.currency}
              allowCustomAmount={upiData.allowCustomAmount ?? true}
              transactionNote={upiData.transactionNote}
              onPaymentInitiate={handlePaymentInitiate}
              isProcessing={paymentStatus === 'processing'}
            />
          </div>

          {/* QR Code & Payment Options */}
          <div className="space-y-6">
            {/* QR Code */}
            {upiString && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                  Scan QR Code to Pay
                </h2>
                
                <div className="bg-white p-4 rounded-lg border-2 flex justify-center" style={{ borderColor: theme.primary }}>
                  <QRCodeSVG
                    id="upi-qr-code"
                    value={upiString}
                    size={200}
                    level="H"
                    includeMargin={true}
                    fgColor={theme.primary}
                  />
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={handleDownloadQR}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      if (navigator.share && upiString) {
                        navigator.share({
                          title: `Pay ${upiData.merchantName}`,
                          text: `Pay ₹${currentAmount} to ${upiData.merchantName}`,
                          url: window.location.href,
                        });
                      }
                    }}
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
              </Card>
            )}

            {/* Pay with UPI App */}
            {upiString && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Pay with UPI App
                </h2>
                
                <div className="grid grid-cols-3 gap-3">
                  {UPI_APPS.map((app) => (
                    <button
                      key={app.name}
                      onClick={() => handleUPIAppClick(app.packageName)}
                      className="flex flex-col items-center gap-2 p-3 rounded-lg border-2 hover:shadow-md transition-all hover:scale-105"
                      style={{ borderColor: theme.primary + '20' }}
                    >
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                        style={{ backgroundColor: app.color + '20' }}
                      >
                        {app.icon}
                      </div>
                      <span className="text-xs font-medium text-gray-700 text-center">
                        {app.name}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-900">
                    Clicking on an app will open it on your device. Complete the payment in the app to finish the transaction.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* How it Works */}
        <Card className="p-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">How UPI Payment Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 font-bold text-blue-600">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Enter Amount</h3>
                <p className="text-sm text-gray-600">Enter the payment amount and optional note</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 font-bold text-blue-600">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Choose Method</h3>
                <p className="text-sm text-gray-600">Scan QR code or click your UPI app</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 font-bold text-blue-600">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Complete Payment</h3>
                <p className="text-sm text-gray-600">Verify and confirm in your UPI app</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Social Share */}
        <div className="mt-6">
          <SocialShare
            url={typeof window !== 'undefined' ? window.location.href : ''}
            title={`Pay ${upiData.merchantName} - Secure UPI Payment`}
          />
        </div>

        {/* QR Code Badge */}
        <div className="mt-6">
          <QRCodeBadge />
        </div>
      </div>

      <PreviewFooter />
    </div>
  );
}
