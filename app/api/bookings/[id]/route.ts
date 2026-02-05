import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const ALLOWED_STATUSES = ['confirmed', 'cancelled'] as const;

// PATCH: Update booking status (approve = confirmed, deny = cancelled)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: 'Status must be "confirmed" or "cancelled"' },
        { status: 400 }
      );
    }

    const bookingId = parseInt(id, 10);
    if (!Number.isInteger(bookingId) || bookingId < 1) {
      return NextResponse.json({ error: 'Invalid booking ID' }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (booking.status !== 'pending') {
      return NextResponse.json(
        { error: `Booking is already ${booking.status}` },
        { status: 400 }
      );
    }

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    });

    return NextResponse.json({ success: true, booking: updated });
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}
