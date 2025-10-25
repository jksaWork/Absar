import { connectToDB } from "@/utils/database";
import Booking from "@/models/Booking";
import Customer from "@/models/Customer";
import Expense from "@/models/Expense";
import Product from "@/models/Product";

export async function GET(request) {
  try {
    await connectToDB();

    // Get counts from database
    const [bookingsCount, customersCount, expensesData, productsData] = await Promise.all([
      Booking.countDocuments({ isVisible: true }),
      Customer.countDocuments({ isActive: true }),
      Expense.aggregate([
        { $match: { isDeleted: false } },
        {
          $group: {
            _id: null,
            totalExpenses: { $sum: "$amount" },
            count: { $sum: 1 }
          }
        }
      ]),
      Product.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: null,
            totalProducts: { $sum: 1 },
            lowStockProducts: {
              $sum: {
                $cond: [
                  { $lte: ["$quantity", "$lowStockThreshold"] },
                  1,
                  0
                ]
              }
            }
          }
        }
      ])
    ]);

    // Extract expense data
    const totalExpenses = expensesData.length > 0 ? expensesData[0].totalExpenses : 0;
    const expensesCount = expensesData.length > 0 ? expensesData[0].count : 0;

    // Extract product data
    const totalProducts = productsData.length > 0 ? productsData[0].totalProducts : 0;
    const lowStockProducts = productsData.length > 0 ? productsData[0].lowStockProducts : 0;

    // For now, we'll use mock data for sales
    // In a real app, you'd have separate models for sales
    const salesCount = Math.floor(Math.random() * 100) + 50;

    const stats = {
      customers: customersCount,
      bookings: bookingsCount,
      sales: salesCount,
      expenses: totalExpenses,
      products: totalProducts,
      lowStockProducts: lowStockProducts
    };

    return Response.json(stats, { status: 200 });

  } catch (error) {
    console.error("Get stats error:", error);
    return Response.json(
      { error: "حدث خطأ في جلب الإحصائيات" },
      { status: 500 }
    );
  }
}
