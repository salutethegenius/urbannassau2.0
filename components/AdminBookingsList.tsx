'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Booking = {
  id: number;
  bookingDate: Date;
  bookingHour: number;
  serviceType: string;
  pickupAddress: string;
  dropoffAddress: string;
  distance: number;
  passengers: number;
  totalFare: number;
  customerPhone: string | null;
  status: string;
  createdAt: Date;
};

function formatHourDisplay(hour: number): string {
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  return `${displayHour}:00 ${ampm}`;
}

function getServiceIcon(serviceType: string): string {
  const s = serviceType.toLowerCase();
  if (s.includes('ride') || s.includes('standard') || s.includes('premium')) return '🚗';
  if (s.includes('courier')) return '📦';
  if (s.includes('errand')) return '🛒';
  if (s.includes('shopping')) return '🛍️';
  if (s.includes('transport')) return '🚐';
  return '🚗';
}

export default function AdminBookingsList({ bookings }: { bookings: Booking[] }) {
  const router = useRouter();
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const handleStatusUpdate = async (bookingId: number, status: 'confirmed' | 'cancelled') => {
    setUpdatingId(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setUpdatingId(null);
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">📋</div>
        <p className="text-gray-500">No bookings yet. They&apos;ll show up when customers send requests via WhatsApp.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => {
        const dateStr = new Date(booking.bookingDate).toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        });
        const isUpdating = updatingId === booking.id;
        const isPending = booking.status === 'pending';
        const isExpanded = expandedId === booking.id;
        const serviceIcon = getServiceIcon(booking.serviceType);

        return (
          <div
            key={booking.id}
            className={`rounded-xl p-4 ${
              booking.status === 'cancelled' ? 'bg-gray-100 opacity-75' : 'bg-gray-50'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2">
                  <span className="text-xl flex-shrink-0" title={booking.serviceType}>
                    {serviceIcon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 truncate">
                      {booking.pickupAddress.split(',')[0]} → {booking.dropoffAddress.split(',')[0]}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm text-gray-500 mt-0.5">
                      <span className="font-medium text-gray-700">
                        {dateStr} at {formatHourDisplay(booking.bookingHour)}
                      </span>
                      <span>•</span>
                      <span>{booking.distance} mi</span>
                      <span>•</span>
                      <span>{booking.passengers} pax</span>
                      <span>•</span>
                      <span className="capitalize">{booking.serviceType}</span>
                      {booking.customerPhone && (
                        <>
                          <span>•</span>
                          <span>📞 {booking.customerPhone}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : booking.id)}
                    className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
                    title="View full details"
                    aria-label="Toggle details"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 text-sm">
                    <p><span className="text-gray-500">Pickup:</span> {booking.pickupAddress}</p>
                    <p><span className="text-gray-500">Dropoff:</span> {booking.dropoffAddress}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-gray-600">
                      <span>Distance: {booking.distance} mi</span>
                      <span>Passengers: {booking.passengers}</span>
                      <span>Service: {booking.serviceType}</span>
                      <span>Fare: ${booking.totalFare.toFixed(2)}</span>
                    </div>
                    {booking.customerPhone && (
                      <p><span className="text-gray-500">Phone:</span> {booking.customerPhone}</p>
                    )}
                    <p className="text-xs text-gray-400">
                      Requested {new Date(booking.createdAt).toLocaleString()} • ID #{booking.id}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right">
                  <p className="text-xl font-bold text-turquoise-400">${booking.totalFare.toFixed(2)}</p>
                  <span
                    className={`inline-block text-xs font-medium px-2 py-0.5 rounded ${
                      booking.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
                {isPending && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                      disabled={isUpdating}
                      className="px-3 py-1.5 text-sm font-medium rounded-lg bg-green-500 text-white hover:bg-green-600 disabled:opacity-50"
                    >
                      {isUpdating ? '…' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                      disabled={isUpdating}
                      className="px-3 py-1.5 text-sm font-medium rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
                    >
                      {isUpdating ? '…' : 'Deny'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
