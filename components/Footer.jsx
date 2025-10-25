import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 text-gray-300 py-12 px-6 relative z-[2]" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Categories Column */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4 font-cairo">
              الفئات
            </h3>
            <ul className="space-y-2 font-cairo">
              <li>
                <Link href="#" className="hover:text-[#029acb] transition-colors">
                  النظارات الطبية
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#029acb] transition-colors">
                  النظارات الشمسية
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#029acb] transition-colors">
                  العدسات اللاصقة
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#029acb] transition-colors">
                  فحوصات النظر
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#029acb] transition-colors">
                  إطارات النظارات
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#029acb] transition-colors">
                  عدسات النظارات
                </Link>
              </li>
            </ul>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4 font-cairo">
              خدماتنا
            </h3>
            <ul className="space-y-2 font-cairo">
              <li>
                <Link href="#" className="hover:text-[#029acb] transition-colors">
                  فحص النظر الشامل
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#029acb] transition-colors">
                  قياس النظر الدقيق
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#029acb] transition-colors">
                  تركيب العدسات
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#029acb] transition-colors">
                  صيانة النظارات
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#029acb] transition-colors">
                  الاستشارات الطبية
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4 font-cairo">
              روابط سريعة
            </h3>
            <ul className="space-y-2 font-cairo">
              <li>
                <Link href="#" className="hover:text-[#029acb] transition-colors">
                  من نحن
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#029acb] transition-colors">
                  خدماتنا
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#029acb] transition-colors">
                  اتصل بنا
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#029acb] transition-colors">
                  سياسة الخصوصية
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info Column */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4 font-cairo">
              معلومات التواصل
            </h3>
            <ul className="space-y-3 font-cairo">
              <li className="flex items-start">
                <svg className="w-6 h-6 text-[#029acb] ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span>كوستي السوق الكبير بالقرب من المستشفى</span>
              </li>
              <li className="flex items-center">
                <svg className="w-6 h-6 text-[#029acb] ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                <span dir="ltr">0915477450</span>
              </li>
              <li className="flex items-center">
                <svg className="w-6 h-6 text-[#029acb] ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <span>jksaaltigani@gmail.com</span>
              </li>
            </ul>

            {/* Social Media Links */}
            <div className="mt-6 flex gap-4">
              <a href="https://www.facebook.com/share/1DiNq8c9Jw/" target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-[#029acb] p-2 rounded-full transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400 font-cairo">
            © 2025 ابصار للبصريات. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
