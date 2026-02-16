import ProfileBlock from './ProfileBlock';
import { Block } from '../types';
import React from 'react';

// Example 1: Complete Profile
const completeProfileBlock: Block = {
  id: 'profile-complete',
  type: 'profile',
  title: 'Complete Profile',
  content: {
    name: 'Sarah Johnson',
    bio: 'Passionate full-stack developer with 8+ years of experience building scalable web applications. Specializing in React, Node.js, and cloud architecture.',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=400&h=400&fit=crop',
    title: 'Senior Full-Stack Developer',
    company: 'Tech Innovations Inc.',
    website: 'https://sarahjohnson.dev',
    location: 'Austin, Texas',
    verified: true,
    email: 'sarah.johnson@example.com',
    phone: '+1 (555) 987-6543',
    socialLinks: [
      { platform: 'linkedin', url: 'https://linkedin.com/in/sarahjohnson', icon: 'linkedin' },
      { platform: 'github', url: 'https://github.com/sarahj', icon: 'github' },
      { platform: 'twitter', url: 'https://twitter.com/sarahj_dev', icon: 'twitter' },
      { platform: 'website', url: 'https://sarahjohnson.dev', icon: 'website' }
    ],
    customFields: [
      { id: 'exp-1', label: 'Years of Experience', value: '8+ years', icon: 'briefcase', visible: true },
      { id: 'skills-1', label: 'Primary Skills', value: 'React, Node.js, TypeScript, AWS', icon: 'code', visible: true },
      { id: 'lang-1', label: 'Languages', value: 'English, Spanish', icon: 'globe', visible: true }
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

// Example 2: Minimal Profile
const minimalProfileBlock: Block = {
  id: 'profile-minimal',
  type: 'profile',
  title: 'Minimal Profile',
  content: {
    name: 'Alex Chen',
    bio: 'Product designer focused on creating intuitive user experiences.',
    title: 'Product Designer',
    socialLinks: [
      { platform: 'twitter', url: 'https://twitter.com/alexchen', icon: 'twitter' },
      { platform: 'linkedin', url: 'https://linkedin.com/in/alexchen', icon: 'linkedin' }
    ]
  },
  settings: {
    visible: true,
    order: 1,
    customClasses: [],
    padding: '2rem',
    margin: '0.5rem 0'
  },
  design: {
    backgroundColor: '#f8fafc',
    textColor: '#1e293b',
    borderRadius: '8px',
    padding: '2rem',
    margin: '0.5rem 0'
  }
};

// Example 3: Business Profile
const businessProfileBlock: Block = {
  id: 'profile-business',
  type: 'profile',
  title: 'Business Profile',
  content: {
    name: 'Robert Martinez',
    bio: 'CEO and Founder of Digital Solutions Agency. Helping businesses transform their digital presence with innovative strategies and cutting-edge technology.',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop',
    title: 'CEO & Founder',
    company: 'Digital Solutions Agency',
    website: 'https://digitalsolutions.com',
    location: 'Miami, Florida',
    verified: true,
    email: 'robert@digitalsolutions.com',
    phone: '+1 (555) 123-7890',
    socialLinks: [
      { platform: 'linkedin', url: 'https://linkedin.com/in/robertmartinez', icon: 'linkedin' },
      { platform: 'website', url: 'https://digitalsolutions.com', icon: 'website' }
    ],
    customFields: [
      { id: 'founded', label: 'Founded', value: '2015', icon: 'calendar', visible: true },
      { id: 'team', label: 'Team Size', value: '50+ professionals', icon: 'users', visible: true },
      { id: 'clients', label: 'Clients Served', value: '500+ worldwide', icon: 'trophy', visible: true }
    ]
  },
  settings: {
    visible: true,
    order: 2,
    customClasses: ['business-profile'],
    padding: '2rem',
    margin: '0.5rem 0'
  },
  design: {
    backgroundColor: '#ffffff',
    textColor: '#1e3a8a',
    borderRadius: '16px',
    padding: '2rem',
    margin: '0.5rem 0',
    shadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
  }
};

// Usage Examples:

// Public/Display Mode (what visitors see)
export function PublicProfileExample() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold mb-4">Complete Profile Example</h2>
      <ProfileBlock 
        block={completeProfileBlock} 
        onUpdate={() => {}} 
        onDelete={() => {}}
        isEditing={false}
      />
      
      <h2 className="text-2xl font-bold mb-4">Minimal Profile Example</h2>
      <ProfileBlock 
        block={minimalProfileBlock} 
        onUpdate={() => {}} 
        onDelete={() => {}}
        isEditing={false}
      />
      
      <h2 className="text-2xl font-bold mb-4">Business Profile Example</h2>
      <ProfileBlock 
        block={businessProfileBlock} 
        onUpdate={() => {}} 
        onDelete={() => {}}
        isEditing={false}
      />
    </div>
  );
}

// Edit Mode (what the admin sees when editing)
export function EditProfileExample() {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Edit Profile Block</h2>
      <ProfileBlock 
        block={completeProfileBlock} 
        onUpdate={(updates) => {
          console.log('Profile updated:', updates);
        }} 
        onDelete={() => {
          console.log('Profile block deleted');
        }}
        isEditing={true}
      />
    </div>
  );
}

export default {
  complete: completeProfileBlock,
  minimal: minimalProfileBlock,
  business: businessProfileBlock
};