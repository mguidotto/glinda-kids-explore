
import { MapPin } from "lucide-react";

interface ContentContactInfoProps {
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  provider?: {
    business_name: string;
    verified: boolean;
    phone?: string;
    email?: string;
    website?: string;
  } | null;
}

const ContentContactInfo = ({ 
  address, 
  phone, 
  email, 
  website, 
  provider 
}: ContentContactInfoProps) => {
  const hasValidAddress = address && address.trim() !== '';

  return (
    <div className="space-y-2 text-sm text-gray-600">
      {hasValidAddress && (
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
      {provider && (
        <div>
          <strong>Provider:</strong> {provider.business_name}
          {provider.verified && <span className="text-green-600 ml-1">(Verificato)</span>}
        </div>
      )}
    </div>
  );
};

export default ContentContactInfo;
