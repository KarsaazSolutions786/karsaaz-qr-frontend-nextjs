"use client";

import { useQRWizard } from "@/store/use-qr-wizard";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";

export default function ColorSelection() {
  const { design, updateDesign } = useQRWizard();

  const handleColorChange = (section: 'background' | 'dots' | 'corners' | 'frame', key: string, value: string) => {
    // @ts-ignore - dynamic key access
    updateDesign({ [section]: { ...design[section], [key]: value } });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Customize Colors</h2>
      
      <Tabs defaultValue="background" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="background">Background</TabsTrigger>
          <TabsTrigger value="foreground">Foreground</TabsTrigger>
          <TabsTrigger value="eyes">Eyes</TabsTrigger>
          <TabsTrigger value="frame">Frame</TabsTrigger>
        </TabsList>

        {/* Background Settings */}
        <TabsContent value="background" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label>Color Type</Label>
              <div className="flex gap-2">
                {['solid', 'gradient', 'image'].map((type) => (
                  <button
                    key={type}
                    onClick={() => handleColorChange('background', 'type', type)}
                    className={`px-4 py-2 rounded-md text-sm capitalize border ${
                      design.background.type === type 
                        ? 'bg-primary text-white border-primary' 
                        : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Label>Background Color</Label>
              <div className="flex gap-3">
                <Input 
                  type="color" 
                  value={design.background.color}
                  className="w-12 h-12 p-1 cursor-pointer"
                  onChange={(e) => handleColorChange('background', 'color', e.target.value)}
                />
                <Input 
                  type="text" 
                  value={design.background.color}
                  className="flex-1"
                  onChange={(e) => handleColorChange('background', 'color', e.target.value)}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Foreground (Dots) Settings */}
        <TabsContent value="foreground" className="space-y-6">
          <div className="space-y-4">
            <Label>Dots Color</Label>
            <div className="flex gap-3">
              <Input 
                type="color" 
                value={design.dots.color}
                className="w-12 h-12 p-1 cursor-pointer"
                onChange={(e) => handleColorChange('dots', 'color', e.target.value)}
              />
              <Input 
                type="text" 
                value={design.dots.color}
                className="flex-1"
                onChange={(e) => handleColorChange('dots', 'color', e.target.value)}
              />
            </div>
          </div>
        </TabsContent>

        {/* Eyes (Corners) Settings */}
        <TabsContent value="eyes" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label>External Eye Color</Label>
              <div className="flex gap-3">
                <Input 
                  type="color" 
                  value={design.corners.squareColor}
                  className="w-12 h-12 p-1 cursor-pointer"
                  onChange={(e) => handleColorChange('corners', 'squareColor', e.target.value)}
                />
                <Input 
                  type="text" 
                  value={design.corners.squareColor}
                  className="flex-1"
                  onChange={(e) => handleColorChange('corners', 'squareColor', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label>Internal Dot Color</Label>
              <div className="flex gap-3">
                <Input 
                  type="color" 
                  value={design.corners.dotColor}
                  className="w-12 h-12 p-1 cursor-pointer"
                  onChange={(e) => handleColorChange('corners', 'dotColor', e.target.value)}
                />
                <Input 
                  type="text" 
                  value={design.corners.dotColor}
                  className="flex-1"
                  onChange={(e) => handleColorChange('corners', 'dotColor', e.target.value)}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Frame Settings */}
        <TabsContent value="frame" className="space-y-6">
          <div className="space-y-4">
            <Label>Frame Color</Label>
            <div className="flex gap-3">
              <Input 
                type="color" 
                value={design.frame.color}
                className="w-12 h-12 p-1 cursor-pointer"
                onChange={(e) => handleColorChange('frame', 'color', e.target.value)}
              />
              <Input 
                type="text" 
                value={design.frame.color}
                className="flex-1"
                onChange={(e) => handleColorChange('frame', 'color', e.target.value)}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
