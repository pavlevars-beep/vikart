import type { ImageRef } from '@/types';

/**
 * Sve fotografije su realne, legalno dostupne fotografije Zlatibora i srodnih
 * tema (Wikimedia Commons — javno dobro / CC0 / CC BY / CC BY-SA). Puni
 * spisak autora i licenci nalazi se u Footer komponenti (`components/layout/PhotoCredits.tsx`).
 */
export const images = {
  zlatiborHero: {
    src: '/images/zlatibor-hero.jpg',
    alt: 'Zeleni brežuljci i borove šume na Zlatiboru pod vedrim nebom',
  },
  zlatiborView: {
    src: '/images/zlatibor-view.jpg',
    alt: 'Pogled na talasaste zelene padine Zlatibora sa vrha Čigote',
  },
  tornikGondola: {
    src: '/images/tornik-gondola.jpg',
    alt: 'Gondola na Torniku okružena letnjom šumom',
  },
  forestTrail: {
    src: '/images/zlatibor-forest-trail.jpg',
    alt: 'Jesenja šumska staza za šetnju i fotografisanje na Zlatiboru',
  },
  stopicaCaveEntrance: {
    src: '/images/stopica-cave-entrance.jpg',
    alt: 'Prirodni ulaz u Stopića pećinu okružen zelenilom',
  },
  stopicaCaveInside: {
    src: '/images/stopica-cave-inside.jpg',
    alt: 'Unutrašnjost Stopića pećine sa drvenom stazom i sigama',
  },
  gostiljeWaterfall: {
    src: '/images/gostilje-waterfall.jpg',
    alt: 'Kaskade Gostiljskog vodopada u zelenom šumovitom kanjonu',
  },
  gostiljeWaterfall2: {
    src: '/images/gostilje-waterfall-2.jpg',
    alt: 'Gostiljski vodopad okružen bujnom vegetacijom',
  },
  sirogojnoVillage: {
    src: '/images/sirogojno-village.jpg',
    alt: 'Tradicionalne brvnare u etno selu Sirogojno',
  },
  ribnickoJezero: {
    src: '/images/ribnicko-jezero.jpg',
    alt: 'Ribničko jezero okruženo borovom šumom',
  },
  cabinLivingRoom: {
    src: '/images/cabin-living-room.jpg',
    alt: 'Udoban enterijer planinske kuće sa kaminom i pogledom na zelenilo',
  },
  massageTreatment: {
    src: '/images/massage-treatment.jpg',
    alt: 'Opuštajuća masaža uz sveće i prirodne mirise',
  },
  spaRoom: {
    src: '/images/spa-room.jpg',
    alt: 'Prostorija za spa tretmane u toplim, prigušenim tonovima',
  },
  candlelitDinner: {
    src: '/images/candlelit-dinner.jpg',
    alt: 'Sto postavljen za romantičnu večeru uz sveće i čaše vina',
  },
  candlelitDinner2: {
    src: '/images/candlelit-dinner-2.jpg',
    alt: 'Intimno postavljeni sto za večeru u toploj atmosferi restorana',
  },
  quadBike: {
    src: '/images/quad-bike.jpg',
    alt: 'Kvad vozilo pripremljeno za off-road avanturu',
  },
  ebikeTrail: {
    src: '/images/ebike-trail.jpg',
    alt: 'E-bike na šumskoj stazi okruženoj zelenilom',
  },
  horsebackRiding: {
    src: '/images/horseback-riding.jpg',
    alt: 'Jahač na konju na šumskoj stazi',
  },
  shootingRange: {
    src: '/images/shooting-range.jpg',
    alt: 'Gost na streljani sa zaštitnom opremom, jesenja priroda u pozadini',
  },
  bonfireFriends: {
    src: '/images/bonfire-friends.jpg',
    alt: 'Društvo okupljeno oko vatre u večernjim satima',
  },
  grilledSteak: {
    src: '/images/grilled-steak.jpg',
    alt: 'Roštilj i lokalna gastronomska ponuda na drvenoj dasci',
  },
  karadjordjeSteak: {
    src: '/images/karadjordje-steak.jpg',
    alt: 'Tradicionalno srpsko jelo servirano uz povrće i pivo',
  },
  traditionalTable: {
    src: '/images/traditional-table.jpg',
    alt: 'Tradicionalni nizak sto sa domaćim specijalitetima za degustaciju',
  },
  flowerBouquet: {
    src: '/images/flower-bouquet.jpg',
    alt: 'Buket cveća pripremljen za dekoraciju sobe',
  },
} as const satisfies Record<string, ImageRef>;

export type ImageKey = keyof typeof images;
