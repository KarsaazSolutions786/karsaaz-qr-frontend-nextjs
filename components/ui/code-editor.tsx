'use client';
import { useCallback } from 'react';
import { cn } from '@/lib/utils';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
  rows?: number;
}

export function CodeEditor({ value, onChange, language = 'json', placeholder, className, readOnly, rows = 12 }: CodeEditorProps) {
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);
      requestAnimationFrame(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      });
    }
  }, [value, onChange]);

  return (
    <div className={cn('relative rounded-md border border-gray-300 dark:border-gray-600', className)}>
      {language && (
        <div className="absolute top-2 right-2 text-xs text-gray-400 dark:text-gray-500 select-none">{language}</div>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        readOnly={readOnly}
        rows={rows}
        placeholder={placeholder}
        spellCheck={false}
        className="w-full rounded-md bg-gray-900 text-gray-100 font-mono text-sm p-4 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y dark:bg-gray-950"
      />
    </div>
  );
}
