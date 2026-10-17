import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

const MAX_ITEMS = 200;
const MAX_TITLE_LENGTH = 120;

type PlanItemInput = {
  id: string;
  name: string;
  city: string;
  day: number;
  lat: number;
  lon: number;
  category: string;
  note?: string;
  visitTime?: number;
  cost?: string;
};

function parseItems(value: unknown): PlanItemInput[] | null {
  if (!Array.isArray(value) || value.length > MAX_ITEMS) return null;
  const items: PlanItemInput[] = [];
  for (const raw of value) {
    if (!raw || typeof raw !== "object") return null;
    const item = raw as Record<string, unknown>;
    const { id, name, city, lat, lon, category } = item;
    if (typeof id !== "string" || typeof name !== "string" || typeof city !== "string") return null;
    if (typeof lat !== "number" || typeof lon !== "number" || !Number.isFinite(lat) || !Number.isFinite(lon)) return null;
    items.push({
      id,
      name,
      city,
      lat,
      lon,
      category: typeof category === "string" ? category : "attraction",
      day: Number.isInteger(item.day) && (item.day as number) > 0 ? (item.day as number) : 1,
      ...(typeof item.note === "string" ? { note: item.note } : {}),
      ...(typeof item.visitTime === "number" ? { visitTime: item.visitTime } : {}),
      ...(typeof item.cost === "string" ? { cost: item.cost } : {}),
    });
  }
  return items;
}

function parseStoredItems(items: string) {
  try {
    const parsed = JSON.parse(items || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function requireUserId() {
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
}

export async function GET() {
  try {
    const userId = await requireUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const plans = await prisma.tripPlan.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({
      plans: plans.map((plan) => ({ ...plan, items: parseStoredItems(plan.items) })),
    });
  } catch (error) {
    console.error("Error fetching saved plans:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Creates a plan, or updates it when `id` refers to one of the user's own plans.
export async function POST(request: NextRequest) {
  try {
    const userId = await requireUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const title = typeof body?.title === "string" ? body.title.trim().slice(0, MAX_TITLE_LENGTH) : "";
    const items = parseItems(body?.items);
    if (!title || !items) {
      return NextResponse.json({ error: "A title and a valid list of places are required" }, { status: 400 });
    }

    const citySlug = items[0]?.city ?? null;
    const data = { title, citySlug, items: JSON.stringify(items) };

    const existing =
      typeof body?.id === "string"
        ? await prisma.tripPlan.findFirst({ where: { id: body.id, userId }, select: { id: true } })
        : null;

    const tripPlan = existing
      ? await prisma.tripPlan.update({ where: { id: existing.id }, data })
      : await prisma.tripPlan.create({ data: { ...data, userId } });

    return NextResponse.json({ tripPlan: { ...tripPlan, items } });
  } catch (error) {
    console.error("Error saving trip plan:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await requireUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const planId = searchParams.get("planId") ?? searchParams.get("id");
    if (!planId) {
      return NextResponse.json({ error: "Missing planId" }, { status: 400 });
    }

    const { count } = await prisma.tripPlan.deleteMany({ where: { id: planId, userId } });
    if (count === 0) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting plan:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
