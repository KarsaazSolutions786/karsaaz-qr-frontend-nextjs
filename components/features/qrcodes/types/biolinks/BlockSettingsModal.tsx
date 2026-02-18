'use client';

import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import {
  BiolinkBlock,
  BlockType,
  LinkBlock,
  TextBlock,
  HeadingBlock,
  ImageBlock,
  EmailBlock,
  PhoneBlock,
  LocationBlock,
  DownloadBlock,
  NewsletterBlock,
} from '@/types/entities/biolinks';

interface BlockSettingsModalProps {
  block: BiolinkBlock;
  onSave: (block: BiolinkBlock) => void;
  onClose: () => void;
}

export function BlockSettingsModal({ block, onSave, onClose }: BlockSettingsModalProps) {
  const [formData, setFormData] = useState<BiolinkBlock>(block);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const renderFields = () => {
    switch (block.type) {
      case BlockType.LINK:
        const linkBlock = formData as LinkBlock;
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Button Title *
              </label>
              <input
                type="text"
                value={linkBlock.title}
                onChange={(e) => updateField('title', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Visit My Website"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL *</label>
              <input
                type="url"
                value={linkBlock.url}
                onChange={(e) => updateField('url', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Icon (optional)
              </label>
              <input
                type="text"
                value={linkBlock.icon || ''}
                onChange={(e) => updateField('icon', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Icon name or emoji"
              />
            </div>
          </>
        );

      case BlockType.TEXT:
        const textBlock = formData as TextBlock;
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Text Content *
              </label>
              <textarea
                value={textBlock.content}
                onChange={(e) => updateField('content', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Enter your text..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alignment</label>
              <select
                value={textBlock.alignment || 'center'}
                onChange={(e) => updateField('alignment', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </>
        );

      case BlockType.HEADING:
        const headingBlock = formData as HeadingBlock;
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Heading Text *
              </label>
              <input
                type="text"
                value={headingBlock.text}
                onChange={(e) => updateField('text', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter heading..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
              <select
                value={headingBlock.level}
                onChange={(e) => updateField('level', parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="1">H1 - Largest</option>
                <option value="2">H2</option>
                <option value="3">H3</option>
                <option value="4">H4</option>
                <option value="5">H5</option>
                <option value="6">H6 - Smallest</option>
              </select>
            </div>
          </>
        );

      case BlockType.IMAGE:
        const imageBlock = formData as ImageBlock;
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL *
              </label>
              <input
                type="url"
                value={imageBlock.url}
                onChange={(e) => updateField('url', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alt Text (optional)
              </label>
              <input
                type="text"
                value={imageBlock.alt || ''}
                onChange={(e) => updateField('alt', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Description of image"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Link URL (optional)
              </label>
              <input
                type="url"
                value={imageBlock.link || ''}
                onChange={(e) => updateField('link', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com"
              />
            </div>
          </>
        );

      case BlockType.EMAIL:
        const emailBlock = formData as EmailBlock;
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                value={emailBlock.email}
                onChange={(e) => updateField('email', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="contact@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject (optional)
              </label>
              <input
                type="text"
                value={emailBlock.subject || ''}
                onChange={(e) => updateField('subject', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Subject line"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Button Text
              </label>
              <input
                type="text"
                value={emailBlock.buttonText || 'Send Email'}
                onChange={(e) => updateField('buttonText', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        );

      case BlockType.PHONE:
        const phoneBlock = formData as PhoneBlock;
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                value={phoneBlock.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="+1234567890"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Button Text
              </label>
              <input
                type="text"
                value={phoneBlock.buttonText || 'Call Now'}
                onChange={(e) => updateField('buttonText', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showWhatsApp"
                checked={phoneBlock.showWhatsApp || false}
                onChange={(e) => updateField('showWhatsApp', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="showWhatsApp" className="text-sm text-gray-700">
                Show WhatsApp option
              </label>
            </div>
          </>
        );

      case BlockType.LOCATION:
        const locationBlock = formData as LocationBlock;
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <textarea
                value={locationBlock.address}
                onChange={(e) => updateField('address', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="123 Main St, City, State"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Google Maps URL (optional)
              </label>
              <input
                type="url"
                value={locationBlock.mapUrl || ''}
                onChange={(e) => updateField('mapUrl', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="https://maps.google.com/..."
              />
            </div>
          </>
        );

      case BlockType.DOWNLOAD:
        const downloadBlock = formData as DownloadBlock;
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                File Name *
              </label>
              <input
                type="text"
                value={downloadBlock.fileName}
                onChange={(e) => updateField('fileName', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="document.pdf"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                File URL *
              </label>
              <input
                type="url"
                value={downloadBlock.fileUrl}
                onChange={(e) => updateField('fileUrl', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/file.pdf"
                required
              />
            </div>
          </>
        );

      case BlockType.NEWSLETTER:
        const newsletterBlock = formData as NewsletterBlock;
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                value={newsletterBlock.title}
                onChange={(e) => updateField('title', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Subscribe to Newsletter"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (optional)
              </label>
              <textarea
                value={newsletterBlock.description || ''}
                onChange={(e) => updateField('description', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Endpoint *
              </label>
              <input
                type="url"
                value={newsletterBlock.apiEndpoint}
                onChange={(e) => updateField('apiEndpoint', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="https://api.example.com/subscribe"
                required
              />
            </div>
          </>
        );

      default:
        return (
          <div className="text-gray-500 text-center py-4">
            Settings for {block.type} block coming soon...
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Block Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-4">{renderFields()}</div>

          <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
