export type StatusTone = 'neutral' | 'info' | 'warning' | 'success' | 'danger';

const TONE_CLASSES: Record<StatusTone, string> = {
  neutral: 'bg-ink/8 text-ink-soft',
  info: 'bg-sage text-forest',
  warning: 'bg-gold/20 text-ink',
  success: 'bg-forest text-warm-white',
  danger: 'bg-terracotta/10 text-terracotta',
};

export default function StatusPill({ label, tone = 'neutral', className = '' }: { label: string; tone?: StatusTone; className?: string }) {
  return (
    <span className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-medium ${TONE_CLASSES[tone]} ${className}`}>
      {label}
    </span>
  );
}
