# VikArt — Umetnost dobrog vikenda

Interaktivan preview platforme za personalizovano kreiranje vikend iskustava. Pilot destinacija: Zlatibor.

Ovo je **preview/demo proizvod**: rezervacije, plaćanje i dostupnost dobavljača koriste lokalne, strukturirane mock podatke — nema pravog backend-a niti realnih transakcija.

## Tehnologije

- Vite + React + TypeScript
- Tailwind CSS
- React Router
- Lucide React (ikonice)
- Framer Motion (suptilne animacije)
- `localStorage` za čuvanje konfiguratora, favorita i demo prijava

## Pokretanje

```bash
npm install
npm run dev       # razvoj, http://localhost:5173
npm run build     # produkcioni build (tsc + vite build)
npm run lint      # ESLint
npm run preview   # pregled produkcionog build-a
```

## Struktura

```
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
- Slanje formi (provera plana, prijava partnera) — simulirano, čuva se u `localStorage`, sa `TODO` komentarom za buduću API integraciju.
- Partneri prikazani na `/za-partnere` — ilustrativni demo primeri, ne predstavljaju potvrđenu saradnju.

## Sledeći koraci za pravi proizvod

- Pravi backend za konfigurator, generisanje predloga i status zahteva.
- Integracija plaćanja i potvrde rezervacije sa dobavljačima.
- Partner portal za samostalno upravljanje ponudom, cenama i dostupnošću.
