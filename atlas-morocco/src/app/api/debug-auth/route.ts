import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    return NextResponse.json({
      message: "Auth debug endpoint",
      hasAuthOptions: !!authOptions,
      hasProviders: !!authOptions.providers,
      providerCount: authOptions.providers?.length || 0,
      hasSecret: !!process.env.NEXTAUTH_SECRET,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      nodeEnv: process.env.NODE_ENV,
    });
  } catch (error) {
    return NextResponse.json({
      error: "Failed to debug auth",
      message: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 });
  }
}
