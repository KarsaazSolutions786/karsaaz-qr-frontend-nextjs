/**
 * DemoLicenseExplainer Component (T361)
 *
 * Modal explaining demo mode limitations with upgrade CTA.
 * Uses Radix Dialog via the project's ui/dialog component.
 */

'use client'

import React from 'react'
import { Zap, AlertCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export interface DemoLicenseExplainerProps {
  isOpen: boolean
  onClose: () => void
}

const DEMO_LIMITATIONS = [
  'Limited to 5 QR codes',
  'No custom branding or colors',
  'Watermark on generated codes',
  'Basic analytics only',
  'No API access',
]

export function DemoLicenseExplainer({ isOpen, onClose }: DemoLicenseExplainerProps) {
  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <DialogTitle>Demo Mode Active</DialogTitle>
          </div>
          <DialogDescription>
            You are currently using the demo version. Some features are restricted.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <h4 className="text-sm font-medium text-gray-900">Demo limitations:</h4>
          <ul className="space-y-2">
            {DEMO_LIMITATIONS.map(item => (
              <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Continue Demo
          </Button>
          <Button
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            onClick={() => {
              window.location.href = '/plans'
            }}
          >
            <Zap className="w-4 h-4 mr-1.5" />
            Upgrade Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
