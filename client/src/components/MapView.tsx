import { useEffect, useRef, useState, useCallback } from 'react';
import { useLoadScript, GoogleMap, MarkerF, Autocomplete } from '@react-google-maps/api';
import { getCoordinatesForLocation } from '@/lib/mockData';
import { Loader2, MapPin, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = ["places"];

// Helper to get location from string
const parseLocation = (locationName: string) => {
  const parts = locationName.split(',').map(s => s.trim());
  if (parts.length >= 2) {
    const city = parts[parts.length - 1]; // Last part is usually city
    const area = parts.slice(0, parts.length - 1).join(', ');
    return { city, area };
  }
  return { city: "India", area: locationName };
};

export function MapView({ 
  locationName = "India", 
  onLocationSelect
}: { 
  locationName?: string, 
  onLocationSelect?: (address: string) => void
}) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [center, setCenter] = useState<{ lat: number; lng: number }>({ lat: 20.5937, lng: 78.9629 }); // India center
  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const { toast } = useToast();

  // Load Google Maps Script
  // NOTE: In a real app, this key should come from environment variables.
  // For this mockup, we check if one is provided, otherwise we might see errors or dev watermark.
  // Since we don't have a real key in this environment, we'll try to load it. 
  // If it fails, the error handler below catches it.
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "", // Expecting key from env
    libraries,
  });

  // Update map center when locationName changes
  useEffect(() => {
    if (!locationName) return;

    // 1. Try to parse our internal mock data first (faster, reliable for known list)
    const { city, area } = parseLocation(locationName);
    
    // We use our mock geocoder first for instant "fake" accuracy consistent with our data
    // In a real app with a real key, we would use the Geocoding service here.
    const coords = getCoordinatesForLocation(city, area);
    
    setCenter(coords);
    setMarkerPosition(coords);
    
    if (map) {
      map.panTo(coords);
      map.setZoom(14);
    }
  }, [locationName, map]);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const newPos = { lat, lng };
        
        setCenter(newPos);
        setMarkerPosition(newPos);
        map?.panTo(newPos);
        map?.setZoom(15);
        
        if (onLocationSelect && place.formatted_address) {
          onLocationSelect(place.formatted_address);
        }
      }
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCenter(pos);
          setMarkerPosition(pos);
          map?.panTo(pos);
          map?.setZoom(15);
          
          // Reverse geocode would happen here with Google Geocoding API if key was valid
          toast({
             title: "Location Found",
             description: "Map centered on your current location.",
          });
        },
        () => {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Error: The Geolocation service failed.",
          });
        }
      );
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error: Your browser doesn't support geolocation.",
      });
    }
  };

  if (loadError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Map Error</AlertTitle>
        <AlertDescription>
          Failed to load Google Maps. Please check your API key configuration.
        </AlertDescription>
      </Alert>
    );
  }

  if (!isLoaded) {
    return (
      <div className="h-[300px] w-full bg-slate-100 rounded-xl flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-slate-500">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>Loading Maps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[400px] w-full rounded-xl overflow-hidden shadow-soft border border-border">
      {/* Search Box Overlay */}
      <div className="absolute top-4 left-4 right-16 z-10 max-w-sm">
        <Autocomplete
          onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
          onPlaceChanged={onPlaceChanged}
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search specific location on map..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 shadow-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          </div>
        </Autocomplete>
      </div>
      
      {/* My Location Button */}
      <Button
        size="icon"
        variant="secondary"
        className="absolute top-4 right-4 z-10 bg-white shadow-md hover:bg-slate-50"
        onClick={handleGetCurrentLocation}
        title="Use My Location"
      >
        <Navigation className="h-4 w-4 text-slate-700" />
      </Button>

      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={center}
        zoom={13}
        onLoad={onMapLoad}
        options={{
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        }}
      >
        {markerPosition && <MarkerF position={markerPosition} />}
      </GoogleMap>
    </div>
  );
}
