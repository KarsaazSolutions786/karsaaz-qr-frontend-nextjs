'use client';

import { useState } from 'react';
import { ShoppingCart, Heart, Eye, Package, TrendingUp } from 'lucide-react';

interface Variant {
  id: string;
  type: 'size' | 'color' | 'custom';
  name: string;
  value: string;
  priceAdjustment?: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  images: string[];
  category: string;
  inStock: boolean;
  stockCount?: number;
  variants?: Variant[];
  sku?: string;
}

interface ProductGridProps {
  products: Product[];
  viewMode: 'grid' | 'list';
  onAddToCart: (product: Product, variants?: Variant[]) => void;
  allowCart?: boolean;
}

function ProductCard({
  product,
  viewMode,
  onAddToCart,
  allowCart,
}: {
  product: Product;
  viewMode: 'grid' | 'list';
  onAddToCart: (product: Product, variants?: Variant[]) => void;
  allowCart?: boolean;
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Variant[]>([]);
  const [, setShowQuickView] = useState(false);

  const discountPercentage = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const handleVariantChange = (type: string, variant: Variant) => {
    setSelectedVariants(prev => {
      const filtered = prev.filter(v => v.type !== type);
      return [...filtered, variant];
    });
  };

  const variantsByType = product.variants?.reduce((acc, variant) => {
    if (!acc[variant.type]) {
      acc[variant.type] = [];
    }
    acc[variant.type]!.push(variant);
    return acc;
  }, {} as Record<string, Variant[]>);

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex">
        <div className="relative w-64 flex-shrink-0">
          <img
            src={product.images[currentImageIndex] || '/placeholder.png'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {!product.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold">
                OUT OF STOCK
              </span>
            </div>
          )}
          {product.salePrice && (
            <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
              -{discountPercentage}%
            </div>
          )}
          {product.images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
              {product.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 p-6 flex flex-col">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.category}</p>
              </div>
              {product.sku && (
                <span className="text-xs text-gray-400 font-mono">SKU: {product.sku}</span>
              )}
            </div>

            <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>

            {product.variants && variantsByType && (
              <div className="space-y-3 mb-4">
                {Object.entries(variantsByType).map(([type, variants]) => (
                  <div key={type}>
                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                      {type}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {variants.map(variant => (
                        <button
                          key={variant.id}
                          onClick={() => handleVariantChange(type, variant)}
                          className={`px-3 py-1 border rounded-lg text-sm transition-all ${
                            selectedVariants.some(v => v.id === variant.id)
                              ? 'border-blue-600 bg-blue-50 text-blue-700'
                              : 'border-gray-300 hover:border-blue-400'
                          }`}
                        >
                          {variant.value}
                          {variant.priceAdjustment ? ` (+$${variant.priceAdjustment})` : ''}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-baseline gap-2">
              {product.salePrice ? (
                <>
                  <span className="text-2xl font-bold text-blue-600">
                    ${product.salePrice.toFixed(2)}
                  </span>
                  <span className="text-lg text-gray-400 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {product.stockCount !== undefined && product.stockCount < 10 && product.inStock && (
                <span className="text-sm text-orange-600 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  Only {product.stockCount} left!
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            {allowCart && (
              <button
                onClick={() => onAddToCart(product, selectedVariants)}
                disabled={!product.inStock}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  product.inStock
                    ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            )}
            <button
              onClick={() => setShowQuickView(true)}
              className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.images[currentImageIndex] || '/placeholder.png'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold">
              OUT OF STOCK
            </span>
          </div>
        )}

        {product.salePrice && (
          <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            -{discountPercentage}%
          </div>
        )}

        <div className="absolute top-3 left-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors">
            <Heart className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={() => setShowQuickView(true)}
            className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
          >
            <Eye className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {product.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
            {product.images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {product.stockCount !== undefined && product.stockCount < 10 && product.inStock && (
          <div className="absolute bottom-3 right-3 bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
            <Package className="w-3 h-3" />
            {product.stockCount} left
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs text-gray-500 uppercase tracking-wide">{product.category}</span>
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1 mt-1">{product.name}</h3>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{product.description}</p>

        {product.variants && variantsByType && (
          <div className="space-y-2 mb-3">
            {Object.entries(variantsByType).slice(0, 1).map(([type, variants]) => (
              <div key={type}>
                <div className="flex flex-wrap gap-1">
                  {variants.slice(0, 4).map(variant => (
                    <button
                      key={variant.id}
                      onClick={() => handleVariantChange(type, variant)}
                      className={`px-2 py-1 border rounded text-xs transition-all ${
                        selectedVariants.some(v => v.id === variant.id)
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-blue-400'
                      }`}
                    >
                      {variant.value}
                    </button>
                  ))}
                  {variants.length > 4 && (
                    <span className="px-2 py-1 text-xs text-gray-500">+{variants.length - 4}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-baseline gap-2 mb-3">
          {product.salePrice ? (
            <>
              <span className="text-xl font-bold text-blue-600">${product.salePrice.toFixed(2)}</span>
              <span className="text-sm text-gray-400 line-through">${product.price.toFixed(2)}</span>
            </>
          ) : (
            <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
          )}
        </div>

        {allowCart && (
          <button
            onClick={() => onAddToCart(product, selectedVariants)}
            disabled={!product.inStock}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all ${
              product.inStock
                ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        )}
      </div>
    </div>
  );
}

export default function ProductGrid({ products, viewMode, onAddToCart, allowCart }: ProductGridProps) {
  return (
    <div
      className={
        viewMode === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
          : 'flex flex-col gap-6'
      }
    >
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          viewMode={viewMode}
          onAddToCart={onAddToCart}
          allowCart={allowCart}
        />
      ))}
    </div>
  );
}
