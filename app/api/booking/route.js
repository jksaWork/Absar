import { connectToDB } from "@/utils/database";
import Booking from "@/models/Booking";

export async function POST(request) {
  try {
    await connectToDB();

    const { username, phone, interviewType } = await request.json();

    // Validate required fields
    if (!username || !phone || !interviewType) {
      return Response.json(
        { error: "جميع الحقول مطلوبة" },
        { status: 400 }
      );
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!phoneRegex.test(phone)) {
      return Response.json(
        { error: "رقم الهاتف غير صحيح" },
        { status: 400 }
      );
    }

    // Create new booking
    const newBooking = new Booking({
      username,
      phone,
      interviewType,
      status: "pending",
      isVisible: true
    });

    await newBooking.save();

    return Response.json(
      { 
        message: "تم إرسال طلبك بنجاح! سيتواصل معك الطبيب قريباً",
        bookingId: newBooking._id 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Booking error:", error);
    return Response.json(
      { error: "حدث خطأ في الخادم. يرجى المحاولة مرة أخرى" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await connectToDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const isVisible = searchParams.get('isVisible');

    // Build query
    let query = {};
    if (status) {
      query.status = status;
    }
    if (isVisible !== null) {
      query.isVisible = isVisible === 'true';
    }

    const bookings = await Booking.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    return Response.json(bookings, { status: 200 });

  } catch (error) {
    console.error("Get bookings error:", error);
    return Response.json(
      { error: "حدث خطأ في جلب البيانات" },
      { status: 500 }
    );
  }
}
