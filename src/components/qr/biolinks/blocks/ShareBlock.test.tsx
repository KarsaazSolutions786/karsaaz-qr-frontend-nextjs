import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ShareBlock from './ShareBlock';
import { Block } from '../types';
import { vi } from 'vitest';

// Mock navigator.clipboard and navigator.share
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockImplementation(() => Promise.resolve()),
  },
  share: vi.fn().mockImplementation(() => Promise.resolve()),
});

// Mock window.open
const mockWindowOpen = vi.fn();
window.open = mockWindowOpen;

// Sample share block data
const createMockBlock = (overrides = {}): Block => ({
  id: 'share_test_1',
  type: 'share',
  title: 'Share Block Test',
  content: {
    platforms: ['facebook', 'twitter', 'linkedin', 'whatsapp', 'email'],
    url: 'https://example.com',
    title: 'Share this page',
    description: 'Share this page with your friends',
    buttonStyle: 'default',
    showCounts: true,
    showQRCode: true,
    qrCodeSize: 200,
    customMessage: 'Check this out!',
    useWebShareApi: true,
    ...overrides
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
});

describe('ShareBlock', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset localStorage
    localStorage.clear();
  });

  describe('Public View (isEditing=false)', () => {
    it('renders all selected platform buttons', () => {
      const block = createMockBlock();
      const onUpdate = vi.fn();
      const onDelete = vi.fn();

      render(
        <ShareBlock 
          block={block} 
          onUpdate={onUpdate} 
          onDelete={onDelete} 
          isEditing={false} 
        />
      );

      // Check if platform buttons are rendered
      expect(screen.getByText('Facebook')).toBeInTheDocument();
      expect(screen.getByText('Twitter')).toBeInTheDocument();
      expect(screen.getByText('LinkedIn')).toBeInTheDocument();
      expect(screen.getByText('WhatsApp')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Copy Link')).toBeInTheDocument();
    });

    it('displays title and description when provided', () => {
      const block = createMockBlock();
      render(<ShareBlock block={block} onUpdate={vi.fn()} onDelete={vi.fn()} isEditing={false} />);

      expect(screen.getByText('Share this page')).toBeInTheDocument();
      expect(screen.getByText('Share this page with your friends')).toBeInTheDocument();
    });

    it('copies link to clipboard when copy button is clicked', async () => {
      const block = createMockBlock();
      render(<ShareBlock block={block} onUpdate={vi.fn()} onDelete={vi.fn()} isEditing={false} />);

      const copyButton = screen.getByText('Copy Link');
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('https://example.com');
      });
    });

    it('shows QR code when enabled and expanded', () => {
      const block = createMockBlock({ showQRCode: true });
      render(<ShareBlock block={block} onUpdate={vi.fn()} onDelete={vi.fn()} isEditing={false} />);

      const qrToggle = screen.getByText(/Scan QR Code/i);
      fireEvent.click(qrToggle);

      // QR code SVG should be visible
      expect(document.querySelector('svg')).toBeInTheDocument();
    });

    it('shows share counts when enabled', () => {
      // Set up some share counts in localStorage
      localStorage.setItem('share_analytics', JSON.stringify({
        share_test_1: {
          facebook: 15,
          twitter: 8,
          copy: 25
        }
      }));

      const block = createMockBlock({ showCounts: true });
      render(<ShareBlock block={block} onUpdate={vi.fn()} onDelete={vi.fn()} isEditing={false} />);

      expect(screen.getByText('15')).toBeInTheDocument();
      expect(screen.getByText('8')).toBeInTheDocument();
      expect(screen.getByText('25')).toBeInTheDocument();
    });

    it('opens platform share URLs when buttons are clicked', () => {
      const block = createMockBlock();
      render(<ShareBlock block={block} onUpdate={vi.fn()} onDelete={vi.fn()} isEditing={false} />);

      const twitterButton = screen.getByText('Twitter');
      fireEvent.click(twitterButton);

      expect(mockWindowOpen).toHaveBeenCalledWith(
        expect.stringContaining('twitter.com/intent/tweet'),
        expect.any(String),
        expect.any(String)
      );
    });

    it('handles WhatsApp mobile deep linking', () => {
      const block = createMockBlock();
      render(<ShareBlock block={block} onUpdate={vi.fn()} onDelete={vi.fn()} isEditing={false} />);

      const whatsappButton = screen.getByText('WhatsApp');
      fireEvent.click(whatsappButton);

      // WhatsApp should redirect current window
      expect(mockWindowOpen).not.toHaveBeenCalled();
    });
  });

  describe('Edit Mode (isEditing=true)', () => {
    it('renders editor interface with all settings', () => {
      const block = createMockBlock();
      render(<ShareBlock block={block} onUpdate={vi.fn()} onDelete={vi.fn()} isEditing={true} />);

      // Check for editor controls
      expect(screen.getByText('Share Block')).toBeInTheDocument();
      expect(screen.getByLabelText('Title')).toBeInTheDocument();
      expect(screen.getByLabelText('Description')).toBeInTheDocument();
      expect(screen.getByLabelText('Share URL')).toBeInTheDocument();
    });

    it('allows platform selection', () => {
      const onUpdate = vi.fn();
      const block = createMockBlock({ platforms: ['facebook', 'twitter'] });
      render(<ShareBlock block={block} onUpdate={onUpdate} onDelete={vi.fn()} isEditing={true} />);

      // Click to deselect Facebook
      const facebookOption = screen.getByText('Facebook').closest('div[role="button"]');
      if (facebookOption) {
        fireEvent.click(facebookOption);
        expect(onUpdate).toHaveBeenCalledWith({
          content: expect.objectContaining({
            platforms: ['twitter']
          })
        });
      }
    });

    it('allows changing button style', () => {
      const onUpdate = vi.fn();
      const block = createMockBlock();
      render(<ShareBlock block={block} onUpdate={onUpdate} onDelete={vi.fn()} isEditing={true} />);

      const select = screen.getByText('Default (Colored)');
      fireEvent.click(select);
      
      const minimalOption = screen.getByText('Minimal');
      fireEvent.click(minimalOption);

      expect(onUpdate).toHaveBeenCalledWith({
        content: expect.objectContaining({
          buttonStyle: 'minimal'
        })
      });
    });

    it('toggles QR code settings', () => {
      const onUpdate = vi.fn();
      const block = createMockBlock({ showQRCode: false });
      render(<ShareBlock block={block} onUpdate={onUpdate} onDelete={vi.fn()} isEditing={true} />);

      const qrSwitch = screen.getByLabelText('Show QR Code');
      fireEvent.click(qrSwitch);

      expect(onUpdate).toHaveBeenCalledWith({
        content: expect.objectContaining({
          showQRCode: true
        })
      });
    });

    it('toggles share count visibility', () => {
      const onUpdate = vi.fn();
      const block = createMockBlock({ showCounts: false });
      render(<ShareBlock block={block} onUpdate={onUpdate} onDelete={vi.fn()} isEditing={true} />);

      const countsSwitch = screen.getByLabelText('Show Share Counts');
      fireEvent.click(countsSwitch);

      expect(onUpdate).toHaveBeenCalledWith({
        content: expect.objectContaining({
          showCounts: true
        })
      });
    });

    it('changes design settings', () => {
      const onUpdate = vi.fn();
      const block = createMockBlock();
      render(<ShareBlock block={block} onUpdate={onUpdate} onDelete={vi.fn()} isEditing={true} />);

      const bgColorInput = screen.getByLabelText('Background Color');
      fireEvent.change(bgColorInput, { target: { value: '#ff0000' } });

      expect(onUpdate).toHaveBeenCalledWith({
        design: expect.objectContaining({
          backgroundColor: '#ff0000'
        })
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles empty platforms gracefully', () => {
      const block = createMockBlock({ platforms: [] });
      render(<ShareBlock block={block} onUpdate={vi.fn()} onDelete={vi.fn()} isEditing={false} />);
      
      // Should not render any platform buttons
      expect(screen.queryByText('Facebook')).not.toBeInTheDocument();
      expect(screen.getByText('Copy Link')).toBeInTheDocument();
    });

    it('handles missing URL (uses current location)', () => {
      const block = createMockBlock({ url: '' });
      render(<ShareBlock block={block} onUpdate={vi.fn()} onDelete={vi.fn()} isEditing={false} />);
      
      // Should still render without errors
      expect(screen.getByText('Copy Link')).toBeInTheDocument();
    });

    it('handles clipboard API failure gracefully', async () => {
      const clipboardError = new Error('Clipboard access denied');
      navigator.clipboard.writeText = vi.fn().mockRejectedValue(clipboardError);
      
      const block = createMockBlock();
      render(<ShareBlock block={block} onUpdate={vi.fn()} onDelete={vi.fn()} isEditing={false} />);
      
      const copyButton = screen.getByText('Copy Link');
      fireEvent.click(copyButton);
      
      await waitFor(() => {
        expect(screen.getByText('Failed to copy link')).toBeInTheDocument();
      });
    });

    it('tracks analytics correctly', async () => {
      const block = createMockBlock();
      render(<ShareBlock block={block} onUpdate={vi.fn()} onDelete={vi.fn()} isEditing={false} />);
      
      // Click a share button
      const twitterButton = screen.getByText('Twitter');
      fireEvent.click(twitterButton);
      
      // Check if analytics were tracked
      const analytics = JSON.parse(localStorage.getItem('share_analytics') || '{}');
      expect(analytics[block.id]).toBeDefined();
      expect(analytics[block.id]['twitter']).toBe(1);
    });
  });
});

export {};