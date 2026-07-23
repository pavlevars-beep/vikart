import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { listPackages } from '@/services/packagesStore';
import PackageCard from '@/components/cards/PackageCard';

export default function Packages() {
  useDocumentTitle('Paketi');
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <h1 className="font-serif text-3xl text-ink sm:text-4xl">Paketi</h1>
        <p className="mt-2 text-ink-soft">
          Četiri polazna predloga koja pokrivaju najčešće povode. Svaki paket možete otvoriti, prilagoditi i poslati na
          proveru — ili krenuti od nule kroz konfigurator.
        </p>
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {listPackages().map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg} />
        ))}
      </div>
    </div>
  );
}
