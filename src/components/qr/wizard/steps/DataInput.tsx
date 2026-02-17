"use client";

import { useQRWizard } from "@/store/use-qr-wizard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

export default function DataInput() {
  const { qrType, qrData, setQRData } = useQRWizard();

  const updateData = (key: string, value: any) => {
    setQRData({ ...qrData, [key]: value });
  };

  if (!qrType) {
    return <div className="text-center p-10">Please select a QR code type first.</div>;
  }

  // Simplified form logic - in production, break this into sub-components per type
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold mb-4 capitalize">Enter {qrType} Details</h2>

      {qrType === 'url' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">Website URL</Label>
            <Input 
              id="url" 
              placeholder="https://example.com" 
              value={qrData.url || ''}
              onChange={(e) => updateData('url', e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              id="dynamic" 
              checked={qrData.dynamic || false}
              onCheckedChange={(checked) => updateData('dynamic', checked)}
            />
            <Label htmlFor="dynamic">Dynamic QR Code (Trackable)</Label>
          </div>
        </div>
      )}

      {qrType === 'text' && (
        <div className="space-y-2">
          <Label htmlFor="text">Content</Label>
          <Textarea 
            id="text" 
            placeholder="Enter your text here..." 
            rows={5}
            value={qrData.text || ''}
            onChange={(e) => updateData('text', e.target.value)}
          />
        </div>
      )}

      {qrType === 'email' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="user@example.com"
              value={qrData.email || ''}
              onChange={(e) => updateData('email', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input 
              id="subject" 
              placeholder="Hello..."
              value={qrData.subject || ''}
              onChange={(e) => updateData('subject', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="body">Message</Label>
            <Textarea 
              id="body" 
              rows={4}
              value={qrData.body || ''}
              onChange={(e) => updateData('body', e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Add other types as needed */}
      {!['url', 'text', 'email'].includes(qrType) && (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-muted-foreground">Form for <strong>{qrType}</strong> is coming soon.</p>
        </div>
      )}
    </div>
  );
}
