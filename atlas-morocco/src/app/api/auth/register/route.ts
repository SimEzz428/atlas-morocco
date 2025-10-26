import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    let { email, name } = body || {};

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Basic email format check
    const emailRe = /.+@.+\..+/;
    if (!emailRe.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    email = email.trim().toLowerCase();

    const existing = await prisma.user.findFirst({ where: { email: { equals: email, mode: 'insensitive' } } });
    if (existing) {
      return NextResponse.json({ error: "Account already exists" }, { status: 409 });
    }

    const created = await prisma.user.create({
      data: {
        email,
        name: typeof name === "string" && name.trim() ? name.trim() : email.split("@")[0],
      },
      select: { id: true, email: true, name: true },
    });

    return NextResponse.json({ user: created }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Failed to register" }, { status: 500 });
  }
}


