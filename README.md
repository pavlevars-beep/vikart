# VikArt — Umetnost dobrog vikenda

Interaktivan preview platforme za personalizovano kreiranje vikend iskustava. Pilot destinacija: Zlatibor.

Ovo je **preview/demo proizvod**: rezervacije, plaćanje i dostupnost dobavljača koriste lokalne, strukturirane mock podatke — nema pravog backend-a niti realnih transakcija. Forme (provera plana, prijava partnera) šalju pravu Telegram notifikaciju kada je deployovano na Vercel (vidi ispod).

## Tehnologije

- Vite + React + TypeScript
- Tailwind CSS
- React Router
- Lucide React (ikonice)
- Framer Motion (suptilne animacije)
- `localStorage` za čuvanje konfiguratora, favorita i demo prijava (lokalna kopija, uz pravu notifikaciju)
- Vercel Edge Functions (`/api/inquiry`, `/api/partner-inquiry`) za slanje Telegram notifikacija

## Pokretanje

```bash
npm install
npm run dev       # razvoj, http://localhost:5173 (forme rade u demo režimu, bez /api)
npm run build     # produkcioni build (tsc + vite build)
npm run lint      # ESLint
npm run preview   # pregled produkcionog build-a
```

Za lokalno testiranje `/api` funkcija je potreban Vercel CLI (`npx vercel dev`) i `.env.local` sa promenljivama iz `.env.example`.

## Deploy na Vercel + Telegram notifikacije

1. **Napravi Telegram bota**: u Telegramu otvori `@BotFather`, pošalji `/newbot`, prati uputstva i sačuvaj token koji dobiješ.
2. **Nađi svoj chat_id**: pošalji botu bilo koju poruku, zatim u browseru otvori
   `https://api.telegram.org/bot<TOKEN>/getUpdates` i pronađi `"chat":{"id": ...}` u odgovoru.
3. **Poveži repo sa Vercel-om**: na [vercel.com](https://vercel.com) → Add New → Project → izaberi ovaj GitHub repo. Vercel automatski prepoznaje Vite (build command `npm run build`, output `dist`).
4. **Dodaj environment varijable** u Vercel → Project → Settings → Environment Variables:
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`
5. Deploy. Svaki poslati formular (provera plana ili prijava partnera) sada stiže kao poruka u tvoj Telegram chat sa botom — to je i notifikacija i istorija zahteva na jednom mestu.
6. **Custom domen**: Vercel → Project → Settings → Domains → dodaj domen i prati DNS uputstva (obično jedan CNAME/A zapis kod tvog registrara domena).

## Struktura

```
api/
  inquiry.ts              # POST — provera plana → Telegram notifikacija
  partner-inquiry.ts       # POST — prijava partnera → Telegram notifikacija
  _telegram.ts            # deljena Telegram helper funkcija (nije ruta)
src/
  types/index.ts         # svi TypeScript tipovi (Experience, Package, GeneratedPlan, ...)
  data/                   # mock sadržaj: experiences, packages, accommodations, images, feelings, partners
  utils/                  # formatiranje, localStorage, generator predloga (planGenerator.ts)
  components/
    brand/                # VikArt logo (SVG)
    layout/                # Header, Footer, Layout, sticky CTA
    cards/                 # PackageCard, ExperienceCard, FeelingCard, PartnerCard
    configurator/          # multi-step konfigurator (koraci + progress bar)
    itinerary/             # vremenska linija plana po danima
    forms/                 # forma za proveru plana
    catalog/                # filteri kataloga iskustava
  pages/                  # rute: Home, Configurator, Results, PlanDetail, Catalog, Packages, HowItWorks, Partners, PartnerForm
```

## Gde se menja sadržaj

- **Paketi** → `src/data/packages.ts`
- **Iskustva** (katalog) → `src/data/experiences.ts`
- **Smeštaj** → `src/data/accommodations.ts`
- **Fotografije** → `src/data/images.ts` (fajlovi u `public/images/`, atribucija u `src/data/photoCredits.ts`)
- **Logika predloga (3 plana)** → `src/utils/planGenerator.ts`

## Šta je mockovano

- Cene, dostupnost smeštaja i iskustava — demonstracione procene, ne garantovane cene.
- Konfigurator i generisanje tri predloga — deterministička logika nad lokalnim podacima, ne pravi AI.
- Partneri prikazani na `/za-partnere` — ilustrativni demo primeri, ne predstavljaju potvrđenu saradnju.
- Forme **stvarno šalju notifikaciju** (Telegram) kada su env varijable podešene — ali nema baze podataka; istorija zahteva postoji samo kao Telegram chat istorija i lokalno u `localStorage` pošiljaoca.

## Sledeći koraci za pravi proizvod

- Baza podataka za zahteve (trenutno nema trajnog, pretraživog skladišta van Telegram chat-a).
- Pravi backend za konfigurator, generisanje predloga i status zahteva.
- Integracija plaćanja i potvrde rezervacije sa dobavljačima.
- Partner portal za samostalno upravljanje ponudom, cenama i dostupnošću.
