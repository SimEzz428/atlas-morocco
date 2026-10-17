import Image from "next/image";
import type { ReactNode } from "react";
import { Bookmark, Heart, Share2 } from "lucide-react";
import { getCityCover, unsplashImage } from "@/data/cityImages";

const BENEFITS = [
  { icon: Bookmark, text: "Save trip plans to your account" },
  { icon: Share2, text: "Open them on any device" },
  { icon: Heart, text: "Keep your favorite cities in one place" },
];

// Split layout for sign-in and sign-up: a photo panel with account benefits beside the form (form only on phones).
export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  const cover = getCityCover("chefchaouen");

  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-stone-900 lg:block">
        {cover && <Image src={unsplashImage(cover, 1400, 1600)} alt="" fill sizes="50vw" className="object-cover opacity-80" />}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-12">
          <p className="font-display text-3xl font-bold leading-tight text-white text-balance">
            Your Morocco trip, planned day by day and saved wherever you go.
          </p>
          <ul className="mt-6 space-y-3">
            {BENEFITS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-white/90">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
                  <Icon className="h-4 w-4" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <h1 className="h2">{title}</h1>
          <p className="mt-2 text-stone-600">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
