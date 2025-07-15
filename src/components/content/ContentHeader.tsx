
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, Euro } from "lucide-react";
import EventDateTime from "@/components/EventDateTime";

interface ContentHeaderProps {
  title: string;
  description?: string | null;
  city?: string | null;
  address?: string | null;
  modality?: string | null;
  price_from?: number | null;
  price_to?: number | null;
  category?: { name: string; slug: string; color?: string | null } | null;
  tags?: Array<{ id: string; name: string; slug: string }> | null;
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
  eventDate,
  eventTime,
  eventEndDate,
  eventEndTime
}: ContentHeaderProps) => {
  const formatModality = (modality: string) => {
    switch (modality) {
      case 'presenza':
        return 'In Presenza';
      case 'online':
        return 'Online';
      case 'ibrido':
        return 'Ibrida';
      default:
        return modality;
    }
  };

  const formatPrice = () => {
    if (price_from && price_to) {
      return `€${price_from} - €${price_to}`;
    } else if (price_from) {
      return `Da €${price_from}`;
    } else if (price_to) {
      return `Fino a €${price_to}`;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Category and Title */}
      <div className="space-y-4">
        {category && (
          <div className="flex items-center gap-2">
            <Badge 
              variant="secondary" 
              className="text-sm font-medium"
              style={{ backgroundColor: category.color ? `${category.color}20` : undefined }}
            >
              {category.name}
            </Badge>
            {/* Only show modality if it exists */}
            {modality && (
              <Badge variant="outline" className="text-sm">
                <Users className="h-3 w-3 mr-1" />
                {formatModality(modality)}
              </Badge>
            )}
          </div>
        )}
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
          {title}
        </h1>
      </div>

      {/* Event Date/Time */}
      {(eventDate || eventTime) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-blue-800">Data e Ora Evento</span>
          </div>
          <EventDateTime
            eventDate={eventDate}
            eventTime={eventTime}
            eventEndDate={eventEndDate}
            eventEndTime={eventEndTime}
          />
        </div>
      )}

      {/* Description */}
      {description && (
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {description}
          </p>
        </div>
      )}

      {/* Location and Price Info */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
        {(city || address) && (
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>
              {address && city ? `${address}, ${city}` : address || city}
            </span>
          </div>
        )}
        
        {formatPrice() && (
          <div className="flex items-center gap-1">
            <Euro className="h-4 w-4" />
            <span className="font-medium">{formatPrice()}</span>
          </div>
        )}
      </div>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag.id} variant="outline" className="text-xs">
              #{tag.name}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentHeader;
