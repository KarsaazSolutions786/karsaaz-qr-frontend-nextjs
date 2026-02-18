'use client';

import React from 'react';
import { Download, Facebook, Twitter, Instagram, Linkedin, Github, Youtube, Phone, Mail, Globe, MapPin } from 'lucide-react';
import PreviewHeader from '@/components/public/shared/PreviewHeader';
import PreviewFooter from '@/components/public/shared/PreviewFooter';
import SocialShare from '@/components/public/shared/SocialShare';
import QRCodeBadge from '@/components/public/shared/QRCodeBadge';
import ContactCard from './ContactCard';
import { Button } from '@/components/ui/button';

interface VCardData {
  firstName?: string;
  lastName?: string;
  title?: string;
  company?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  photo?: string;
  bio?: string;
  birthday?: string;
  customFields?: Array<{
    label: string;
    value: string;
  }>;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    github?: string;
    youtube?: string;
  };
  theme?: {
    primaryColor?: string;
    accentColor?: string;
  };
}

interface VCardPreviewProps {
  vcard: VCardData;
}

export default function VCardPreview({ vcard }: VCardPreviewProps) {
  const primaryColor = vcard.theme?.primaryColor || '#2563eb';
  const fullName = [vcard.firstName, vcard.lastName].filter(Boolean).join(' ');
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const socialIcons = {
    facebook: { icon: Facebook, color: 'bg-blue-600 hover:bg-blue-700' },
    twitter: { icon: Twitter, color: 'bg-sky-500 hover:bg-sky-600' },
    instagram: { icon: Instagram, color: 'bg-pink-600 hover:bg-pink-700' },
    linkedin: { icon: Linkedin, color: 'bg-blue-700 hover:bg-blue-800' },
    github: { icon: Github, color: 'bg-gray-800 hover:bg-gray-900' },
    youtube: { icon: Youtube, color: 'bg-red-600 hover:bg-red-700' },
  };

  const handleDownloadVCard = () => {
    const vcfData = generateVCF(vcard);
    const blob = new Blob([vcfData], { type: 'text/vcard;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fullName.replace(/\s+/g, '_')}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Header with Share */}
      <PreviewHeader
        logo={vcard.photo}
        title={fullName}
        subtitle={vcard.title}
        actions={
          <SocialShare
            url={currentUrl}
            title={fullName}
            description={vcard.bio || `Contact information for ${fullName}`}
            size="md"
          />
        }
      />

      <main className="flex-1 pb-16">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Contact Card */}
          <div className="mb-8">
            <ContactCard
              firstName={vcard.firstName}
              lastName={vcard.lastName}
              title={vcard.title}
              company={vcard.company}
              phone={vcard.phone}
              email={vcard.email}
              website={vcard.website}
              address={vcard.address}
              city={vcard.city}
              state={vcard.state}
              zip={vcard.zip}
              country={vcard.country}
              photo={vcard.photo}
              theme={vcard.theme}
            />
          </div>

          {/* Add to Contacts Button */}
          <div className="mb-8">
            <Button
              onClick={handleDownloadVCard}
              className="w-full h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              style={{ backgroundColor: primaryColor }}
            >
              <Download className="w-5 h-5 mr-2" />
              Add to Contacts
            </Button>
          </div>

          {/* Bio/Description */}
          {vcard.bio && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{vcard.bio}</p>
            </div>
          )}

          {/* Social Media Links */}
          {vcard.socialMedia && Object.values(vcard.socialMedia).some(v => v) && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Connect</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {Object.entries(vcard.socialMedia).map(([platform, url]) => {
                  if (!url) return null;
                  const social = socialIcons[platform as keyof typeof socialIcons];
                  const Icon = social.icon;
                  return (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-3 p-4 rounded-xl text-white transition-all transform hover:scale-105 ${social.color}`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium capitalize">{platform}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* Custom Fields */}
          {vcard.customFields && vcard.customFields.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Additional Information</h2>
              <div className="space-y-4">
                {vcard.customFields.map((field, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-2 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="font-semibold text-gray-700 sm:w-1/3">{field.label}</div>
                    <div className="text-gray-900 sm:w-2/3">{field.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Contact Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {vcard.phone && (
                <a
                  href={`tel:${vcard.phone}`}
                  className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Call Now</div>
                    <div className="text-sm text-gray-600">{vcard.phone}</div>
                  </div>
                </a>
              )}

              {vcard.email && (
                <a
                  href={`mailto:${vcard.email}`}
                  className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-green-400 hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <Mail className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Send Email</div>
                    <div className="text-sm text-gray-600 truncate max-w-[200px]">{vcard.email}</div>
                  </div>
                </a>
              )}

              {vcard.website && (
                <a
                  href={vcard.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-purple-400 hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <Globe className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Visit Website</div>
                    <div className="text-sm text-gray-600 truncate max-w-[200px]">{vcard.website}</div>
                  </div>
                </a>
              )}

              {(vcard.address || vcard.city) && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    [vcard.address, vcard.city, vcard.state, vcard.zip, vcard.country].filter(Boolean).join(', ')
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-red-400 hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                    <MapPin className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Get Directions</div>
                    <div className="text-sm text-gray-600 truncate max-w-[200px]">
                      {[vcard.address, vcard.city].filter(Boolean).join(', ')}
                    </div>
                  </div>
                </a>
              )}
            </div>
          </div>
        </div>
      </main>

      <PreviewFooter />
      <QRCodeBadge variant="branded" position="bottom-right" />
    </div>
  );
}

// Generate VCF file content
function generateVCF(vcard: VCardData): string {
  const lines: string[] = ['BEGIN:VCARD', 'VERSION:3.0'];

  // Name
  const fullName = [vcard.firstName, vcard.lastName].filter(Boolean).join(' ');
  if (fullName) {
    lines.push(`FN:${fullName}`);
    lines.push(`N:${vcard.lastName || ''};${vcard.firstName || ''};;;`);
  }

  // Organization
  if (vcard.company) {
    lines.push(`ORG:${vcard.company}`);
  }

  // Title
  if (vcard.title) {
    lines.push(`TITLE:${vcard.title}`);
  }

  // Phone
  if (vcard.phone) {
    lines.push(`TEL;TYPE=CELL:${vcard.phone}`);
  }

  // Email
  if (vcard.email) {
    lines.push(`EMAIL:${vcard.email}`);
  }

  // Website
  if (vcard.website) {
    lines.push(`URL:${vcard.website}`);
  }

  // Address
  const address = [vcard.address, vcard.city, vcard.state, vcard.zip, vcard.country].filter(Boolean);
  if (address.length > 0) {
    lines.push(`ADR:;;${vcard.address || ''};${vcard.city || ''};${vcard.state || ''};${vcard.zip || ''};${vcard.country || ''}`);
  }

  // Photo (as URL)
  if (vcard.photo) {
    lines.push(`PHOTO;VALUE=URL:${vcard.photo}`);
  }

  // Bio
  if (vcard.bio) {
    lines.push(`NOTE:${vcard.bio.replace(/\n/g, '\\n')}`);
  }

  // Birthday
  if (vcard.birthday) {
    lines.push(`BDAY:${vcard.birthday}`);
  }

  // Social Media as URLs
  if (vcard.socialMedia) {
    Object.entries(vcard.socialMedia).forEach(([platform, url]) => {
      if (url) {
        lines.push(`URL;TYPE=${platform.toUpperCase()}:${url}`);
      }
    });
  }

  // Custom Fields
  if (vcard.customFields) {
    vcard.customFields.forEach(field => {
      lines.push(`X-${field.label.toUpperCase().replace(/\s+/g, '-')}:${field.value}`);
    });
  }

  lines.push('END:VCARD');
  return lines.join('\r\n');
}
