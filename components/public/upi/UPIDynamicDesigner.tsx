'use client'

import React, { useState, useMemo } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Building2, Shield, Copy, CheckCircle2, Smartphone, IndianRupee } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface UPIDynamicDesignerProps {
  merchantName: string
  vpa: string
  defaultAmount?: number
  minAmount?: number
  maxAmount?: number
  currency?: string
  transactionNote?: string
  logo?: string
  description?: string
  theme?: {
    primaryColor?: string
    backgroundColor?: string
  }
}

const QUICK_AMOUNTS = [100, 200, 500, 1000, 2000, 5000]

export default function UPIDynamicDesigner({
  merchantName,
  vpa,
  defaultAmount = 0,
  minAmount = 1,
  maxAmount = 100000,
  currency = 'INR',
  transactionNote,
  logo,
  description,
  theme,
}: UPIDynamicDesignerProps) {
  const [amount, setAmount] = useState<number>(defaultAmount)
  const [note, setNote] = useState(transactionNote || '')
  const [copied, setCopied] = useState(false)
  const [step, setStep] = useState<'input' | 'confirm'>('input')

  const primaryColor = theme?.primaryColor || '#5f259f'
  const bgColor = theme?.backgroundColor || '#f8f9fa'

  const upiString = useMemo(() => {
    if (amount > 0) {
      const params = new URLSearchParams({
        pa: vpa,
        pn: merchantName,
        am: amount.toFixed(2),
        cu: currency,
        tn: note || `Payment to ${merchantName}`,
      })
      return `upi://pay?${params.toString()}`
    }
    return ''
  }, [amount, note, vpa, merchantName, currency])

  const handleCopy = () => {
    navigator.clipboard.writeText(vpa)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleProceed = () => {
    if (amount >= minAmount && amount <= maxAmount) {
      setStep('confirm')
    }
  }

  const handlePayWithApp = () => {
    if (upiString) {
      window.location.href = upiString
    }
  }

  const isValidAmount = amount >= minAmount && amount <= maxAmount

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: bgColor }}
    >
      <div className="w-full max-w-md space-y-4">
        {/* Merchant Header */}
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
            {step === 'input' ? (
              <>
                {/* Amount Input */}
                <div className="space-y-2">
                  <Label htmlFor="amount">Enter Amount ({currency})</Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={amount || ''}
                      onChange={e => setAmount(parseFloat(e.target.value) || 0)}
                      className="pl-10 text-2xl h-14 font-semibold"
                      min={minAmount}
                      max={maxAmount}
                    />
                  </div>
                  {amount > 0 && !isValidAmount && (
                    <p className="text-xs text-red-500">
                      Amount must be between ₹{minAmount} and ₹{maxAmount.toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-3 gap-2">
                  {QUICK_AMOUNTS.map(qa => (
                    <button
                      key={qa}
                      onClick={() => setAmount(qa)}
                      className={`py-2 rounded-lg text-sm font-medium border transition-all ${
                        amount === qa ? 'text-white' : 'text-gray-700 hover:border-gray-400'
                      }`}
                      style={
                        amount === qa
                          ? { backgroundColor: primaryColor, borderColor: primaryColor }
                          : {}
                      }
                    >
                      ₹{qa.toLocaleString()}
                    </button>
                  ))}
                </div>

                {/* Note */}
                <div className="space-y-2">
                  <Label htmlFor="note">Note (optional)</Label>
                  <Input
                    id="note"
                    placeholder="What is this payment for?"
                    value={note}
                    onChange={e => setNote(e.target.value)}
                  />
                </div>

                {/* Proceed Button */}
                <Button
                  className="w-full h-12 text-white font-semibold"
                  style={{ backgroundColor: primaryColor }}
                  onClick={handleProceed}
                  disabled={!isValidAmount}
                >
                  Proceed to Pay ₹{amount > 0 ? amount.toLocaleString() : '0'}
                </Button>
              </>
            ) : (
              <>
                {/* Confirmation Step */}
                <div className="text-center py-3 bg-gray-50 rounded-xl">
                  <p className="text-sm text-muted-foreground">Paying</p>
                  <p className="text-3xl font-bold text-gray-900">₹{amount.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground mt-1">to {merchantName}</p>
                  {note && <p className="text-xs text-muted-foreground mt-1">Note: {note}</p>}
                </div>

                {/* Real-time QR Code */}
                {upiString && (
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
                )}
                <p className="text-center text-xs text-muted-foreground">
                  Scan with any UPI app to pay
                </p>

                {/* Pay with App */}
                <Button
                  className="w-full h-12 text-white font-semibold"
                  style={{ backgroundColor: primaryColor }}
                  onClick={handlePayWithApp}
                >
                  <Smartphone className="w-5 h-5 mr-2" />
                  Open UPI App to Pay
                </Button>

                {/* Back Button */}
                <Button variant="outline" className="w-full" onClick={() => setStep('input')}>
                  Change Amount
                </Button>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>Secured by UPI – Certified by NPCI</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">Powered by Karsaaz QR</p>
      </div>
    </div>
  )
}
