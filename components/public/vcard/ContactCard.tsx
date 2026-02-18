'use client';

import { Phone, Mail, Globe, MapPin, Building2, Briefcase, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ContactCardProps {
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
  theme?: {
    primaryColor?: string;
    accentColor?: string;
  };
}

export default function ContactCard({
  firstName,
  lastName,
  title,
  company,
  phone,
  email,
  website,
  address,
  city,
  state,
  zip,
  country,
  photo,
  theme,
}: ContactCardProps) {
  const primaryColor = theme?.primaryColor || '#2563eb';
  const fullName = [firstName, lastName].filter(Boolean).join(' ');
  const fullAddress = [address, city, state, zip, country].filter(Boolean).join(', ');

  return (
    <Card className="bg-white shadow-xl border-0 overflow-hidden">
      <div 
        className="h-32 bg-gradient-to-br"
        style={{ 
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${theme?.accentColor || primaryColor}dd 100%)` 
        }}
      />
      
      <CardContent className="relative px-6 pb-6">
        {/* Profile Photo */}
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
          <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
            {photo ? (
              <img
                src={photo}
                alt={fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <User className="w-16 h-16 text-blue-600" />
              </div>
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="pt-20 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">{fullName}</h2>
          
          {title && (
            <div className="flex items-center justify-center gap-2 text-gray-600 mb-1">
              <Briefcase className="w-4 h-4" />
              <p className="text-sm font-medium">{title}</p>
            </div>
          )}
          
          {company && (
            <div className="flex items-center justify-center gap-2 text-gray-600 mb-4">
              <Building2 className="w-4 h-4" />
              <p className="text-sm">{company}</p>
            </div>
          )}

          <div className="mt-6 space-y-3">
            {phone && (
              <a 
                href={`tel:${phone}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                  <Phone className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left flex-1">
                  <div className="text-xs text-gray-500">Phone</div>
                  <div className="font-medium text-gray-900">{phone}</div>
                </div>
              </a>
            )}

            {email && (
              <a 
                href={`mailto:${email}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-green-50 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors">
                  <Mail className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-left flex-1">
                  <div className="text-xs text-gray-500">Email</div>
                  <div className="font-medium text-gray-900 break-all">{email}</div>
                </div>
              </a>
            )}

            {website && (
              <a 
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-purple-50 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-200 transition-colors">
                  <Globe className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-left flex-1">
                  <div className="text-xs text-gray-500">Website</div>
                  <div className="font-medium text-gray-900 break-all">{website}</div>
                </div>
              </a>
            )}

            {fullAddress && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-red-50 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0 group-hover:bg-red-200 transition-colors">
                  <MapPin className="w-5 h-5 text-red-600" />
                </div>
                <div className="text-left flex-1">
                  <div className="text-xs text-gray-500">Address</div>
                  <div className="font-medium text-gray-900">{fullAddress}</div>
                </div>
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
