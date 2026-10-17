import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CityScreen from "@/features/cities/components/CityScreen";
import { CITIES, getCity } from "@/data/cities";
import { getCityCover, unsplashImage } from "@/data/cityImages";

type Params = Promise<{ id: string }>;

export function generateStaticParams() {
  return CITIES.map((city) => ({ id: city.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const city = getCity((await params).id);
  if (!city) return {};
  const cover = getCityCover(city.slug);
  return {
    title: `${city.name} travel guide`,
    description: city.description,
    openGraph: cover ? { images: [{ url: unsplashImage(cover, 1200, 630), width: 1200, height: 630 }] } : undefined,
  };
}

export default async function CityPage({ params }: { params: Params }) {
  const city = getCity((await params).id);
  if (!city) notFound();

  return <CityScreen city={city} />;
}
