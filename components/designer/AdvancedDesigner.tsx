'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Download, Upload, RotateCcw, Palette, Shapes, Image as ImageIcon, Settings, Sparkles } from 'lucide-react';
import GradientEditor from './GradientEditor';
import PatternLibrary from './PatternLibrary';
import ShapeLibrary from './ShapeLibrary';
import { QRCodeSVG } from 'qrcode.react';

export interface QRDesign {
  // Colors
  foregroundColor: string;
  backgroundColor: string;
  gradient?: {
    type: 'linear' | 'radial' | 'none';
    colors: Array<{ color: string; position: number }>;
    angle?: number;
  };
  
  // Shapes
  moduleShape: 'square' | 'rounded' | 'dots' | 'hearts' | 'stars' | 'custom';
  moduleSize: number;
  moduleSpacing: number;
  
  // Pattern
  pattern?: {
    type: 'dots' | 'squares' | 'custom' | 'none';
    color: string;
    density: number;
    customImage?: string;
  };
  
  // Logo
  logo?: {
    url: string;
    size: number;
    padding: number;
    backgroundColor?: string;
  };
  
  // Advanced
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  quietZone: number;
  roundedCorners: boolean;
  cornerRadius: number;
}

interface AdvancedDesignerProps {
  design: QRDesign;
  onChange: (design: QRDesign) => void;
  qrData: string;
}

const defaultDesign: QRDesign = {
  foregroundColor: '#000000',
  backgroundColor: '#ffffff',
  moduleShape: 'square',
  moduleSize: 4,
  moduleSpacing: 0,
  errorCorrectionLevel: 'M',
  quietZone: 4,
  roundedCorners: false,
  cornerRadius: 0,
};

const designPresets = [
  {
    name: 'Classic',
    design: { ...defaultDesign },
  },
  {
    name: 'Modern',
    design: {
      ...defaultDesign,
      moduleShape: 'rounded' as const,
      gradient: {
        type: 'linear' as const,
        colors: [
          { color: '#667eea', position: 0 },
          { color: '#764ba2', position: 100 },
        ],
        angle: 45,
      },
    },
  },
  {
    name: 'Elegant',
    design: {
      ...defaultDesign,
      moduleShape: 'dots' as const,
      foregroundColor: '#2d3748',
      backgroundColor: '#f7fafc',
      roundedCorners: true,
      cornerRadius: 8,
    },
  },
  {
    name: 'Vibrant',
    design: {
      ...defaultDesign,
      gradient: {
        type: 'radial' as const,
        colors: [
          { color: '#f093fb', position: 0 },
          { color: '#f5576c', position: 100 },
        ],
      },
    },
  },
];

export default function AdvancedDesigner({ design, onChange, qrData }: AdvancedDesignerProps) {
  const [activeTab, setActiveTab] = useState('colors');

  const handleExport = () => {
    const dataStr = JSON.stringify(design, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'qr-design.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedDesign = JSON.parse(e.target?.result as string);
          onChange({ ...design, ...importedDesign });
        } catch (error) {
          console.error('Invalid design file:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleReset = () => {
    onChange(defaultDesign);
  };

  const applyPreset = (preset: QRDesign) => {
    onChange(preset);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Designer Panel */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Advanced QR Designer</CardTitle>
                <CardDescription>Customize every aspect of your QR code</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <label htmlFor="import-design">
                  <span className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                  </span>
                  <input
                    id="import-design"
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleImport}
                  />
                </label>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Design Presets */}
            <div className="mb-6">
              <Label className="mb-3 block">Quick Presets</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {designPresets.map((preset) => (
                  <Button
                    key={preset.name}
                    variant="outline"
                    className="h-auto py-3"
                    onClick={() => applyPreset(preset.design)}
                  >
                    {preset.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Tabbed Interface */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-5 w-full">
                <TabsTrigger value="colors">
                  <Palette className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Colors</span>
                </TabsTrigger>
                <TabsTrigger value="shapes">
                  <Shapes className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Shapes</span>
                </TabsTrigger>
                <TabsTrigger value="logo">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Logo</span>
                </TabsTrigger>
                <TabsTrigger value="advanced">
                  <Settings className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Advanced</span>
                </TabsTrigger>
                <TabsTrigger value="ai">
                  <Sparkles className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">AI</span>
                </TabsTrigger>
              </TabsList>

              {/* Colors Tab */}
              <TabsContent value="colors" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="foreground">Foreground Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="foreground"
                          type="color"
                          value={design.foregroundColor}
                          onChange={(e) =>
                            onChange({ ...design, foregroundColor: e.target.value })
                          }
                          className="h-10 w-20"
                        />
                        <Input
                          type="text"
                          value={design.foregroundColor}
                          onChange={(e) =>
                            onChange({ ...design, foregroundColor: e.target.value })
                          }
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="background">Background Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="background"
                          type="color"
                          value={design.backgroundColor}
                          onChange={(e) =>
                            onChange({ ...design, backgroundColor: e.target.value })
                          }
                          className="h-10 w-20"
                        />
                        <Input
                          type="text"
                          value={design.backgroundColor}
                          onChange={(e) =>
                            onChange({ ...design, backgroundColor: e.target.value })
                          }
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <Label className="mb-3 block">Gradient Settings</Label>
                    <GradientEditor
                      gradient={design.gradient}
                      onChange={(gradient) => onChange({ ...design, gradient })}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Shapes Tab */}
              <TabsContent value="shapes" className="space-y-6 mt-6">
                <ShapeLibrary
                  selectedShape={design.moduleShape}
                  moduleSize={design.moduleSize}
                  moduleSpacing={design.moduleSpacing}
                  onChange={(shape, size, spacing) =>
                    onChange({
                      ...design,
                      moduleShape: shape,
                      moduleSize: size ?? design.moduleSize,
                      moduleSpacing: spacing ?? design.moduleSpacing,
                    })
                  }
                />
                <PatternLibrary
                  selectedPattern={design.pattern}
                  onChange={(pattern) => onChange({ ...design, pattern })}
                />
              </TabsContent>

              {/* Logo Tab */}
              <TabsContent value="logo" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="logo-url">Logo URL</Label>
                    <Input
                      id="logo-url"
                      type="url"
                      placeholder="https://example.com/logo.png"
                      value={design.logo?.url || ''}
                      onChange={(e) =>
                        onChange({
                          ...design,
                          logo: { ...design.logo, url: e.target.value, size: design.logo?.size || 60, padding: design.logo?.padding || 10 },
                        })
                      }
                    />
                  </div>
                  {design.logo?.url && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="logo-size">Logo Size: {design.logo.size}px</Label>
                        <Input
                          id="logo-size"
                          type="range"
                          min="20"
                          max="100"
                          value={design.logo.size}
                          onChange={(e) =>
                            onChange({
                              ...design,
                              logo: { ...design.logo!, size: parseInt(e.target.value) },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="logo-padding">Logo Padding: {design.logo.padding}px</Label>
                        <Input
                          id="logo-padding"
                          type="range"
                          min="0"
                          max="20"
                          value={design.logo.padding}
                          onChange={(e) =>
                            onChange({
                              ...design,
                              logo: { ...design.logo!, padding: parseInt(e.target.value) },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="logo-bg">Logo Background (optional)</Label>
                        <div className="flex gap-2">
                          <Input
                            id="logo-bg"
                            type="color"
                            value={design.logo.backgroundColor || '#ffffff'}
                            onChange={(e) =>
                              onChange({
                                ...design,
                                logo: { ...design.logo!, backgroundColor: e.target.value },
                              })
                            }
                            className="h-10 w-20"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const { backgroundColor, ...rest } = design.logo!;
                              onChange({ ...design, logo: rest });
                            }}
                          >
                            Clear
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </TabsContent>

              {/* Advanced Tab */}
              <TabsContent value="advanced" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="error-correction">Error Correction Level</Label>
                    <select
                      id="error-correction"
                      value={design.errorCorrectionLevel}
                      onChange={(e) =>
                        onChange({
                          ...design,
                          errorCorrectionLevel: e.target.value as 'L' | 'M' | 'Q' | 'H',
                        })
                      }
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="L">Low (7%)</option>
                      <option value="M">Medium (15%)</option>
                      <option value="Q">Quartile (25%)</option>
                      <option value="H">High (30%)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quiet-zone">Quiet Zone: {design.quietZone}px</Label>
                    <Input
                      id="quiet-zone"
                      type="range"
                      min="0"
                      max="20"
                      value={design.quietZone}
                      onChange={(e) =>
                        onChange({ ...design, quietZone: parseInt(e.target.value) })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="rounded-corners"
                        checked={design.roundedCorners}
                        onChange={(e) =>
                          onChange({ ...design, roundedCorners: e.target.checked })
                        }
                        className="w-4 h-4"
                      />
                      <Label htmlFor="rounded-corners">Rounded Corners</Label>
                    </div>
                  </div>
                  {design.roundedCorners && (
                    <div className="space-y-2">
                      <Label htmlFor="corner-radius">Corner Radius: {design.cornerRadius}px</Label>
                      <Input
                        id="corner-radius"
                        type="range"
                        min="0"
                        max="20"
                        value={design.cornerRadius}
                        onChange={(e) =>
                          onChange({ ...design, cornerRadius: parseInt(e.target.value) })
                        }
                      />
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* AI Tab */}
              <TabsContent value="ai" className="space-y-6 mt-6">
                <div className="text-center py-12">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">AI-Powered Design</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Coming soon: Generate unique QR designs with AI
                  </p>
                  <Button disabled>
                    Generate with AI
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Live Preview Panel */}
      <div className="lg:col-span-1">
        <Card className="sticky top-4">
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
            <CardDescription>See your changes in real-time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 flex items-center justify-center">
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <QRCodeSVG
                  value={qrData || 'https://karsaaz.com'}
                  size={200}
                  bgColor={design.backgroundColor}
                  fgColor={design.foregroundColor}
                  level={design.errorCorrectionLevel}
                  imageSettings={
                    design.logo?.url
                      ? {
                          src: design.logo.url,
                          height: design.logo.size,
                          width: design.logo.size,
                          excavate: true,
                        }
                      : undefined
                  }
                />
              </div>
            </div>
            <div className="mt-4 space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Shape:</span>
                <span className="font-medium text-foreground capitalize">{design.moduleShape}</span>
              </div>
              <div className="flex justify-between">
                <span>Colors:</span>
                <div className="flex gap-1">
                  <div
                    className="w-4 h-4 rounded border"
                    style={{ backgroundColor: design.foregroundColor }}
                  />
                  <div
                    className="w-4 h-4 rounded border"
                    style={{ backgroundColor: design.backgroundColor }}
                  />
                </div>
              </div>
              {design.gradient && design.gradient.type !== 'none' && (
                <div className="flex justify-between">
                  <span>Gradient:</span>
                  <span className="font-medium text-foreground capitalize">{design.gradient.type}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
