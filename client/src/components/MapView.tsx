import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect, useState } from 'react';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';

// Fix for default marker icons in Leaflet with Vite/Webpack
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 13, {
      duration: 1.5
    });
  }, [center, map]);
  return null;
}

export function MapView({ 
  locationName = "India", 
  coords = [20.5937, 78.9629] as [number, number] 
}: { 
  locationName?: string, 
  coords?: [number, number] 
}) {
  return (
    <div className="h-[300px] w-full rounded-xl overflow-hidden shadow-soft border border-border relative z-0">
      <MapContainer 
        center={coords} 
        zoom={5} 
        scrollWheelZoom={false} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <Marker position={coords}>
          <Popup>
            {locationName}
          </Popup>
        </Marker>
        <MapUpdater center={coords} />
      </MapContainer>
    </div>
  );
}
