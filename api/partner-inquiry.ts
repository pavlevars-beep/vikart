import { sendTelegramMessage, escapeHtml, jsonResponse } from './_telegram';

export const config = { runtime: 'edge' };

interface PartnerInquiryPayload {
  categories?: string[];
  businessName?: string;
  contactName?: string;
  phone?: string;
  email?: string;
  link?: string;
  note?: string;
  consent?: boolean;
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

  if (!body.businessName || !body.contactName || !body.phone) {
    return jsonResponse({ error: 'Nedostaju obavezna polja (naziv, kontakt osoba, telefon).' }, 400);
  }

  const lines = [
    '🤝 <b>Novo interesovanje partnera</b>',
    body.categories?.length ? `Kategorija: ${escapeHtml(body.categories.join(', '))}` : null,
    `Naziv: ${escapeHtml(body.businessName)}`,
    `Kontakt osoba: ${escapeHtml(body.contactName)}`,
    `Telefon: ${escapeHtml(body.phone)}`,
    body.email ? `Email: ${escapeHtml(body.email)}` : null,
    body.link ? `Link: ${escapeHtml(body.link)}` : null,
    body.note ? `Napomena: ${escapeHtml(body.note)}` : null,
    '',
    'Kratka prijava — detalji se prikupljaju tokom razgovora, pregledaj u admin panelu (/admin/upiti-partnera).',
  ].filter((line): line is string => line !== null);

  try {
    await sendTelegramMessage(lines.join('\n'));
  } catch (err) {
    return jsonResponse({ error: (err as Error).message }, 502);
  }

  return jsonResponse({ ok: true });
}
