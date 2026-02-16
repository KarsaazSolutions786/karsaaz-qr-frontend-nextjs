"use client";

import { useState, useMemo } from 'react';
import { BlockEditorProps } from '../types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Accordion, 
  AccordionItem, 
  AccordionTrigger, 
  AccordionContent 
} from '@/components/ui/accordion';
import { 
  Search, 
  Plus, 
  Trash2, 
  GripVertical, 
  ChevronUp, 
  ChevronDown,
  HelpCircle,
  X
} from 'lucide-react';
import { cn as _cn } from '@/lib/utils';

/**
 * FAQ Block
 * Interactive FAQ section with collapsible Q&A items, search, and structured data
 */

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  open?: boolean;
}

interface FAQContent {
  items: FAQItem[];
  allowMultipleOpen?: boolean;
  searchPlaceholder?: string;
}

export default function FAQBlock({ block, onUpdate, onDelete, isEditing = false }: BlockEditorProps) {
  const { content, design } = block;
  const faqContent = content as FAQContent;
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState<string[]>(
    faqContent.items?.filter(item => item.open).map(item => item.id) || []
  );

  // Generate unique ID for items if not present
  const ensureItemIds = (items: FAQItem[]): FAQItem[] => {
    return items.map((item, index) => ({
      ...item,
      id: item.id || `faq-${Date.now()}-${index}`
    }));
  };

  // Handle search query change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  // Filter items based on search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return faqContent.items || [];
    
    const query = searchQuery.toLowerCase();
    return (faqContent.items || []).filter(item => 
      item.question.toLowerCase().includes(query) || 
      item.answer.toLowerCase().includes(query)
    );
  }, [faqContent.items, searchQuery]);

  // Handle accordion change
  const handleAccordionChange = (value: string[]) => {
    if (!isEditing) {
      setOpenItems(value);
    }
  };

  // Handle item content change
  const handleItemChange = (id: string, field: 'question' | 'answer', value: string) => {
    const updatedItems = (faqContent.items || []).map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    onUpdate({
      content: {
        ...faqContent,
        items: updatedItems
      }
    });
  };

  // Add new FAQ item
  const addItem = () => {
    const newItem: FAQItem = {
      id: `faq-${Date.now()}`,
      question: '',
      answer: '',
      open: false
    };
    const updatedItems = ensureItemIds([...(faqContent.items || []), newItem]);
    onUpdate({
      content: {
        ...faqContent,
        items: updatedItems
      }
    });
  };

  // Delete FAQ item
  const deleteItem = (id: string) => {
    const updatedItems = (faqContent.items || []).filter(item => item.id !== id);
    onUpdate({
      content: {
        ...faqContent,
        items: updatedItems
      }
    });
  };

  // Move item up or down
  const moveItem = (id: string, direction: 'up' | 'down') => {
    const items = [...(faqContent.items || [])];
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex < 0 || newIndex >= items.length) return;
    
    [items[index], items[newIndex]] = [items[newIndex], items[index]];
    
    onUpdate({
      content: {
        ...faqContent,
        items
      }
    });
  };

  // Handle allow multiple open toggle
  const handleAllowMultipleToggle = (checked: boolean) => {
    onUpdate({
      content: {
        ...faqContent,
        allowMultipleOpen: checked
      }
    });
    // Reset open items when disabling multiple open
    if (!checked && openItems.length > 1) {
      setOpenItems(openItems.slice(0, 1));
    }
  };

  // Render structured data for SEO
  const renderStructuredData = () => {
    if (isEditing || !faqContent.items?.length) return null;

    const structuredData = {
      &quot;@context&quot;: &quot;https://schema.org&quot;,
      &quot;@type&quot;: &quot;FAQPage&quot;,
      &quot;mainEntity&quot;: faqContent.items.map(item => ({
        &quot;@type&quot;: &quot;Question&quot;,
        &quot;name&quot;: item.question,
        &quot;acceptedAnswer&quot;: {
          &quot;@type&quot;: &quot;Answer&quot;,
          &quot;text&quot;: item.answer
        }
      }))
    };

    return (
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    );
  };

  // Public view
  if (!isEditing) {
    if (!faqContent.items?.length) {
      return null; // Don't render empty FAQ in public view
    }

    const itemsToShow = searchQuery ? filteredItems : faqContent.items;
    
    return (
      <>
        {renderStructuredData()}
        <div 
          className="block-faq"
          style={{ 
            backgroundColor: design.backgroundColor,
            color: design.textColor,
            padding: design.padding,
            margin: design.margin,
            borderRadius: design.borderRadius,
          }}
        >
          {/* Search Input */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={faqContent.searchPlaceholder || "Search FAQs..."}
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* FAQ Accordion */}
          {itemsToShow.length > 0 ? (
            <Accordion 
              type={faqContent.allowMultipleOpen ? "multiple" : "single"}
              value={openItems}
              onValueChange={handleAccordionChange}
              className="w-full space-y-3"
            >
              {itemsToShow.map((item) => (
                <AccordionItem 
                  key={item.id} 
                  value={item.id}
                  className="border rounded-lg overflow-hidden transition-all hover:shadow-sm"
                  style={{
                    borderColor: 'rgba(0, 0, 0, 0.1)',
                    backgroundColor: design.backgroundColor === 'transparent' ? '#ffffff' : design.backgroundColor
                  }}
                >
                  <AccordionTrigger 
                    className="px-4 hover:no-underline"
                    style={{ color: design.textColor }}
                  >
                    <span className="text-left font-medium pr-4">{item.question}</span>
                  </AccordionTrigger>
                  <AccordionContent 
                    className="px-4"
                    style={{ color: design.textColor }}
                  >
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-wrap leading-relaxed">{item.answer}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No FAQs found matching your search.</p>
            </div>
          )}

          {/* Results Count */}
          {searchQuery && (
            <div className="text-sm text-muted-foreground mt-4">
              Showing {itemsToShow.length} of {faqContent.items.length} FAQs
            </div>
          )}
        </div>
      </>
    );
  }

  // Edit view
  return (
    <div className="block-editor-faq space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5" />
          <h3 className="text-lg font-semibold">FAQ Block</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <X size={16} />
        </Button>
      </div>

      {/* Settings */}
      <div className="space-y-4 p-4 border rounded-lg">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2">
            <Switch
              checked={faqContent.allowMultipleOpen || false}
              onCheckedChange={handleAllowMultipleToggle}
            />
            <span>Allow multiple items to be open</span>
          </Label>
        </div>

        <div>
          <Label>Search Placeholder Text</Label>
          <Input
            value={faqContent.searchPlaceholder || ''}
            onChange={(e) => onUpdate({
              content: {
                ...faqContent,
                searchPlaceholder: e.target.value
              }
            })}
            placeholder="Search FAQs..."
          />
        </div>
      </div>

      {/* FAQ Items */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>FAQ Items</Label>
          <Button onClick={addItem} size="sm" variant="outline" className="gap-2">
            <Plus size={16} />
            Add Item
          </Button>
        </div>

        {(faqContent.items || []).length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed rounded-lg text-muted-foreground">
            <p>No FAQ items yet. Click "Add Item" to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {faqContent.items.map((item, index) => (
              <div 
                key={item.id} 
                className="border rounded-lg p-4 space-y-3"
                style={{ borderColor: 'rgba(0, 0, 0, 0.1)' }}
              >
                {/* Item Header with Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                    <span className="text-sm font-medium">
                      Item {index + 1}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveItem(item.id, 'up')}
                      disabled={index === 0}
                    >
                      <ChevronUp size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveItem(item.id, 'down')}
                      disabled={index === (faqContent.items || []).length - 1}
                    >
                      <ChevronDown size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteItem(item.id)}
                    >
                      <Trash2 size={16} className="text-destructive" />
                    </Button>
                  </div>
                </div>

                {/* Question Input */}
                <div>
                  <Label className="text-sm">Question</Label>
                  <Input
                    value={item.question}
                    onChange={(e) => handleItemChange(item.id, 'question', e.target.value)}
                    placeholder="Enter your question..."
                  />
                </div>

                {/* Answer Input */}
                <div>
                  <Label className="text-sm">Answer</Label>
                  <Textarea
                    value={item.answer}
                    onChange={(e) => handleItemChange(item.id, 'answer', e.target.value)}
                    placeholder="Enter the answer..."
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Supports rich text formatting
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview Info */}
      {(faqContent.items || []).length > 0 && (
        <div className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
          <p className="flex items-center gap-2">
            <HelpCircle size={14} />
            Preview: {faqContent.items.length} item{faqContent.items.length !== 1 ? 's' : ''} • 
            {faqContent.allowMultipleOpen ? ' Multiple open' : ' Single open'}
          </p>
        </div>
      )}
    </div>
  );
}