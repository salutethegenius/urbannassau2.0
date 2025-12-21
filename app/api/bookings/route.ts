import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const MAX_SLOTS_PER_HOUR = 2;
const MIN_HOURS_AHEAD = 1;

// GET: Check available slots for a given date
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const dateStr = searchParams.get('date');

    if (!dateStr) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    const date = new Date(dateStr);
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

    // Generate available hours (6 AM to 11 PM = hours 6-23)
    const now = new Date();
    const isToday = startOfDay.toDateString() === now.toDateString();
    const currentHour = now.getHours();

    const availableSlots: { hour: number; available: number; display: string }[] = [];

    for (let hour = 6; hour <= 23; hour++) {
      // Skip hours that are in the past or within the 1-hour buffer
      if (isToday && hour <= currentHour + MIN_HOURS_AHEAD) {
        continue;
      }

      const booked = bookingsPerHour[hour] || 0;
      const available = MAX_SLOTS_PER_HOUR - booked;

      if (available > 0) {
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        const ampm = hour >= 12 ? 'PM' : 'AM';
        
        availableSlots.push({
          hour,
          available,
          display: `${displayHour}:00 ${ampm}`,
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

    const date = new Date(bookingDate);
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
      // Find next available slot
      for (let h = bookingHour + 1; h <= 23; h++) {
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
          const displayHour = h > 12 ? h - 12 : h === 0 ? 12 : h;
          const ampm = h >= 12 ? 'PM' : 'AM';
          return NextResponse.json({
            error: 'Slot not available',
            nextAvailable: {
              hour: h,
              display: `${displayHour}:00 ${ampm}`,
            },
          }, { status: 409 });
        }
      }

      return NextResponse.json({
        error: 'No slots available for this day',
      }, { status: 409 });
    }

    // Validate booking is at least 1 hour ahead
    const now = new Date();
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
        serviceType,
        pickupAddress,
        dropoffAddress,
        distance: distance || 0,
        passengers: passengers || 1,
        totalFare: totalFare || 0,
        customerPhone: customerPhone || null,
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

