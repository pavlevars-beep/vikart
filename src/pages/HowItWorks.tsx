import { Link } from 'react-router-dom';
import { MessageCircleHeart, ListChecks, ShieldCheck, Sparkles } from 'lucide-react';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import Image from '@/components/ui/Image';
import { images } from '@/data/images';

const steps = [
  {
    icon: MessageCircleHeart,
    title: 'Reci nam šta želiš',
    description:
      'Kroz kratak konfigurator prolazite kroz povod, ko putuje, termin, budžet, željeni osećaj i tempo. Traje par minuta, a odgovori ostaju sačuvani ako se vratite kasnije.',
  },
  {
    icon: ListChecks,
    title: 'Dobij tri izvodljiva predloga',
    description:
      'Na osnovu odgovora sastavljamo tri plana — pametan izbor, VikArt preporuku i premium verziju. Svaki ima jasan raspored po danima, cenu i mogućnost izmene pojedinačnih iskustava.',
  },
  {
    icon: ShieldCheck,
    title: 'Mi proveravamo i organizujemo sve',
    description:
      'Kada pošaljete plan na proveru, naš tim potvrđuje dostupnost smeštaja i svakog uključenog iskustva, usklađuje termine i javlja se sa finalnom ponudom.',
  },
];

export default function HowItWorks() {
  useDocumentTitle('Kako funkcioniše');
  return (
    <div>
      <section className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 lg:px-8">
        <h1 className="font-serif text-4xl text-ink">Kako funkcioniše</h1>
        <p className="mt-3 text-ink-soft">
          VikArt spaja smeštaj i lokalna iskustva u jedan plan — bez deset otvorenih tabova i poziva različitim
          dobavljačima.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={step.title} className="flex gap-5 rounded-xl2 border border-ink/8 bg-warm-white p-6 shadow-card">
              <div className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-sage text-forest">
                <step.icon size={24} aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gold">Korak {index + 1}</p>
                <h2 className="mt-1 font-serif text-xl text-ink">{step.title}</h2>
                <p className="mt-2 text-ink-soft">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link to="/konfigurator" className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-forest px-6 text-sm font-semibold text-warm-white">
            Napravi moje iskustvo
          </Link>
        </div>
      </section>

      <section className="bg-sage/50 py-16">
        <div className="mx-auto grid max-w-5xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8 lg:items-center">
          <div className="overflow-hidden rounded-xl2">
            <Image image={images.forestTrail} className="h-full w-full object-cover" />
          </div>
          <div>
            <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gold">
              <Sparkles size={14} aria-hidden="true" /> O imenu
            </p>
            <h2 className="mt-2 font-serif text-3xl text-ink">Odakle dolazi „VikArt"</h2>
            <p className="mt-3 text-ink-soft">
              „Vik" je početak reči vikend — bez „end", jer VikArt je mesto na kom vikend počinje. „Art" je umetnost
              slaganja detalja u celinu koja ima smisla: pravo mesto, pravo iskustvo, u pravom trenutku.
            </p>
            <p className="mt-3 text-ink-soft">
              Umetnost dobrog vikenda. Ovde vikend počinje.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="font-serif text-2xl text-ink">Nekoliko čestih pitanja</h2>
        <div className="mt-6 space-y-4">
          <div>
            <p className="font-semibold text-ink">Da li su cene konačne?</p>
            <p className="mt-1 text-sm text-ink-soft">
              Ne — cene u ovoj verziji su demonstracione procene. Konačna cena se potvrđuje nakon provere dostupnosti
              svih uključenih usluga.
            </p>
          </div>
          <div>
            <p className="font-semibold text-ink">Da li mogu da menjam plan nakon što ga dobijem?</p>
            <p className="mt-1 text-sm text-ink-soft">
              Da — na stranici sa predlozima možete ukloniti, zameniti ili dodati iskustva, a procena cene se odmah
              ažurira.
            </p>
          </div>
          <div>
            <p className="font-semibold text-ink">Šta ako vreme bude loše?</p>
            <p className="mt-1 text-sm text-ink-soft">
              Svaki plan sadrži predlog alternative za slučaj lošeg vremena, vidljiv u detaljnom itinereru.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
