import type { PricingModel } from '@/types';
import { calculatePrice } from '@/utils/pricing';
import { formatPrice } from '@/utils/format';

/** Prikaz razumljivog breakdown-a cene za gosta — nikad interna nabavna cena/marža. */
export default function PriceBreakdownCard({ pricingModel, groupSize }: { pricingModel: PricingModel; groupSize: number }) {
  const breakdown = calculatePrice(pricingModel, { groupSize });

  if (breakdown.onRequest) {
    return <p className="text-sm text-ink-soft">Cena na upit — dobijate je nakon provere dostupnosti.</p>;
  }

  return (
    <div className="rounded-lg bg-cream p-3 text-sm">
      <div className="flex justify-between text-ink-soft">
        <span>
          Osnovna cena{breakdown.perPersonAmount !== undefined ? ` (${formatPrice(breakdown.perPersonAmount)} × ${groupSize})` : ''}
        </span>
        <span>{formatPrice(breakdown.baseAmount)}</span>
      </div>
      {breakdown.lines.map((line, i) => (
        <div key={i} className="flex justify-between text-ink-soft">
          <span>{line.label}</span>
          <span>{line.amount === 0 ? '' : `${line.amount > 0 ? '+' : ''}${formatPrice(line.amount)}`}</span>
        </div>
      ))}
      <div className="mt-1.5 flex justify-between border-t border-ink/10 pt-1.5 font-semibold text-ink">
        <span>Ukupno</span>
        <span>{formatPrice(breakdown.totalAmount)}</span>
      </div>
      <div className="mt-1.5 flex justify-between text-xs text-ink-soft">
        <span>Avans ({breakdown.depositPercent}%)</span>
        <span>{formatPrice(breakdown.depositAmount)}</span>
      </div>
      <div className="flex justify-between text-xs text-ink-soft">
        <span>Preostalo</span>
        <span>{formatPrice(breakdown.remainingAmount)}</span>
      </div>
    </div>
  );
}
