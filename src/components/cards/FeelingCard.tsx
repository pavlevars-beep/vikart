import { Link } from 'react-router-dom';
import type { FeelingCardData } from '@/data/feelings';
import Image from '@/components/ui/Image';

export default function FeelingCard({ feeling }: { feeling: FeelingCardData }) {
  return (
    <Link
      to={`/konfigurator?feeling=${feeling.key}`}
      className="group relative flex aspect-[3/4] overflow-hidden rounded-xl2 shadow-card transition-shadow hover:shadow-card-hover"
    >
      <Image image={feeling.image} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
      <div className="relative mt-auto flex flex-col gap-1 p-4 text-warm-white">
        <h3 className="font-serif text-lg">{feeling.label}</h3>
        <p className="text-xs text-warm-white/85">{feeling.description}</p>
      </div>
    </Link>
  );
}
