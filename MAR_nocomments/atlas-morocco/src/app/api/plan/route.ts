
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const citySlug = searchParams.get("city");

    const whereClause: any = { userId: session.user.id };
    if (citySlug) {
      whereClause.citySlug = citySlug;
    }

    const tripPlans = await prisma.tripPlan.findMany({
      where: whereClause,
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ tripPlans });
  } catch (error) {
    console.error("Error fetching trip plans:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, citySlug, items } = body;

    if (!title || !items) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let tripPlan;

    if (id) {
      
      tripPlan = await prisma.tripPlan.update({
        where: { id },
        data: {
          title,
          citySlug,
          items: JSON.stringify(items),
          updatedAt: new Date(),
        },
      });
    } else {
      
      tripPlan = await prisma.tripPlan.create({
        data: {
          userId: session.user.id,
          title,
          citySlug,
          items: JSON.stringify(items),
        },
      });
    }

    return NextResponse.json({ tripPlan });
  } catch (error) {
    console.error("Error saving trip plan:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing plan ID" }, { status: 400 });
    }


    const tripPlan = await prisma.tripPlan.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!tripPlan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    await prisma.tripPlan.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting trip plan:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}