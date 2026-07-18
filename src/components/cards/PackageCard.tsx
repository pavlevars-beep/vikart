import { Link } from 'react-router-dom';
import { Heart, Users, Moon } from 'lucide-react';
import type { Package } from '@/types';
import Image from '@/components/ui/Image';
import DemoTag from '@/components/ui/DemoTag';
import { useFavorites } from '@/hooks/useFavorites';
import { packageToPlan } from '@/utils/packageToPlan';
import { writeStorage, storageKeys } from '@/utils/storage';

interface PackageCardProps {
  pkg: Package;
}

export default function PackageCard({ pkg }: PackageCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(pkg.id);

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl2 border border-ink/8 bg-warm-white shadow-card transition-shadow hover:shadow-card-hover">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          image={pkg.image}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <button
          type="button"
          onClick={() => toggleFavorite(pkg.id)}
          aria-pressed={favorite}
          aria-label={favorite ? `Ukloni ${pkg.name} iz omiljenih` : `Sačuvaj ${pkg.name} u omiljene`}
          className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-warm-white/90 text-ink shadow-card transition-colors hover:text-terracotta"
        >
          <Heart size={20} fill={favorite ? '#B96F51' : 'none'} stroke={favorite ? '#B96F51' : 'currentColor'} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-serif text-xl text-ink">{pkg.name}</h3>
        <p className="mt-1.5 text-sm text-ink-soft">{pkg.shortDescription}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {pkg.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full bg-sage px-2.5 py-1 text-xs font-medium text-forest">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-4 text-sm text-ink-soft">
          <span className="inline-flex items-center gap-1.5">
            <Users size={16} aria-hidden="true" /> {pkg.participantsLabel}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Moon size={16} aria-hidden="true" /> {pkg.nights} {pkg.nights === 1 ? 'noćenje' : 'noćenja'}
          </span>
        </div>

        <div className="mt-4 flex items-end justify-between gap-3">
          <p className="font-serif text-lg text-forest">{pkg.priceFromLabel}</p>
        </div>

        <Link
          to={`/paketi/${pkg.slug}`}
          onClick={() => writeStorage(storageKeys.lastPlans, [packageToPlan(pkg)])}
          className="mt-4 flex min-h-[44px] w-full items-center justify-center rounded-full bg-forest px-4 text-sm font-semibold text-warm-white transition-colors hover:bg-forest/90"
        >
          Pogledaj plan
        </Link>
        <DemoTag className="mt-3" />
      </div>
    </article>
  );
}
