import { FavoritesList } from '@/components/FavoritesManager';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Heart, MapPin } from 'lucide-react';

export default function FavoritesPage() {
  return (
    <Container>
      <Section size="lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="h1 mb-2">My Favorites</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Your saved places from across Morocco. Revisit your favorite spots and plan your next adventure.
          </p>
        </div>
        
        <FavoritesList />
      </Section>
    </Container>
  );
}
