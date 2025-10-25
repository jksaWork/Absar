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
  Package
} from "lucide-react";
import { toast } from "react-toastify";

export default function ExpenseManagement() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleted, setShowDeleted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [formData, setFormData] = useState({
    purpose: "",
    category: "",
    amount: "",
    description: "",
    receipt: ""
  });

  const categories = [
    { value: "office_supplies", label: "مستلزمات مكتبية" },
    { value: "transportation", label: "مواصلات" },
    { value: "meals", label: "وجبات" },
    { value: "equipment", label: "معدات" },
    { value: "maintenance", label: "صيانة" },
    { value: "utilities", label: "مرافق" },
    { value: "marketing", label: "تسويق" },
    { value: "training", label: "تدريب" },
    { value: "other", label: "أخرى" }
  ];

  const statusLabels = {
    pending: "معلق",
    approved: "موافق عليه",
    rejected: "مرفوض"
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700"
  };

  useEffect(() => {
    fetchExpenses();
  }, [showDeleted]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const employee = JSON.parse(localStorage.getItem("employee") || "{}");
      const response = await fetch(`/api/employee/expenses?employeeId=${employee.id || "1fatam"}&includeDeleted=${showDeleted}`);
      
      if (response.ok) {
        const data = await response.json();
        setExpenses(data);
      } else {
        toast.error("فشل في جلب المصروفات");
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
      toast.error("حدث خطأ في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const employee = JSON.parse(localStorage.getItem("employee") || "{}");
      const url = editingExpense 
        ? `/api/employee/expenses/${editingExpense._id}`
        : "/api/employee/expenses";
      
      const method = editingExpense ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          employeeId: employee.id || "1fatam",
          amount: parseFloat(formData.amount)
        }),
      });

      if (response.ok) {
        toast.success(editingExpense ? "تم تحديث المصروف بنجاح" : "تم إضافة المصروف بنجاح");
        setShowAddForm(false);
        setEditingExpense(null);
        setFormData({ purpose: "", category: "", amount: "", description: "", receipt: "" });
        fetchExpenses();
      } else {
        const error = await response.json();
        toast.error(error.error || "حدث خطأ");
      }
    } catch (error) {
      console.error("Error submitting expense:", error);
      toast.error("حدث خطأ في الاتصال بالخادم");
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({
      purpose: expense.purpose,
      category: expense.category,
      amount: expense.amount.toString(),
      description: expense.description || "",
      receipt: expense.receipt || ""
    });
    setShowAddForm(true);
  };

  const handleDelete = async (expenseId) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المصروف؟")) {
      try {
        const response = await fetch(`/api/employee/expenses/${expenseId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          toast.success("تم حذف المصروف بنجاح");
          fetchExpenses();
        } else {
          toast.error("فشل في حذف المصروف");
        }
      } catch (error) {
        console.error("Error deleting expense:", error);
        toast.error("حدث خطأ في الاتصال بالخادم");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("employee");
    router.push("/employee");
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || expense.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const menuItems = [
    { icon: LayoutDashboard, label: "لوحة التحكم", href: "/employee/dashboard" },
    { icon: Users, label: "العملاء", href: "/employee/customers" },
    { icon: Calendar, label: "الحجوزات", href: "/employee/bookings" },
    { icon: DollarSign, label: "المبيعات", href: "/employee/sales" },
    { icon: TrendingDown, label: "المصروفات", href: "/employee/expenses", active: true },
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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">إدارة المصروفات</h2>
            <p className="text-gray-600">تتبع وإدارة مصروفات الموظفين</p>
          </div>

          {/* Controls */}
          <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus size={20} className="ml-2" />
                إضافة مصروف جديد
              </Button>
              
              <Button
                onClick={() => setShowDeleted(!showDeleted)}
                variant="outline"
                className="flex items-center gap-2"
              >
                {showDeleted ? <EyeOff size={20} /> : <Eye size={20} />}
                {showDeleted ? "إخفاء المحذوفة" : "عرض المحذوفة"}
              </Button>
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              <div className="relative">
                <Search size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="البحث في المصروفات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 w-64"
                />
              </div>
              
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">جميع الفئات</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Summary Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>ملخص المصروفات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{filteredExpenses.length}</p>
                  <p className="text-gray-600">إجمالي المصروفات</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{totalAmount.toLocaleString()} جنيه سوداني</p>
                  <p className="text-gray-600">إجمالي المبلغ</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">
                    {filteredExpenses.length > 0 ? (totalAmount / filteredExpenses.length).toFixed(2) : 0} جنيه سوداني
                  </p>
                  <p className="text-gray-600">متوسط المصروف</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add/Edit Form */}
          {showAddForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{editingExpense ? "تعديل المصروف" : "إضافة مصروف جديد"}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الغرض من المصروف *
                      </label>
                      <Input
                        value={formData.purpose}
                        onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                        placeholder="مثال: شراء مستلزمات مكتبية"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الفئة *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">اختر الفئة</option>
                        {categories.map(cat => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        المبلغ (جنيه سوداني) *
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.amount}
                        onChange={(e) => setFormData({...formData, amount: e.target.value})}
                        placeholder="0.00"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        رابط الإيصال
                      </label>
                      <Input
                        value={formData.receipt}
                        onChange={(e) => setFormData({...formData, receipt: e.target.value})}
                        placeholder="رابط صورة الإيصال"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الوصف
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="وصف تفصيلي للمصروف..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                      {editingExpense ? "تحديث المصروف" : "إضافة المصروف"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingExpense(null);
                        setFormData({ purpose: "", category: "", amount: "", description: "", receipt: "" });
                      }}
                    >
                      إلغاء
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Expenses Table */}
          <Card>
            <CardHeader>
              <CardTitle>قائمة المصروفات</CardTitle>
              <CardDescription>
                عرض جميع المصروفات {showDeleted ? "(بما في ذلك المحذوفة)" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">جاري التحميل...</p>
                </div>
              ) : filteredExpenses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">لا توجد مصروفات</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-right py-3 px-4">الغرض</th>
                        <th className="text-right py-3 px-4">الفئة</th>
                        <th className="text-right py-3 px-4">المبلغ</th>
                        <th className="text-right py-3 px-4">الحالة</th>
                        <th className="text-right py-3 px-4">التاريخ</th>
                        <th className="text-right py-3 px-4">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredExpenses.map((expense) => (
                        <tr key={expense._id} className={`border-b hover:bg-gray-50 ${expense.isDeleted ? 'opacity-60' : ''}`}>
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium">{expense.purpose}</p>
                              {expense.description && (
                                <p className="text-sm text-gray-500 mt-1">{expense.description}</p>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                              {expense.categoryLabel}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-medium">
                            {expense.amount.toLocaleString()} جنيه سوداني
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-sm ${statusColors[expense.status]}`}>
                              {expense.statusLabel}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {new Date(expense.createdAt).toLocaleDateString('ar-SA')}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(expense)}
                                disabled={expense.isDeleted}
                              >
                                <Edit size={16} />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(expense._id)}
                                disabled={expense.isDeleted}
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
