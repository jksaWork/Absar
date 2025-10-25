import React from "react";
import ImageGallery from "@/components/ImageGallery";
import ProductSection from "@/components/ProductSection";
import BookInterviewSection from "@/components/BookInterviewSection";

export const metadata = {
  title: "ابصار للبصريات",
};

function page() {
  return (
    <>
      {/* Hero Section */}
      <div id="home" className="flex flex-col lg:flex-row items-center justify-between min-h-screen w-full px-6 py-12" dir="rtl">
        {/* Left side - Arabic text content */}
        <div className="flex flex-col justify-center lg:w-3/5 lg:pr-8">
          <h1 className="head_text text-center lg:text-right font-cairo">
            رؤيتك، أولويتنا
            <br className="max-md:hidden" />
            <span className="brand_gradient"> ابصار للبصريات</span>
          </h1>
          <p className="desc text-center lg:text-right font-cairo">
            نحن نقدم أفضل الخدمات البصرية المتكاملة من نظارات فاخرة وإطارات مصممة إلى فحوصات النظر الشاملة والعدسة اللاصقة. رؤيتك هي أولويتنا الأولى
          </p>
        </div>

        {/* Right side - Images */}
        <ImageGallery />
      </div>
      
      {/* Services Section */}
      <div id="services" className="py-16 bg-gray-50" dir="rtl">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12 font-cairo">
            خدماتنا المتخصصة
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#029acb] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 font-cairo">فحص النظر الشامل</h3>
              <p className="text-gray-600 font-cairo">فحص دقيق ومتقدم للعين باستخدام أحدث التقنيات الطبية</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#029acb] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 font-cairo">النظارات الطبية</h3>
              <p className="text-gray-600 font-cairo">نظارات طبية عالية الجودة مع إطارات أنيقة ومتنوعة</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#029acb] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 font-cairo">العدسات اللاصقة</h3>
              <p className="text-gray-600 font-cairo">عدسات لاصقة مريحة وآمنة لجميع أنواع الاستخدام</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Categories Section */}
      <div id="products" style={{ width: '100%' }}>
        <ProductSection />
      </div>
      
      {/* Book Interview Section */}
      <div id="appointment">
        <BookInterviewSection />
      </div>

      {/* Contact Section */}
      <div id="contact" className="py-16 bg-white" dir="rtl">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12 font-cairo">
            تواصل معنا
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-6 font-cairo">معلومات التواصل</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-[#029acb] ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span className="text-gray-700 font-cairo">كوستي السوق الكبير بالقرب من المستشفى</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-[#029acb] ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  <span className="text-gray-700 font-cairo" dir="ltr">0915477450</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-[#029acb] ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <span className="text-gray-700 font-cairo">jksaaltigani@gmail.com</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-6 font-cairo">ساعات العمل</h3>
              <div className="space-y-2 text-gray-700 font-cairo">
                <div className="flex justify-between">
                  <span>السبت - الخميس:</span>
                  <span>8:00 ص - 10:00 م</span>
                </div>
                <div className="flex justify-between">
                  <span>الجمعة:</span>
                  <span>2:00 م - 10:00 م</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default page;