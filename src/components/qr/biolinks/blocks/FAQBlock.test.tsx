/**
 * FAQ Block Test Suite
 * Tests for functionality, rendering, and user interactions
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FAQBlock from './FAQBlock';
import { Block } from '../types';

// Mock block data
const createMockBlock = (overrides = {}): Block => ({
  id: 'block_123',
  type: 'faq',
  title: 'FAQ Block',
  content: {
    items: [
      {
        id: 'faq-1',
        question: 'What is your return policy?',
        answer: 'We offer a 30-day return policy for all items.',
        open: false
      },
      {
        id: 'faq-2',
        question: 'How long does shipping take?',
        answer: 'Shipping typically takes 3-5 business days.',
        open: false
      }
    ],
    allowMultipleOpen: false,
    searchPlaceholder: 'Search FAQs...'
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
  },
  ...overrides
});

describe('FAQBlock', () => {
  const mockOnUpdate = vi.fn();
  const mockOnDelete = vi.fn();

  describe('Public View (isEditing = false)', () => {
    it('renders FAQ items in public view', () => {
      const block = createMockBlock();
      render(
        <FAQBlock 
          block={block} 
          isEditing={false}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText('What is your return policy?')).toBeInTheDocument();
      expect(screen.getByText('How long does shipping take?')).toBeInTheDocument();
    });

    it('renders search input in public view', () => {
      const block = createMockBlock();
      render(
        <FAQBlock 
          block={block} 
          isEditing={false}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
        />
      );

      const searchInput = screen.getByPlaceholderText('Search FAQs...');
      expect(searchInput).toBeInTheDocument();
    });

    it('filters FAQ items based on search query', async () => {
      const block = createMockBlock();
      render(
        <FAQBlock 
          block={block} 
          isEditing={false}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
        />
      );

      const searchInput = screen.getByPlaceholderText('Search FAQs...');
      fireEvent.change(searchInput, { target: { value: 'return' } });

      await waitFor(() => {
        expect(screen.getByText('What is your return policy?')).toBeInTheDocument();
        expect(screen.queryByText('How long does shipping take?')).not.toBeInTheDocument();
      });
    });

    it('generates schema.org structured data', () => {
      const block = createMockBlock();
      const { container } = render(
        <FAQBlock 
          block={block} 
          isEditing={false}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
        />
      );

      const scriptTag = container.querySelector('script[type="application/ld+json"]');
      expect(scriptTag).toBeInTheDocument();

      const structuredData = JSON.parse(scriptTag?.textContent || '{}');
      expect(structuredData['@context']).toBe('https://schema.org');
      expect(structuredData['@type']).toBe('FAQPage');
      expect(structuredData.mainEntity).toHaveLength(2);
    });

    it('renders empty state when no items exist', () => {
      const block = createMockBlock({
        content: {
          items: [],
          allowMultipleOpen: false
        }
      });
      const { container } = render(
        <FAQBlock 
          block={block} 
          isEditing={false}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
        />
      );

      // Should not render anything when no items in public view
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Edit View (isEditing = true)', () => {
    it('renders editor interface', () => {
      const block = createMockBlock();
      render(
        <FAQBlock 
          block={block} 
          isEditing={true}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText('FAQ Block')).toBeInTheDocument();
      expect(screen.getByText('FAQ Items')).toBeInTheDocument();
      expect(screen.getByText('Add Item')).toBeInTheDocument();
    });

    it('renders all FAQ items in edit mode', () => {
      const block = createMockBlock();
      render(
        <FAQBlock 
          block={block} 
          isEditing={true}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });

    it('calls onUpdate when adding new item', () => {
      const block = createMockBlock({
        content: {
          items: [],
          allowMultipleOpen: false
        }
      });
      render(
        <FAQBlock 
          block={block} 
          isEditing={true}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
        />
      );

      const addButton = screen.getByText('Add Item');
      fireEvent.click(addButton);

      expect(mockOnUpdate).toHaveBeenCalled();
      const updateCall = mockOnUpdate.mock.calls[0][0];
      expect(updateCall.content.items).toHaveLength(1);
    });

    it('calls onUpdate when deleting an item', () => {
      const block = createMockBlock();
      render(
        <FAQBlock 
          block={block} 
          isEditing={true}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
        />
      );

      // Find delete buttons for first item
      const deleteButtons = screen.getAllByRole('button', { name: /trash/i });
      fireEvent.click(deleteButtons[0]);

      expect(mockOnUpdate).toHaveBeenCalled();
      const updateCall = mockOnUpdate.mock.calls[0][0];
      expect(updateCall.content.items).toHaveLength(1);
    });

    it('calls onUpdate when moving items up/down', () => {
      const block = createMockBlock();
      render(
        <FAQBlock 
          block={block} 
          isEditing={true}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
        />
      );

      // Find all ChevronDown buttons
      const downButtons = screen.getAllByRole('button').filter(button => 
        button.querySelector('svg')?.getAttribute('data-icon') === 'chevron-down'
      );

      // Click the first down button
      if (downButtons.length > 0) {
        fireEvent.click(downButtons[0]);
        expect(mockOnUpdate).toHaveBeenCalled();
      }
    });

    it('updates item question correctly', () => {
      const block = createMockBlock();
      render(
        <FAQBlock 
          block={block} 
          isEditing={true}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
        />
      );

      const questionInputs = screen.getAllByPlaceholderText('Enter your question...');
      fireEvent.change(questionInputs[0], { target: { value: 'Updated question' } });

      expect(mockOnUpdate).toHaveBeenCalled();
      const updateCall = mockOnUpdate.mock.calls[0][0];
      expect(updateCall.content.items[0].question).toBe('Updated question');
    });

    it('updates item answer correctly', () => {
      const block = createMockBlock();
      render(
        <FAQBlock 
          block={block} 
          isEditing={true}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
        />
      );

      const answerInputs = screen.getAllByPlaceholderText('Enter the answer...');
      fireEvent.change(answerInputs[0], { target: { value: 'Updated answer' } });

      expect(mockOnUpdate).toHaveBeenCalled();
      const updateCall = mockOnUpdate.mock.calls[0][0];
      expect(updateCall.content.items[0].answer).toBe('Updated answer');
    });

    it('calls onDelete when delete button is clicked', () => {
      const block = createMockBlock();
      render(
        <FAQBlock 
          block={block} 
          isEditing={true}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
        />
      );

      const headerDeleteButton = screen.getByRole('button', { 
        name: /delete/i 
      }).closest('button');
      
      if (headerDeleteButton) {
        fireEvent.click(headerDeleteButton);
        expect(mockOnDelete).toHaveBeenCalled();
      }
    });

    it('toggles allowMultipleOpen setting', () => {
      const block = createMockBlock();
      render(
        <FAQBlock 
          block={block} 
          isEditing={true}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
        />
      );

      const toggleSwitch = screen.getByRole('checkbox', { 
        name: /allow multiple/i 
      });
      fireEvent.click(toggleSwitch);

      expect(mockOnUpdate).toHaveBeenCalled();
      const updateCall = mockOnUpdate.mock.calls[0][0];
      expect(updateCall.content.allowMultipleOpen).toBe(true);
    });

    it('updates search placeholder text', () => {
      const block = createMockBlock();
      render(
        <FAQBlock 
          block={block} 
          isEditing={true}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
        />
      );

      const placeholderInput = screen.getByPlaceholderText('Search FAQs...');
      fireEvent.change(placeholderInput, { target: { value: 'Find answers...' } });

      expect(mockOnUpdate).toHaveBeenCalled();
      const updateCall = mockOnUpdate.mock.calls[0][0];
      expect(updateCall.content.searchPlaceholder).toBe('Find answers...');
    });
  });

  describe('Edge Cases', () => {
    it('handles items without IDs by generating them', () => {
      const block = createMockBlock({
        content: {
          items: [
            {
              question: 'Test question',
              answer: 'Test answer'
            }
          ],
          allowMultipleOpen: false
        }
      });
      render(
        <FAQBlock 
          block={block} 
          isEditing={true}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    it('handles empty search results', () => {
      const block = createMockBlock();
      render(
        <FAQBlock 
          block={block} 
          isEditing={false}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
        />
      );

      const searchInput = screen.getByPlaceholderText('Search FAQs...');
      fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

      expect(screen.getByText('No FAQs found matching your search.')).toBeInTheDocument();
    });

    it('does not show search in edit mode', () => {
      const block = createMockBlock();
      render(
        <FAQBlock 
          block={block} 
          isEditing={true}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.queryByPlaceholderText('Search FAQs...')).not.toBeInTheDocument();
    });
  });
});
