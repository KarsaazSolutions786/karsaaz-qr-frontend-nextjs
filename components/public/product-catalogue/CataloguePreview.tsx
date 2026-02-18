'use client';

import { useState, useMemo } from 'react';
import { Search, ShoppingCart, X, Filter, Grid, List, Phone, Mail, MapPin } from 'lucide-react';
import ProductGrid from './ProductGrid';

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

interface CatalogueData {
  storeName: string;
  storeDescription?: string;
  logo?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
  products: Product[];
  categories?: string[];
  allowCart?: boolean;
  allowInquiry?: boolean;
}

interface CartItem extends Product {
  quantity: number;
  selectedVariants?: Variant[];
}

export default function CataloguePreview({ data }: { data: CatalogueData }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showInquiry, setShowInquiry] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'price-low' | 'price-high' | 'newest'>('newest');

  const categories = useMemo(() => {
    if (data.categories && data.categories.length > 0) {
      return data.categories;
    }
    const cats = new Set(data.products.map(p => p.category));
    return Array.from(cats);
  }, [data]);

  const filteredProducts = useMemo(() => {
    let filtered = data.products;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return (a.salePrice || a.price) - (b.salePrice || b.price);
        case 'price-high':
          return (b.salePrice || b.price) - (a.salePrice || a.price);
        default:
          return 0;
      }
    });

    return sorted;
  }, [data.products, selectedCategory, searchQuery, sortBy]);

  const addToCart = (product: Product, variants?: Variant[]) => {
    setCart(prev => {
      const existing = prev.find(
        item =>
          item.id === product.id &&
          JSON.stringify(item.selectedVariants) === JSON.stringify(variants)
      );

      if (existing) {
        return prev.map(item =>
          item.id === product.id &&
          JSON.stringify(item.selectedVariants) === JSON.stringify(variants)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...product, quantity: 1, selectedVariants: variants }];
    });
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }
    setCart(prev => prev.map((item, i) => (i === index ? { ...item, quantity } : item)));
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const basePrice = item.salePrice || item.price;
      const variantPrice =
        item.selectedVariants?.reduce((acc, v) => acc + (v.priceAdjustment || 0), 0) || 0;
      return sum + (basePrice + variantPrice) * item.quantity;
    }, 0);
  }, [cart]);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {data.logo && (
                <img
                  src={data.logo}
                  alt={data.storeName}
                  className="h-12 w-12 object-cover rounded-lg"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{data.storeName}</h1>
                {data.storeDescription && (
                  <p className="text-sm text-gray-600">{data.storeDescription}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {data.allowCart && (
                <button
                  onClick={() => setShowCart(true)}
                  className="relative p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </button>
              )}
              {data.allowInquiry && (
                <button
                  onClick={() => setShowInquiry(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Contact Us
                </button>
              )}
            </div>
          </div>

          {/* Search and Controls */}
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Filter className="w-5 h-5" />
                Filters
              </button>

              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${
                    viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
                  } transition-colors`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${
                    viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
                  } transition-colors`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="newest">Newest First</option>
                    <option value="name">Name (A-Z)</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            </div>
            <ProductGrid
              products={filteredProducts}
              viewMode={viewMode}
              onAddToCart={addToCart}
              allowCart={data.allowCart}
            />
          </>
        )}
      </main>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowCart(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-xl">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-xl font-bold">Shopping Cart ({cartItemCount})</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {cart.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Your cart is empty</p>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item, index) => (
                      <div key={index} className="flex gap-4 p-4 border rounded-lg">
                        <img
                          src={item.images[0] || '/placeholder.png'}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.name}</h3>
                          {item.selectedVariants && item.selectedVariants.length > 0 && (
                            <p className="text-sm text-gray-600">
                              {item.selectedVariants.map(v => v.value).join(', ')}
                            </p>
                          )}
                          <p className="text-blue-600 font-bold">
                            ${item.salePrice || item.price}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(index, item.quantity - 1)}
                              className="px-2 py-1 border rounded hover:bg-gray-100"
                            >
                              -
                            </button>
                            <span className="px-3">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(index, item.quantity + 1)}
                              className="px-2 py-1 border rounded hover:bg-gray-100"
                            >
                              +
                            </button>
                            <button
                              onClick={() => removeFromCart(index)}
                              className="ml-auto text-red-600 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="border-t p-4 space-y-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Inquiry Form Modal */}
      {showInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Contact Us</h2>
              <button onClick={() => setShowInquiry(false)} className="p-2 hover:bg-gray-100 rounded">
                <X className="w-6 h-6" />
              </button>
            </div>

            {data.contactEmail || data.contactPhone || data.contactAddress ? (
              <div className="space-y-3 mb-6">
                {data.contactEmail && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Mail className="w-5 h-5" />
                    <a href={`mailto:${data.contactEmail}`} className="hover:text-blue-600">
                      {data.contactEmail}
                    </a>
                  </div>
                )}
                {data.contactPhone && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Phone className="w-5 h-5" />
                    <a href={`tel:${data.contactPhone}`} className="hover:text-blue-600">
                      {data.contactPhone}
                    </a>
                  </div>
                )}
                {data.contactAddress && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <MapPin className="w-5 h-5" />
                    <span>{data.contactAddress}</span>
                  </div>
                )}
              </div>
            ) : null}

            <form className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <textarea
                placeholder="Your Message"
                rows={4}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Send Inquiry
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
