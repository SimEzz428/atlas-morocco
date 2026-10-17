import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { CITIES } from '@/data/cities';

const EXPLORE = [
  { href: '/cities', label: 'All cities' },
  { href: '/explore', label: 'Map' },
  { href: '/plan', label: 'Trip planner' },
  { href: '/favorites', label: 'Favorites' },
];

export default function Footer() {
  return (
    <footer className="mt-auto bg-stone-900 text-stone-300">
      <div className="container-pro py-12 sm:py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo tone="light" tagline />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-stone-400">
              City guides, a day-by-day trip planner and live local info for ten of Morocco&apos;s most loved destinations.
            </p>
          </div>

          <nav aria-label="Explore">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">Explore</h2>
            <ul className="space-y-2 text-sm">
              {EXPLORE.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white">{label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Cities">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">Cities</h2>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              {CITIES.map((city) => (
                <li key={city.slug}>
                  <Link href={`/cities/${city.slug}`} className="hover:text-white">{city.name}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="mt-10 border-t border-stone-800 pt-6 text-xs text-stone-500">
          Photos from <a href="https://unsplash.com/?utm_source=atlas_morocco&utm_medium=referral" className="underline hover:text-stone-300" target="_blank" rel="noopener noreferrer">Unsplash</a>.
          {' '}Map data &copy; <a href="https://www.openstreetmap.org/copyright" className="underline hover:text-stone-300" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors.
          {' '}Weather by <a href="https://open-meteo.com/" className="underline hover:text-stone-300" target="_blank" rel="noopener noreferrer">Open-Meteo</a>.
        </p>
      </div>
    </footer>
  );
}
