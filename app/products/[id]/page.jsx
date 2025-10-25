"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight,
  Calendar,
  Phone,
  Eye,
  Package,
  Image as ImageIcon,
  CheckCircle,
  XCircle
} from "lucide-react";

export default function ProductDetails() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${params.id}`);
      
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
      } else {
        router.push("/products");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      router.push("/products");
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = () => {
    router.push("/create-prompt");
  };

  const handleBackToProducts = () => {
    router.push("/products");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" style={{ direction: "rtl" }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" style={{ direction: "rtl" }}>
        <div className="text-center">
          <Package size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">المنتج غير موجود</h2>
          <p className="text-gray-600 mb-4">لم يتم العثور على المنتج المطلوب</p>
          <Button onClick={handleBackToProducts}>
            العودة إلى المنتجات
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ direction: "rtl" }}>
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            variant="outline"
            onClick={handleBackToProducts}
            className="mb-4"
          >
            <ArrowRight size={20} className="ml-2" />
            العودة إلى المنتجات
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div>
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 rounded-lg shadow-lg flex items-center justify-center">
                <ImageIcon size={64} className="text-gray-400" />
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-xl text-gray-600 mb-4">{product.brand}</p>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-green-600">
                  {product.price.toLocaleString()} جنيه سوداني
                </span>
                <div className="flex items-center gap-2">
                  {product.quantity > 0 ? (
                    <>
                      <CheckCircle size={20} className="text-green-500" />
                      <span className="text-green-600 font-medium">متوفر</span>
                    </>
                  ) : (
                    <>
                      <XCircle size={20} className="text-red-500" />
                      <span className="text-red-600 font-medium">غير متوفر</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Product Specifications */}
            <Card>
              <CardHeader>
                <CardTitle>مواصفات المنتج</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium text-gray-700">الفئة:</span>
                    <p className="text-gray-900">{product.categoryLabel}</p>
                  </div>
                  {product.color && (
                    <div>
                      <span className="font-medium text-gray-700">اللون:</span>
                      <p className="text-gray-900">{product.color}</p>
                    </div>
                  )}
                  {product.frameMaterial && (
                    <div>
                      <span className="font-medium text-gray-700">مادة الإطار:</span>
                      <p className="text-gray-900">{product.frameMaterial}</p>
                    </div>
                  )}
                  {product.lensType && (
                    <div>
                      <span className="font-medium text-gray-700">نوع العدسة:</span>
                      <p className="text-gray-900">{product.lensType}</p>
                    </div>
                  )}
                </div>
                
                {product.prescriptionDetails && (
                  <div>
                    <span className="font-medium text-gray-700">تفاصيل الوصفة الطبية:</span>
                    <p className="text-gray-900 mt-1">{product.prescriptionDetails}</p>
                  </div>
                )}
                
                {product.description && (
                  <div>
                    <span className="font-medium text-gray-700">الوصف:</span>
                    <p className="text-gray-900 mt-1">{product.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button
                onClick={handleBookAppointment}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                size="lg"
              >
                <Calendar size={20} className="ml-2" />
                احجز موعد للاستشارة
              </Button>
              
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.open(`tel:+249123456789`)}
                >
                  <Phone size={20} className="ml-2" />
                  اتصل بنا
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push("/products")}
                >
                  <Eye size={20} className="ml-2" />
                  عرض المزيد
                </Button>
              </div>
            </div>

            {/* Additional Info */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h3 className="font-semibold text-blue-900 mb-2">معلومات إضافية</h3>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• جميع المنتجات أصلية وذات جودة عالية</li>
                  <li>• خدمة ما بعد البيع متوفرة</li>
                  <li>• ضمان على جميع المنتجات</li>
                  <li>• استشارة مجانية مع أخصائي البصريات</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
