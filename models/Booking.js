import { Schema, model, models } from "mongoose";

const BookingSchema = new Schema({
  username: {
    type: String,
    required: [true, "Username is required!"],
  },
  phone: {
    type: String,
    required: [true, "Phone number is required!"],
  },
  email: {
    type: String,
    required: false
  },
  interviewType: {
    type: String,
    required: [true, "Interview type is required!"],
    enum: ["eye-examination", "contact-lens-fitting", "sunglasses-consultation", "other"]
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "completed", "cancelled", "rescheduled"],
    default: "pending"
  },
  isVisible: {
    type: Boolean,
    default: true
  },
  appointmentDate: {
    type: Date,
    default: null
  },
  appointmentTime: {
    type: String, // Store time as string like "09:00", "14:30"
    default: null
  },
  appointmentDuration: {
    type: Number, // Duration in minutes
    default: 30
  },
  assignedEmployee: {
    type: String, // Employee ID who will handle the appointment
    required: false
  },
  smsSent: {
    type: Boolean,
    default: false
  },
  smsSentAt: {
    type: Date,
    required: false
  },
  smsContent: {
    type: String,
    required: false
  },
  notes: {
    type: String,
    default: ""
  },
  source: {
    type: String,
    enum: ["website", "phone", "walk-in", "employee"],
    default: "website"
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
BookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to get status labels in Arabic
BookingSchema.statics.getStatusLabels = function() {
  return {
    pending: "معلق",
    confirmed: "مؤكد",
    completed: "مكتمل",
    cancelled: "ملغي",
    rescheduled: "معاد جدولته"
  };
};

// Static method to get interview type labels in Arabic
BookingSchema.statics.getInterviewTypeLabels = function() {
  return {
    "eye-examination": "فحص العيون",
    "contact-lens-fitting": "تركيب العدسات اللاصقة",
    "sunglasses-consultation": "استشارة النظارات الشمسية",
    "other": "أخرى"
  };
};

// Static method to get source labels in Arabic
BookingSchema.statics.getSourceLabels = function() {
  return {
    website: "الموقع الإلكتروني",
    phone: "هاتف",
    "walk-in": "زيارة مباشرة",
    employee: "موظف"
  };
};

// Method to generate SMS content
BookingSchema.methods.generateSMSContent = function() {
  const date = this.appointmentDate ? new Date(this.appointmentDate).toLocaleDateString('ar-SA') : 'غير محدد';
  const time = this.appointmentTime || 'غير محدد';
  
  return `مرحباً ${this.username}، تم تأكيد موعدك في مركز ابصار للبصريات في ${date} الساعة ${time}. يرجى الحضور في الوقت المحدد. شكراً لك.`;
};

// Method to mark SMS as sent
BookingSchema.methods.markSMSSent = function(customContent = null) {
  this.smsSent = true;
  this.smsSentAt = new Date();
  this.smsContent = customContent || this.generateSMSContent();
  return this.save();
};

const Booking = models.Booking || model("Booking", BookingSchema);

export default Booking;
