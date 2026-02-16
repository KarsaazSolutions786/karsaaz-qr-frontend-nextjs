import {
    AlignLeft,
    Briefcase,
    Clock,
    CloudRain,
    Code,
    CreditCard,
    Divide,
    Download,
    FileText,
    Grid,
    Image,
    Link,
    List,
    LucideIcon,
    Mail,
    MapPin,
    MessageSquare,
    Music,
    Phone,
    Rss,
    Share2,
    Twitch,
    Type,
    UserCircle,
    Video,
    Youtube
} from "lucide-react";

export type BiolinkBlockType =
    | "link"
    | "heading"
    | "paragraph"
    | "image"
    | "avatar"
    | "socials"
    | "email"
    | "phone"
    | "location"
    | "youtube"
    | "instagram"
    | "facebook"
    | "spotify"
    | "tiktok"
    | "faq"
    | "event"
    | "vcard"
    | "divider"
    | "audio"
    | "video"
    | "file"
    | "image_grid"
    | "list"
    | "opening_hours"
    | "upi"
    | "paypal"
    | "custom_code"
    | "lead_form"
    | "share"
    | "table"
    | "table"
    | "alert"
    | "rss"
    | "soundcloud"
    | "twitch";

export interface BiolinkBlock {
    id: string;
    type: BiolinkBlockType;
    content: Record<string, any>;
    settings: {
        visible: boolean;
        animation?: string;
        textColor?: string;
        bgColor?: string;
        borderRadius?: string;
        colSpan?: number; // For grid layouts if we implement them
    };
}

export interface BiolinkDefinition {
    type: BiolinkBlockType;
    label: string;
    icon: LucideIcon;
    description: string;
}

export const biolinkBlockDefinitions: BiolinkDefinition[] = [
    { type: "link", label: "Link", icon: Link, description: "Add a button with a link" },
    { type: "heading", label: "Heading", icon: Type, description: "Add a title or section header" },
    { type: "paragraph", label: "Paragraph", icon: AlignLeft, description: "Add a block of text" },
    { type: "avatar", label: "Avatar", icon: UserCircle, description: "Display a profile picture" },
    { type: "socials", label: "Socials", icon: Share2, description: "Display social media links" },
    { type: "image", label: "Image", icon: Image, description: "Display a single image" },
    { type: "image_grid", label: "Image Grid", icon: Grid, description: "Display a grid of images" },
    { type: "video", label: "Video", icon: Video, description: "Embed a video file or URL" },
    { type: "youtube", label: "YouTube", icon: Youtube, description: "Embed a YouTube video" },
    { type: "spotify", label: "Spotify", icon: Music, description: "Embed a Spotify track/playlist" },
    { type: "audio", label: "Audio", icon: Music, description: "Embed an audio file" },
    { type: "file", label: "File", icon: Download, description: "Allow users to download a file" },
    { type: "vcard", label: "VCard", icon: Briefcase, description: "Add a 'Save Contact' button" },
    { type: "faq", label: "FAQ", icon: MessageSquare, description: "Collapsible Q&A list" },
    { type: "list", label: "List", icon: List, description: "Bullet or numbered list" },
    { type: "table", label: "Table", icon: Grid, description: "Display data in a table" },
    { type: "opening_hours", label: "Hours", icon: Clock, description: "Display business hours" },
    { type: "location", label: "Location", icon: MapPin, description: "Display a map location" },
    { type: "divider", label: "Divider", icon: Divide, description: "Visual separator line" },
    { type: "custom_code", label: "Custom Code", icon: Code, description: "Embed custom HTML/JS" },
    { type: "lead_form", label: "Lead Form", icon: FileText, description: "Collect user data" },
    { type: "upi", label: "UPI", icon: CreditCard, description: "Accept UPI payments" },
    { type: "paypal", label: "PayPal", icon: CreditCard, description: "Accept PayPal payments" },
    { type: "email", label: "Email Btn", icon: Mail, description: "Button to send an email" },
    { type: "phone", label: "Call Btn", icon: Phone, description: "Button to make a call" },
    { type: "share", label: "Share", icon: Share2, description: "Button to share this page" },
    { type: "alert", label: "Alert", icon: MessageSquare, description: "Display an alert message" },
    { type: "rss", label: "RSS Feed", icon: Rss, description: "Embed an RSS feed" },
    { type: "soundcloud", label: "SoundCloud", icon: CloudRain, description: "Embed SoundCloud audio" },
    { type: "twitch", label: "Twitch", icon: Twitch, description: "Embed Twitch stream/video" },
];
