export interface FareSettings {
  rideStandardBase: number;
  ridePremiumBase: number;
  freeDistance: number;
  perMileRate: number;
  passengerFee: number;
  courierBase: number;
  errandBase: number;
  shoppingBase: number;
  transportBase: number;
}

export interface FareBreakdown {
  baseFare: number;
  distanceFare: number;
  passengerFare: number;
  totalFare: number;
}

export type ServiceType = 'ride-standard' | 'ride-premium';

/**
 * Calculate fare based on distance and passengers
 * Formula: Total = BaseFare + max(0, (distance - freeDistance) * perMileRate) + max(0, (passengers - 1) * passengerFee)
 */
export function calculateFare(
  distance: number,
  passengers: number,
  serviceType: ServiceType,
  settings: FareSettings
): FareBreakdown {
  // Get base fare based on service type
  const baseFare = serviceType === 'ride-premium' 
    ? settings.ridePremiumBase 
    : settings.rideStandardBase;

  // Calculate distance fare (first 5 miles free)
  const chargeableDistance = Math.max(0, distance - settings.freeDistance);
  const distanceFare = chargeableDistance * settings.perMileRate;

  // Calculate passenger fare (first passenger free)
  const extraPassengers = Math.max(0, passengers - 1);
  const passengerFare = extraPassengers * settings.passengerFee;

  // Calculate total
  const totalFare = baseFare + distanceFare + passengerFare;

  return {
    baseFare: Math.round(baseFare * 100) / 100,
    distanceFare: Math.round(distanceFare * 100) / 100,
    passengerFare: Math.round(passengerFare * 100) / 100,
    totalFare: Math.round(totalFare * 100) / 100,
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

