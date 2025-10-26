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
  // Use simple Unsplash source URLs for server-side rendering
  const q = `${slug} morocco`;
  return `https://source.unsplash.com/600x400/?${encodeURIComponent(q)}`;
}

export default function HomePage() {
  const cityImages = featuredCities.map((city) => ({
    ...city,
    image: getCityImage(city.slug)
  }));

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1624805098931-098c0d918b34?ixlib=rb-4.1.0&auto=format&fit=crop&w=2560&h=1440&q=90"
            alt="Beautiful Morocco landscape background"
            fill
            className="object-cover"
            priority
            quality={95}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/10 to-black/40"></div>
        </div>
        
        {/* Content */}
        <div className="container-pro relative z-10 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Removed trust badge */}

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="text-white">Plan Unforgettable</span>
              <br />
              <span className="text-amber-300">Morocco Journeys</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover Morocco's hidden gems with our intelligent travel planner. 
              Explore cities, plan itineraries, and experience authentic Moroccan culture.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/plan" className="btn-primary btn-lg group">
                <Calendar className="h-5 w-5" />
                Start Planning Your Trip
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/cities" className="btn-secondary btn-lg group">
                <Compass className="h-5 w-5" />
                Explore Cities
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Removed trust indicators */}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Featured Cities Section */}
      <Section background="muted" size="lg">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1 rounded-full border font-medium px-3 py-1 text-sm bg-amber-50 text-amber-700 border-amber-200 mb-4">Featured Destinations</div>
          <h2 className="h2 mb-4">Discover Morocco's Most Captivating Cities</h2>
          <p className="lead max-w-2xl mx-auto">
            From ancient medinas to modern metropolises, explore Morocco's most enchanting destinations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cityImages.map((city, index) => (
            <Link 
              key={city.slug} 
              href={`/cities/${city.slug}`}
              className="group block"
            >
              <Card className="overflow-hidden hover-lift hover-glow transition-all duration-300">
                {/* City Image */}
                <div className="relative h-64 overflow-hidden">
                  {city.image ? (
                    <Image
                      src={city.image}
                      alt={`${city.name} cityscape`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      quality={90}
                      priority={index < 3}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center">
                      <MapPin className="h-12 w-12 text-amber-600" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  
                  {/* Removed rating badge */}

                  {/* City Name */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white mb-1">{city.name}</h3>
                    <p className="text-white/90 text-sm">{city.description}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="card-pad-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>2-3 days</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>15+ places</span>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-amber-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link href="/cities" className="btn-primary btn-lg group">
            <Globe className="h-5 w-5" />
            Explore All Cities
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </Section>

      {/* Features Section */}
      <Section size="lg">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1 rounded-full border font-medium px-3 py-1 text-sm bg-blue-50 text-blue-700 border-blue-200 mb-4">Why Choose Atlas Morocco</div>
          <h2 className="h2 mb-4">Everything You Need for the Perfect Trip</h2>
          <p className="lead max-w-2xl mx-auto">
            Our intelligent platform combines local expertise with modern technology to create unforgettable experiences.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center hover-lift">
            <div className="card-pad">
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Compass className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="h3 mb-4">Smart Trip Planning</h3>
              <p className="text-slate-600">
                AI-powered itinerary optimization that considers distance, time, and your preferences to create the perfect route.
              </p>
            </div>
          </Card>

          <Card className="text-center hover-lift">
            <div className="card-pad">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="h3 mb-4">Real-time Insights</h3>
              <p className="text-slate-600">
                Live weather updates, currency exchange rates, and local insights to help you make informed decisions on the go.
              </p>
            </div>
          </Card>

          <Card className="text-center hover-lift">
            <div className="card-pad">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MapPin className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="h3 mb-4">Offline-First Experience</h3>
              <p className="text-slate-600">
                Download your itinerary and maps for offline access. Perfect for areas with limited internet connectivity.
              </p>
            </div>
          </Card>
        </div>
      </Section>

      {/* Final CTA */}
      <Section background="gradient" size="lg">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="h2 mb-4 text-slate-900">Ready to Explore Morocco?</h2>
          <p className="lead mb-8 text-slate-700">
            Join thousands of travelers who have discovered Morocco's magic with Atlas Morocco. 
            Start planning your adventure today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/plan" className="btn-primary btn-lg group">
              <Calendar className="h-5 w-5" />
              Start Planning Now
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/cities" className="btn-secondary btn-lg">
              <Compass className="h-5 w-5" />
              Browse Cities
            </Link>
          </div>
        </div>
      </Section>
    </main>
  );
}