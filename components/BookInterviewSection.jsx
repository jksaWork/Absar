"use client";

import React, { useState, useEffect } from "react";

const CounterItem = ({ number, label, icon }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
  // Extract the numeric value from strings like "500+", "1200+", etc.
  const targetNumber = parseInt(number.replace(/\D/g, ''));
  const suffix = number.replace(/\d/g, ''); // Get the "+" or other suffix
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    
    const element = document.getElementById(`counter-${label}`);
    if (element) {
      observer.observe(element);
    }
    
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [label]);
  
  useEffect(() => {
    if (isVisible) {
      const duration = 2000; // 2 seconds
      const increment = targetNumber / (duration / 16); // 60fps
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= targetNumber) {
          setCount(targetNumber);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, 16);
      
      return () => clearInterval(timer);
    }
  }, [isVisible, targetNumber]);
  
  return (
    <div id={`counter-${label}`} className="text-center p-10 bg-white rounded-lg shadow-lg p-8 border border-gray-200">
      {icon && (
        <div className="mb-4 text-[#029acb]">
          {icon}
        </div>
      )}
      <div className="text-4xl font-bold text-[#029acb] font-cairo">
        {count}{suffix}
      </div>
    </div>
  );
};

const BookInterviewSection = () => {
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    interviewType: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Booking submitted successfully:", result);
        setSubmitted(true);
        
        // Reset form after 5 seconds
        setTimeout(() => {
          setSubmitted(false);
          setFormData({
            username: "",
            phone: "",
            interviewType: ""
          });
        }, 5000);
      } else {
        console.error("Booking failed:", result.error);
        alert(result.error || "حدث خطأ في إرسال الطلب");
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى");
    }
  };

  return (
    <section className="w-full py-16 px-1  mx-1" dir="rtl">
      <div className="w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4 font-cairo">
            احجز موعد فحص النظر
          </h2>
          <p className="text-lg text-gray-600 font-cairo">
            املأ النموذج أدناه وسيتواصل معك الطبيب لتحديد موعد الفحص
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Left Side - Counters */}
          <div className="lg:w-1/2">
            <div className=" p-8 ">
              {/* <h3 className="text-2xl font-bold text-gray-800 mb-8 font-cairo text-center lg:text-right">
                إحصائياتنا
              </h3> */}
              <div className="grid grid-cols-2 gap-8">
                <CounterItem
                  number="500+"
                  label="عميل راضي"
                  icon={
                    <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  }
                />
                <CounterItem
                  number="1200+"
                  label="نظارة شمسية"
                  icon={
                    <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  }
                />
                <CounterItem
                  number="800+"
                  label="عدسة لاصقة"
                  icon={
                    <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  }
                />
                <CounterItem
                  number="1500+"
                  label="نظارة طبية"
                  icon={
                    <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  }
                />
              </div>
            </div>
          </div>

          {/* Right Side - Booking Form */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
              {!submitted ? (
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label htmlFor="username" className="block text-gray-700 font-semibold mb-2 font-cairo">
                      اسم المستخدم
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#029acb] font-cairo"
                      placeholder="أدخل اسمك الكامل"
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="phone" className="block text-gray-700 font-semibold mb-2 font-cairo">
                      رقم الهاتف
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#029acb] font-cairo"
                      placeholder="0915477450"
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="interviewType" className="block text-gray-700 font-semibold mb-2 font-cairo">
                      نوع الفحص
                    </label>
                    <select
                      id="interviewType"
                      name="interviewType"
                      value={formData.interviewType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#029acb] font-cairo bg-white"
                    >
                      <option value="">اختر نوع الفحص</option>
                      <option value="eye-examination">فحص النظر</option>
                      <option value="contact-lens-fitting">قياس العدسات اللاصقة</option>
                      <option value="sunglasses-consultation">استشارة النظارات الشمسية</option>
                      <option value="other">أخرى</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#029acb] text-white py-3 rounded-lg font-semibold hover:bg-[#0288a3] transition-colors duration-300 font-cairo"
                  >
                    إرسال الطلب
                  </button>
                </form>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                  <div className="mb-4">
                    <svg className="w-16 h-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-green-700 mb-4 font-cairo">
                    تم إرسال طلبك بنجاح!
                  </h3>
                  <p className="text-lg text-gray-700 font-cairo">
                    سيقوم الطبيب بمراجعة طلبك وتحديد موعد الزيارة. ستتلقى تأكيدًا على رقم هاتفك
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookInterviewSection;
