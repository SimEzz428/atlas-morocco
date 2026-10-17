import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email: rawEmail, name, password } = body || {};

    if (typeof rawEmail !== "string" || !EMAIL_RE.test(rawEmail.trim())) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
    }
    // bcrypt ignores everything after 72 bytes, so cap the length instead of silently truncating.
    if (typeof password !== "string" || password.length < 6 || Buffer.byteLength(password) > 72) {
      return NextResponse.json({ error: "Password must be between 6 and 72 characters" }, { status: 400 });
    }

    const email = rawEmail.trim().toLowerCase();
    const existing = await prisma.user.findFirst({ where: { email: { equals: email, mode: "insensitive" } } });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists. Try signing in." }, { status: 409 });
    }

    const displayName = typeof name === "string" && name.trim() ? name.trim().slice(0, 80) : email.split("@")[0];
    const created = await prisma.user.create({
      data: {
        email,
        name: displayName,
        passwordHash: await bcrypt.hash(password, 12),
      },
      select: { id: true, email: true, name: true },
    });

    return NextResponse.json({ user: created }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Failed to register" }, { status: 500 });
  }
}
