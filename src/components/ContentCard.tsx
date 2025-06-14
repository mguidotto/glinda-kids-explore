
import { Heart, MapPin, Star, Users, Calendar, Euro } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Content {
  id: number;
  title: string;
  description: string;
  category: string;
  ageGroup: string;
  price: number;
  location: string;
  rating: number;
  reviews: number;
  image: string;
  mode: string;
  provider: string;
}

interface ContentCardProps {
  content: Content;
}

const ContentCard = ({ content }: ContentCardProps) => {
  const getCategoryColor = (category: string) => {
    const colors = {
      corsi: "bg-blue-100 text-blue-800",
      eventi: "bg-green-100 text-green-800",
      servizi: "bg-purple-100 text-purple-800",
      "centri-estivi": "bg-orange-100 text-orange-800",
      centri: "bg-pink-100 text-pink-800"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white border-0 shadow-sm">
      <div className="relative">
        <img 
          src={content.image} 
          alt={content.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white p-2"
        >
          <Heart className="h-4 w-4" />
        </Button>
        <Badge className={`absolute top-2 left-2 ${getCategoryColor(content.category)}`}>
          {content.category === 'corsi' && 'Corso'}
          {content.category === 'eventi' && 'Evento'}
          {content.category === 'servizi' && 'Servizio'}
          {content.category === 'centri-estivi' && 'Centro Estivo'}
          {content.category === 'centri' && 'Centro'}
        </Badge>
      </div>
      
      <CardContent className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-lg mb-1 group-hover:text-orange-600 transition-colors line-clamp-2">
            {content.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {content.description}
          </p>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline" className="text-xs">
            {content.ageGroup}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {content.mode === 'presenza' ? 'In Presenza' : 'Online'}
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{content.location}</span>
          </div>
          
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Users className="h-3 w-3" />
            <span className="truncate">{content.provider}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="font-medium text-sm">{content.rating}</span>
              <span className="text-xs text-gray-500">({content.reviews})</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Euro className="h-4 w-4 text-green-600" />
            <span className="font-bold text-lg text-green-600">
              {content.price}€
            </span>
          </div>
          <Button size="sm" className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
            Dettagli
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentCard;
