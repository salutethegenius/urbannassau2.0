import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-brand-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center">
                <span className="text-golden-500 font-black text-4xl tracking-tight">u</span>
                <span className="text-white font-black text-4xl tracking-tight">n</span>
              </div>
              <div>
                <p className="font-bold text-lg uppercase tracking-wider">Urban Nassau</p>
                <p className="text-golden-500 text-sm uppercase tracking-wider -mt-0.5">Rides</p>
              </div>
            </div>
            <p className="text-gray-400 max-w-sm">
              Your trusted partner for rides, deliveries, and errands in Nassau, Bahamas. Fast, reliable, and always on time.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-golden-500 font-bold text-sm uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="text-gray-400 hover:text-white transition-colors">
                  Get a Quote
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-400 hover:text-white transition-colors">
                  Services & Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-golden-500 font-bold text-sm uppercase tracking-wider mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-golden-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-400">Nassau, Bahamas</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-golden-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+12428072353" className="text-gray-400 hover:text-white transition-colors">
                  (242) 807-2353
                </a>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-golden-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-400">6AM - 11:45PM Daily</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Urban Nassau Rides. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <span>Made with</span>
            <span className="text-red-500">❤️</span>
            <a 
              href="https://kemisdigital.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-golden-500 hover:text-golden-400 font-medium transition-colors"
            >
              KemisDigital
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
