'use client';

import { useState, useCallback, useEffect } from 'react';
import MapPicker from './MapPicker';
import WhatsAppButton from './WhatsAppButton';
import { calculateFare, formatCurrency, type FareSettings, type ServiceType } from '@/lib/fareCalculation';
import type { Location } from '@/types/map';

interface FareCalculatorProps {
  settings: FareSettings;
}

interface TimeSlot {
  hour: number;
  available: number;
  display: string;
}

export default function FareCalculator({ settings }: FareCalculatorProps) {
  const [pickup, setPickup] = useState<Location | null>(null);
  const [dropoff, setDropoff] = useState<Location | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [passengers, setPassengers] = useState(1);
  const [serviceType, setServiceType] = useState<ServiceType>('ride-standard');
  const [isSaving, setIsSaving] = useState(false);

  // Date & Time
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [slotError, setSlotError] = useState<string | null>(null);

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Get maximum date (30 days from now)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  // Fetch available slots when date changes
  useEffect(() => {
    if (!selectedDate) {
      setAvailableSlots([]);
      setSelectedHour(null);
      return;
    }

    const fetchSlots = async () => {
      setIsLoadingSlots(true);
      setSlotError(null);
      setSelectedHour(null);

      try {
        const response = await fetch(`/api/bookings?date=${selectedDate}`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('API Error:', response.status, errorData);
          setSlotError(errorData.error || `Failed to load available times. (Status: ${response.status})`);
          return;
        }

        const data = await response.json();
        
        if (data.slots && Array.isArray(data.slots)) {
          setAvailableSlots(data.slots);
          if (data.slots.length === 0) {
            setSlotError('No available slots for this date. Please try another day.');
          }
        } else {
          console.error('Invalid response format:', data);
          setSlotError('Invalid response from server. Please try again.');
        }
      } catch (error) {
        console.error('Error fetching slots:', error);
        setSlotError(`Failed to load available times: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setIsLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [selectedDate]);

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

  const formatDateDisplay = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getSelectedTimeDisplay = () => {
    const slot = availableSlots.find(s => s.hour === selectedHour);
    return slot?.display || '';
  };

  const handleSendQuote = async () => {
    if (!fare || !pickup || !dropoff || distance === null || !selectedDate || selectedHour === null) return;

    setIsSaving(true);
    
    try {
      // Create booking
      const bookingResponse = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingDate: selectedDate,
          bookingHour: selectedHour,
          serviceType,
          pickupAddress: pickup.address,
          dropoffAddress: dropoff.address,
          distance,
          passengers,
          totalFare: fare.totalFare,
        }),
      });

      const bookingData = await bookingResponse.json();

      if (!bookingResponse.ok) {
        setSelectedHour(null);
        if (bookingData.nextAvailable) {
          setSlotError(`This slot is now full. Next available: ${bookingData.nextAvailable.display}`);
          const slotsResponse = await fetch(`/api/bookings?date=${selectedDate}`);
          const slotsData = await slotsResponse.json();
          if (slotsResponse.ok && Array.isArray(slotsData.slots)) {
            setAvailableSlots(slotsData.slots);
          }
        } else {
          setSlotError(bookingData.error || 'Failed to book slot');
        }
        setIsSaving(false);
        return;
      }

      // Also save to fare history (non-blocking: log on failure, don't block user)
      try {
        const fareRes = await fetch('/api/fares', {
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
        if (!fareRes.ok) {
          console.warn('Fare history save failed:', fareRes.status, await fareRes.text());
        }
      } catch (err) {
        console.warn('Fare history could not be updated:', err);
      }
    } catch (error) {
      console.error('Error saving booking:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const whatsappMessage = fare && pickup && dropoff && selectedDate && selectedHour !== null
    ? `Hi! I'd like to book a ride:

📅 Date: ${formatDateDisplay(selectedDate)}
🕐 Time: ${getSelectedTimeDisplay()}

📍 Pickup: ${pickup.address}
📍 Dropoff: ${dropoff.address}
📏 Distance: ${distance} miles
👥 Passengers: ${passengers}
🚗 Service: Ride

💰 Total Fare: ${formatCurrency(fare.totalFare)}

Please confirm my booking!`
    : '';

  const canBook = fare && pickup && dropoff && selectedDate && selectedHour !== null;

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

      {/* Date & Time Section */}
      <div className="card-static">
        <h2 className="text-xl font-bold text-brand-black mb-5 flex items-center gap-2">
          <span className="w-8 h-8 bg-golden-500 rounded-lg flex items-center justify-center text-sm">📅</span>
          When do you need the ride?
        </h2>
        
        <div className="space-y-4">
          {/* Date Picker */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={getMinDate()}
              max={getMaxDate()}
              className="input-field"
            />
            {selectedDate && (
              <p className="text-sm text-golden-600 mt-1 font-medium">
                {formatDateDisplay(selectedDate)}
              </p>
            )}
          </div>

          {/* Time Slots */}
          {selectedDate && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Time
                <span className="font-normal text-gray-500 ml-1">(2 slots per hour)</span>
              </label>

              {isLoadingSlots ? (
                <div className="flex items-center gap-2 text-gray-500 py-4">
                  <div className="w-5 h-5 border-2 border-golden-500 border-t-transparent rounded-full animate-spin"></div>
                  Loading available times...
                </div>
              ) : slotError ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
                  {slotError}
                </div>
              ) : availableSlots.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot.hour}
                      onClick={() => {
                        setSelectedHour(slot.hour);
                        setSlotError(null);
                      }}
                      className={`py-3 px-2 rounded-lg text-sm font-semibold transition-all ${
                        selectedHour === slot.hour
                          ? 'bg-golden-500 text-brand-black'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <div>{slot.display}</div>
                      <div className={`text-xs ${selectedHour === slot.hour ? 'text-brand-black/70' : 'text-gray-500'}`}>
                        {slot.available} left
                      </div>
                    </button>
                  ))}
                </div>
              ) : null}

              {selectedHour !== null && (
                <p className="text-sm text-green-600 mt-2 font-medium">
                  ✓ Selected: {getSelectedTimeDisplay()}
                </p>
              )}

              <p className="text-xs text-gray-500 mt-3">
                💡 Bookings must be at least 1 hour in advance. Only 2 rides per hour available.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Options Section */}
      <div className="card-static">
        <h2 className="text-xl font-bold text-brand-black mb-5 flex items-center gap-2">
          <span className="w-8 h-8 bg-golden-500 rounded-lg flex items-center justify-center text-sm">⚙️</span>
          Trip Options
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <span className="text-gray-600">Base Fare</span>
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
          <div className="bg-brand-black rounded-xl p-6 text-center mb-4">
            <p className="text-gray-400 text-sm uppercase tracking-wide mb-1">Total Fare</p>
            <p className="text-5xl font-black text-golden-500">{formatCurrency(fare.totalFare)}</p>
          </div>
          <p className="text-sm text-gray-500 text-center mb-6">
            Wait time: $5 every 10 minutes (if applicable).
          </p>

          {/* Trip Summary */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h3 className="font-bold text-brand-black mb-2">Trip Summary</h3>
            <div className="text-sm text-gray-600 space-y-1">
              {selectedDate && selectedHour !== null && (
                <>
                  <p>📅 Date: {formatDateDisplay(selectedDate)}</p>
                  <p>🕐 Time: {getSelectedTimeDisplay()}</p>
                </>
              )}
              <p>📍 From: {pickup?.address}</p>
              <p>🎯 To: {dropoff?.address}</p>
              <p>📏 Distance: {distance} miles</p>
              <p>👥 Passengers: {passengers}</p>
            </div>
          </div>

          {/* Booking Status */}
          {!canBook && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 text-yellow-800 text-sm">
              {!selectedDate && '📅 Please select a date'}
              {selectedDate && selectedHour === null && '🕐 Please select a time slot'}
            </div>
          )}

          {/* WhatsApp Button */}
          <WhatsAppButton 
            message={whatsappMessage}
            className={`w-full text-xl ${!canBook ? 'opacity-50 cursor-not-allowed' : ''}`}
            onBeforeOpen={canBook ? handleSendQuote : undefined}
          >
            {isSaving ? 'Booking...' : 'Book via WhatsApp'}
          </WhatsAppButton>

          <p className="text-center text-sm text-gray-500 mt-4">
            {canBook 
              ? 'Tap to open WhatsApp with your booking ready to send.'
              : 'Complete all fields above to book your ride.'}
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
