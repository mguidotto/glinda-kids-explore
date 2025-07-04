
interface GeocodeResult {
  latitude: number;
  longitude: number;
  formattedAddress?: string;
}

export const geocodeAddress = async (address: string): Promise<GeocodeResult | null> => {
  if (!address || address.trim().length === 0) {
    return null;
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&countrycodes=it&addressdetails=1`
    );
    
    if (!response.ok) {
      console.error('Geocoding request failed:', response.status);
      return null;
    }

    const data = await response.json();
    
    if (data && data.length > 0) {
      const result = data[0];
      return {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        formattedAddress: result.display_name
      };
    }
    
    console.warn('No geocoding results found for address:', address);
    return null;
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
};

export const geocodeAddressWithCity = async (address: string, city: string): Promise<GeocodeResult | null> => {
  // First try with the full address
  let result = await geocodeAddress(address);
  
  // If that fails, try with just the city
  if (!result && city) {
    result = await geocodeAddress(city);
  }
  
  return result;
};
