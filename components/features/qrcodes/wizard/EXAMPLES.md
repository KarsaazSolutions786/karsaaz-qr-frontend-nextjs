# QR Code Wizard - Usage Examples

## Example 1: Create QR Code Page

```tsx
// app/qrcodes/create/page.tsx
'use client'

import { QRWizardContainer } from '@/components/features/qrcodes/wizard'

export default function CreateQRCodePage() {
  return (
    <div className="h-screen bg-gray-50">
      <QRWizardContainer mode="create" />
    </div>
  )
}
```

## Example 2: Edit QR Code Page

```tsx
// app/qrcodes/[id]/edit/page.tsx
'use client'

import { useParams } from 'next/navigation'
import { QRWizardContainer } from '@/components/features/qrcodes/wizard'
import { useQRCode } from '@/lib/hooks/queries/useQRCode'

export default function EditQRCodePage() {
  const params = useParams()
  const qrcodeId = params.id as string
  const { data: qrcode, isLoading } = useQRCode(qrcodeId)

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (!qrcode) {
    return <div className="flex items-center justify-center h-screen">QR Code not found</div>
  }

  return (
    <div className="h-screen bg-gray-50">
      <QRWizardContainer
        mode="edit"
        qrcodeId={qrcodeId}
        initialData={qrcode}
      />
    </div>
  )
}
```

## Example 3: Custom Success Handler

```tsx
'use client'

import { useState } from 'react'
import { QRWizardContainer } from '@/components/features/qrcodes/wizard'
import { toast } from 'sonner'

export default function CreateQRCodeWithCallback() {
  const [showWizard, setShowWizard] = useState(true)

  const handleSuccess = (qrcode: any) => {
    console.log('QR code created:', qrcode)
    toast.success('Success!', {
      description: `QR code "${qrcode.name}" has been created`,
    })
    
    // Custom logic after creation
    // e.g., download immediately, share, etc.
    setShowWizard(false)
  }

  const handleCancel = () => {
    setShowWizard(false)
  }

  if (!showWizard) {
    return <div>Wizard closed</div>
  }

  return (
    <div className="h-screen bg-gray-50">
      <QRWizardContainer
        mode="create"
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  )
}
```

## Example 4: Modal Wizard

```tsx
'use client'

import { useState } from 'react'
import { QRWizardContainer } from '@/components/features/qrcodes/wizard'
import { Dialog } from '@/components/ui/dialog'

export default function QRCodeListWithModal() {
  const [isWizardOpen, setIsWizardOpen] = useState(false)

  return (
    <div>
      <button
        onClick={() => setIsWizardOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        Create QR Code
      </button>

      <Dialog open={isWizardOpen} onOpenChange={setIsWizardOpen}>
        <div className="h-[90vh]">
          <QRWizardContainer
            mode="create"
            onSuccess={(qrcode) => {
              setIsWizardOpen(false)
              // Refresh list or handle success
            }}
            onCancel={() => setIsWizardOpen(false)}
          />
        </div>
      </Dialog>
    </div>
  )
}
```

## Example 5: Wizard with Pre-filled Data

```tsx
'use client'

import { QRWizardContainer } from '@/components/features/qrcodes/wizard'

export default function CreateFromTemplate() {
  const templateData = {
    type: 'url',
    data: {
      url: 'https://example.com',
    },
    customization: {
      foregroundColor: '#3b82f6',
      backgroundColor: '#f0f9ff',
      style: 'rounded',
    },
    settings: {
      name: 'My Pre-filled QR',
      tags: ['marketing', 'campaign-2024'],
    },
  }

  return (
    <div className="h-screen bg-gray-50">
      <QRWizardContainer
        mode="create"
        initialData={templateData}
      />
    </div>
  )
}
```

## Example 6: Using Individual Step Components

```tsx
'use client'

import { useState } from 'react'
import { Step1TemplateSelection } from '@/components/features/qrcodes/wizard'
import { useTemplates } from '@/lib/hooks/queries/useTemplates'

export default function CustomWizard() {
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const { data: templates } = useTemplates()

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template)
    // Navigate to next custom step
  }

  return (
    <div className="p-8">
      <Step1TemplateSelection
        templates={templates || []}
        selectedTemplateId={selectedTemplate?.id}
        onTemplateSelect={handleTemplateSelect}
        onSkip={() => console.log('Skipped')}
      />
    </div>
  )
}
```

## Integration with Existing Forms

If you want to integrate wizard steps into an existing form:

```tsx
'use client'

import { useState } from 'react'
import { Step2TypeAndData, Step3Designer } from '@/components/features/qrcodes/wizard'

export default function CustomQRForm() {
  const [formData, setFormData] = useState({
    type: 'url',
    data: {},
  })
  const [design, setDesign] = useState({
    foregroundColor: '#000000',
    backgroundColor: '#FFFFFF',
    style: 'squares',
  })

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-8 p-8">
      <Step2TypeAndData
        qrType={formData.type}
        onChange={handleFieldChange}
        formData={formData}
      />

      <Step3Designer
        design={design}
        onChange={setDesign}
        qrData={formData.data}
        qrType={formData.type}
      />

      <button
        onClick={() => {
          console.log('Submit:', { formData, design })
        }}
        className="px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        Create QR Code
      </button>
    </div>
  )
}
```

## Customization Tips

### Custom Validation

```tsx
const wizard = useWizardState({
  steps: WIZARD_STEPS,
  validateStep: async (stepIndex, data) => {
    // Custom validation logic
    if (stepIndex === 1) {
      if (!data['type-data']?.data?.url) {
        toast.error('URL is required')
        return false
      }
      
      // Async validation
      const isValid = await validateURL(data['type-data'].data.url)
      if (!isValid) {
        toast.error('Invalid URL')
        return false
      }
    }
    
    return true
  },
})
```

### Custom Design Presets

Edit `DESIGN_PRESETS` in `Step3Designer.tsx`:

```tsx
const DESIGN_PRESETS = [
  {
    id: 'custom-brand',
    name: 'Brand Colors',
    design: {
      foregroundColor: '#your-brand-color',
      backgroundColor: '#your-bg-color',
      style: 'rounded',
    },
  },
  // ... more presets
]
```

### Skip Steps

To skip a step programmatically:

```tsx
// Skip template selection
if (shouldSkipTemplate) {
  wizard.goToStep(1) // Go directly to step 2
}
```
