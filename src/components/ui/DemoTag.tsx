import { Info } from 'lucide-react';

export default function DemoTag({ className = '' }: { className?: string }) {
  return (
    <p className={`inline-flex items-center gap-1.5 text-xs text-ink-soft ${className}`}>
      <Info size={13} aria-hidden="true" />
      Demonstraciona ponuda · dostupnost se potvrđuje
    </p>
  );
}
