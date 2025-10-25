import { connectToDB } from "@/utils/database";
import Customer from "@/models/Customer";

const  connectToDatabase =  async () => {
  await connectToDB();
}
// GET all customers
export async function GET(request) {
  try {
    await connectToDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      };
    }

    const customers = await Customer.find(query)
      .sort({ createdAt: -1 })
      .limit(100);

    return Response.json({ success: true, data: customers });
  } catch (error) {
    console.error("Error fetching customers:", error);
    return Response.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}

// POST create a new customer
export async function POST(request) {
  try {
    await connectToDB();

    const body = await request.json();
    const { name, phone, email, address, notes } = body;

    // Validate required fields
    if (!name) {
      return Response.json(
        { error: "اسم العميل مطلوب" },
        { status: 400 }
      );
    }

    // Create customer
    const customer = await Customer.create({
      name,
      phone: phone || null,
      email: email || null,
      address: address || {},
      notes: notes || "",
    });

    return Response.json(
      { success: true, message: "تم إضافة العميل بنجاح", data: customer },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating customer:", error);
    return Response.json(
      { error: "فشل في إضافة العميل" },
      { status: 500 }
    );
  }
}
