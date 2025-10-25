import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MapPin, Clock, DollarSign, Calendar, Users, Share2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface SharedTripPageProps {
  params: Promise<{
    tripData: string;
  }>;
}

export default async function SharedTripPage({ params }: SharedTripPageProps) {
  let tripData;
  
  try {
    // Decode the base64 trip data
    const decodedData = Buffer.from((await params).tripData, 'base64').toString('utf-8');
    tripData = JSON.parse(decodedData);
  } catch (error) {
    return (
      <Container>
        <Section size="lg">
          <Card>
            <div className="card-pad text-center py-12">
              <h1 className="h1 mb-4">Invalid Trip Link</h1>
              <p className="text-slate-600 mb-6">
                This trip link appears to be invalid or corrupted.
              </p>
              <Link href="/" className="btn-primary">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </div>
          </Card>
        </Section>
      </Container>
    );
  }

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'mosque': '🕌',
      'market': '🛍️',
      'palace': '🏰',
      'garden': '🌿',
      'museum': '🏛️',
      'restaurant': '🍽️',
      'cafe': '☕',
      'viewpoint': '👁️',
      'beach': '🏖️',
      'mountain': '⛰️',
      'desert': '🏜️',
      'medina': '🏘️',
      'food': '🍴',
      'architecture': '🏛️',
      'culture': '⭐',
      'nature': '🌿',
      'shopping': '🛒',
      'view': '👁️',
      'daytrip': '🧭',
    };
    return icons[category.toLowerCase()] || '📍';
  };

  return (
    <Container>
      <Section size="lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Share2 className="h-8 w-8 text-amber-600" />
          </div>
          <h1 className="h1 mb-2">{tripData.title}</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            A {tripData.duration}-day Morocco trip shared by a fellow traveler
          </p>
          <div className="flex items-center justify-center gap-4 mt-4 text-sm text-slate-500">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {tripData.duration} days
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {tripData.items.length} places
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              Shared trip
            </div>
          </div>
        </div>

        {/* Trip Stats */}
        <Card className="mb-8">
          <div className="card-pad">
            <h3 className="h3 mb-4">Trip Overview</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-amber-600">{tripData.items.length}</div>
                <div className="text-sm text-slate-600">Places to Visit</div>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-amber-600">{tripData.duration}</div>
                <div className="text-sm text-slate-600">Days</div>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-amber-600">{tripData.stats?.totalDistance || 'N/A'}</div>
                <div className="text-sm text-slate-600">Total Distance</div>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-amber-600">{tripData.stats?.totalTime || 'N/A'}</div>
                <div className="text-sm text-slate-600">Total Time</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Places List */}
        <Card>
          <div className="card-pad">
            <h3 className="h3 mb-6">Places to Visit</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {tripData.items.map((item: any, index: number) => (
                <div key={item.id || index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-lg">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900">{item.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Badge variant="accent" className="text-xs">{item.category}</Badge>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {item.city}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-slate-500">
                    #{index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Call to Action */}
        <div className="text-center mt-8">
          <Card>
            <div className="card-pad">
              <h3 className="h3 mb-4">Inspired by this trip?</h3>
              <p className="text-slate-600 mb-6">
                Create your own Morocco adventure using Atlas Morocco's trip planner
              </p>
              <div className="flex gap-4 justify-center">
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
        </div>
      </Section>
    </Container>
  );
}
