interface LogoProps {
  variant?: 'full' | 'mark';
  tone?: 'dark' | 'light';
  className?: string;
}

/**
 * tone="dark" = tamni tekst/linije, za svetlu pozadinu (podrazumevano).
 * tone="light" = svetle (kremaste) linije, za tamnu (forest) pozadinu.
 */
const SOURCES = {
  full: {
    dark: '/logo/logo-full-on-light.png',
    light: '/logo/logo-full-on-dark.png',
  },
  mark: {
    dark: '/logo/logo-mark-on-light.png',
    light: '/logo/logo-mark-on-dark.png',
  },
} as const;

export default function Logo({ variant = 'full', tone = 'dark', className = '' }: LogoProps) {
  const src = SOURCES[variant][tone];
  const alt = variant === 'full' ? 'VikArt — Experience more' : 'VikArt';
  const sizeClass = variant === 'full' ? 'h-9' : 'h-7';

  return <img src={src} alt={alt} className={`${sizeClass} w-auto ${className}`} />;
}
