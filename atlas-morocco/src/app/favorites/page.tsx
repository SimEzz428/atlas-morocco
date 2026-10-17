import type { Metadata } from 'next';
import { FavoritesList } from '@/components/FavoritesManager';
import { Section } from '@/components/ui/Section';
import { Heart } from 'lucide-react';

export const metadata: Metadata = { title: 'My Favorites' };

export default function FavoritesPage() {
  return (
    <Section size="lg">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="h-8 w-8 text-red-500" />
        </div>
        <h1 className="h1 mb-2">My Favorites</h1>
        <p className="text-stone-600 max-w-2xl mx-auto">
          The Moroccan cities you&apos;ve saved. Revisit them and plan your next adventure.
        </p>
      </div>

      <FavoritesList />
    </Section>
  );
}
