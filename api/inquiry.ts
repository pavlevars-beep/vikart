import { sendTelegramMessage, escapeHtml, jsonResponse } from './_telegram';

export const config = { runtime: 'edge' };

interface InquiryPayload {
  fullName?: string;
  phone?: string;
  email?: string;
  preferredContact?: string;
  note?: string;
  planTitle?: string;
  totalPrice?: number;
  nights?: number;
  groupSize?: number;
  accommodationName?: string;
  experienceNames?: string[];
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  let body: InquiryPayload;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: 'Neispravan JSON u zahtevu.' }, 400);
  }

  if (!body.fullName || !body.phone || !body.email) {
    return jsonResponse({ error: 'Nedostaju obavezna polja (ime, telefon, email).' }, 400);
  }

  const lines = [
    '🟢 <b>Novi zahtev za proveru plana</b>',
    body.planTitle ? `Plan: ${escapeHtml(body.planTitle)}` : null,
    body.totalPrice ? `Procena: ${new Intl.NumberFormat('sr-RS').format(body.totalPrice)} RSD` : null,
    body.nights ? `Noćenja: ${body.nights}` : null,
    body.groupSize ? `Broj osoba: ${body.groupSize}` : null,
    body.accommodationName ? `Smeštaj: ${escapeHtml(body.accommodationName)}` : null,
    body.experienceNames?.length
      ? `Uključena iskustva:\n${body.experienceNames.map((name) => `• ${escapeHtml(name)}`).join('\n')}`
      : null,
    '',
    `Ime: ${escapeHtml(body.fullName)}`,
    `Telefon: ${escapeHtml(body.phone)}`,
    `Email: ${escapeHtml(body.email)}`,
    body.preferredContact ? `Preferirani kontakt: ${escapeHtml(body.preferredContact)}` : null,
    body.note ? `Napomena: ${escapeHtml(body.note)}` : null,
  ].filter((line): line is string => line !== null);

  try {
    await sendTelegramMessage(lines.join('\n'));
  } catch (err) {
    return jsonResponse({ error: (err as Error).message }, 502);
  }

  return jsonResponse({ ok: true });
}
