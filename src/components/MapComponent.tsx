
import React, { useEffect, useRef, useState } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, Loader2 } from "lucide-react";

interface MapComponentProps {
  address: string;
  className?: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ address, className = "w-full h-64 rounded-lg" }) => {
  const mapRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    const geocodeAddress = async () => {
      if (!address) {
        setError("Indirizzo non fornito");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Usa il servizio di geocodifica di Nominatim (gratuito)
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&addressdetails=1`
        );
        
        if (!response.ok) {
          throw new Error('Errore nella richiesta di geocodifica');
        }

        const data = await response.json();
        
        if (data && data.length > 0) {
          const result = data[0];
          setCoordinates({
            lat: parseFloat(result.lat),
            lon: parseFloat(result.lon)
          });
        } else {
          setError("Indirizzo non trovato sulla mappa");
        }
      } catch (err) {
        console.error("Errore nella geocodifica:", err);
        setError("Errore nel caricamento della mappa");
      } finally {
        setLoading(false);
      }
    };

    geocodeAddress();
  }, [address]);

  if (loading) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 border rounded-lg`}>
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Caricamento mappa...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <Alert>
          <MapPin className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!coordinates) {
    return (
      <div className={className}>
        <Alert>
          <MapPin className="h-4 w-4" />
          <AlertDescription>Impossibile localizzare l'indirizzo sulla mappa</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Crea l'URL della mappa con le coordinate trovate
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${coordinates.lon-0.01},${coordinates.lat-0.01},${coordinates.lon+0.01},${coordinates.lat+0.01}&layer=mapnik&marker=${coordinates.lat},${coordinates.lon}`;

  return (
    <div className={className}>
      <iframe
        ref={mapRef}
        src={mapSrc}
        className="w-full h-full border-0 rounded-lg"
        title={`Mappa di ${address}`}
        allowFullScreen
        loading="lazy"
        onLoad={() => setLoading(false)}
      />
      <div className="mt-2 flex items-center gap-1 text-sm text-gray-600">
        <MapPin className="h-4 w-4" />
        <span className="truncate">{address}</span>
      </div>
    </div>
  );
};

export default MapComponent;
