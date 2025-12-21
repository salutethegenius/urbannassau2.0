'use client';

import { useState, useCallback } from 'react';
import MapPicker from './MapPicker';
import WhatsAppButton from './WhatsAppButton';
import { calculateFare, formatCurrency, type FareSettings, type ServiceType } from '@/lib/fareCalculation';

interface Location {
  lat: number;
  lng: number;
  address: string;
}

interface FareCalculatorProps {
  settings: FareSettings;
}

export default function FareCalculator({ settings }: FareCalculatorProps) {
  const [pickup, setPickup] = useState<Location | null>(null);
  const [dropoff, setDropoff] = useState<Location | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [passengers, setPassengers] = useState(1);
  const [serviceType, setServiceType] = useState<ServiceType>('ride-standard');
  const [isSaving, setIsSaving] = useState(false);

  const handleLocationsChange = useCallback((
    newPickup: Location | null, 
    newDropoff: Location | null, 
    newDistance: number | null
  ) => {
    setPickup(newPickup);
    setDropoff(newDropoff);
    setDistance(newDistance);
  }, []);

  const fare = distance !== null 
    ? calculateFare(distance, passengers, serviceType, settings)
    : null;

  const incrementPassengers = () => {
    if (passengers < 6) setPassengers(p => p + 1);
  };

  const decrementPassengers = () => {
    if (passengers > 1) setPassengers(p => p - 1);
  };

  const handleSendQuote = async () => {
    if (!fare || !pickup || !dropoff || distance === null) return;

    setIsSaving(true);
    
    try {
      await fetch('/api/fares', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceType,
          pickupAddress: pickup.address,
          dropoffAddress: dropoff.address,
          distance,
          passengers,
          baseFare: fare.baseFare,
          distanceFare: fare.distanceFare,
          passengerFare: fare.passengerFare,
          totalFare: fare.totalFare,
        }),
      });
    } catch (error) {
      console.error('Error saving fare:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const whatsappMessage = fare && pickup && dropoff
    ? `Hi! I need a ride quote:

📍 Pickup: ${pickup.address}
📍 Dropoff: ${dropoff.address}
📏 Distance: ${distance} miles
👥 Passengers: ${passengers}
🚗 Service: ${serviceType === 'ride-premium' ? 'Premium' : 'Standard'}

💰 Estimated Fare: ${formatCurrency(fare.totalFare)}

Can I book this ride?`
    : '';

  return (
    <div className="space-y-6">
      {/* Map Section */}
      <div className="card-static">
        <h2 className="text-xl font-bold text-brand-black mb-5 flex items-center gap-2">
          <span className="w-8 h-8 bg-golden-500 rounded-lg flex items-center justify-center text-sm">📍</span>
          Where are you going?
        </h2>
        <MapPicker onLocationsChange={handleLocationsChange} />
      </div>

      {/* Options Section */}
      <div className="card-static">
        <h2 className="text-xl font-bold text-brand-black mb-5 flex items-center gap-2">
          <span className="w-8 h-8 bg-golden-500 rounded-lg flex items-center justify-center text-sm">⚙️</span>
          Trip Options
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Service Type Toggle */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Service Type
            </label>
            <div className="flex rounded-lg overflow-hidden border-2 border-gray-200">
              <button
                onClick={() => setServiceType('ride-standard')}
                className={`flex-1 py-4 px-4 text-lg font-bold transition-all ${
                  serviceType === 'ride-standard'
                    ? 'bg-brand-black text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="text-center">
                  <div>Standard</div>
                  <div className="text-sm font-normal opacity-80">
                    {formatCurrency(settings.rideStandardBase)} base
                  </div>
                </div>
              </button>
              <button
                onClick={() => setServiceType('ride-premium')}
                className={`flex-1 py-4 px-4 text-lg font-bold transition-all ${
                  serviceType === 'ride-premium'
                    ? 'bg-golden-500 text-brand-black'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="text-center">
                  <div>Premium ✨</div>
                  <div className="text-sm font-normal opacity-80">
                    {formatCurrency(settings.ridePremiumBase)} base
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Passenger Counter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Number of Passengers
            </label>
            <div className="flex items-center justify-center gap-6 py-2">
              <button
                onClick={decrementPassengers}
                disabled={passengers <= 1}
                className="w-14 h-14 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-2xl font-bold text-gray-700 transition-colors"
              >
                −
              </button>
              <div className="text-center">
                <span className="text-4xl font-black text-brand-black">{passengers}</span>
                <p className="text-sm text-gray-500 mt-1">
                  {passengers === 1 ? 'passenger' : 'passengers'}
                </p>
              </div>
              <button
                onClick={incrementPassengers}
                disabled={passengers >= 6}
                className="w-14 h-14 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-2xl font-bold text-gray-700 transition-colors"
              >
                +
              </button>
            </div>
            {passengers > 1 && (
              <p className="text-sm text-gray-500 text-center mt-2">
                +{formatCurrency(settings.passengerFee)} per extra passenger
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Fare Display */}
      {fare && distance !== null && (
        <div className="card-static border-2 border-golden-500">
          <h2 className="text-xl font-bold text-brand-black mb-5 flex items-center gap-2">
            <span className="w-8 h-8 bg-golden-500 rounded-lg flex items-center justify-center text-sm">💰</span>
            Your Fare Estimate
          </h2>
          
          {/* Fare Breakdown */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Base Fare ({serviceType === 'ride-premium' ? 'Premium' : 'Standard'})</span>
              <span className="font-bold text-brand-black">{formatCurrency(fare.baseFare)}</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">
                Distance Charge 
                {distance > settings.freeDistance && (
                  <span className="text-sm text-gray-400 ml-1">
                    ({(distance - settings.freeDistance).toFixed(1)} mi × {formatCurrency(settings.perMileRate)})
                  </span>
                )}
              </span>
              <span className="font-bold text-brand-black">{formatCurrency(fare.distanceFare)}</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">
                Passenger Charge
                {passengers > 1 && (
                  <span className="text-sm text-gray-400 ml-1">
                    ({passengers - 1} extra × {formatCurrency(settings.passengerFee)})
                  </span>
                )}
              </span>
              <span className="font-bold text-brand-black">{formatCurrency(fare.passengerFare)}</span>
            </div>
          </div>

          {/* Total */}
          <div className="bg-brand-black rounded-xl p-6 text-center mb-6">
            <p className="text-gray-400 text-sm uppercase tracking-wide mb-1">Total Fare</p>
            <p className="text-5xl font-black text-golden-500">{formatCurrency(fare.totalFare)}</p>
          </div>

          {/* Trip Summary */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h3 className="font-bold text-brand-black mb-2">Trip Summary</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>📍 From: {pickup?.address}</p>
              <p>🎯 To: {dropoff?.address}</p>
              <p>📏 Distance: {distance} miles</p>
              <p>👥 Passengers: {passengers}</p>
            </div>
          </div>

          {/* WhatsApp Button */}
          <WhatsAppButton 
            message={whatsappMessage}
            className="w-full text-xl"
            onBeforeOpen={handleSendQuote}
          >
            {isSaving ? 'Saving...' : 'Book via WhatsApp'}
          </WhatsAppButton>

          <p className="text-center text-sm text-gray-500 mt-4">
            Tap to open WhatsApp with your quote ready to send.
          </p>
        </div>
      )}

      {/* No Fare Yet */}
      {!fare && (
        <div className="card-static bg-white text-center py-12">
          <div className="w-20 h-20 bg-golden-100 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4">
            🗺️
          </div>
          <h3 className="text-xl font-bold text-brand-black mb-2">
            Enter your trip details
          </h3>
          <p className="text-gray-600">
            Add your pickup and dropoff locations above to see your fare.
          </p>
        </div>
      )}

      {/* Pricing Info */}
      <div className="card-static bg-golden-50 border border-golden-200">
        <h3 className="font-bold text-brand-black mb-3 flex items-center gap-2">
          <span className="text-golden-600">💡</span>
          How our pricing works
        </h3>
        <ul className="text-sm text-gray-600 space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-golden-500">•</span>
            First {settings.freeDistance} miles are included in the base fare
          </li>
          <li className="flex items-start gap-2">
            <span className="text-golden-500">•</span>
            {formatCurrency(settings.perMileRate)} per mile after that
          </li>
          <li className="flex items-start gap-2">
            <span className="text-golden-500">•</span>
            First passenger is free, then {formatCurrency(settings.passengerFee)} per extra person
          </li>
          <li className="flex items-start gap-2">
            <span className="text-golden-500">•</span>
            No hidden fees — what you see is what you pay!
          </li>
        </ul>
      </div>
    </div>
  );
}
