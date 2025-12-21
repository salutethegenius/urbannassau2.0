'use client';

import { useCallback, useState, useRef, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer, Autocomplete } from '@react-google-maps/api';

const libraries: ("places" | "geometry" | "drawing")[] = ['places'];

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

// Center on Nassau, Bahamas
const defaultCenter = {
  lat: 25.0443,
  lng: -77.3504,
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
};

interface Location {
  lat: number;
  lng: number;
  address: string;
}

interface MapPickerProps {
  onLocationsChange: (pickup: Location | null, dropoff: Location | null, distance: number | null) => void;
}

export default function MapPicker({ onLocationsChange }: MapPickerProps) {
  const [pickup, setPickup] = useState<Location | null>(null);
  const [dropoff, setDropoff] = useState<Location | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [hasPrompted, setHasPrompted] = useState(false);
  
  const pickupInputRef = useRef<google.maps.places.Autocomplete | null>(null);
  const dropoffInputRef = useRef<google.maps.places.Autocomplete | null>(null);
  const pickupTextRef = useRef<HTMLInputElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  // Check if geolocation is available and prompt user
  useEffect(() => {
    if (isLoaded && !hasPrompted && !pickup && 'geolocation' in navigator) {
      const timer = setTimeout(() => {
        setShowLocationPrompt(true);
        setHasPrompted(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoaded, hasPrompted, pickup]);

  // Get current location and set as pickup
  const useCurrentLocation = useCallback(() => {
    setIsGettingLocation(true);
    setShowLocationPrompt(false);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode(
          { location: { lat: latitude, lng: longitude } },
          (results, status) => {
            setIsGettingLocation(false);
            if (status === 'OK' && results && results[0]) {
              const newPickup: Location = {
                lat: latitude,
                lng: longitude,
                address: results[0].formatted_address,
              };
              setPickup(newPickup);
              
              if (pickupTextRef.current) {
                pickupTextRef.current.value = results[0].formatted_address;
              }
              
              if (mapRef.current) {
                mapRef.current.panTo({ lat: latitude, lng: longitude });
                mapRef.current.setZoom(15);
              }
            }
          }
        );
      },
      (error) => {
        setIsGettingLocation(false);
        console.error('Geolocation error:', error);
        alert('Could not get your location. Please enter it manually.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  const dismissLocationPrompt = () => {
    setShowLocationPrompt(false);
  };

  // Calculate route when both locations are set
  useEffect(() => {
    if (pickup && dropoff && isLoaded) {
      const directionsService = new google.maps.DirectionsService();
      
      directionsService.route(
        {
          origin: { lat: pickup.lat, lng: pickup.lng },
          destination: { lat: dropoff.lat, lng: dropoff.lng },
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            setDirections(result);
            const distanceInMeters = result.routes[0]?.legs[0]?.distance?.value || 0;
            const distanceInMiles = distanceInMeters * 0.000621371;
            setDistance(Math.round(distanceInMiles * 10) / 10);
            onLocationsChange(pickup, dropoff, Math.round(distanceInMiles * 10) / 10);
          }
        }
      );
    } else {
      setDirections(null);
      setDistance(null);
      onLocationsChange(pickup, dropoff, null);
    }
  }, [pickup, dropoff, isLoaded, onLocationsChange]);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const handlePickupSelect = () => {
    const place = pickupInputRef.current?.getPlace();
    if (place?.geometry?.location) {
      const newPickup: Location = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        address: place.formatted_address || place.name || '',
      };
      setPickup(newPickup);
      
      if (mapRef.current) {
        mapRef.current.panTo({ lat: newPickup.lat, lng: newPickup.lng });
      }
    }
  };

  const handleDropoffSelect = () => {
    const place = dropoffInputRef.current?.getPlace();
    if (place?.geometry?.location) {
      const newDropoff: Location = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        address: place.formatted_address || place.name || '',
      };
      setDropoff(newDropoff);
    }
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    
    const geocoder = new google.maps.Geocoder();
    const latLng = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    
    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const newLocation: Location = {
          lat: latLng.lat,
          lng: latLng.lng,
          address: results[0].formatted_address,
        };
        
        if (!pickup) {
          setPickup(newLocation);
        } else if (!dropoff) {
          setDropoff(newLocation);
        }
      }
    });
  };

  const clearLocations = () => {
    setPickup(null);
    setDropoff(null);
    setDirections(null);
    setDistance(null);
    onLocationsChange(null, null, null);
  };

  if (loadError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600 text-center">
          Error loading maps. Please check your API key.
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="animate-pulse">
        <div className="h-12 bg-gray-200 rounded-lg mb-4"></div>
        <div className="h-12 bg-gray-200 rounded-lg mb-4"></div>
        <div className="h-96 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Location Prompt Modal */}
      {showLocationPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-golden-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-golden-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-brand-black mb-2">
                Use Your Location?
              </h3>
              <p className="text-gray-600 mb-6">
                Want to be picked up from where you are right now?
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={useCurrentLocation}
                  className="bg-golden-500 hover:bg-golden-600 text-brand-black font-bold py-3 px-6 rounded-lg transition-colors w-full"
                >
                  Yes, Use My Location
                </button>
                <button
                  onClick={dismissLocationPrompt}
                  className="text-gray-500 hover:text-gray-700 font-medium py-2"
                >
                  No, I&apos;ll Enter It
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Getting Location Indicator */}
      {isGettingLocation && (
        <div className="bg-golden-50 rounded-lg p-4 flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-golden-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-golden-700 font-medium">Finding your location...</span>
        </div>
      )}

      {/* Location Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            📍 Pickup Location
          </label>
          <Autocomplete
            onLoad={(autocomplete) => { pickupInputRef.current = autocomplete; }}
            onPlaceChanged={handlePickupSelect}
            options={{
              componentRestrictions: { country: 'bs' },
              fields: ['formatted_address', 'geometry', 'name', 'place_id'],
              types: ['establishment', 'geocode'],
            }}
          >
            <input
              ref={pickupTextRef}
              type="text"
              placeholder="Where are you now?"
              className="input-field"
              defaultValue={pickup?.address || ''}
            />
          </Autocomplete>
          {!pickup && !isGettingLocation && (
            <button
              onClick={useCurrentLocation}
              className="text-sm text-golden-600 hover:text-golden-700 mt-2 flex items-center gap-1 font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              Use my current location
            </button>
          )}
          {pickup && (
            <p className="text-sm text-green-600 mt-1 truncate">✓ {pickup.address}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            🎯 Dropoff Location
          </label>
          <Autocomplete
            onLoad={(autocomplete) => { dropoffInputRef.current = autocomplete; }}
            onPlaceChanged={handleDropoffSelect}
            options={{
              componentRestrictions: { country: 'bs' },
              fields: ['formatted_address', 'geometry', 'name', 'place_id'],
              types: ['establishment', 'geocode'],
            }}
          >
            <input
              type="text"
              placeholder="Where are you going?"
              className="input-field"
              defaultValue={dropoff?.address || ''}
            />
          </Autocomplete>
          {dropoff && (
            <p className="text-sm text-green-600 mt-1 truncate">✓ {dropoff.address}</p>
          )}
        </div>
      </div>

      {/* Distance Display */}
      {distance !== null && (
        <div className="bg-golden-50 border border-golden-200 rounded-lg p-4 flex items-center justify-between">
          <span className="text-gray-700 font-medium">Trip Distance:</span>
          <span className="text-2xl font-black text-brand-black">{distance} miles</span>
        </div>
      )}

      {/* Map */}
      <div className="rounded-xl overflow-hidden shadow-uber border border-gray-200">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={13}
          center={pickup ? { lat: pickup.lat, lng: pickup.lng } : defaultCenter}
          options={mapOptions}
          onLoad={onMapLoad}
          onClick={handleMapClick}
        >
          {pickup && !directions && (
            <Marker
              position={{ lat: pickup.lat, lng: pickup.lng }}
              label={{ text: 'A', color: 'white', fontWeight: 'bold' }}
            />
          )}
          
          {dropoff && !directions && (
            <Marker
              position={{ lat: dropoff.lat, lng: dropoff.lng }}
              label={{ text: 'B', color: 'white', fontWeight: 'bold' }}
            />
          )}

          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                suppressMarkers: false,
                polylineOptions: {
                  strokeColor: '#FFB800',
                  strokeWeight: 5,
                },
              }}
            />
          )}
        </GoogleMap>
      </div>

      {/* Helper Text */}
      <p className="text-sm text-gray-500 text-center">
        💡 Type an address or tap the map to set your pickup and dropoff points
      </p>

      {/* Clear Button */}
      {(pickup || dropoff) && (
        <button
          onClick={clearLocations}
          className="w-full py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          ✕ Clear Locations
        </button>
      )}
    </div>
  );
}
