import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Calendar, Users, Share2, ArrowLeft, Navigation, Clock } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { decodeTrip } from '@/features/planner/utils/share';
import { getCity } from '@/data/cities';

interface SharedTripPageProps {
  params: Promise<{ tripData: string }>;
}

const CATEGORY_EMOJI: Record<string, string> = {
  mosque: '🕌', market: '🛍️', souk: '🛍️', palace: '🏰', garden: '🌿', museum: '🏛️', restaurant: '🍽️', cafe: '☕',
  viewpoint: '👁️', view: '👁️', beach: '🏖️', medina: '🏘️', food: '🍴', architecture: '🏛️', culture: '⭐', nature: '🌿',
  shopping: '🛒', daytrip: '🧭', historical: '🏺',
};

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
      <Section size="lg">
        <Card className="max-w-xl mx-auto">
          <div className="card-pad text-center py-12">
            <h1 className="h1 mb-4">Invalid Trip Link</h1>
            <p className="text-slate-600 mb-6">This trip link appears to be invalid or incomplete. Ask the sender to copy it again.</p>
            <Link href="/" className="btn-primary">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </Card>
      </Section>
    );
  }

  const days = Array.from({ length: trip.duration }, (_, i) => trip.items.filter((item) => item.day === i + 1));
  const cityNames = [...new Set(trip.items.map((item) => getCity(item.city)?.name ?? item.city).filter(Boolean))];

  return (
    <Section size="lg">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Share2 className="h-8 w-8 text-amber-600" />
        </div>
        <h1 className="h1 mb-2">{trip.title}</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          A {trip.duration}-day Morocco trip shared by a fellow traveler{cityNames.length > 0 && ` · ${cityNames.join(', ')}`}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-sm text-slate-500">
          <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{trip.duration} days</span>
          <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{trip.items.length} places</span>
          {trip.stats && (
            <>
              <span className="flex items-center gap-1"><Navigation className="h-4 w-4" />{trip.stats.totalDistance}</span>
              <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{trip.stats.totalTime} travel</span>
            </>
          )}
          <span className="flex items-center gap-1"><Users className="h-4 w-4" />Shared trip</span>
        </div>
      </div>

      <div className="space-y-4 max-w-3xl mx-auto">
        {days.map((items, i) => (
          <Card key={i} data-testid="shared-day">
            <div className="card-pad">
              <h2 className="text-lg font-semibold text-slate-900 mb-3">Day {i + 1}</h2>
              {items.length === 0 ? (
                <p className="text-slate-500 text-sm">Free day</p>
              ) : (
                <div className="space-y-2">
                  {items.map((item, j) => (
                    <div key={`${item.name}-${j}`} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                        {CATEGORY_EMOJI[item.category.toLowerCase()] ?? '📍'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 truncate">{item.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Badge variant="accent" size="sm" className="capitalize">{item.category === 'daytrip' ? 'Day trip' : item.category}</Badge>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {getCity(item.city)?.name ?? item.city}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Card className="max-w-3xl mx-auto mt-8">
        <div className="card-pad text-center">
          <h2 className="h3 mb-4">Inspired by this trip?</h2>
          <p className="text-slate-600 mb-6">Create your own Morocco adventure with the Atlas Morocco trip planner.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/plan" className="btn-primary">
              <Calendar className="h-4 w-4" />
              Plan Your Trip
            </Link>
            <Link href="/cities" className="btn-secondary">
              <MapPin className="h-4 w-4" />
              Explore Cities
            </Link>
          </div>
        </div>
      </Card>
    </Section>
  );
}
