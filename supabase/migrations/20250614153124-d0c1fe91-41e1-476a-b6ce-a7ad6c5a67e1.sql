
-- Add geolocation support to contents table
-- (latitude and longitude columns already exist, but let's ensure they're properly indexed)

-- Create an index for efficient geospatial queries
CREATE INDEX IF NOT EXISTS idx_contents_location ON contents USING btree (latitude, longitude);

-- Add a function to calculate distance between two points (in kilometers)
CREATE OR REPLACE FUNCTION calculate_distance(
  lat1 DECIMAL,
  lon1 DECIMAL,
  lat2 DECIMAL,
  lon2 DECIMAL
) RETURNS DECIMAL AS $$
BEGIN
  RETURN (
    6371 * acos(
      cos(radians(lat1)) * cos(radians(lat2)) * cos(radians(lon2) - radians(lon1)) +
      sin(radians(lat1)) * sin(radians(lat2))
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Add a function to get contents within a certain radius
CREATE OR REPLACE FUNCTION get_contents_within_radius(
  center_lat DECIMAL,
  center_lon DECIMAL,
  radius_km DECIMAL DEFAULT 50
) RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  city TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  distance_km DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.title,
    c.description,
    c.city,
    c.latitude,
    c.longitude,
    calculate_distance(center_lat, center_lon, c.latitude, c.longitude) as distance_km
  FROM contents c
  WHERE 
    c.published = true
    AND c.latitude IS NOT NULL 
    AND c.longitude IS NOT NULL
    AND calculate_distance(center_lat, center_lon, c.latitude, c.longitude) <= radius_km
  ORDER BY distance_km ASC;
END;
$$ LANGUAGE plpgsql;
