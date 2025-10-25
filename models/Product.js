import { Schema, model, models } from "mongoose";

const ProductSchema = new Schema({
  name: {
    type: String,
    required: [true, "Product name is required!"],
    trim: true
  },
  category: {
    type: String,
    required: [true, "Product category is required!"],
    enum: ["sunglasses", "eyeglasses", "lenses"],
    default: "eyeglasses"
  },
  brand: {
    type: String,
    required: [true, "Brand is required!"],
    trim: true
  },
  price: {
    type: Number,
    required: [true, "Price is required!"],
    min: [0, "Price cannot be negative"]
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required!"],
    min: [0, "Quantity cannot be negative"],
    default: 0
  },
  lowStockThreshold: {
    type: Number,
    default: 10,
    min: [0, "Low stock threshold cannot be negative"]
  },
  color: {
    type: String,
    required: false,
    trim: true
  },
  frameMaterial: {
    type: String,
    required: false,
    trim: true
  },
  lensType: {
    type: String,
    required: false,
    trim: true
  },
  prescriptionDetails: {
    type: String,
    required: false,
    trim: true,
    maxlength: [1000, "Prescription details cannot exceed 1000 characters"]
  },
  description: {
    type: String,
    required: false,
    trim: true,
    maxlength: [2000, "Description cannot exceed 2000 characters"]
  },
  image: {
    type: String, // Store Cloudinary URL
    required: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  showOnWebsite: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
ProductSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to get category labels in Arabic
ProductSchema.statics.getCategoryLabels = function() {
  return {
    sunglasses: "النظارات الشمسية",
    eyeglasses: "النظارات الطبية",
    lenses: "العدسات اللاصقة"
  };
};

// Method to check if product is low in stock
ProductSchema.methods.isLowStock = function() {
  return this.quantity <= this.lowStockThreshold;
};

// Method to get image URL (now returns Cloudinary URL directly)
ProductSchema.methods.getImageUrl = function() {
  return this.image || null;
};

// Static method to get low stock products
ProductSchema.statics.getLowStockProducts = function() {
  return this.find({
    isActive: true,
    $expr: { $lte: ["$quantity", "$lowStockThreshold"] }
  });
};

const Product = models.Product || model("Product", ProductSchema);

export default Product;
