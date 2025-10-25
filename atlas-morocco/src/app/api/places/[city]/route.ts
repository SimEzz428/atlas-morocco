import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ city: string }> }
) {
  try {
    const { city } = await params;
    
    
    return NextResponse.json({ 
      places: [],
      city: city,
      count: 0 
    });
  } catch (error) {
    console.error("Error fetching places:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
