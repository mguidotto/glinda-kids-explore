
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Eye, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useContentUrl } from "@/hooks/useContentUrl";
import EventDateTime from "@/components/EventDateTime";

interface ContentCardProps {
  id: string;
  title: string;
  description?: string | null;
  city?: string | null;
  price_from?: number | null;
  price_to?: number | null;
  featured_image?: string | null;
  category?: { name: string; slug: string; color?: string | null } | null;
  slug?: string | null;
  eventDate?: string | null;
  eventTime?: string | null;
  eventEndDate?: string | null;
  eventEndTime?: string | null;
}

const ContentCard = ({
  id,
  title,
  description,
  city,
  price_from,
  price_to,
  featured_image,
  category,
  slug,
  eventDate,
  eventTime,
  eventEndDate,
  eventEndTime
}: ContentCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { getContentUrl } = useContentUrl();

  const contentUrl = getContentUrl({ id, slug, categories: category });

  const formatPrice = () => {
    if (!price_from && !price_to) return null;
    
    if (price_from && price_to && price_from !== price_to) {
      return `€${price_from} - €${price_to}`;
    }
    
    return `€${price_from || price_to}`;
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden h-full">
      <Link to={contentUrl} className="block h-full">
        <div className="relative">
          {/* Image */}
          <div className="aspect-[4/3] overflow-hidden bg-gray-100">
            {featured_image && !imageError ? (
              <img
                src={featured_image}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => setImageError(true)}
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <Eye className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow-sm transition-colors z-10"
            aria-label={isFavorite ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                isFavorite ? "text-red-500 fill-current" : "text-gray-600"
              }`}
            />
          </button>

          {/* Category Badge */}
          {category && (
            <div className="absolute top-3 left-3">
              <Badge
                variant="secondary"
                className="text-xs font-medium shadow-sm"
                style={{
                  backgroundColor: category.color ? `${category.color}` : undefined,
                  color: category.color ? 'white' : undefined,
                }}
              >
                {category.name}
              </Badge>
            </div>
          )}

          {/* Price Badge */}
          {formatPrice() && (
            <div className="absolute bottom-3 left-3">
              <Badge className="bg-white text-gray-900 font-semibold shadow-sm">
                {formatPrice()}
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4 flex-1 flex flex-col">
          <div className="space-y-3 flex-1">
            {/* Title */}
            <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
              {title}
            </h3>

            {/* Event Date/Time */}
            <EventDateTime
              eventDate={eventDate}
              eventTime={eventTime}
              eventEndDate={eventEndDate}
              eventEndTime={eventEndTime}
            />

            {/* Description */}
            {description && (
              <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                {description}
              </p>
            )}

            {/* Location */}
            {city && (
              <div className="flex items-center gap-1 text-gray-500">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm truncate">{city}</span>
              </div>
            )}
          </div>

          {/* Footer with Rating */}
          <div className="flex items-center justify-between pt-3 mt-auto border-t border-gray-100">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">4.5</span>
              <span className="text-sm text-gray-500">(12)</span>
            </div>
            <span className="text-xs text-gray-400">Clicca per vedere</span>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default ContentCard;
