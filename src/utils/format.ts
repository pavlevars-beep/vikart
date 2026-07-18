const priceFormatter = new Intl.NumberFormat('sr-RS', {
  maximumFractionDigits: 0,
});

export function formatPrice(value: number): string {
  return `${priceFormatter.format(value)} RSD`;
}

const dateFormatter = new Intl.DateTimeFormat('sr-RS', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export function formatDate(value: string | Date): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return '';
  return dateFormatter.format(date);
}

export function pluralizeNights(nights: number): string {
  if (nights === 1) return 'noćenje';
  if (nights <= 4) return 'noćenja';
  return 'noćenja';
}

export function pluralizePeople(count: number): string {
  if (count === 1) return 'osoba';
  if (count >= 2 && count <= 4) return 'osobe';
  return 'osoba';
}
