import FareCalculator from '@/components/FareCalculator';
import { prisma } from '@/lib/prisma';
import type { FareSettings } from '@/lib/fareCalculation';

const DEFAULT_FARE_SETTINGS: FareSettings = {
  rideStandardBase: 18,
  ridePremiumBase: 20,
  freeDistance: 5,
  perMileRate: 4,
  passengerFee: 5,
  courierBase: 12,
  errandBase: 25,
  shoppingBase: 50,
  transportBase: 20,
};

async function getFareSettings(): Promise<FareSettings> {
  try {
    const settings = await prisma.fareSettings.findFirst({
      where: { id: 1 }
    });
    if (settings) return settings;
  } catch {
    // DB unreachable (e.g. Supabase paused) — use defaults so calculator still works
  }
  return DEFAULT_FARE_SETTINGS;
}

export default async function CalculatorPage() {
  const settings = await getFareSettings();

  return (
    <div>
      {/* Golden Header Bar */}
      <section className="bg-golden-500 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-brand-black mb-4">
            Get Your Quote
          </h1>
          <p className="text-xl text-brand-black/80 max-w-2xl mx-auto">
            Enter your pickup and dropoff. See your price instantly. No surprises.
          </p>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="bg-brand-gray py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FareCalculator settings={settings} />
        </div>
      </section>
    </div>
  );
}
