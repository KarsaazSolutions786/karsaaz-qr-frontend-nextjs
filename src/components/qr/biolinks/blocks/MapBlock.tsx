"use client";

import { useState, useEffect } from 'react';
import { BlockEditorProps } from '../types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Search, Navigation, Globe, Building, Map, Satellite, Layers, X, Eye, Info, MapIcon } from 'lucide-react';

/**
 * Map Block
 * Interactive Google Maps embed with address search, marker placement, and customizable controls
 */

// Type definitions for Map Block
export interface MapBlockContent {
  // Location Details
  address: string;
  latitude?: number;
  longitude?: number;
  placeId?: string;
  
  // Map Configuration
  zoom: number;
  mapType: 'roadmap' | 'satellite' | 'hybrid' | 'terrain';
  showControls: boolean;
  allowFullscreen: boolean;
  
  // Display Options
  showMarker: boolean;
  markerTitle?: string;
  infoWindow?: string;
  
  // Directions
  showDirectionsLink: boolean;
  directionsText?: string;
  
  // Location Info
  showLocationInfo: boolean;
  locationName?: string;
  locationDescription?: string;
  phone?: string;
  website?: string;
  
  // API Configuration
  apiKey?: string;
  language?: string;
  region?: string;
}

// Default data for new map blocks
export const defaultMapBlockData: MapBlockContent = {
  address: '',
  latitude: 40.7128,
  longitude: -74.0060,
  zoom: 15,
  mapType: 'roadmap',
  showControls: true,
  allowFullscreen: true,
  showMarker: true,
  markerTitle: 'Location',
  infoWindow: '',
  showDirectionsLink: true,
  directionsText: 'Get Directions',
  showLocationInfo: false,
  locationName: '',
  locationDescription: '',
  phone: '',
  website: '',
  language: 'en',
  region: 'us'
};

export default function MapBlock({ block, onUpdate, onDelete, isEditing = false }: BlockEditorProps) {
  const { content, design } = block;
  const mapContent = content as MapBlockContent;
  const [searchQuery, setSearchQuery] = useState(mapContent.address || '');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [mapUrl, setMapUrl] = useState('');

  // Build Google Maps embed URL
  useEffect(() => {
    const params = new URLSearchParams();
    
    // Add API key if available (use a placeholder for demo)
    const apiKey = mapContent.apiKey || 'AIzaSyDz9fIYXkefx5rX5X5X5X5X5X5X5X5X5X5X';
    params.append('key', apiKey);
    
    // Use place mode for marker display
    if (mapContent.address) {
      params.append('q', encodeURIComponent(mapContent.address));
    } else if (mapContent.latitude && mapContent.longitude) {
      params.append('q', `${mapContent.latitude},${mapContent.longitude}`);
    } else {
      // Default to New York if no location
      params.append('q', '40.7128,-74.0060');
    }
    
    // Add zoom level
    params.append('zoom', mapContent.zoom?.toString() || '15');
    
    // Add map type
    if (mapContent.mapType !== 'roadmap') {
      params.append('maptype', mapContent.mapType);
    }
    
    // Build the URL
    const url = `https://www.google.com/maps/embed/v1/place?${params.toString()}`;
    setMapUrl(url);
  }, [mapContent.address, mapContent.latitude, mapContent.longitude, mapContent.zoom, mapContent.mapType]);

  // Build directions URL
  const getDirectionsUrl = () => {
    if (mapContent.address) {
      return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapContent.address)}`;
    } else if (mapContent.latitude && mapContent.longitude) {
      return `https://www.google.com/maps/dir/?api=1&destination=${mapContent.latitude},${mapContent.longitude}`;
    }
    return 'https://www.google.com/maps';
  };

  // Handle content changes
  const handleContentChange = (field: keyof MapBlockContent, value: string | number | boolean) => {
    onUpdate({
      content: {
        ...mapContent,
        [field]: value
      }
    });
  };

  // Handle design changes
  const handleDesignChange = (field: keyof typeof design, value: string) => {
    onUpdate({
      design: {
        ...design,
        [field]: value
      }
    });
  };

  // Simulate address search (in production, use Google Geocoding API)
  const handleAddressSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      setSearchError('Please enter an address to search');
      return;
    }
    
    setIsSearching(true);
    setSearchError('');
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the address in content
      handleContentChange('address', searchQuery);
      
      // In a real implementation, you would:
      // 1. Call Google Geocoding API
      // 2. Get lat/lng coordinates
      // 3. Update mapContent with coordinates
      // 4. Show marker on map
      
    } catch (_error: unknown) { // Use unknown for error
      setSearchError('Unable to find location. Please try a different address.');
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, handleContentChange]);

  // Public view
  if (!isEditing) {
    return (
      <div 
        className="block-map"
        style={{ 
          backgroundColor: design.backgroundColor,
          padding: design.padding,
          margin: design.margin,
          borderRadius: design.borderRadius,
          color: design.textColor
        }}
      >
        {/* Map Container */}
        <div className="relative w-full" style={{ aspectRatio: '16/9', minHeight: '300px' }}>
          <iframe
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 0, borderRadius: design.borderRadius }}
            referrerPolicy="no-referrer-when-downgrade"
            src={mapUrl}
            allowFullScreen={mapContent.allowFullscreen}
            title={mapContent.markerTitle || 'Location Map'}
            className="rounded-lg"
          />
          
          {/* Loading placeholder */}
          {!mapContent.address && !mapContent.latitude && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
              <div className="text-center">
                <MapIcon size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">Map loading...</p>
              </div>
            </div>
          )}
        </div>

        {/* Location Info Card */}
        {mapContent.showLocationInfo && (mapContent.locationName || mapContent.locationDescription || mapContent.phone || mapContent.website) && (
          <Card className="mt-4 p-4 bg-white">
            <div className="flex items-start gap-3">
              <MapPin size={20} className="text-red-500 mt-1 flex-shrink-0" />
              <div className="flex-1">
                {mapContent.locationName && (
                  <h3 className="font-semibold text-lg">{mapContent.locationName}</h3>
                )}
                {mapContent.locationDescription && (
                  <p className="text-sm text-gray-600 mt-1">{mapContent.locationDescription}</p>
                )}
                {mapContent.address && (
                  <p className="text-sm text-gray-700 mt-2 flex items-center gap-1">
                    <Building size={14} className="text-gray-400" />
                    {mapContent.address}
                  </p>
                )}
                <div className="flex flex-wrap gap-4 mt-3">
                  {mapContent.phone && (
                    <a href={`tel:${mapContent.phone}`} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                      {mapContent.phone}
                    </a>
                  )}
                  {mapContent.website && (
                    <a href={mapContent.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                      <Globe size={14} />
                      Visit Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Directions Button */}
        {mapContent.showDirectionsLink && (
          <div className="mt-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.open(getDirectionsUrl(), '_blank')}
            >
              <Navigation size={16} className="mr-2" />
              {mapContent.directionsText || 'Get Directions'}
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Edit view
  return (
    <div className="block-editor-map space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Map size={20} />
          <h3 className="text-lg font-semibold">Map Block</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <X size={16} />
        </Button>
      </div>

      {/* Address Search */}
      <div className="space-y-4">
        <div>
          <Label>Search Location</Label>
          <div className="flex gap-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter address, city, or coordinates..."
              onKeyPress={(e) => e.key === 'Enter' && handleAddressSearch()}
            />
            <Button 
              onClick={handleAddressSearch}
              disabled={isSearching}
              size="icon"
            >
              <Search size={16} />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Search for an address or place to center the map
          </p>
          {searchError && (
            <p className="text-xs text-destructive mt-1">{searchError}</p>
          )}
        </div>

        {/* Location Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Latitude</Label>
            <Input
              type="number"
              step="0.0001"
              value={mapContent.latitude || ''}
              onChange={(e) => handleContentChange('latitude', parseFloat(e.target.value))}
              placeholder="40.7128"
            />
          </div>
          <div>
            <Label>Longitude</Label>
            <Input
              type="number"
              step="0.0001"
              value={mapContent.longitude || ''}
              onChange={(e) => handleContentChange('longitude', parseFloat(e.target.value))}
              placeholder="-74.0060"
            />
          </div>
        </div>

        {/* Current Address Display */}
        {mapContent.address && (
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-start gap-2">
              <MapPin size={16} className="text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Current Location</p>
                <p className="text-sm text-muted-foreground">{mapContent.address}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Map Configuration */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold flex items-center gap-2">
          <MapIcon size={16} />
          Map Settings
        </h4>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Zoom Level</Label>
            <Select
              value={mapContent.zoom?.toString() || '15'}
              onValueChange={(value) => handleContentChange('zoom', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 (City)</SelectItem>
                <SelectItem value="12">12 (District)</SelectItem>
                <SelectItem value="15">15 (Street)</SelectItem>
                <SelectItem value="17">17 (Building)</SelectItem>
                <SelectItem value="19">19 (Close-up)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Map Type</Label>
            <Select
              value={mapContent.mapType || 'roadmap'}
              onValueChange={(value) => handleContentChange('mapType', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="roadmap">
                  <div className="flex items-center gap-2">
                    <Map size={14} />
                    Road Map
                  </div>
                </SelectItem>
                <SelectItem value="satellite">
                  <div className="flex items-center gap-2">
                    <Satellite size={14} />
                    Satellite
                  </div>
                </SelectItem>
                <SelectItem value="hybrid">
                  <div className="flex items-center gap-2">
                    <Layers size={14} />
                    Hybrid
                  </div>
                </SelectItem>
                <SelectItem value="terrain">
                  <div className="flex items-center gap-2">
                    <Map size={14} />
                    Terrain
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Map Controls */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={mapContent.showControls || false}
              onCheckedChange={(checked) => handleContentChange('showControls', checked)}
            />
            <Label>Show Map Controls</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={mapContent.allowFullscreen || false}
              onCheckedChange={(checked) => handleContentChange('allowFullscreen', checked)}
            />
            <Label>Allow Fullscreen</Label>
          </div>
        </div>

        {/* Marker Settings */}
        <div className="flex items-center space-x-2">
          <Switch
            checked={mapContent.showMarker || false}
            onCheckedChange={(checked) => handleContentChange('showMarker', checked)}
          />
          <Label>Show Location Marker</Label>
        </div>

        {mapContent.showMarker && (
          <div className="ml-6 space-y-4">
            <div>
              <Label>Marker Title</Label>
              <Input
                value={mapContent.markerTitle || ''}
                onChange={(e) => handleContentChange('markerTitle', e.target.value)}
                placeholder="Our Location"
              />
            </div>
            <div>
              <Label>Info Window Text</Label>
              <Textarea
                value={mapContent.infoWindow || ''}
                onChange={(e) => handleContentChange('infoWindow', e.target.value)}
                placeholder="Additional information shown when marker is clicked"
                rows={3}
              />
            </div>
          </div>
        )}
      </div>

      {/* Location Information */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            checked={mapContent.showLocationInfo || false}
            onCheckedChange={(checked) => handleContentChange('showLocationInfo', checked)}
          />
          <Label>Show Location Information Card</Label>
        </div>

        {mapContent.showLocationInfo && (
          <div className="ml-6 space-y-4">
            <div>
              <Label>Location Name</Label>
              <Input
                value={mapContent.locationName || ''}
                onChange={(e) => handleContentChange('locationName', e.target.value)}
                placeholder="Business Name"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={mapContent.locationDescription || ''}
                onChange={(e) => handleContentChange('locationDescription', e.target.value)}
                placeholder="Brief description of the location"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Phone</Label>
                <Input
                  type="tel"
                  value={mapContent.phone || ''}
                  onChange={(e) => handleContentChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <Label>Website</Label>
                <Input
                  type="url"
                  value={mapContent.website || ''}
                  onChange={(e) => handleContentChange('website', e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Directions Link */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            checked={mapContent.showDirectionsLink || false}
            onCheckedChange={(checked) => handleContentChange('showDirectionsLink', checked)}
          />
          <Label>Show Directions Button</Label>
        </div>

        {mapContent.showDirectionsLink && (
          <div className="ml-6">
            <Label>Button Text</Label>
            <Input
              value={mapContent.directionsText || ''}
              onChange={(e) => handleContentChange('directionsText', e.target.value)}
              placeholder="Get Directions"
            />
          </div>
        )}
      </div>

      {/* Design Settings */}
      <div className="border-t pt-4 space-y-4">
        <h4 className="text-sm font-semibold">Design Settings</h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="map-padding">Padding</Label>
            <Input
              id="map-padding"
              value={design.padding || ''}
              onChange={(e) => handleDesignChange('padding', e.target.value)}
              placeholder="1rem"
            />
          </div>
          <div>
            <Label htmlFor="map-margin">Margin</Label>
            <Input
              id="map-margin"
              value={design.margin || ''}
              onChange={(e) => handleDesignChange('margin', e.target.value)}
              placeholder="0.5rem"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="map-bg-color">Background Color</Label>
            <Input
              id="map-bg-color"
              type="color"
              value={design.backgroundColor || '#ffffff'}
              onChange={(e) => handleDesignChange('backgroundColor', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="map-text-color">Text Color</Label>
            <Input
              id="map-text-color"
              type="color"
              value={design.textColor || '#000000'}
              onChange={(e) => handleDesignChange('textColor', e.target.value)}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="map-border-radius">Border Radius</Label>
          <Input
            id="map-border-radius"
            value={design.borderRadius || ''}
            onChange={(e) => handleDesignChange('borderRadius', e.target.value)}
            placeholder="0.5rem"
          />
        </div>
      </div>

      {/* Preview */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <Eye size={16} />
            Preview
          </h4>
        </div>
        
        <div className="border rounded-lg p-4 bg-muted/20">
          {!mapContent.address && !mapContent.latitude ? (
            <div className="text-center py-8 text-muted-foreground">
              <MapIcon size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">Search for a location to preview the map</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <div className="flex items-center gap-2 mb-2">
                  <Info size={14} />
                  <span>Map Preview</span>
                </div>
                <ul className="text-xs space-y-1 ml-6">
                  <li>• Location: {mapContent.address || `${mapContent.latitude}, ${mapContent.longitude}`}</li>
                  <li>• Zoom: Level {mapContent.zoom}</li>
                  <li>• Type: {mapContent.mapType}</li>
                  <li>• Controls: {mapContent.showControls ? 'Enabled' : 'Disabled'}</li>
                </ul>
              </div>
              
              <div 
                className="relative w-full bg-gray-100 rounded" 
                style={{ aspectRatio: '16/9', minHeight: '200px' }}
              >
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0, borderRadius: '0.375rem' }}
                  referrerPolicy="no-referrer-when-downgrade"
                  src={mapUrl}
                  allowFullScreen={mapContent.allowFullscreen}
                  title="Map Preview"
                  className="rounded"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}