import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const plans = await prisma.tripPlan.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" }
    });

    // Parse the JSON items for each plan
    const plansWithParsedItems = plans.map(plan => ({
      ...plan,
      items: JSON.parse(plan.items || '[]')
    }));

    return NextResponse.json({ plans: plansWithParsedItems });
  } catch (error) {
    console.error("Error fetching saved plans:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const planId = searchParams.get("planId");
    if (!planId) {
      return NextResponse.json({ error: "Missing planId" }, { status: 400 });
    }

    // Verify the plan belongs to the user
    const plan = await prisma.tripPlan.findFirst({
      where: { 
        id: planId,
        userId: session.user.id 
      }
    });

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    // Delete the plan (items are stored as JSON within the plan)
    await prisma.tripPlan.delete({
      where: { id: planId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting plan:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
