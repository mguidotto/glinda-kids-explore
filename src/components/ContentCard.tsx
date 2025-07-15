
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Globe, Star, Calendar, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import FavoriteButton from "./FavoriteButton";
import { useContentUrl } from "@/hooks/useContentUrl";
import EventDateTime from "./EventDateTime";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ContentCardProps {
  id: string;
  title: string;
  description?: string | null;
  category?: { name: string; color?: string | null; slug?: string } | null;
  ageGroup?: string | null;
  location?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  price?: { from?: number | null; to?: number | null } | null;
  image?: string | null;
  distance?: number | null;
  purchasable?: boolean;
  featured?: boolean;
  slug?: string | null;
  city?: string | null;
  modality?: string;
  eventDate?: string | null;
  eventTime?: string | null;
  eventEndDate?: string | null;
  eventEndTime?: string | null;
}

const ContentCard = ({ 
  id, 
  title, 
  description, 
  category, 
  location, 
  address,
  latitude,
  longitude,
  price, 
  image, 
  distance,
  purchasable = false,
  featured = false,
  slug,
  city,
  modality = "presenza",
  eventDate,
  eventTime,
  eventEndDate,
  eventEndTime
}: ContentCardProps) => {
  const { getContentUrl } = useContentUrl();
  const contentUrl = getContentUrl({ id, slug, categories: category });
  
  const [reviewData, setReviewData] = useState<{ rating: number; count: number } | null>(null);

  // Use the uploaded placeholder image when no image is available
  const displayImage = image && image !== "/placeholder.svg" ? image : "/lovable-uploads/58bed68c-faa4-42ee-bbee-0abe592b0423.png";

  useEffect(() => {
    const fetchReviews = async () => {
      const { data: reviews } = await supabase
        .from('reviews')
        .select('rating')
        .eq('content_id', id)
        .eq('validated', true);

      if (reviews && reviews.length > 0) {
        const avgRating = reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length;
        setReviewData({
          rating: avgRating,
          count: reviews.length
        });
      }
    };

    fetchReviews();
  }, [id]);

  const getModalityIcon = () => {
    switch (modality) {
      case 'online':
        return <Globe className="h-3 w-3" />;
      case 'ibrido':
        return <Users className="h-3 w-3" />;
      default:
        return <MapPin className="h-3 w-3" />;
    }
  };

  const getModalityText = () => {
    switch (modality) {
      case 'online':
        return 'Online';
      case 'ibrido':
        return 'Ibrida';
      default:
        return 'In Presenza';
    }
  };

  const formatPrice = () => {
    if (!price?.from && !price?.to) return null;
    
    if (price.from && price.to && price.from !== price.to) {
      return `€${price.from} - €${price.to}`;
    }
    
    return `€${price.from || price.to}`;
  };

  // Show "Online" for online content, otherwise show city or location
  const getLocationDisplay = () => {
    if (modality === 'online') {
      return 'Online';
    }
    return city || location;
  };

  // Check if we should hide the modality label for "servizi educativi"
  const shouldHideModalityLabel = category?.name?.toLowerCase() === 'servizi educativi';

  return (
    <Link to={contentUrl} className="block">
      <Card className={`group hover:shadow-lg transition-all duration-200 cursor-pointer h-full ${featured ? 'ring-2 ring-blue-200' : ''}`}>
        <div className="relative">
          <div className="aspect-video overflow-hidden rounded-t-lg">
            <img 
              src={displayImage} 
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              loading="lazy"
            />
          </div>
          
          <div className="absolute top-3 right-3">
            <div onClick={(e) => e.preventDefault()}>
              <FavoriteButton contentId={id} />
            </div>
          </div>
          
          {featured && (
            <Badge className="absolute top-3 left-3 bg-blue-600 text-white">
              In Evidenza
            </Badge>
          )}
        </div>
        
        <CardContent className="p-4 flex flex-col flex-1">
          <div className="space-y-3 flex-1">
            {/* Category and Modality */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {category && (
                  <Badge 
                    variant="secondary" 
                    className="text-xs"
                    style={{ 
                      backgroundColor: category.color ? `${category.color}20` : undefined,
                      color: category.color || undefined,
                      borderColor: category.color || undefined
                    }}
                  >
                    {category.name}
                  </Badge>
                )}
              </div>
              
              {/* Modality - Hidden for "servizi educativi" */}
              {!shouldHideModalityLabel && (
                <div className="flex items-center gap-1 text-gray-500 text-xs">
                  {getModalityIcon()}
                  <span>{getModalityText()}</span>
                </div>
              )}
            </div>

            {/* Title */}
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
              {title}
            </h3>

            {/* Event Date/Time - Format human readable */}
            <EventDateTime
              eventDate={eventDate}
              eventTime={eventTime}
              eventEndDate={eventEndDate}
              eventEndTime={eventEndTime}
              className="text-xs"
            />

            {/* Description */}
            {description && (
              <p className="text-gray-600 text-sm line-clamp-2 flex-1">
                {description}
              </p>
            )}

            {/* Location and Distance */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{getLocationDisplay()}</span>
              </div>
              
              {distance && modality !== 'online' && (
                <span className="text-xs">{distance.toFixed(1)} km</span>
              )}
            </div>

            {/* Rating and Price */}
            <div className="flex items-center justify-between">
              {/* Show real reviews only if available */}
              {reviewData && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{reviewData.rating.toFixed(1)}</span>
                  <span className="text-sm text-gray-500">({reviewData.count})</span>
                </div>
              )}
              
              {formatPrice() && (
                <div className="text-right ml-auto">
                  <span className="font-semibold text-green-600">
                    {formatPrice()}
                  </span>
                  {purchasable && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      Acquistabile
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Discover More Button */}
          <div className="mt-4 flex justify-center">
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-[#8B4A6B] to-[#7BB3BD] hover:from-[#7A4060] hover:to-[#6BA3AD]"
              onClick={(e) => e.preventDefault()}
            >
              Scopri di più
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ContentCard;
