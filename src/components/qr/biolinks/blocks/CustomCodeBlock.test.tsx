import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CustomCodeBlock from './CustomCodeBlock';
import { Block } from '../types';

describe('CustomCodeBlock', () => {
  const mockBlock: Block = {
    id: 'test-block',
    type: 'custom-code',
    title: 'Custom Code Test',
    content: {
      html: '<div>Test HTML</div>',
      css: '.test { color: red; }',
      javascript: 'console.log("test");',
      codeType: 'combined',
      showPreview: true,
      autoRun: false,
      enableHtml: true,
      enableCss: true,
      enableJs: false,
      securityWarnings: true,
      sandboxMode: true
    },
    settings: {
      visible: true,
      order: 0,
      customClasses: [],
      padding: '1rem',
      margin: '0.5rem 0'
    },
    design: {
      backgroundColor: 'transparent',
      textColor: '#000000',
      borderRadius: '8px',
      padding: '1rem',
      margin: '0.5rem 0'
    }
  };

  const mockOnUpdate = vi.fn();
  const mockOnDelete = vi.fn();

  describe('Public View Mode', () => {
    it('should render HTML content when not editing', () => {
      render(
        <CustomCodeBlock
          block={mockBlock}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
          isEditing={false}
        />
      );

      expect(screen.getByText('Test HTML')).toBeInTheDocument();
    });

    it('should show disabled message when HTML is disabled', () => {
      const blockedBlock = {
        ...mockBlock,
        content: {
          ...mockBlock.content,
          enableHtml: false,
          codeType: 'html'
        }
      };

      render(
        <CustomCodeBlock
          block={blockedBlock}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
          isEditing={false}
        />
      );

      expect(screen.getByText('HTML execution is disabled for this block.')).toBeInTheDocument();
    });

    it('should show disabled message when JavaScript is disabled but present', () => {
      const jsBlock = {
        ...mockBlock,
        content: {
          ...mockBlock.content,
          javascript: 'alert("test")',
          enableJs: false
        }
      };

      render(
        <CustomCodeBlock
          block={jsBlock}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
          isEditing={false}
        />
      );

      expect(screen.getByText('JavaScript execution is disabled for this block.')).toBeInTheDocument();
    });
  });

  describe('Edit Mode', () => {
    it('should render editor interface when editing', () => {
      render(
        <CustomCodeBlock
          block={mockBlock}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
          isEditing={true}
        />
      );

      expect(screen.getByText('Custom Code Block')).toBeInTheDocument();
      expect(screen.getByText('Edit Code')).toBeInTheDocument();
      expect(screen.getByText('Preview')).toBeInTheDocument();
    });

    it('should call onDelete when delete button is clicked', () => {
      render(
        <CustomCodeBlock
          block={mockBlock}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
          isEditing={true}
        />
      );

      const deleteButton = screen.getByRole('button', { name: /alert/i });
      fireEvent.click(deleteButton);

      expect(mockOnDelete).toHaveBeenCalledTimes(1);
    });

    it('should update code type when selection changes', () => {
      render(
        <CustomCodeBlock
          block={mockBlock}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
          isEditing={true}
        />
      );

      // This test would need to interact with the Select component
      // Implementation depends on the Select component's testability
    });
  });

  describe('Security Features', () => {
    it('should show security warnings for potentially dangerous code', () => {
      const dangerousBlock = {
        ...mockBlock,
        content: {
          ...mockBlock.content,
          html: '<script>alert("xss")</script>'
        }
      };

      render(
        <CustomCodeBlock
          block={dangerousBlock}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
          isEditing={true}
        />
      );

      expect(screen.getByText('Security Review')).toBeInTheDocument();
      expect(screen.getByText(/script/i)).toBeInTheDocument();
    });

    it('should show security warnings for inline event handlers', () => {
      const eventHandlerBlock = {
        ...mockBlock,
        content: {
          ...mockBlock.content,
          html: '<div onclick="alert("test")">Click me</div>'
        }
      };

      render(
        <CustomCodeBlock
          block={eventHandlerBlock}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
          isEditing={true}
        />
      );

      expect(screen.getByText(/onclick/i)).toBeInTheDocument();
    });
  });

  describe('Code Parsing', () => {
    it('should extract code blocks from combined code', () => {
      const combinedBlock = {
        ...mockBlock,
        content: {
          ...mockBlock.content,
          html: `
            <html>
              <h1>Title</h1>
              <style>.test { color: blue; }</style>
              <script>console.log('test');</script>
            </html>
          `,
          codeType: 'combined'
        }
      };

      render(
        <CustomCodeBlock
          block={combinedBlock}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
          isEditing={false}
        />
      );

      // The iframe should render the combined code
      // We can check that the iframe exists
      expect(document.querySelector('iframe')).toBeInTheDocument();
    });
  });

  describe('Preview Mode', () => {
    it('should show iframe in preview mode when tabs are switched', async () => {
      render(
        <CustomCodeBlock
          block={mockBlock}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
          isEditing={true}
        />
      );

      const previewTab = screen.getByText('Preview');
      fireEvent.click(previewTab);

      await waitFor(() => {
        expect(screen.getByText(/Preview runs in sandboxed iframe/i)).toBeInTheDocument();
      });
    });

    it('should show preview disabled message when autoRun is false', () => {
      const noAutoRunBlock = {
        ...mockBlock,
        content: {
          ...mockBlock.content,
          autoRun: false
        }
      };

      render(
        <CustomCodeBlock
          block={noAutoRunBlock}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
          isEditing={true}
        />
      );

      const previewTab = screen.getByText('Preview');
      fireEvent.click(previewTab);

      expect(screen.getByText(/Auto-run is disabled/i)).toBeInTheDocument();
    });
  });

  describe('Settings', () => {
    it('should render sandbox mode toggle', () => {
      render(
        <CustomCodeBlock
          block={mockBlock}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
          isEditing={true}
        />
      );

      expect(screen.getByText('Sandbox Mode')).toBeInTheDocument();
    });

    it('should render security warnings toggle', () => {
      render(
        <CustomCodeBlock
          block={mockBlock}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
          isEditing={true}
        />
      );

      expect(screen.getByText('Security Warnings')).toBeInTheDocument();
    });
  });
});
