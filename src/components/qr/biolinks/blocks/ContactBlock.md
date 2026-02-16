# Contact Block

A comprehensive contact management block for biolink pages with form, business hours, Google Maps integration, and spam protection.

## Features

### ✨ Core Features
- **Contact Form**: Full-featured form with name, email, phone, subject, and message fields
- **Contact Information**: Display multiple contact methods (email, phone, address, website)
- **Google Maps Integration**: Embeddable map with configurable height
- **Business Hours**: 7-day schedule with timezone support and "Open Now" indicator
- **Response Time**: Display expected response time to set visitor expectations
- **Spam Protection**: Honeypot field to detect and block spambots
- **Form Validation**: Both client-side and server-side validation
- **Dual Mode**: Full-featured edit interface and clean public view

### 🛡️ Security Features
- Honeypot spam protection
- Email validation
- Required field validation
- XSS prevention
- Secure form submission

### 🎨 Customization
- Contact method management
- Business hours configuration
- Map integration
- Response time settings
- Form field requirements
- Custom success/error messages
- Privacy text
- Full design control (colors, spacing, borders)

## Installation

The Contact Block is automatically registered in the block system. You can use it by adding it to your biolink page through the block editor.

## Usage

### Basic Setup

```typescript
import ContactBlock from './blocks/ContactBlock';
import { Block } from '../types';

// Define your block data
const contactBlock: Block = {
  id: 'contact-123',
  type: 'contact',
  title: 'Contact Us',
  content: {
    methods: [
      {
        id: 'method-1',
        type: 'email',
        label: 'Support',
        value: 'support@example.com',
        link: 'mailto:support@example.com'
      }
    ],
    showForm: true,
    formTitle: 'Get In Touch',
    formSubtitle: 'We\'ll respond within 24 hours',
    // ... other configuration options
  },
  settings: { /* settings */ },
  design: { /* design */ }
};
```

### Component Props

```typescript
interface BlockEditorProps {
  block: Block;                    // Block data
  onUpdate: (updates: Partial<Block>) => void;  // Update handler
  onDelete: () => void;            // Delete handler
  isEditing?: boolean;             // Edit mode (true = edit, false = public)
  isPreview?: boolean;             // Preview mode
}
```

### Example Usage

```tsx
// Public view
<ContactBlock 
  block={contactBlock} 
  onUpdate={handleUpdate} 
  onDelete={handleDelete} 
  isEditing={false} 
/>

// Edit view
<ContactBlock 
  block={contactBlock} 
  onUpdate={handleUpdate} 
  onDelete={handleDelete} 
  isEditing={true} 
/>
```

## Configuration

### Contact Methods

Configure multiple contact methods that appear as cards:

```typescript
methods: [
  {
    id: 'email-1',
    type: 'email',
    label: 'Support Email',
    value: 'support@example.com'
  },
  {
    id: 'phone-1',
    type: 'phone',
    label: 'Call Us',
    value: '+1 (555) 123-4567'
  },
  {
    id: 'address-1',
    type: 'address',
    label: 'Visit Us',
    value: '123 Main St, New York, NY'
  },
  {
    id: 'website-1',
    type: 'website',
    label: 'Website',
    value: 'www.example.com'
  }
]
```

### Form Configuration

```typescript
showForm: true,                              // Enable/disable form
formTitle: 'Get In Touch',                    // Form title
formSubtitle: 'We\'ll respond within...',     // Subtitle
requirePhone: false,                          // Phone required?
requireSubject: true,                         // Subject required?
buttonText: 'Send Message',                   // Submit button text
privacyText: 'We respect your privacy...'     // Privacy notice
```

### Email Settings

```typescript
emailTo: 'your@email.com',      // Required: Where forms are sent
ccEmail: 'manager@example.com',  // Optional: CC recipient
bccEmail: 'backup@example.com',  // Optional: BCC recipient
```

### Business Hours

```typescript
showBusinessHours: true,
timezone: 'America/New_York',
businessHours: [
  { day: 'Monday', open: '09:00', close: '17:00', closed: false },
  { day: 'Tuesday', open: '09:00', close: '17:00', closed: false }
  // ... etc
]
```

### Map Integration

```typescript
showMap: true,
mapUrl: 'https://www.google.com/maps/embed?pb=...', // Google Maps embed URL
mapHeight: '400px'                                   // Map height
```

### Spam Protection

```typescript
enableHoneypot: true,           // Enable honeypot
honeypotField: 'website_url'    // Honeypot field name
```

## Form Submission

The contact form submits to `/api/contact`. Create this endpoint:

```typescript
// app/api/contact/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Check honeypot
    if (data.honeypot) {
      return NextResponse.json(
        { success: false, message: 'Spam detected' }, 
        { status: 400 }
      );
    }
    
    const { name, email, phone, subject, message, toEmail, ccEmail, bccEmail } = data;
    
    // TODO: Send email using your preferred service
    // - Nodemailer
    // - SendGrid
    // - AWS SES
    // - Resend
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' }, 
      { status: 500 }
    );
  }
}
```

### Email Services

**Nodemailer (SMTP):**
```typescript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

await transporter.sendMail({
  from: process.env.FROM_EMAIL,
  to: data.toEmail,
  cc: data.ccEmail,
  bcc: data.bccEmail,
  subject: `Contact Form: ${data.subject}`,
  html: `
    <h3>New Contact Form Submission</h3>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
    <p><strong>Subject:</strong> ${data.subject || 'No subject'}</p>
    <p><strong>Message:</strong></p>
    <p>${data.message}</p>
  `
});
```

**SendGrid:**
```typescript
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

await sgMail.send({
  to: data.toEmail,
  from: process.env.FROM_EMAIL,
  subject: `Contact Form: ${data.subject}`,
  html: `...`
});
```

## Google Maps Setup

1. Go to Google Maps (maps.google.com)
2. Search for your location
3. Click "Share" button
4. Select "Embed map"
5. Copy the iframe URL (src attribute)
6. Paste it in the Map URL field

Example URL format:
```
https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d......
```

## Spam Protection Details

The Contact Block uses a honeypot field for spam protection:

1. A hidden field is added to the form
2. Normal users can't see or fill it (screen reader hidden)
3. Bots often fill all fields, including hidden ones
4. If the honeypot field has a value, submission is rejected
5. No CAPTCHA needed for legitimate users

**Best Practices:**
- Change the honeypot field name periodically
- Use non-obvious field names (not "honeypot")
- Combine with server-side validation
- Monitor form submissions for patterns

## Validation

### Client-Side Validation
- Required field checks
- Email format validation
- Phone format validation (optional)
- Subject field check (if required)

### Server-Side Validation
```typescript
// Validate in /api/contact endpoint
if (!data.name || !data.email || !data.message) {
  return NextResponse.json({ success: false }, { status: 400 });
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(data.email)) {
  return NextResponse.json({ success: false }, { status: 400 });
}

// Check honeypot
if (data.honeypot) {
  return NextResponse.json({ success: false }, { status: 400 });
}
```

## UI/UX Features

### Public View
- Clean, modern card-based layout
- Responsive grid system
- Interactive hover effects
- Real-time business hours status
- Loading states
- Success/error notifications
- Accessible form elements

### Edit View
- Comprehensive configuration panel
- Organized sections (Form, Email, Hours, Map, Security)
- Real-time preview updates
- Default values for quick setup
- Field validation
- Helpful tooltips and descriptions

## Design Customization

The block inherits design properties from the block system:

```typescript
design: {
  backgroundColor: '#ffffff',  // Card background
  textColor: '#000000',        // Text color
  borderRadius: '12px',        // Corner radius
  padding: '1.5rem',           // Internal spacing
  margin: '0.5rem 0'           // External spacing
}
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Dependencies

Uses standard block system dependencies:
- React 18+
- Lucide React icons
- Tailwind CSS
- UI components from `@/components/ui/`

## Testing

Test the Contact Block:

1. **Form Submission:** Fill out the form and verify email delivery
2. **Validation:** Test required fields and invalid email formats
3. **Spam Protection:** Verify honeypot field is hidden and functional
4. **Business Hours:** Check "Open Now" status accuracy
5. **Map Display:** Verify Google Maps loads correctly
6. **Responsive Design:** Test on mobile, tablet, and desktop

## Troubleshooting

**Form not submitting:**
- Check `/api/contact` endpoint exists
- Verify email service configuration
- Check browser console for errors

**Map not displaying:**
- Verify embed URL is correct
- Check for console errors (CORS, loading issues)
- Ensure iframe is not blocked

**Spam getting through:**
- Check honeypot field is hidden properly
- Verify server-side validation
- Consider rate limiting

**Business hours incorrect:**
- Verify timezone setting
- Check server vs client timezone
- Use UTC for consistency

## Demo

Run the demo to see all features:

```bash
npm run dev
# Navigate to ContactBlock demo component
```

The demo showcases:
- Pre-configured contact methods
- Working form with validation
- Business hours display
- Embedded Google Map
- Spam protection demonstration
- Both edit and public views

## License

Part of the karsaaz QR biolinks system.
