import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/database";
import Product from "@/models/Product";
import cloudinary from "@/lib/cloudinary";

// GET - Fetch a specific product by ID
export async function GET(request, { params }) {
  try {
    await connectToDB();
    
    const { id } = params;
    
    const product = await Product.findById(id);
    
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Add labels for response
    const categoryLabels = Product.getCategoryLabels();

    const productWithLabels = {
      ...product.toObject(),
      categoryLabel: categoryLabels[product.category],
      imageUrl: product.image || null,
      isLowStock: product.quantity <= product.lowStockThreshold
    };

    return NextResponse.json(productWithLabels);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// PUT - Update a product
export async function PUT(request, { params }) {
  try {
    await connectToDB();
    
    const { id } = params;
    const formData = await request.formData();
    
    const product = await Product.findById(id);
    
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Extract form fields
    const name = formData.get('name');
    const category = formData.get('category');
    const brand = formData.get('brand');
    const price = parseFloat(formData.get('price'));
    const quantity = parseInt(formData.get('quantity'));
    const lowStockThreshold = parseInt(formData.get('lowStockThreshold'));
    const color = formData.get('color');
    const frameMaterial = formData.get('frameMaterial');
    const lensType = formData.get('lensType');
    const prescriptionDetails = formData.get('prescriptionDetails');
    const description = formData.get('description');
    const imageFile = formData.get('image');
    const isActive = formData.get('isActive') === 'true';

    // Update fields if provided
    if (name !== null) product.name = name;
    if (category !== null) product.category = category;
    if (brand !== null) product.brand = brand;
    if (price !== null) {
      if (price <= 0) {
        return NextResponse.json(
          { error: "Price must be greater than 0" },
          { status: 400 }
        );
      }
      product.price = price;
    }
    if (quantity !== null) {
      if (quantity < 0) {
        return NextResponse.json(
          { error: "Quantity cannot be negative" },
          { status: 400 }
        );
      }
      product.quantity = quantity;
    }
    if (lowStockThreshold !== null) product.lowStockThreshold = lowStockThreshold;
    if (color !== null) product.color = color;
    if (frameMaterial !== null) product.frameMaterial = frameMaterial;
    if (lensType !== null) product.lensType = lensType;
    if (prescriptionDetails !== null) product.prescriptionDetails = prescriptionDetails;
    if (description !== null) product.description = description;
    if (isActive !== null) product.isActive = isActive;

    // Handle image update
    if (imageFile && imageFile.size > 0) {
      // Delete old image from Cloudinary if exists
      if (product.image) {
        try {
          // Extract public_id from Cloudinary URL
          const publicId = product.image.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`optical-center/products/${publicId}`);
        } catch (error) {
          console.error("Error deleting old image:", error);
        }
      }
      
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
      
      // Upload new image to Cloudinary
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
        
        product.image = result.secure_url;
      } catch (error) {
        console.error("Cloudinary upload error:", error);
        return NextResponse.json(
          { error: "Failed to upload image" },
          { status: 500 }
        );
      }
    }

    await product.save();

    // Add labels for response
    const categoryLabels = Product.getCategoryLabels();

    const productWithLabels = {
      ...product.toObject(),
      categoryLabel: categoryLabels[product.category],
      imageUrl: product.image || null,
      isLowStock: product.quantity <= product.lowStockThreshold
    };

    return NextResponse.json(productWithLabels);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE - Soft delete a product
export async function DELETE(request, { params }) {
  try {
    await connectToDB();
    
    const { id } = params;
    
    const product = await Product.findById(id);
    
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Soft delete by setting isActive to false
    product.isActive = false;
    await product.save();

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
