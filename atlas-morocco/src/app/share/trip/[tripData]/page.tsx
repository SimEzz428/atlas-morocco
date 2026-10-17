import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, CalendarDays, Navigation, Clock, ArrowLeft, Compass } from 'lucide-react';
import { decodeTrip } from '@/features/planner/utils/share';
import { getCity } from '@/data/cities';
import { getCityCover, unsplashImage } from '@/data/cityImages';

interface SharedTripPageProps {
  params: Promise<{ tripData: string }>;
}

const categoryLabel = (c: string) => (c === 'daytrip' ? 'Day trip' : c.charAt(0).toUpperCase() + c.slice(1));

export async function generateMetadata({ params }: SharedTripPageProps): Promise<Metadata> {
  const trip = decodeTrip((await params).tripData);
  return trip
    ? { title: trip.title, description: `A ${trip.duration}-day Morocco itinerary with ${trip.items.length} places.`, robots: { index: false } }
    : { title: 'Invalid trip link', robots: { index: false } };
}

export default async function SharedTripPage({ params }: SharedTripPageProps) {
  const trip = decodeTrip((await params).tripData);

  if (!trip) {
    return (
      <div className="container-pro py-20">
        <div className="card mx-auto max-w-xl overflow-hidden">
          <div className="pattern-zellige bg-sand-100 px-6 py-14 text-center">
            <h1 className="h2">Invalid Trip Link</h1>
            <p className="mx-auto mt-3 max-w-sm text-stone-600">
              This trip link appears to be invalid or incomplete. Ask the sender to copy it again.
            </p>
            <Link href="/" className="btn-primary mt-6">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const days = Array.from({ length: trip.duration }, (_, i) => trip.items.filter((item) => item.day === i + 1));
  const citySlugs = [...new Set(trip.items.map((item) => item.city).filter(Boolean))];
  const cityNames = citySlugs.map((slug) => getCity(slug)?.name ?? slug);
  const cover = citySlugs[0] ? getCityCover(citySlugs[0]) : undefined;
  // Stop numbers continue across days.
  const dayOffsets = days.map((_, i) => days.slice(0, i).reduce((n, d) => n + d.length, 0));

  return (
    <div>
      <section className="relative isolate overflow-hidden bg-stone-900">
        {cover && <Image src={unsplashImage(cover, 2000, 700)} alt="" fill priority sizes="100vw" className="-z-10 object-cover opacity-70" />}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-stone-950/90 via-stone-950/50 to-stone-950/20" />
        <div className="container-pro py-16 sm:py-20">
          <p className="eyebrow text-brand-200">Shared itinerary</p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-white text-balance sm:text-5xl">{trip.title}</h1>
          <p className="mt-3 text-white/85">
            A {trip.duration}-day Morocco trip shared by a fellow traveler{cityNames.length > 0 && ` · ${cityNames.join(', ')}`}
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-sm text-white">
            {[
              { icon: CalendarDays, text: `${trip.duration} days` },
              { icon: MapPin, text: `${trip.items.length} places` },
              ...(trip.stats
                ? [
                    { icon: Navigation, text: trip.stats.totalDistance },
                    { icon: Clock, text: `${trip.stats.totalTime} travel` },
                  ]
                : []),
            ].map(({ icon: Icon, text }) => (
              <span key={text} className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                <Icon className="h-4 w-4" />
                {text}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="container-pro py-10 sm:py-14">
        <div className="mx-auto max-w-3xl">
          <ol className="space-y-5">
            {days.map((items, i) => (
              <li key={i} className="card overflow-hidden" data-testid="shared-day">
                <div className="flex items-center gap-3 border-b border-stone-100 bg-sand-50 px-5 py-3">
                  <span className="flex h-9 w-9 flex-col items-center justify-center rounded-lg bg-white leading-none ring-1 ring-stone-200">
                    <span className="text-[9px] font-semibold uppercase tracking-wide text-stone-500">Day</span>
                    <span className="font-display text-sm font-bold text-stone-900">{i + 1}</span>
                  </span>
                  <h2 className="font-semibold text-stone-900">
                    {items.length === 0 ? 'Free day' : `${items.length} ${items.length === 1 ? 'place' : 'places'}`}
                  </h2>
                </div>
                {items.length > 0 && (
                  <ul className="divide-y divide-stone-100">
                    {items.map((item, j) => {
                      return (
                        <li key={`${item.name}-${j}`} className="flex items-center gap-3 px-5 py-3">
                          <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                            {dayOffsets[i]! + j + 1}
                          </span>
                          <div className="min-w-0 flex-1">
                            <h3 className="truncate font-semibold text-stone-900">{item.name}</h3>
                            <p className="text-sm text-stone-500">
                              {categoryLabel(item.category)} · {getCity(item.city)?.name ?? item.city}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            ))}
          </ol>

          <div className="relative mt-10 overflow-hidden rounded-3xl bg-brand-700 px-6 py-10 text-center">
            <div className="pattern-zellige absolute inset-0 opacity-60 mix-blend-screen" aria-hidden="true" />
            <div className="relative">
              <h2 className="h3 text-white">Inspired by this trip?</h2>
              <p className="mx-auto mt-2 max-w-md text-brand-100">Build your own Morocco itinerary in minutes with the Atlas Morocco planner.</p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href="/plan" className="btn-light">
                  <CalendarDays className="h-4 w-4" />
                  Plan Your Trip
                </Link>
                <Link href="/cities" className="btn-glass">
                  <Compass className="h-4 w-4" />
                  Explore Cities
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
