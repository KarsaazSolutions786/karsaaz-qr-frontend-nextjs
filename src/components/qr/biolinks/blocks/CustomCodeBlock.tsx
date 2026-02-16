"use client";

import { useState, useEffect as _useEffect, useRef as _useRef, useCallback } from 'react';
import { BlockEditorProps } from '../types';
import { Input as _Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, CheckCircle as _CheckCircle, Info, Code2, Eye, EyeOff, Shield, Wand2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';

/**
 * Custom Code Block
 * Allows users to add custom HTML, CSS, and JavaScript code with syntax highlighting,
 * sandboxed execution, and security protections
 */

interface CustomCodeContent {
  html: string;
  css: string;
  javascript: string;
  codeType: 'html' | 'css' | 'javascript' | 'combined';
  showPreview: boolean;
  autoRun: boolean;
  enableHtml: boolean;
  enableCss: boolean;
  enableJs: boolean;
  securityWarnings: boolean;
  sandboxMode: boolean;
}

// Security utilities
class CodeSecurityValidator {
  private static readonly FORBIDDEN_PATTERNS = [
    // XSS patterns
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi, // onclick, onload, etc.
    // Dangerous patterns
    /eval\s*\(/gi,
    /Function\s*\(/gi,
    /setTimeout\s*\(\s*["']/gi,
    /setInterval\s*\(\s*["']/gi,
    // Cookie access
    /document\.cookie/gi,
    // Parent/frame access
    /window\.parent/gi,
    /window\.top/gi,
    // Local storage in sandbox mode
    /localStorage/gi,
    /sessionStorage/gi,
    // URL manipulation
    /window\.location\s*=/gi,
    /document\.location\s*=/gi,
  ];

  private static readonly ALLOWED_HTML_TAGS = [
    'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'a', 'img', 'br', 'hr', 'strong', 'em', 'u', 'i', 'b',
    'ul', 'ol', 'li', 'table', 'tr', 'td', 'th', 'thead', 'tbody',
    'form', 'input', 'button', 'label', 'select', 'option', 'textarea'
  ];

  private static readonly ALLOWED_CSS_PROPERTIES = [
    'color', 'background', 'background-color', 'font-size', 'font-family',
    'margin', 'padding', 'border', 'width', 'height', 'display', 'position',
    'top', 'left', 'right', 'bottom', 'flex', 'grid', 'opacity', 'transform'
  ];

  static validate(html: string = '', css: string = '', javascript: string = ''): { valid: boolean; warnings: string[] } {
    const warnings: string[] = [];

    // Check HTML for forbidden patterns
    if (html) {
      // Check for script tags
      if (/<script\b/i.test(html)) {
        warnings.push('HTML contains <script> tags which may be blocked for security');
      }

      // Check for inline event handlers
      if (/on\w+\s*=/i.test(html)) {
        warnings.push('HTML contains inline event handlers (onclick, onload, etc.)');
      }

      // Check for javascript: URLs
      if (/javascript:/i.test(html)) {
        warnings.push('HTML contains javascript: URLs');
      }

      // Check for suspicious patterns
      this.FORBIDDEN_PATTERNS.forEach(pattern => {
        if (pattern.test(html)) {
          warnings.push(`Suspicious pattern detected in HTML: ${pattern.source}`);
        }
      });
    }

    // Check JavaScript for dangerous patterns
    if (javascript) {
      this.FORBIDDEN_PATTERNS.forEach(pattern => {
        if (pattern.test(javascript)) {
          warnings.push(`Potentially dangerous JavaScript pattern detected: ${pattern.source}`);
        }
      });

      // Check for cookie access
      if (/document\.cookie/gi.test(javascript)) {
        warnings.push('JavaScript attempts to access cookies');
      }

      // Check for storage access in sandbox mode
      if (/localStorage|sessionStorage/gi.test(javascript)) {
        warnings.push('JavaScript attempts to access local/session storage');
      }

      // Check for parent/frame access
      if (/window\.parent|window\.top/gi.test(javascript)) {
        warnings.push('JavaScript attempts to access parent window/frame');
      }
    }

    return {
      valid: warnings.length === 0 || warnings.every(w => w.includes('may be') || w.includes('potentially')),
      warnings
    };
  }

  static sanitizeHtml(html: string): string {
    // Remove script tags
    let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    
    // Remove inline event handlers
    sanitized = sanitized.replace(/on\w+\s*=/gi, 'data-blocked-');
    
    // Remove javascript: URLs
    sanitized = sanitized.replace(/href\s*=\s*["']\s*javascript:/gi, 'href="#blocked"');
    
    return sanitized;
  }

  static extractCodeBlocks(code: string): { html: string; css: string; js: string } {
    const result = { html: '', css: '', js: '' };
    
    // Extract HTML
    const htmlMatch = code.match(/<html>[\s\S]*?<\/html>/i);
    if (htmlMatch) {
      result.html = htmlMatch[0].replace(/<\/?html>/gi, '').trim();
    }
    
    // Extract CSS
    const _cssMatch = code.match(/<style>[\s\S]*?<\/style>/gi);
    if (_cssMatch) {
      result.css = _cssMatch.map(match => match.replace(/<\/?style>/gi, '').trim()).join('\n');
    }
    
    // Extract JavaScript
    const jsMatch = code.match(/<script>[\s\S]*?<\/script>/gi);
    if (jsMatch) {
      result.js = jsMatch.map(match => match.replace(/<\/?script>/gi, '').trim()).join('\n');
    }
    
    // If no tags found, treat as HTML
    if (!result.html && !result.css && !result.js && code.trim()) {
      result.html = code.trim();
    }
    
    return result;
  }
}

// Monaco Editor component (fallback implementation)
const CodeEditor = ({ 
  value, 
  onChange, 
  language, 
  height = '300px' 
}: { 
  value: string; 
  onChange: (value: string) => void; 
  language: string;
  height?: string;
}) => {
  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="font-mono text-sm"
      style={{ height, fontFamily: 'Monaco, Menlo, "Ubuntu Mono", Consolas, monospace' }}
      placeholder={`Enter your ${language.toUpperCase()} code here...`}
    />
  );
};

// Sandboxed preview component
const SandboxedPreview = ({ 
  html, 
  css, 
  javascript,
  sandboxMode = true 
}: { 
  html: string; 
  css: string; 
  javascript: string;
  sandboxMode?: boolean;
}) => {
  const _iframeRef = _useRef<HTMLIFrameElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!iframeRef.current) return;

    try {
      const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
      if (!doc) return;

      // Create a complete HTML document
      const fullHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { margin: 0; padding: 16px; font-family: Arial, sans-serif; }
            ${css}
          </style>
        </head>
        <body>
          ${html}
          ${javascript ? `<script>${javascript}</script>` : ''}
        </body>
        </html>
      `;

      // Write content to iframe
      doc.open();
      doc.write(fullHtml);
      doc.close();

      // Set up sandbox attributes
      if (sandboxMode) {
        iframeRef.current.sandbox.add('allow-scripts');
        iframeRef.current.sandbox.add('allow-same-origin');
      }

      setError(null);
    } catch (err: unknown) { // Replace any with unknown
      requestAnimationFrame(() => { // Wrap setError in requestAnimationFrame
        setError((err instanceof Error ? err.message : 'Unknown error'));
      });
    }
  }, [html, css, javascript, sandboxMode]);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Preview Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <iframe
      ref={iframeRef}
      title="Code Preview"
      className="w-full border rounded-lg"
      style={{ minHeight: '300px' }}
      sandbox={sandboxMode ? 'allow-scripts allow-same-origin' : undefined}
    />
  );
};

export default function CustomCodeBlock({ block, onUpdate, onDelete, isEditing = false }: BlockEditorProps) {
  const { content, design } = block;
  const codeContent = content as CustomCodeContent;

  // Initialize with default values
  const defaultContent: CustomCodeContent = {
    html: '',
    css: '',
    javascript: '',
    codeType: 'combined',
    showPreview: true,
    autoRun: false,
    enableHtml: true,
    enableCss: true,
    enableJs: false, // Disabled by default for security
    securityWarnings: true,
    sandboxMode: true,
    ...codeContent
  };

  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [parsedCode, setParsedCode] = useState({ html: '', css: '', javascript: '' });
  const [securityCheck, setSecurityCheck] = useState<{ valid: boolean; warnings: string[] }>({
    valid: true,
    warnings: []
  });

  // Run security validation
  useEffect(() => {
    requestAnimationFrame(() => {
      const check = CodeSecurityValidator.validate(
        defaultContent.html,
        defaultContent.css,
        defaultContent.javascript
      );
      setSecurityCheck(check);
    });
  }, [defaultContent.html, defaultContent.css, defaultContent.javascript]);

  // Parse combined code if needed
  useEffect(() => {
    requestAnimationFrame(() => {
      if (defaultContent.codeType === 'combined' && defaultContent.html) {
        const extracted = CodeSecurityValidator.extractCodeBlocks(defaultContent.html);
        setParsedCode(extracted);
      } else {
        setParsedCode({
          html: defaultContent.html || '',
          css: defaultContent.css || '',
          javascript: defaultContent.javascript || ''
        });
      }
    });
  }, [defaultContent.html, defaultContent.css, defaultContent.javascript, defaultContent.codeType]);

  // Handle content changes
  const handleContentChange = useCallback((field: keyof CustomCodeContent, value: string | boolean) => {
    onUpdate({
      content: {
        ...defaultContent,
        [field]: value
      }
    });
  }, [onUpdate, defaultContent]);

  // Render preview in public view
  if (!isEditing) {
    if (!defaultContent.enableHtml && defaultContent.codeType === 'html') {
      return (
        <div className="text-center p-8 text-muted-foreground bg-muted rounded-lg">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <p>HTML execution is disabled for this block.</p>
        </div>
      );
    }

    if (!defaultContent.enableJs && defaultContent.javascript) {
      return (
        <div className="text-center p-8 text-muted-foreground bg-muted rounded-lg">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <p>JavaScript execution is disabled for this block.</p>
        </div>
      );
    }

    return (
      <div 
        className="block-custom-code"
        style={{ 
          backgroundColor: design.backgroundColor,
          color: design.textColor,
          padding: design.padding,
          margin: design.margin,
          borderRadius: design.borderRadius
        }}
      >
        {defaultContent.sandboxMode ? (
          <SandboxedPreview
            html={parsedCode.html}
            css={parsedCode.css}
            javascript={parsedCode.javascript}
            sandboxMode={true}
          />
        ) : (
          <div 
            dangerouslySetInnerHTML={{ 
              __html: CodeSecurityValidator.sanitizeHtml(parsedCode.html) 
            }} 
          />
        )}
      </div>
    );
  }

  // Render editor interface
  return (
    <div className="block-editor-custom-code space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code2 className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Custom Code Block</h3>
          {defaultContent.sandboxMode && (
            <Shield className="h-4 w-4 text-green-600" title="Sandboxed Execution" />
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <AlertTriangle className="h-4 w-4" />
        </Button>
      </div>

      {/* Security Warnings */}
      {defaultContent.securityWarnings && securityCheck.warnings.length > 0 && (
        <Alert variant={securityCheck.valid ? "default" : "destructive"}>
          <Shield className="h-4 w-4" />
          <AlertTitle>Security Review</AlertTitle>
          <AlertDescription>
            <div className="space-y-1 mt-2">
              {securityCheck.warnings.map((warning, index) => (
                <div key={index} className="text-sm flex items-start gap-2">
                  <AlertTriangle className="h-3 w-3 mt-1 flex-shrink-0" />
                  <span>{warning}</span>
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'edit' | 'preview')} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="edit">Edit Code</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="space-y-4">
          {/* Code Type Selection */}
          <div>
            <Label>Code Type</Label>
            <Select
              value={defaultContent.codeType}
              onValueChange={(value) => handleContentChange('codeType', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="html">HTML Only</SelectItem>
                <SelectItem value="css">CSS Only</SelectItem>
                <SelectItem value="javascript">JavaScript Only</SelectItem>
                <SelectItem value="combined">Combined (HTML + CSS + JS)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Code Editor */}
          {defaultContent.codeType === 'combined' && (
            <div>
              <Label>Combined Code (HTML, CSS, JS)</Label>
              <CodeEditor
                value={defaultContent.html}
                onChange={(value) => handleContentChange('html', value)}
                language="html"
                height="400px"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Use &lt;style&gt; tags for CSS and &lt;script&gt; tags for JavaScript
              </p>
            </div>
          )}

          {(defaultContent.codeType === 'html' || defaultContent.codeType === 'javascript') && (
            <div>
              <Label>HTML Code</Label>
              <CodeEditor
                value={defaultContent.html}
                onChange={(value) => handleContentChange('html', value)}
                language="html"
              />
            </div>
          )}

          {(defaultContent.codeType === 'css' || defaultContent.codeType === 'javascript') && (
            <div>
              <Label>CSS Code</Label>
              <CodeEditor
                value={defaultContent.css}
                onChange={(value) => handleContentChange('css', value)}
                language="css"
              />
            </div>
          )}

          {(defaultContent.codeType === 'javascript' || defaultContent.codeType === 'combined') && (
            <div>
              <Label>JavaScript Code</Label>
              <div className="flex items-center gap-2 mb-2">
                <Switch
                  checked={defaultContent.enableJs}
                  onCheckedChange={(checked) => handleContentChange('enableJs', checked)}
                />
                <Label>Enable JavaScript Execution</Label>
              </div>
              <CodeEditor
                value={defaultContent.javascript}
                onChange={(value) => handleContentChange('javascript', value)}
                language="javascript"
              />
              {!defaultContent.enableJs && (
                <p className="text-sm text-muted-foreground mt-1">
                  JavaScript is disabled. Enable it above to allow script execution.
                </p>
              )}
            </div>
          )}

          {/* Settings */}
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <Label>Sandbox Mode</Label>
                <p className="text-sm text-muted-foreground">Run code in isolated iframe for security</p>
              </div>
              <Switch
                checked={defaultContent.sandboxMode}
                onCheckedChange={(checked) => handleContentChange('sandboxMode', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Security Warnings</Label>
                <p className="text-sm text-muted-foreground">Show security warnings in editor</p>
              </div>
              <Switch
                checked={defaultContent.securityWarnings}
                onCheckedChange={(checked) => handleContentChange('securityWarnings', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Auto Run Preview</Label>
                <p className="text-sm text-muted-foreground">Automatically update preview while editing</p>
              </div>
              <Switch
                checked={defaultContent.autoRun}
                onCheckedChange={(checked) => handleContentChange('autoRun', checked)}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preview">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Info className="h-4 w-4" />
              Preview runs in sandboxed iframe for security
            </div>
            
            {defaultContent.autoRun || activeTab === 'preview' ? (
              <SandboxedPreview
                html={parsedCode.html}
                css={parsedCode.css}
                javascript={parsedCode.javascript}
                sandboxMode={defaultContent.sandboxMode}
              />
            ) : (
              <div className="text-center p-8 text-muted-foreground border rounded-lg">
                <EyeOff className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>Click &quot;Preview&quot; tab to see your code in action</p>
                <p className="text-sm mt-2">Auto-run is disabled</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
