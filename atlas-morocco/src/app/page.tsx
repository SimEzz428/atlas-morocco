import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin, Navigation, Share2, CalendarDays, CloudSun, ShieldCheck, Coins } from "lucide-react";
import { CITIES, getCity } from "@/data/cities";
import { getCityCover, unsplashImage } from "@/data/cityImages";

const FEATURED_SLUGS = ["marrakech", "fes", "chefchaouen", "essaouira", "casablanca", "rabat"];

const TAGLINES: Record<string, string> = {
  marrakech: "The Red City with vibrant souks",
  fes: "Cultural heart with ancient medina",
  essaouira: "Coastal charm and artistic vibes",
  casablanca: "Modern metropolis meets tradition",
  chefchaouen: "The blue pearl of the Rif",
  rabat: "Elegant capital with royal heritage",
};

const STEPS = [
  {
    icon: MapPin,
    title: "Pick the places you love",
    body: "Browse city guides and tap Add to Plan on the sights, souks and day trips you want to see.",
  },
  {
    icon: Navigation,
    title: "Get a day-by-day route",
    body: "Your stops are split into days and ordered into the shortest route, with visit times and entry fees.",
  },
  {
    icon: Share2,
    title: "Save it and share it",
    body: "Sign in to keep plans in your account, then send a link to anyone you're travelling with.",
  },
];

const placeCount = CITIES.reduce((sum, city) => sum + city.places.length, 0);

export default function HomePage() {
  const featured = FEATURED_SLUGS.flatMap((slug) => {
    const city = getCity(slug);
    const cover = getCityCover(slug);
    if (!city || !cover) return [];
    return [{ name: city.name, slug, tagline: TAGLINES[slug] ?? city.description, placeCount: city.places.length, cover }];
  });

  return (
    <div>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-stone-900">
        <Image
          src="https://images.unsplash.com/photo-1531230689007-0b32d7a7c33e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2670"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover opacity-60"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-stone-950/90 via-stone-950/60 to-stone-950/20" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-stone-950/70 to-transparent" />

        <div className="container-pro flex min-h-[78vh] flex-col justify-center py-20 sm:py-24">
          <div className="max-w-2xl">
            <p className="eyebrow text-brand-300">
              <span className="h-px w-8 bg-brand-300" />
              {CITIES.length} cities · {placeCount} places
            </p>
            <h1 className="h1 mt-5 text-4xl text-white text-balance sm:text-5xl lg:text-6xl">
              Discover Morocco&apos;s hidden gems
            </h1>
            <p className="lead mt-5 max-w-xl text-stone-200 sm:text-xl">
              From the souks of Marrakech to the blue lanes of Chefchaouen, pick the places you love and get a
              day-by-day plan for your trip.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/cities" className="btn-light btn-lg group">
                Explore cities
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link href="/plan" className="btn-glass btn-lg">
                <CalendarDays className="h-4 w-4" />
                Start planning
              </Link>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-sm text-stone-300">Popular:</span>
            {["marrakech", "fes", "chefchaouen", "essaouira"].map((slug) => (
              <Link
                key={slug}
                href={`/cities/${slug}`}
                className="rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                {getCity(slug)?.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="section">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Where to go</p>
            <h2 className="h2 mt-2">Featured destinations</h2>
          </div>
          <Link href="/cities" className="btn-ghost hidden sm:inline-flex">
            All {CITIES.length} cities
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Swipeable row on phones, mosaic grid from md up */}
        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 scrollbar-none md:mx-0 md:grid md:grid-cols-3 md:grid-rows-2 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4">
          {featured.map((city, index) => {
            const isLead = index === 0;
            return (
              <Link
                key={city.slug}
                href={`/cities/${city.slug}`}
                aria-label={`Explore ${city.name}`}
                className={`group relative block w-[78%] flex-none snap-start overflow-hidden rounded-2xl bg-stone-200 md:w-auto ${
                  isLead ? "aspect-[4/5] md:row-span-2 md:aspect-auto lg:col-span-2" : "aspect-[4/5] md:aspect-[4/3]"
                } ${index >= 5 ? "md:hidden" : ""}`}
              >
                <Image
                  src={unsplashImage(city.cover, isLead ? 1200 : 700, isLead ? 1100 : 525)}
                  alt={`${city.name}, Morocco`}
                  fill
                  sizes={isLead ? "(min-width:1024px) 50vw, (min-width:768px) 33vw, 78vw" : "(min-width:1024px) 25vw, (min-width:768px) 33vw, 78vw"}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-xs font-medium text-white/80">{city.placeCount} places</p>
                  <h3 className={`font-display font-bold text-white ${isLead ? "text-3xl" : "text-xl"}`}>{city.name}</h3>
                  <p className="mt-1 text-sm text-white/85">{city.tagline}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-white opacity-90 group-hover:opacity-100">
                    Explore
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <Link href="/cities" className="btn-secondary mt-6 w-full sm:hidden">
          See all {CITIES.length} cities
        </Link>
      </section>

      {/* How it works */}
      <section className="border-y border-stone-200/80 bg-white">
        <div className="section">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">How it works</p>
            <h2 className="h2 mt-2">From wish list to itinerary in minutes</h2>
          </div>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, body }, i) => (
              <li key={title} className="relative rounded-2xl border border-stone-200 bg-sand-50 p-6">
                <span className="absolute right-5 top-4 font-display text-5xl font-bold text-stone-200" aria-hidden="true">
                  {i + 1}
                </span>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="h4 mt-5">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">{body}</p>
              </li>
            ))}
          </ol>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { icon: CloudSun, text: "Live weather and 3-day forecast" },
              { icon: Coins, text: "Today's exchange rate to MAD" },
              { icon: ShieldCheck, text: "Safety and etiquette tips" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-sm text-stone-600">
                <Icon className="h-5 w-5 flex-none text-majorelle-600" />
                {text} in every city guide
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="section">
        <div className="relative overflow-hidden rounded-3xl bg-brand-700 px-6 py-12 text-center sm:px-12 sm:py-16">
          <div className="pattern-zellige absolute inset-0 opacity-60 mix-blend-screen" aria-hidden="true" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="h2 text-white text-balance">Ready to begin your Moroccan adventure?</h2>
            <p className="lead mt-4 text-brand-100">
              Start a plan now. It stays on this device, and you can sign in any time to save it to your account.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/plan" className="btn-light btn-lg">
                <CalendarDays className="h-4 w-4" />
                Start your trip
              </Link>
              <Link href="/explore" className="btn-glass btn-lg">
                <MapPin className="h-4 w-4" />
                See cities on the map
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
