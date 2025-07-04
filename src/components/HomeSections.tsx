import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Users, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useContentUrl } from "@/hooks/useContentUrl";

type ContentItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  city: string;
  price: number;
  image: string;
  rating: number | null;
  reviews: number | null;
  provider: string;
  duration?: number;
  participants?: number;
  price_from?: number;
  payment_type?: string;
  slug?: string | null;
  categories?: { slug: string } | null;
};

type HomeSectionProps = {
  title: string;
  subtitle?: string;
  contents: ContentItem[];
  sectionType?: 'featured' | 'cities' | 'summer' | 'nidi';
  onViewAll?: () => void;
};

const ContentItemCard = ({ content }: { content: ContentItem }) => {
  const { getContentUrl } = useContentUrl();
  const shouldShowPrice = content.price_from && content.payment_type !== 'free';
  const shouldShowRating = content.rating && content.reviews;

  return (
    <Link to={getContentUrl(content)} className="block">
      <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md overflow-hidden h-full cursor-pointer">
        <div className="relative">
          <img 
            src={content.image} 
            alt={content.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            <Badge className="bg-white/90 text-gray-800 hover:bg-white">
              {content.category}
            </Badge>
          </div>
          {shouldShowRating && (
            <div className="absolute top-3 right-3">
              <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{content.rating}</span>
              </div>
            </div>
          )}
        </div>
        <CardContent className="p-4 flex flex-col flex-1">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-[#8B4A6B] transition-colors">
            {content.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-1">
            {content.description}
          </p>
          
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{content.city}</span>
            </div>
            {content.duration && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{content.duration}min</span>
              </div>
            )}
            {content.participants && (
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>Max {content.participants}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div>
              {shouldShowPrice ? (
                <>
                  <div className="text-sm text-gray-500">Da</div>
                  <div className="font-bold text-[#8B4A6B] text-lg">€{content.price_from}</div>
                </>
              ) : (
                <div className="h-6"></div>
              )}
            </div>
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-[#8B4A6B] to-[#7BB3BD] hover:from-[#7A4060] hover:to-[#6BA3AD]"
              onClick={(e) => e.preventDefault()} // Prevent double navigation since card is already clickable
            >
              Scopri di più
            </Button>
          </div>
          
          {shouldShowRating && (
            <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
              <span>{content.reviews} recensioni</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

const HomeSection = ({ title, subtitle, contents, sectionType = 'featured', onViewAll }: HomeSectionProps) => {
  const getGradientClass = () => {
    switch (sectionType) {
      case 'nidi':
        return 'bg-gradient-to-r from-blue-50 to-cyan-50';
      case 'summer':
        return 'bg-gradient-to-r from-orange-50 to-yellow-50';
      case 'cities':
        return 'bg-gradient-to-r from-green-50 to-teal-50';
      default:
        return 'bg-gradient-to-r from-pink-50 to-purple-50';
    }
  };

  return (
    <section className={`py-12 ${getGradientClass()}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
          {subtitle && (
            <p className="text-lg text-gray-600">{subtitle}</p>
          )}
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {contents.map((content) => (
            <ContentItemCard key={content.id} content={content} />
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Button 
            variant="outline" 
            size="lg"
            className="border-[#8B4A6B] text-[#8B4A6B] hover:bg-[#8B4A6B] hover:text-white"
            onClick={onViewAll}
          >
            Vedi tutti
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HomeSection;
export { ContentItemCard };
