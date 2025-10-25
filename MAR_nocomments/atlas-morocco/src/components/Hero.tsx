import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  // A curated Unsplash Morocco shot; replace with your own later if desired
  const hero =
    "https://images.unsplash.com/photo-1544989164-31dc3c645987?q=80&w=1920&auto=format&fit=crop";

  return (
    <section className="relative">
      {/* full-bleed image */}
      <div className="relative h-[46vh] md:h-[60vh] w-full overflow-hidden">
        <Image
          src={hero}
          alt="Morocco desert and cityscape"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* subtle top fade for pro look */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-transparent" />
      </div>

      {/* headline block */}
      <div className="container-pro">
        <div className="-mt-16 md:-mt-20">
          <div className="card p-6 md:p-8">
            <div className="max-w-2xl">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-ink">
                Plan smarter trips in Morocco
              </h1>
              <p className="mt-3 text-ink/70">
                A modern travel companion for explorers: curated highlights, live weather & FX,
                beautiful maps, and a lightweight planner — all on a clean, professional interface.
              </p>
            </div>

            {/* calls to action */}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/cities" className="btn-primary">
                Explore Cities
              </Link>
              <Link href="/plan" className="btn-ghost">
                Build a Trip
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}