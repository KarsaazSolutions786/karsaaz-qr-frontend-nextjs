"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useFormContext } from "react-hook-form";
import { FieldDefinition, QRFormBuilder } from "../QRFormBuilder";
import { biolinkBlockDefinitions } from "./types";

interface BlockEditorProps {
    blockIndex: number | null;
    onClose: () => void;
}

export function BlockEditor({ blockIndex, onClose }: BlockEditorProps) {
    const { watch, setValue, getValues } = useFormContext<{ data: { blocks: any[] } }>(); // Explicit any for blocks to avoid circular deps for now, or use BiolinkBlock
    const blocks = watch("data.blocks");
    const block = blockIndex !== null ? blocks?.[blockIndex] : null;
    const def = block ? biolinkBlockDefinitions.find(d => d.type === block.type) : null;

    if (blockIndex === null || !block || !def) return null;

    const getFieldsForBlock = (type: string): FieldDefinition[] => {
        const prefix = `data.blocks.${blockIndex}.content`;

        switch (type) {
            case "link":
                return [
                    { name: `${prefix}.label`, label: "Button Label", type: "text", required: true, placeholder: "My Website" },
                    { name: `${prefix}.url`, label: "Destination URL", type: "url", required: true, placeholder: "https://example.com" },
                    { name: `${prefix}.icon`, label: "Icon Class", type: "text", placeholder: "fa-solid fa-globe (optional)" },
                    { name: `${prefix}.outline`, label: "Outline Style", type: "boolean" },
                ];
            case "heading":
                return [
                    { name: `${prefix}.text`, label: "Heading Text", type: "text", required: true, placeholder: "My Section" },
                    { name: `${prefix}.subtext`, label: "Subtext", type: "text", placeholder: "Optional description" },
                ];
            case "paragraph":
                return [
                    { name: `${prefix}.text`, label: "Paragraph Content", type: "textarea", required: true, placeholder: "Enter your text..." },
                ];
            case "image":
                return [
                    { name: `${prefix}.image`, label: "Upload Image", type: "image", required: true },
                    { name: `${prefix}.alt`, label: "Alt Text", type: "text", placeholder: "Image description" },
                    { name: `${prefix}.link`, label: "Link URL (Optional)", type: "url", placeholder: "https://..." },
                ];
            case "avatar":
                return [
                    { name: `${prefix}.image`, label: "Profile Picture", type: "image", required: true },
                    { name: `${prefix}.size`, label: "Size (px)", type: "number", placeholder: "100" },
                    {
                        name: `${prefix}.radius`, label: "Radius / Shape", type: "select", options: [
                            { label: "Circle", value: "rounded-full" },
                            { label: "Rounded Square", value: "rounded-lg" },
                            { label: "Square", value: "rounded-none" },
                        ]
                    },
                ];
            case "socials":
                return [
                    { name: `${prefix}.facebook`, label: "Facebook URL", type: "url", placeholder: "https://facebook.com/..." },
                    { name: `${prefix}.instagram`, label: "Instagram URL", type: "url", placeholder: "https://instagram.com/..." },
                    { name: `${prefix}.twitter`, label: "X (Twitter) URL", type: "url", placeholder: "https://x.com/..." },
                    { name: `${prefix}.linkedin`, label: "LinkedIn URL", type: "url", placeholder: "https://linkedin.com/in/..." },
                    { name: `${prefix}.tiktok`, label: "TikTok URL", type: "url", placeholder: "https://tiktok.com/@..." },
                    { name: `${prefix}.youtube`, label: "YouTube URL", type: "url", placeholder: "https://youtube.com/..." },
                    { name: `${prefix}.whatsapp`, label: "WhatsApp Number", type: "tel", placeholder: "Phone number with country code" },
                    { name: `${prefix}.email`, label: "Email Address", type: "email", placeholder: "mailto:..." },
                ];
            case "youtube":
            case "video":
                return [
                    { name: `${prefix}.url`, label: "Video URL", type: "url", required: true, placeholder: "https://youtube.com/watch?v=..." },
                    { name: `${prefix}.autoplay`, label: "Autoplay", type: "boolean" },
                ];
            case "audio":
            case "spotify":
                return [
                    { name: `${prefix}.url`, label: "Audio/Spotify URL", type: "url", required: true },
                    { name: `${prefix}.autoplay`, label: "Autoplay", type: "boolean" },
                ];
            case "file":
                return [
                    { name: `${prefix}.file`, label: "Upload File", type: "image", required: true }, // Using image for generic upload for now
                    { name: `${prefix}.label`, label: "Button Label", type: "text", required: true, placeholder: "Download PDF" },
                ];
            case "faq":
                return [
                    {
                        name: `${prefix}.items`,
                        label: "FAQ Items",
                        type: "array",
                        addButtonLabel: "Add Question",
                        itemFields: [
                            { name: "question", label: "Question", type: "text", required: true },
                            { name: "answer", label: "Answer", type: "textarea", required: true },
                        ]
                    }
                ];
            case "list":
                return [
                    {
                        name: `${prefix}.items`,
                        label: "List Items",
                        type: "array",
                        addButtonLabel: "Add Item",
                        itemFields: [
                            { name: "text", label: "Text", type: "text", required: true },
                            { name: "icon", label: "Icon Class", type: "text" },
                        ]
                    }
                ];
            case "image_grid":
                return [
                    {
                        name: `${prefix}.images`,
                        label: "Images",
                        type: "array",
                        addButtonLabel: "Add Image",
                        itemFields: [
                            { name: "image", label: "Image", type: "image", required: true },
                            { name: "link", label: "Link (Optional)", type: "url" },
                        ]
                    },
                    { name: `${prefix}.columns`, label: "Columns", type: "number", placeholder: "3" }
                ];
            case "vcard":
                return [
                    { name: `${prefix}.firstName`, label: "First Name", type: "text", required: true },
                    { name: `${prefix}.lastName`, label: "Last Name", type: "text", required: true },
                    { name: `${prefix}.phone`, label: "Phone", type: "tel" },
                    { name: `${prefix}.email`, label: "Email", type: "email" },
                    { name: `${prefix}.website`, label: "Website", type: "url" },
                    { name: `${prefix}.company`, label: "Company", type: "text" },
                    { name: `${prefix}.job`, label: "Job Title", type: "text" },
                    { name: `${prefix}.address`, label: "Address", type: "textarea" },
                    { name: `${prefix}.note`, label: "Note", type: "textarea" },
                    { name: `${prefix}.avatar`, label: "Photo", type: "image" },
                ];
            case "opening_hours":
                return [
                    { name: `${prefix}.monday`, label: "Monday", type: "text", placeholder: "9:00 AM - 5:00 PM / Closed" },
                    { name: `${prefix}.tuesday`, label: "Tuesday", type: "text", placeholder: "9:00 AM - 5:00 PM / Closed" },
                    { name: `${prefix}.wednesday`, label: "Wednesday", type: "text", placeholder: "9:00 AM - 5:00 PM / Closed" },
                    { name: `${prefix}.thursday`, label: "Thursday", type: "text", placeholder: "9:00 AM - 5:00 PM / Closed" },
                    { name: `${prefix}.friday`, label: "Friday", type: "text", placeholder: "9:00 AM - 5:00 PM / Closed" },
                    { name: `${prefix}.saturday`, label: "Saturday", type: "text", placeholder: "9:00 AM - 5:00 PM / Closed" },
                    { name: `${prefix}.sunday`, label: "Sunday", type: "text", placeholder: "9:00 AM - 5:00 PM / Closed" },
                ];
            case "location":
                return [
                    { name: `${prefix}.address`, label: "Address", type: "textarea", required: true },
                    { name: `${prefix}.mapUrl`, label: "Google Maps Embed URL", type: "url", placeholder: "https://www.google.com/maps/embed?..." },
                ];
            case "custom_code":
                return [
                    { name: `${prefix}.html`, label: "HTML Code", type: "textarea", required: true, placeholder: "<div>...</div>" },
                ];
            case "lead_form":
                return [
                    { name: `${prefix}.email`, label: "Recipient Email", type: "email", required: true },
                    { name: `${prefix}.title`, label: "Form Title", type: "text", placeholder: "Contact Us" },
                    { name: `${prefix}.fields`, label: "Fields (Comma separated)", type: "text", placeholder: "name, email, phone, message" },
                ];
            case "upi":
                return [
                    { name: `${prefix}.vpa`, label: "UPI ID / VPA", type: "text", required: true },
                    { name: `${prefix}.payeeName`, label: "Payee Name", type: "text", required: true },
                    { name: `${prefix}.amount`, label: "Amount (Optional)", type: "number" },
                ];
            case "paypal":
                return [
                    { name: `${prefix}.email`, label: "PayPal Email", type: "email", required: true },
                    { name: `${prefix}.currency`, label: "Currency", type: "text", placeholder: "USD" },
                    { name: `${prefix}.item`, label: "Item Name", type: "text" },
                    { name: `${prefix}.amount`, label: "Price", type: "number", required: true },
                ];
            case "alert":
                return [
                    { name: `${prefix}.text`, label: "Message", type: "textarea", required: true },
                    {
                        name: `${prefix}.type`, label: "Type", type: "select", options: [
                            { label: "Info", value: "info" },
                            { label: "Success", value: "success" },
                            { label: "Warning", value: "warning" },
                            { label: "Danger", value: "danger" },
                        ]
                    },
                ];
            case "email":
                return [
                    { name: `${prefix}.email`, label: "Email Address", type: "email", required: true },
                    { name: `${prefix}.label`, label: "Button Label", type: "text", placeholder: "Email Me" },
                    { name: `${prefix}.subject`, label: "Default Subject", type: "text" },
                ];
            case "phone":
                return [
                    { name: `${prefix}.phone`, label: "Phone Number", type: "tel", required: true },
                    { name: `${prefix}.label`, label: "Button Label", type: "text", placeholder: "Call Me" },
                ];
            case "share":
                return [
                    { name: `${prefix}.label`, label: "Button Label", type: "text", placeholder: "Share this page" },
                ];
            case "rss":
                return [
                    { name: `${prefix}.url`, label: "RSS Feed URL", type: "url", required: true, placeholder: "https://example.com/feed.xml" },
                ];
            case "soundcloud":
                return [
                    { name: `${prefix}.url`, label: "SoundCloud URL", type: "url", required: true, placeholder: "https://soundcloud.com/..." },
                    { name: `${prefix}.autoplay`, label: "Autoplay", type: "boolean" },
                ];
            case "twitch":
                return [
                    { name: `${prefix}.url`, label: "Twitch Channel/Video URL", type: "url", required: true, placeholder: "https://twitch.tv/..." },
                ];

            case "divider":
                return [
                    {
                        name: `${prefix}.style`, label: "Style", type: "select", options: [
                            { label: "Solid", value: "solid" },
                            { label: "Dashed", value: "dashed" },
                            { label: "Dotted", value: "dotted" },
                        ]
                    },
                    { name: `${prefix}.color`, label: "Color", type: "color" },
                ];

            default:
                // Generic fallback for any other types
                return [
                    { name: `${prefix}.title`, label: "Title", type: "text" },
                    { name: `${prefix}.description`, label: "Description", type: "textarea" },
                    { name: `${prefix}.url`, label: "URL", type: "url" },
                    { name: `${prefix}.data`, label: "Data", type: "textarea" }
                ];
        }
    };

    const fields = getFieldsForBlock(block.type);

    return (
        <Dialog open={true} onClose={onClose} className="max-w-2xl">
            <DialogHeader>
                <DialogTitle>Edit {def.label}</DialogTitle>
            </DialogHeader>

            <div className="py-6 space-y-6 max-h-[70vh] overflow-y-auto px-1">
                <div className="space-y-4">
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Content</h4>
                    <QRFormBuilder fields={fields} />
                </div>

                <div className="space-y-4 border-t pt-4">
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Settings</h4>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor={`settings-visible-${blockIndex}`}>Visible</Label>
                            <Switch
                                id={`settings-visible-${blockIndex}`}
                                checked={block.settings?.visible}
                                onCheckedChange={(checked) => setValue(`data.blocks.${blockIndex}.settings.visible`, checked)}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Text Color</Label>
                                <Input
                                    type="color"
                                    className="h-10 w-full p-1"
                                    {...watch(`data.blocks.${blockIndex}.settings.textColor`)}
                                    onChange={(e) => setValue(`data.blocks.${blockIndex}.settings.textColor`, e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Background Color</Label>
                                <Input
                                    type="color"
                                    className="h-10 w-full p-1"
                                    {...watch(`data.blocks.${blockIndex}.settings.bgColor`)}
                                    onChange={(e) => setValue(`data.blocks.${blockIndex}.settings.bgColor`, e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t sticky bottom-0 bg-background">
                <Button variant="outline" onClick={onClose}>Done</Button>
            </div>

        </Dialog>
    );
}
