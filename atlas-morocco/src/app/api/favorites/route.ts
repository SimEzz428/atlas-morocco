import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getCity } from "@/data/cities";

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

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ favorites });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await requireUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const citySlug = typeof body?.citySlug === "string" ? body.citySlug : "";
    if (!getCity(citySlug)) {
      return NextResponse.json({ error: "Unknown city" }, { status: 400 });
    }

    const favorite = await prisma.favorite.upsert({
      where: { userId_citySlug: { userId, citySlug } },
      create: { userId, citySlug },
      update: {},
    });

    return NextResponse.json({ favorite });
  } catch (error) {
    console.error("Error adding favorite:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await requireUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const citySlug = new URL(request.url).searchParams.get("citySlug");
    if (!citySlug) {
      return NextResponse.json({ error: "Missing citySlug" }, { status: 400 });
    }

    await prisma.favorite.deleteMany({ where: { userId, citySlug } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing favorite:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
