
import { useState, useEffect } from "react";
import { useCapacitor } from "./useCapacitor";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

export const useGeolocation = () => {
  const { isNative, getCurrentPosition } = useCapacitor();
  const [location, setLocation] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: false,
  });

  const getLocation = async () => {
    setLocation(prev => ({ ...prev, loading: true, error: null }));

    if (isNative) {
      // Use Capacitor's geolocation for native apps
      const result = await getCurrentPosition();
      if (result.error) {
        setLocation(prev => ({
          ...prev,
          error: result.error,
          loading: false,
        }));
      } else {
        setLocation({
          latitude: result.latitude,
          longitude: result.longitude,
          error: null,
          loading: false,
        });
      }
    } else {
      // Fallback to web geolocation API
      if (!navigator.geolocation) {
        setLocation(prev => ({
          ...prev,
          error: "La geolocalizzazione non è supportata da questo browser",
          loading: false,
        }));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error: null,
            loading: false,
          });
        },
        (error) => {
          let errorMessage = "Errore sconosciuto nella geolocalizzazione";
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Permesso di geolocalizzazione negato";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Posizione non disponibile";
              break;
            case error.TIMEOUT:
              errorMessage = "Timeout nella richiesta di geolocalizzazione";
              break;
          }

          setLocation(prev => ({
            ...prev,
            error: errorMessage,
            loading: false,
          }));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    }
  };

  return {
    ...location,
    getLocation,
  };
};
