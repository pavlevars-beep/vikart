import type { Package } from '@/types';
import { images } from './images';

export const packages: Package[] = [
  {
    id: 'romanticni-mir',
    slug: 'romanticni-mir',
    name: 'Romantični mir',
    priceFromLabel: 'od 59.900 RSD za dvoje',
    priceFromValue: 59900,
    participantsLabel: 'za dvoje',
    participantsCount: 2,
    nights: 2,
    shortDescription:
      'Dve noći mira u kvalitetnom apartmanu, uz masažu, rezervisanu večeru i laganu šetnju — bez ijedne stvari koju treba sami da organizujete.',
    highlights: [
      'Dve noći u kvalitetnom apartmanu ili boutique smeštaju',
      'Cveće i mali welcome paket',
      'Masaža ili wellness za dvoje',
      'Rezervisana večera',
      'Predlog lagane šetnje',
      'Mogućnost kasnog checkout-a',
    ],
    tags: ['Parovi', 'Wellness', 'Romantika', 'Dve noći'],
    image: images.candlelitDinner,
    accommodationId: 'apartman-cigota',
    experienceIds: [
      'masaza-za-dvoje',
      'romanticna-vecera',
      'dekoracija-sobe-cvece',
      'panoramska-setnja-vidikovci',
    ],
  },
  {
    id: 'godisnjica-za-pamcenje',
    slug: 'godisnjica-za-pamcenje',
    name: 'Godišnjica za pamćenje',
    priceFromLabel: 'od 89.900 RSD za dvoje',
    priceFromValue: 89900,
    participantsLabel: 'za dvoje',
    participantsCount: 2,
    nights: 2,
    shortDescription:
      'Premium smeštaj, dekorisana soba, spa za dvoje i fotografisanje na atraktivnoj lokaciji — sve što godišnjicu čini posebnom.',
    highlights: [
      'Premium smeštaj',
      'Dekoracija sobe',
      'Spa ili masaža za dvoje',
      'Kratko fotografisanje na atraktivnoj lokaciji',
      'Večera',
      'Personalizovani poklon ili iznenađenje',
      'Mogućnost diskretnog planiranja ako jedna osoba ne zna detalje',
    ],
    tags: ['Godišnjica', 'Premium', 'Iznenađenje', 'Parovi'],
    image: images.flowerBouquet,
    accommodationId: 'vila-panorama',
    experienceIds: [
      'dekoracija-sobe-cvece',
      'privatni-wellness-termin',
      'fotografisanje-para',
      'romanticna-vecera',
      'tajno-iznenadjenje-prosidba',
    ],
  },
  {
    id: 'zlatibor-u-pokretu',
    slug: 'zlatibor-u-pokretu',
    name: 'Zlatibor u pokretu',
    priceFromLabel: 'od 69.900 RSD za dvoje',
    priceFromValue: 69900,
    participantsLabel: 'za dvoje ili prijatelje',
    participantsCount: 2,
    nights: 2,
    shortDescription:
      'E-bike ruta ka Torniku, ručak sa lokalnom hranom i wellness posle aktivnosti — sa rezervnom opcijom ako vreme ne bude na vašoj strani.',
    highlights: [
      'Dve noći',
      'E-bike ili kvad iskustvo',
      'Ruta ka Torniku, Ribničkom jezeru ili okolnim selima',
      'Ručak sa lokalnom hranom',
      'Wellness nakon aktivnosti',
      'Rezervna indoor aktivnost za loše vreme',
    ],
    tags: ['Avantura', 'Priroda', 'Aktivno', 'Parovi ili prijatelji'],
    image: images.ebikeTrail,
    accommodationId: 'apartman-cigota',
    experienceIds: [
      'ebike-tura-tornik',
      'rostilj-domaca-kuhinja',
      'privatni-wellness-termin',
    ],
  },
  {
    id: 'vikend-za-ekipu',
    slug: 'vikend-za-ekipu',
    name: 'Vikend za ekipu',
    priceFromLabel: 'od 149.000 RSD za šest osoba',
    priceFromValue: 149000,
    participantsLabel: 'za šest osoba',
    participantsCount: 6,
    nights: 2,
    shortDescription:
      'Kvad, streljana ili paintball, rezervisana večera i izlazak — sve na jednom mestu, za celu ekipu.',
    highlights: [
      'Dve noći za šestoro',
      'Kvad, paintball ili streljaštvo',
      'Rezervisana večera',
      'Opcija žive muzike ili izlaska',
      'Lokalni transfer',
      'Mogućnost dodavanja dekoracije, torte ili fotografisanja',
    ],
    tags: ['Društvo', 'Provod', 'Avantura', 'Šest osoba'],
    image: images.quadBike,
    accommodationId: 'zlatibor-house',
    experienceIds: [
      'voznja-kvadovima',
      'streljana-i-paintball',
      'vecera-uz-zivu-muziku',
      'druzenje-uz-vatru',
    ],
  },
];

export function getPackageBySlug(slug: string): Package | undefined {
  return packages.find((pkg) => pkg.slug === slug);
}
