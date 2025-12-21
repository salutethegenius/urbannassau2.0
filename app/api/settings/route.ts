import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const settings = await prisma.fareSettings.findFirst({
      where: { id: 1 }
    });

    if (!settings) {
      return NextResponse.json(
        { error: 'Settings not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    const settings = await prisma.fareSettings.upsert({
      where: { id: 1 },
      update: {
        rideStandardBase: body.rideStandardBase,
        ridePremiumBase: body.ridePremiumBase,
        freeDistance: body.freeDistance,
        perMileRate: body.perMileRate,
        passengerFee: body.passengerFee,
        courierBase: body.courierBase,
        errandBase: body.errandBase,
        shoppingBase: body.shoppingBase,
        transportBase: body.transportBase,
      },
      create: {
        id: 1,
        rideStandardBase: body.rideStandardBase,
        ridePremiumBase: body.ridePremiumBase,
        freeDistance: body.freeDistance,
        perMileRate: body.perMileRate,
        passengerFee: body.passengerFee,
        courierBase: body.courierBase,
        errandBase: body.errandBase,
        shoppingBase: body.shoppingBase,
        transportBase: body.transportBase,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}

