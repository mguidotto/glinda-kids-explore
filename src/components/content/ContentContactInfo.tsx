
import { MapPin } from "lucide-react";

interface ContentContactInfoProps {
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  hasValidAddress: boolean;
}

const ContentContactInfo = ({ 
  address, 
  phone, 
  email, 
  website, 
  hasValidAddress 
}: ContentContactInfoProps) => {
  return (
    <div className="space-y-2 text-sm text-gray-600">
      {hasValidAddress && address && (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>{address}</span>
        </div>
      )}
      {phone && (
        <div>
          <strong>Telefono:</strong> {phone}
        </div>
      )}
      {email && (
        <div>
          <strong>Email:</strong> {email}
        </div>
      )}
      {website && (
        <div>
          <strong>Sito web:</strong> 
          <a href={website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
            {website}
          </a>
        </div>
      )}
    </div>
  );
};

export default ContentContactInfo;
