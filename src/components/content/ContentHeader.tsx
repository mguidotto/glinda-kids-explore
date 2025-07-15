
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Globe, Clock, Star } from "lucide-react";
import EventDateTime from "@/components/EventDateTime";

interface ContentHeaderProps {
  title: string;
  description?: string | null;
  city?: string | null;
  address?: string | null;
  modality: string;
  price_from?: number | null;
  price_to?: number | null;
  category?: { name: string; color?: string | null } | null;
  tags?: Array<{ name: string }> | null;
  rating?: number | null;
  reviewCount?: number;
  eventDate?: string | null;
  eventTime?: string | null;
  eventEndDate?: string | null;
  eventEndTime?: string | null;
}

const ContentHeader = ({
  title,
  description,
  city,
  address,
  modality,
  price_from,
  price_to,
  category,
  tags,
  rating,
  reviewCount = 0,
  eventDate,
  eventTime,
  eventEndDate,
  eventEndTime
}: ContentHeaderProps) => {
  const getModalityIcon = () => {
    switch (modality) {
      case 'online':
        return <Globe className="h-4 w-4" />;
      case 'ibrido':
        return <Users className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const getModalityText = () => {
    switch (modality) {
      case 'online':
        return 'Online';
      case 'ibrido':
        return 'Modalità Ibrida';
      default:
        return 'In Presenza';
    }
  };

  const formatPrice = () => {
    if (!price_from && !price_to) return null;
    
    if (price_from && price_to && price_from !== price_to) {
      return `€${price_from} - €${price_to}`;
    }
    
    return `€${price_from || price_to}`;
  };

  // Show "Online" for online content, otherwise show city
  const getLocationDisplay = () => {
    if (modality === 'online') {
      return 'Online';
    }
    return city;
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{title}</h1>
        
        {/* Event Date/Time */}
        <EventDateTime
          eventDate={eventDate}
          eventTime={eventTime}
          eventEndDate={eventEndDate}
          eventEndTime={eventEndTime}
          className="mb-3"
        />
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Category */}
          {category && (
            <Badge 
              variant="secondary" 
              className="text-sm"
              style={{ 
                backgroundColor: category.color ? `${category.color}20` : undefined,
                color: category.color || undefined,
                borderColor: category.color || undefined
              }}
            >
              {category.name}
            </Badge>
          )}
          
          {/* Modality */}
          <div className="flex items-center gap-1 text-gray-600">
            {getModalityIcon()}
            <span className="text-sm">{getModalityText()}</span>
          </div>
          
          {/* Location */}
          <div className="flex items-center gap-1 text-gray-600">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{getLocationDisplay()}</span>
          </div>
          
          {/* Price */}
          {formatPrice() && (
            <Badge variant="outline" className="text-sm font-semibold">
              {formatPrice()}
            </Badge>
          )}
          
          {/* Rating */}
          {rating && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">{rating.toFixed(1)}</span>
              <span className="text-sm text-gray-500">({reviewCount} recensioni)</span>
            </div>
          )}
        </div>
        
        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag.name}
              </Badge>
            ))}
          </div>
        )}
      </div>
      
      {/* Description */}
      {description && (
        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed">{description}</p>
        </div>
      )}
    </div>
  );
};

export default ContentHeader;
