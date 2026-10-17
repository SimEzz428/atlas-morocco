import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// Profile summary for the signed-in user.
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [user, plans, favoriteCount] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true, createdAt: true } }),
      prisma.tripPlan.findMany({ where: { userId }, select: { items: true } }),
      prisma.favorite.count({ where: { userId } }),
    ]);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cities = new Set<string>();
    let placeCount = 0;
    for (const plan of plans) {
      try {
        const items = JSON.parse(plan.items) as { city?: string }[];
        placeCount += items.length;
        for (const item of items) if (item.city) cities.add(item.city);
      } catch {
        // Ignore malformed legacy rows.
      }
    }

    return NextResponse.json({
      user,
      stats: { planCount: plans.length, placeCount, cityCount: cities.size, favoriteCount },
    });
  } catch (error) {
    console.error("Error loading profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
