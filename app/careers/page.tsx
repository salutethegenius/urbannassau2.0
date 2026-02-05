import Link from 'next/link';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function CareersPage() {
  const driverApplyMessage = "Hi! I'm interested in applying to drive with Urban Nassau Rides. I'd like to learn more about driver opportunities.";

  return (
    <div>
      {/* Hero */}
      <section className="bg-golden-500 py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-brand-black mb-4">
            Drive with us
          </h1>
          <p className="text-xl text-brand-black/80 max-w-2xl mx-auto">
            Join Urban Nassau Rides as a driver. Safe, reliable pickups and deliveries across Nassau. We’re always looking for great people.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-brand-gray">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-static text-center">
            <h2 className="text-2xl font-bold text-brand-black mb-4">
              Driver Apply
            </h2>
            <p className="text-gray-600 mb-8">
              Interested in joining our team? Get in touch via WhatsApp and we’ll get back to you with next steps. Open daily 7am–11pm. After-hours rides may include an additional fee.
            </p>
            <WhatsAppButton message={driverApplyMessage} className="w-full max-w-sm mx-auto">
              Apply via WhatsApp
            </WhatsAppButton>
          </div>
          <p className="text-center mt-8">
            <Link href="/" className="text-golden-600 hover:text-golden-500 font-medium">
              ← Back to home
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
