import { Link, useParams } from 'react-router-dom';
import { MapPin, Phone, Mail, Globe, Instagram, Facebook, Clock, ExternalLink } from 'lucide-react';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getPartnerBySlug, partners } from '@/data/partners';
import { experiences } from '@/data/experiences';
import { packages } from '@/data/packages';
import { partnerCategoryLabels } from '@/utils/labels';
import Image from '@/components/ui/Image';
import OfferStatusBadge from '@/components/partners/OfferStatusBadge';
import PartnerGallery from '@/components/partners/PartnerGallery';

export default function PartnerDetail() {
  const { slug } = useParams<{ slug: string }>();
  const partner = slug ? getPartnerBySlug(slug) : undefined;

  useDocumentTitle(partner ? partner.name : 'Partner nije pronađen');

  if (!partner) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
        <h1 className="font-serif text-3xl text-ink">Partner nije pronađen</h1>
        <p className="mt-3 text-ink-soft">Proverite link ili se vratite na spisak svih partnera.</p>
        <Link to="/partneri" className="mt-6 rounded-full bg-forest px-5 py-3 text-sm font-semibold text-warm-white">
          Svi partneri
        </Link>
      </div>
    );
  }

  const realizedExperiences = experiences.filter((exp) => exp.partnerId === partner.id);
  const featuredPackages = packages.filter(
    (pkg) => pkg.accommodationId === partner.id || pkg.experienceIds.some((id) => experiences.find((e) => e.id === id)?.partnerId === partner.id),
  );
  const similarPartners = partners
    .filter((p) => p.id !== partner.id && p.categories.some((c) => partner.categories.includes(c)))
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Link to="/partneri" className="text-sm font-semibold text-forest hover:underline">← Svi partneri</Link>

      <div className="mt-4 overflow-hidden rounded-xl2">
        <div className="relative aspect-[16/9] w-full sm:aspect-[21/9]">
          <Image image={partner.media.mainPhoto} className="h-full w-full object-cover" eager />
          <OfferStatusBadge status={partner.status} className="absolute left-4 top-4" />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-ink sm:text-4xl">{partner.name}</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {partner.categories.map((c) => partnerCategoryLabels[c]).join(' · ')}
          </p>
          <p className="mt-2 max-w-xl text-ink-soft">{partner.oneLiner}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl2 border border-ink/8 bg-warm-white p-5">
          <h2 className="font-serif text-lg text-ink">Osnovni podaci</h2>
          <ul className="mt-3 space-y-2 text-sm text-ink-soft">
            <li className="inline-flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 flex-none" aria-hidden="true" />
              <span>{partner.location.address}</span>
            </li>
            {partner.hoursLabel && (
              <li className="inline-flex items-start gap-2">
                <Clock size={16} className="mt-0.5 flex-none" aria-hidden="true" />
                <span>{partner.hoursLabel}</span>
              </li>
            )}
            {partner.contact.phone && (
              <li className="inline-flex items-start gap-2">
                <Phone size={16} className="mt-0.5 flex-none" aria-hidden="true" />
                <a href={`tel:${partner.contact.phone}`} className="hover:text-forest">{partner.contact.phone}</a>
              </li>
            )}
            {partner.contact.email && (
              <li className="inline-flex items-start gap-2">
                <Mail size={16} className="mt-0.5 flex-none" aria-hidden="true" />
                <a href={`mailto:${partner.contact.email}`} className="hover:text-forest">{partner.contact.email}</a>
              </li>
            )}
            {partner.contact.website && (
              <li className="inline-flex items-start gap-2">
                <Globe size={16} className="mt-0.5 flex-none" aria-hidden="true" />
                <a href={partner.contact.website} target="_blank" rel="noopener noreferrer" className="hover:text-forest">{partner.contact.website}</a>
              </li>
            )}
            {partner.contact.instagram && (
              <li className="inline-flex items-start gap-2">
                <Instagram size={16} className="mt-0.5 flex-none" aria-hidden="true" />
                <span>{partner.contact.instagram}</span>
              </li>
            )}
            {partner.contact.facebook && (
              <li className="inline-flex items-start gap-2">
                <Facebook size={16} className="mt-0.5 flex-none" aria-hidden="true" />
                <span>{partner.contact.facebook}</span>
              </li>
            )}
          </ul>
          {partner.location.mapUrl && (
            <a
              href={partner.location.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-ink/15 px-4 text-sm font-semibold text-ink hover:bg-cream"
            >
              Otvori mapu <ExternalLink size={14} aria-hidden="true" />
            </a>
          )}
        </div>

        <div className="rounded-xl2 border border-ink/8 bg-warm-white p-5">
          <h2 className="font-serif text-lg text-ink">Konkretne činjenice</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {partner.facts.map((fact) => (
              <li key={fact.label} className="flex justify-between gap-3">
                <span className="text-ink-soft">{fact.label}</span>
                <span className="text-right font-medium text-ink">{fact.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="font-serif text-xl text-ink">O partneru</h2>
        {partner.isDemo && (
          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-terracotta">
            Demonstracioni sadržaj — ne predstavlja stvarno ugovorenog partnera
          </p>
        )}
        <p className="mt-2 max-w-3xl text-ink-soft">{partner.story}</p>
      </section>

      {partner.media.gallery.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 font-serif text-xl text-ink">Fotografije</h2>
          <PartnerGallery photos={partner.media.gallery} />
        </section>
      )}

      {realizedExperiences.length > 0 && (
        <section className="mt-10">
          <h2 className="font-serif text-xl text-ink">Iskustva koja realizuje</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {realizedExperiences.map((exp) => (
              <div key={exp.id} className="rounded-xl2 border border-ink/8 bg-warm-white p-4">
                <p className="font-medium text-ink">{exp.name}</p>
                <p className="mt-1 text-sm text-ink-soft">{exp.shortDescription}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {featuredPackages.length > 0 && (
        <section className="mt-10">
          <h2 className="font-serif text-xl text-ink">Paketi u kojima se pojavljuje</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {featuredPackages.map((pkg) => (
              <Link
                key={pkg.id}
                to={`/paketi/${pkg.slug}`}
                className="rounded-xl2 border border-ink/8 bg-warm-white p-4 hover:border-forest"
              >
                <p className="font-medium text-ink">{pkg.name}</p>
                <p className="mt-1 text-sm text-ink-soft">{pkg.shortDescription}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {similarPartners.length > 0 && (
        <section className="mt-10 mb-4">
          <h2 className="font-serif text-xl text-ink">Slični partneri</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {similarPartners.map((p) => (
              <Link
                key={p.id}
                to={`/partneri/${p.slug}`}
                className="overflow-hidden rounded-xl2 border border-ink/8 bg-warm-white hover:border-forest"
              >
                <div className="aspect-[16/10] w-full overflow-hidden">
                  <Image image={p.media.mainPhoto} className="h-full w-full object-cover" />
                </div>
                <div className="p-3">
                  <p className="font-medium text-ink">{p.name}</p>
                  <p className="text-xs text-ink-soft">{p.location.area}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
