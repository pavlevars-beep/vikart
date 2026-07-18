interface LogoProps {
  variant?: 'full' | 'mark';
  tone?: 'dark' | 'light';
  className?: string;
}

/**
 * VikArt mark: apstraktni planinski greben (V) čija putanja nastavlja
 * i posle vrha — simbol početka kretanja / vikenda koji tek počinje.
 */
function Mark({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const ridgeColor = tone === 'dark' ? '#173D35' : '#F7F3EB';
  return (
    <svg viewBox="0 0 44 44" width="32" height="32" aria-hidden="true" focusable="false">
      <polyline
        points="6,34 22,10 38,34"
        fill="none"
        stroke={ridgeColor}
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="22,10 27.5,2.5"
        fill="none"
        stroke="#C6A15B"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <circle cx="27.5" cy="2.5" r="2.4" fill="#C6A15B" />
    </svg>
  );
}

export default function Logo({ variant = 'full', tone = 'dark', className = '' }: LogoProps) {
  const textColor = tone === 'dark' ? 'text-ink' : 'text-warm-white';

  if (variant === 'mark') {
    return (
      <span className={className} role="img" aria-label="VikArt">
        <Mark tone={tone} />
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-2 ${className}`} role="img" aria-label="VikArt — Umetnost dobrog vikenda">
      <Mark tone={tone} />
      <span className={`font-serif text-2xl leading-none tracking-tight ${textColor}`}>
        Vik<span className="text-gold">Art</span>
      </span>
    </span>
  );
}
