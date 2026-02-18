import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Loader2, 
  Heart, 
  History, 
  X,
  Star,
  Trash2,
  Copy
} from 'lucide-react';

interface AIDesign {
  id: string;
  foregroundColor: string;
  backgroundColor: string;
  pattern: string;
  cornerStyle: string;
  dotStyle: string;
  gradient?: {
    type: string;
    colors: string[];
  };
  prompt?: string;
  style?: string;
  colorScheme?: string;
  timestamp?: number;
  isFavorite?: boolean;
}

interface AIDesignGeneratorProps {
  onApply: (design: AIDesign) => void;
  onClose?: () => void;
}

const AIDesignGenerator: React.FC<AIDesignGeneratorProps> = ({ onApply, onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('modern');
  const [selectedColorScheme, setSelectedColorScheme] = useState('vibrant');
  const [isGenerating, setIsGenerating] = useState(false);
  const [designs, setDesigns] = useState<AIDesign[]>([]);
  const [favorites, setFavorites] = useState<AIDesign[]>([]);
  const [history, setHistory] = useState<AIDesign[]>([]);
  const [activeTab, setActiveTab] = useState<'generate' | 'favorites' | 'history'>('generate');
  const [selectedDesign, setSelectedDesign] = useState<AIDesign | null>(null);

  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  const loadFromLocalStorage = () => {
    try {
      const savedFavorites = localStorage.getItem('ai-design-favorites');
      const savedHistory = localStorage.getItem('ai-design-history');
      
      if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
      if (savedHistory) setHistory(JSON.parse(savedHistory));
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
  };

  const saveToLocalStorage = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  };

  const generateDesigns = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation (replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newDesigns: AIDesign[] = Array.from({ length: 3 }, (_, i) => ({
      id: `${Date.now()}-${i}`,
      foregroundColor: getRandomColor(),
      backgroundColor: getRandomColor(),
      pattern: getRandomPattern(),
      cornerStyle: getRandomCornerStyle(),
      dotStyle: getRandomDotStyle(),
      gradient: Math.random() > 0.5 ? {
        type: 'linear',
        colors: [getRandomColor(), getRandomColor()],
      } : undefined,
      prompt,
      style: selectedStyle,
      colorScheme: selectedColorScheme,
      timestamp: Date.now(),
      isFavorite: false,
    }));

    setDesigns(newDesigns);
    
    // Add to history
    const updatedHistory = [...newDesigns, ...history].slice(0, 20);
    setHistory(updatedHistory);
    saveToLocalStorage('ai-design-history', updatedHistory);
    
    setIsGenerating(false);
  };

  const getRandomColor = (): string => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'];
    return colors[Math.floor(Math.random() * colors.length)] ?? '#FF6B6B';
  };

  const getRandomPattern = (): string => {
    const patterns = ['dots', 'squares', 'rounded', 'classy', 'extra-rounded'];
    return patterns[Math.floor(Math.random() * patterns.length)] ?? 'dots';
  };

  const getRandomCornerStyle = (): string => {
    const styles = ['square', 'extra-rounded', 'dot'];
    return styles[Math.floor(Math.random() * styles.length)] ?? 'square';
  };

  const getRandomDotStyle = (): string => {
    const styles = ['square', 'rounded', 'classy', 'extra-rounded'];
    return styles[Math.floor(Math.random() * styles.length)] ?? 'square';
  };

  const toggleFavorite = (design: AIDesign) => {
    const isFav = favorites.some(f => f.id === design.id);
    let updatedFavorites: AIDesign[];
    
    if (isFav) {
      updatedFavorites = favorites.filter(f => f.id !== design.id);
    } else {
      updatedFavorites = [...favorites, { ...design, isFavorite: true }];
    }
    
    setFavorites(updatedFavorites);
    saveToLocalStorage('ai-design-favorites', updatedFavorites);
    
    // Update in history
    const updatedHistory = history.map(h => 
      h.id === design.id ? { ...h, isFavorite: !isFav } : h
    );
    setHistory(updatedHistory);
    saveToLocalStorage('ai-design-history', updatedHistory);
  };

  const deleteFromHistory = (id: string) => {
    const updatedHistory = history.filter(h => h.id !== id);
    setHistory(updatedHistory);
    saveToLocalStorage('ai-design-history', updatedHistory);
  };

  const duplicateDesign = (design: AIDesign) => {
    setPrompt(design.prompt || '');
    setSelectedStyle(design.style || 'modern');
    setSelectedColorScheme(design.colorScheme || 'vibrant');
    setActiveTab('generate');
  };

  const DesignCard: React.FC<{ design: AIDesign; showActions?: boolean }> = ({ 
    design, 
    showActions = true 
  }) => {
    const isFav = favorites.some(f => f.id === design.id);

    return (
      <div 
        className={`border-2 rounded-lg p-4 transition-all cursor-pointer ${
          selectedDesign?.id === design.id
            ? 'border-purple-500 bg-purple-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onClick={() => setSelectedDesign(design)}
      >
        {/* Color Preview */}
        <div className="flex gap-2 mb-3">
          <div
            className="flex-1 h-20 rounded-lg border border-gray-300 relative overflow-hidden"
            style={{
              background: design.gradient
                ? `linear-gradient(135deg, ${design.gradient.colors.join(', ')})`
                : design.backgroundColor
            }}
          >
            <div 
              className="absolute inset-0 opacity-30"
              style={{ backgroundColor: design.foregroundColor }}
            />
          </div>
        </div>

        {/* Design Info */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-gray-900 truncate">
                {design.pattern}
              </div>
              <div className="text-xs text-gray-500">
                {design.cornerStyle} • {design.dotStyle}
              </div>
            </div>
            {showActions && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(design);
                }}
                className="flex-shrink-0"
              >
                <Heart
                  size={18}
                  className={isFav ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'}
                />
              </button>
            )}
          </div>

          {design.prompt && (
            <p className="text-xs text-gray-600 line-clamp-2">{design.prompt}</p>
          )}

          {design.timestamp && (
            <p className="text-xs text-gray-400">
              {new Date(design.timestamp).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onApply(design);
              }}
              className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors"
            >
              Apply
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                duplicateDesign(design);
              }}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              title="Duplicate"
            >
              <Copy size={16} />
            </button>
            {activeTab === 'history' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteFromHistory(design.id);
                }}
                className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">AI Design Generator</h2>
              <p className="text-sm text-gray-500">Create stunning QR code designs with AI</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-6">
          {[
            { id: 'generate', label: 'Generate', icon: Sparkles },
            { id: 'favorites', label: 'Favorites', icon: Star, count: favorites.length },
            { id: 'history', label: 'History', icon: History, count: history.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon size={18} />
              <span className="font-medium">{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'generate' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Controls */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Design Description
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the QR code design you want..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Style</label>
                  <select
                    value={selectedStyle}
                    onChange={(e) => setSelectedStyle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="modern">Modern</option>
                    <option value="vintage">Vintage</option>
                    <option value="minimalist">Minimalist</option>
                    <option value="playful">Playful</option>
                    <option value="professional">Professional</option>
                    <option value="artistic">Artistic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color Scheme
                  </label>
                  <select
                    value={selectedColorScheme}
                    onChange={(e) => setSelectedColorScheme(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="vibrant">Vibrant</option>
                    <option value="pastel">Pastel</option>
                    <option value="monochrome">Monochrome</option>
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                    <option value="neon">Neon</option>
                  </select>
                </div>

                <button
                  onClick={generateDesigns}
                  disabled={isGenerating || !prompt.trim()}
                  className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                    isGenerating || !prompt.trim()
                      ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                      : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      Generate Designs
                    </>
                  )}
                </button>
              </div>

              {/* Right: Results */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Generated Variations
                </h3>
                {designs.length > 0 ? (
                  <div className="grid gap-3">
                    {designs.map((design) => (
                      <DesignCard key={design.id} design={design} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <Sparkles size={48} className="mx-auto mb-3 opacity-50" />
                    <p>Generate designs to see variations</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.length > 0 ? (
                favorites.map((design) => (
                  <DesignCard key={design.id} design={design} />
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-gray-400">
                  <Star size={48} className="mx-auto mb-3 opacity-50" />
                  <p>No favorite designs yet</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {history.length > 0 ? (
                history.map((design) => (
                  <DesignCard key={design.id} design={design} />
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-gray-400">
                  <History size={48} className="mx-auto mb-3 opacity-50" />
                  <p>No design history yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIDesignGenerator;
