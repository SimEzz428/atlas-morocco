import Link from "next/link";
import { Compass, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container-pro py-24 text-center">
      <Compass className="h-14 w-14 text-brand-600 mx-auto mb-6" />
      <h1 className="h1 mb-4">Page not found</h1>
      <p className="lead mb-8 max-w-xl mx-auto">
        This path leads off the map. The page may have moved, or the link may be mistyped.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/" className="btn-primary">
          <Home className="h-4 w-4" />
          Back to Home
        </Link>
        <Link href="/cities" className="btn-secondary">
          Browse Cities
        </Link>
      </div>
    </div>
  );
}
