import { Link } from 'react-router-dom';
import {
  MessageCircleHeart,
  ListChecks,
  ShieldCheck,
  Receipt,
  CalendarClock,
  CloudSun,
  MessageSquareHeart,
  PhoneCall,
  Handshake,
} from 'lucide-react';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import Image from '@/components/ui/Image';
import QuickStartCard from '@/components/home/QuickStartCard';
import PackageCard from '@/components/cards/PackageCard';
import FeelingCard from '@/components/cards/FeelingCard';
import ExperienceCard from '@/components/cards/ExperienceCard';
import PicksBanner from '@/components/catalog/PicksBanner';
import { listPackages } from '@/services/packagesStore';
import { feelingCards } from '@/data/feelings';
import { listExperiences } from '@/services/experiencesStore';
import { images } from '@/data/images';

const steps = [
  {
    icon: MessageCircleHeart,
    title: 'Reci nam šta želiš',
    description: 'Povod, ko putuje, termin, budžet i osećaj kakav priželjkujete za taj vikend.',
  },
  {
    icon: ListChecks,
    title: 'Dobijate tri izvodljiva predloga',
    description: 'Pametan izbor, VikArt preporuku i Premium verziju — svaki sa jasnim rasporedom i cenom.',
  },
  {
    icon: ShieldCheck,
    title: 'Mi proveravamo i organizujemo sve',
    description: 'Potvrđujemo dostupnost, usklađujemo dobavljače i javljamo se sa finalnim rasporedom.',
  },
];

const whyVikart = [
  { icon: PhoneCall, text: 'Jedan plan umesto deset poziva' },
  { icon: Receipt, text: 'Pregledna ukupna procena' },
  { icon: CalendarClock, text: 'Vremenski usklađene aktivnosti' },
  { icon: CloudSun, text: 'Plan B za loše vreme' },
  { icon: MessageSquareHeart, text: 'Posebni zahtevi na jednom mestu' },
  { icon: Handshake, text: 'Jedan kontakt za ceo vikend' },
];

const popularExperienceIds = [
  'masaza-za-dvoje',
  'romanticna-vecera',
  'voznja-kvadovima',
  'ebike-tura-tornik',
  'stopica-pecina',
  'gostiljski-vodopad',
  'sirogojno-muzej',
  'druzenje-uz-vatru',
];

export default function Home() {
  useDocumentTitle('Umetnost dobrog vikenda');
  const allExperiences = listExperiences();
  const popularExperiences = popularExperienceIds
    .map((id) => allExperiences.find((exp) => exp.id === id))
    .filter((exp): exp is NonNullable<typeof exp> => Boolean(exp));

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-forest">
        <div className="absolute inset-0">
          <Image image={images.zlatiborHero} className="h-full w-full object-cover opacity-50" eager />
          <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/70 to-forest/30" />
        </div>

        <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-8 px-4 py-16 sm:px-6 lg:flex-row lg:items-end lg:gap-12 lg:px-8 lg:py-24">
          <div className="max-w-xl">
            <span className="inline-flex items-center rounded-full bg-warm-white/10 px-3 py-1 text-xs font-medium text-warm-white/90 ring-1 ring-warm-white/20">
              Pilot destinacija · Zlatibor
            </span>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-gold">
              Platforma koja vam sastavlja ceo vikend na Zlatiboru
            </p>
            <h1 className="mt-2 font-serif text-4xl leading-tight text-warm-white sm:text-5xl">
              Ti izaberi kako želiš da se osećaš. Mi ćemo srediti sve ostalo.
            </h1>
            <p className="mt-4 text-base text-warm-white/85 sm:text-lg">
              Kaži nam ko putuje, kada dolazite i koliki je budžet. VikArt spaja smeštaj i pažljivo odabrana iskustva u
              jedan logičan i izvodljiv plan.
            </p>
            <ol className="mt-6 flex flex-col gap-2.5 border-l-2 border-warm-white/20 pl-4 text-sm text-warm-white/80 sm:flex-row sm:gap-6 sm:border-l-0 sm:border-t-0 sm:pl-0">
              <li className="flex items-center gap-2">
                <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-warm-white/15 text-xs font-semibold text-warm-white">1</span>
                Odgovorite na par pitanja
              </li>
              <li className="flex items-center gap-2">
                <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-warm-white/15 text-xs font-semibold text-warm-white">2</span>
                Dobijete 3 gotova plana
              </li>
              <li className="flex items-center gap-2">
                <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-warm-white/15 text-xs font-semibold text-warm-white">3</span>
                Mi proveravamo i potvrđujemo
              </li>
            </ol>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/konfigurator"
                className="flex min-h-[44px] items-center justify-center rounded-full bg-terracotta px-6 text-sm font-semibold text-warm-white transition-colors hover:bg-terracotta/90"
              >
                Napravi moje iskustvo
              </Link>
              <Link
                to="/paketi"
                className="flex min-h-[44px] items-center justify-center rounded-full bg-warm-white/10 px-6 text-sm font-semibold text-warm-white ring-1 ring-warm-white/30 transition-colors hover:bg-warm-white/20"
              >
                Pogledaj pakete
              </Link>
            </div>
            <p className="mt-4 text-xs text-warm-white/60">Plan spreman za nekoliko minuta — bez obaveze rezervacije.</p>
          </div>

          <div className="w-full lg:max-w-md">
            <QuickStartCard />
          </div>
        </div>
      </section>

      {/* Kako funkcioniše */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="font-serif text-3xl text-ink">Kako funkcioniše</h2>
        <p className="mt-3 max-w-2xl text-ink-soft">
          VikArt je vaš lični organizator vikenda na Zlatiboru. Umesto da sami tražite smeštaj, restoran, masažu i
          aktivnosti i zovete svakog posebno, kažete nam ko putuje i šta vam znači dobar vikend — mi sastavljamo gotov
          plan sa jasnom cenom i rasporedom.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className="rounded-xl2 border border-ink/8 bg-warm-white p-6 shadow-card">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sage text-forest">
                <step.icon size={22} aria-hidden="true" />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-gold">Korak {index + 1}</p>
              <h3 className="mt-1 font-serif text-xl text-ink">{step.title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Istaknuti paketi */}
      <section className="bg-sage/60 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-serif text-3xl text-ink">Istaknuti paketi</h2>
            <Link to="/paketi" className="hidden text-sm font-semibold text-forest hover:underline sm:block">
              Svi paketi →
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {listPackages().map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </div>
      </section>

      {/* Izaberi kako želiš da se osećaš */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="font-serif text-3xl text-ink">Izaberi kako želiš da se osećaš</h2>
        <p className="mt-2 max-w-2xl text-ink-soft">
          Nema pogrešnog odgovora — samo pravac koji nam pomaže da sastavimo pravi plan.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {feelingCards.map((feeling) => (
            <FeelingCard key={feeling.key} feeling={feeling} />
          ))}
        </div>
      </section>

      {/* Popularna iskustva */}
      <section className="bg-cream py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-serif text-3xl text-ink">Popularna iskustva na Zlatiboru</h2>
            <Link to="/iskustva" className="hidden text-sm font-semibold text-forest hover:underline sm:block">
              Ceo katalog →
            </Link>
          </div>
          <div className="mt-8 flex snap-x gap-4 overflow-x-auto pb-4 no-scrollbar lg:grid lg:grid-cols-4 lg:overflow-visible">
            {popularExperiences.map((experience) => (
              <div key={experience.id} className="w-[78%] flex-none snap-start sm:w-[45%] lg:w-auto">
                <ExperienceCard experience={experience} />
              </div>
            ))}
          </div>
          <Link to="/iskustva" className="mt-6 block text-center text-sm font-semibold text-forest hover:underline sm:hidden">
            Ceo katalog →
          </Link>
          <PicksBanner />
        </div>
      </section>

      {/* Zašto VikArt */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="font-serif text-3xl text-ink">Zašto VikArt</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {whyVikart.map((item) => (
            <div key={item.text} className="flex items-start gap-3 rounded-xl2 border border-ink/8 bg-warm-white p-5">
              <item.icon size={22} className="mt-0.5 flex-none text-gold" aria-hidden="true" />
              <p className="text-sm font-medium text-ink">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Za partnere */}
      <section className="bg-forest py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="max-w-xl">
            <h2 className="font-serif text-3xl text-warm-white">Imate smeštaj ili iskustvo za goste?</h2>
            <p className="mt-3 text-warm-white/80">
              Pridružite se pilot fazi na Zlatiboru — bez početne naknade, uz kvalifikovane zahteve i punu kontrolu nad
              cenom i dostupnošću.
            </p>
          </div>
          <Link
            to="/za-partnere"
            className="flex min-h-[44px] flex-none items-center justify-center rounded-full bg-gold px-6 text-sm font-semibold text-ink transition-colors hover:bg-gold/90"
          >
            Postani VikArt partner
          </Link>
        </div>
      </section>

      {/* Završni CTA */}
      <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h2 className="font-serif text-3xl text-ink sm:text-4xl">
          Vaš sledeći vikend ne mora da počne pretragom. Može da počne iskustvom.
        </h2>
        <Link
          to="/konfigurator"
          className="mt-7 inline-flex min-h-[44px] items-center justify-center rounded-full bg-terracotta px-7 text-sm font-semibold text-warm-white transition-colors hover:bg-terracotta/90"
        >
          Napravi moje iskustvo
        </Link>
      </section>
    </div>
  );
}
