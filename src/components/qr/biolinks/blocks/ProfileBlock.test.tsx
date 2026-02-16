import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProfileBlock from './ProfileBlock';
import { Block } from '../types';
import React from 'react';

describe('ProfileBlock', () => {
  const mockBlock: Block = {
    id: 'test-profile-block',
    type: 'profile',
    title: 'Profile Block',
    content: {
      name: 'John Doe',
      bio: 'Senior Developer at Tech Company',
      avatar: 'https://example.com/avatar.jpg',
      title: 'Senior Developer',
      company: 'Tech Company',
      website: 'https://johndoe.com',
      location: 'San Francisco, CA',
      verified: true,
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      socialLinks: [
        { platform: 'twitter', url: 'https://twitter.com/johndoe' },
        { platform: 'github', url: 'https://github.com/johndoe' }
      ],
      customFields: [
        { id: 'field-1', label: 'Years of Experience', value: '10+', icon: 'briefcase', visible: true },
        { id: 'field-2', label: 'Specialization', value: 'Full-Stack Development', icon: 'code', visible: true }
      ]
    },
    settings: {
      visible: true,
      order: 0,
      customClasses: [],
      padding: '2rem',
      margin: '0.5rem 0'
    },
    design: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      borderRadius: '12px',
      padding: '2rem',
      margin: '0.5rem 0'
    }
  };

  it('renders profile information in public view', () => {
    const mockOnUpdate = vi.fn();
    const mockOnDelete = vi.fn();

    render(
      <ProfileBlock 
        block={mockBlock} 
        onUpdate={mockOnUpdate} 
        onDelete={mockOnDelete}
        isEditing={false}
      />
    );

    // Check that main content is rendered
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Senior Developer at Tech Company')).toBeInTheDocument();
    expect(screen.getByText('Senior Developer')).toBeInTheDocument();
    expect(screen.getByText('Tech Company')).toBeInTheDocument();
    expect(screen.getByText('San Francisco, CA')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('shows verified badge when enabled', () => {
    const mockOnUpdate = vi.fn();
    const mockOnDelete = vi.fn();

    render(
      <ProfileBlock 
        block={mockBlock} 
        onUpdate={mockOnUpdate} 
        onDelete={mockOnDelete}
        isEditing={false}
      />
    );

    // Check for verified badge
    const verifiedBadges = screen.getAllByRole('img', { name: /check circle/i });
    expect(verifiedBadges.length).toBeGreaterThan(0);
  });

  it('renders social links', () => {
    const mockOnUpdate = vi.fn();
    const mockOnDelete = vi.fn();

    render(
      <ProfileBlock 
        block={mockBlock} 
        onUpdate={mockOnUpdate} 
        onDelete={mockOnDelete}
        isEditing={false}
      />
    );

    // Check social links are rendered
    expect(screen.getByText('Twitter')).toBeInTheDocument();
    expect(screen.getByText('GitHub')).toBeInTheDocument();
  });

  it('renders custom fields', () => {
    const mockOnUpdate = vi.fn();
    const mockOnDelete = vi.fn();

    render(
      <ProfileBlock 
        block={mockBlock} 
        onUpdate={mockOnUpdate} 
        onDelete={mockOnDelete}
        isEditing={false}
      />
    );

    // Check custom fields
    expect(screen.getByText('Years of Experience:')).toBeInTheDocument();
    expect(screen.getByText('10+')).toBeInTheDocument();
    expect(screen.getByText('Specialization:')).toBeInTheDocument();
    expect(screen.getByText('Full-Stack Development')).toBeInTheDocument();
  });

  it('renders edit view when isEditing is true', () => {
    const mockOnUpdate = vi.fn();
    const mockOnDelete = vi.fn();

    render(
      <ProfileBlock 
        block={mockBlock} 
        onUpdate={mockOnUpdate} 
        onDelete={mockOnDelete}
        isEditing={true}
      />
    );

    // Check edit mode title
    expect(screen.getByText('Profile Block')).toBeInTheDocument();
    
    // Should have input fields
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/bio/i)).toBeInTheDocument();
  });

  it('does not render empty profile in public view', () => {
    const emptyBlock: Block = {
      ...mockBlock,
      content: {
        name: '',
        bio: '',
        avatar: '',
        title: '',
        company: '',
        website: '',
        location: '',
        verified: false,
        email: '',
        phone: '',
        socialLinks: [],
        customFields: []
      }
    };

    const mockOnUpdate = vi.fn();
    const mockOnDelete = vi.fn();

    const { container } = render(
      <ProfileBlock 
        block={emptyBlock} 
        onUpdate={mockOnUpdate} 
        onDelete={mockOnDelete}
        isEditing={false}
      />
    );

    // Should return null for empty profile in public view
    expect(container.firstChild).toBeNull();
  });
});