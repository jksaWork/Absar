"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Menu,
  X,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Filter,
  Search,
  Clock,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  Package
} from "lucide-react";
import { toast } from "react-toastify";

export default function BookingManagement() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInvisible, setShowInvisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [showSMSModal, setShowSMSModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [smsContent, setSmsContent] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    email: "",
    interviewType: "",
    notes: "",
    appointmentDate: "",
    appointmentTime: "",
    assignedEmployee: ""
  });

  const statuses = [
    { value: "pending", label: "معلق", color: "bg-yellow-100 text-yellow-700" },
    { value: "confirmed", label: "مؤكد", color: "bg-green-100 text-green-700" },
    { value: "completed", label: "مكتمل", color: "bg-blue-100 text-blue-700" },
    { value: "cancelled", label: "ملغي", color: "bg-red-100 text-red-700" },
    { value: "rescheduled", label: "معاد جدولته", color: "bg-purple-100 text-purple-700" }
  ];

  const interviewTypes = [
    { value: "eye-examination", label: "فحص العيون" },
    { value: "contact-lens-fitting", label: "تركيب العدسات اللاصقة" },
    { value: "sunglasses-consultation", label: "استشارة النظارات الشمسية" },
    { value: "other", label: "أخرى" }
  ];

  const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
    "17:00", "17:30", "18:00", "18:30", "19:00", "19:30"
  ];

  useEffect(() => {
    fetchBookings();
  }, [showInvisible, filterStatus, filterDate]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      let url = `/api/employee/bookings?includeInvisible=${showInvisible}`;
      
      if (filterStatus && filterStatus !== 'all') {
        url += `&status=${filterStatus}`;
      }
      
      if (filterDate) {
        url += `&date=${filterDate}`;
      }
      
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      } else {
        toast.error("فشل في جلب الحجوزات");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("حدث خطأ في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingBooking 
        ? `/api/employee/bookings/${editingBooking._id}`
        : "/api/employee/bookings";
      
      const method = editingBooking ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(editingBooking ? "تم تحديث الحجز بنجاح" : "تم إضافة الحجز بنجاح");
        setShowAddForm(false);
        setEditingBooking(null);
        setFormData({ 
          username: "", 
          phone: "", 
          email: "", 
          interviewType: "", 
          notes: "", 
          appointmentDate: "", 
          appointmentTime: "", 
          assignedEmployee: "" 
        });
        fetchBookings();
      } else {
        const error = await response.json();
        toast.error(error.error || "حدث خطأ");
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      toast.error("حدث خطأ في الاتصال بالخادم");
    }
  };

  const handleEdit = (booking) => {
    setEditingBooking(booking);
    setFormData({
      username: booking.username,
      phone: booking.phone,
      email: booking.email || "",
      interviewType: booking.interviewType,
      notes: booking.notes || "",
      appointmentDate: booking.appointmentDate ? new Date(booking.appointmentDate).toISOString().split('T')[0] : "",
      appointmentTime: booking.appointmentTime || "",
      assignedEmployee: booking.assignedEmployee || ""
    });
    setShowAddForm(true);
  };

  const handleDelete = async (bookingId) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الحجز؟")) {
      try {
        const response = await fetch(`/api/employee/bookings/${bookingId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          toast.success("تم حذف الحجز بنجاح");
          fetchBookings();
        } else {
          toast.error("فشل في حذف الحجز");
        }
      } catch (error) {
        console.error("Error deleting booking:", error);
        toast.error("حدث خطأ في الاتصال بالخادم");
      }
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const response = await fetch(`/api/employee/bookings/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success("تم تحديث حالة الحجز بنجاح");
        fetchBookings();
      } else {
        toast.error("فشل في تحديث حالة الحجز");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("حدث خطأ في الاتصال بالخادم");
    }
  };

  const handleSendSMS = async (booking) => {
    setSelectedBooking(booking);
    
    // Get SMS preview
    try {
      const response = await fetch(`/api/employee/bookings/${booking._id}/sms`);
      if (response.ok) {
        const data = await response.json();
        setSmsContent(data.smsContent);
        setShowSMSModal(true);
      }
    } catch (error) {
      console.error("Error getting SMS preview:", error);
      toast.error("حدث خطأ في جلب محتوى الرسالة");
    }
  };

  const sendSMS = async () => {
    try {
      const response = await fetch(`/api/employee/bookings/${selectedBooking._id}/sms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ customMessage: smsContent }),
      });

      if (response.ok) {
        toast.success("تم إرسال الرسالة النصية بنجاح");
        setShowSMSModal(false);
        fetchBookings();
      } else {
        toast.error("فشل في إرسال الرسالة النصية");
      }
    } catch (error) {
      console.error("Error sending SMS:", error);
      toast.error("حدث خطأ في الاتصال بالخادم");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("employee");
    router.push("/employee");
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.phone.includes(searchTerm) ||
                         booking.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "لوحة التحكم", href: "/employee/dashboard" },
    { icon: Users, label: "العملاء", href: "/employee/customers" },
    { icon: Calendar, label: "الحجوزات", href: "/employee/bookings", active: true },
    { icon: DollarSign, label: "المبيعات", href: "/employee/sales" },
    { icon: TrendingDown, label: "المصروفات", href: "/employee/expenses" },
    { icon: Package, label: "المنتجات", href: "/employee/products" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-2xl font-bold text-gray-800">ابصار للبصريات</h1>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span className="hidden sm:inline">تسجيل الخروج</span>
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`bg-white border-l border-gray-200 w-64 flex-shrink-0 flex flex-col transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
          } ${
            sidebarOpen ? "fixed inset-y-20 z-50 lg:relative lg:inset-y-0" : "hidden"
          }`}
        >
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    item.active
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  style={{ direction: "rtl" }}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </a>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6" style={{ direction: "rtl" }}>
          {/* Page Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">إدارة الحجوزات</h2>
            <p className="text-gray-600">إدارة وتتبع حجوزات العملاء</p>
          </div>

          {/* Controls */}
          <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus size={20} className="ml-2" />
                إضافة حجز جديد
              </Button>
              
              <Button
                onClick={() => setShowInvisible(!showInvisible)}
                variant="outline"
                className="flex items-center gap-2"
              >
                {showInvisible ? <EyeOff size={20} /> : <Eye size={20} />}
                {showInvisible ? "إخفاء المحذوفة" : "عرض المحذوفة"}
              </Button>
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              <div className="relative">
                <Search size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="البحث في الحجوزات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 w-64"
                />
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">جميع الحالات</option>
                {statuses.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>

              <Input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-48"
                placeholder="فلترة بالتاريخ"
              />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                <p className="text-gray-600">إجمالي الحجوزات</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                <p className="text-gray-600">معلق</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
                <p className="text-gray-600">مؤكد</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
                <p className="text-gray-600">مكتمل</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
                <p className="text-gray-600">ملغي</p>
              </CardContent>
            </Card>
          </div>

          {/* Add/Edit Form */}
          {showAddForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{editingBooking ? "تعديل الحجز" : "إضافة حجز جديد"}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        اسم العميل *
                      </label>
                      <Input
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        placeholder="اسم العميل"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        رقم الهاتف *
                      </label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="رقم الهاتف"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        البريد الإلكتروني
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="البريد الإلكتروني"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        نوع الخدمة *
                      </label>
                      <select
                        value={formData.interviewType}
                        onChange={(e) => setFormData({...formData, interviewType: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">اختر نوع الخدمة</option>
                        {interviewTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        تاريخ الموعد
                      </label>
                      <Input
                        type="date"
                        value={formData.appointmentDate}
                        onChange={(e) => setFormData({...formData, appointmentDate: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        وقت الموعد
                      </label>
                      <select
                        value={formData.appointmentTime}
                        onChange={(e) => setFormData({...formData, appointmentTime: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">اختر الوقت</option>
                        {timeSlots.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ملاحظات
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      placeholder="ملاحظات إضافية..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                      {editingBooking ? "تحديث الحجز" : "إضافة الحجز"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingBooking(null);
                        setFormData({ 
                          username: "", 
                          phone: "", 
                          email: "", 
                          interviewType: "", 
                          notes: "", 
                          appointmentDate: "", 
                          appointmentTime: "", 
                          assignedEmployee: "" 
                        });
                      }}
                    >
                      إلغاء
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* SMS Modal */}
          {showSMSModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Card className="w-full max-w-md mx-4">
                <CardHeader>
                  <CardTitle>إرسال رسالة نصية</CardTitle>
                  <CardDescription>
                    إلى: {selectedBooking?.username} ({selectedBooking?.phone})
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      محتوى الرسالة
                    </label>
                    <textarea
                      value={smsContent}
                      onChange={(e) => setSmsContent(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={4}
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button onClick={sendSMS} className="bg-green-600 hover:bg-green-700 text-white">
                      <MessageSquare size={16} className="ml-2" />
                      إرسال الرسالة
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowSMSModal(false)}
                    >
                      إلغاء
                    </Button>
                  </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Bookings Table */}
          <Card>
            <CardHeader>
              <CardTitle>قائمة الحجوزات</CardTitle>
              <CardDescription>
                عرض جميع الحجوزات {showInvisible ? "(بما في ذلك المحذوفة)" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">جاري التحميل...</p>
                </div>
              ) : filteredBookings.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">لا توجد حجوزات</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-right py-3 px-4">العميل</th>
                        <th className="text-right py-3 px-4">الهاتف</th>
                        <th className="text-right py-3 px-4">نوع الخدمة</th>
                        <th className="text-right py-3 px-4">تاريخ الموعد</th>
                        <th className="text-right py-3 px-4">وقت الموعد</th>
                        <th className="text-right py-3 px-4">الحالة</th>
                        <th className="text-right py-3 px-4">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.map((booking) => (
                        <tr key={booking._id} className={`border-b hover:bg-gray-50 ${!booking.isVisible ? 'opacity-60' : ''}`}>
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium">{booking.username}</p>
                              {booking.email && (
                                <p className="text-sm text-gray-500">{booking.email}</p>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">{booking.phone}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                              {booking.interviewTypeLabel}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {booking.appointmentDate ? 
                              new Date(booking.appointmentDate).toLocaleDateString('ar-SA') : 
                              'غير محدد'
                            }
                          </td>
                          <td className="py-3 px-4">
                            {booking.appointmentTime || 'غير محدد'}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-sm ${
                              statuses.find(s => s.value === booking.status)?.color || 'bg-gray-100 text-gray-700'
                            }`}>
                              {booking.statusLabel}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(booking)}
                                disabled={!booking.isVisible}
                              >
                                <Edit size={16} />
                              </Button>
                              
                              {booking.appointmentDate && booking.appointmentTime && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleSendSMS(booking)}
                                  disabled={booking.smsSent}
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <MessageSquare size={16} />
                                </Button>
                              )}
                              
                              <select
                                value={booking.status}
                                onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                                className="px-2 py-1 text-xs border border-gray-300 rounded"
                                disabled={!booking.isVisible}
                              >
                                {statuses.map(status => (
                                  <option key={status.value} value={status.value}>
                                    {status.label}
                                  </option>
                                ))}
                              </select>
                              
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(booking._id)}
                                disabled={!booking.isVisible}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
