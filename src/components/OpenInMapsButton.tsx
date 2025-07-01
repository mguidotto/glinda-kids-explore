
import { MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCapacitor } from "@/hooks/useCapacitor";

interface OpenInMapsButtonProps {
  address: string;
  latitude?: number;
  longitude?: number;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

const OpenInMapsButton = ({ 
  address, 
  latitude,
  longitude,
  className = "", 
  variant = "outline",
  size = "sm"
}: OpenInMapsButtonProps) => {
  const { isNative } = useCapacitor();

  const handleOpenInMaps = () => {
    if (isNative && latitude && longitude) {
      // Use native maps app
      const nativeUrl = `geo:${latitude},${longitude}?q=${encodeURIComponent(address)}`;
      window.open(nativeUrl, '_system');
    } else {
      // Fallback to Google Maps web
      const encodedAddress = encodeURIComponent(address);
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
      window.open(googleMapsUrl, '_blank');
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleOpenInMaps}
      className={className}
    >
      <MapPin className="h-4 w-4 mr-2" />
      Indicazioni
      <ExternalLink className="h-3 w-3 ml-1" />
    </Button>
  );
};

export default OpenInMapsButton;
