import Link from "next/link";
import { Compass, Home } from "lucide-react";
import { LogoMark } from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="pattern-zellige flex min-h-[70vh] items-center bg-sand-100">
      <div className="container-pro py-20 text-center">
        <LogoMark className="mx-auto h-14 w-14 rounded-2xl" />
        <p className="eyebrow mt-6 justify-center">Error 404</p>
        <h1 className="h1 mt-2">Page not found</h1>
        <p className="lead mx-auto mt-4 max-w-xl">
          This path leads off the map. The page may have moved, or the link may be mistyped.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn-primary">
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
          <Link href="/cities" className="btn-secondary">
            <Compass className="h-4 w-4" />
            Browse Cities
          </Link>
        </div>
      </div>
    </div>
  );
}
