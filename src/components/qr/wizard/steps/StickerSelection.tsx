"use client";

import { useQRWizard } from "@/store/use-qr-wizard";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const STICKERS = ['none', 'scan-me', 'offer', 'website', 'social'];

export default function StickerSelection() {
  const { sticker, updateSticker } = useQRWizard();

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Add a Sticker</h2>

      {/* Sticker Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {STICKERS.map((id) => (
          <button
            key={id}
            onClick={() => updateSticker({ id })}
            className={cn(
              "aspect-[4/3] rounded-lg border-2 flex flex-col items-center justify-center gap-2 transition-all hover:bg-gray-50",
              sticker.id === id ? "border-primary bg-primary/5" : "border-gray-200"
            )}
          >
            <div className="w-12 h-8 bg-gray-200 rounded" />
            <span className="text-xs capitalize">{id}</span>
          </button>
        ))}
      </div>

      {/* Sticker Customization */}
      {sticker.id !== 'none' && (
        <div className="space-y-6 pt-6 border-t animate-in fade-in slide-in-from-top-4">
          <div className="space-y-2">
            <Label htmlFor="sticker-text">Sticker Text</Label>
            <Input 
              id="sticker-text" 
              value={sticker.text} 
              onChange={(e) => updateSticker({ text: e.target.value })}
              placeholder="SCAN ME"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch 
              id="sticker-shadow" 
              checked={sticker.shadow}
              onCheckedChange={(checked) => updateSticker({ shadow: checked })}
            />
            <Label htmlFor="sticker-shadow">Drop Shadow</Label>
          </div>
        </div>
      )}
    </div>
  );
}
