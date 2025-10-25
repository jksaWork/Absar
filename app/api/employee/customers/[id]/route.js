import { connectToDB } from "@/utils/database";
import Customer from "@/models/Customer";
const  connectToDatabase =  async () => {
    await connectToDB();
  }
// GET single customer
export async function GET(request, { params }) {
  try {
    await connectToDatabase();

    const customer = await Customer.findById(params.id);

    if (!customer) {
      return Response.json({ error: "العميل غير موجود" }, { status: 404 });
    }

    return Response.json({ success: true, data: customer });
  } catch (error) {
    console.error("Error fetching customer:", error);
    return Response.json(
      { error: "فشل في جلب بيانات العميل" },
      { status: 500 }
    );
  }
}

// PUT update customer
export async function PUT(request, { params }) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { name, phone, email, address, notes, isActive } = body;

    const customer = await Customer.findByIdAndUpdate(
      params.id,
      {
        name,
        phone: phone || null,
        email: email || null,
        address: address || {},
        notes: notes || "",
        isActive: isActive !== undefined ? isActive : true,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    if (!customer) {
      return Response.json({ error: "العميل غير موجود" }, { status: 404 });
    }

    return Response.json({
      success: true,
      message: "تم تحديث العميل بنجاح",
      data: customer,
    });
  } catch (error) {
    console.error("Error updating customer:", error);
    return Response.json(
      { error: "فشل في تحديث العميل" },
      { status: 500 }
    );
  }
}

// DELETE customer
export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();

    const customer = await Customer.findByIdAndDelete(params.id);

    if (!customer) {
      return Response.json({ error: "العميل غير موجود" }, { status: 404 });
    }

    return Response.json({
      success: true,
      message: "تم حذف العميل بنجاح",
    });
  } catch (error) {
    console.error("Error deleting customer:", error);
    return Response.json(
      { error: "فشل في حذف العميل" },
      { status: 500 }
    );
  }
}
