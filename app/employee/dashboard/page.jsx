"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  Package
} from "lucide-react";

export default function EmployeeDashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState({
    customers: 0,
    bookings: 0,
    sales: 0,
    expenses: 0,
    products: 0,
    lowStockProducts: 0,
  });

  useEffect(() => {
    // Fetch stats from API
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Replace with actual API endpoint
      const response = await fetch("/api/employee/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("employee");
    router.push("/employee");
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "لوحة التحكم", href: "/employee/dashboard", active: true },
    { icon: Users, label: "العملاء", href: "/employee/customers" },
    { icon: Calendar, label: "الحجوزات", href: "/employee/bookings" },
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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">لوحة التحكم</h2>
            <p className="text-gray-600">نظرة عامة على الأداء والإحصائيات</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {/* Customers Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">إجمالي العملاء</CardTitle>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.customers}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-green-600">+12%</span>
                  عن الشهر الماضي
                </p>
              </CardContent>
            </Card>

            {/* Bookings Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">الحجوزات</CardTitle>
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.bookings}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-green-600">+8%</span>
                  عن الشهر الماضي
                </p>
              </CardContent>
            </Card>

            {/* Sales Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">المبيعات</CardTitle>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.sales.toLocaleString()} جنيه سوداني</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-green-600">+23%</span>
                  عن الشهر الماضي
                </p>
              </CardContent>
            </Card>

            {/* Expenses Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">المصروفات</CardTitle>
                <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <TrendingDown className="h-6 w-6 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.expenses.toLocaleString()} جنيه سوداني</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                  <span className="text-red-600">-5%</span>
                  عن الشهر الماضي
                </p>
              </CardContent>
            </Card>

            {/* Products Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">المنتجات</CardTitle>
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Package className="h-6 w-6 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.products}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
                  {stats.lowStockProducts > 0 ? (
                    <>
                      <TrendingDown className="h-4 w-4 text-red-600" />
                      <span className="text-red-600">{stats.lowStockProducts}</span>
                      منتج مخزون منخفض
                    </>
                  ) : (
                    <>
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-green-600">مخزون جيد</span>
                    </>
                  )}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>آخر الحجوزات</CardTitle>
                <CardDescription>عرض آخر 5 حجوزات</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">عمر محمد</p>
                      <p className="text-sm text-gray-500">فحص عيون - 2 مساءً</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                      مؤكدة
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">فاطمة أحمد</p>
                      <p className="text-sm text-gray-500">استكمال نظارات - 4 مساءً</p>
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                      معلقة
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ملخص المبيعات</CardTitle>
                <CardDescription>إحصائيات هذا الشهر</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">إجمالي المبيعات</span>
                    <span className="font-bold text-lg">15,500 جنيه سوداني</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">عدد الطلبات</span>
                    <span className="font-bold text-lg">45 طلب</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">متوسط الطلب</span>
                    <span className="font-bold text-lg">344 جنيه سوداني</span>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">صافي الربح</span>
                      <span className="font-bold text-lg text-green-600">12,000 جنيه سوداني</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
