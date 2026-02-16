"use client";

import { useState, useEffect } from 'react';
import { BlockEditorProps } from '../types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Clock, Mail, MapPin, Phone, Calendar, ExternalLink, MessageSquare, Send, X, Globe, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Contact Block
 * Comprehensive contact component with form, contact info display, map integration,
 * multiple contact methods, business hours, spam protection, and validation
 */

interface ContactMethod {
  id: string;
  type: 'email' | 'phone' | 'address' | 'website';
  label: string;
  value: string;
  icon?: string;
  link?: string;
}

interface BusinessHour {
  day: string;
  open: string;
  close: string;
  closed: boolean;
}

interface ContactBlockContent {
  // Contact Information
  methods: ContactMethod[];
  showForm: boolean;
  formTitle: string;
  formSubtitle: string;
  
  // Business Hours
  showBusinessHours: boolean;
  businessHours: BusinessHour[];
  timezone: string;
  
  // Map
  showMap: boolean;
  mapUrl: string;
  mapHeight: string;
  
  // Response Time
  showResponseTime: boolean;
  responseTime: string;
  
  // Form Configuration
  requirePhone: boolean;
  requireSubject: boolean;
  emailTo: string;
  ccEmail?: string;
  bccEmail?: string;
  
  // Spam Protection
  enableHoneypot: boolean;
  honeypotField: string;
  
  // Messages
  successMessage: string;
  errorMessage: string;
  buttonText: string;
  privacyText: string;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIMEZONES = [
  'UTC', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
  'America/Toronto', 'America/Vancouver', 'Europe/London', 'Europe/Paris', 
  'Europe/Berlin', 'Asia/Tokyo', 'Asia/Shanghai', 'Asia/Kolkata', 'Australia/Sydney'
];

export default function ContactBlock({ block, onUpdate, onDelete, isEditing = false }: BlockEditorProps) {
  const { content, design } = block;
  const contactContent = content as ContactBlockContent;
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    honeypot: ''
  });
  
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formMessage, setFormMessage] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Initialize defaults
  useEffect(() => {
    if (!contactContent.methods) {
      onUpdate({
        content: {
          ...contactContent,
          methods: [],
          showForm: true,
          formTitle: 'Get In Touch',
          formSubtitle: 'Fill out the form below and we\'ll get back to you as soon as possible.',
          showBusinessHours: false,
          businessHours: DAYS.map(day => ({ day, open: '09:00', close: '17:00', closed: false })),
          timezone: 'UTC',
          showMap: false,
          mapUrl: '',
          mapHeight: '300px',
          showResponseTime: true,
          responseTime: 'Within 24 hours',
          requirePhone: false,
          requireSubject: false,
          emailTo: '',
          enableHoneypot: true,
          honeypotField: 'website_url',
          successMessage: 'Thank you! Your message has been sent successfully.',
          errorMessage: 'Sorry, there was an error sending your message. Please try again later.',
          buttonText: 'Send Message',
          privacyText: 'We respect your privacy and will never share your information.'
        }
      });
    }
  }, []);
  
  // Update current time every minute for business hours status
  useEffect(() => {
    if (contactContent.showBusinessHours) {
      const interval = setInterval(() => setCurrentTime(new Date()), 60000);
      return () => clearInterval(interval);
    }
  }, [contactContent.showBusinessHours]);
  
  const handleContentChange = (field: string, value: string | boolean | ContactMethod[] | BusinessHour[]) => {
    onUpdate({
      content: {
        ...contactContent,
        [field]: value
      }
    });
  };
  
  const handleMethodChange = (id: string, field: keyof ContactMethod, value: string) => {
    const updatedMethods = contactContent.methods.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    );
    handleContentChange('methods', updatedMethods);
  };
  
  const addMethod = () => {
    const newMethod: ContactMethod = {
      id: `method-${Date.now()}`,
      type: 'email',
      label: '',
      value: '',
      icon: 'mail'
    };
    handleContentChange('methods', [...(contactContent.methods || []), newMethod]);
  };
  
  const deleteMethod = (id: string) => {
    handleContentChange('methods', contactContent.methods.filter(m => m.id !== id));
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Honeypot check - if filled, it's spam
    if (formData.honeypot) {
      console.log('Spam detected via honeypot field');
      return;
    }
    
    // Client-side validation
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus('error');
      setFormMessage('Please fill in all required fields.');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormStatus('error');
      setFormMessage('Please enter a valid email address.');
      return;
    }
    
    if (contactContent.requirePhone && !formData.phone) {
      setFormStatus('error');
      setFormMessage('Phone number is required.');
      return;
    }
    
    if (contactContent.requireSubject && !formData.subject) {
      setFormStatus('error');
      setFormMessage('Subject is required.');
      return;
    }
    
    setFormStatus('loading');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          toEmail: contactContent.emailTo,
          ccEmail: contactContent.ccEmail,
          bccEmail: contactContent.bccEmail,
          pageId: block.id,
          blockId: block.id
        })
      });
      
      if (response.ok) {
        setFormStatus('success');
        setFormMessage(contactContent.successMessage);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '', honeypot: '' });
      } else {
        setFormStatus('error');
        setFormMessage(contactContent.errorMessage);
      }
    } catch (error) {
      setFormStatus('error');
      setFormMessage(contactContent.errorMessage);
      console.error('Contact form submission error:', error);
    }
  };
  
  const getCurrentDayHours = (): BusinessHour | null => {
    const currentDay = currentTime.toLocaleDateString('en-US', { weekday: 'long' });
    return contactContent.businessHours.find(h => h.day === currentDay) || null;
  };
  
  const isCurrentlyOpen = (): boolean => {
    if (!contactContent.showBusinessHours) return true;
    
    const todayHours = getCurrentDayHours();
    if (!todayHours || todayHours.closed) return false;
    
    const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    const [openHour, openMin] = todayHours.open.split(':').map(Number);
    const [closeHour, closeMin] = todayHours.close.split(':').map(Number);
    const openMinutes = openHour * 60 + openMin;
    const closeMinutes = closeHour * 60 + closeMin;
    
    return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
  };
  
  const getContactMethodIcon = (type: string) => {
    switch (type) {
      case 'email': return Mail;
      case 'phone': return Phone;
      case 'address': return MapPin;
      case 'website': return Globe;
      default: return Mail;
    }
  };
  
  // Public View
  if (!isEditing) {
    return (
      <div 
        className="block-contact"
        style={{
          backgroundColor: design.backgroundColor,
          color: design.textColor,
          padding: design.padding,
          margin: design.margin,
          borderRadius: design.borderRadius,
        }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Contact Methods */}
          {contactContent.methods?.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {contactContent.methods.map((method) => {
                const Icon = getContactMethodIcon(method.type);
                let link = method.link || '';
                if (!link) {
                  switch (method.type) {
                    case 'email': link = `mailto:${method.value}`; break;
                    case 'phone': link = `tel:${method.value.replace(/\s/g, '')}`; break;
                    case 'address': link = `https://maps.google.com/?q=${encodeURIComponent(method.value)}`; break;
                    case 'website': link = method.value.startsWith('http') ? method.value : `https://${method.value}`; break;
                  }
                }
                
                return (
                  <Card key={method.id} className="transition-all hover:shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{method.label}</h3>
                          {method.type === 'address' ? (
                            <p className="text-sm text-muted-foreground mb-3">{method.value}</p>
                          ) : (
                            <p className="text-sm text-muted-foreground mb-3">{method.value}</p>
                          )}
                          {link && (
                            <a 
                              href={link} 
                              target={method.type === 'website' ? '_blank' : '_self'}
                              rel={method.type === 'website' ? 'noopener noreferrer' : ''}
                              className="inline-flex items-center gap-1 text-primary text-sm hover:underline"
                            >
                              {method.type === 'email' ? 'Email' : 
                               method.type === 'phone' ? 'Call' : 
                               method.type === 'address' ? 'View Map' : 'Visit'}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            {contactContent.showForm && (
              <Card>
                <CardHeader>
                  <CardTitle>{contactContent.formTitle}</CardTitle>
                  <p className="text-sm text-muted-foreground">{contactContent.formSubtitle}</p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    {formStatus === 'success' && (
                      <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">{formMessage}</span>
                      </div>
                    )}
                    
                    {formStatus === 'error' && (
                      <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">{formMessage}</span>
                      </div>
                    )}
                    
                    <div>
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        disabled={formStatus === 'loading'}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        disabled={formStatus === 'loading'}
                        required
                      />
                    </div>
                    
                    {(contactContent.requirePhone || (!isEditing && formData.phone)) && (
                      <div>
                        <Label htmlFor="phone">Phone {contactContent.requirePhone && '*'}</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleFormChange}
                          disabled={formStatus === 'loading'}
                          required={contactContent.requirePhone}
                        />
                      </div>
                    )}
                    
                    {(contactContent.requireSubject || (!isEditing && formData.subject)) && (
                      <div>
                        <Label htmlFor="subject">Subject {contactContent.requireSubject && '*'}</Label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleFormChange}
                          disabled={formStatus === 'loading'}
                          required={contactContent.requireSubject}
                        />
                      </div>
                    )}
                    
                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleFormChange}
                        disabled={formStatus === 'loading'}
                        required
                        rows={5}
                      />
                    </div>
                    
                    {/* Honeypot Field - Hidden from normal users */}
                    {contactContent.enableHoneypot && (
                      <div className="sr-only" aria-hidden="true">
                        <Label htmlFor={contactContent.honeypotField}>Leave this field empty</Label>
                        <Input
                          id={contactContent.honeypotField}
                          name="honeypot"
                          value={formData.honeypot}
                          onChange={handleFormChange}
                          tabIndex={-1}
                          autoComplete="off"
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MessageSquare className="h-3 w-3" />
                      <span>{contactContent.privacyText}</span>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={formStatus === 'loading'}
                    >
                      {formStatus === 'loading' ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          {contactContent.buttonText}
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
            
            {/* Right Column: Business Hours & Map */}
            <div className="space-y-6">
              {/* Business Hours */}
              {contactContent.showBusinessHours && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Business Hours
                      <span className={`ml-auto text-xs px-2 py-1 rounded-full ${
                        isCurrentlyOpen() 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {isCurrentlyOpen() ? 'Open Now' : 'Closed'}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {contactContent.businessHours.map((hours) => (
                        <div key={hours.day} className="flex justify-between items-center py-2 border-b last:border-0">
                          <span className="font-medium text-sm">{hours.day}</span>
                          <span className="text-sm text-muted-foreground">
                            {hours.closed ? 'Closed' : `${hours.open} - ${hours.close}`}
                          </span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">
                      Timezone: {contactContent.timezone}
                    </p>
                  </CardContent>
                </Card>
              )}
              
              {/* Response Time */}
              {contactContent.showResponseTime && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Response Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      We typically respond within {contactContent.responseTime}
                    </p>
                  </CardContent>
                </Card>
              )}
              
              {/* Map */}
              {contactContent.showMap && contactContent.mapUrl && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Find Us
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div 
                      className="w-full"
                      style={{ height: contactContent.mapHeight }}
                    >
                      <iframe
                        src={contactContent.mapUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Edit View
  return (
    <div className="block-editor-contact space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Contact Block</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <X size={16} />
        </Button>
      </div>
      
      {/* Contact Methods */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <Label>Contact Methods</Label>
          <Button onClick={addMethod} size="sm" variant="outline">
            Add Method
          </Button>
        </div>
        
        <div className="space-y-3">
          {contactContent.methods?.length === 0 ? (
            <div className="text-center py-6 border-2 border-dashed rounded-lg text-muted-foreground">
              <p>No contact methods added yet.</p>
            </div>
          ) : (
            contactContent.methods?.map((method) => (
              <div key={method.id} className="grid grid-cols-12 gap-2 items-center p-3 border rounded-lg">
                <div className="col-span-3">
                  <Select
                    value={method.type}
                    onValueChange={(value) => handleMethodChange(method.id, 'type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="address">Address</SelectItem>
                      <SelectItem value="website">Website</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-4">
                  <Input
                    value={method.label}
                    onChange={(e) => handleMethodChange(method.id, 'label', e.target.value)}
                    placeholder="Label (e.g., Support Email)"
                  />
                </div>
                <div className="col-span-4">
                  <Input
                    value={method.value}
                    onChange={(e) => handleMethodChange(method.id, 'value', e.target.value)}
                    placeholder="value@example.com"
                  />
                </div>
                <div className="col-span-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteMethod(method.id)}
                  >
                    <X size={16} className="text-destructive" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form Settings */}
        <div className="space-y-4">
          <Label>Form Settings</Label>
          
          <div>
            <Label>Form Title</Label>
            <Input
              value={contactContent.formTitle || 'Get In Touch'}
              onChange={(e) => handleContentChange('formTitle', e.target.value)}
            />
          </div>
          
          <div>
            <Label>Form Subtitle</Label>
            <Input
              value={contactContent.formSubtitle || 'Fill out the form below...'}
              onChange={(e) => handleContentChange('formSubtitle', e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Switch
              checked={contactContent.showForm}
              onCheckedChange={(checked) => handleContentChange('showForm', checked)}
            />
            <Label>Show Contact Form</Label>
          </div>
          
          <div className="flex items-center gap-2">
            <Switch
              checked={contactContent.requirePhone}
              onCheckedChange={(checked) => handleContentChange('requirePhone', checked)}
            />
            <Label>Phone Required</Label>
          </div>
          
          <div className="flex items-center gap-2">
            <Switch
              checked={contactContent.requireSubject}
              onCheckedChange={(checked) => handleContentChange('requireSubject', checked)}
            />
            <Label>Subject Required</Label>
          </div>
          
          <div>
            <Label>Button Text</Label>
            <Input
              value={contactContent.buttonText || 'Send Message'}
              onChange={(e) => handleContentChange('buttonText', e.target.value)}
            />
          </div>
          
          <div>
            <Label>Privacy Text</Label>
            <Input
              value={contactContent.privacyText || 'We respect your privacy...'}
              onChange={(e) => handleContentChange('privacyText', e.target.value)}
            />
          </div>
        </div>
        
        {/* Email Settings */}
        <div className="space-y-4">
          <Label>Email Settings</Label>
          
          <div>
            <Label>Send To Email *</Label>
            <Input
              type="email"
              value={contactContent.emailTo || ''}
              onChange={(e) => handleContentChange('emailTo', e.target.value)}
              placeholder="your@email.com"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Where form submissions will be sent
            </p>
          </div>
          
          <div>
            <Label>CC Email (optional)</Label>
            <Input
              type="email"
              value={contactContent.ccEmail || ''}
              onChange={(e) => handleContentChange('ccEmail', e.target.value)}
              placeholder="cc@email.com"
            />
          </div>
          
          <div>
            <Label>BCC Email (optional)</Label>
            <Input
              type="email"
              value={contactContent.bccEmail || ''}
              onChange={(e) => handleContentChange('bccEmail', e.target.value)}
              placeholder="bcc@email.com"
            />
          </div>
        </div>
      </div>
      
      {/* Business Hours */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <Label>Business Hours</Label>
          <Switch
            checked={contactContent.showBusinessHours}
            onCheckedChange={(checked) => handleContentChange('showBusinessHours', checked)}
          />
        </div>
        
        {contactContent.showBusinessHours && (
          <>
            <div className="mb-4">
              <Label>Timezone</Label>
              <Select
                value={contactContent.timezone || 'UTC'}
                onValueChange={(value) => handleContentChange('timezone', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map(tz => (
                    <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              {contactContent.businessHours?.map((hours, index) => (
                <div key={hours.day} className="flex items-center gap-3">
                  <span className="w-24 font-medium text-sm">{hours.day}</span>
                  <Input
                    type="time"
                    value={hours.open}
                    onChange={(e) => {
                      const updatedHours = [...contactContent.businessHours];
                      updatedHours[index].open = e.target.value;
                      handleContentChange('businessHours', updatedHours);
                    }}
                    className="w-32"
                  />
                  <span className="text-sm">to</span>
                  <Input
                    type="time"
                    value={hours.close}
                    onChange={(e) => {
                      const updatedHours = [...contactContent.businessHours];
                      updatedHours[index].close = e.target.value;
                      handleContentChange('businessHours', updatedHours);
                    }}
                    className="w-32"
                  />
                  <div className="flex items-center gap-2 ml-4">
                    <Switch
                      checked={!hours.closed}
                      onCheckedChange={(checked) => {
                        const updatedHours = [...contactContent.businessHours];
                        updatedHours[index].closed = !checked;
                        handleContentChange('businessHours', updatedHours);
                      }}
                    />
                    <Label className="text-sm">{hours.closed ? 'Closed' : 'Open'}</Label>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      
      {/* Response Time */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <Label>Response Time</Label>
          <Switch
            checked={contactContent.showResponseTime}
            onCheckedChange={(checked) => handleContentChange('showResponseTime', checked)}
          />
        </div>
        
        {contactContent.showResponseTime && (
          <Input
            value={contactContent.responseTime || 'Within 24 hours'}
            onChange={(e) => handleContentChange('responseTime', e.target.value)}
            placeholder="e.g., Within 24 hours"
          />
        )}
      </div>
      
      {/* Map Integration */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <Label>Google Maps</Label>
          <Switch
            checked={contactContent.showMap}
            onCheckedChange={(checked) => handleContentChange('showMap', checked)}
          />
        </div>
        
        {contactContent.showMap && (
          <div className="space-y-4">
            <div>
              <Label>Google Maps Embed URL</Label>
              <Input
                value={contactContent.mapUrl || ''}
                onChange={(e) => handleContentChange('mapUrl', e.target.value)}
                placeholder="https://www.google.com/maps/embed?pb=..."
              />
              <p className="text-xs text-muted-foreground mt-1">
                Get this from Google Maps &quot;Share&quot; → &quot;Embed map&quot;
              </p>
            </div>
            
            <div>
              <Label>Map Height</Label>
              <Select
                value={contactContent.mapHeight || '300px'}
                onValueChange={(value) => handleContentChange('mapHeight', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="200px">Small (200px)</SelectItem>
                  <SelectItem value="300px">Medium (300px)</SelectItem>
                  <SelectItem value="400px">Large (400px)</SelectItem>
                  <SelectItem value="500px">Extra Large (500px)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {contactContent.mapUrl && (
              <div className="border rounded-lg p-3">
                <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                <div style={{ height: '200px' }}>
                  <iframe
                    src={contactContent.mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0, borderRadius: '4px' }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Spam Protection */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <Label>Spam Protection</Label>
          <Switch
            checked={contactContent.enableHoneypot}
            onCheckedChange={(checked) => handleContentChange('enableHoneypot', checked)}
          />
        </div>
        
        {contactContent.enableHoneypot && (
          <div>
            <Label>Honeypot Field Name</Label>
            <Input
              value={contactContent.honeypotField || 'website_url'}
              onChange={(e) => handleContentChange('honeypotField', e.target.value)}
              placeholder="website_url"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Hidden field that spammers might fill out. Change this periodically.
            </p>
          </div>
        )}
      </div>
      
      {/* Success/Error Messages */}
      <div className="border-t pt-6">
        <Label>Messages</Label>
        
        <div className="space-y-4 mt-2">
          <div>
            <Label className="text-sm">Success Message</Label>
            <Input
              value={contactContent.successMessage || 'Thank you! Your message has been sent.'}
              onChange={(e) => handleContentChange('successMessage', e.target.value)}
            />
          </div>
          
          <div>
            <Label className="text-sm">Error Message</Label>
            <Input
              value={contactContent.errorMessage || 'Sorry, there was an error...'}
              onChange={(e) => handleContentChange('errorMessage', e.target.value)}
            />
          </div>
        </div>
      </div>
      
      {/* Configuration Summary */}
      <div className="border-t pt-6">
        <div className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
          <p>{contactContent.methods?.length || 0} contact method{contactContent.methods?.length !== 1 ? 's' : ''} • 
             {contactContent.showForm ? 'Form enabled' : 'Form disabled'} • 
             {contactContent.showBusinessHours ? 'Hours shown' : 'Hours hidden'} • 
             {contactContent.showMap ? 'Map shown' : 'Map hidden'}</p>
        </div>
      </div>
    </div>
  );
}
