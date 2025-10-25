import { MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="container-pro py-12">
        <div className="grid md:grid-cols-1 gap-8">
          {/* Brand (minimal footer) */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-brand rounded-xl flex items-center justify-center">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Atlas Morocco</h3>
                <p className="text-sm text-slate-400">Plan Unforgettable Journeys</p>
              </div>
            </div>
            <p className="text-slate-300 mb-0 max-w-md">
              Discover Morocco's hidden gems with our intelligent travel planner. 
              Explore cities, plan itineraries, and experience authentic Moroccan culture.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
