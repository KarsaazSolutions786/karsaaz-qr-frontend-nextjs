/**
 * Form field definitions for every QR code type.
 * Used by QRFormBuilder to dynamically render the create/edit form.
 */
import { FieldDefinition } from "@/components/qr/QRFormBuilder";

export const qrTypeFields: Record<string, FieldDefinition[]> = {
    // ── Static types ──────────────────────────────────────

    text: [
        { name: "text", label: "Text Content", type: "textarea", required: true, placeholder: "Enter your text here..." },
    ],

    email: [
        { name: "email", label: "Email Address", type: "email", required: true, placeholder: "hello@example.com" },
        { name: "subject", label: "Subject", type: "text", placeholder: "Email subject" },
        { name: "message", label: "Message Body", type: "textarea", placeholder: "Email body content" },
    ],

    call: [
        { name: "phone", label: "Phone Number", type: "tel", required: true, placeholder: "+1234567890" },
    ],

    sms: [
        { name: "phone", label: "Phone Number", type: "tel", required: true, placeholder: "+1234567890" },
        { name: "message", label: "Message", type: "textarea", placeholder: "Pre-filled SMS text" },
    ],

    wifi: [
        { name: "ssid", label: "Network Name (SSID)", type: "text", required: true, placeholder: "MyWiFi" },
        { name: "password", label: "Password", type: "text", required: true, placeholder: "WiFi password" },
        { name: "type", label: "Encryption", type: "text", placeholder: "WPA/WPA2/WEP/nopass" },
        { name: "hidden", label: "Hidden Network", type: "text", placeholder: "true/false" },
    ],

    vcard: [
        { name: "firstName", label: "First Name", type: "text", required: true },
        { name: "lastName", label: "Last Name", type: "text", required: true },
        { name: "phones", label: "Phone", type: "tel", required: true },
        { name: "emails", label: "Email", type: "email" },
        { name: "company", label: "Organization", type: "text" },
        { name: "job", label: "Job Title", type: "text" },
        { name: "website_list", label: "Website", type: "url" },
        { name: "street", label: "Street", type: "text" },
        { name: "city", label: "City", type: "text" },
        { name: "zip", label: "Zip", type: "text" },
        { name: "state", label: "State", type: "text" },
        { name: "country", label: "Country", type: "text" },
    ],

    location: [
        { name: "latitude", label: "Latitude", type: "number", required: true, placeholder: "40.7128" },
        { name: "longitude", label: "Longitude", type: "number", required: true, placeholder: "-74.0060" },
        { name: "label", label: "Location Label", type: "text", placeholder: "New York City" },
    ],

    crypto: [
        { name: "currency", label: "Currency", type: "text", required: true, placeholder: "BTC / ETH / LTC" },
        { name: "address", label: "Wallet Address", type: "text", required: true },
        { name: "amount", label: "Amount", type: "number", placeholder: "0.001" },
        { name: "label", label: "Label", type: "text" },
    ],

    instagram: [
        { name: "username", label: "Instagram Username", type: "text", required: true, placeholder: "username" },
    ],

    facebook: [
        { name: "url", label: "Facebook URL", type: "url", required: true, placeholder: "https://facebook.com/page" },
    ],

    linkedin: [
        { name: "url", label: "LinkedIn URL", type: "url", required: true, placeholder: "https://linkedin.com/in/username" },
    ],

    youtube: [
        { name: "url", label: "YouTube URL", type: "url", required: true, placeholder: "https://youtube.com/@channel" },
    ],

    telegram: [
        { name: "username", label: "Telegram Username", type: "text", required: true, placeholder: "username (without @)" },
    ],

    facebookmessenger: [
        { name: "pageName", label: "Page Name / ID", type: "text", required: true, placeholder: "pageid" },
    ],

    facetime: [
        { name: "contact", label: "Email or Phone", type: "text", required: true, placeholder: "user@icloud.com or +1234567890" },
    ],

    zoom: [
        { name: "meetingUrl", label: "Meeting URL", type: "url", required: true, placeholder: "https://zoom.us/j/123456" },
    ],

    viber: [
        { name: "phone", label: "Phone Number", type: "tel", required: true, placeholder: "+1234567890" },
    ],

    x: [
        { name: "username", label: "X (Twitter) Username", type: "text", required: true, placeholder: "username (without @)" },
    ],

    googlemaps: [
        { name: "url", label: "Google Maps URL", type: "url", required: true, placeholder: "https://maps.google.com/..." },
    ],

    snapchat: [
        { name: "username", label: "Snapchat Username", type: "text", required: true, placeholder: "username" },
    ],

    spotify: [
        { name: "url", label: "Spotify URL", type: "url", required: true, placeholder: "https://open.spotify.com/..." },
    ],

    tiktok: [
        { name: "username", label: "TikTok Username", type: "text", required: true, placeholder: "@username" },
    ],

    upi: [
        { name: "vpa", label: "UPI VPA / ID", type: "text", required: true, placeholder: "user@upi" },
        { name: "payeeName", label: "Payee Name", type: "text", required: true },
        { name: "amount", label: "Amount", type: "number", placeholder: "100" },
        { name: "currency", label: "Currency", type: "text", placeholder: "INR" },
    ],

    brazilpix: [
        { name: "key", label: "PIX Key", type: "text", required: true, placeholder: "CPF, email, phone, or random" },
        { name: "receiverName", label: "Receiver Name", type: "text", required: true },
        { name: "city", label: "City", type: "text", required: true },
        { name: "amount", label: "Amount (BRL)", type: "number" },
    ],

    // ── Dynamic types ─────────────────────────────────────

    url: [
        { name: "url", label: "Website URL", type: "url", required: true, placeholder: "https://example.com" },
    ],

    "vcard-plus": [
        { name: "firstName", label: "First Name", type: "text", required: true },
        { name: "lastName", label: "Last Name", type: "text", required: true },
        { name: "phones", label: "Phone", type: "tel", required: true },
        { name: "emails", label: "Email", type: "email" },
        { name: "whatsapp_number", label: "WhatsApp Number", type: "tel" },
        { name: "company", label: "Organization", type: "text" },
        { name: "job", label: "Job Title", type: "text" },
        { name: "website_list", label: "Website", type: "url" },
        { name: "street", label: "Street", type: "text" },
        { name: "city", label: "City", type: "text" },
        { name: "zip", label: "Zip", type: "text" },
        { name: "state", label: "State", type: "text" },
        { name: "country", label: "Country", type: "text" },
        { name: "bio", label: "Bio / Summary", type: "textarea", placeholder: "Brief bio..." },
    ],

    "business-profile": [
        { name: "businessName", label: "Business Name", type: "text", required: true },
        { name: "phone", label: "Phone", type: "tel" },
        { name: "email", label: "Email", type: "email" },
        { name: "website", label: "Website", type: "url" },
        { name: "address", label: "Address", type: "textarea" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "openingHours", label: "Opening Hours", type: "text", placeholder: "Mon-Fri: 9am-5pm" },
    ],

    whatsapp: [
        { name: "mobile_number", label: "WhatsApp Number", type: "tel", required: true, placeholder: "+1234567890" },
        { name: "message", label: "Pre-filled Message", type: "textarea", placeholder: "Hello!" },
    ],

    "restaurant-menu": [
        { name: "restaurantName", label: "Restaurant Name", type: "text", required: true },
        { name: "phone", label: "Phone", type: "tel" },
        { name: "website", label: "Website", type: "url" },
        { name: "description", label: "Description", type: "textarea" },
    ],

    "product-catalogue": [
        { name: "businessName", label: "Business Name", type: "text", required: true },
        { name: "description", label: "Description", type: "textarea" },
        { name: "website", label: "Website", type: "url" },
    ],

    biolinks: [
        { name: "title", label: "Page Title", type: "text", required: true, placeholder: "My Links" },
        { name: "bio", label: "Bio", type: "textarea", placeholder: "Brief description about you" },
    ],

    "business-review": [
        { name: "businessName", label: "Business Name", type: "text", required: true },
        { name: "reviewUrl", label: "Review URL", type: "url", placeholder: "https://g.page/..." },
    ],

    "website-builder": [
        { name: "title", label: "Page Title", type: "text", required: true },
        { name: "description", label: "Description", type: "textarea" },
    ],

    "lead-form": [
        { name: "formTitle", label: "Form Title", type: "text", required: true },
        { name: "description", label: "Description", type: "textarea" },
        { name: "successMessage", label: "Success Message", type: "text", placeholder: "Thank you for submitting!" },
    ],

    "app-download": [
        { name: "appName", label: "App Name", type: "text", required: true },
        { name: "appStoreUrl", label: "App Store URL", type: "url", placeholder: "https://apps.apple.com/..." },
        { name: "playStoreUrl", label: "Play Store URL", type: "url", placeholder: "https://play.google.com/..." },
        { name: "description", label: "Description", type: "textarea" },
    ],

    "google-review": [
        { name: "placeId", label: "Google Place ID / URL", type: "text", required: true, placeholder: "Place ID or Google Maps review URL" },
    ],

    resume: [
        { name: "fullName", label: "Full Name", type: "text", required: true },
        { name: "title", label: "Job Title", type: "text", required: true },
        { name: "phone", label: "Phone", type: "tel" },
        { name: "email", label: "Email", type: "email" },
        { name: "website", label: "Portfolio URL", type: "url" },
        { name: "summary", label: "Summary", type: "textarea" },
    ],

    "file-upload": [
        { name: "title", label: "File Title", type: "text", required: true },
        { name: "description", label: "Description", type: "textarea" },
    ],

    event: [
        { name: "eventName", label: "Event Name", type: "text", required: true },
        { name: "location", label: "Location", type: "text" },
        { name: "startDate", label: "Start Date", type: "text", placeholder: "YYYY-MM-DD HH:MM" },
        { name: "endDate", label: "End Date", type: "text", placeholder: "YYYY-MM-DD HH:MM" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "url", label: "Event URL", type: "url" },
    ],

    "email-dynamic": [
        { name: "email", label: "Email Address", type: "email", required: true },
        { name: "subject", label: "Subject", type: "text" },
        { name: "body", label: "Message", type: "textarea" },
    ],

    "sms-dynamic": [
        { name: "phone", label: "Phone Number", type: "tel", required: true },
        { name: "message", label: "Message", type: "textarea" },
    ],

    paypal: [
        { name: "email", label: "PayPal Email", type: "email", required: true },
        { name: "amount", label: "Amount", type: "number", placeholder: "10.00" },
        { name: "currency", label: "Currency", type: "text", placeholder: "USD" },
        { name: "description", label: "Item Description", type: "text" },
    ],

    "upi-dynamic": [
        { name: "vpa", label: "UPI VPA / ID", type: "text", required: true, placeholder: "user@upi" },
        { name: "payeeName", label: "Payee Name", type: "text", required: true },
        { name: "amount", label: "Amount", type: "number" },
        { name: "currency", label: "Currency", type: "text", placeholder: "INR" },
    ],

    "image-gallery": [
        { name: "title", label: "Gallery Title", type: "text", required: true },
        { name: "description", label: "Description", type: "textarea" },
    ],

    video: [
        { name: "video_url", label: "Video URL", type: "url", required: true, placeholder: "https://youtube.com/watch?v=..." },
        { name: "title", label: "Title", type: "text" },
        { name: "description", label: "Description", type: "textarea" },
    ],

    "social-media": [
        { name: "title", label: "Page Title", type: "text", required: true, placeholder: "Follow me on social media" },
        { name: "bio", label: "Bio", type: "textarea" },
    ],
};

/**
 * Get the form fields for a given QR type ID.
 * Falls back to a generic "data" text field if unknown.
 */
export function getFieldsForType(typeId: string): FieldDefinition[] {
    return qrTypeFields[typeId] || [
        { name: "data", label: "Data", type: "text", required: true, placeholder: "Enter content..." },
    ];
}
