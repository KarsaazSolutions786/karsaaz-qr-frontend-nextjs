"use client";

import { useQRWizard, QRType } from "@/store/use-qr-wizard";
import { Card } from "@/components/ui/card";
import { 
  Link, FileText, Mail, MessageSquare, Wifi, Bitcoin, 
  Image as ImageIcon, Video, AppWindow, Globe, File, 
  Facebook, Twitter, Instagram, Linkedin 
} from "lucide-react";
import { cn } from "@/lib/utils";

const QR_TYPES: { id: QRType; label: string; icon: any }[] = [
  { id: 'url', label: 'URL / Link', icon: Link },
  { id: 'vcard', label: 'vCard Plus', icon: FileText }, // Placeholder icon
  { id: 'text', label: 'Text', icon: FileText },
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'sms', label: 'SMS', icon: MessageSquare },
  { id: 'wifi', label: 'WiFi', icon: Wifi },
  { id: 'bitcoin', label: 'Bitcoin', icon: Bitcoin },
  { id: 'pdf', label: 'PDF', icon: File },
  { id: 'app', label: 'App Store', icon: AppWindow },
  { id: 'image', label: 'Image', icon: ImageIcon },
  { id: 'video', label: 'Video', icon: Video },
  { id: 'facebook', label: 'Facebook', icon: Facebook },
  { id: 'twitter', label: 'Twitter', icon: Twitter },
  { id: 'instagram', label: 'Instagram', icon: Instagram },
  { id: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare }, // Placeholder
];

export default function TypeSelection() {
  const { qrType, setQRType, setStep } = useQRWizard();

  const handleSelect = (type: QRType) => {
    setQRType(type);
    // Optional: Auto-advance
    // setStep(1); 
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Select QR Code Type</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {QR_TYPES.map((type) => {
          const Icon = type.icon;
          const isSelected = qrType === type.id;
          
          return (
            <Card
              key={type.id}
              onClick={() => handleSelect(type.id)}
              className={cn(
                "cursor-pointer flex flex-col items-center justify-center p-6 transition-all hover:shadow-md border-2",
                isSelected 
                  ? "border-primary bg-primary/5 shadow-lg" 
                  : "border-transparent hover:border-gray-200"
              )}
            >
              <div className={cn(
                "p-3 rounded-full mb-3 transition-colors",
                isSelected ? "bg-primary text-white" : "bg-gray-100 text-gray-500"
              )}>
                <Icon className="w-6 h-6" />
              </div>
              <span className={cn(
                "text-sm font-medium text-center",
                isSelected ? "text-primary" : "text-gray-700"
              )}>
                {type.label}
              </span>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
