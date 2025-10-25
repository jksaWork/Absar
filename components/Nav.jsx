"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="w-full bg-transparent absolute top-0 left-0 right-0 z-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/assets/images/logo.svg"
              width="40"
              height="40"
              alt="ابصار للبصريات"
            />
            <div className="text-xl font-bold font-cairo text-[#029acb]">
              ابصار للبصريات
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 space-x-reverse">
            <button
              onClick={() => scrollToSection('home')}
              className="text-[#029acb] hover:text-white transition-colors font-cairo"
            >
              الرئيسية
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className="text-[#029acb] hover:text-white transition-colors font-cairo"
            >
              خدماتنا
            </button>
            <Link
              href="/products"
              className="text-[#029acb] hover:text-white transition-colors font-cairo"
            >
              منتجاتنا
            </Link>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-[#029acb] hover:text-white transition-colors font-cairo"
            >
              اتصل بنا
            </button>
            <button
              onClick={() => scrollToSection('appointment')}
              className="bg-[#029acb] text-white px-4 py-2 rounded-lg hover:bg-[#0288a3] transition-colors font-cairo"
            >
              احجز موعد
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-[#029acb] hover:text-white focus:outline-none font-cairo"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 rounded-lg mt-2">
              <button
                onClick={() => scrollToSection('home')}
                className="block w-full text-right px-3 py-2 text-gray-700 hover:text-[#029acb] transition-colors font-cairo"
              >
                الرئيسية
              </button>
              <button
                onClick={() => scrollToSection('services')}
                className="block w-full text-right px-3 py-2 text-gray-700 hover:text-[#029acb] transition-colors font-cairo"
              >
                خدماتنا
              </button>
              <Link
                href="/products"
                className="block w-full text-right px-3 py-2 text-gray-700 hover:text-[#029acb] transition-colors font-cairo"
              >
                منتجاتنا
              </Link>
              <button
                onClick={() => scrollToSection('contact')}
                className="block w-full text-right px-3 py-2 text-gray-700 hover:text-[#029acb] transition-colors font-cairo"
              >
                اتصل بنا
              </button>
              <button
                onClick={() => scrollToSection('appointment')}
                className="block w-full text-right px-3 py-2 bg-[#029acb] text-white rounded-lg hover:bg-[#0288a3] transition-colors font-cairo mx-3"
              >
                احجز موعد
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Nav;
