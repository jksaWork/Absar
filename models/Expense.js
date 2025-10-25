import { Schema, model, models } from "mongoose";

const ExpenseSchema = new Schema({
  employeeId: {
    type: String,
    required: [true, "Employee ID is required!"],
  },
  purpose: {
    type: String,
    required: [true, "Expense purpose is required!"],
    trim: true
  },
  category: {
    type: String,
    required: [true, "Expense category is required!"],
    enum: [
      "office_supplies", // مستلزمات مكتبية
      "transportation", // مواصلات
      "meals", // وجبات
      "equipment", // معدات
      "maintenance", // صيانة
      "utilities", // مرافق
      "marketing", // تسويق
      "training", // تدريب
      "other" // أخرى
    ],
    default: "other"
  },
  amount: {
    type: Number,
    required: [true, "Expense amount is required!"],
    min: [0, "Amount cannot be negative"]
  },
  description: {
    type: String,
    required: false,
    trim: true,
    maxlength: [500, "Description cannot exceed 500 characters"]
  },
  receipt: {
    type: String, // URL to receipt image/file
    required: false
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  approvedBy: {
    type: String,
    required: false
  },
  approvedAt: {
    type: Date,
    required: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date,
    required: false
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
ExpenseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Soft delete method
ExpenseSchema.methods.softDelete = function() {
  this.isDeleted = true;
  this.deletedAt = new Date();
  return this.save();
};

// Restore method
ExpenseSchema.methods.restore = function() {
  this.isDeleted = false;
  this.deletedAt = undefined;
  return this.save();
};

// Static method to get category labels in Arabic
ExpenseSchema.statics.getCategoryLabels = function() {
  return {
    office_supplies: "مستلزمات مكتبية",
    transportation: "مواصلات",
    meals: "وجبات",
    equipment: "معدات",
    maintenance: "صيانة",
    utilities: "مرافق",
    marketing: "تسويق",
    training: "تدريب",
    other: "أخرى"
  };
};

// Static method to get status labels in Arabic
ExpenseSchema.statics.getStatusLabels = function() {
  return {
    pending: "معلق",
    approved: "موافق عليه",
    rejected: "مرفوض"
  };
};

const Expense = models.Expense || model("Expense", ExpenseSchema);

export default Expense;
