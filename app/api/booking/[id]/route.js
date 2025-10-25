import { connectToDB } from "@/utils/database";
import Booking from "@/models/Booking";

export async function PUT(request) {
  try {
    await connectToDB();

    const { bookingId, status, appointmentDate, notes, isVisible } = await request.json();

    if (!bookingId) {
      return Response.json(
        { error: "معرف الحجز مطلوب" },
        { status: 400 }
      );
    }

    // Build update object
    const updateData = {};
    if (status) updateData.status = status;
    if (appointmentDate) updateData.appointmentDate = new Date(appointmentDate);
    if (notes !== undefined) updateData.notes = notes;
    if (isVisible !== undefined) updateData.isVisible = isVisible;

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedBooking) {
      return Response.json(
        { error: "الحجز غير موجود" },
        { status: 404 }
      );
    }

    return Response.json(
      { 
        message: "تم تحديث الحجز بنجاح",
        booking: updatedBooking 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Update booking error:", error);
    return Response.json(
      { error: "حدث خطأ في تحديث الحجز" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await connectToDB();

    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('bookingId');

    if (!bookingId) {
      return Response.json(
        { error: "معرف الحجز مطلوب" },
        { status: 400 }
      );
    }

    const deletedBooking = await Booking.findByIdAndDelete(bookingId);

    if (!deletedBooking) {
      return Response.json(
        { error: "الحجز غير موجود" },
        { status: 404 }
      );
    }

    return Response.json(
      { message: "تم حذف الحجز بنجاح" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Delete booking error:", error);
    return Response.json(
      { error: "حدث خطأ في حذف الحجز" },
      { status: 500 }
    );
  }
}