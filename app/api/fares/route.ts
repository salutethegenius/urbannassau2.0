import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
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

export async function GET() {
  try {
    const fares = await prisma.fareHistory.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json(fares);
  } catch (error) {
    console.error('Error fetching fares:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fares' },
      { status: 500 }
    );
  }
}

