import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { UpdatePaymentMethodDialog } from '@/components/features/billing/UpdatePaymentMethodDialog'

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  X: (props: any) => <svg data-testid="icon-x" {...props} />,
  CreditCard: (props: any) => <svg data-testid="icon-cc" {...props} />,
  Loader2: (props: any) => <svg data-testid="icon-loader" {...props} />,
}))

// Mock useUpdatePaymentMethod
const mutateAsyncMock = vi.fn()
vi.mock('@/lib/hooks/mutations/useUpdatePaymentMethod', () => ({
  useUpdatePaymentMethod: () => ({
    mutateAsync: mutateAsyncMock,
    isPending: false,
  }),
}))

const onCloseMock = vi.fn()
const onSuccessMock = vi.fn()

beforeEach(() => {
  vi.clearAllMocks()
})

describe('UpdatePaymentMethodDialog integration', () => {
  it('renders nothing when open is false', () => {
    const { container } = render(<UpdatePaymentMethodDialog open={false} onClose={onCloseMock} />)
    expect(container.innerHTML).toBe('')
  })

  it('renders dialog with all card fields when open', () => {
    render(<UpdatePaymentMethodDialog open={true} onClose={onCloseMock} />)
    expect(screen.getByRole('heading', { name: 'Update Payment Method' })).toBeInTheDocument()
    expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('4242 4242 4242 4242')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('MM/YY')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('123')).toBeInTheDocument()
  })

  it('shows error when submitting with empty fields', async () => {
    render(<UpdatePaymentMethodDialog open={true} onClose={onCloseMock} />)
    fireEvent.click(screen.getByRole('button', { name: /update payment method/i }))

    await waitFor(() => {
      expect(screen.getByText('Please fill in all fields.')).toBeInTheDocument()
    })
    expect(mutateAsyncMock).not.toHaveBeenCalled()
  })

  it('calls mutation and closes on successful submit', async () => {
    mutateAsyncMock.mockResolvedValue({})
    render(
      <UpdatePaymentMethodDialog open={true} onClose={onCloseMock} onSuccess={onSuccessMock} />
    )

    fireEvent.change(screen.getByPlaceholderText('John Doe'), { target: { value: 'Jane Doe' } })
    fireEvent.change(screen.getByPlaceholderText('4242 4242 4242 4242'), {
      target: { value: '4242424242424242' },
    })
    fireEvent.change(screen.getByPlaceholderText('MM/YY'), { target: { value: '12/28' } })
    fireEvent.change(screen.getByPlaceholderText('123'), { target: { value: '456' } })

    fireEvent.click(screen.getByRole('button', { name: /update payment method/i }))

    await waitFor(() => {
      expect(mutateAsyncMock).toHaveBeenCalledWith('pm_placeholder')
    })
    expect(onSuccessMock).toHaveBeenCalled()
    expect(onCloseMock).toHaveBeenCalled()
  })

  it('shows error on mutation failure', async () => {
    mutateAsyncMock.mockRejectedValue(new Error('Stripe error'))
    render(<UpdatePaymentMethodDialog open={true} onClose={onCloseMock} />)

    fireEvent.change(screen.getByPlaceholderText('John Doe'), { target: { value: 'Jane' } })
    fireEvent.change(screen.getByPlaceholderText('4242 4242 4242 4242'), {
      target: { value: '1234567890123456' },
    })
    fireEvent.change(screen.getByPlaceholderText('MM/YY'), { target: { value: '01/30' } })
    fireEvent.change(screen.getByPlaceholderText('123'), { target: { value: '999' } })

    fireEvent.click(screen.getByRole('button', { name: /update payment method/i }))

    await waitFor(() => {
      expect(
        screen.getByText('Failed to update payment method. Please try again.')
      ).toBeInTheDocument()
    })
  })
})
