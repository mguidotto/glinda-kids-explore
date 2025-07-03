
import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Content {
  id: string;
  title: string;
  description?: string | null;
  category?: { name: string; color?: string | null } | null;
  city?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  price?: { from?: number | null; to?: number | null } | null;
  image?: string | null;
  slug?: string | null;
}

interface SearchMapViewProps {
  contents: Content[];
  onContentSelect?: (content: Content) => void;
  className?: string;
}

const SearchMapView: React.FC<SearchMapViewProps> = ({ 
  contents, 
  onContentSelect,
  className = "w-full h-96 rounded-lg"
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 45.4642, lng: 9.1900 }); // Default Milano

  // Filter contents that have coordinates
  const contentsWithCoords = contents.filter(c => c.latitude && c.longitude);

  useEffect(() => {
    if (contentsWithCoords.length > 0) {
      // Calculate center based on contents
      const avgLat = contentsWithCoords.reduce((sum, c) => sum + (c.latitude || 0), 0) / contentsWithCoords.length;
      const avgLng = contentsWithCoords.reduce((sum, c) => sum + (c.longitude || 0), 0) / contentsWithCoords.length;
      setMapCenter({ lat: avgLat, lng: avgLng });
    }
    setLoading(false);
  }, [contentsWithCoords]);

  const handleContentClick = (content: Content) => {
    setSelectedContent(content);
    if (onContentSelect) {
      onContentSelect(content);
    }
  };

  const formatPrice = (price?: { from?: number | null; to?: number | null } | null) => {
    if (!price?.from && !price?.to) return null;
    
    if (price.from && price.to && price.from !== price.to) {
      return `€${price.from} - €${price.to}`;
    }
    
    return `€${price.from || price.to}`;
  };

  if (loading) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 border rounded-lg`}>
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Caricamento mappa...</span>
        </div>
      </div>
    );
  }

  if (contentsWithCoords.length === 0) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 border rounded-lg`}>
        <div className="text-center text-gray-600">
          <MapPin className="h-8 w-8 mx-auto mb-2" />
          <p>Nessun contenuto con posizione disponibile</p>
        </div>
      </div>
    );
  }

  // Create OpenStreetMap embed URL
  const bounds = contentsWithCoords.reduce(
    (acc, content) => {
      const lat = content.latitude!;
      const lng = content.longitude!;
      return {
        minLat: Math.min(acc.minLat, lat),
        maxLat: Math.max(acc.maxLat, lat),
        minLng: Math.min(acc.minLng, lng),
        maxLng: Math.max(acc.maxLng, lng)
      };
    },
    {
      minLat: contentsWithCoords[0].latitude!,
      maxLat: contentsWithCoords[0].latitude!,
      minLng: contentsWithCoords[0].longitude!,
      maxLng: contentsWithCoords[0].longitude!
    }
  );

  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bounds.minLng},${bounds.minLat},${bounds.maxLng},${bounds.maxLat}&layer=mapnik`;

  return (
    <div className="space-y-4">
      <div className={className}>
        <iframe
          src={mapSrc}
          className="w-full h-full border-0 rounded-lg"
          title="Mappa delle attività"
          allowFullScreen
          loading="lazy"
        />
      </div>
      
      {/* Contents list below map */}
      <div className="grid gap-4 max-h-64 overflow-y-auto">
        {contentsWithCoords.map((content) => (
          <Card 
            key={content.id} 
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedContent?.id === content.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => handleContentClick(content)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {content.image && content.image !== "/placeholder.svg" && (
                  <img 
                    src={content.image} 
                    alt={content.title}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                )}
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{content.title}</h3>
                  
                  {content.category && (
                    <Badge 
                      variant="secondary" 
                      className="text-xs mt-1"
                      style={{ 
                        backgroundColor: content.category.color ? `${content.category.color}20` : undefined,
                        color: content.category.color || undefined
                      }}
                    >
                      {content.category.name}
                    </Badge>
                  )}
                  
                  <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                    <MapPin className="h-3 w-3" />
                    <span>{content.city}</span>
                  </div>
                  
                  {formatPrice(content.price) && (
                    <div className="text-xs font-semibold text-green-600 mt-1">
                      {formatPrice(content.price)}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SearchMapView;
