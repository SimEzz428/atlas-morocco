import Link from 'next/link';
import { MapPin } from 'lucide-react';

const LINKS = [
  { href: '/cities', label: 'Cities' },
  { href: '/explore', label: 'Map' },
  { href: '/plan', label: 'Trip Planner' },
  { href: '/favorites', label: 'Favorites' },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="container-pro py-12">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-brand rounded-xl flex items-center justify-center">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold">Atlas Morocco</p>
                <p className="text-sm text-slate-400">Plan Unforgettable Journeys</p>
              </div>
            </div>
            <p className="text-slate-300 max-w-md">
              Discover Morocco&apos;s hidden gems with our travel planner.
              Explore cities, plan itineraries, and experience authentic Moroccan culture.
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
            {LINKS.map(({ href, label }) => (
              <Link key={href} href={href} className="text-slate-300 hover:text-white">
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <p className="mt-10 pt-6 border-t border-slate-800 text-xs text-slate-500">
          Photos from <a href="https://unsplash.com/?utm_source=atlas_morocco&utm_medium=referral" className="underline hover:text-slate-300" target="_blank" rel="noopener noreferrer">Unsplash</a>.
          Map data &copy; <a href="https://www.openstreetmap.org/copyright" className="underline hover:text-slate-300" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors.
          Weather by <a href="https://open-meteo.com/" className="underline hover:text-slate-300" target="_blank" rel="noopener noreferrer">Open-Meteo</a>.
        </p>
      </div>
    </footer>
  );
}
