// ListBlock Usage Examples
// This file demonstrates various ways to use the ListBlock component

import React, { useState } from 'react';
import ListBlock from './ListBlock';
import { Block } from '../types';

// Example 1: Simple Bullet List
export const SimpleBulletListExample = () => {
  const [block, setBlock] = useState<Block>({
    id: 'list-1',
    type: 'list',
    title: 'Features',
    content: {
      type: 'bullet',
      items: [
        { id: '1', text: 'Easy to use interface', checked: false, indentLevel: 0 },
        { id: '2', text: 'Mobile responsive design', checked: false, indentLevel: 0 },
        { id: '3', text: 'Real-time collaboration', checked: false, indentLevel: 0 }
      ],
      bulletIcon: 'disc',
      spacing: 'normal'
    },
    settings: {
      visible: true,
      order: 0,
      customClasses: [],
      padding: '1rem',
      margin: '0.5rem 0'
    },
    design: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      borderRadius: '8px',
      padding: '1rem',
      margin: '0.5rem 0'
    }
  });

  const handleUpdate = (updates: Partial<Block>) => {
    setBlock({ ...block, ...updates });
  };

  return (
    <ListBlock
      block={block}
      onUpdate={handleUpdate}
      onDelete={() => console.log('Delete block')}
      isEditing={false}
    />
  );
};

// Example 2: Numbered List with Starting Number
export const NumberedListExample = () => {
  const [block, setBlock] = useState<Block>({
    id: 'list-2',
    type: 'list',
    title: 'Step-by-Step Guide',
    content: {
      type: 'numbered',
      items: [
        { id: '1', text: 'Sign up for an account', checked: false, indentLevel: 0 },
        { id: '2', text: 'Verify your email address', checked: false, indentLevel: 0 },
        { id: '3', text: 'Complete your profile', checked: false, indentLevel: 0 },
        { id: '4', text: 'Start creating content', checked: false, indentLevel: 0 }
      ],
      startNumber: 1,
      spacing: 'relaxed'
    },
    settings: {
      visible: true,
      order: 0,
      customClasses: [],
      padding: '1rem',
      margin: '0.5rem 0'
    },
    design: {
      backgroundColor: '#f8f9fa',
      textColor: '#333333',
      borderRadius: '8px',
      padding: '1.5rem',
      margin: '0.5rem 0'
    }
  });

  const handleUpdate = (updates: Partial<Block>) => {
    setBlock({ ...block, ...updates });
  };

  return (
    <ListBlock
      block={block}
      onUpdate={handleUpdate}
      onDelete={() => console.log('Delete block')}
      isEditing={true}
    />
  );
};

// Example 3: Interactive Checklist
export const ChecklistExample = () => {
  const [block, setBlock] = useState<Block>({
    id: 'list-3',
    type: 'list',
    title: 'Project Checklist',
    content: {
      type: 'checklist',
      items: [
        { id: '1', text: 'Define project requirements', checked: true, indentLevel: 0 },
        { id: '2', text: 'Create wireframes', checked: true, indentLevel: 0 },
        { id: '3', text: 'Design mockups', checked: false, indentLevel: 0 },
        { id: '4', text: 'Develop frontend', checked: false, indentLevel: 0 },
        { id: '5', text: 'Test and deploy', checked: false, indentLevel: 0 }
      ],
      spacing: 'normal'
    },
    settings: {
      visible: true,
      order: 0,
      customClasses: [],
      padding: '1rem',
      margin: '0.5rem 0'
    },
    design: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      borderRadius: '8px',
      padding: '1rem',
      margin: '0.5rem 0',
      border: '1px solid #e1e5e9'
    }
  });

  const handleUpdate = (updates: Partial<Block>) => {
    setBlock({ ...block, ...updates });
  };

  return <ListBlock block={block} onUpdate={handleUpdate} onDelete={() => {}} isEditing={false} />;
};

// Example 4: Nested List (Multi-level)
export const NestedListExample = () => {
  const [block, setBlock] = useState<Block>({
    id: 'list-4',
    type: 'list',
    title: 'Product Categories',
    content: {
      type: 'bullet',
      items: [
        { id: '1', text: 'Electronics', checked: false, indentLevel: 0 },
        { id: '2', text: 'Computers & Laptops', checked: false, indentLevel: 1 },
        { id: '3', text: 'Smartphones', checked: false, indentLevel: 1 },
        { id: '4', text: 'Audio Equipment', checked: false, indentLevel: 1 },
        { id: '5', text: 'Clothing', checked: false, indentLevel: 0 },
        { id: '6', text: 'Men\'s Wear', checked: false, indentLevel: 1 },
        { id: '7', text: 'Women\'s Wear', checked: false, indentLevel: 1 },
        { id: '8', text: 'Accessories', checked: false, indentLevel: 2 },
        { id: '9', text: 'Hats & Caps', checked: false, indentLevel: 3 },
        { id: '10', text: 'Jewelry', checked: false, indentLevel: 2 }
      ],
      bulletIcon: 'circle',
      spacing: 'relaxed'
    },
    settings: {
      visible: true,
      order: 0,
      customClasses: [],
      padding: '1rem',
      margin: '0.5rem 0'
    },
    design: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      borderRadius: '8px',
      padding: '1.5rem',
      margin: '0.5rem 0'
    }
  });

  const handleUpdate = (updates: Partial<Block>) => {
    setBlock({ ...block, ...updates });
  };

  return <ListBlock block={block} onUpdate={handleUpdate} onDelete={() => {}} isEditing={true} />;
};

// Example 5: Custom Styled List
export const StyledListExample = () => {
  const [block, setBlock] = useState<Block>({
    id: 'list-5',
    type: 'list',
    title: 'Premium Features',
    content: {
      type: 'bullet',
      items: [
        { id: '1', text: 'Unlimited projects', checked: false, indentLevel: 0 },
        { id: '2', text: 'Advanced analytics', checked: false, indentLevel: 0 },
        { id: '3', text: 'Priority support', checked: false, indentLevel: 0 },
        { id: '4', text: 'Team collaboration', checked: false, indentLevel: 0 }
      ],
      bulletIcon: 'star',
      spacing: 'compact'
    },
    settings: {
      visible: true,
      order: 0,
      customClasses: ['premium-list'],
      padding: '1rem',
      margin: '0.5rem 0'
    },
    design: {
      backgroundColor: '#f8f9fa',
      textColor: '#0f172a',
      borderRadius: '12px',
      padding: '2rem',
      margin: '1rem 0',
      border: '2px solid #ffd700',
      shadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }
  });

  const handleUpdate = (updates: Partial<Block>) => {
    setBlock({ ...block, ...updates });
  };

  return <ListBlock block={block} onUpdate={handleUpdate} onDelete={() => {}} isEditing={false} />;
};

// Example 6: Large List Performance Test
export const LargeListExample = () => {
  const generateLargeList = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      id: `item-${i}`,
      text: `List item number ${i + 1}`,
      checked: false,
      indentLevel: Math.floor(Math.random() * 3)
    }));
  };

  const [block, setBlock] = useState<Block>({
    id: 'list-6',
    type: 'list',
    title: 'Large List Performance Test',
    content: {
      type: 'bullet',
      items: generateLargeList(50),
      bulletIcon: 'disc',
      spacing: 'compact'
    },
    settings: {
      visible: true,
      order: 0,
      customClasses: [],
      padding: '1rem',
      margin: '0.5rem 0'
    },
    design: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      borderRadius: '8px',
      padding: '1rem',
      margin: '0.5rem 0'
    }
  });

  const handleUpdate = (updates: Partial<Block>) => {
    setBlock({ ...block, ...updates });
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Performance Test (50 items)</h3>
      <ListBlock block={block} onUpdate={handleUpdate} onDelete={() => {}} isEditing={true} />
    </div>
  );
};

// Utility component to demonstrate all examples
export const ListBlockShowcase = () => {
  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-bold">ListBlock Component Showcase</h1>
      
      <section>
        <h2 className="text-xl font-semibold mb-4">1. Simple Bullet List (Public View)</h2>
        <SimpleBulletListExample />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">2. Numbered List (Edit Mode)</h2>
        <NumberedListExample />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">3. Interactive Checklist (Public View)</h2>
        <ChecklistExample />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">4. Nested List (Edit Mode)</h2>
        <NestedListExample />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">5. Custom Styled List (Public View)</h2>
        <StyledListExample />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">6. Large List Performance Test (50 items)</h2>
        <LargeListExample />
      </section>
    </div>
  );
};

export default ListBlockShowcase;