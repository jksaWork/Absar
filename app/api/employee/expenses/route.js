import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/database";
import Expense from "@/models/Expense";

// GET - Fetch all expenses for an employee
export async function GET(request) {
  try {
    await connectToDB();
    
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');
    const includeDeleted = searchParams.get('includeDeleted') === 'true';
    
    if (!employeeId) {
      return NextResponse.json(
        { error: "Employee ID is required" },
        { status: 400 }
      );
    }

    let query = { employeeId };
    
    // Only include non-deleted expenses unless specifically requested
    if (!includeDeleted) {
      query.isDeleted = false;
    }

    const expenses = await Expense.find(query)
      .sort({ createdAt: -1 })
      .lean();

    // Add category and status labels
    const categoryLabels = Expense.getCategoryLabels();
    const statusLabels = Expense.getStatusLabels();
    
    const expensesWithLabels = expenses.map(expense => ({
      ...expense,
      categoryLabel: categoryLabels[expense.category],
      statusLabel: statusLabels[expense.status]
    }));

    return NextResponse.json(expensesWithLabels);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json(
      { error: "Failed to fetch expenses" },
      { status: 500 }
    );
  }
}

// POST - Create a new expense
export async function POST(request) {
  try {
    await connectToDB();
    
    const body = await request.json();
    const { employeeId, purpose, category, amount, description, receipt } = body;

    // Validation
    if (!employeeId || !purpose || !category || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be greater than 0" },
        { status: 400 }
      );
    }

    const expense = new Expense({
      employeeId,
      purpose,
      category,
      amount,
      description: description || "",
      receipt: receipt || ""
    });

    await expense.save();

    // Add labels for response
    const categoryLabels = Expense.getCategoryLabels();
    const statusLabels = Expense.getStatusLabels();

    const expenseWithLabels = {
      ...expense.toObject(),
      categoryLabel: categoryLabels[expense.category],
      statusLabel: statusLabels[expense.status]
    };

    return NextResponse.json(expenseWithLabels, { status: 201 });
  } catch (error) {
    console.error("Error creating expense:", error);
    return NextResponse.json(
      { error: "Failed to create expense" },
      { status: 500 }
    );
  }
}
