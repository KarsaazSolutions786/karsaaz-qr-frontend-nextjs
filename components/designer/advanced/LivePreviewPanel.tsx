'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { QRCodeSVG } from 'qrcode.react'
import type { QRDesign } from './types'
import { useTranslation } from '@/lib/i18n'

interface LivePreviewPanelProps {
  design: QRDesign
  qrData: string
}

/**
 * Purpose: Executes LivePreviewPanel functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export default function LivePreviewPanel({ design, qrData }: LivePreviewPanelProps) {
  const { t } = useTranslation()
  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>{t('Live Preview')}</CardTitle>
        <CardDescription>{t('See your changes in real-time')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 flex items-center justify-center">
          <div
            className="bg-white p-4 rounded-lg"
            style={{
              boxShadow: design.shadow?.enabled
                ? `${design.shadow.offsetX}px ${design.shadow.offsetY}px ${design.shadow.blur}px ${design.shadow.spread}px ${design.shadow.color}${Math.round(
                    design.shadow.opacity * 2.55
                  )
                    .toString(16)
                    .padStart(2, '0')}`
                : '0 10px 15px -3px rgb(0 0 0 / 0.1)',
              outline: design.stroke?.enabled
                ? `${design.stroke.width}px solid ${design.stroke.color}${Math.round(
                    design.stroke.opacity * 2.55
                  )
                    .toString(16)
                    .padStart(2, '0')}`
                : undefined,
              transform: design.depth?.enabled
                ? `perspective(${design.depth.perspective}px) rotateX(${design.depth.rotateX}deg) rotateY(${design.depth.rotateY}deg)`
                : undefined,
              transition: 'all 0.3s ease',
            }}
          >
            <QRCodeSVG
              value={qrData || 'https://karsaaz.com'}
              size={200}
              bgColor={design.backgroundColor}
              fgColor={design.foregroundColor}
              level={design.errorCorrectionLevel}
              imageSettings={
                design.logo?.url
                  ? {
                      src: design.logo.url,
                      height: design.logo.size,
                      width: design.logo.size,
                      excavate: true,
                    }
                  : undefined
              }
            />
          </div>
        </div>
        <div className="mt-4 space-y-2 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>{t('Shape:')}</span>
            <span className="font-medium text-foreground capitalize">{design.moduleShape}</span>
          </div>
          <div className="flex justify-between">
            <span>{t('Colors:')}</span>
            <div className="flex gap-1">
              <div
                className="w-4 h-4 rounded border"
                style={{ backgroundColor: design.foregroundColor }}
              />
              <div
                className="w-4 h-4 rounded border"
                style={{ backgroundColor: design.backgroundColor }}
              />
            </div>
          </div>
          {design.gradient && design.gradient.type !== 'none' && (
            <div className="flex justify-between">
              <span>{t('Gradient:')}</span>
              <span className="font-medium text-foreground capitalize">{design.gradient.type}</span>
            </div>
          )}
          {design.shadow?.enabled && (
            <div className="flex justify-between">
              <span>{t('Shadow:')}</span>
              <span className="font-medium text-foreground">{t('On')}</span>
            </div>
          )}
          {design.stroke?.enabled && (
            <div className="flex justify-between">
              <span>{t('Stroke:')}</span>
              <span className="font-medium text-foreground">{design.stroke.width}px</span>
            </div>
          )}
          {design.depth?.enabled && (
            <div className="flex justify-between">
              <span>3D:</span>
              <span className="font-medium text-foreground">{t('On')}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
