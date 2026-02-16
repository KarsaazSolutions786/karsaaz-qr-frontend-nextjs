"use client";

import { useState, useMemo } from 'react';
import { BlockEditorProps } from '../types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Calendar, Clock, DollarSign, Tag, X, Plus, Trash2, Edit3, Check, Award, Search } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';

/**
 * Services Block
 * A comprehensive service listing component with categories, filtering, booking, and ratings
 * Features:
 * - Multiple service listings with detailed information
 * - Category grouping and filtering
 * - Featured/highlighted services
 * - Booking/appointment CTA
 * - Service images and icons
 * - Reviews and ratings per service
 * - Search functionality
 * - Responsive card layout
 * - Edit and public view modes
 */

// Interfaces for service data
interface ServiceReview {
  id: string;
  rating: number;
  comment?: string;
  author?: string;
  date?: string;
}

interface Service {
  id: string;
  title: string;
  description?: string;
  price?: string;
  duration?: string;
  category?: string;
  image?: string;
  icon?: string;
  featured?: boolean;
  rating?: number;
  reviewCount?: number;
  reviews?: ServiceReview[];
  bookingUrl?: string;
  popular?: boolean;
  tags?: string[];
}

interface ServicesContent {
  title?: string;
  description?: string;
  services: Service[];
  categories: string[];
  showSearch?: boolean;
  showFilters?: boolean;
  showRatings?: boolean;
  enableBooking?: boolean;
  featuredBadgeText?: string;
  popularBadgeText?: string;
  defaultView?: 'grid' | 'list';
  columns?: 1 | 2 | 3;
  filterType?: 'category' | 'all';
}

// Rating display component
function RatingDisplay({ rating, reviewCount, size = 'sm' }: { rating?: number; reviewCount?: number; size?: 'sm' | 'lg' }) {
  if (!rating || rating === 0) return null;

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const starSize = size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
  const textSize = size === 'lg' ? 'text-sm' : 'text-xs';

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className={`${starSize} fill-yellow-400 text-yellow-400`} />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star className={`${starSize} text-gray-300`} />
            <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
              <Star className={`${starSize} fill-yellow-400 text-yellow-400`} />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className={`${starSize} text-gray-300`} />
        ))}
      </div>
      {reviewCount && (
        <span className={`${textSize} text-muted-foreground`}>
          ({reviewCount})
        </span>
      )}
    </div>
  );
}

// Service card component
function ServiceCard({ 
  service, 
  isEditing, 
  onEdit, 
  onDelete,
  onBook,
  showRatings,
  featuredBadgeText,
  popularBadgeText 
}: { 
  service: Service; 
  isEditing: boolean; 
  onEdit?: (service: Service) => void;
  onDelete?: (serviceId: string) => void;
  onBook?: (service: Service) => void;
  showRatings?: boolean;
  featuredBadgeText?: string;
  popularBadgeText?: string;
}) {
  return (
    <Card className={`relative overflow-hidden transition-all hover:shadow-lg ${
      service.featured ? 'border-blue-200 dark:border-blue-800' : ''
    }`}>
      {/* Featured badge */}
      {service.featured && featuredBadgeText && (
        <div className="absolute top-3 right-3 z-10">
          <Badge variant="default" className="bg-blue-600">
            <Award className="w-3 h-3 mr-1" />
            {featuredBadgeText}
          </Badge>
        </div>
      )}

      {/* Popular badge (for high-rated services) */}
      {service.popular && popularBadgeText && (
        <div className="absolute top-3 left-3 z-10">
          <Badge variant="success">
            🔥 {popularBadgeText}
          </Badge>
        </div>
      )}

      {/* Image */}
      {service.image && (
        <div className="w-full h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img 
            src={service.image} 
            alt={service.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Header with icon */}
      <CardHeader className="flex flex-row items-start gap-4 pb-3">
        {service.icon && (
          <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
            <span className="text-xl">{service.icon}</span>
          </div>
        )}
        <div className="flex-grow min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-semibold truncate">{service.title}</h3>
            {isEditing && (
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit?.(service)}
                  className="h-7 w-7 p-0"
                >
                  <Edit3 size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete?.(service.id)}
                  className="h-7 w-7 p-0 text-red-500 hover:text-red-700"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            )}
          </div>
          
          {/* Rating */}
          {showRatings && (
            <RatingDisplay rating={service.rating} reviewCount={service.reviewCount} />
          )}

          {/* Category */}
          {service.category && (
            <div className="mt-1">
              <Badge variant="outline" className="text-xs">
                <Tag className="w-3 h-3 mr-1" />
                {service.category}
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="pb-3">
        {service.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
            {service.description}
          </p>
        )}

        {/* Tags */}
        {service.tags && service.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {service.tags.slice(0, 3).map((tag, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Price and Duration */}
        <div className="flex items-center justify-between text-sm">
          {service.price && (
            <div className="flex items-center gap-1 font-semibold text-green-600 dark:text-green-400">
              <DollarSign className="w-4 h-4" />
              {service.price}
            </div>
          )}
          {service.duration && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-4 h-4" />
              {service.duration}
            </div>
          )}
        </div>
      </CardContent>

      {/* Footer with booking button */}
      <CardFooter className="pt-0">
        {service.bookingUrl && (
          <Button 
            className="w-full" 
            onClick={() => onBook?.(service)}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Book Now
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default function ServicesBlock({ block, onUpdate, onDelete, isEditing = false }: BlockEditorProps) {
  const { content, design } = block;
  
  const servicesContent = content as ServicesContent;
  const {
    title,
    description,
    services = [],
    categories = [],
    showSearch = true,
    showFilters = true,
    showRatings = true,
    enableBooking = true,
    featuredBadgeText = 'Featured',
    popularBadgeText = 'Popular',
    defaultView = 'grid',
    columns = 2,
    filterType = 'all'
  } = servicesContent;

  // Local state for filtering and search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [showAddService, setShowAddService] = useState(false);

  // Filter services based on search and category
  const filteredServices = useMemo(() => {
    return services.filter(service => {
      // Search filter
      const matchesSearch = !searchQuery || 
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Category filter
      const matchesCategory = !selectedCategory || 
        selectedCategory === 'all' || 
        service.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [services, searchQuery, selectedCategory]);

  // Sort services: featured first, then by rating
  const sortedServices = useMemo(() => {
    return [...filteredServices].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      if ((b.rating || 0) - (a.rating || 0) !== 0) {
        return (b.rating || 0) - (a.rating || 0);
      }
      return a.title.localeCompare(b.title);
    });
  }, [filteredServices]);

  // Handle content changes
  const handleContentChange = (field: keyof ServicesContent, value: any) => {
    onUpdate({
      content: {
        ...servicesContent,
        [field]: value
      }
    });
  };

  // Handle service operations
  const handleAddService = () => {
    const newServiceId = `service_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const newService: Service = {
      id: newServiceId,
      title: 'New Service',
      description: 'Service description',
      price: '$99',
      duration: '1 hour',
      category: categories[0] || 'General',
      featured: false,
      rating: 0,
      reviewCount: 0,
      popular: false
    };
    handleContentChange('services', [...services, newService]);
    setShowAddService(false);
  };

  const handleUpdateService = (updatedService: Service) => {
    const updatedServices = services.map(s => 
      s.id === updatedService.id ? updatedService : s
    );
    handleContentChange('services', updatedServices);
    setEditingService(null);
  };

  const handleDeleteService = (serviceId: string) => {
    handleContentChange('services', services.filter(s => s.id !== serviceId));
  };

  const handleBooking = (service: Service) => {
    if (service.bookingUrl) {
      window.open(service.bookingUrl, '_blank');
    }
  };

  // Add new category
  const addCategory = (category: string) => {
    if (category && !categories.includes(category)) {
      handleContentChange('categories', [...categories, category]);
    }
  };

  // Public view (display mode)
  if (!isEditing) {
    return (
      <div 
        className="block-services"
        style={{ 
          backgroundColor: design.backgroundColor,
          color: design.textColor,
          padding: design.padding,
          margin: design.margin,
          borderRadius: design.borderRadius,
        }}
      >
        {/* Header */}
        {(title || description) && (
          <div className="mb-6 text-center">
            {title && (
              <h2 className="text-2xl font-bold mb-2">{title}</h2>
            )}
            {description && (
              <p className="text-muted-foreground max-w-2xl mx-auto">{description}</p>
            )}
          </div>
        )}

        {/* Search and Filters */}
        {(showSearch || showFilters) && (
          <div className="mb-6 space-y-4">
            {showSearch && (
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            )}
            
            {showFilters && categories.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('all')}
                >
                  All
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Services Grid */}
        {sortedServices.length > 0 ? (
          <div className={`grid gap-6 ${
            columns === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
            columns === 2 ? 'grid-cols-1 lg:grid-cols-2' :
            'grid-cols-1'
          }`}>
            {sortedServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                isEditing={false}
                onBook={handleBooking}
                showRatings={showRatings}
                featuredBadgeText={featuredBadgeText}
                popularBadgeText={popularBadgeText}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <div className="text-4xl mb-4">🛠️</div>
            <p>No services available</p>
          </div>
        )}

        {/* Results count */}
        {searchQuery && (
          <p className="text-center text-sm text-muted-foreground mt-6">
            Found {sortedServices.length} service{sortedServices.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    );
  }

  // Edit mode
  return (
    <div className="block-editor-services space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tag size={20} className="text-blue-600" />
          <h3 className="text-lg font-semibold">Services Block</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <X size={16} />
        </Button>
      </div>

      <div className="space-y-6">
        {/* Block Title and Description */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Block Title</Label>
            <Input
              value={title || ''}
              onChange={(e) => handleContentChange('title', e.target.value)}
              placeholder="Our Services"
            />
          </div>
          <div>
            <Label>Columns</Label>
            <Select
              value={columns.toString()}
              onValueChange={(value) => handleContentChange('columns', parseInt(value) as 1 | 2 | 3)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Column</SelectItem>
                <SelectItem value="2">2 Columns</SelectItem>
                <SelectItem value="3">3 Columns</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Block Description</Label>
          <TextareaAutosize
            value={description || ''}
            onChange={(e) => handleContentChange('description', e.target.value)}
            placeholder="Description of your services..."
            minRows={2}
            className="w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>

        {/* Display Options */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Switch
                checked={showSearch}
                onCheckedChange={(checked) => handleContentChange('showSearch', checked)}
              />
              <Label>Show Search</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={showFilters}
                onCheckedChange={(checked) => handleContentChange('showFilters', checked)}
              />
              <Label>Show Category Filters</Label>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Switch
                checked={showRatings}
                onCheckedChange={(checked) => handleContentChange('showRatings', checked)}
              />
              <Label>Show Ratings</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={enableBooking}
                onCheckedChange={(checked) => handleContentChange('enableBooking', checked)}
              />
              <Label>Enable Booking</Label>
            </div>
          </div>
        </div>

        {/* Badge Text */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Featured Badge Text</Label>
            <Input
              value={featuredBadgeText}
              onChange={(e) => handleContentChange('featuredBadgeText', e.target.value)}
              placeholder="Featured"
            />
          </div>
          <div>
            <Label>Popular Badge Text</Label>
            <Input
              value={popularBadgeText}
              onChange={(e) => handleContentChange('popularBadgeText', e.target.value)}
              placeholder="Popular"
            />
          </div>
        </div>

        {/* Categories Management */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-3">
            <Label>Categories</Label>
            <Button
              size="sm"
              onClick={() => {
                const category = prompt('Enter new category:');
                if (category) addCategory(category);
              }}
            >
              <Plus size={14} className="mr-1" />
              Add Category
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge key={category} variant="secondary">
                {category}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleContentChange('categories', categories.filter(c => c !== category))}
                  className="h-4 w-4 p-0 ml-2 hover:bg-destructive hover:text-destructive-foreground"
                >
                  <X size={12} />
                </Button>
              </Badge>
            ))}
            {categories.length === 0 && (
              <p className="text-sm text-muted-foreground">No categories added</p>
            )}
          </div>
        </div>

        {/* Services List */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-3">
            <Label>Services ({services.length})</Label>
            <Button size="sm" onClick={() => setShowAddService(true)}>
              <Plus size={14} className="mr-1" />
              Add Service
            </Button>
          </div>

          {services.length > 0 ? (
            <div className={`grid gap-4 ${
              columns === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
              columns === 2 ? 'grid-cols-1 lg:grid-cols-2' :
              'grid-cols-1'
            }`}>
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  isEditing={true}
                  onEdit={setEditingService}
                  onDelete={handleDeleteService}
                  showRatings={showRatings}
                  featuredBadgeText={featuredBadgeText}
                  popularBadgeText={popularBadgeText}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border-2 border-dashed rounded-lg text-muted-foreground">
              <Tag size={32} className="mx-auto mb-2 opacity-50" />
              <p>No services added yet</p>
              <Button size="sm" className="mt-3" onClick={() => setShowAddService(true)}>
                Add Your First Service
              </Button>
            </div>
          )}
        </div>

        {/* Service Editor Modal */}
        {(editingService || showAddService) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <h4 className="text-lg font-semibold mb-4">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h4>
              
              <ServiceEditor
                service={editingService || undefined}
                categories={categories}
                onSave={editingService ? handleUpdateService : handleAddService}
                onCancel={() => {
                  setEditingService(null);
                  setShowAddService(false);
                }}
              />
            </div>
          </div>
        )}

        {/* Preview Section */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold mb-2">Preview</h4>
          <div className="border rounded-lg p-4 bg-muted/20">
            {services.length > 0 ? (
              <div className={`grid gap-4 ${
                columns === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
                columns === 2 ? 'grid-cols-1 lg:grid-cols-2' :
                'grid-cols-1'
              }`}>
                {services.slice(0, 2).map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    isEditing={false}
                    showRatings={showRatings}
                    featuredBadgeText={featuredBadgeText}
                    popularBadgeText={popularBadgeText}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                Add services to see preview
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Service Editor component
function ServiceEditor({ 
  service, 
  categories, 
  onSave, 
  onCancel 
}: { 
  service?: Service; 
  categories: string[]; 
  onSave: (service: Service) => void; 
  onCancel: () => void; 
}) {
  const [formData, setFormData] = useState<Service>(
    service || {
      id: `service_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`, // Generate new ID here if no service is provided
      title: '',
      title: '',
      description: '',
      price: '',
      duration: '',
      category: categories[0] || '',
      image: '',
      icon: '',
      featured: false,
      rating: 0,
      reviewCount: 0,
      popular: false,
      bookingUrl: '',
      tags: []
    }
  );

  const handleChange = (field: keyof Service, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Auto-detect popular services (rating >= 4.5)
    const updatedService = {
      ...formData,
      popular: formData.rating ? formData.rating >= 4.5 : false
    };
    onSave(updatedService);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Service Title *</Label>
          <Input
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Service title"
          />
        </div>
        <div>
          <Label>Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => handleChange('category', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Description</Label>
        <TextareaAutosize
          value={formData.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Service description..."
          minRows={3}
          className="w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Price</Label>
          <Input
            value={formData.price || ''}
            onChange={(e) => handleChange('price', e.target.value)}
            placeholder="$99"
          />
        </div>
        <div>
          <Label>Duration</Label>
          <Input
            value={formData.duration || ''}
            onChange={(e) => handleChange('duration', e.target.value)}
            placeholder="1 hour"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Image URL</Label>
          <Input
            type="url"
            value={formData.image || ''}
            onChange={(e) => handleChange('image', e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <div>
          <Label>Icon (emoji)</Label>
          <Input
            value={formData.icon || ''}
            onChange={(e) => handleChange('icon', e.target.value)}
            placeholder="🛠️"
          />
        </div>
      </div>

      <div>
        <Label>Booking URL</Label>
        <Input
          type="url"
          value={formData.bookingUrl || ''}
          onChange={(e) => handleChange('bookingUrl', e.target.value)}
          placeholder="https://calendly.com/..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Rating (0-5)</Label>
          <Input
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={formData.rating || 0}
            onChange={(e) => handleChange('rating', parseFloat(e.target.value) || 0)}
          />
        </div>
        <div>
          <Label>Review Count</Label>
          <Input
            type="number"
            min="0"
            value={formData.reviewCount || 0}
            onChange={(e) => handleChange('reviewCount', parseInt(e.target.value) || 0)}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={formData.featured || false}
          onCheckedChange={(checked) => handleChange('featured', checked)}
        />
        <Label>Feature this service</Label>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          <Check size={16} className="mr-2" />
          {service ? 'Update' : 'Add'} Service
        </Button>
      </div>
    </div>
  );
}