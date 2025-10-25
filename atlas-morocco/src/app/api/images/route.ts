import { NextRequest, NextResponse } from 'next/server';
import { getCityImages } from '@/lib/images/getCityImages';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const citySlug = searchParams.get('city');
    const limit = parseInt(searchParams.get('limit') || '12');

    if (!citySlug) {
      return NextResponse.json(
        { error: 'City slug is required' },
        { status: 400 }
      );
    }

    if (limit < 1 || limit > 20) {
      return NextResponse.json(
        { error: 'Limit must be between 1 and 20' },
        { status: 400 }
      );
    }

    const images = await getCityImages(citySlug, limit);

    return NextResponse.json({
      city: citySlug,
      count: images.length,
      images,
    });
  } catch (error) {
    console.error('Error fetching city images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch city images' },
      { status: 500 }
    );
  }
}