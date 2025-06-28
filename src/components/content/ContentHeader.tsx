
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CardTitle } from "@/components/ui/card";
import FavoriteButton from "@/components/FavoriteButton";
import ShareButton from "@/components/ShareButton";

interface ContentHeaderProps {
  title: string;
  city: string;
  categoryName: string;
  contentId: string;
  currentUrl: string;
  description: string;
}

const ContentHeader = ({ 
  title, 
  city, 
  categoryName, 
  contentId, 
  currentUrl, 
  description 
}: ContentHeaderProps) => {
  return (
    <div className="flex items-start justify-between">
      <div>
        <CardTitle className="text-2xl mb-2">{title}</CardTitle>
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {city}
          </div>
          <Badge className="capitalize">
            {categoryName}
          </Badge>
        </div>
      </div>
      <div className="flex gap-2">
        <FavoriteButton contentId={contentId} />
        <ShareButton 
          url={currentUrl}
          title={title}
          description={description}
        />
      </div>
    </div>
  );
};

export default ContentHeader;
