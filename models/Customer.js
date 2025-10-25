import { Schema, model, models } from "mongoose";

const CustomerSchema = new Schema({
  name: {
    type: String,
    required: [true, "Customer name is required!"],
  },
  phone: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  address: {
    street: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
  },
  notes: {
    type: String,
    default: ""
  },
  isActive: {
    type: Boolean,
    default: true
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
CustomerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Customer = models.Customer || model("Customer", CustomerSchema);

export default Customer;
