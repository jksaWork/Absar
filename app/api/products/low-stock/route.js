import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/database";
import Product from "@/models/Product";

// GET - Fetch products with low stock
export async function GET(request) {
  try {
    await connectToDB();
    
    const lowStockProducts = await Product.getLowStockProducts()
      .sort({ quantity: 1 })
      .lean();

    // Add labels and image URLs for response
    const categoryLabels = Product.getCategoryLabels();
    
    const productsWithLabels = lowStockProducts.map(product => ({
      ...product,
      categoryLabel: categoryLabels[product.category],
      imageUrl: product.image || null,
      isLowStock: true
    }));

    return NextResponse.json(productsWithLabels);
  } catch (error) {
    console.error("Error fetching low stock products:", error);
    return NextResponse.json(
      { error: "Failed to fetch low stock products" },
      { status: 500 }
    );
  }
}
