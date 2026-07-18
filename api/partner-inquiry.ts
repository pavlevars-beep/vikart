import { sendTelegramMessage, escapeHtml, jsonResponse } from './_telegram';

export const config = { runtime: 'edge' };

interface PartnerInquiryPayload {
  type?: string;
  businessName?: string;
  contactName?: string;
  phone?: string;
  email?: string;
  location?: string;
  website?: string;
  instagram?: string;
  description?: string;
  priceRange?: string;
  capacity?: string;
  seasonality?: string;
  confirmationMethod?: string;
  responseTime?: string;
  photosLink?: string;
  note?: string;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  let body: PartnerInquiryPayload;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: 'Neispravan JSON u zahtevu.' }, 400);
  }

  if (!body.businessName || !body.contactName || !body.phone || !body.email) {
    return jsonResponse({ error: 'Nedostaju obavezna polja (naziv, kontakt osoba, telefon, email).' }, 400);
  }

  const lines = [
    '🤝 <b>Nova prijava partnera</b>',
    body.type ? `Tip: ${escapeHtml(body.type)}` : null,
    `Naziv: ${escapeHtml(body.businessName)}`,
    `Kontakt osoba: ${escapeHtml(body.contactName)}`,
    `Telefon: ${escapeHtml(body.phone)}`,
    `Email: ${escapeHtml(body.email)}`,
    body.location ? `Lokacija: ${escapeHtml(body.location)}` : null,
    body.website ? `Web: ${escapeHtml(body.website)}` : null,
    body.instagram ? `Instagram: ${escapeHtml(body.instagram)}` : null,
    body.priceRange ? `Cene: ${escapeHtml(body.priceRange)}` : null,
    body.capacity ? `Kapacitet: ${escapeHtml(body.capacity)}` : null,
    body.description ? `Opis: ${escapeHtml(body.description)}` : null,
    body.note ? `Napomena: ${escapeHtml(body.note)}` : null,
  ].filter((line): line is string => Boolean(line));

  try {
    await sendTelegramMessage(lines.join('\n'));
  } catch (err) {
    return jsonResponse({ error: (err as Error).message }, 502);
  }

  return jsonResponse({ ok: true });
}
