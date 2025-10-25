import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/database";
import Booking from "@/models/Booking";

// GET - Fetch all bookings
export async function GET(request) {
  try {
    await connectToDB();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const includeInvisible = searchParams.get('includeInvisible') === 'true';
    const date = searchParams.get('date'); // Filter by specific date
    
    let query = {};
    
    // Filter by status if provided
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Filter by visibility
    if (!includeInvisible) {
      query.isVisible = true;
    }
    
    // Filter by date if provided
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.appointmentDate = {
        $gte: startDate,
        $lt: endDate
      };
    }

    const bookings = await Booking.find(query)
      .sort({ createdAt: -1 })
      .lean();

    // Add labels for response
    const statusLabels = Booking.getStatusLabels();
    const interviewTypeLabels = Booking.getInterviewTypeLabels();
    const sourceLabels = Booking.getSourceLabels();
    
    const bookingsWithLabels = bookings.map(booking => ({
      ...booking,
      statusLabel: statusLabels[booking.status],
      interviewTypeLabel: interviewTypeLabels[booking.interviewType],
      sourceLabel: sourceLabels[booking.source]
    }));

    return NextResponse.json(bookingsWithLabels);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

// POST - Create a new booking
export async function POST(request) {
  try {
    await connectToDB();
    
    const body = await request.json();
    const { 
      username, 
      phone, 
      email, 
      interviewType, 
      notes, 
      source = "website",
      appointmentDate,
      appointmentTime,
      assignedEmployee
    } = body;

    // Validation
    if (!username || !phone || !interviewType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const booking = new Booking({
      username,
      phone,
      email: email || "",
      interviewType,
      notes: notes || "",
      source,
      appointmentDate: appointmentDate ? new Date(appointmentDate) : null,
      appointmentTime: appointmentTime || null,
      assignedEmployee: assignedEmployee || null
    });

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

    return NextResponse.json(bookingWithLabels, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
