'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-brand-black sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex items-center">
              <span className="text-golden-500 font-black text-3xl tracking-tight">u</span>
              <span className="text-white font-black text-3xl tracking-tight">n</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-white font-bold text-sm uppercase tracking-wider">Urban Nassau</p>
              <p className="text-golden-500 text-xs uppercase tracking-wider -mt-0.5">Rides</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              href="/" 
              className="text-gray-300 hover:text-white font-medium transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/calculator" 
              className="text-gray-300 hover:text-white font-medium transition-colors"
            >
              Get a Quote
            </Link>
            <Link 
              href="/services" 
              className="text-gray-300 hover:text-white font-medium transition-colors"
            >
              Services
            </Link>
            <a 
              href="tel:+12428072353"
              className="bg-golden-500 hover:bg-golden-400 text-brand-black font-bold py-2.5 px-5 rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call Now
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <div className="flex flex-col gap-4">
              <Link 
                href="/" 
                className="text-gray-300 hover:text-white font-medium text-lg py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/calculator" 
                className="text-gray-300 hover:text-white font-medium text-lg py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get a Quote
              </Link>
              <Link 
                href="/services" 
                className="text-gray-300 hover:text-white font-medium text-lg py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Services
              </Link>
              <a 
                href="tel:+12428072353"
                className="bg-golden-500 text-brand-black font-bold py-3 px-6 rounded-lg text-center"
              >
                Call Now: (242) 807-2353
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
