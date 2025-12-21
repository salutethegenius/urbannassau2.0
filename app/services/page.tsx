import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import WhatsAppButton from '@/components/WhatsAppButton';

async function getFareSettings() {
  const settings = await prisma.fareSettings.findFirst({
    where: { id: 1 }
  });
  return settings;
}

export default async function ServicesPage() {
  const settings = await getFareSettings();

  const services = [
    {
      title: 'Rides',
      description: 'Need to get somewhere? We got you. Safe, reliable rides across New Providence.',
      standardPrice: settings?.rideStandardBase || 15,
      premiumPrice: settings?.ridePremiumBase || 20,
      hasCalculator: true,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      features: [
        'First 5 miles included in base fare',
        '$4 per mile after that',
        '$5 per extra passenger',
        'Standard or Premium service',
      ],
    },
    {
      title: 'Courier / Delivery',
      description: 'Got a package? We\'ll pick it up and drop it off. Documents, parcels, you name it.',
      price: settings?.courierBase || 12,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      features: [
        'Same-day delivery available',
        'Documents and packages',
        'Real-time updates',
        'Secure handling',
      ],
    },
    {
      title: 'Errand Services',
      description: 'Too busy? Let us handle your errands. Bill payments, pick-ups, drop-offs — we do it all.',
      price: settings?.errandBase || 25,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      features: [
        'Bill payments',
        'Bank deposits',
        'Government office runs',
        'General pick-ups & drop-offs',
      ],
    },
    {
      title: 'Personal Shopping',
      description: 'Need groceries? A gift? Something from the store? Tell us what you need and we\'ll bring it to you.',
      price: settings?.shoppingBase || 50,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      features: [
        'Grocery shopping',
        'Gift purchases',
        'Store pickups',
        'Delivered to your door',
      ],
    },
    {
      title: 'Transport of Goods',
      description: 'Moving something bigger? Furniture, equipment, or bulk items — we can help.',
      price: settings?.transportBase || 20,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l-3-3m3 3l3-3m-3 3V3" />
        </svg>
      ),
      features: [
        'Furniture delivery',
        'Equipment transport',
        'Bulk items',
        'Careful handling',
      ],
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-golden-500 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-brand-black mb-4">
            Services & Pricing
          </h1>
          <p className="text-xl text-brand-black/80 max-w-2xl mx-auto">
            Everything you need — rides, deliveries, errands, and more. All at fair prices.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-brand-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div key={index} className="card-static flex flex-col h-full">
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-golden-500 rounded-xl flex items-center justify-center text-brand-black flex-shrink-0">
                    {service.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-brand-black">{service.title}</h2>
                    {'hasCalculator' in service && service.hasCalculator ? (
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-2xl font-black text-brand-black">${service.standardPrice}</span>
                        <span className="text-sm text-gray-500">/ ${service.premiumPrice} premium</span>
                      </div>
                    ) : (
                      <div className="mt-1">
                        <span className="text-sm text-gray-500">From </span>
                        <span className="text-2xl font-black text-brand-black">${service.price}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-4">{service.description}</p>

                {/* Features */}
                <div className="flex-grow">
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4 text-golden-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="mt-auto">
                  {'hasCalculator' in service && service.hasCalculator ? (
                    <Link 
                      href="/calculator" 
                      className="block w-full text-center bg-brand-black hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                    >
                      Get Exact Quote
                    </Link>
                  ) : (
                    <WhatsAppButton 
                      message={`Hi! I'm interested in your ${service.title} service. Can you help me with a quote?`}
                      className="w-full"
                    >
                      Get a Quote
                    </WhatsAppButton>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Info */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-static bg-golden-50 border border-golden-200">
            <h3 className="text-xl font-bold text-brand-black mb-4 flex items-center gap-2">
              <span className="text-golden-600">💡</span>
              How Ride Pricing Works
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-700">
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-3xl font-black text-brand-black mb-1">5 mi</div>
                <p className="text-sm text-gray-500">Free miles included</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-3xl font-black text-brand-black mb-1">$4</div>
                <p className="text-sm text-gray-500">Per additional mile</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-3xl font-black text-brand-black mb-1">$5</div>
                <p className="text-sm text-gray-500">Per extra passenger</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 text-center mt-4">
              Other services are quoted based on the job. Message us for a custom quote!
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-brand-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Use our calculator for rides, or message us for other services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/calculator" className="btn-secondary text-xl">
              Ride Calculator
            </Link>
            <a 
              href="tel:+12428072353" 
              className="bg-white text-brand-black font-bold py-4 px-8 rounded-lg text-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call (242) 807-2353
            </a>
          </div>
        </div>
      </section>

      {/* Hours Banner */}
      <section className="bg-golden-500 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-brand-black">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg font-bold text-center">
              Open Daily: 6:00 AM – 11:45 PM • Nassau, Bahamas 🇧🇸
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
