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
  Package,
  AlertTriangle,
  Image as ImageIcon
} from "lucide-react";
import { toast } from "react-toastify";

export default function ProductManagement() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInactive, setShowInactive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("sunglasses");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "sunglasses",
    brand: "",
    price: "",
    quantity: "",
    lowStockThreshold: "10",
    color: "",
    frameMaterial: "",
    lensType: "",
    prescriptionDetails: "",
    description: "",
    showOnWebsite: false
  });

  const categories = [
    { value: "sunglasses", label: "النظارات الشمسية" },
    { value: "eyeglasses", label: "النظارات الطبية" },
    { value: "lenses", label: "العدسات اللاصقة" }
  ];

  useEffect(() => {
    fetchProducts();
  }, [showInactive, activeTab]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let url = `/api/products?category=${activeTab}&includeInactive=${showInactive}`;
      
      if (searchTerm) {
        url += `&search=${searchTerm}`;
      }
      
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        toast.error("فشل في جلب المنتجات");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("حدث خطأ في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Add image file if selected
      const imageInput = document.getElementById('image');
      if (imageInput.files[0]) {
        formDataToSend.append('image', imageInput.files[0]);
      }
      
      const url = editingProduct 
        ? `/api/products/${editingProduct._id}`
        : "/api/products";
      
      const method = editingProduct ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      if (response.ok) {
        toast.success(editingProduct ? "تم تحديث المنتج بنجاح" : "تم إضافة المنتج بنجاح");
        setShowAddForm(false);
        setEditingProduct(null);
        setImagePreview(null);
        setFormData({ 
          name: "", 
          category: activeTab, 
          brand: "", 
          price: "", 
          quantity: "", 
          lowStockThreshold: "10", 
          color: "", 
          frameMaterial: "", 
          lensType: "", 
          prescriptionDetails: "", 
          description: "" 
        });
        fetchProducts();
      } else {
        const error = await response.json();
        toast.error(error.error || "حدث خطأ");
      }
    } catch (error) {
      console.error("Error submitting product:", error);
      toast.error("حدث خطأ في الاتصال بالخادم");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      brand: product.brand,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      lowStockThreshold: product.lowStockThreshold.toString(),
      color: product.color || "",
      frameMaterial: product.frameMaterial || "",
      lensType: product.lensType || "",
      prescriptionDetails: product.prescriptionDetails || "",
      description: product.description || "",
      showOnWebsite: product.showOnWebsite || false
    });
    setImagePreview(product.imageUrl);
    setShowAddForm(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
      try {
        const response = await fetch(`/api/products/${productId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          toast.success("تم حذف المنتج بنجاح");
          fetchProducts();
        } else {
          toast.error("فشل في حذف المنتج");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("حدث خطأ في الاتصال بالخادم");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("employee");
    router.push("/employee");
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.color?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const stats = {
    total: products.length,
    lowStock: products.filter(p => p.isLowStock).length,
    active: products.filter(p => p.isActive).length,
    inactive: products.filter(p => !p.isActive).length
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "لوحة التحكم", href: "/employee/dashboard" },
    { icon: Users, label: "العملاء", href: "/employee/customers" },
    { icon: Calendar, label: "الحجوزات", href: "/employee/bookings" },
    { icon: DollarSign, label: "المبيعات", href: "/employee/sales" },
    { icon: TrendingDown, label: "المصروفات", href: "/employee/expenses" },
    { icon: Package, label: "المنتجات", href: "/employee/products", active: true },
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
                <div key={item.href}>
                  <a
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
                  
                  {/* Product Categories Sub-menu */}
                  {item.active && item.label === "المنتجات" && (
                    <div className="mr-8 mt-2 space-y-1">
                      {categories.map((category) => (
                        <button
                          key={category.value}
                          onClick={() => setActiveTab(category.value)}
                          className={`w-full text-right px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            activeTab === category.value
                              ? "bg-blue-100 text-blue-700"
                              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                          }`}
                        >
                          {category.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6" style={{ direction: "rtl" }}>
          {/* Page Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">إدارة المنتجات</h2>
            <p className="text-gray-600">إدارة وتتبع منتجات المركز</p>
          </div>

          {/* Controls */}
          <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              <Button
                onClick={() => {
                  setFormData({...formData, category: activeTab});
                  setShowAddForm(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus size={20} className="ml-2" />
                إضافة منتج جديد
              </Button>
              
              <Button
                onClick={() => setShowInactive(!showInactive)}
                variant="outline"
                className="flex items-center gap-2"
              >
                {showInactive ? <EyeOff size={20} /> : <Eye size={20} />}
                {showInactive ? "إخفاء المحذوفة" : "عرض المحذوفة"}
              </Button>
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              <div className="relative">
                <Search size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="البحث في المنتجات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 w-64"
                />
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                <p className="text-gray-600">إجمالي المنتجات</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                <p className="text-gray-600">نشط</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-red-600">{stats.lowStock}</p>
                <p className="text-gray-600">مخزون منخفض</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-gray-600">{stats.inactive}</p>
                <p className="text-gray-600">محذوف</p>
              </CardContent>
            </Card>
          </div>


          {/* Add/Edit Form */}
          {showAddForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{editingProduct ? "تعديل المنتج" : "إضافة منتج جديد"}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        اسم المنتج *
                      </label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="اسم المنتج"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الماركة *
                      </label>
                      <Input
                        value={formData.brand}
                        onChange={(e) => setFormData({...formData, brand: e.target.value})}
                        placeholder="الماركة"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        السعر (جنيه سوداني) *
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        placeholder="0.00"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الكمية *
                      </label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.quantity}
                        onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                        placeholder="0"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        حد المخزون المنخفض
                      </label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.lowStockThreshold}
                        onChange={(e) => setFormData({...formData, lowStockThreshold: e.target.value})}
                        placeholder="10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        اللون
                      </label>
                      <Input
                        value={formData.color}
                        onChange={(e) => setFormData({...formData, color: e.target.value})}
                        placeholder="اللون"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        مادة الإطار
                      </label>
                      <Input
                        value={formData.frameMaterial}
                        onChange={(e) => setFormData({...formData, frameMaterial: e.target.value})}
                        placeholder="مادة الإطار"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        نوع العدسة
                      </label>
                      <Input
                        value={formData.lensType}
                        onChange={(e) => setFormData({...formData, lensType: e.target.value})}
                        placeholder="نوع العدسة"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      تفاصيل الوصفة الطبية
                    </label>
                    <textarea
                      value={formData.prescriptionDetails}
                      onChange={(e) => setFormData({...formData, prescriptionDetails: e.target.value})}
                      placeholder="تفاصيل الوصفة الطبية..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الوصف
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="وصف المنتج..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      صورة المنتج
                    </label>
                    <div className="space-y-4">
                      <input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      {imagePreview && (
                        <div className="mt-2">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="h-32 w-32 object-cover rounded-lg border"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="showOnWebsite"
                      type="checkbox"
                      checked={formData.showOnWebsite}
                      onChange={(e) => setFormData({...formData, showOnWebsite: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="showOnWebsite" className="mr-2 block text-sm font-medium text-gray-700">
                      عرض المنتج على الموقع الإلكتروني
                    </label>
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                      {editingProduct ? "تحديث المنتج" : "إضافة المنتج"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingProduct(null);
                        setImagePreview(null);
                        setFormData({ 
                          name: "", 
                          category: activeTab, 
                          brand: "", 
                          price: "", 
                          quantity: "", 
                          lowStockThreshold: "10", 
                          color: "", 
                          frameMaterial: "", 
                          lensType: "", 
                          prescriptionDetails: "", 
                          description: "",
                          showOnWebsite: false
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

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))
            ) : filteredProducts.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <Package size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">لا توجد منتجات في هذه الفئة</p>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <Card key={product._id} className={`${!product.isActive ? 'opacity-60' : ''}`}>
                  <CardContent className="p-4">
                    <div className="relative">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                          <ImageIcon size={48} className="text-gray-400" />
                        </div>
                      )}
                      
                      {product.isLowStock && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                          <AlertTriangle size={12} />
                          مخزون منخفض
                        </div>
                      )}
                      
                      {product.showOnWebsite && (
                        <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                          على الموقع
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <p className="text-gray-600">{product.brand}</p>
                      {product.color && (
                        <p className="text-sm text-gray-500">اللون: {product.color}</p>
                      )}
                      <p className="text-lg font-bold text-green-600">
                        {product.price.toLocaleString()} جنيه سوداني
                      </p>
                      <p className="text-sm text-gray-500">
                        الكمية: {product.quantity}
                      </p>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(product)}
                        disabled={!product.isActive}
                        className="flex-1"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(product._id)}
                        disabled={!product.isActive}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
