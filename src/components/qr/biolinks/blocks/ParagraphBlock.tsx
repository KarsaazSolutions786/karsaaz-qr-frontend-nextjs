"use client";

import { useState, useMemo } from 'react';
import { BlockEditorProps, ParagraphBlockContent } from '../types';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';

/**
 * Paragraph Block
 * A rich text paragraph block with advanced editing features including HTML support,
 * character count, auto-resizing, and readability optimization
 */

interface ExtendedParagraphContent extends ParagraphBlockContent {
  maxLength?: number;
  placeholder?: string;
  wordWrap?: 'normal' | 'break-word' | 'break-all';
  lineHeight?: number;
  fontSize?: string;
}

// Basic HTML sanitizer to prevent XSS attacks
const sanitizeHtml = (html: string): string => {
  if (typeof window === 'undefined') return html;
  
  // Create a temporary div element to parse HTML
  const div = document.createElement('div');
  div.innerHTML = html;
  
  // Remove script tags
  const scripts = div.getElementsByTagName('script');
  while (scripts.length > 0) {
    scripts[0].parentNode?.removeChild(scripts[0]);
  }
  
  // Remove inline event handlers
  const allElements = div.getElementsByTagName('*');
  for (let i = 0; i < allElements.length; i++) {
    const element = allElements[i];
    const attributes = element.attributes;
    for (let j = attributes.length - 1; j >= 0; j--) {
      const attr = attributes[j];
      if (attr.name.startsWith('on')) {
        element.removeAttribute(attr.name);
      }
    }
  }
  
  // Remove dangerous attributes
  const dangerousAttrs = ['javascript:', 'data:text/html', 'vbscript:'];
  for (let i = 0; i < allElements.length; i++) {
    const element = allElements[i];
    for (let j = 0; j < dangerousAttrs.length; j++) {
      const attrs = element.attributes;
      for (let k = 0; k < attrs.length; k++) {
        const attr = attrs[k];
        if (attr.value.toLowerCase().includes(dangerousAttrs[j])) {
          element.removeAttribute(attr.name);
        }
      }
    }
  }
  
  return div.innerHTML;
};

// Readability score calculation (simplified Flesch Reading Ease)
const calculateReadability = (text: string): number => {
  if (!text || text.length < 50) return 0;
  
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length || 1;
  const words = text.split(/\s+/).filter(w => w.length > 0).length;
  const syllables = text.toLowerCase().split(/\s+/).reduce((count, word) => {
    return count + word.split(/[aeiouy]+/).filter(s => s.length > 0).length;
  }, 0);
  
  // Simplified Flesch Reading Ease formula
  const score = 206.835 - (1.015 * (words / sentences)) - (84.6 * (syllables / words));
  return Math.max(0, Math.min(100, Math.round(score)));
};

// Get readability label
const getReadabilityLabel = (score: number): string => {
  if (score === 0) return 'Too short';
  if (score >= 90) return 'Very Easy';
  if (score >= 80) return 'Easy';
  if (score >= 70) return 'Fairly Easy';
  if (score >= 60) return 'Standard';
  if (score >= 50) return 'Fairly Difficult';
  if (score >= 30) return 'Difficult';
  return 'Very Difficult';
};

export default function ParagraphBlock({ block, onUpdate, onDelete, isEditing = false }: BlockEditorProps) {
  const { content, design } = block;
  const paragraphContent = content as ExtendedParagraphContent;
  
  const {
    text = '',
    alignment = 'left',
    enableHtml = false,
    maxLength = 5000,
    placeholder = 'Enter your paragraph...',
    wordWrap = 'normal',
    lineHeight = 1.6,
    fontSize = '1rem'
  } = paragraphContent;

  const [localText, setLocalText] = useState(text);

  // Update parent when local text changes
  const handleTextChange = (newText: string) => {
    setLocalText(newText);
    onUpdate({
      content: {
        ...paragraphContent,
        text: newText
      }
    });
  };

  // Handle other content changes
  const handleContentChange = (field: string, value: string | number | boolean) => {
    onUpdate({
      content: {
        ...paragraphContent,
        [field]: value
      }
    });
  };

  // Calculate metrics
  const characterCount = text?.length || 0;
  const wordCount = useMemo(() => {
    return text ? text.trim().split(/\s+/).filter(w => w.length > 0).length : 0;
  }, [text]);
  
  const readabilityScore = useMemo(() => {
    return calculateReadability(text || '');
  }, [text]);

  // Validation
  const isOverLimit = characterCount > maxLength;
  const getCharacterCountColor = () => {
    if (isOverLimit) return 'text-red-500';
    if (characterCount > maxLength * 0.9) return 'text-yellow-500';
    return 'text-gray-500';
  };

  // Sanitized HTML for rendering
  const sanitizedHtml = useMemo(() => {
    if (!enableHtml) return '';
    return sanitizeHtml(text || '');
  }, [text, enableHtml]);

  // Render public view
  if (!isEditing) {
    return (
      <div 
        className="block-paragraph"
        style={{ 
          backgroundColor: design.backgroundColor,
          color: design.textColor,
          padding: design.padding,
          margin: design.margin,
          borderRadius: design.borderRadius,
          textAlign: alignment as any
        }}
      >
        {enableHtml ? (
          <div 
            style={{ 
              wordWrap: wordWrap as any,
              lineHeight: lineHeight,
              fontSize: fontSize,
              whiteSpace: 'pre-wrap'
            }}
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
          />
        ) : (
          <div style={{ 
            wordWrap: wordWrap as any,
            lineHeight: lineHeight,
            fontSize: fontSize,
            whiteSpace: 'pre-wrap'
          }}>
            {text || placeholder}
          </div>
        )}
      </div>
    );
  }

  // Render editor interface
  return (
    <div className="block-editor-paragraph space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Paragraph Block</h3>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <X size={16} />
        </Button>
      </div>

      <div className="space-y-4">
        {/* Text Area with Auto-Resize */}
        <div>
          <Label>Paragraph Content</Label>
          <div className="relative">
            <TextareaAutosize
              value={text || ''}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleTextChange(e.target.value)}
              placeholder={placeholder}
              maxLength={maxLength}
              minRows={3}
              maxRows={10}
              className="w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                wordWrap: wordWrap as any,
                lineHeight: lineHeight,
                fontSize: fontSize
              }}
            />
            {/* Character Count */}
            <div className={`absolute bottom-2 right-2 text-xs ${getCharacterCountColor()}`}>
              {characterCount} / {maxLength}
            </div>
          </div>
          {isOverLimit && (
            <p className="text-sm text-red-500 mt-1">
              Maximum character limit exceeded by {characterCount - maxLength} characters
            </p>
          )}
        </div>

        {/* Alignment */}
        <div>
          <Label>Text Alignment</Label>
          <Select
            value={alignment || 'left'}
            onValueChange={(value) => handleContentChange('alignment', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="right">Right</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Word Wrap Control */}
        <div>
          <Label>Word Wrapping</Label>
          <Select
            value={wordWrap || 'normal'}
            onValueChange={(value) => handleContentChange('wordWrap', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="break-word">Break Word</SelectItem>
              <SelectItem value="break-all">Break All</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Font Size */}
        <div>
          <Label>Font Size</Label>
          <Select
            value={fontSize || '1rem'}
            onValueChange={(value) => handleContentChange('fontSize', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0.875rem">Small (14px)</SelectItem>
              <SelectItem value="1rem">Normal (16px)</SelectItem>
              <SelectItem value="1.125rem">Large (18px)</SelectItem>
              <SelectItem value="1.25rem">Extra Large (20px)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Line Height */}
        <div>
          <Label>Line Spacing</Label>
          <Select
            value={String(lineHeight || 1.6)}
            onValueChange={(value) => handleContentChange('lineHeight', parseFloat(value))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1.2">Compact</SelectItem>
              <SelectItem value="1.4">Normal</SelectItem>
              <SelectItem value="1.6">Relaxed</SelectItem>
              <SelectItem value="1.8">Loose</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Maximum Length */}
        <div>
          <Label>Maximum Character Limit</Label>
          <Select
            value={String(maxLength || 5000)}
            onValueChange={(value) => handleContentChange('maxLength', parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="500">500 characters</SelectItem>
              <SelectItem value="1000">1,000 characters</SelectItem>
              <SelectItem value="2000">2,000 characters</SelectItem>
              <SelectItem value="5000">5,000 characters</SelectItem>
              <SelectItem value="10000">10,000 characters</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Placeholder Text */}
        <div>
          <Label>Placeholder Text</Label>
          <input
            type="text"
            value={placeholder || ''}
            onChange={(e) => handleContentChange('placeholder', e.target.value)}
            placeholder="Enter placeholder text..."
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {/* Enable HTML */}
        <div className="flex items-center space-x-2">
          <Switch
            checked={enableHtml || false}
            onCheckedChange={(checked) => handleContentChange('enableHtml', checked)}
          />
          <Label>Enable HTML (Advanced)</Label>
        </div>

        {/* Readability Metrics */}
        {text && text.length > 50 && (
          <div className="mt-4 p-3 bg-muted rounded-md">
            <Label>Readability Score</Label>
            <div className="mt-2">
              <div className="flex justify-between items-center mb-1">
                <span className={`text-sm font-medium ${
                  readabilityScore >= 60 ? 'text-green-600' : 
                  readabilityScore >= 40 ? 'text-yellow-600' : 
                  'text-red-600'
                }`}>
                  {readabilityScore}/100 ({getReadabilityLabel(readabilityScore)})
                </span>
                <span className="text-sm text-gray-500">{wordCount} words</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    readabilityScore >= 60 ? 'bg-green-500' : 
                    readabilityScore >= 40 ? 'bg-yellow-500' : 
                    'bg-red-500'
                  }`}
                  style={{ width: `${readabilityScore}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Score based on sentence length and word complexity. Higher scores are easier to read.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}