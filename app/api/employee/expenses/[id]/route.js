import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/database";
import Expense from "@/models/Expense";

// GET - Fetch a specific expense by ID
export async function GET(request, { params }) {
  try {
    await connectToDB();
    
    const { id } = params;
    
    const expense = await Expense.findById(id);
    
    if (!expense) {
      return NextResponse.json(
        { error: "Expense not found" },
        { status: 404 }
      );
    }

    // Add labels for response
    const categoryLabels = Expense.getCategoryLabels();
    const statusLabels = Expense.getStatusLabels();

    const expenseWithLabels = {
      ...expense.toObject(),
      categoryLabel: categoryLabels[expense.category],
      statusLabel: statusLabels[expense.status]
    };

    return NextResponse.json(expenseWithLabels);
  } catch (error) {
    console.error("Error fetching expense:", error);
    return NextResponse.json(
      { error: "Failed to fetch expense" },
      { status: 500 }
    );
  }
}

// PUT - Update an expense
export async function PUT(request, { params }) {
  try {
    await connectToDB();
    
    const { id } = params;
    const body = await request.json();
    const { purpose, category, amount, description, receipt, status } = body;

    const expense = await Expense.findById(id);
    
    if (!expense) {
      return NextResponse.json(
        { error: "Expense not found" },
        { status: 404 }
      );
    }

    // Update fields if provided
    if (purpose !== undefined) expense.purpose = purpose;
    if (category !== undefined) expense.category = category;
    if (amount !== undefined) {
      if (amount <= 0) {
        return NextResponse.json(
          { error: "Amount must be greater than 0" },
          { status: 400 }
        );
      }
      expense.amount = amount;
    }
    if (description !== undefined) expense.description = description;
    if (receipt !== undefined) expense.receipt = receipt;
    if (status !== undefined) {
      expense.status = status;
      if (status === "approved" || status === "rejected") {
        expense.approvedAt = new Date();
        // In a real app, you'd get this from the authenticated user
        expense.approvedBy = "admin"; // Placeholder
      }
    }

    await expense.save();

    // Add labels for response
    const categoryLabels = Expense.getCategoryLabels();
    const statusLabels = Expense.getStatusLabels();

    const expenseWithLabels = {
      ...expense.toObject(),
      categoryLabel: categoryLabels[expense.category],
      statusLabel: statusLabels[expense.status]
    };

    return NextResponse.json(expenseWithLabels);
  } catch (error) {
    console.error("Error updating expense:", error);
    return NextResponse.json(
      { error: "Failed to update expense" },
      { status: 500 }
    );
  }
}

// DELETE - Soft delete an expense
export async function DELETE(request, { params }) {
  try {
    await connectToDB();
    
    const { id } = params;
    
    const expense = await Expense.findById(id);
    
    if (!expense) {
      return NextResponse.json(
        { error: "Expense not found" },
        { status: 404 }
      );
    }

    // Soft delete
    await expense.softDelete();

    return NextResponse.json(
      { message: "Expense deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting expense:", error);
    return NextResponse.json(
      { error: "Failed to delete expense" },
      { status: 500 }
    );
  }
}
