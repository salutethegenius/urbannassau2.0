import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const MAX_SLOTS_PER_HOUR = 2;
const MIN_HOURS_AHEAD = 1;
const FIRST_HOUR = 7;   // 7 AM
const LAST_HOUR = 23;   // 11 PM
const MAX_DAYS_AHEAD = 60;
const MAX_ADDRESS_LENGTH = 500;
const MAX_SERVICE_TYPE_LENGTH = 100;
const MAX_PHONE_LENGTH = 50;

function formatHourDisplay(hour: number): string {
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  return `${displayHour}:00 ${ampm}`;
}

// GET: Check available slots for a given date
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const dateStr = searchParams.get('date');

    if (!dateStr) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    // Parse as local date to avoid timezone bugs (YYYY-MM-DD in UTC = previous day in PST)
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    if (isNaN(date.getTime())) {
      return NextResponse.json({ error: 'Invalid date' }, { status: 400 });
    }
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Get all bookings for this date
    const bookings = await prisma.booking.findMany({
      where: {
        bookingDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          not: 'cancelled',
        },
      },
      select: {
        bookingHour: true,
      },
    });

    // Count bookings per hour
    const bookingsPerHour: Record<number, number> = {};
    bookings.forEach((booking) => {
      bookingsPerHour[booking.bookingHour] = (bookingsPerHour[booking.bookingHour] || 0) + 1;
    });

    // Generate available hours (7 AM to 11 PM = hours 7-23)
    const now = new Date();
    const isToday = startOfDay.toDateString() === now.toDateString();
    const currentHour = now.getHours();

    const availableSlots: { hour: number; available: number; display: string }[] = [];

    for (let hour = FIRST_HOUR; hour <= LAST_HOUR; hour++) {
      // Skip hours that are in the past or within the 1-hour buffer
      if (isToday && hour <= currentHour + MIN_HOURS_AHEAD) {
        continue;
      }

      const booked = bookingsPerHour[hour] || 0;
      const available = MAX_SLOTS_PER_HOUR - booked;

      if (available > 0) {
        availableSlots.push({
          hour,
          available,
          display: formatHourDisplay(hour),
        });
      }
    }

    return NextResponse.json({
      date: dateStr,
      slots: availableSlots,
      maxSlotsPerHour: MAX_SLOTS_PER_HOUR,
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    return NextResponse.json({ error: 'Failed to check availability' }, { status: 500 });
  }
}

// POST: Create a new booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      bookingDate,
      bookingHour,
      serviceType,
      pickupAddress,
      dropoffAddress,
      distance,
      passengers,
      totalFare,
      customerPhone,
    } = body;

    // Validate required fields
    if (!bookingDate || bookingHour === undefined || !serviceType || !pickupAddress || !dropoffAddress) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (typeof bookingHour !== 'number' || bookingHour < FIRST_HOUR || bookingHour > LAST_HOUR) {
      return NextResponse.json({ error: `Booking hour must be between ${FIRST_HOUR} (7 AM) and ${LAST_HOUR} (11 PM)` }, { status: 400 });
    }

    // String length limits
    const pickup = String(pickupAddress).trim();
    const dropoff = String(dropoffAddress).trim();
    const service = String(serviceType).trim();
    if (!pickup || !dropoff || !service) {
      return NextResponse.json({ error: 'Pickup, dropoff, and service type cannot be empty' }, { status: 400 });
    }
    if (pickup.length > MAX_ADDRESS_LENGTH || dropoff.length > MAX_ADDRESS_LENGTH) {
      return NextResponse.json({ error: 'Addresses too long' }, { status: 400 });
    }
    if (service.length > MAX_SERVICE_TYPE_LENGTH) {
      return NextResponse.json({ error: 'Service type too long' }, { status: 400 });
    }
    const phone = customerPhone != null ? String(customerPhone).trim() : null;
    if (phone && phone.length > MAX_PHONE_LENGTH) {
      return NextResponse.json({ error: 'Phone number too long' }, { status: 400 });
    }

    // Numeric validation
    const dist = typeof distance === 'number' ? distance : 0;
    const pax = typeof passengers === 'number' && Number.isInteger(passengers) ? passengers : 1;
    const fare = typeof totalFare === 'number' ? totalFare : 0;
    if (dist < 0 || dist > 500) {
      return NextResponse.json({ error: 'Invalid distance' }, { status: 400 });
    }
    if (pax < 1 || pax > 6) {
      return NextResponse.json({ error: 'Passengers must be 1–6' }, { status: 400 });
    }
    if (fare < 0 || fare > 10000) {
      return NextResponse.json({ error: 'Invalid fare amount' }, { status: 400 });
    }

    const dateParts = String(bookingDate).split('T')[0].split('-').map(Number);
    const date = dateParts.length === 3 ? new Date(dateParts[0], dateParts[1] - 1, dateParts[2]) : new Date(bookingDate);
    if (isNaN(date.getTime())) {
      return NextResponse.json({ error: 'Invalid date' }, { status: 400 });
    }

    // Reject bookings more than 60 days in the future
    const now = new Date();
    const maxDate = new Date(now);
    maxDate.setDate(maxDate.getDate() + MAX_DAYS_AHEAD);
    if (date > maxDate) {
      return NextResponse.json({ error: 'Bookings cannot be more than 60 days ahead' }, { status: 400 });
    }

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Check if slot is still available
    const existingBookings = await prisma.booking.count({
      where: {
        bookingDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
        bookingHour: bookingHour,
        status: {
          not: 'cancelled',
        },
      },
    });

    if (existingBookings >= MAX_SLOTS_PER_HOUR) {
      // Find next available slot (within 7 AM–11 PM)
      for (let h = Math.max(bookingHour + 1, FIRST_HOUR); h <= LAST_HOUR; h++) {
        const count = await prisma.booking.count({
          where: {
            bookingDate: {
              gte: startOfDay,
              lte: endOfDay,
            },
            bookingHour: h,
            status: {
              not: 'cancelled',
            },
          },
        });

        if (count < MAX_SLOTS_PER_HOUR) {
          return NextResponse.json({
            error: 'Slot not available',
            nextAvailable: {
              hour: h,
              display: formatHourDisplay(h),
            },
          }, { status: 409 });
        }
      }

      return NextResponse.json({
        error: 'No slots available for this day',
      }, { status: 409 });
    }

    // Validate booking is at least 1 hour ahead
    const bookingDateTime = new Date(date);
    bookingDateTime.setHours(bookingHour, 0, 0, 0);
    
    const minBookingTime = new Date(now);
    minBookingTime.setHours(now.getHours() + MIN_HOURS_AHEAD);

    if (bookingDateTime < minBookingTime) {
      return NextResponse.json({
        error: 'Bookings must be at least 1 hour in advance',
      }, { status: 400 });
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        bookingDate: date,
        bookingHour,
        serviceType: service,
        pickupAddress: pickup,
        dropoffAddress: dropoff,
        distance: dist,
        passengers: pax,
        totalFare: fare,
        customerPhone: phone || null,
        status: 'pending',
      },
    });

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        date: bookingDate,
        hour: bookingHour,
        status: booking.status,
      },
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}

