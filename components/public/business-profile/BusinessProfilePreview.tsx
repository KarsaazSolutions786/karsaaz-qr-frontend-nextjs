'use client';

import React from 'react';
import { MapPin, Phone, Mail, Globe, Clock, Users, Briefcase, Image as ImageIcon, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import PreviewHeader from '@/components/public/shared/PreviewHeader';
import PreviewFooter from '@/components/public/shared/PreviewFooter';
import SocialShare from '@/components/public/shared/SocialShare';
import QRCodeBadge from '@/components/public/shared/QRCodeBadge';
import BusinessCard from './BusinessCard';

interface TeamMember {
  name: string;
  role: string;
  photo?: string;
  bio?: string;
}

interface OpeningHours {
  day: string;
  hours: string;
  isClosed?: boolean;
}

interface Service {
  name: string;
  description?: string;
  price?: string;
}

interface BusinessProfileData {
  businessName: string;
  tagline?: string;
  logo?: string;
  description?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  openingHours?: OpeningHours[];
  services?: Service[];
  teamMembers?: TeamMember[];
  gallery?: string[];
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  theme?: {
    primaryColor?: string;
    accentColor?: string;
  };
}

interface BusinessProfilePreviewProps {
  profile: BusinessProfileData;
}

export default function BusinessProfilePreview({ profile }: BusinessProfilePreviewProps) {
  const primaryColor = profile.theme?.primaryColor || '#2563eb';
  
  const fullAddress = [
    profile.address,
    profile.city,
    profile.state,
    profile.zip,
    profile.country,
  ].filter(Boolean).join(', ');

  const mapUrl = profile.latitude && profile.longitude
    ? `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}&q=${profile.latitude},${profile.longitude}`
    : fullAddress
      ? `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}&q=${encodeURIComponent(fullAddress)}`
      : null;

  const socialIcons = {
    facebook: Facebook,
    twitter: Twitter,
    instagram: Instagram,
    linkedin: Linkedin,
    youtube: Youtube,
  };

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with Share */}
      <PreviewHeader
        logo={profile.logo}
        title={profile.businessName}
        subtitle={profile.tagline}
        actions={
          <SocialShare
            url={currentUrl}
            title={profile.businessName}
            description={profile.tagline || profile.description}
            size="md"
          />
        }
      />

      <main className="flex-1 pb-16">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Hero Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
              {profile.logo && (
                <div className="w-32 h-32 flex-shrink-0">
                  <img
                    src={profile.logo}
                    alt={profile.businessName}
                    className="w-full h-full object-cover rounded-2xl shadow-md border border-gray-200"
                  />
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {profile.businessName}
                </h1>
                {profile.tagline && (
                  <p className="text-xl text-gray-600 mb-4">{profile.tagline}</p>
                )}
                {profile.description && (
                  <p className="text-gray-700 leading-relaxed">{profile.description}</p>
                )}
              </div>
            </div>
          </div>

          {/* Business Card Preview */}
          <div className="mb-8">
            <BusinessCard profile={profile} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Opening Hours */}
              {profile.openingHours && profile.openingHours.length > 0 && (
                <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: primaryColor }}>
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Opening Hours</h2>
                  </div>
                  <div className="space-y-3">
                    {profile.openingHours.map((schedule, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                        <span className="font-medium text-gray-900">{schedule.day}</span>
                        <span className={schedule.isClosed ? 'text-red-600 font-medium' : 'text-gray-600'}>
                          {schedule.isClosed ? 'Closed' : schedule.hours}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Services */}
              {profile.services && profile.services.length > 0 && (
                <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: primaryColor }}>
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Services</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.services.map((service, index) => (
                      <div key={index} className="p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-900">{service.name}</h3>
                          {service.price && (
                            <span className="text-sm font-bold" style={{ color: primaryColor }}>
                              {service.price}
                            </span>
                          )}
                        </div>
                        {service.description && (
                          <p className="text-sm text-gray-600">{service.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Team Members */}
              {profile.teamMembers && profile.teamMembers.length > 0 && (
                <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: primaryColor }}>
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Meet Our Team</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {profile.teamMembers.map((member, index) => (
                      <div key={index} className="text-center">
                        <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-gray-100">
                          {member.photo ? (
                            <img
                              src={member.photo}
                              alt={member.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <Users className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">{member.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{member.role}</p>
                        {member.bio && (
                          <p className="text-xs text-gray-500">{member.bio}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Gallery */}
              {profile.gallery && profile.gallery.length > 0 && (
                <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: primaryColor }}>
                      <ImageIcon className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Gallery</h2>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {profile.gallery.map((image, index) => (
                      <div key={index} className="aspect-square rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                        <img
                          src={image}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Information */}
              <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h2>
                <div className="space-y-4">
                  {profile.phone && (
                    <a href={`tel:${profile.phone}`} className="flex items-start gap-3 text-gray-700 hover:text-blue-600 transition-colors group">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                        <Phone className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Phone</div>
                        <div className="font-medium">{profile.phone}</div>
                      </div>
                    </a>
                  )}

                  {profile.email && (
                    <a href={`mailto:${profile.email}`} className="flex items-start gap-3 text-gray-700 hover:text-blue-600 transition-colors group">
                      <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0 group-hover:bg-green-100 transition-colors">
                        <Mail className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Email</div>
                        <div className="font-medium break-all">{profile.email}</div>
                      </div>
                    </a>
                  )}

                  {profile.website && (
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 text-gray-700 hover:text-blue-600 transition-colors group">
                      <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-100 transition-colors">
                        <Globe className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Website</div>
                        <div className="font-medium break-all">{profile.website}</div>
                      </div>
                    </a>
                  )}

                  {fullAddress && (
                    <a 
                      href={profile.latitude && profile.longitude 
                        ? `https://www.google.com/maps/search/?api=1&query=${profile.latitude},${profile.longitude}`
                        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 text-gray-700 hover:text-blue-600 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0 group-hover:bg-red-100 transition-colors">
                        <MapPin className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Address</div>
                        <div className="font-medium">{fullAddress}</div>
                      </div>
                    </a>
                  )}
                </div>

                {/* Social Media */}
                {profile.socialMedia && Object.values(profile.socialMedia).some(v => v) && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Follow Us</h3>
                    <div className="flex gap-2 flex-wrap">
                      {Object.entries(profile.socialMedia).map(([platform, url]) => {
                        if (!url) return null;
                        const Icon = socialIcons[platform as keyof typeof socialIcons];
                        return (
                          <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors"
                            title={platform}
                          >
                            <Icon className="w-5 h-5" />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </section>

              {/* Map */}
              {mapUrl && (
                <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Location</h2>
                  <div className="aspect-video rounded-xl overflow-hidden border border-gray-200">
                    <iframe
                      src={mapUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </section>
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
