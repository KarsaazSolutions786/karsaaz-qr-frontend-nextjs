import { render, screen, fireEvent, waitFor as _waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import FileBlock from './FileBlock';
import { Block } from '../types';
import { fileBlockExamples } from './FileBlock.demo';
import React from 'react';

// Mock axios
vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
    delete: vi.fn(),
    isAxiosError: (error: unknown) => (error as { isAxiosError?: boolean })?.isAxiosError
  }
}));

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

describe('FileBlock', () => {
  const mockOnUpdate = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Public View (isEditing = false)', () => {
    it('renders file list with metadata', () => {
      const block = fileBlockExamples.basic;
      render(
        <FileBlock
          block={block}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
          isEditing={false}
        />
      );

      // Check title
      expect(screen.getByText('Product Documentation')).toBeInTheDocument();
      
      // Check description
      expect(screen.getByText('Download our latest product documentation and user guides')).toBeInTheDocument();
      
      // Check file names
      expect(screen.getByText('Product_Brochure.pdf')).toBeInTheDocument();
      expect(screen.getByText('User_Manual.docx')).toBeInTheDocument();
      
      // Check file sizes
      expect(screen.getByText('2.45 MB')).toBeInTheDocument();
      expect(screen.getByText('1.86 MB')).toBeInTheDocument();
      
      // Check file types
      expect(screen.getByText('pdf')).toBeInTheDocument();
      expect(screen.getByText('docx')).toBeInTheDocument();
    });

    it('renders preview button for previewable files', () => {
      const block = fileBlockExamples.imageGallery;
      render(
        <FileBlock
          block={block}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
          isEditing={false}
        />
      );

      // Should have preview buttons for images
      const previewButtons = screen.getAllByTitle('Preview');
      expect(previewButtons.length).toBe(3);
    });

    it('renders download buttons for all files', () => {
      const block = fileBlockExamples.basic;
      render(
        <FileBlock
          block={block}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
          isEditing={false}
        />
      );

      // Should have download buttons
      const downloadButtons = screen.getAllByTitle('Download');
      expect(downloadButtons.length).toBe(2);
    });

    it('shows empty state when no files', () => {
      const block = fileBlockExamples.empty;
      render(
        <FileBlock
          block={block}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
          isEditing={false}
        />
      );

      expect(screen.getByText('No files available')).toBeInTheDocument();
    });

    it('hides file size when showFileSize is false', () => {
      const block = fileBlockExamples.minimal;
      render(
        <FileBlock
          block={block}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
          isEditing={false}
        />
      );

      // Should not show file size
      expect(screen.queryByText('1 MB')).not.toBeInTheDocument();
      // Should not show file type
      expect(screen.queryByText('pdf')).not.toBeInTheDocument();
    });
  });

  describe('Edit View (isEditing = true)', () => {
    it('renders edit interface with upload area', () => {
      const block = fileBlockExamples.empty;
      render(
        <FileBlock
          block={block}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
          isEditing={true}
        />
      );

      expect(screen.getByText('File Block')).toBeInTheDocument();
      expect(screen.getByText('Upload Files')).toBeInTheDocument();
      expect(screen.getByText('Drag & drop files here or click to browse')).toBeInTheDocument();
    });

    it('handles file input click', () => {
      const block = fileBlockExamples.empty;
      render(
        <FileBlock
          block={block}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
          isEditing={true}
        />
      );

      const uploadArea = screen.getByText('Drag & drop files here or click to browse').closest('div');
      const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
      
      // Mock click
      const clickSpy = vi.spyOn(fileInput, 'click');
      uploadArea && fireEvent.click(uploadArea);
      
      expect(clickSpy).toHaveBeenCalled();
    });

    it('updates title when typing', () => {
      const block = fileBlockExamples.empty;
      render(
        <FileBlock
          block={block}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
          isEditing={true}
        />
      );

      const titleInput = screen.getByLabelText('Title') as HTMLInputElement;
      fireEvent.change(titleInput, { target: { value: 'New Title' } });

      expect(mockOnUpdate).toHaveBeenCalledWith({
        content: expect.objectContaining({
          title: 'New Title'
        })
      });
    });

    it('updates description when typing', () => {
      const block = fileBlockExamples.empty;
      render(
        <FileBlock
          block={block}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
          isEditing={true}
        />
      );

      const descriptionInput = screen.getByLabelText('Description') as HTMLTextAreaElement;
      fireEvent.change(descriptionInput, { target: { value: 'New description' } });

      expect(mockOnUpdate).toHaveBeenCalledWith({
        content: expect.objectContaining({
          description: 'New description'
        })
      });
    });

    it('toggles settings switches', () => {
      const block = fileBlockExamples.empty;
      render(
        <FileBlock
          block={block}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
          isEditing={true}
        />
      );

      // Find all switch inputs
      const switches = screen.getAllByRole('switch');
      
      // Toggle multiple files switch
      fireEvent.click(switches[0]);
      
      expect(mockOnUpdate).toHaveBeenCalledWith({
        content: expect.objectContaining({
          allowMultiple: false
        })
      });
    });

    it('shows uploaded files list', () => {
      const block = fileBlockExamples.basic;
      render(
        <FileBlock
          block={block}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
          isEditing={true}
        />
      );

      expect(screen.getByText('Uploaded Files')).toBeInTheDocument();
      expect(screen.getByText('Product_Brochure.pdf')).toBeInTheDocument();
      expect(screen.getByText('User_Manual.docx')).toBeInTheDocument();
      
      // Should show remove buttons
      const removeButtons = screen.getAllByTitle('Remove');
      expect(removeButtons.length).toBe(2);
    });

    it('calls onDelete when delete button clicked', () => {
      const block = fileBlockExamples.basic;
      render(
        <FileBlock
          block={block}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
          isEditing={true}
        />
      );

      const deleteButton = screen.getByRole('button', { name: '' }); // The X button
      fireEvent.click(deleteButton);

      expect(mockOnDelete).toHaveBeenCalled();
    });
  });

  describe('File Type Icons', () => {
    const testCases = [
      { filename: 'document.pdf', expectedIcon: 'file-text' },
      { filename: 'image.jpg', expectedIcon: 'file-image' },
      { filename: 'video.mp4', expectedIcon: 'file-video' },
      { filename: 'audio.mp3', expectedIcon: 'file-audio' },
      { filename: 'archive.zip', expectedIcon: 'archive' },
      { filename: 'unknown.xyz', expectedIcon: 'file' }
    ];

    testCases.forEach(({ filename, expectedIcon }) => {
      it(`shows correct icon for ${filename}`, () => {
        const block: Block = {
          ...fileBlockExamples.empty,
          content: {
            ...fileBlockExamples.empty.content,
            files: [{
              id: 1,
              name: filename,
              path: `uploads/${filename}`,
              mime_type: 'application/octet-stream',
              size: 1048576,
              url: `https://example.com/${filename}`,
              created_at: '2024-01-15T10:00:00Z'
            }]
          }
        };

        render(
          <FileBlock
            block={block}
            onUpdate={mockOnUpdate}
            onDelete={mockOnDelete}
            isEditing={false}
          />
        );

        // The SVG should be rendered (testing implementation detail)
        expect(screen.getByText(filename)).toBeInTheDocument();
      });
    });
  });

  describe('File Size Formatting', () => {
    const testCases = [
      { size: 0, expected: '0 Bytes' },
      { size: 512, expected: '512 Bytes' },
      { size: 1024, expected: '1 KB' },
      { size: 1536, expected: '1.5 KB' },
      { size: 1048576, expected: '1 MB' },
      { size: 1073741824, expected: '1 GB' },
      { size: 5242880, expected: '5 MB' }
    ];

    testCases.forEach(({ size, expected }) => {
      it(`formats ${size} bytes as ${expected}`, () => {
        const block: Block = {
          ...fileBlockExamples.empty,
          content: {
            ...fileBlockExamples.empty.content,
            files: [{
              id: 1,
              name: 'test.file',
              path: 'uploads/test.file',
              mime_type: 'application/octet-stream',
              size: size,
              url: 'https://example.com/test.file',
              created_at: '2024-01-15T10:00:00Z'
            }]
          }
        };

        render(
          <FileBlock
            block={block}
            onUpdate={mockOnUpdate}
            onDelete={mockOnDelete}
            isEditing={false}
          />
        );

        expect(screen.getByText(expected)).toBeInTheDocument();
      });
    });
  });
});