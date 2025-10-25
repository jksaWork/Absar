"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";

const ProductItem = ({ name, price, image }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4">
      <div className="relative h-32 w-full mb-3">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover rounded-lg"
          sizes="(max-width: 768px) 100vw, 25vw"
        />
      </div>
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-gray-800 font-cairo">{name}</h4>
        <span className="text-lg font-bold text-[#029acb]">{price}</span>
      </div>
    </div>
  );
};

const CategoryPage = () => {
  const params = useParams();
  const categorySlug = params.slug;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const categoryData = {
    glasses: {
      title: "النظارات الطبية",
      products: [
        { name: "نظارات كلاسيكية", price: "299 SDG", image: "/assets/images/1.jpg" },
        { name: "نظارات رياضية", price: "399 SDG", image: "/assets/images/1.jpg" },
        { name: "نظارات بلاستيكية", price: "199 SDG", image: "/assets/images/1.jpg" },
        { name: "نظارات تيتانيوم", price: "599 SDG", image: "/assets/images/1.jpg" },
        { name: "نظارات أطفال", price: "149 SDG", image: "/assets/images/1.jpg" },
        { name: "نظارات نسائية", price: "349 SDG", image: "/assets/images/1.jpg" },
        { name: "نظارات رجالية", price: "399 SDG", image: "/assets/images/1.jpg" },
        { name: "نظارات كمبيوتر", price: "249 SDG", image: "/assets/images/1.jpg" },
        { name: "نظارات قراءة", price: "179 SDG", image: "/assets/images/1.jpg" },
        { name: "نظارات متدرجة", price: "329 SDG", image: "/assets/images/1.jpg" },
        { name: "نظارات عدسة واحدة", price: "199 SDG", image: "/assets/images/1.jpg" },
        { name: "نظارات فاخرة", price: "699 SDG", image: "/assets/images/1.jpg" }
      ]
    },
    lenses: {
      title: "العدسة اللاصقة",
      products: [
        { name: "عدسة يومية", price: "89 SDG", image: "/assets/images/2.jpg" },
        { name: "عدسة شهرية", price: "149 SDG", image: "/assets/images/2.jpg" },
        { name: "عدسة ملونة", price: "199 SDG", image: "/assets/images/2.jpg" },
        { name: "عدسة متعددة البؤر", price: "299 SDG", image: "/assets/images/2.jpg" },
        { name: "عدسة توريك", price: "249 SDG", image: "/assets/images/2.jpg" },
        { name: "عدسة ناعمة", price: "179 SDG", image: "/assets/images/2.jpg" },
        { name: "عدسة صلبة", price: "199 SDG", image: "/assets/images/2.jpg" },
        { name: "عدسة هجينة", price: "349 SDG", image: "/assets/images/2.jpg" },
        { name: "عدسة ليلية", price: "229 SDG", image: "/assets/images/2.jpg" },
        { name: "عدسة رياضية", price: "279 SDG", image: "/assets/images/2.jpg" },
        { name: "عدسة طبية", price: "199 SDG", image: "/assets/images/2.jpg" },
        { name: "عدسة فاخرة", price: "399 SDG", image: "/assets/images/2.jpg" }
      ]
    },
    sunglasses: {
      title: "النظارات الشمسية",
      products: [
        { name: "نظارات شمسية كلاسيكية", price: "199 SDG", image: "/assets/images/3.jpg" },
        { name: "نظارات شمسية رياضية", price: "299 SDG", image: "/assets/images/3.jpg" },
        { name: "نظارات شمسية فاخرة", price: "499 SDG", image: "/assets/images/3.jpg" },
        { name: "نظارات شمسية قطبية", price: "399 SDG", image: "/assets/images/3.jpg" },
        { name: "نظارات شمسية نسائية", price: "249 SDG", image: "/assets/images/3.jpg" },
        { name: "نظارات شمسية رجالية", price: "299 SDG", image: "/assets/images/3.jpg" },
        { name: "نظارات شمسية أطفال", price: "149 SDG", image: "/assets/images/3.jpg" },
        { name: "نظارات شمسية كبيرة", price: "349 SDG", image: "/assets/images/3.jpg" },
        { name: "نظارات شمسية صغيرة", price: "199 SDG", image: "/assets/images/3.jpg" },
        { name: "نظارات شمسية معدنية", price: "279 SDG", image: "/assets/images/3.jpg" },
        { name: "نظارات شمسية بلاستيكية", price: "179 SDG", image: "/assets/images/3.jpg" },
        { name: "نظارات شمسية فاخرة", price: "599 SDG", image: "/assets/images/3.jpg" }
      ]
    }
  };

  const loadMoreProducts = () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const category = categoryData[categorySlug];
      if (category) {
        const startIndex = (page - 1) * 4;
        const endIndex = startIndex + 4;
        const newProducts = category.products.slice(startIndex, endIndex);
        
        if (newProducts.length > 0) {
          setProducts(prev => [...prev, ...newProducts]);
          setPage(prev => prev + 1);
        } else {
          setHasMore(false);
        }
      }
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    const category = categoryData[categorySlug];
    if (category) {
      // Load first 4 products
      setProducts(category.products.slice(0, 4));
      setPage(2);
      setHasMore(category.products.length > 4);
    }
  }, [categorySlug]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        loadMoreProducts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, page]);

  const category = categoryData[categorySlug];

  if (!category) {
    return <div className="text-center py-16">الصفحة غير موجودة</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 font-cairo">
            {category.title}
          </h1>
          <p className="text-lg text-gray-600 font-cairo">
            اكتشف جميع منتجات {category.title} المتاحة
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <ProductItem
              key={index}
              name={product.name}
              price={product.price}
              image={product.image}
            />
          ))}
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#029acb]"></div>
            <p className="mt-2 text-gray-600 font-cairo">جاري التحميل...</p>
          </div>
        )}

        {!hasMore && products.length > 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600 font-cairo">تم عرض جميع المنتجات</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
