'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import type { QRDesign } from './types'

interface LogoTabProps {
  design: QRDesign
  onChange: (design: QRDesign) => void
}

export default function LogoTab({ design, onChange }: LogoTabProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="logo-url">Logo URL</Label>
        <Input
          id="logo-url"
          type="url"
          placeholder="https://example.com/logo.png"
          value={design.logo?.url || ''}
          onChange={e =>
            onChange({
              ...design,
              logo: {
                ...design.logo,
                url: e.target.value,
                size: design.logo?.size || 60,
                padding: design.logo?.padding || 10,
              },
            })
          }
        />
      </div>
      {design.logo?.url && (
        <>
          <div className="space-y-2">
            <Label htmlFor="logo-size">Logo Size: {design.logo.size}px</Label>
            <Input
              id="logo-size"
              type="range"
              min="20"
              max="100"
              value={design.logo.size}
              onChange={e =>
                onChange({
                  ...design,
                  logo: { ...design.logo!, size: parseInt(e.target.value) },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="logo-padding">Logo Padding: {design.logo.padding}px</Label>
            <Input
              id="logo-padding"
              type="range"
              min="0"
              max="20"
              value={design.logo.padding}
              onChange={e =>
                onChange({
                  ...design,
                  logo: { ...design.logo!, padding: parseInt(e.target.value) },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="logo-bg">Logo Background (optional)</Label>
            <div className="flex gap-2">
              <Input
                id="logo-bg"
                type="color"
                value={design.logo.backgroundColor || '#ffffff'}
                onChange={e =>
                  onChange({
                    ...design,
                    logo: { ...design.logo!, backgroundColor: e.target.value },
                  })
                }
                className="h-10 w-20"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  const { backgroundColor, ...rest } = design.logo!
                  onChange({ ...design, logo: rest })
                }}
              >
                Clear
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
