import { Wallet } from 'lucide-react';
import { getSettings } from '@/services/settingsStore';
import { formatPrice } from '@/utils/format';

export default function PaymentPolicyNotice({ totalPrice, className = '' }: { totalPrice: number; className?: string }) {
  const settings = getSettings();
  const depositAmount = Math.round((totalPrice * settings.depositPercent) / 100);
  const remainingAmount = totalPrice - depositAmount;

  return (
    <div className={`rounded-xl2 border border-ink/8 bg-cream p-4 ${className}`}>
      <p className="inline-flex items-center gap-1.5 font-semibold text-ink">
        <Wallet size={16} className="text-forest" aria-hidden="true" /> Način plaćanja
      </p>
      <div className="mt-2 flex justify-between text-sm text-ink">
        <span>Avans ({settings.depositPercent}%) — plaća se za potvrdu rezervacije</span>
        <span className="font-semibold">{formatPrice(depositAmount)}</span>
      </div>
      <div className="flex justify-between text-sm text-ink-soft">
        <span>Preostalo — {settings.remainingDueLabel}</span>
        <span>{formatPrice(remainingAmount)}</span>
      </div>
      <p className="mt-2 text-xs text-ink-soft">{settings.cancellationFreeUntilLabel}</p>
      <p className="mt-1 text-xs text-ink-soft">{settings.cancellationLatePolicyText}</p>
    </div>
  );
}
