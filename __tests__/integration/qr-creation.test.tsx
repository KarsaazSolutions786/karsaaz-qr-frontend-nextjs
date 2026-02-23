import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QRCodeForm } from '@/components/features/qrcodes/QRCodeForm'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}))

// Mock next/image
vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />,
}))

// Mock QRCodeTypeSelector
vi.mock('@/components/features/qrcodes/QRCodeTypeSelector', () => ({
  QRCodeTypeSelector: ({ value, onChange }: { value: string; onChange: (t: string) => void }) => (
    <div data-testid="type-selector">
      <span>{value}</span>
      <button onClick={() => onChange('vcard')} data-testid="select-vcard">
        VCard
      </button>
    </div>
  ),
}))

// Mock QRCodeCustomizer
vi.mock('@/components/features/qrcodes/QRCodeCustomizer', () => ({
  QRCodeCustomizer: (_props: any) => <div data-testid="customizer">customizer</div>,
}))

// Mock DomainSelector
vi.mock('@/components/features/qrcodes/DomainSelector', () => ({
  DomainSelector: ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <div data-testid="domain-selector">
      <select data-testid="domain-select" value={value} onChange={e => onChange(e.target.value)}>
        <option value="">Default</option>
        <option value="d1">custom.example.com</option>
      </select>
    </div>
  ),
}))

// Mock URL data form (default type)
vi.mock('@/components/features/qrcodes/forms/URLDataForm', () => ({
  URLDataForm: ({ onSubmit }: any) => (
    <div data-testid="url-form">
      <button onClick={() => onSubmit({ url: 'https://example.com' })} data-testid="set-url-data">
        Set URL
      </button>
    </div>
  ),
}))

// Mock VCard data form
vi.mock('@/components/features/qrcodes/forms/VCardDataForm', () => ({
  VCardDataForm: ({ onSubmit }: any) => (
    <div data-testid="vcard-form">
      <button onClick={() => onSubmit({ name: 'John' })} data-testid="set-vcard-data">
        Set VCard
      </button>
    </div>
  ),
}))

// Stub all other form components to avoid import errors
const stubFormModules = [
  'WiFiDataForm',
  'TextDataForm',
  'EmailDataForm',
  'SMSDataForm',
  'PhoneDataForm',
  'LocationDataForm',
  'CalendarDataForm',
  'AppStoreDataForm',
  'WhatsAppDataForm',
  'TelegramDataForm',
  'InstagramDataForm',
  'FacebookDataForm',
  'YouTubeDataForm',
  'LinkedInDataForm',
  'SnapchatDataForm',
  'SpotifyDataForm',
  'TikTokDataForm',
  'TwitterXDataForm',
  'FacebookMessengerDataForm',
  'ViberDataForm',
  'FaceTimeDataForm',
  'WeChatDataForm',
  'SkypeDataForm',
  'ZoomDataForm',
  'PayPalDataForm',
  'CryptoDataForm',
  'BrazilPIXDataForm',
  'GoogleMapsDataForm',
  'DynamicEmailDataForm',
  'DynamicSMSDataForm',
  'GoogleReviewDataForm',
  'FileUploadDataForm',
  'UPIDynamicDataForm',
  'RestaurantMenuDataForm',
  'ProductCatalogueDataForm',
  'ResumeDataForm',
  'WebsiteBuilderDataForm',
  'BusinessReviewDataForm',
  'LeadFormDataForm',
  'EventDataForm',
  'VCardPlusDataForm',
  'UPIStaticDataForm',
  'BiolinksDataForm',
  'BusinessProfileDataForm',
]

for (const name of stubFormModules) {
  vi.mock(`@/components/features/qrcodes/forms/${name}`, () => ({
    [name]: () => <div data-testid={`stub-${name}`} />,
  }))
}

const onSubmitMock = vi.fn()

beforeEach(() => {
  vi.clearAllMocks()
  // Mock window.history.back for cancel button
  Object.defineProperty(window, 'history', {
    value: { back: vi.fn() },
    writable: true,
  })
})

describe('QRCodeForm integration', () => {
  it('renders QR code name input and submit button', () => {
    render(<QRCodeForm onSubmit={onSubmitMock} />)
    expect(screen.getByLabelText(/qr code name/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create qr code/i })).toBeInTheDocument()
  })

  it('submit button is disabled when name is empty', () => {
    render(<QRCodeForm onSubmit={onSubmitMock} />)
    expect(screen.getByRole('button', { name: /create qr code/i })).toBeDisabled()
  })

  it('renders domain selector and allows selection', () => {
    render(<QRCodeForm onSubmit={onSubmitMock} />)
    expect(screen.getByTestId('domain-selector')).toBeInTheDocument()

    fireEvent.change(screen.getByTestId('domain-select'), { target: { value: 'd1' } })
    expect(screen.getByTestId('domain-select')).toHaveValue('d1')
  })

  it('submits form with name, type, and data', async () => {
    render(<QRCodeForm onSubmit={onSubmitMock} />)

    // Enter name
    fireEvent.change(screen.getByLabelText(/qr code name/i), { target: { value: 'My QR' } })

    // Set URL data via mocked form
    fireEvent.click(screen.getByTestId('set-url-data'))

    // Submit
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create qr code/i })).not.toBeDisabled()
    })
    fireEvent.click(screen.getByRole('button', { name: /create qr code/i }))

    expect(onSubmitMock).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'My QR',
        type: 'url',
        data: { url: 'https://example.com' },
      })
    )
  })

  it('shows cancel button that navigates back', () => {
    render(<QRCodeForm onSubmit={onSubmitMock} />)
    const cancelBtn = screen.getByRole('button', { name: /cancel/i })
    expect(cancelBtn).toBeInTheDocument()
    fireEvent.click(cancelBtn)
    expect(window.history.back).toHaveBeenCalled()
  })
})
