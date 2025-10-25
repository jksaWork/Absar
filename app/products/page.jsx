"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search,
  Package,
  Image as ImageIcon,
  Calendar,
  Phone,
  Eye
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProductCatalog() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("sunglasses");

  const categories = [
    { value: "sunglasses", label: "النظارات الشمسية" },
    { value: "eyeglasses", label: "النظارات الطبية" },
    { value: "lenses", label: "العدسات اللاصقة" }
  ];

  useEffect(() => {
    fetchProducts();
  }, [activeTab]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products?category=${activeTab}`);
      
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.color?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleBookAppointment = () => {
    router.push("/create-prompt");
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ direction: "rtl" }}>
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">ابصار للبصريات</h1>
            <p className="text-xl text-gray-600 mb-8">اكتشف مجموعتنا المتنوعة من النظارات والعدسات</p>
            
            {/* Search */}
            <div className="max-w-md mx-auto relative">
              <Search size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="البحث في المنتجات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg max-w-md mx-auto">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setActiveTab(category.value)}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === category.value
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
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
            <div className="col-span-full text-center py-12">
              <Package size={64} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 text-lg">لا توجد منتجات في هذه الفئة</p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <Card key={product._id} className="hover:shadow-lg transition-shadow cursor-pointer">
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
                    
                    {product.quantity === 0 && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                        نفد المخزون
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
                      {product.quantity > 0 ? "متوفر" : "غير متوفر"}
                    </p>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => router.push(`/products/${product._id}`)}
                    >
                      <Eye size={16} className="ml-2" />
                      عرض التفاصيل
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Call to Action */}
        <div className="bg-blue-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">هل تحتاج إلى استشارة؟</h2>
          <p className="text-blue-100 mb-6">
            احجز موعدك الآن للحصول على أفضل استشارة بصريات
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleBookAppointment}
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              <Calendar size={20} className="ml-2" />
              احجز موعد
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              <Phone size={20} className="ml-2" />
              اتصل بنا
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
