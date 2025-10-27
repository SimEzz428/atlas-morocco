import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin, Calendar, Users, Globe, Compass } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";

const featuredCities = [
  { name: "Marrakech", slug: "marrakech", description: "The Red City with vibrant souks" },
  { name: "Fès", slug: "fes", description: "Cultural heart with ancient medina" },
  { name: "Essaouira", slug: "essaouira", description: "Coastal charm and artistic vibes" },
  { name: "Casablanca", slug: "casablanca", description: "Modern metropolis meets tradition" },
  { name: "Chefchaouen", slug: "chefchaouen", description: "The blue pearl of the Rif" },
  { name: "Rabat", slug: "rabat", description: "Elegant capital with royal heritage" },
];

function getCityImage(slug: string) {
  const imageMap: Record<string, string> = {
    marrakech:  "https://images.unsplash.com/photo-1624805098931-098c0d918b34?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&ixid=M3w4MjA2ODN8MHwxfHNlYXJjaHwxfHxNYXJyYWtlY2glMjBtb3JvY2NvfGVufDF8MHx8fDE3NjE1Mjg2MTV8MA&ixlib=rb-4.1.0&q=80&w=600&h=400",
    fes:        "https://images.unsplash.com/photo-1528657305805-d8d56cee1785?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&ixid=M3w4MjA2ODN8MHwxfHNlYXJjaHwxfHxGJUMzJUE4cyUyMG1vcm9jY298ZW58MXwwfHx8MTc2MTQ5Mzc0MHww&ixlib=rb-4.1.0&q=80&w=600&h=400",
    essaouira:  "https://images.unsplash.com/photo-1668335554961-4f9c1ec5cec9?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&ixid=M3w4MjA2ODN8MHwxfHNlYXJjaHwxfHxFc3Nhb3VpcmElMjBtb3JvY2NvfGVufDF8MHx8fDE3NjE0OTM3NDB8MA&ixlib=rb-4.1.0&q=80&w=600&h=400",
    casablanca: "https://images.unsplash.com/photo-1538230575309-59dfc388ae36?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&ixid=M3w4MjA2ODN8MHwxfHNlYXJjaHwxfHxDYXNhYmxhbmNhJTIwbW9yb2Njb3xlbnwxfDB8fHwxNzYxNTI4NjE1fDA&ixlib=rb-4.1.0&q=80&w=600&h=400",
    chefchaouen:"https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&ixid=M3w4MjA2ODN8MHwxfHNlYXJjaHwxfHxDaGVmY2hhb3VlbiUyMG1vcm9jY298ZW58MXwwfHx8MTc2MTUyODYxNXww&ixlib=rb-4.1.0&q=80&w=600&h=400",
    rabat:      "https://images.unsplash.com/photo-1671471122995-b27ba131195b?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&ixid=M3w4MjA2ODN8MHwxfHNlYXJjaHwxfHxSYWJhdCUyMG1vcm9jY298ZW58MXwwfHx8MTc2MTUyODYxNXww&ixlib=rb-4.1.0&q=80&w=600&h=400",
  };
  return imageMap[slug] || `https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2667`;
}

export default function HomePage() {
  const cityImages = featuredCities.map((city) => ({
    ...city,
    image: getCityImage(city.slug),
  }));

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1531230689007-0b32d7a7c33e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2670"
            alt="Morocco landscape"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        </div>

        <div className="relative z-10 container-pro text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="h1 mb-6 text-white">Discover Morocco&apos;s Hidden Gems</h1>
            <p className="lead mb-8 text-white/90">
              Plan unforgettable journeys through Morocco&apos;s most enchanting cities.
              From the bustling souks of Marrakech to the blue streets of Chefchaouen,
              create memories that last a lifetime.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/explore" className="btn btn-primary group">
                Start Exploring
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/plan" className="btn btn-secondary">
                Plan Your Trip
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cities */}
      <Section>
        <div className="text-center mb-12">
          <h2 className="h2 mb-4">Featured Destinations</h2>
          <p className="lead text-slate-600">
            Explore Morocco&apos;s most captivating cities, each with its own unique charm and story.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cityImages.map((city) => (
            <Card key={city.slug} className="group hover:shadow-xl transition-all duration-300">
              <div className="relative h-48 overflow-hidden rounded-t-lg">
                <Image
                  src={city.image}
                  alt={`${city.name}, Morocco`}
                  fill
                  sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold">{city.name}</h3>
                </div>
              </div>
              <div className="card-pad">
                <p className="text-slate-600 mb-4">{city.description}</p>
                <Link href={`/cities/${city.slug}`} className="btn btn-outline w-full group">
                  Explore {city.name}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* Features */}
      <Section className="bg-slate-50">
        <div className="text-center mb-12">
          <h2 className="h2 mb-4">Why Choose Atlas Morocco?</h2>
          <p className="lead text-slate-600">
            Your trusted companion for discovering the authentic beauty of Morocco.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-brand rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Curated Locations</h3>
            <p className="text-slate-600">Handpicked destinations and hidden gems you won&apos;t find in typical guidebooks.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-brand rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Planning</h3>
            <p className="text-slate-600">AI-powered itinerary suggestions tailored to your interests and travel style.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-brand rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Local Insights</h3>
            <p className="text-slate-600">Authentic recommendations from locals who know Morocco&apos;s best-kept secrets.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-brand rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Globe className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Cultural Immersion</h3>
            <p className="text-slate-600">Experience Morocco&apos;s rich culture, traditions, and warm hospitality.</p>
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section>
        <div className="text-center">
          <h2 className="h2 mb-4">Ready to Begin Your Moroccan Adventure?</h2>
          <p className="lead text-slate-600 mb-8">
            Join thousands of travelers who have discovered the magic of Morocco with Atlas Morocco.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/explore" className="btn btn-primary group">
              <Compass className="mr-2 h-5 w-5" />
              Start Your Journey
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/cities" className="btn btn-outline">
              Browse All Cities
            </Link>
          </div>
        </div>
      </Section>
    </main>
  );
}