# QR Code Creation Wizard

A multi-step wizard for creating and editing QR codes with template selection, data input, design customization, and settings configuration.

## Components

### Step1TemplateSelection
Template selection or "Start from Scratch" option.

**Props:**
- `templates: QRCodeTemplate[]` - Available templates
- `selectedTemplateId?: string` - Currently selected template ID
- `onTemplateSelect: (template) => void` - Template selection handler
- `onSkip: () => void` - Skip template handler
- `isLoading?: boolean` - Loading state

**Features:**
- Template grid with search and category filter
- Preview on hover
- "Start from Scratch" button
- Auto-advances to next step on template selection

### Step2TypeAndData
QR code type selection and data input.

**Props:**
- `qrType: string` - Selected QR type
- `onChange: (field, value) => void` - Change handler
- `formData: any` - Current form data
- `errors?: Record<string, string>` - Validation errors
- `showPreview?: boolean` - Show live preview

**Features:**
- Dynamic form based on QR type
- Live preview (optional)
- Type-specific validation
- Supports all QR types (URL, vCard, WiFi, etc.)

### Step3Designer
Advanced QR code design customization.

**Props:**
- `design: any` - Current design settings
- `onChange: (design) => void` - Change handler
- `qrData: any` - QR code data for preview
- `qrType: string` - QR type

**Features:**
- Design presets (Classic, Modern, Vibrant, Professional)
- Basic tab: Colors, patterns, size
- Advanced tab: Gradients, transparent background, corner styles
- Logo tab: Upload, size, positioning
- Live preview with scan-to-test

### Step4Settings
Settings and metadata configuration.

**Props:**
- `settings: any` - Current settings
- `onChange: (settings) => void` - Change handler
- `folders?: any[]` - Available folders

**Features:**
- QR code name (required)
- Folder selection with tree view
- PIN protection toggle
- Expiration date
- Tags management
- Download settings (size, format)

### QRWizardContainer
Main wizard orchestrator.

**Props:**
- `mode?: 'create' | 'edit'` - Wizard mode (default: 'create')
- `qrcodeId?: string` - QR code ID for edit mode
- `initialData?: any` - Initial data for edit mode
- `onSuccess?: (qrcode) => void` - Success callback
- `onCancel?: () => void` - Cancel callback

**Features:**
- Manages wizard state with `useWizardState`
- Step validation
- Auto-saves draft (create mode only)
- Progress tracking
- Success/error handling
- Redirects after creation/update

## Usage

### Create Mode
```tsx
import { QRWizardContainer } from '@/components/features/qrcodes/wizard'

function CreateQRPage() {
  return (
    <QRWizardContainer
      mode="create"
      onSuccess={(qrcode) => {
        console.log('QR code created:', qrcode)
      }}
    />
  )
}
```

### Edit Mode
```tsx
import { QRWizardContainer } from '@/components/features/qrcodes/wizard'

function EditQRPage({ qrcodeId, initialData }) {
  return (
    <QRWizardContainer
      mode="edit"
      qrcodeId={qrcodeId}
      initialData={initialData}
      onSuccess={(qrcode) => {
        console.log('QR code updated:', qrcode)
      }}
    />
  )
}
```

## Wizard Flow

1. **Template Selection** (Optional)
   - User can select a template or skip
   - Templates auto-populate type, data, and design
   - Auto-advances to Step 2

2. **Type & Data** (Required)
   - User selects QR type
   - Fills in type-specific data
   - Live preview shows QR code
   - Validates required fields

3. **Design** (Required)
   - User customizes appearance
   - Choose from presets or custom design
   - Add logo, gradients, patterns
   - Live preview updates

4. **Settings** (Required)
   - User enters name (required)
   - Optionally organize into folder
   - Configure security (PIN)
   - Set expiration and tags
   - Choose download defaults

5. **Submit**
   - Validates all data
   - Creates/updates QR code
   - Shows success message
   - Redirects to QR detail page

## Validation

Each step has validation:
- **Step 1**: Always valid (optional)
- **Step 2**: Requires type and valid data
- **Step 3**: Always valid (has defaults)
- **Step 4**: Requires name, validates PIN and expiration

Validation runs before advancing to next step and on final submit.

## State Persistence

In create mode, wizard state is auto-saved to localStorage with key `qr-wizard-state`. This allows users to resume if they navigate away.

State is cleared on:
- Successful submission
- Manual reset
- User clears browser data

## Dependencies

- `@/components/wizard/StepperWizard` - Wizard shell
- `@/lib/hooks/useWizardState` - State management
- `@/lib/hooks/mutations/useCreateQRCode` - Create mutation
- `@/lib/hooks/mutations/useUpdateQRCode` - Update mutation
- `@/lib/hooks/queries/useTemplates` - Templates query
- Various form components for each QR type
- UI components (Input, Button, Tabs)

## Customization

You can customize:
- Design presets (edit `DESIGN_PRESETS` in Step3Designer)
- Validation rules (edit validation functions in QRWizardContainer)
- Default values (edit `getDefaultDesign` and `getDefaultSettings`)
- Step order (modify `WIZARD_STEPS` array)
