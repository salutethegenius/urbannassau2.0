import Link from 'next/link';
import Image from 'next/image';

export default async function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-golden-500 py-12 md:py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Text Content */}
            <div>
              <h1 className="text-5xl md:text-7xl font-black text-brand-black mb-6 leading-tight">
                Go anywhere.<br />
                Get anything.
              </h1>
              
              <p className="text-xl md:text-2xl text-brand-black/80 mb-10 max-w-xl">
                Pick Up&apos;s, deliveries, and errands across Nassau. Safe, always on time, affordable.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/calculator" className="btn-primary text-center text-xl">
                  Get Your Quote
                </Link>
                <Link href="/services" className="btn-white text-center text-xl">
                  View Services
                </Link>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/hero-illustration.png"
                  alt="Urban Nassau Rides - Ride service in Nassau, Bahamas"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-brand-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-brand-black mb-4">
              What we do
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-2">
              We do more than just pickups.
            </p>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
              Trusted partner for pickups and deliveries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Pick up and drop off */}
            <div className="card group">
              <div className="w-14 h-14 bg-golden-500 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-brand-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-brand-black mb-2">Pick up and drop off</h3>
              <p className="text-gray-600 mb-4">Safe pick up and drop offs anywhere, starting from $18.</p>
              <p className="text-2xl font-black text-brand-black">From $18</p>
            </div>

            {/* Package delivery */}
            <div className="card group">
              <div className="w-14 h-14 bg-golden-500 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-brand-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-brand-black mb-2">Package delivery</h3>
              <p className="text-gray-600 mb-4">Secure package delivery, $25 from the boat.</p>
              <p className="text-2xl font-black text-brand-black">$25 from the boat</p>
            </div>

            {/* Food delivery */}
            <div className="card group">
              <div className="w-14 h-14 bg-golden-500 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-brand-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-brand-black mb-2">Food delivery</h3>
              <p className="text-gray-600 mb-4">Food delivery starting from $18.</p>
              <p className="text-2xl font-black text-brand-black">From $18</p>
            </div>

            {/* Errands */}
            <div className="card group">
              <div className="w-14 h-14 bg-golden-500 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-brand-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-brand-black mb-2">Errands</h3>
              <p className="text-gray-600 mb-4">Errands starting from $28.</p>
              <p className="text-2xl font-black text-brand-black">From $28</p>
            </div>

            {/* Personal grocery shopping */}
            <div className="card group">
              <div className="w-14 h-14 bg-golden-500 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-brand-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-brand-black mb-2">Personal grocery shopping</h3>
              <p className="text-gray-600 mb-4">Personal grocery shopping, $99.</p>
              <p className="text-2xl font-black text-brand-black">$99</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/services" className="btn-outline">
              See All Services
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-brand-black mb-4">
              How it works
            </h2>
            <p className="text-xl text-gray-600">
              Three simple steps. That&apos;s all it takes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-brand-black text-golden-500 rounded-2xl flex items-center justify-center text-4xl font-black mx-auto mb-6">
                1
              </div>
              <h3 className="text-2xl font-bold text-brand-black mb-3">Enter Your Trip</h3>
              <p className="text-gray-600 text-lg">
                Tell us where you&apos;re going and how many passengers.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-brand-black text-golden-500 rounded-2xl flex items-center justify-center text-4xl font-black mx-auto mb-6">
                2
              </div>
              <h3 className="text-2xl font-bold text-brand-black mb-3">Get Your Price</h3>
              <p className="text-gray-600 text-lg">
                See the fare instantly — no surprises, no hidden fees.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-brand-black text-golden-500 rounded-2xl flex items-center justify-center text-4xl font-black mx-auto mb-6">
                3
              </div>
              <h3 className="text-2xl font-bold text-brand-black mb-3">Book via WhatsApp</h3>
              <p className="text-gray-600 text-lg">
                Tap one button to send your quote and book your ride.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/calculator" className="btn-secondary text-xl">
              Try the Calculator
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-brand-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Ready to go?
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            Get your quote in seconds. No app required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/calculator" className="btn-secondary text-xl">
              Get a Quote
            </Link>
            <Link href="/careers" className="btn-white text-xl text-center">
              Driver Apply
            </Link>
          </div>
        </div>
      </section>

      {/* Hours Banner */}
      <section className="bg-golden-500 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-brand-black">
            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex flex-col items-center text-center">
              <p className="text-lg font-bold">
                Open daily, 7am to 11pm • Nassau, Bahamas 🇧🇸
              </p>
              <p className="text-sm font-medium opacity-90">
                Before 7am or after 11pm, additional $10 fee.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
