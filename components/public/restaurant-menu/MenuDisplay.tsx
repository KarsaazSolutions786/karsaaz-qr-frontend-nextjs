'use client';

import React from 'react';
import { Star, Flame, TrendingUp, Leaf, Wheat, Milk, Fish, Egg } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

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

interface MenuDisplayProps {
  items: MenuItem[];
  currencySymbol: string;
  primaryColor: string;
  accentColor: string;
}

const allergenIcons: Record<keyof AllergenInfo, { icon: typeof Wheat; label: string; tooltip: string; color: string }> = {
  glutenFree: { icon: Wheat, label: 'GF', tooltip: 'Gluten-Free', color: 'text-amber-600 bg-amber-50' },
  vegan: { icon: Leaf, label: 'VG', tooltip: 'Vegan', color: 'text-green-600 bg-green-50' },
  vegetarian: { icon: Leaf, label: 'V', tooltip: 'Vegetarian', color: 'text-green-600 bg-green-50' },
  dairyFree: { icon: Milk, label: 'DF', tooltip: 'Dairy-Free', color: 'text-blue-600 bg-blue-50' },
  nutFree: { icon: Leaf, label: 'NF', tooltip: 'Nut-Free', color: 'text-orange-600 bg-orange-50' },
  seafood: { icon: Fish, label: 'SF', tooltip: 'Seafood', color: 'text-cyan-600 bg-cyan-50' },
  eggs: { icon: Egg, label: 'E', tooltip: 'Contains Eggs', color: 'text-yellow-600 bg-yellow-50' },
};

export default function MenuDisplay({ items, currencySymbol, primaryColor, accentColor }: MenuDisplayProps) {
  const formatPrice = (price: number) => {
    return `${currencySymbol}${price.toFixed(2)}`;
  };

  const renderSpicyLevel = (level: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(3)].map((_, i) => (
          <Flame
            key={i}
            className={`w-4 h-4 ${
              i < level ? 'text-red-500 fill-red-500' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <Card 
          key={item.id} 
          className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-gray-200 group"
        >
          {/* Image */}
          {item.image && (
            <div className="relative aspect-video overflow-hidden bg-gray-100">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              
              {/* Badges Overlay */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {item.popular && (
                  <div 
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full text-white text-xs font-bold shadow-lg backdrop-blur-sm"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    Popular
                  </div>
                )}
              </div>

              {/* Price Badge */}
              <div className="absolute top-3 right-3">
                <div 
                  className="px-4 py-2 rounded-full text-white font-bold text-lg shadow-lg backdrop-blur-sm"
                  style={{ backgroundColor: accentColor }}
                >
                  {formatPrice(item.price)}
                </div>
              </div>
            </div>
          )}

          <CardContent className="p-5">
            {/* Header */}
            <div className="mb-3">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-xl font-bold text-gray-900 leading-tight flex-1">
                  {item.name}
                </h3>
                {!item.image && (
                  <span 
                    className="text-xl font-bold flex-shrink-0"
                    style={{ color: primaryColor }}
                  >
                    {formatPrice(item.price)}
                  </span>
                )}
              </div>

              {item.description && (
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              )}
            </div>

            {/* Metadata Row */}
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              {item.spicyLevel && item.spicyLevel > 0 && (
                <div className="flex items-center gap-1" title={`Spicy Level ${item.spicyLevel}/3`}>
                  {renderSpicyLevel(item.spicyLevel)}
                </div>
              )}

              {item.calories && (
                <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-600">
                  <Star className="w-3 h-3" />
                  {item.calories} cal
                </div>
              )}
            </div>

            {/* Allergens and Dietary Tags */}
            <div className="flex flex-wrap gap-2">
              {/* Allergen Icons */}
              {item.allergens && Object.entries(item.allergens).map(([key, value]) => {
                if (!value) return null;
                const config = allergenIcons[key as keyof AllergenInfo];
                if (!config) return null;
                
                const Icon = config.icon;
                return (
                  <div
                    key={key}
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${config.color}`}
                    title={config.tooltip}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {config.label}
                  </div>
                );
              })}

              {/* Custom Dietary Tags */}
              {item.dietaryTags?.map((tag, index) => (
                <div
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor: tag.color ? `${tag.color}20` : '#f3f4f6',
                    color: tag.color || '#374151',
                  }}
                >
                  {tag.name}
                </div>
              ))}
            </div>

            {/* Popular Star Rating (if popular) */}
            {item.popular && !item.image && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-yellow-400 fill-yellow-400"
                      />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-gray-600">Customer Favorite</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
