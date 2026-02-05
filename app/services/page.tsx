import Link from 'next/link';
import WhatsAppButton from '@/components/WhatsAppButton';

export default async function ServicesPage() {
  const services = [
    {
      title: 'Pick up and drop off',
      description: 'Safe pick up and drop offs anywhere across New Providence.',
      price: 18,
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
        'Wait time: $5 every 10 minutes',
      ],
    },
    {
      title: 'Package delivery',
      description: 'Secure package delivery. Documents, parcels — we\'ll pick up and drop off.',
      price: 25,
      priceNote: 'from the boat',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      features: [
        'Same-day delivery available',
        'Documents and packages',
        'Secure handling',
      ],
    },
    {
      title: 'Food delivery',
      description: 'Food delivery when you need it. Safe and reliable.',
      price: 18,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      features: [
        'Restaurant and takeaway pickup',
        'Delivered to your door',
      ],
    },
    {
      title: 'Errands',
      description: 'Too busy? Let us handle your errands. Bill payments, pick-ups, drop-offs — we do it all.',
      price: 28,
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
      title: 'Personal grocery shopping',
      description: 'Need groceries? Tell us what you need and we\'ll bring it to you.',
      price: 99,
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
                    <div className="mt-1">
                      {'priceNote' in service && service.priceNote ? (
                        <>
                          <span className="text-2xl font-black text-brand-black">${service.price}</span>
                          <span className="text-sm text-gray-500 ml-1">{service.priceNote}</span>
                        </>
                      ) : (
                        <>
                          <span className="text-sm text-gray-500">From </span>
                          <span className="text-2xl font-black text-brand-black">${service.price}</span>
                        </>
                      )}
                    </div>
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

      {/* Premium Services */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-black text-brand-black mb-4 text-center">
            Premium Services
          </h2>
          <p className="text-xl text-gray-600 text-center max-w-2xl mx-auto mb-12">
            Trusted partner for pickups and deliveries. Safe, always on time.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-static text-center">
              <div className="w-14 h-14 bg-golden-500 rounded-xl flex items-center justify-center mx-auto mb-4 text-brand-black">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-brand-black mb-2">VIP Kids Experience</h3>
              <p className="text-gray-600 mb-4">Safe, dedicated rides for your children when it matters most.</p>
              <WhatsAppButton message="Hi! I'm interested in the VIP Kids Experience. Can you tell me more?" className="w-full">
                Get a Quote
              </WhatsAppButton>
            </div>
            <div className="card-static text-center">
              <div className="w-14 h-14 bg-golden-500 rounded-xl flex items-center justify-center mx-auto mb-4 text-brand-black">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.83 12.83 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.83 12.83 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-brand-black mb-2">School pick ups and drop offs</h3>
              <p className="text-gray-600 mb-4">Reliable school runs so you can focus on your day.</p>
              <WhatsAppButton message="Hi! I need school pick up and drop off. Can you help?" className="w-full">
                Get a Quote
              </WhatsAppButton>
            </div>
            <div className="card-static text-center">
              <div className="w-14 h-14 bg-golden-500 rounded-xl flex items-center justify-center mx-auto mb-4 text-brand-black">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-brand-black mb-2">Private driver</h3>
              <p className="text-gray-600 mb-4">Dedicated driver for your schedule. Quote on request.</p>
              <WhatsAppButton message="Hi! I'm interested in a private driver. Can you give me a quote?" className="w-full">
                Get a Quote
              </WhatsAppButton>
            </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-gray-700">
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
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-3xl font-black text-brand-black mb-1">$5</div>
                <p className="text-sm text-gray-500">Wait time (every 10 min)</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 text-center mt-4">
              Packaging available upon request. Other services are quoted based on the job. Message us for a custom quote!
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
              Get a Quote
            </Link>
            <Link href="/careers" className="bg-white text-brand-black font-bold py-4 px-8 rounded-lg text-xl hover:bg-gray-100 transition-colors text-center">
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
