"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const ProductItem = ({ name, price, image, id }) => {
  return (
    <Link href={`/products/${id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-3 sm:p-4 cursor-pointer">
        <div className="relative h-24 w-full mb-2 sm:h-32 sm:mb-3">
          <Image
            src={image || "/assets/images/1.jpg"}
            alt={name}
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        </div>
        <div className="flex justify-between items-center">
          <h4 className="font-semibold text-gray-800 font-cairo text-sm sm:text-base">{name}</h4>
          <span className="text-sm sm:text-lg font-bold text-[#029acb]">{price}</span>
        </div>
      </div>
    </Link>
  );
};

const CategorySection = ({ title, products, categorySlug }) => {
  // Don't show category if no products
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <Link 
          href={`/products`}
          className="text-sm text-[#029acb] hover:text-[#0288a3] font-cairo"
        >
          عرض الكل ←
        </Link>
        <h3 className="text-2xl font-bold text-gray-800 font-cairo">{title}</h3>
      </div>
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product, index) => (
            <div key={product._id || index} className="w-full">
              <ProductItem
                name={product.name}
                price={`${product.price.toLocaleString()} جنيه سوداني`}
                image={product.imageUrl}
                id={product._id}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ProductSection = () => {
  const [products, setProducts] = useState({
    eyeglasses: [],
    lenses: [],
    sunglasses: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const [eyeglassesRes, lensesRes, sunglassesRes] = await Promise.all([
        fetch('/api/products?category=eyeglasses&websiteOnly=true&limit=4'),
        fetch('/api/products?category=lenses&websiteOnly=true&limit=4'),
        fetch('/api/products?category=sunglasses&websiteOnly=true&limit=4')
      ]);

      const eyeglasses = eyeglassesRes.ok ? await eyeglassesRes.json() : [];
      const lenses = lensesRes.ok ? await lensesRes.json() : [];
      const sunglasses = sunglassesRes.ok ? await sunglassesRes.json() : [];

      setProducts({
        eyeglasses,
        lenses,
        sunglasses
      });
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    {
      title: "النظارات الطبية",
      slug: "eyeglasses",
      products: products.eyeglasses
    },
    {
      title: "العدسة اللاصقة",
      slug: "lenses", 
      products: products.lenses
    },
    {
      title: "النظارات الشمسية",
      slug: "sunglasses",
      products: products.sunglasses
    }
  ];

  if (loading) {
    return (
      <section className="py-16 px-6 bg-gray-50" style={{ width: '100%' }} dir="rtl">
        <div className="max-w-7xl w-full mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4 font-cairo">
              متجرنا الإلكتروني
            </h2>
            <p className="text-lg text-gray-600 font-cairo">
              جاري تحميل المنتجات...
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Check if any categories have products
  const hasProducts = categories.some(category => category.products.length > 0);

  if (!hasProducts) {
    return null; // Don't show the section if no products are marked for website
  }

  return (
    <section className="py-16 px-6 bg-gray-50" dir="rtl">
      <div className="max-w-7xl w-100 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4 font-cairo">
            متجرنا الإلكتروني
          </h2>
          <p className="text-lg text-gray-600 font-cairo">
            اكتشف مجموعتنا الشاملة من منتجات العناية بالعين
          </p>
        </div>
        
        {categories.map((category, index) => (
          <CategorySection
            key={index}
            title={category.title}
            products={category.products}
            categorySlug={category.slug}
          />
        ))}
      </div>
    </section>
  );
};

export default ProductSection;