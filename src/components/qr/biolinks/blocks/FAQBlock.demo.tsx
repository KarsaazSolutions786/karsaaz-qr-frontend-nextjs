/**
 * FAQ Block Demo
 * Demonstrates the FAQ Block component in both edit and public modes
 */

import { useState } from 'react';
import FAQBlock from './FAQBlock';
import { Block } from '../types';

export default function FAQBlockDemo() {
  // Sample FAQ block data
  const [block, setBlock] = useState<Block>({
    id: 'faq-demo-1',
    type: 'faq',
    title: 'FAQ Demo',
    content: {
      items: [
        {
          id: 'faq-1',
          question: 'How do I create an account?',
          answer: 'Creating an account is simple! Click the "Sign Up" button in the top right corner and fill out the registration form with your email address and a secure password. You\'ll receive a confirmation email to verify your account.',
          open: false
        },
        {
          id: 'faq-2',
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, and Google Pay. All transactions are secured with SSL encryption to protect your payment information.',
          open: false
        },
        {
          id: 'faq-3',
          question: 'How can I track my order?',
          answer: 'Once your order ships, you\'ll receive an email with a tracking number and link. You can also log into your account and view order status in the "My Orders" section. Tracking information typically becomes available within 24 hours of shipment.',
          open: false
        },
        {
          id: 'faq-4',
          question: 'What is your return policy?',
          answer: 'We offer a 30-day return policy for all unused items in their original packaging. To initiate a return, please contact our customer service team with your order number. Refunds are processed within 5-7 business days after we receive the returned item.',
          open: false
        }
      ],
      allowMultipleOpen: false,
      searchPlaceholder: 'Search our FAQs...'
    },
    settings: {
      visible: true,
      order: 0,
      customClasses: [],
      padding: '1.5rem',
      margin: '1rem 0'
    },
    design: {
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      borderRadius: '12px',
      padding: '1.5rem',
      margin: '1rem 0',
      border: '1px solid #e5e7eb'
    }
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = (updates: Partial<Block>) => {
    setBlock(prev => ({
      ...prev,
      ...updates,
      content: {
        ...prev.content,
        ...(updates.content || {})
      },
      settings: {
        ...prev.settings,
        ...(updates.settings || {})
      },
      design: {
        ...prev.design,
        ...(updates.design || {})
      }
    }));
  };

  const handleDelete = () => {
    alert('Block would be deleted in real implementation');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Demo Controls */}
        <div className="mb-8 bg-white rounded-lg shadow-sm border p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">FAQ Block Demo</h1>
          <p className="text-gray-600 mb-6">
            Interactive demonstration of the FAQ Block component with all features.
          </p>
          
          <div className="flex flex-wrap gap-4 items-center">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isEditing 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {isEditing ? 'Switch to Public View' : 'Switch to Edit View'}
            </button>
            
            <div className="text-sm text-gray-500">
              Mode: <span className="font-semibold text-gray-700">
                {isEditing ? 'Editing' : 'Public'}
              </span>
            </div>
          </div>
        </div>

        {/* FAQ Block Component */}
        <div className="bg-white rounded-lg shadow-sm border">
          <FAQBlock
            block={block}
            isEditing={isEditing}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        </div>

        {/* Feature Highlights */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              ✨ Key Features
            </h2>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Collapsible Q&A items with smooth animations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Real-time search and filtering</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Schema.org structured data for SEO</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Single or multiple open items</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Add, remove, and reorder items</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              🎯 Usage
            </h2>
            <div className="text-gray-600 text-sm space-y-2">
              <p>
                <strong>Public View:</strong> Users can search and browse FAQs with smooth accordion animations and SEO-optimized structured data.
              </p>
              <p>
                <strong>Edit View:</strong> Content creators can manage FAQ items, reorder them, and customize settings like search placeholder and multiple open behavior.
              </p>
            </div>
          </div>
        </div>

        {/* Technical Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">
            ℹ️ Technical Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <strong>Component:</strong> FAQBlock.tsx
            </div>
            <div>
              <strong>Type:</strong> content
            </div>
            <div>
              <strong>Dependencies:</strong> @radix-ui/react-accordion
            </div>
            <div>
              <strong>Features:</strong> Search, Accordion, Structured Data
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export for use in other files
export { FAQBlockDemo };