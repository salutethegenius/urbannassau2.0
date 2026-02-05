import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const MAX_ADDRESS_LENGTH = 500;
const MAX_SERVICE_TYPE_LENGTH = 100;

function isValidFareBody(body: unknown): body is Record<string, unknown> & {
  serviceType: string;
  pickupAddress: string;
  dropoffAddress: string;
  distance: number;
  passengers: number;
  baseFare: number;
  distanceFare: number;
  passengerFare: number;
  totalFare: number;
} {
  if (!body || typeof body !== 'object') return false;
  const b = body as Record<string, unknown>;
  if (typeof b.serviceType !== 'string' || !b.serviceType.trim()) return false;
  if (typeof b.pickupAddress !== 'string' || !b.pickupAddress.trim()) return false;
  if (typeof b.dropoffAddress !== 'string' || !b.dropoffAddress.trim()) return false;
  if (b.serviceType.length > MAX_SERVICE_TYPE_LENGTH) return false;
  if (b.pickupAddress.length > MAX_ADDRESS_LENGTH || b.dropoffAddress.length > MAX_ADDRESS_LENGTH) return false;
  const v = b.passengers;
  if (typeof v !== 'number' || !Number.isFinite(v) || v < 0 || !Number.isInteger(v)) return false;
  const nums = ['distance', 'baseFare', 'distanceFare', 'passengerFare', 'totalFare'] as const;
  for (const key of nums) {
    const n = b[key];
    if (typeof n !== 'number' || !Number.isFinite(n) || n < 0) return false;
  }
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!isValidFareBody(body)) {
      return NextResponse.json(
        { error: 'Invalid request: required fields serviceType, pickupAddress, dropoffAddress, distance, passengers, baseFare, distanceFare, passengerFare, totalFare (numbers must be finite and >= 0)' },
        { status: 400 }
      );
    }

    const fare = await prisma.fareHistory.create({
      data: {
        serviceType: body.serviceType,
        pickupAddress: body.pickupAddress,
        dropoffAddress: body.dropoffAddress,
        distance: body.distance,
        passengers: body.passengers,
        baseFare: body.baseFare,
        distanceFare: body.distanceFare,
        passengerFare: body.passengerFare,
        totalFare: body.totalFare,
      },
    });

    return NextResponse.json(fare, { status: 201 });
  } catch (error) {
    console.error('Error saving fare:', error);
    return NextResponse.json(
      { error: 'Failed to save fare' },
      { status: 500 }
    );
  }
}


