"use client";

import { useState } from 'react';
import ContactBlock from './ContactBlock';
import { Block } from '../types';

/**
 * Contact Block Demo Component
 * Demonstrates all features of the Contact Block component
 */

export default function ContactBlockDemo() {
  const [block] = useState<Block>({
    id: 'contact-demo-123',
    type: 'contact',
    title: 'Contact',
    content: {
      methods: [
        {
          id: 'method-1',
          type: 'email',
          label: 'Support Email',
          value: 'support@example.com',
          link: 'mailto:support@example.com'
        },
        {
          id: 'method-2',
          type: 'phone',
          label: 'Phone',
          value: '+1 (555) 123-4567',
          link: 'tel:+15551234567'
        },
        {
          id: 'method-3',
          type: 'address',
          label: 'Office Address',
          value: '123 Business Ave, Suite 100, New York, NY 10001',
          link: 'https://maps.google.com/?q=123+Business+Ave,+New+York,+NY'
        },
        {
          id: 'method-4',
          type: 'website',
          label: 'Website',
          value: 'www.example.com',
          link: 'https://www.example.com'
        }
      ],
      showForm: true,
      formTitle: 'Get In Touch',
      formSubtitle: 'We usually respond within 24 hours. For urgent matters, please call us directly.',
      showBusinessHours: true,
      businessHours: [
        { day: 'Monday', open: '09:00', close: '18:00', closed: false },
        { day: 'Tuesday', open: '09:00', close: '18:00', closed: false },
        { day: 'Wednesday', open: '09:00', close: '18:00', closed: false },
        { day: 'Thursday', open: '09:00', close: '18:00', closed: false },
        { day: 'Friday', open: '09:00', close: '18:00', closed: false },
        { day: 'Saturday', open: '10:00', close: '16:00', closed: false },
        { day: 'Sunday', open: '10:00', close: '16:00', closed: false }
      ],
      timezone: 'America/New_York',
      showMap: true,
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.2423267209725!2d-73.98785158459468!3d40.7484409793277!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1629460000000!5m2!1sen!2sus',
      mapHeight: '400px',
      showResponseTime: true,
      responseTime: '24 hours on weekdays, 48 hours on weekends',
      requirePhone: false,
      requireSubject: true,
      emailTo: 'support@example.com',
      ccEmail: 'manager@example.com',
      enableHoneypot: true,
      honeypotField: 'website_url',
      successMessage: 'Thank you for your message! Our team will get back to you soon.',
      errorMessage: 'Oops! Something went wrong. Please try again or contact us directly.',
      buttonText: 'Send Message',
      privacyText: 'Your information is secure and will only be used to respond to your inquiry.'
    },
    settings: {
      visible: true,
      order: 0,
      customClasses: [],
      padding: '2rem',
      margin: '1rem 0'
    },
    design: {
      backgroundColor: '#fafafa',
      textColor: '#333333',
      borderRadius: '12px',
      padding: '2rem',
      margin: '1rem 0'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const handleUpdate = (updates: Block) => {
    console.log('Block updated:', updates);
  };

  const handleDelete = () => {
    console.log('Block deleted');
  };

  return (
    <div className="p-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Contact Block Demo</h1>
          <p className="text-muted-foreground mb-6">
            This demo showcases all features of the Contact Block component including contact form,
            business hours, Google Maps integration, and spam protection.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="p-4 bg-card rounded-lg border">
              <h3 className="font-semibold mb-2">Public View</h3>
              <p className="text-sm text-muted-foreground">What visitors see</p>
            </div>
            <div className="p-4 bg-card rounded-lg border">
              <h3 className="font-semibold mb-2">Form Validation</h3>
              <p className="text-sm text-muted-foreground">Client & Server side</p>
            </div>
            <div className="p-4 bg-card rounded-lg border">
              <h3 className="font-semibold mb-2">Spam Protection</h3>
              <p className="text-sm text-muted-foreground">Honeypot field included</p>
            </div>
            <div className="p-4 bg-card rounded-lg border">
              <h3 className="font-semibold mb-2">Google Maps</h3>
              <p className="text-sm text-muted-foreground">Embeddable map iframe</p>
            </div>
          </div>
        </div>

        {/* Public View */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Public View (What Visitors See)</h2>
          <ContactBlock 
            block={block} 
            onUpdate={handleUpdate} 
            onDelete={handleDelete} 
            isEditing={false}
          />
        </div>

        {/* Edit View */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Edit View (Admin Interface)</h2>
          <div className="border rounded-lg p-6 bg-card">
            <ContactBlock 
              block={block} 
              onUpdate={handleUpdate} 
              onDelete={handleDelete} 
              isEditing={true}
            />
          </div>
        </div>

        {/* Feature List */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Features Implemented</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 rounded-lg border-l-4 border-green-500 bg-green-50">
                <h3 className="font-semibold mb-2">✓ Contact Form</h3>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Name, Email, Message fields</li>
                  <li>• Optional Phone and Subject</li>
                  <li>• Form validation (client + server)</li>
                  <li>• Success/error states</li>
                  <li>• Loading indicators</li>
                </ul>
              </div>
              
              <div className="p-4 rounded-lg border-l-4 border-green-500 bg-green-50">
                <h3 className="font-semibold mb-2">✓ Contact Information Display</h3>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Multiple contact methods</li>
                  <li>• Email, Phone, Address, Website</li>
                  <li>• Clickable links</li>
                  <li>• Custom labels</li>
                </ul>
              </div>
              
              <div className="p-4 rounded-lg border-l-4 border-green-500 bg-green-50">
                <h3 className="font-semibold mb-2">✓ Map Integration</h3>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Google Maps iframe embed</li>
                  <li>• Configurable height</li>
                  <li>• Optional display</li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 rounded-lg border-l-4 border-green-500 bg-green-50">
                <h3 className="font-semibold mb-2">✓ Business Hours Integration</h3>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• 7-day week schedule</li>
                  <li>• Open/Closed status per day</li>
                  <li>• Timezone support</li>
                  <li>• "Open Now" indicator</li>
                </ul>
              </div>
              
              <div className="p-4 rounded-lg border-l-4 border-green-500 bg-green-50">
                <h3 className="font-semibold mb-2">✓ Spam Protection</h3>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Honeypot field</li>
                  <li>• Hidden from normal users</li>
                  <li>• Configurable field name</li>
                  <li>• Spambot detection</li>
                </ul>
              </div>
              
              <div className="p-4 rounded-lg border-l-4 border-green-500 bg-green-50">
                <h3 className="font-semibold mb-2">✓ Edit & Public Modes</h3>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Full admin configuration</li>
                  <li>• Real-time preview</li>
                  <li>• Responsive design</li>
                  <li>• Consistent styling</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Setup Instructions</h2>
          <div className="space-y-6">
            <div className="p-6 bg-card rounded-lg border">
              <h3 className="text-lg font-semibold mb-3">1. Form Submission Setup</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Create an API endpoint at &lt;code&gt;/api/contact&lt;/code&gt; to handle form submissions:
              </p>
              <pre className="p-3 bg-muted rounded text-xs overflow-x-auto">
{`// app/api/contact/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Extract honeypot field
    const { honeypot, ...formData } = data;
    
    // Check honeypot (if filled, it's spam)
    if (honeypot) {
      return NextResponse.json({ success: false }, { status: 400 });
    }
    
    // TODO: Send email using nodemailer, SendGrid, etc.
    // const { name, email, phone, subject, message, toEmail, ccEmail, bccEmail } = formData;
    
    return NextResponse.json({ success: true });
  } catch (_error: unknown) {
    console.error('Contact form error:', _error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}`}
              </pre>
            </div>

            <div className="p-6 bg-card rounded-lg border">
              <h3 className="text-lg font-semibold mb-3">2. Google Maps Setup</h3>
              <ol className="text-sm text-muted-foreground space-y-2 list-decimal ml-6">
                <li>Go to Google Maps</li>
                <li>Search for your location</li>
                <li>Click &quot;Share&quot; → &quot;Embed map&quot;</li>
                <li>Copy the iframe URL (src attribute)</li>
                <li>Paste it in the &quot;Google Maps Embed URL&quot; field</li>
              </ol>
            </div>

            <div className="p-6 bg-card rounded-lg border">
              <h3 className="text-lg font-semibold mb-3">3. Email Configuration</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Configure the following email settings:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc ml-6">
                <li>&lt;strong&gt;Send To Email:&lt;/strong&gt; Where form submissions will be sent (required)</li>
                <li>&lt;strong&gt;CC Email:&lt;/strong&gt; Additional recipient (optional)</li>
                <li>&lt;strong&gt;BCC Email:&lt;/strong&gt; Hidden recipient (optional)</li>
              </ul>
            </div>

            <div className="p-6 bg-card rounded-lg border">
              <h3 className="text-lg font-semibold mb-3">4. Spam Protection Best Practices</h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc ml-6">
                <li>Keep the honeypot field name unique and change it periodically</li>
                <li>The field is hidden from normal users but visible to bots</li>
                <li>If the honeypot field is filled, the submission is rejected</li>
                <li>Works alongside server-side validation for maximum protection</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
