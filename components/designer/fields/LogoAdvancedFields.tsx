import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Move, Square, Circle } from 'lucide-react';

interface LogoSettings {
  url?: string;
  file?: File;
  size: number;
  position: 'center' | 'top' | 'bottom' | 'custom';
  x?: number;
  y?: number;
  margin: number;
  padding: number;
  background: 'transparent' | 'solid' | 'blur';
  backgroundColor?: string;
  shape: 'circle' | 'square' | 'rounded' | 'custom';
  borderRadius?: number;
}

interface LogoAdvancedFieldsProps {
  logoSettings: LogoSettings;
  onChange: (settings: LogoSettings) => void;
}

const LogoAdvancedFields: React.FC<LogoAdvancedFieldsProps> = ({
  logoSettings,
  onChange,
}) => {
  const [preview, setPreview] = useState<string>(logoSettings.url || '');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        setPreview(url);
        onChange({ ...logoSettings, url, file });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleUrlChange = (url: string) => {
    setPreview(url);
    onChange({ ...logoSettings, url, file: undefined });
  };

  const handlePositionChange = (position: LogoSettings['position']) => {
    const updates: Partial<LogoSettings> = { position };
    if (position !== 'custom') {
      updates.x = undefined;
      updates.y = undefined;
    }
    onChange({ ...logoSettings, ...updates });
  };

  const getPositionPreview = () => {
    const { position, x, y } = logoSettings;
    const positions = {
      center: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
      top: { top: '10%', left: '50%', transform: 'translateX(-50%)' },
      bottom: { bottom: '10%', left: '50%', transform: 'translateX(-50%)' },
      custom: { top: `${y || 50}%`, left: `${x || 50}%`, transform: 'translate(-50%, -50%)' },
    };
    return positions[position];
  };

  return (
    <div className="space-y-6">
      {/* Logo Upload Section */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Logo Upload
        </label>
        
        {/* Drag and Drop Area */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          {preview ? (
            <div className="relative inline-block">
              <img
                src={preview}
                alt="Logo preview"
                className="max-w-[200px] max-h-[200px] mx-auto rounded-lg shadow-md"
              />
              <button
                onClick={() => {
                  setPreview('');
                  onChange({ ...logoSettings, url: undefined, file: undefined });
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="text-sm text-gray-600">
                <p>Drag and drop your logo here, or</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  browse files
                </button>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, SVG up to 5MB</p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
          />
        </div>

        {/* URL Input */}
        <div className="flex gap-2">
          <input
            type="url"
            placeholder="Or paste image URL"
            value={logoSettings.url || ''}
            onChange={(e) => handleUrlChange(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Upload size={20} />
          </button>
        </div>
      </div>

      {/* Logo Size */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Logo Size: {logoSettings.size}% of QR Code
        </label>
        <input
          type="range"
          min="5"
          max="40"
          value={logoSettings.size}
          onChange={(e) =>
            onChange({ ...logoSettings, size: Number(e.target.value) })
          }
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>5%</span>
          <span>40%</span>
        </div>
      </div>

      {/* Position Selector */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Logo Position
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(['center', 'top', 'bottom', 'custom'] as const).map((pos) => (
            <button
              key={pos}
              onClick={() => handlePositionChange(pos)}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                logoSettings.position === pos
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Move size={16} />
                <span className="capitalize">{pos}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Custom Position Controls */}
        {logoSettings.position === 'custom' && (
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">X Position (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={logoSettings.x || 50}
                onChange={(e) =>
                  onChange({ ...logoSettings, x: Number(e.target.value) })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Y Position (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={logoSettings.y || 50}
                onChange={(e) =>
                  onChange({ ...logoSettings, y: Number(e.target.value) })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Margin & Padding */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Margin: {logoSettings.margin}px
          </label>
          <input
            type="range"
            min="0"
            max="50"
            value={logoSettings.margin}
            onChange={(e) =>
              onChange({ ...logoSettings, margin: Number(e.target.value) })
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Padding: {logoSettings.padding}px
          </label>
          <input
            type="range"
            min="0"
            max="30"
            value={logoSettings.padding}
            onChange={(e) =>
              onChange({ ...logoSettings, padding: Number(e.target.value) })
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      </div>

      {/* Background Style */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Background Style
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['transparent', 'solid', 'blur'] as const).map((bg) => (
            <button
              key={bg}
              onClick={() => onChange({ ...logoSettings, background: bg })}
              className={`px-3 py-2 rounded-lg border-2 transition-all capitalize ${
                logoSettings.background === bg
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {bg}
            </button>
          ))}
        </div>

        {logoSettings.background === 'solid' && (
          <div className="flex items-center gap-2 mt-2">
            <label className="text-sm text-gray-600">Background Color:</label>
            <input
              type="color"
              value={logoSettings.backgroundColor || '#ffffff'}
              onChange={(e) =>
                onChange({ ...logoSettings, backgroundColor: e.target.value })
              }
              className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={logoSettings.backgroundColor || '#ffffff'}
              onChange={(e) =>
                onChange({ ...logoSettings, backgroundColor: e.target.value })
              }
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </div>

      {/* Logo Shape */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Logo Shape
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(['circle', 'square', 'rounded', 'custom'] as const).map((shape) => (
            <button
              key={shape}
              onClick={() => onChange({ ...logoSettings, shape })}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                logoSettings.shape === shape
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                {shape === 'circle' ? <Circle size={16} /> : <Square size={16} />}
                <span className="capitalize">{shape}</span>
              </div>
            </button>
          ))}
        </div>

        {(logoSettings.shape === 'rounded' || logoSettings.shape === 'custom') && (
          <div className="mt-3">
            <label className="block text-sm text-gray-600 mb-2">
              Border Radius: {logoSettings.borderRadius || 0}px
            </label>
            <input
              type="range"
              min="0"
              max="50"
              value={logoSettings.borderRadius || 0}
              onChange={(e) =>
                onChange({ ...logoSettings, borderRadius: Number(e.target.value) })
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        )}
      </div>

      {/* Position Preview */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Position Preview
        </label>
        <div className="relative w-full h-48 bg-gray-100 rounded-lg border-2 border-gray-300 overflow-hidden">
          {/* QR Code Placeholder */}
          <div className="absolute inset-4 bg-white border-2 border-gray-400 rounded" />
          
          {/* Logo Position Indicator */}
          {preview && (
            <div
              className="absolute w-12 h-12 transition-all duration-300"
              style={getPositionPreview()}
            >
              <div
                className={`w-full h-full bg-blue-500 opacity-50 flex items-center justify-center ${
                  logoSettings.shape === 'circle' ? 'rounded-full' : 'rounded'
                }`}
                style={{
                  borderRadius: logoSettings.shape === 'rounded' 
                    ? `${logoSettings.borderRadius || 0}px` 
                    : undefined
                }}
              >
                <ImageIcon size={20} className="text-white" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogoAdvancedFields;
