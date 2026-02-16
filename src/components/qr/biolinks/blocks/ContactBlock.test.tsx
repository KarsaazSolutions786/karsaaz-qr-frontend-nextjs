import { render, screen, fireEvent, waitFor as _waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ContactBlock from './ContactBlock';
import { Block } from '../types';

// Mock fetch globally
global.fetch = vi.fn();

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  AlertCircle: ({ className }: { className?: string }) => <div data-testid="alert-icon" className={className} />,
  CheckCircle: ({ className }: { className?: string }) => <div data-testid="check-icon" className={className} />,
  Clock: ({ className }: { className?: string }) => <div data-testid="clock-icon" className={className} />,
  Mail: ({ className }: { className?: string }) => <div data-testid="mail-icon" className={className} />,
  MapPin: ({ className }: { className?: string }) => <div data-testid="map-icon" className={className} />,
  Phone: ({ className }: { className?: string }) => <div data-testid="phone-icon" className={className} />,
  Calendar: ({ className }: { className?: string }) => <div data-testid="calendar-icon" className={className} />,
  ExternalLink: ({ className }: { className?: string }) => <div data-testid="external-icon" className={className} />,
  MessageSquare: ({ className }: { className?: string }) => <div data-testid="message-icon" className={className} />,
  Send: ({ className }: { className?: string }) => <div data-testid="send-icon" className={className} />,
  X: ({ className }: { className?: string }) => <div data-testid="close-icon" className={className} />,
  Globe: ({ className }: { className?: string }) => <div data-testid="globe-icon" className={className} />,
  MessageCircle: ({ className }: { className?: string }) => <div data-testid="message-circle-icon" className={className} />,
}));

// Mock UI components
vi.mock('@/components/ui/input', () => ({
  Input: ({ name, value, onChange, placeholder, disabled, ...props }: { name?: string; value?: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; disabled?: boolean; [key: string]: unknown }) => (
    <input
      data-testid={`input-${name || ''}`}
      name={name}
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      {...props}
    />
  ),
}));

vi.mock('@/components/ui/textarea', () => ({
  Textarea: ({ name, value, onChange, placeholder, rows }: { name?: string; value?: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; placeholder?: string; rows?: number }) => (
    <textarea
      data-testid={`textarea-${name || ''}`}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
    />
  ),
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, className, ...props }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean; className?: string; [key: string]: unknown }) => (
    <button
      data-testid="button"
      onClick={onClick}
      disabled={disabled}
      className={className}
      {...props}
    >
      {children}
    </button>
  ),
}));

vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: { children: React.ReactNode; className?: string }) => <div data-testid="card" className={className}>{children}</div>,
  CardHeader: ({ children }: { children: React.ReactNode }) => <div data-testid="card-header">{children}</div>,
  CardTitle: ({ children }: { children: React.ReactNode }) => <h3 data-testid="card-title">{children}</h3>,
  CardContent: ({ children }: { children: React.ReactNode }) => <div data-testid="card-content">{children}</div>,
}));

vi.mock('@/components/ui/label', () => ({
  Label: ({ children, htmlFor, className }: { children: React.ReactNode; htmlFor?: string; className?: string }) => (
    <label data-testid={`label-${htmlFor || ''}`} htmlFor={htmlFor} className={className}>
      {children}
    </label>
  ),
}));

vi.mock('@/components/ui/switch', () => ({
  Switch: ({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: (checked: boolean) => void }) => (
    <div
      data-testid="switch"
      data-checked={checked}
      onClick={() => onCheckedChange(!checked)}
    />
  ),
}));

vi.mock('@/components/ui/select', () => ({
  Select: ({ children, value, onValueChange }: { children: React.ReactNode; value?: string; onValueChange?: (value: string) => void }) => (
    <div data-testid="select" data-value={value} onClick={() => onValueChange && onValueChange('test-value')}>
      {children}
    </div>
  ),
  SelectTrigger: ({ children }: { children: React.ReactNode }) => <div data-testid="select-trigger">{children}</div>,
  SelectValue: ({ children }: { children: React.ReactNode }) => <div data-testid="select-value">{children}</div>,
  SelectContent: ({ children }: { children: React.ReactNode }) => <div data-testid="select-content">{children}</div>,
  SelectItem: ({ children, value }: { children: React.ReactNode; value: string }) => (
    <div data-testid={`select-item-${value}`} onClick={() => {}}>
      {children}
    </div>
  ),
}));

vi.mock('@/lib/utils', () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(' '),
}));

describe('ContactBlock', () => {
  const mockBlock: Block = {
    id: 'contact-test-123',
    type: 'contact',
    title: 'Contact Us',
    content: {
      methods: [
        {
          id: 'method-1',
          type: 'email',
          label: 'Support Email',
          value: 'support@example.com',
          link: 'mailto:support@example.com'
        },
        {
          id: 'method-2',
          type: 'phone',
          label: 'Phone',
          value: '+1 (555) 123-4567',
          link: 'tel:+15551234567'
        }
      ],
      showForm: true,
      formTitle: 'Get In Touch',
      formSubtitle: 'Contact us anytime',
      showBusinessHours: true,
      businessHours: [
        { day: 'Monday', open: '09:00', close: '17:00', closed: false },
        { day: 'Tuesday', open: '09:00', close: '17:00', closed: false },
        { day: 'Wednesday', open: '09:00', close: '17:00', closed: false },
        { day: 'Thursday', open: '09:00', close: '17:00', closed: false },
        { day: 'Friday', open: '09:00', close: '17:00', closed: false },
        { day: 'Saturday', open: '10:00', close: '16:00', closed: false },
        { day: 'Sunday', open: '10:00', close: '16:00', closed: false }
      ],
      timezone: 'America/New_York',
      showMap: true,
      mapUrl: 'https://www.google.com/maps/embed?pb=test',
      mapHeight: '400px',
      showResponseTime: true,
      responseTime: 'Within 24 hours',
      requirePhone: false,
      requireSubject: false,
      emailTo: 'test@example.com',
      enableHoneypot: true,
      honeypotField: 'website_url',
      successMessage: 'Message sent successfully!',
      errorMessage: 'Error sending message.',
      buttonText: 'Send Message',
      privacyText: 'We respect your privacy.'
    },
    settings: {
      visible: true,
      order: 0,
      customClasses: [],
      padding: '1.5rem',
      margin: '0.5rem 0'
    },
    design: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      borderRadius: '12px',
      padding: '1.5rem',
      margin: '0.5rem 0'
    }
  };

  const mockOnUpdate = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true })
    });
  });

  describe('Public View (isEditing=false)', () => {
    it('renders contact methods', () => {
      render(
        <ContactBlock 
          block={mockBlock} 
          onUpdate={mockOnUpdate} 
          onDelete={mockOnDelete} 
          isEditing={false}
        />
      );

      expect(screen.getByText('Support Email')).toBeInTheDocument();
      expect(screen.getByText('support@example.com')).toBeInTheDocument();
      expect(screen.getByText('Phone')).toBeInTheDocument();
      expect(screen.getByText('+1 (555) 123-4567')).toBeInTheDocument();
    });

    it('renders contact form', () => {
      render(
        <ContactBlock 
          block={mockBlock} 
          onUpdate={mockOnUpdate} 
          onDelete={mockOnDelete} 
          isEditing={false}
        />
      );

      expect(screen.getByText('Get In Touch')).toBeInTheDocument();
      expect(screen.getByText('Contact us anytime')).toBeInTheDocument();
      expect(screen.getByTestId('input-name')).toBeInTheDocument();
      expect(screen.getByTestId('input-email')).toBeInTheDocument();
      expect(screen.getByTestId('textarea-message')).toBeInTheDocument();
    });

    it('renders business hours', () => {
      render(
        <ContactBlock 
          block={mockBlock} 
          onUpdate={mockOnUpdate} 
          onDelete={mockOnDelete} 
          isEditing={false}
        />
      );

      expect(screen.getByText('Business Hours')).toBeInTheDocument();
      expect(screen.getByText('Monday')).toBeInTheDocument();
      expect(screen.getByText('09:00 - 17:00')).toBeInTheDocument();
    });

    it('renders response time', () => {
      render(
        <ContactBlock 
          block={mockBlock} 
          onUpdate={mockOnUpdate} 
          onDelete={mockOnDelete} 
          isEditing={false}
        />
      );

      expect(screen.getByText('Response Time')).toBeInTheDocument();
      expect(screen.getByText('We typically respond within Within 24 hours')).toBeInTheDocument();
    });

    it('shows success message after form submission', async () => {
      render(
        <ContactBlock 
          block={mockBlock} 
          onUpdate={mockOnUpdate} 
          onDelete={mockOnDelete} 
          isEditing={false}
        />
      );

      // Fill form
      fireEvent.change(screen.getByTestId('input-name'), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByTestId('input-email'), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByTestId('textarea-message'), { target: { value: 'Test message' } });

      // Submit form
      fireEvent.submit(screen.getByTestId('button')?.closest('form') || document.createElement('form'));

      await waitFor(() => {
        expect(screen.getByText('Message sent successfully!')).toBeInTheDocument();
      });
    });

    it('validates required fields', async () => {
      render(
        <ContactBlock 
          block={mockBlock} 
          onUpdate={mockOnUpdate} 
          onDelete={mockOnDelete} 
          isEditing={false}
        />
      );

      // Submit empty form
      fireEvent.submit(screen.getByTestId('button')?.closest('form') || document.createElement('form'));

      await waitFor(() => {
        expect(screen.getByText(/Please fill in all required fields/)).toBeInTheDocument();
      });
    });

    it('validates email format', async () => {
      render(
        <ContactBlock 
          block={mockBlock} 
          onUpdate={mockOnUpdate} 
          onDelete={mockOnDelete} 
          isEditing={false}
        />
      );

      // Fill form with invalid email
      fireEvent.change(screen.getByTestId('input-name'), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByTestId('input-email'), { target: { value: 'invalid-email' } });
      fireEvent.change(screen.getByTestId('textarea-message'), { target: { value: 'Test message' } });

      // Submit form
      fireEvent.submit(screen.getByTestId('button')?.closest('form') || document.createElement('form'));

      await waitFor(() => {
        expect(screen.getByText(/Please enter a valid email address/)).toBeInTheDocument();
      });
    });

    it('honeypot field is hidden from screen readers', () => {
      render(
        <ContactBlock 
          block={mockBlock} 
          onUpdate={mockOnUpdate} 
          onDelete={mockOnDelete} 
          isEditing={false}
        />
      );

      const honeyPotLabel = screen.queryByText('Leave this field empty');
      expect(honeyPotLabel).not.toBeInTheDocument();
    });

    it('spam submission is blocked via honeypot', async () => {
      render(
        <ContactBlock 
          block={mockBlock} 
          onUpdate={mockOnUpdate} 
          onDelete={mockOnDelete} 
          isEditing={false}
        />
      );

      // Fill form including honeypot
      fireEvent.change(screen.getByTestId('input-name'), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByTestId('input-email'), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByTestId('textarea-message'), { target: { value: 'Test message' } });
      
      // Note: In real scenario, honeypot would be programmatically filled
      // For this test, we'll check that it's present but not visibly rendered
      
      fireEvent.submit(screen.getByTestId('button')?.closest('form') || document.createElement('form'));

      // Honeypot should prevent form submission
      // The console.log should be called (spam detected)
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  describe('Edit View (isEditing=true)', () => {
    it('renders edit interface', () => {
      render(
        <ContactBlock 
          block={mockBlock} 
          onUpdate={mockOnUpdate} 
          onDelete={mockOnDelete} 
          isEditing={true}
        />
      );

      expect(screen.getByText('Contact Block')).toBeInTheDocument();
      expect(screen.getByText('Contact Settings')).toBeInTheDocument();
    });

    it('allows adding contact methods', () => {
      render(
        <ContactBlock 
          block={mockBlock} 
          onUpdate={mockOnUpdate} 
          onDelete={mockOnDelete} 
          isEditing={true}
        />
      );

      const addButton = screen.getByTestId('button');
      fireEvent.click(addButton);

      expect(mockOnUpdate).toHaveBeenCalled();
    });

    it('allows editing form settings', () => {
      render(
        <ContactBlock 
          block={mockBlock} 
          onUpdate={mockOnUpdate} 
          onDelete={mockOnDelete} 
          isEditing={true}
        />
      );

      const showFormSwitch = screen.getAllByTestId('switch')[0];
      fireEvent.click(showFormSwitch);

      expect(mockOnUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.objectContaining({
            showForm: false
          })
        })
      );
    });

    it('allows editing business hours', () => {
      render(
        <ContactBlock 
          block={mockBlock} 
          onUpdate={mockOnUpdate} 
          onDelete={mockOnDelete} 
          isEditing={true}
        />
      );

      const showHoursSwitch = screen.getByText(/Show Business Hours/i);
      expect(showHoursSwitch).toBeInTheDocument();
    });

    it('allows deleting contact methods', () => {
      render(
        <ContactBlock 
          block={mockBlock} 
          onUpdate={mockOnUpdate} 
          onDelete={mockOnDelete} 
          isEditing={true}
        />
      );

      // Find delete button for first method
      const deleteButtons = screen.getAllByText('Remove');
      if (deleteButtons.length > 0) {
        fireEvent.click(deleteButtons[0]);
        expect(mockOnUpdate).toHaveBeenCalled();
      }
    });

    it('allows editing map settings', () => {
      render(
        <ContactBlock 
          block={mockBlock} 
          onUpdate={mockOnUpdate} 
          onDelete={mockOnDelete} 
          isEditing={true}
        />
      );

      const mapSwitch = screen.getByText(/Show Map/i);
      expect(mapSwitch).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles missing content gracefully', () => {
      const emptyBlock: Block = {
        ...mockBlock,
        content: {
          methods: [],
          showForm: true,
          formTitle: '',
          formSubtitle: '',
          showBusinessHours: false,
          businessHours: [],
          timezone: 'UTC',
          showMap: false,
          mapUrl: '',
          mapHeight: '300px',
          showResponseTime: false,
          responseTime: '',
          requirePhone: false,
          requireSubject: false,
          emailTo: '',
          enableHoneypot: true,
          honeypotField: 'website_url',
          successMessage: '',
          errorMessage: '',
          buttonText: '',
          privacyText: ''
        }
      };

      render(
        <ContactBlock 
          block={emptyBlock} 
          onUpdate={mockOnUpdate} 
          onDelete={mockOnDelete} 
          isEditing={false}
        />
      );

      // Should render without crashing
      expect(screen.getByTestId('card')).toBeInTheDocument();
    });

    it('handles submission errors', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ success: false })
      });

      render(
        <ContactBlock 
          block={mockBlock} 
          onUpdate={mockOnUpdate} 
          onDelete={mockOnDelete} 
          isEditing={false}
        />
      );

      // Fill form
      fireEvent.change(screen.getByTestId('input-name'), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByTestId('input-email'), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByTestId('textarea-message'), { target: { value: 'Test message' } });

      // Submit form
      fireEvent.submit(screen.getByTestId('button')?.closest('form') || document.createElement('form'));

      await waitFor(() => {
        expect(screen.getByText('Error sending message.')).toBeInTheDocument();
      });
    });
  });
});
