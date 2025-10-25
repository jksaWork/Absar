"use client";

import React, { useState, useEffect } from "react";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const url = filter === "all" ? "/api/booking" : `/api/booking?status=${filter}`;
      const response = await fetch(url);
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const response = await fetch(`/api/booking/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchBookings(); // Refresh the list
        alert("تم تحديث حالة الحجز بنجاح");
      } else {
        alert("حدث خطأ في تحديث الحجز");
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("حدث خطأ في الاتصال");
    }
  };

  const toggleVisibility = async (bookingId, isVisible) => {
    try {
      const response = await fetch(`/api/booking/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isVisible: !isVisible }),
      });

      if (response.ok) {
        fetchBookings(); // Refresh the list
      } else {
        alert("حدث خطأ في تحديث الحجز");
      }
    } catch (error) {
      console.error("Error updating visibility:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "confirmed": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending": return "في الانتظار";
      case "confirmed": return "مؤكد";
      case "completed": return "مكتمل";
      case "cancelled": return "ملغي";
      default: return status;
    }
  };

  const getInterviewTypeText = (type) => {
    switch (type) {
      case "eye-examination": return "فحص النظر";
      case "contact-lens-fitting": return "قياس العدسات اللاصقة";
      case "sunglasses-consultation": return "استشارة النظارات الشمسية";
      case "other": return "أخرى";
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl font-cairo">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 font-cairo">
            إدارة الحجوزات
          </h1>

          {/* Filter */}
          <div className="mb-6">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#029acb] font-cairo"
            >
              <option value="all">جميع الحجوزات</option>
              <option value="pending">في الانتظار</option>
              <option value="confirmed">مؤكد</option>
              <option value="completed">مكتمل</option>
              <option value="cancelled">ملغي</option>
            </select>
          </div>

          {/* Bookings Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-cairo">
                    الاسم
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-cairo">
                    الهاتف
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-cairo">
                    نوع الفحص
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-cairo">
                    الحالة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-cairo">
                    التاريخ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-cairo">
                    مرئي
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-cairo">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 font-cairo">
                      {booking.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-cairo">
                      {booking.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-cairo">
                      {getInterviewTypeText(booking.interviewType)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)} font-cairo`}>
                        {getStatusText(booking.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-cairo">
                      {new Date(booking.createdAt).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleVisibility(booking._id, booking.isVisible)}
                        className={`px-3 py-1 text-xs font-semibold rounded-full font-cairo ${
                          booking.isVisible 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {booking.isVisible ? 'مرئي' : 'مخفي'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        {booking.status === "pending" && (
                          <>
                            <button
                              onClick={() => updateBookingStatus(booking._id, "confirmed")}
                              className="text-blue-600 hover:text-blue-900 font-cairo"
                            >
                              تأكيد
                            </button>
                            <button
                              onClick={() => updateBookingStatus(booking._id, "cancelled")}
                              className="text-red-600 hover:text-red-900 font-cairo"
                            >
                              إلغاء
                            </button>
                          </>
                        )}
                        {booking.status === "confirmed" && (
                          <button
                            onClick={() => updateBookingStatus(booking._id, "completed")}
                            className="text-green-600 hover:text-green-900 font-cairo"
                          >
                            إكمال
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {bookings.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 font-cairo">لا توجد حجوزات</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;
