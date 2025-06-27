
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Loader2, Target, X } from "lucide-react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LocationSearchProps {
  onLocationSelect: (latitude: number, longitude: number, address?: string) => void;
  className?: string;
  onClose?: () => void;
  currentLocation?: {
    latitude: number;
    longitude: number;
    address?: string;
  } | null;
  onClearLocation?: () => void;
}

const LocationSearch = ({ 
  onLocationSelect, 
  className,
  onClose,
  currentLocation,
  onClearLocation
}: LocationSearchProps) => {
  const [address, setAddress] = useState("");
  const [geocoding, setGeocoding] = useState(false);
  const { latitude, longitude, error, loading, getCurrentPosition } = useGeolocation();

  const handleCurrentLocation = () => {
    getCurrentPosition();
  };

  const handleAddressSearch = async () => {
    if (!address.trim()) return;

    setGeocoding(true);
    try {
      // Using a free geocoding service (Nominatim)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        onLocationSelect(
          parseFloat(result.lat),
          parseFloat(result.lon),
          result.display_name
        );
      } else {
        alert("Indirizzo non trovato");
      }
    } catch (error) {
      console.error("Errore nella geocodifica:", error);
      alert("Errore nella ricerca dell'indirizzo");
    } finally {
      setGeocoding(false);
    }
  };

  // Auto-trigger location select when geolocation is successful
  if (latitude && longitude && !currentLocation) {
    onLocationSelect(latitude, longitude, "Posizione attuale");
  }

  return (
    <div className={`bg-white p-4 rounded-lg border shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Seleziona Posizione</h3>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {currentLocation && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800">Posizione selezionata</p>
              <p className="text-sm text-green-600">{currentLocation.address}</p>
            </div>
            {onClearLocation && (
              <Button variant="ghost" size="sm" onClick={onClearLocation}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}
      
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Inserisci un indirizzo..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="pl-10"
              onKeyDown={(e) => e.key === 'Enter' && handleAddressSearch()}
            />
          </div>
          <Button 
            onClick={handleAddressSearch}
            disabled={geocoding || !address.trim()}
            variant="outline"
          >
            {geocoding ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Cerca"
            )}
          </Button>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleCurrentLocation}
            disabled={loading}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Target className="h-4 w-4" />
            )}
            Usa posizione attuale
          </Button>
        </div>

        {error && (
          <Alert>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default LocationSearch;
