"use client";

import React, { useState, useMemo as _useMemo } from 'react';
import { BlockEditorProps } from '../types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  User, 
  Briefcase, 
  Building, 
  Globe, 
  MapPin, 
  CheckCircle, 
  X, 
  Plus, 
  Trash2,
  Mail,
  Phone,
  Link,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Github,
  Twitch,
  Music,
  Globe2
} from 'lucide-react';

/**
 * Profile Block
 * Professional profile display with avatar, bio, social links, and custom fields
 * Supports both edit and public view modes with rich customization options
 */

interface SocialMediaLink {
  platform: string;
  url: string;
  icon?: string;
  label?: string;
}

interface CustomField {
  id: string;
  label: string;
  value: string;
  icon?: string;
  visible: boolean;
}

interface ProfileBlockContent {
  name: string;
  bio?: string;
  avatar?: string;
  title?: string;
  company?: string;
  website?: string;
  location?: string;
  verified?: boolean;
  email?: string;
  phone?: string;
  socialLinks?: SocialMediaLink[];
  customFields?: CustomField[];
}

// Social media platforms with icons and colors
const SUPPORTED_PLATFORMS = [
  { key: 'twitter', name: 'Twitter', icon: Twitter, color: '#1DA1F2' },
  { key: 'facebook', name: 'Facebook', icon: Facebook, color: '#1877F2' },
  { key: 'instagram', name: 'Instagram', icon: Instagram, color: '#E4405F' },
  { key: 'youtube', name: 'YouTube', icon: Youtube, color: '#FF0000' },
  { key: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: '#0077B5' },
  { key: 'github', name: 'GitHub', icon: Github, color: '#333' },
  { key: 'twitch', name: 'Twitch', icon: Twitch, color: '#9146FF' },
  { key: 'tiktok', name: 'TikTok', icon: Music, color: '#000000' },
  { key: 'website', name: 'Website', icon: Globe2, color: '#6B7280' },
  { key: 'email', name: 'Email', icon: Mail, color: '#EA4335' },
  { key: 'phone', name: 'Phone', icon: Phone, color: '#34A853' }
];

// Get platform icon component
const getPlatformIcon = (platform: string) => {
  const platformConfig = SUPPORTED_PLATFORMS.find(p => p.key === platform.toLowerCase());
  return platformConfig?.icon || Globe2;
};

// Safe icon renderer component
const PlatformIcon = ({ platform, size = 16, className = "", style }: { platform: string; size?: number; className?: string; style?: React.CSSProperties }) => {
  const IconComponent: React.ElementType = getPlatformIcon(platform);
  return React.createElement(IconComponent, { size, className });
};

export default function ProfileBlock({ block, onUpdate, onDelete, isEditing = false }: BlockEditorProps) {
  const { content, design } = block;
  const profileContent = content as ProfileBlockContent;
  const [avatarError, setAvatarError] = useState(false);
  const [newSocialPlatform, setNewSocialPlatform] = useState('');
  const [newSocialUrl, setNewSocialUrl] = useState('');
  const [newCustomFieldLabel, setNewCustomFieldLabel] = useState('');
  const [newCustomFieldValue, setNewCustomFieldValue] = useState('');

  // Handle content changes
  const handleContentChange = (field: keyof ProfileBlockContent, value: any) => {
    onUpdate({
      content: {
        ...profileContent,
        [field]: value
      }
    });
  };

  // Handle avatar upload
  const handleAvatarChange = (url: string) => {
    setAvatarError(false);
    handleContentChange('avatar', url);
  };

  // Social links management
  const addSocialLink = () => {
    if (!newSocialPlatform || !newSocialUrl) return;
    
    const newLink: SocialMediaLink = {
      platform: newSocialPlatform,
      url: newSocialUrl,
      icon: newSocialPlatform
    };
    
    handleContentChange('socialLinks', [
      ...(profileContent.socialLinks || []),
      newLink
    ]);
    
    setNewSocialPlatform('');
    setNewSocialUrl('');
  };

  const removeSocialLink = (index: number) => {
    const updated = [...(profileContent.socialLinks || [])];
    updated.splice(index, 1);
    handleContentChange('socialLinks', updated);
  };

  const updateSocialLink = (index: number, field: keyof SocialMediaLink, value: string) => {
    const updated = [...(profileContent.socialLinks || [])];
    updated[index] = { ...updated[index], [field]: value };
    handleContentChange('socialLinks', updated);
  };

  // Custom fields management
  const addCustomField = () => {
    if (!newCustomFieldLabel || !newCustomFieldValue) return;
    
    const newField: CustomField = {
      id: `field-${Date.now()}`,
      label: newCustomFieldLabel,
      value: newCustomFieldValue,
      visible: true
    };
    
    handleContentChange('customFields', [
      ...(profileContent.customFields || []),
      newField
    ]);
    
    setNewCustomFieldLabel('');
    setNewCustomFieldValue('');
  };

  const removeCustomField = (id: string) => {
    const updated = (profileContent.customFields || []).filter(field => field.id !== id);
    handleContentChange('customFields', updated);
  };

  const updateCustomField = (id: string, field: keyof CustomField, value: any) => {
    const updated = (profileContent.customFields || []).map(f => 
      f.id === id ? { ...f, [field]: value } : f
    );
    handleContentChange('customFields', updated);
  };

  // Generate initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Public view (display mode)
  if (!isEditing) {
    if (!profileContent.name && !profileContent.avatar && !profileContent.bio) {
      return null; // Don't render empty profile in public view
    }

    return (
      <div 
        className="block-profile"
        style={{ 
          backgroundColor: design.backgroundColor,
          color: design.textColor,
          padding: design.padding,
          margin: design.margin,
          borderRadius: design.borderRadius
        }}
      >
        <div className="max-w-2xl mx-auto">
          {/* Avatar and Basic Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6">
            {/* Avatar */}
            {profileContent.avatar ? (
              <div className="relative">
                <img
                  src={profileContent.avatar}
                  alt={profileContent.name || 'Profile'}
                  className="w-24 h-24 rounded-full object-cover border-4 border-background shadow-lg"
                  onError={() => setAvatarError(true)}
                  style={{ maxWidth: 'none' }}
                />
                {profileContent.verified && (
                  <CheckCircle 
                    className="absolute -bottom-1 -right-1 text-blue-500 bg-white rounded-full p-0.5" 
                    size={20} 
                  />
                )}
              </div>
            ) : (
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-2xl font-bold border-4 border-background shadow-lg">
                  {getInitials(profileContent.name || 'User')}
                </div>
                {profileContent.verified && (
                  <CheckCircle 
                    className="absolute -bottom-1 -right-1 text-blue-500 bg-white rounded-full p-0.5" 
                    size={20} 
                  />
                )}
              </div>
            )}

            {/* Basic Info */}
            <div className="text-center sm:text-left flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h2 className="text-2xl font-bold">
                  {profileContent.name || 'Your Name'}
                </h2>
                {profileContent.verified && (
                  <CheckCircle className="text-blue-500" size={20} />
                )}
              </div>
              
              <div className="flex flex-col gap-1 mt-2">
                {profileContent.title && (
                  <p className="text-base font-medium text-foreground/90">
                    {profileContent.title}
                  </p>
                )}
                
                {profileContent.company && (
                  <p className="text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-1">
                    <Building size={14} className="opacity-70" />
                    {profileContent.company}
                  </p>
                )}
                
                {profileContent.location && (
                  <p className="text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-1">
                    <MapPin size={14} className="opacity-70" />
                    {profileContent.location}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Bio */}
          {profileContent.bio && (
            <div className="mb-6">
              <div className="prose prose-sm max-w-none text-center sm:text-left">
                <p className="whitespace-pre-wrap leading-relaxed text-foreground/90">
                  {profileContent.bio}
                </p>
              </div>
            </div>
          )}

          {/* Custom Fields */}
          {profileContent.customFields && profileContent.customFields.length > 0 && (
            <div className="space-y-2 mb-6">
              {profileContent.customFields
                .filter(field => field.visible && field.value)
                .map(field => (
                  <div key={field.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                    {field.icon && (
                      <span className="opacity-70">
                        <PlatformIcon platform={field.icon} size={14} />
                      </span>
                    )}
                    <span className="font-medium min-w-fit">{field.label}:</span>
                    <span className="text-foreground/80">{field.value}</span>
                  </div>
                ))}
            </div>
          )}

          {/* Contact Info */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mb-6">
            {profileContent.email && (
              <a 
                href={`mailto:${profileContent.email}`}
                className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
              >
                <Mail size={14} />
                {profileContent.email}
              </a>
            )}
            
            {profileContent.phone && (
              <a 
                href={`tel:${profileContent.phone}`}
                className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
              >
                <Phone size={14} />
                {profileContent.phone}
              </a>
            )}
            
            {profileContent.website && (
              <a 
                href={profileContent.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
              >
                <Globe2 size={14} />
                Website
              </a>
            )}
          </div>

          {/* Social Links */}
          {profileContent.socialLinks && profileContent.socialLinks.length > 0 && (
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              {profileContent.socialLinks.map((link, index) => {
                const IconComponent = getPlatformIcon(link.platform);
                const platform = SUPPORTED_PLATFORMS.find(p => p.key === link.platform.toLowerCase());
                
                return (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                    title={platform?.name || link.platform}
                  >
                    <PlatformIcon 
                      platform={link.platform} 
                      size={16} 
                      className="transition-transform group-hover:scale-110" 
                      style={{ color: platform?.color }} 
                    />
                    <span className="text-sm font-medium text-foreground">
                      {platform?.name || link.platform}
                    </span>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Edit view
  return (
    <div className="block-editor-profile space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User size={20} />
          <h3 className="text-lg font-semibold">Profile Block</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <X size={16} />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Avatar URL */}
        <div className="md:col-span-2">
          <Label htmlFor="profile-avatar">Profile Image URL</Label>
          <Input
            id="profile-avatar"
            type="url"
            value={profileContent.avatar || ''}
            onChange={(e) => handleAvatarChange(e.target.value)}
            placeholder="https://example.com/avatar.jpg"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Enter a direct URL to your profile image. Square images work best (e.g., 400x400px).
          </p>
        </div>

        {/* Name */}
        <div>
          <Label htmlFor="profile-name">Name *</Label>
          <Input
            id="profile-name"
            value={profileContent.name || ''}
            onChange={(e) => handleContentChange('name', e.target.value)}
            placeholder="John Doe"
            required
          />
        </div>

        {/* Title/Position */}
        <div>
          <Label htmlFor="profile-title">Title/Position</Label>
          <Input
            id="profile-title"
            value={profileContent.title || ''}
            onChange={(e) => handleContentChange('title', e.target.value)}
            placeholder="Senior Developer"
          />
        </div>

        {/* Company */}
        <div>
          <Label htmlFor="profile-company">Company/Organization</Label>
          <Input
            id="profile-company"
            value={profileContent.company || ''}
            onChange={(e) => handleContentChange('company', e.target.value)}
            placeholder="Acme Corp"
          />
        </div>

        {/* Location */}
        <div>
          <Label htmlFor="profile-location">Location</Label>
          <Input
            id="profile-location"
            value={profileContent.location || ''}
            onChange={(e) => handleContentChange('location', e.target.value)}
            placeholder="San Francisco, CA"
          />
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="profile-email">Email</Label>
          <Input
            id="profile-email"
            type="email"
            value={profileContent.email || ''}
            onChange={(e) => handleContentChange('email', e.target.value)}
            placeholder="john@example.com"
          />
        </div>

        {/* Phone */}
        <div>
          <Label htmlFor="profile-phone">Phone</Label>
          <Input
            id="profile-phone"
            value={profileContent.phone || ''}
            onChange={(e) => handleContentChange('phone', e.target.value)}
            placeholder="+1 (555) 123-4567"
          />
        </div>

        {/* Website */}
        <div>
          <Label htmlFor="profile-website">Website</Label>
          <Input
            id="profile-website"
            type="url"
            value={profileContent.website || ''}
            onChange={(e) => handleContentChange('website', e.target.value)}
            placeholder="https://johndoe.com"
          />
        </div>
      </div>

      {/* Bio */}
      <div>
        <Label htmlFor="profile-bio">Bio/Description</Label>
        <Textarea
          id="profile-bio"
          value={profileContent.bio || ''}
          onChange={(e) => handleContentChange('bio', e.target.value)}
          placeholder="Tell us about yourself..."
          rows={4}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Supports plain text. Add newlines for paragraph breaks.
        </p>
      </div>

      {/* Verified Badge */}
      <div className="flex items-center justify-between p-3 border rounded-lg">
        <Label className="flex items-center gap-2 m-0">
          <CheckCircle className="h-4 w-4" />
          <span>Verified Badge</span>
        </Label>
        <Switch
          checked={profileContent.verified || false}
          onCheckedChange={(checked) => handleContentChange('verified', checked)}
        />
      </div>

      {/* Social Links Section */}
      <div className="space-y-4 border-t pt-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold flex items-center gap-2">
            <Globe size={16} />
            Social Links
          </Label>
          <Badge variant="secondary">
            {(profileContent.socialLinks || []).length} links
          </Badge>
        </div>

        {/* Add New Social Link */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-3 border rounded-lg bg-muted/20">
          <select
            value={newSocialPlatform}
            onChange={(e) => setNewSocialPlatform(e.target.value)}
            className="px-3 py-2 text-sm border rounded-md bg-background"
          >
            <option value="">Select platform...</option>
            {SUPPORTED_PLATFORMS.map(platform => (
              <option key={platform.key} value={platform.key}>
                {platform.name}
              </option>
            ))}
          </select>
          <Input
            type="url"
            value={newSocialUrl}
            onChange={(e) => setNewSocialUrl(e.target.value)}
            placeholder="https://..."
            className="h-9"
          />
          <Button 
            onClick={addSocialLink} 
            disabled={!newSocialPlatform || !newSocialUrl}
            size="sm"
            className="w-full md:w-auto"
          >
            <Plus size={14} />
          </Button>
        </div>

        {/* Existing Social Links */}
        <div className="space-y-2">
          {(profileContent.socialLinks || []).length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No social links added yet.
            </p>
          ) : (
            profileContent.socialLinks?.map((link, index) => {
              const IconComponent = getPlatformIcon(link.platform);
              const platform = SUPPORTED_PLATFORMS.find(p => p.key === link.platform.toLowerCase());
              
              return (
                <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                  <span className="text-muted-foreground">
                    <IconComponent size={16} />
                  </span>
                  <select
                    value={link.platform}
                    onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                    className="px-2 py-1 text-sm border rounded bg-background min-w-fit"
                  >
                    {SUPPORTED_PLATFORMS.map(platform => (
                      <option key={platform.key} value={platform.key}>
                        {platform.name}
                      </option>
                    ))}
                  </select>
                  <Input
                    type="url"
                    value={link.url}
                    onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                    placeholder="https://..."
                    className="h-8 flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSocialLink(index)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive/80"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Custom Fields Section */}
      <div className="space-y-4 border-t pt-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold flex items-center gap-2">
            <Briefcase size={16} />
            Custom Fields
          </Label>
          <Badge variant="secondary">
            {(profileContent.customFields || []).length} fields
          </Badge>
        </div>

        {/* Add New Custom Field */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-3 border rounded-lg bg-muted/20">
          <Input
            value={newCustomFieldLabel}
            onChange={(e) => setNewCustomFieldLabel(e.target.value)}
            placeholder="Field label"
            className="h-9"
          />
          <Input
            value={newCustomFieldValue}
            onChange={(e) => setNewCustomFieldValue(e.target.value)}
            placeholder="Field value"
            className="h-9"
          />
          <Button 
            onClick={addCustomField} 
            disabled={!newCustomFieldLabel || !newCustomFieldValue}
            size="sm"
            className="w-full md:w-auto"
          >
            <Plus size={14} />
          </Button>
        </div>

        {/* Existing Custom Fields */}
        <div className="space-y-2">
          {(profileContent.customFields || []).length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No custom fields added yet.
            </p>
          ) : (
            profileContent.customFields?.map(field => (
              <div key={field.id} className="flex items-center gap-2 p-3 border rounded-lg">
                <Input
                  value={field.label}
                  onChange={(e) => updateCustomField(field.id, 'label', e.target.value)}
                  placeholder="Label"
                  className="h-8"
                />
                <Input
                  value={field.value}
                  onChange={(e) => updateCustomField(field.id, 'value', e.target.value)}
                  placeholder="Value"
                  className="h-8 flex-1"
                />
                <div className="flex items-center gap-2">
                  <Label className="text-xs whitespace-nowrap">Visible:</Label>
                  <Switch
                    checked={field.visible}
                    onCheckedChange={(checked) => updateCustomField(field.id, 'visible', checked)}
                    className="scale-75"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCustomField(field.id)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive/80"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Preview Info */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <User size={14} />
            <span>
              {(profileContent.name || profileContent.email || profileContent.phone) ? 'Profile info added' : 'Enter basic info'} • 
              {(profileContent.socialLinks || []).length} social link{(profileContent.socialLinks || []).length !== 1 ? 's' : ''}
            </span>
          </div>
          {profileContent.verified && (
            <Badge variant="success" className="flex items-center gap-1">
              <CheckCircle size={12} />
              Verified
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}