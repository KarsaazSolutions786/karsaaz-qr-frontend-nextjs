import React, { useState } from 'react';
import { Sparkles, Loader2, RefreshCw, Check, Lightbulb } from 'lucide-react';

interface AIDesign {
  foregroundColor: string;
  backgroundColor: string;
  pattern: string;
  cornerStyle: string;
  dotStyle: string;
  gradient?: {
    type: string;
    colors: string[];
  };
}

interface AIDesignFieldsProps {
  design: Partial<AIDesign>;
  onChange: (design: Partial<AIDesign>) => void;
  onGenerate: (prompt: string, style: string, colorScheme: string) => Promise<AIDesign>;
}

const AIDesignFields: React.FC<AIDesignFieldsProps> = ({
  design: _design,
  onChange,
  onGenerate,
}) => {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('modern');
  const [selectedColorScheme, setSelectedColorScheme] = useState('vibrant');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDesigns, setGeneratedDesigns] = useState<AIDesign[]>([]);
  const [error, setError] = useState<string>('');
  const [showExamples, setShowExamples] = useState(false);

  const styles = [
    { id: 'modern', name: 'Modern', description: 'Clean and contemporary' },
    { id: 'vintage', name: 'Vintage', description: 'Classic and retro' },
    { id: 'minimalist', name: 'Minimalist', description: 'Simple and elegant' },
    { id: 'playful', name: 'Playful', description: 'Fun and creative' },
    { id: 'professional', name: 'Professional', description: 'Business-ready' },
    { id: 'artistic', name: 'Artistic', description: 'Creative and unique' },
  ];

  const colorSchemes = [
    { id: 'monochrome', name: 'Monochrome', preview: ['#000000', '#FFFFFF'] },
    { id: 'vibrant', name: 'Vibrant', preview: ['#FF6B6B', '#4ECDC4', '#FFE66D'] },
    { id: 'pastel', name: 'Pastel', preview: ['#FFB3BA', '#BAE1FF', '#FFFFBA'] },
    { id: 'dark', name: 'Dark', preview: ['#1A1A2E', '#16213E', '#0F3460'] },
    { id: 'light', name: 'Light', preview: ['#F8F9FA', '#E9ECEF', '#DEE2E6'] },
    { id: 'neon', name: 'Neon', preview: ['#FF00FF', '#00FFFF', '#FFFF00'] },
  ];

  const examplePrompts = [
    'Corporate QR code for a tech startup with blue accents',
    'Elegant QR code for a luxury brand with gold details',
    'Fun and colorful QR code for a kids party invitation',
    'Minimalist QR code for a design portfolio',
    'Nature-inspired QR code with green and earth tones',
    'Retro 80s style QR code with neon colors',
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a design description');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const generated = await onGenerate(prompt, selectedStyle, selectedColorScheme);
      setGeneratedDesigns([generated, ...generatedDesigns.slice(0, 2)]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate design');
    } finally {
      setIsGenerating(false);
    }
  };

  const applyDesign = (designToApply: AIDesign) => {
    onChange(designToApply);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
        <Sparkles className="text-purple-600" size={24} />
        <h3 className="text-lg font-semibold text-gray-900">AI Design Generator</h3>
      </div>

      {/* Prompt Input */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            Describe Your Design
          </label>
          <button
            onClick={() => setShowExamples(!showExamples)}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <Lightbulb size={14} />
            {showExamples ? 'Hide' : 'Show'} Examples
          </button>
        </div>
        
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Modern QR code with blue gradient for a tech company..."
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
        />

        {/* Example Prompts */}
        {showExamples && (
          <div className="bg-blue-50 rounded-lg p-4 space-y-2">
            <p className="text-xs font-medium text-blue-900 mb-2">Example Prompts:</p>
            {examplePrompts.map((example, index) => (
              <button
                key={index}
                onClick={() => setPrompt(example)}
                className="block w-full text-left text-sm text-blue-700 hover:text-blue-900 hover:bg-blue-100 px-3 py-2 rounded transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Style Selector */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Design Style
        </label>
        <div className="grid grid-cols-2 gap-2">
          {styles.map((style) => (
            <button
              key={style.id}
              onClick={() => setSelectedStyle(style.id)}
              className={`p-3 rounded-lg border-2 transition-all text-left ${
                selectedStyle === style.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="font-medium text-sm">{style.name}</div>
              <div className="text-xs text-gray-500">{style.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Color Scheme Selector */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Color Scheme
        </label>
        <div className="grid grid-cols-3 gap-2">
          {colorSchemes.map((scheme) => (
            <button
              key={scheme.id}
              onClick={() => setSelectedColorScheme(scheme.id)}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedColorScheme === scheme.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="flex gap-1 mb-2">
                {scheme.preview.map((color, idx) => (
                  <div
                    key={idx}
                    className="flex-1 h-6 rounded"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="text-xs font-medium text-center">{scheme.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating || !prompt.trim()}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
          isGenerating || !prompt.trim()
            ? 'bg-gray-300 cursor-not-allowed text-gray-500'
            : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl'
        }`}
      >
        {isGenerating ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            Generating Design...
          </>
        ) : (
          <>
            <Sparkles size={20} />
            Generate Design
          </>
        )}
      </button>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Generated Designs */}
      {generatedDesigns.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Generated Designs
            </label>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
            >
              <RefreshCw size={14} />
              Regenerate
            </button>
          </div>

          <div className="space-y-2">
            {generatedDesigns.map((generatedDesign, index) => (
              <div
                key={index}
                className="border-2 border-gray-300 rounded-lg p-4 hover:border-purple-400 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      <div
                        className="w-8 h-8 rounded border border-gray-300"
                        style={{ backgroundColor: generatedDesign.foregroundColor }}
                        title="Foreground"
                      />
                      <div
                        className="w-8 h-8 rounded border border-gray-300"
                        style={{ backgroundColor: generatedDesign.backgroundColor }}
                        title="Background"
                      />
                    </div>
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">
                        {generatedDesign.pattern}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {generatedDesign.cornerStyle} • {generatedDesign.dotStyle}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => applyDesign(generatedDesign)}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2 text-sm"
                  >
                    <Check size={16} />
                    Apply
                  </button>
                </div>

                {generatedDesign.gradient && (
                  <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                    <span className="font-medium">Gradient:</span> {generatedDesign.gradient.type}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <Sparkles className="text-purple-600 mt-0.5" size={16} />
          <div className="text-sm text-gray-700">
            <p className="font-medium mb-1">Pro Tips:</p>
            <ul className="space-y-1 text-xs">
              <li>• Be specific about colors, styles, and mood</li>
              <li>• Mention your brand or industry for better results</li>
              <li>• Try different combinations of style and color scheme</li>
              <li>• Regenerate if you want variations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIDesignFields;
