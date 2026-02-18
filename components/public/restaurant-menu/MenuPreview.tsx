'use client';

import React, { useState, useMemo } from 'react';
import { Search, X, ChevronRight, Utensils, Leaf, Wheat, Milk, Fish, Egg } from 'lucide-react';
import PreviewHeader from '@/components/public/shared/PreviewHeader';
import PreviewFooter from '@/components/public/shared/PreviewFooter';
import SocialShare from '@/components/public/shared/SocialShare';
import QRCodeBadge from '@/components/public/shared/QRCodeBadge';
import MenuDisplay from './MenuDisplay';
import { Input } from '@/components/ui/input';

interface AllergenInfo {
  glutenFree?: boolean;
  vegan?: boolean;
  vegetarian?: boolean;
  dairyFree?: boolean;
  nutFree?: boolean;
  seafood?: boolean;
  eggs?: boolean;
}

interface DietaryTag {
  name: string;
  color?: string;
}

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  allergens?: AllergenInfo;
  dietaryTags?: DietaryTag[];
  popular?: boolean;
  spicyLevel?: number;
  calories?: number;
  available?: boolean;
}

interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  items: MenuItem[];
}

interface RestaurantMenuData {
  restaurantName: string;
  logo?: string;
  description?: string;
  categories: MenuCategory[];
  currency?: string;
  currencySymbol?: string;
  theme?: {
    primaryColor?: string;
    accentColor?: string;
  };
}

interface MenuPreviewProps {
  menu: RestaurantMenuData;
}

const allergenIcons: Record<keyof AllergenInfo, { icon: typeof Wheat; label: string; color: string }> = {
  glutenFree: { icon: Wheat, label: 'Gluten-Free', color: 'text-amber-600 bg-amber-50' },
  vegan: { icon: Leaf, label: 'Vegan', color: 'text-green-600 bg-green-50' },
  vegetarian: { icon: Leaf, label: 'Vegetarian', color: 'text-green-600 bg-green-50' },
  dairyFree: { icon: Milk, label: 'Dairy-Free', color: 'text-blue-600 bg-blue-50' },
  nutFree: { icon: Leaf, label: 'Nut-Free', color: 'text-orange-600 bg-orange-50' },
  seafood: { icon: Fish, label: 'Seafood', color: 'text-cyan-600 bg-cyan-50' },
  eggs: { icon: Egg, label: 'Contains Eggs', color: 'text-yellow-600 bg-yellow-50' },
};

export default function MenuPreview({ menu }: MenuPreviewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedAllergenFilter, setSelectedAllergenFilter] = useState<keyof AllergenInfo | null>(null);

  const primaryColor = menu.theme?.primaryColor || '#dc2626';
  const accentColor = menu.theme?.accentColor || '#f97316';
  const currencySymbol = menu.currencySymbol || '$';

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  // Filter categories and items based on search and filters
  const filteredCategories = useMemo(() => {
    return menu.categories
      .map(category => {
        const filteredItems = category.items.filter(item => {
          // Search filter
          const matchesSearch = !searchQuery || 
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchQuery.toLowerCase());

          // Allergen filter
          const matchesAllergen = !selectedAllergenFilter || 
            item.allergens?.[selectedAllergenFilter];

          // Availability filter
          const isAvailable = item.available !== false;

          return matchesSearch && matchesAllergen && isAvailable;
        });

        return {
          ...category,
          items: filteredItems,
        };
      })
      .filter(category => category.items.length > 0);
  }, [menu.categories, searchQuery, selectedAllergenFilter]);

  // Get all unique allergens present in the menu
  const availableAllergens = useMemo(() => {
    const allergens = new Set<keyof AllergenInfo>();
    menu.categories.forEach(category => {
      category.items.forEach(item => {
        if (item.allergens) {
          Object.entries(item.allergens).forEach(([key, value]) => {
            if (value) allergens.add(key as keyof AllergenInfo);
          });
        }
      });
    });
    return Array.from(allergens);
  }, [menu.categories]);

  const scrollToCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex flex-col">
      {/* Header */}
      <PreviewHeader
        logo={menu.logo}
        title={menu.restaurantName}
        subtitle={menu.description}
        actions={
          <SocialShare
            url={currentUrl}
            title={menu.restaurantName}
            description={menu.description}
            size="md"
          />
        }
      />

      <main className="flex-1 pb-16">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Hero Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {menu.logo && (
                <div className="w-32 h-32 flex-shrink-0">
                  <img
                    src={menu.logo}
                    alt={menu.restaurantName}
                    className="w-full h-full object-cover rounded-2xl shadow-md border-2 border-gray-200"
                  />
                </div>
              )}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-3 justify-center md:justify-start mb-3">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <Utensils className="w-7 h-7 text-white" />
                  </div>
                  <h1 className="text-4xl font-bold text-gray-900">
                    {menu.restaurantName}
                  </h1>
                </div>
                {menu.description && (
                  <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
                    {menu.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search menu items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-12 h-12 text-base border-gray-300 focus:border-red-500 focus:ring-red-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Allergen Filters */}
              {availableAllergens.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Dietary Preferences</h3>
                  <div className="flex flex-wrap gap-2">
                    {availableAllergens.map((allergen) => {
                      const config = allergenIcons[allergen];
                      if (!config) return null;
                      
                      const Icon = config.icon;
                      const isSelected = selectedAllergenFilter === allergen;
                      
                      return (
                        <button
                          key={allergen}
                          onClick={() => setSelectedAllergenFilter(isSelected ? null : allergen)}
                          className={`
                            inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all
                            ${isSelected 
                              ? `${config.color} ring-2 ring-offset-2` 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }
                          `}
                          style={isSelected ? { outlineColor: primaryColor } : {}}
                        >
                          <Icon className="w-4 h-4" />
                          {config.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Category Navigation */}
          {filteredCategories.length > 1 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-8 sticky top-4 z-10">
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {filteredCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => scrollToCategory(category.id)}
                    className={`
                      flex items-center gap-2 px-5 py-3 rounded-xl font-medium whitespace-nowrap transition-all
                      ${selectedCategory === category.id
                        ? 'text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                    style={selectedCategory === category.id ? { backgroundColor: primaryColor } : {}}
                  >
                    {category.icon && <span className="text-xl">{category.icon}</span>}
                    {category.name}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Menu Categories */}
          {filteredCategories.length > 0 ? (
            <div className="space-y-12">
              {filteredCategories.map((category) => (
                <section key={category.id} id={`category-${category.id}`} className="scroll-mt-32">
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      {category.icon && (
                        <span className="text-3xl">{category.icon}</span>
                      )}
                      <h2 className="text-3xl font-bold text-gray-900">{category.name}</h2>
                    </div>
                    {category.description && (
                      <p className="text-gray-600 ml-12">{category.description}</p>
                    )}
                  </div>
                  
                  <MenuDisplay 
                    items={category.items}
                    currencySymbol={currencySymbol}
                    primaryColor={primaryColor}
                    accentColor={accentColor}
                  />
                </section>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <div 
                className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: `${primaryColor}20` }}
              >
                <Search className="w-10 h-10" style={{ color: primaryColor }} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedAllergenFilter(null);
                }}
                className="px-6 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
                style={{ backgroundColor: primaryColor }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </main>

      <PreviewFooter />
      <QRCodeBadge variant="branded" position="bottom-right" />
    </div>
  );
}
