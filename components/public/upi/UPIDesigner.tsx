'use client'

import React, { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Building2, Shield, Copy, CheckCircle2, Smartphone } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface UPIDesignerProps {
  merchantName: string
  vpa: string
  amount?: number
  currency?: string
  transactionNote?: string
  logo?: string
  description?: string
  theme?: {
    primaryColor?: string
    backgroundColor?: string
  }
}

const UPI_APPS = [
  { name: 'PhonePe', icon: '📱', color: '#5f259f' },
  { name: 'Google Pay', icon: '💳', color: '#4285f4' },
  { name: 'Paytm', icon: '💰', color: '#00b9f5' },
  { name: 'BHIM', icon: '🏦', color: '#097ebd' },
]

export default function UPIDesigner({
  merchantName,
  vpa,
  amount,
  currency = 'INR',
  transactionNote,
  logo,
  description,
  theme,
}: UPIDesignerProps) {
  const [copied, setCopied] = useState(false)
  const primaryColor = theme?.primaryColor || '#5f259f'
  const bgColor = theme?.backgroundColor || '#f8f9fa'

  const buildUpiString = () => {
    const params = new URLSearchParams({
      pa: vpa,
      pn: merchantName,
      cu: currency,
    })
    if (amount) params.append('am', amount.toFixed(2))
    if (transactionNote) params.append('tn', transactionNote)
    return `upi://pay?${params.toString()}`
  }

  const upiString = buildUpiString()

  const handleCopy = () => {
    navigator.clipboard.writeText(vpa)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePayWithApp = () => {
    window.location.href = upiString
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: bgColor }}
    >
      <div className="w-full max-w-md space-y-4">
        {/* Merchant Card */}
        <Card className="overflow-hidden shadow-xl border-0">
          <div className="px-6 py-5 text-white" style={{ backgroundColor: primaryColor }}>
            <div className="flex items-center gap-4">
              {logo ? (
                <img
                  src={logo}
                  alt={merchantName}
                  className="w-14 h-14 rounded-lg object-cover ring-2 ring-white/20"
                />
              ) : (
                <div className="w-14 h-14 rounded-lg flex items-center justify-center text-xl font-bold bg-white/20">
                  {merchantName.charAt(0)}
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-xl font-bold">{merchantName}</h1>
                <div className="flex items-center gap-1 text-white/80 text-sm">
                  <Building2 className="w-3 h-3" />
                  <span className="font-mono">{vpa}</span>
                  <button onClick={handleCopy} className="ml-1">
                    {copied ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>
            {description && <p className="text-white/70 text-sm mt-3">{description}</p>}
          </div>

          <CardContent className="p-6 space-y-5">
            {/* Amount Display */}
            {amount && (
              <div className="text-center py-3 bg-gray-50 rounded-xl">
                <p className="text-sm text-muted-foreground">Amount to Pay</p>
                <p className="text-3xl font-bold text-gray-900">₹{amount.toFixed(2)}</p>
              </div>
            )}

            {/* QR Code Display */}
            <div className="flex justify-center">
              <div
                className="p-4 bg-white rounded-xl border-2"
                style={{ borderColor: primaryColor }}
              >
                <QRCodeSVG
                  value={upiString}
                  size={180}
                  level="H"
                  includeMargin
                  fgColor={primaryColor}
                />
              </div>
            </div>
            <p className="text-center text-xs text-muted-foreground">
              Scan with any UPI app to pay
            </p>

            {/* Pay Button */}
            <Button
              className="w-full h-12 text-white font-semibold"
              style={{ backgroundColor: primaryColor }}
              onClick={handlePayWithApp}
            >
              <Smartphone className="w-5 h-5 mr-2" />
              Pay with UPI App
            </Button>

            {/* UPI App Options */}
            <div className="grid grid-cols-4 gap-2">
              {UPI_APPS.map(app => (
                <button
                  key={app.name}
                  onClick={handlePayWithApp}
                  className="flex flex-col items-center gap-1 p-2 rounded-lg border hover:shadow-sm transition-all"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                    style={{ backgroundColor: app.color + '15' }}
                  >
                    {app.icon}
                  </div>
                  <span className="text-[10px] font-medium text-gray-600 text-center leading-tight">
                    {app.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2 border-t">
              <Shield className="w-4 h-4 text-green-600" />
              <span>Secured by UPI – Certified by NPCI</span>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">Powered by Karsaaz QR</p>
      </div>
    </div>
  )
}
