import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/database";
import Product from "@/models/Product";
import cloudinary from "@/lib/cloudinary";

// GET - Fetch all products
export async function GET(request) {
  try {
    await connectToDB();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const includeInactive = searchParams.get('includeInactive') === 'true';
    const lowStockOnly = searchParams.get('lowStockOnly') === 'true';
    const websiteOnly = searchParams.get('websiteOnly') === 'true';
    const limit = searchParams.get('limit');
    
    let query = {};
    
    // Filter by category if provided
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Filter by active status
    if (!includeInactive) {
      query.isActive = true;
    }
    
    // Filter for website display
    if (websiteOnly) {
      query.showOnWebsite = true;
    }
    
    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { color: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Low stock filter
    if (lowStockOnly) {
      query.$expr = { $lte: ["$quantity", "$lowStockThreshold"] };
    }

    let queryBuilder = Product.find(query).sort({ createdAt: -1 });
    
    // Apply limit if provided
    if (limit) {
      const limitNum = parseInt(limit);
      if (!isNaN(limitNum) && limitNum > 0) {
        queryBuilder = queryBuilder.limit(limitNum);
      }
    }
    
    const products = await queryBuilder.lean();

    // Add labels and image URLs for response
    const categoryLabels = Product.getCategoryLabels();
    
    const productsWithLabels = products.map(product => ({
      ...product,
      categoryLabel: categoryLabels[product.category],
      imageUrl: product.image || null,
      isLowStock: product.quantity <= product.lowStockThreshold
    }));

    return NextResponse.json(productsWithLabels);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST - Create a new product with image upload
export async function POST(request) {
  try {
    await connectToDB();
    
    const formData = await request.formData();
    
    // Extract form fields
    const name = formData.get('name');
    const category = formData.get('category');
    const brand = formData.get('brand');
    const price = parseFloat(formData.get('price'));
    const quantity = parseInt(formData.get('quantity'));
    const lowStockThreshold = parseInt(formData.get('lowStockThreshold')) || 10;
    const color = formData.get('color');
    const frameMaterial = formData.get('frameMaterial');
    const lensType = formData.get('lensType');
    const prescriptionDetails = formData.get('prescriptionDetails');
    const description = formData.get('description');
    const imageFile = formData.get('image');

    // Validation
    if (!name || !category || !brand || !price || quantity === null) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (price <= 0) {
      return NextResponse.json(
        { error: "Price must be greater than 0" },
        { status: 400 }
      );
    }

    if (quantity < 0) {
      return NextResponse.json(
        { error: "Quantity cannot be negative" },
        { status: 400 }
      );
    }

    let imageUrl = null;

    // Handle image upload
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(imageFile.type)) {
        return NextResponse.json(
          { error: "Invalid file type. Only JPEG, PNG, and WebP are allowed." },
          { status: 400 }
        );
      }
      
      // Validate file size (5MB max)
      if (imageFile.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: "File size too large. Maximum 5MB allowed." },
          { status: 400 }
        );
      }
      
      // Upload to Cloudinary
      try {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              resource_type: "auto",
              folder: "optical-center/products",
              public_id: `product-${Date.now()}-${Math.random().toString(36).substring(2)}`,
              transformation: [
                { width: 800, height: 800, crop: "fill", quality: "auto" }
              ]
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(buffer);
        });
        
        imageUrl = result.secure_url;
      } catch (error) {
        console.error("Cloudinary upload error:", error);
        return NextResponse.json(
          { error: "Failed to upload image" },
          { status: 500 }
        );
      }
    }

    const product = new Product({
      name,
      category,
      brand,
      price,
      quantity,
      lowStockThreshold,
      color: color || "",
      frameMaterial: frameMaterial || "",
      lensType: lensType || "",
      prescriptionDetails: prescriptionDetails || "",
      description: description || "",
      image: imageUrl
    });

    await product.save();

    // Add labels for response
    const categoryLabels = Product.getCategoryLabels();

    const productWithLabels = {
      ...product.toObject(),
      categoryLabel: categoryLabels[product.category],
      imageUrl: product.image ? `/assets/products/${product.image}` : null,
      isLowStock: product.quantity <= product.lowStockThreshold
    };

    return NextResponse.json(productWithLabels, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
