import type { Metadata } from 'next';
import { FavoritesList } from '@/components/FavoritesManager';
import { PageHeader } from '@/components/ui/PageHeader';

export const metadata: Metadata = { title: 'My Favorites' };

export default function FavoritesPage() {
  return (
    <div className="container-pro py-10 sm:py-14">
      <PageHeader
        eyebrow="Your account"
        title="My Favorites"
        description="The Moroccan cities you've saved. Revisit them and plan your next adventure."
      />
      <div className="mt-8">
        <FavoritesList />
      </div>
    </div>
  );
}
