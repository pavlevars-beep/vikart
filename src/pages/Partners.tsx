import { Link } from 'react-router-dom';
import {
  BadgePercent,
  Wallet,
  SlidersHorizontal,
  Eye,
  MessagesSquare,
  TrendingUp,
  ClipboardList,
  ShieldCheck,
} from 'lucide-react';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import PartnerCard from '@/components/cards/PartnerCard';
import { partners } from '@/data/partners';

const demoPartners = partners.slice(0, 3);

const benefits = [
  { icon: BadgePercent, text: 'Nema početne naknade u pilot fazi' },
  { icon: Wallet, text: 'Provizija samo na realizovanu rezervaciju' },
  { icon: SlidersHorizontal, text: 'Partner određuje cenu i raspoloživost' },
  { icon: Eye, text: 'Bolja vidljivost unutar gotovih paketa' },
  { icon: MessagesSquare, text: 'Manje nepotrebne komunikacije' },
  { icon: TrendingUp, text: 'Mogućnost dodatne prodaje' },
  { icon: ClipboardList, text: 'Pregledni zahtevi' },
  { icon: ShieldCheck, text: 'Partner nije predstavljen kao potvrđen dok se saradnja ne odobri' },
];

const process = [
  'Partner prijavljuje ponudu.',
  'VikArt proverava kvalitet i uslove.',
  'Ponuda ulazi u relevantne pakete.',
  'Partner dobija zahtev i potvrđuje termin.',
  'Plaćanje i realizacija se prate prema budućem ugovorenom modelu.',
];

export default function Partners() {
  useDocumentTitle('Za partnere');
  return (
    <div>
      <section className="bg-forest py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl text-warm-white sm:text-5xl">
            Dovedite svoju ponudu do gostiju koji već znaju šta žele.
          </h1>
          <p className="mt-4 text-warm-white/80">
            VikArt povezuje smeštaj i lokalna iskustva u personalizovane, vremenski usklađene planove. Partner dobija
            kvalifikovan zahtev, jasne podatke i dodatnu prodaju bez početne naknade.
          </p>
          <Link
            to="/za-partnere/prijava"
            className="mt-7 inline-flex min-h-[44px] items-center justify-center rounded-full bg-gold px-6 text-sm font-semibold text-ink hover:bg-gold/90"
          >
            Postani VikArt partner
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="font-serif text-3xl text-ink">Zašto sarađivati sa VikArt-om</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <div key={benefit.text} className="rounded-xl2 border border-ink/8 bg-warm-white p-5">
              <benefit.icon size={22} className="text-gold" aria-hidden="true" />
              <p className="mt-3 text-sm font-medium text-ink">{benefit.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-cream py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl text-ink">Kako izgleda proces</h2>
          <ol className="mt-8 space-y-4">
            {process.map((step, index) => (
              <li key={step} className="flex gap-4 rounded-xl2 border border-ink/8 bg-warm-white p-4">
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-forest text-sm font-semibold text-warm-white">
                  {index + 1}
                </span>
                <p className="pt-1 text-ink">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="font-serif text-3xl text-ink">Ovako izgleda kartica partnera unutar platforme</h2>
        <p className="mt-2 max-w-2xl text-ink-soft">
          Demonstracioni primer — ne predstavlja stvarno potvrđenog partnera.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {demoPartners.map((partner) => (
            <PartnerCard key={partner.id} partner={partner} />
          ))}
        </div>
      </section>

      <section className="bg-forest py-16 text-center">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl text-warm-white">Spremni da se prijavite?</h2>
          <Link
            to="/za-partnere/prijava"
            className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-full bg-gold px-6 text-sm font-semibold text-ink hover:bg-gold/90"
          >
            Prijavi ponudu
          </Link>
        </div>
      </section>
    </div>
  );
}
