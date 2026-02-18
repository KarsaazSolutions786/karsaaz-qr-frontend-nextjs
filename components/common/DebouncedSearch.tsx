/**
 * DebouncedSearch Component
 * 
 * Search input with debouncing for performance.
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { useDebounce, useDebouncedCallback } from '@/lib/utils/performance-utils';

export interface DebouncedSearchProps {
  onSearch: (query: string) => void | Promise<void>;
  placeholder?: string;
  delay?: number;
  minLength?: number;
  showClearButton?: boolean;
  className?: string;
  autoFocus?: boolean;
}

export function DebouncedSearch({
  onSearch,
  placeholder = 'Search...',
  delay = 300,
  minLength = 0,
  showClearButton = true,
  className = '',
  autoFocus = false,
}: DebouncedSearchProps) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const debouncedQuery = useDebounce(query, delay);
  
  useEffect(() => {
    const performSearch = async () => {
      if (debouncedQuery.length >= minLength) {
        setIsSearching(true);
        try {
          await onSearch(debouncedQuery);
        } finally {
          setIsSearching(false);
        }
      } else if (debouncedQuery.length === 0) {
        await onSearch('');
      }
    };
    
    performSearch();
  }, [debouncedQuery, minLength, onSearch]);
  
  const handleClear = useCallback(() => {
    setQuery('');
    onSearch('');
  }, [onSearch]);
  
  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        {/* Loading or Clear Button */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isSearching ? (
            <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
          ) : showClearButton && query ? (
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
        </div>
      </div>
      
      {/* Search Info */}
      {query && query.length < minLength && (
        <p className="text-xs text-gray-500 mt-1">
          Type at least {minLength} characters to search
        </p>
      )}
    </div>
  );
}

/**
 * DebouncedInput Component
 * 
 * Generic debounced input component.
 */
export interface DebouncedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  delay?: number;
}

export function DebouncedInput({
  value: externalValue,
  onChange,
  delay = 300,
  className = '',
  ...props
}: DebouncedInputProps) {
  const [internalValue, setInternalValue] = useState(externalValue);
  
  const debouncedOnChange = useDebouncedCallback(onChange, delay);
  
  useEffect(() => {
    setInternalValue(externalValue);
  }, [externalValue]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    debouncedOnChange(newValue);
  };
  
  return (
    <input
      {...props}
      value={internalValue}
      onChange={handleChange}
      className={className}
    />
  );
}

/**
 * SearchWithSuggestions Component
 * 
 * Debounced search with autocomplete suggestions.
 */
export interface SearchWithSuggestionsProps {
  onSearch: (query: string) => void;
  getSuggestions?: (query: string) => Promise<string[]>;
  placeholder?: string;
  delay?: number;
  className?: string;
}

export function SearchWithSuggestions({
  onSearch,
  getSuggestions,
  placeholder = 'Search...',
  delay = 300,
  className = '',
}: SearchWithSuggestionsProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, delay);
  
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery && getSuggestions) {
        setIsLoading(true);
        try {
          const results = await getSuggestions(debouncedQuery);
          setSuggestions(results);
          setShowSuggestions(true);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };
    
    fetchSuggestions();
  }, [debouncedQuery, getSuggestions]);
  
  const handleSelect = useCallback((suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    onSearch(suggestion);
  }, [onSearch]);
  
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    onSearch(query);
  }, [query, onSearch]);
  
  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={placeholder}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
          )}
        </div>
      </form>
      
      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSelect(suggestion)}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3 h-3 text-gray-400" />
                <span className="text-sm text-gray-700">{suggestion}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
