const CYRILLIC_LATIN_ADJUST: Record<string, string> = {
  č: 'c', ć: 'c', đ: 'dj', š: 's', ž: 'z',
  Č: 'c', Ć: 'c', Đ: 'dj', Š: 's', Ž: 'z',
};

export function slugify(input: string): string {
  const transliterated = input.replace(/[čćđšžČĆĐŠŽ]/g, (ch) => CYRILLIC_LATIN_ADJUST[ch] ?? ch);
  return transliterated
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}
