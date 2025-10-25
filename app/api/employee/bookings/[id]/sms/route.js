import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/database";
import Booking from "@/models/Booking";

// POST - Send SMS notification for a booking
export async function POST(request, { params }) {
  try {
    await connectToDB();
    
    const { id } = params;
    const body = await request.json();
    const { customMessage } = body;
    
    const booking = await Booking.findById(id);
    
    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    if (!booking.appointmentDate || !booking.appointmentTime) {
      return NextResponse.json(
        { error: "Appointment date and time must be set before sending SMS" },
        { status: 400 }
      );
    }

    // Generate SMS content
    const smsContent = customMessage || booking.generateSMSContent();
    
    // In a real application, you would integrate with an SMS service here
    // For now, we'll simulate the SMS sending
    console.log(`SMS to ${booking.phone}: ${smsContent}`);
    
    // Mark SMS as sent
    await booking.markSMSSent(customMessage);
    
    // Update status to confirmed if it was pending
    if (booking.status === "pending") {
      booking.status = "confirmed";
      await booking.save();
    }

    return NextResponse.json({
      message: "SMS sent successfully",
      smsContent,
      phone: booking.phone,
      sentAt: booking.smsSentAt
    });
  } catch (error) {
    console.error("Error sending SMS:", error);
    return NextResponse.json(
      { error: "Failed to send SMS" },
      { status: 500 }
    );
  }
}

// GET - Get SMS preview for a booking
export async function GET(request, { params }) {
  try {
    await connectToDB();
    
    const { id } = params;
    
    const booking = await Booking.findById(id);
    
    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    const smsContent = booking.generateSMSContent();
    
    return NextResponse.json({
      smsContent,
      phone: booking.phone,
      username: booking.username,
      appointmentDate: booking.appointmentDate,
      appointmentTime: booking.appointmentTime,
      smsSent: booking.smsSent,
      smsSentAt: booking.smsSentAt
    });
  } catch (error) {
    console.error("Error getting SMS preview:", error);
    return NextResponse.json(
      { error: "Failed to get SMS preview" },
      { status: 500 }
    );
  }
}
