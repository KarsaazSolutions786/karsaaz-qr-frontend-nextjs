import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SupportTicketList from '@/components/features/support/SupportTicketList'
import CreateTicketForm from '@/components/features/support/CreateTicketForm'
import type { SupportTicket } from '@/types/entities/support-ticket'

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...rest }: any) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}))

const MOCK_TICKETS: SupportTicket[] = [
  {
    id: 1,
    reference: 'TK-001',
    name: 'Test User',
    email: 'user@test.com',
    subject: 'Cannot generate QR',
    message: 'Getting an error when creating URL QR codes',
    priority: 'HIGH',
    department: 'TECHNICAL',
    status: 'OPEN',
    product_id: 1,
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-01-15T10:00:00Z',
  },
  {
    id: 2,
    reference: 'TK-002',
    name: 'Another User',
    email: 'another@test.com',
    subject: 'Billing issue',
    message: 'I was charged twice for the same plan',
    priority: 'MEDIUM',
    department: 'BILLING',
    status: 'IN_PROGRESS',
    product_id: 1,
    created_at: '2026-01-16T14:30:00Z',
    updated_at: '2026-01-17T09:00:00Z',
  },
  {
    id: 3,
    reference: 'TK-003',
    name: 'Resolved User',
    email: 'resolved@test.com',
    subject: 'Feature request',
    message: 'Would be great to have bulk download capability',
    priority: 'LOW',
    department: 'TECHNICAL',
    status: 'RESOLVED',
    product_id: 1,
    created_at: '2026-01-10T08:00:00Z',
    updated_at: '2026-01-14T16:00:00Z',
  },
]

beforeEach(() => {
  vi.clearAllMocks()
})

describe('SupportTicketList integration', () => {
  it('renders empty state when no tickets', () => {
    render(<SupportTicketList tickets={[]} />)
    expect(screen.getByText('No tickets yet')).toBeInTheDocument()
    expect(screen.getByText('Create a support ticket to get help')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /new ticket/i })).toHaveAttribute(
      'href',
      '/support-tickets/new'
    )
  })

  it('renders ticket table with correct headers', () => {
    render(<SupportTicketList tickets={MOCK_TICKETS} />)
    expect(screen.getByText('Reference')).toBeInTheDocument()
    expect(screen.getByText('Subject')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Priority')).toBeInTheDocument()
    expect(screen.getByText('Created')).toBeInTheDocument()
  })

  it('renders all tickets with correct data', () => {
    render(<SupportTicketList tickets={MOCK_TICKETS} />)
    expect(screen.getByText('TK-001')).toBeInTheDocument()
    expect(screen.getByText('Cannot generate QR')).toBeInTheDocument()
    expect(screen.getByText('Open')).toBeInTheDocument()
    expect(screen.getByText('High')).toBeInTheDocument()

    expect(screen.getByText('TK-002')).toBeInTheDocument()
    expect(screen.getByText('Billing issue')).toBeInTheDocument()
    expect(screen.getByText('In Progress')).toBeInTheDocument()

    expect(screen.getByText('TK-003')).toBeInTheDocument()
    expect(screen.getByText('Resolved')).toBeInTheDocument()
  })

  it('renders view links for each ticket', () => {
    render(<SupportTicketList tickets={MOCK_TICKETS} />)
    const viewLinks = screen.getAllByRole('link', { name: /view/i })
    expect(viewLinks).toHaveLength(3)
    expect(viewLinks[0]).toHaveAttribute('href', '/support-tickets/1')
    expect(viewLinks[1]).toHaveAttribute('href', '/support-tickets/2')
    expect(viewLinks[2]).toHaveAttribute('href', '/support-tickets/3')
  })
})

describe('CreateTicketForm integration', () => {
  const onSubmitMock = vi.fn()

  it('renders all form fields with defaults', () => {
    render(<CreateTicketForm onSubmit={onSubmitMock} isLoading={false} />)
    expect(screen.getByLabelText(/^name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/department/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /submit ticket/i })).toBeInTheDocument()
  })

  it('shows validation errors on empty submit', async () => {
    render(<CreateTicketForm onSubmit={onSubmitMock} isLoading={false} />)
    fireEvent.click(screen.getByRole('button', { name: /submit ticket/i }))

    await waitFor(() => {
      // At minimum subject and message should show errors (name defaults could be set)
      expect(screen.getByText(/subject must be at least 5 characters/i)).toBeInTheDocument()
    })
    expect(onSubmitMock).not.toHaveBeenCalled()
  })

  it('calls onSubmit with valid data', async () => {
    const { container } = render(
      <CreateTicketForm
        onSubmit={onSubmitMock}
        isLoading={false}
        defaultName="Test User"
        defaultEmail="user@test.com"
      />
    )

    // Fill via fireEvent.change (react-hook-form register listens to change events)
    fireEvent.change(screen.getByLabelText(/^name/i), { target: { value: 'Test User' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'user@test.com' } })
    fireEvent.change(screen.getByLabelText(/subject/i), {
      target: { value: 'Need help with QR codes' },
    })
    fireEvent.change(screen.getByLabelText(/message/i), {
      target: {
        value:
          'I am having trouble generating QR codes for my business cards. Please help me resolve this quickly.',
      },
    })
    fireEvent.change(screen.getByLabelText(/priority/i), { target: { value: 'High' } })
    fireEvent.change(screen.getByLabelText(/department/i), { target: { value: 'Technical' } })

    // Submit
    fireEvent.click(screen.getByRole('button', { name: /submit ticket/i }))

    // Wait for either the callback to be called or errors to appear
    await waitFor(() => {
      // If validation failed, check that no error messages are shown
      const errors = container.querySelectorAll('.text-red-600')
      if (errors.length > 0) {
        // Log errors for debugging
        throw new Error(
          `Validation errors: ${Array.from(errors)
            .map(e => e.textContent)
            .join(', ')}`
        )
      }
      expect(onSubmitMock).toHaveBeenCalled()
    })
  })

  it('disables submit button when loading', () => {
    render(<CreateTicketForm onSubmit={onSubmitMock} isLoading={true} />)
    expect(screen.getByRole('button', { name: /submitting/i })).toBeDisabled()
  })
})
