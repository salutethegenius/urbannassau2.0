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
            <Link 
              href="/careers" 
              className="text-gray-300 hover:text-white font-medium transition-colors"
            >
              Careers
            </Link>
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
              <Link 
                href="/careers" 
                className="text-gray-300 hover:text-white font-medium text-lg py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Careers
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
