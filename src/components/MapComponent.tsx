
import React, { useEffect, useRef } from 'react';

interface MapComponentProps {
  address: string;
  className?: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ address, className = "w-full h-64 rounded-lg" }) => {
  const mapRef = useRef<HTMLIFrameElement>(null);

  if (!address) {
    return null;
  }

  const encodedAddress = encodeURIComponent(address);
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=&layer=mapnik&zoom=15&q=${encodedAddress}`;

  return (
    <div className={className}>
      <iframe
        ref={mapRef}
        src={mapSrc}
        className="w-full h-full border-0 rounded-lg"
        title={`Mappa di ${address}`}
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
};

export default MapComponent;
