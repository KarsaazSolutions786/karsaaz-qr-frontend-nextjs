'use client';

import { Phone, Mail, Globe, MapPin, Download } from 'lucide-react';

interface BusinessCardProps {
  profile: {
    businessName: string;
    tagline?: string;
    logo?: string;
    phone?: string;
    email?: string;
    website?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    theme?: {
      primaryColor?: string;
      accentColor?: string;
    };
  };
}

export default function BusinessCard({ profile }: BusinessCardProps) {
  const primaryColor = profile.theme?.primaryColor || '#2563eb';
  const accentColor = profile.theme?.accentColor || '#3b82f6';

  const fullAddress = [
    profile.address,
    profile.city,
    profile.state,
    profile.zip,
    profile.country,
  ].filter(Boolean).join(', ');

  const handleDownloadVCard = () => {
    const vCard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${profile.businessName}`,
      `ORG:${profile.businessName}`,
      profile.phone ? `TEL;TYPE=WORK,VOICE:${profile.phone}` : '',
      profile.email ? `EMAIL:${profile.email}` : '',
      profile.website ? `URL:${profile.website}` : '',
      fullAddress ? `ADR;TYPE=WORK:;;${fullAddress}` : '',
      profile.tagline ? `NOTE:${profile.tagline}` : '',
      'END:VCARD',
    ].filter(Boolean).join('\n');

    const blob = new Blob([vCard], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${profile.businessName.replace(/\s+/g, '_')}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden max-w-2xl mx-auto">
      <div className="relative">
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl" style={{ backgroundColor: accentColor }} />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl" style={{ backgroundColor: primaryColor }} />
        </div>

        <div className="relative p-8">
          <div className="flex items-start justify-between mb-6">
            {/* Logo and Name */}
            <div className="flex items-center gap-4">
              {profile.logo ? (
                <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-white/20 shadow-lg flex-shrink-0">
                  <img
                    src={profile.logo}
                    alt={profile.businessName}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg" style={{ backgroundColor: primaryColor }}>
                  <span className="text-3xl font-bold text-white">
                    {profile.businessName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  {profile.businessName}
                </h2>
                {profile.tagline && (
                  <p className="text-gray-300 text-sm">{profile.tagline}</p>
                )}
              </div>
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownloadVCard}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-all hover:scale-105 shadow-lg"
              style={{ backgroundColor: primaryColor }}
              title="Download Contact Card"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Save Contact</span>
            </button>
          </div>

          {/* Contact Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.phone && (
              <a
                href={`tel:${profile.phone}`}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: primaryColor }}>
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs text-gray-400 mb-0.5">Phone</div>
                  <div className="font-medium text-white truncate">{profile.phone}</div>
                </div>
              </a>
            )}

            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: accentColor }}>
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs text-gray-400 mb-0.5">Email</div>
                  <div className="font-medium text-white truncate">{profile.email}</div>
                </div>
              </a>
            )}

            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: primaryColor }}>
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs text-gray-400 mb-0.5">Website</div>
                  <div className="font-medium text-white truncate">{profile.website}</div>
                </div>
              </a>
            )}

            {fullAddress && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors md:col-span-2"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: accentColor }}>
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs text-gray-400 mb-0.5">Address</div>
                  <div className="font-medium text-white truncate">{fullAddress}</div>
                </div>
              </a>
            )}
          </div>

          {/* Decorative Bottom Border */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
              <div className="w-2 h-2 rounded-full bg-white/30" />
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
