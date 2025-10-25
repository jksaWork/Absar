import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/database";
import Booking from "@/models/Booking";

// GET - Fetch a specific booking by ID
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

    // Add labels for response
    const statusLabels = Booking.getStatusLabels();
    const interviewTypeLabels = Booking.getInterviewTypeLabels();
    const sourceLabels = Booking.getSourceLabels();

    const bookingWithLabels = {
      ...booking.toObject(),
      statusLabel: statusLabels[booking.status],
      interviewTypeLabel: interviewTypeLabels[booking.interviewType],
      sourceLabel: sourceLabels[booking.source]
    };

    return NextResponse.json(bookingWithLabels);
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}

// PUT - Update a booking
export async function PUT(request, { params }) {
  try {
    await connectToDB();
    
    const { id } = params;
    const body = await request.json();
    const { 
      username, 
      phone, 
      email, 
      interviewType, 
      status, 
      appointmentDate, 
      appointmentTime, 
      appointmentDuration,
      assignedEmployee,
      notes,
      isVisible 
    } = body;

    const booking = await Booking.findById(id);
    
    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Update fields if provided
    if (username !== undefined) booking.username = username;
    if (phone !== undefined) booking.phone = phone;
    if (email !== undefined) booking.email = email;
    if (interviewType !== undefined) booking.interviewType = interviewType;
    if (status !== undefined) booking.status = status;
    if (appointmentDate !== undefined) {
      booking.appointmentDate = appointmentDate ? new Date(appointmentDate) : null;
    }
    if (appointmentTime !== undefined) booking.appointmentTime = appointmentTime;
    if (appointmentDuration !== undefined) booking.appointmentDuration = appointmentDuration;
    if (assignedEmployee !== undefined) booking.assignedEmployee = assignedEmployee;
    if (notes !== undefined) booking.notes = notes;
    if (isVisible !== undefined) booking.isVisible = isVisible;

    await booking.save();

    // Add labels for response
    const statusLabels = Booking.getStatusLabels();
    const interviewTypeLabels = Booking.getInterviewTypeLabels();
    const sourceLabels = Booking.getSourceLabels();

    const bookingWithLabels = {
      ...booking.toObject(),
      statusLabel: statusLabels[booking.status],
      interviewTypeLabel: interviewTypeLabels[booking.interviewType],
      sourceLabel: sourceLabels[booking.source]
    };

    return NextResponse.json(bookingWithLabels);
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}

// DELETE - Soft delete a booking (hide it)
export async function DELETE(request, { params }) {
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

    // Soft delete by hiding
    booking.isVisible = false;
    await booking.save();

    return NextResponse.json(
      { message: "Booking deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting booking:", error);
    return NextResponse.json(
      { error: "Failed to delete booking" },
      { status: 500 }
    );
  }
}
