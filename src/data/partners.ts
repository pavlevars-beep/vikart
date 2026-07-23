import type { Partner } from '@/types';
import { images } from './images';

/**
 * Centralni registar partnera. Sve su DEMONSTRACIONE stavke (isDemo: true) — imena,
 * priče i kontakti su ilustrativni i ne predstavljaju stvarno ugovorene partnere dok
 * saradnja nije zvanično potvrđena. Svaki paket, iskustvo i itinerer referenciraju
 * partnera isključivo po `id`-u iz ovog fajla — izmena ovde se automatski odražava
 * svuda u aplikaciji (kartice, lične karte, itinereri, paketi).
 *
 * Fotografije: `media.mainPhoto` je glavna fotografija (kartica, vrh lične karte,
 * itinerer, kartica paketa), `media.gallery` su dodatne fotografije lične karte.
 * Sve su iz postojećeg legalnog fonda fotografija (`data/images.ts`) — kada partner
 * dostavi stvarne fotografije, dovoljno je zameniti vrednosti ovde.
 */
export const partners: Partner[] = [
  {
    id: 'zlatibor-house',
    slug: 'zlatibor-house',
    name: 'Zlatibor House',
    categories: ['smestaj'],
    status: 'demo',
    isDemo: true,
    oneLiner: 'Prostrana brvnara za društva do 8 osoba, sa velikim dnevnim boravkom i vatrom u dvorištu.',
    story:
      'Demonstracioni primer. Kuću je pre desetak godina od stare brvnare pregradila porodica koja i danas vodi domaćinstvo — otud veliki zajednički sto u dnevnoj sobi i vatra napolju umesto kamina za "atmosferu". Gosti koji dolaze u većem društvu obično kažu da im je najvažnije to što niko ne mora da spava u dnevnoj sobi.',
    location: { address: 'Obudovac bb, Zlatibor', area: 'Zlatibor — Obudovac', mapUrl: 'https://maps.google.com/?q=Zlatibor+Obudovac' },
    contact: { phone: '+381 63 100 2001', email: 'kontakt@zlatibor-house.example', instagram: '@zlatibor.house' },
    hoursLabel: 'Prijava od 15h, odjava do 11h',
    media: {
      mainPhoto: images.cabinLivingRoom,
      gallery: [images.cabinLivingRoom, images.bonfireFriends, images.zlatiborView],
    },
    facts: [
      { label: 'Kapacitet', value: '8 osoba (4 spavaće sobe)' },
      { label: 'Kupatila', value: '3' },
      { label: 'Sadržaj', value: 'Kamin, veliki dnevni boravak, mesto za vatru u dvorištu, parking za više vozila' },
      { label: 'Kuhinja', value: 'Potpuno opremljena, za samostalnu pripremu obroka' },
    ],
  },
  {
    id: 'vila-panorama',
    slug: 'vila-panorama',
    name: 'Vila Panorama',
    categories: ['smestaj'],
    status: 'demo',
    isDemo: true,
    oneLiner: 'Vila na osami sa panoramskim pogledom, za parove i manja društva koja žele mir.',
    story:
      'Demonstracioni primer. Vila je građena kao porodična kuća za odmor pre nego što je deo prostora izdvojen za goste — zato terasa gleda direktno na dolinu, bez ijedne susedne zgrade u vidokrugu. Nema recepcije ni hodnika sa desetak vrata; ima domaćina koji dođe da preda ključeve i ostavi vas na miru.',
    location: { address: 'Tornička 22, Zlatibor', area: 'Zlatibor — Tornik', mapUrl: 'https://maps.google.com/?q=Zlatibor+Tornik' },
    contact: { phone: '+381 63 100 2002', email: 'kontakt@vila-panorama.example', instagram: '@vila.panorama.zlatibor' },
    hoursLabel: 'Prijava od 15h, odjava do 12h (kasniji checkout na upit)',
    media: {
      mainPhoto: images.zlatiborView,
      gallery: [images.zlatiborView, images.forestTrail, images.cabinLivingRoom],
    },
    facts: [
      { label: 'Kapacitet', value: '4 osobe (2 spavaće sobe)' },
      { label: 'Kupatila', value: '2' },
      { label: 'Sadržaj', value: 'Panoramska terasa, kamin, parking' },
      { label: 'Pogodno za', value: 'Godišnjice, prosidbe, mirniji vikend za dvoje' },
    ],
  },
  {
    id: 'apartman-cigota',
    slug: 'apartmani-cigota',
    name: 'Apartmani Čigota',
    categories: ['smestaj'],
    status: 'demo',
    isDemo: true,
    oneLiner: 'Topao apartman blizu centra, za parove koji žele komfor bez nepotrebnog luksuza.',
    story:
      'Demonstracioni primer. Zgrada sa svega šest apartmana, pet minuta hoda od centra — dovoljno blizu za večernju šetnju, dovoljno daleko za mir. Vlasnica sama vodi računa o čistoći i sitnim popravkama, pa se to i vidi.',
    location: { address: 'Ulica Čigota 8, Zlatibor', area: 'Zlatibor centar', mapUrl: 'https://maps.google.com/?q=Zlatibor+centar' },
    contact: { phone: '+381 63 100 2003', email: 'kontakt@apartmani-cigota.example' },
    hoursLabel: 'Prijava od 14h, odjava do 11h',
    media: {
      mainPhoto: images.cabinLivingRoom,
      gallery: [images.cabinLivingRoom, images.zlatiborView],
    },
    facts: [
      { label: 'Kapacitet', value: '2 osobe' },
      { label: 'Sadržaj', value: 'Kamin, kuhinja, besplatan Wi-Fi, parking' },
      { label: 'Udaljenost od centra', value: '~5 minuta hoda' },
    ],
  },
  {
    id: 'zlatna-koliba',
    slug: 'zlatna-koliba',
    name: 'Zlatna Koliba',
    categories: ['restoran', 'muzika-i-vecernji-program'],
    status: 'demo',
    isDemo: true,
    oneLiner: 'Restoran sa živom muzikom vikendom — večera koja prirodno preraste u duže veče.',
    story:
      'Demonstracioni primer. Restoran postoji preko petnaest godina, a duo koji svira vikendom je tu skoro isto toliko dugo — sviraju po sluhu i po raspoloženju sale, ne po fiksnom repertoaru. Kuhinja radi do ponoći, što je retkost na ovoj nadmorskoj visini.',
    location: { address: 'Obudovac bb, Zlatibor', area: 'Zlatibor — Obudovac', mapUrl: 'https://maps.google.com/?q=Zlatibor+restorani' },
    contact: { phone: '+381 63 100 2004', email: 'rezervacije@zlatna-koliba.example', instagram: '@zlatna.koliba' },
    hoursLabel: 'Svaki dan 12–00h, živa muzika petkom i subotom od 21h',
    media: {
      mainPhoto: images.candlelitDinner2,
      gallery: [images.candlelitDinner2, images.traditionalTable],
    },
    facts: [
      { label: 'Tip kuhinje', value: 'Domaća i roštilj' },
      { label: 'Kapacitet sale', value: '80 mesta, plus letnja bašta' },
      { label: 'Rezervacija', value: 'Obavezna za sto uz binu petkom i subotom' },
    ],
  },
  {
    id: 'konoba-ovcarnik',
    slug: 'konoba-ovcarnik',
    name: 'Konoba Ovčarnik',
    categories: ['restoran'],
    status: 'demo',
    isDemo: true,
    oneLiner: 'Mirna konoba za rezervisan sto u strani — bez žurbe i bez glasne muzike.',
    story:
      'Demonstracioni primer. Konoba je uređena u prostoru nekadašnje ovčarske kuće — otud ime i niska drvena tavanica. Vlasnik kuva sam, meni je kratak i menja se prema tome šta je te nedelje sveže, a ne prema tome šta lepo zvuči u brošuri.',
    location: { address: 'Sirogojnski put 4, Zlatibor', area: 'Zlatibor — put ka Sirogojnu', mapUrl: 'https://maps.google.com/?q=Zlatibor+konoba' },
    contact: { phone: '+381 63 100 2005', email: 'sto@konoba-ovcarnik.example' },
    hoursLabel: 'Sreda–nedelja 13–23h',
    media: {
      mainPhoto: images.candlelitDinner,
      gallery: [images.candlelitDinner, images.karadjordjeSteak, images.grilledSteak],
    },
    facts: [
      { label: 'Tip kuhinje', value: 'Tradicionalna, sezonska' },
      { label: 'Kapacitet sale', value: '30 mesta' },
      { label: 'Atmosfera', value: 'Bez žive muzike — pogodno za miran razgovor' },
    ],
  },
  {
    id: 'mountain-spa-zlatibor',
    slug: 'mountain-spa-zlatibor',
    name: 'Mountain Spa Zlatibor',
    categories: ['spa-i-wellness', 'masaza'],
    status: 'demo',
    isDemo: true,
    oneLiner: 'Manji wellness centar sa privatnim terminima — bez čekanja i bez drugih gostiju u prostoru.',
    story:
      'Demonstracioni primer. Centar radi po sistemu jedan termin — jedna grupa, pa se nikad ne dešava da delite saunu sa nepoznatim ljudima. Masaže rade dve terapeutkinje sa dugogodišnjim iskustvom iz banjskih centara, ne sezonski angažovan honorarni tim.',
    location: { address: 'Trg na Čigoti bb, Zlatibor', area: 'Zlatibor — Čigota', mapUrl: 'https://maps.google.com/?q=Zlatibor+Cigota' },
    contact: { phone: '+381 63 100 2006', email: 'termini@mountain-spa.example', instagram: '@mountainspa.zlatibor' },
    hoursLabel: 'Svaki dan 09–21h, po terminima',
    media: {
      mainPhoto: images.spaRoom,
      gallery: [images.spaRoom, images.massageTreatment],
    },
    facts: [
      { label: 'Kapacitet termina', value: 'Do 6 osoba istovremeno (privatni zakup)' },
      { label: 'Sadržaj', value: 'Sauna, jacuzzi, prostor za odmor, 2 masažne sobe' },
      { label: 'Terapeuti', value: '2 stalne terapeutkinje' },
    ],
  },
  {
    id: 'tornik-quad-adventures',
    slug: 'tornik-quad-adventures',
    name: 'Tornik Quad Adventures',
    categories: ['voznja-kvadovima'],
    status: 'demo',
    isDemo: true,
    oneLiner: 'Off-road kvad ture ka Torniku, uz instruktora i punu zaštitnu opremu.',
    story:
      'Demonstracioni primer. Ekipa od troje instruktora vozi ove staze već godinama i sami su ih obeležili prema stepenu težine — ne prate generički GPS trek preuzet sa interneta. Kvadovi se servisiraju posle svake ture, ne na kraju sezone.',
    location: { address: 'Polazna tačka: parking Tornik, Zlatibor', area: 'Zlatibor — Tornik', mapUrl: 'https://maps.google.com/?q=Tornik+Zlatibor' },
    contact: { phone: '+381 63 100 2007', email: 'ture@tornik-quad.example', instagram: '@tornik.quad' },
    hoursLabel: 'Svaki dan 09–17h, poslednja tura u 15h',
    media: {
      mainPhoto: images.quadBike,
      gallery: [images.quadBike, images.tornikGondola, images.forestTrail],
    },
    facts: [
      { label: 'Instruktori', value: '3, uvek najmanje jedan po turi' },
      { label: 'Oprema', value: 'Kacige, naočare i rukavice u ceni' },
      { label: 'Minimalni uzrast vozača', value: '18 godina, uz važeću vozačku dozvolu' },
    ],
  },
  {
    id: 'zlatibor-ebike-tours',
    slug: 'zlatibor-ebike-tours',
    name: 'Zlatibor E-Bike Tours',
    categories: ['e-bike'],
    status: 'demo',
    isDemo: true,
    oneLiner: 'Vođene e-bike ture prilagođene kondiciji grupe, sa lakšom i težom varijantom rute.',
    story:
      'Demonstracioni primer. Vlasnik je bivši biciklistički takmičar koji je posle povrede prešao na e-bike ture — otud dve varijante svake rute, jer zna koliko razlika u kondiciji unutar iste grupe realno ume da bude velika.',
    location: { address: 'Šarplaninska bb, Zlatibor', area: 'Zlatibor centar', mapUrl: 'https://maps.google.com/?q=Zlatibor+ebike' },
    contact: { phone: '+381 63 100 2008', email: 'ture@zlatibor-ebike.example', instagram: '@zlatibor.ebike' },
    hoursLabel: 'Svaki dan 08–18h',
    media: {
      mainPhoto: images.ebikeTrail,
      gallery: [images.ebikeTrail, images.tornikGondola, images.forestTrail],
    },
    facts: [
      { label: 'Bicikli', value: 'Elektro brdski bicikli, servisirani nedeljno' },
      { label: 'Varijante rute', value: 'Lakša (ravničarski deo) i teža (uspon ka Torniku)' },
      { label: 'Oprema', value: 'Kacige i providne naočare u ceni' },
    ],
  },
  {
    id: 'ranc-vranesi',
    slug: 'ranc-vranesi',
    name: 'Ranč Vraneši',
    categories: ['jahanje'],
    status: 'demo',
    isDemo: true,
    oneLiner: 'Porodični ranč sa konjima navikutim na početnike, uz instruktora na svakoj vožnji.',
    story:
      'Demonstracioni primer. Ranč vodi porodica koja se konjima bavi tri generacije — konji su birani baš zato što su mirni, ne zato što su najbrži. Instruktorka vodi svaku grupu lično, bez obzira na broj jahača.',
    location: { address: 'Seoski put bb, Gostilje', area: 'Zlatibor — Gostilje', mapUrl: 'https://maps.google.com/?q=Gostilje+Zlatibor' },
    contact: { phone: '+381 63 100 2009', email: 'jahanje@ranc-vranesi.example' },
    hoursLabel: 'Svaki dan 09–18h',
    media: {
      mainPhoto: images.horsebackRiding,
      gallery: [images.horsebackRiding, images.forestTrail],
    },
    facts: [
      { label: 'Konji', value: '6, svi navikli na početnike' },
      { label: 'Instruktor', value: 'Uvek prisutan, prati grupu tokom cele vožnje' },
      { label: 'Uzrast', value: 'Od 8 godina, uz pratnju roditelja' },
    ],
  },
  {
    id: 'jovan-lens',
    slug: 'jovan-lens-fotograf',
    name: 'Jovan Lens — fotograf',
    categories: ['fotografisanje'],
    status: 'demo',
    isDemo: true,
    oneLiner: 'Fotograf sa deset godina iskustva u snimanju parova i društava na Zlatiboru.',
    story:
      'Demonstracioni primer. Jovan živi na Zlatiboru i fotografiše planinu u svako doba godine — zato tačno zna koja lokacija u koje doba dana ima najbolje svetlo, i menja predlog termina prema vremenskoj prognozi, ne prema unapred fiksnom rasporedu.',
    location: { address: 'Po dogovoru — dolazi na lokaciju', area: 'Zlatibor i okolina', mapUrl: 'https://maps.google.com/?q=Zlatibor' },
    contact: { phone: '+381 63 100 2010', email: 'jovan@jovanlens.example', instagram: '@jovan.lens' },
    hoursLabel: 'Po dogovorenom terminu',
    media: {
      mainPhoto: images.zlatiborView,
      gallery: [images.zlatiborView, images.forestTrail],
    },
    facts: [
      { label: 'Iskustvo', value: '10 godina, specijalizacija parovi i manje grupe' },
      { label: 'Isporuka', value: 'Obrađene fotografije u roku od 5 radnih dana' },
      { label: 'Oprema', value: 'Sopstvena, rezervna kamera uvek na terenu' },
    ],
  },
  {
    id: 'cvetni-atelje-zlatibor',
    slug: 'cvetni-atelje-zlatibor',
    name: 'Cvetni Atelje Zlatibor',
    categories: ['dekoracija-i-cvece'],
    status: 'demo',
    isDemo: true,
    oneLiner: 'Cveće, dekoracija sobe i mali iznenađenja — priprema pre vašeg dolaska.',
    story:
      'Demonstracioni primer. Atelje vodi cvećarka koja radi i dekoracije za svadbe u okolini, pa isti nivo pažnje prenosi i na manje narudžbine — jedan buket ili jedna soba dobijaju istu ozbiljnost kao veliki događaj.',
    location: { address: 'Ulica Miladina Pećinara 12, Zlatibor', area: 'Zlatibor centar', mapUrl: 'https://maps.google.com/?q=Zlatibor+cvecara' },
    contact: { phone: '+381 63 100 2011', email: 'narudzbine@cvetni-atelje.example', instagram: '@cvetni.atelje.zlatibor' },
    hoursLabel: 'Svaki dan 09–19h',
    media: {
      mainPhoto: images.flowerBouquet,
      gallery: [images.flowerBouquet, images.candlelitDinner],
    },
    facts: [
      { label: 'Priprema', value: 'Ulazi u sobu pre dolaska gostiju, uz dogovor sa smeštajem' },
      { label: 'Rok za narudžbinu', value: 'Najkasnije 48h pre termina' },
    ],
  },
  {
    id: 'domacinstvo-sirogojno',
    slug: 'domacinstvo-radovanovic',
    name: 'Domaćinstvo Radovanović',
    categories: ['lokalno-domacinstvo'],
    status: 'demo',
    isDemo: true,
    oneLiner: 'Domaćinstvo koje i danas živi od stoke i zemlje — obrok i degustacija uz priču domaćina.',
    story:
      'Demonstracioni primer. Porodica Radovanović drži ovce i krave na imanju kraj Sirogojna generacijama — sir, kajmak i rakija koje gosti probaju nisu pripremljeni "za turiste", nego su isti proizvodi koje porodica koristi za sebe. Domaćin sam priča o imanju, bez unapred napisanog teksta.',
    location: { address: 'Sirogojno bb', area: 'Sirogojno, kod Zlatibora', mapUrl: 'https://maps.google.com/?q=Sirogojno' },
    contact: { phone: '+381 63 100 2012', email: 'domacinstvo@radovanovic.example' },
    hoursLabel: 'Po dogovorenom terminu, obično 12–16h',
    media: {
      mainPhoto: images.traditionalTable,
      gallery: [images.traditionalTable, images.karadjordjeSteak, images.sirogojnoVillage],
    },
    facts: [
      { label: 'Proizvodi', value: 'Sir, kajmak, pršuta i rakija iz sopstvene proizvodnje' },
      { label: 'Kapacitet stola', value: 'Do 12 osoba' },
      { label: 'Pristup', value: 'Poslednjih 500m makadamskim putem' },
    ],
  },
  {
    id: 'zlatibor-tours-guide',
    slug: 'zlatibor-tours-guide',
    name: 'Zlatibor Priroda Ture',
    categories: ['izleti-i-turisticki-obilasci'],
    status: 'demo',
    isDemo: true,
    oneLiner: 'Lokalni vodič za Stopića pećinu, Gostiljski vodopad, Sirogojno i vidikovce Zlatibora.',
    story:
      'Demonstracioni primer. Vodič je rođen u Čajetini i turama se bavi punih petnaest godina — priče o pećini i vodopadu ne čita sa kartice, nego prepričava kako mu je to nekad ispričao njegov deda koji je radio kao šumar u ovom kraju.',
    location: { address: 'Polazna tačka zavisi od ture — dogovara se unapred', area: 'Zlatibor i okolina', mapUrl: 'https://maps.google.com/?q=Zlatibor+izleti' },
    contact: { phone: '+381 63 100 2013', email: 'ture@zlatibor-priroda.example', instagram: '@zlatibor.priroda.ture' },
    hoursLabel: 'Svaki dan, termini u 09h i 13h',
    media: {
      mainPhoto: images.stopicaCaveEntrance,
      gallery: [
        images.stopicaCaveEntrance,
        images.stopicaCaveInside,
        images.gostiljeWaterfall,
        images.gostiljeWaterfall2,
        images.sirogojnoVillage,
        images.ribnickoJezero,
        images.forestTrail,
      ],
    },
    facts: [
      { label: 'Ture', value: 'Stopića pećina, Gostiljski vodopad, Sirogojno, Ribničko jezero, panoramski vidikovci' },
      { label: 'Grupa', value: 'Individualno ili u sopstvenoj grupi (bez mešanja sa nepoznatim ljudima)' },
      { label: 'Prevoz do polazišta', value: 'Nije uključen — dogovara se posebno ili preko partnera za prevoz' },
    ],
  },
  {
    id: 'vik-transfer',
    slug: 'vik-transfer',
    name: 'VIK Transfer',
    categories: ['prevoz'],
    status: 'demo',
    isDemo: true,
    oneLiner: 'Lokalni transfer i prevoz između smeštaja, aktivnosti i restorana — bez čekanja na taksi.',
    story:
      'Demonstracioni primer. Mala firma sa tri vozila koja radi isključivo transfere u okolini Zlatibora — vozači unapred znaju tačno gde je polazak, jer im VikArt prosledi ceo raspored dana, ne samo jednu adresu.',
    location: { address: 'Zlatibor i okolina — dolazi na adresu', area: 'Zlatibor i okolina', mapUrl: 'https://maps.google.com/?q=Zlatibor' },
    contact: { phone: '+381 63 100 2014', email: 'rezervacije@vik-transfer.example' },
    hoursLabel: 'Svaki dan 07–23h',
    media: {
      mainPhoto: images.zlatiborHero,
      gallery: [images.zlatiborHero, images.tornikGondola],
    },
    facts: [
      { label: 'Vozila', value: '3, do 8 putnika po vozilu' },
      { label: 'Pokrivenost', value: 'Zlatibor, Tornik, Sirogojno, Gostilje, Ribničko jezero' },
    ],
  },
  {
    id: 'streljana-adrenalin',
    slug: 'streljana-adrenalin',
    name: 'Streljana Adrenalin',
    categories: ['ostala-iskustva'],
    status: 'demo',
    isDemo: true,
    oneLiner: 'Streljaštvo uz instruktora i paintball meč prilagođen broju učesnika.',
    story:
      'Demonstracioni primer. Poligon vodi bivši sportski strelac koji insistira na dužem uvodnom instruktažu nego što gosti obično očekuju — kaže da mu je važnije da svi budu bezbedni nego da se puca što pre.',
    location: { address: 'Industrijska zona bb, Čajetina', area: 'Čajetina, kod Zlatibora', mapUrl: 'https://maps.google.com/?q=Cajetina' },
    contact: { phone: '+381 63 100 2015', email: 'termini@streljana-adrenalin.example' },
    hoursLabel: 'Sreda–nedelja 10–18h',
    media: {
      mainPhoto: images.shootingRange,
      gallery: [images.shootingRange, images.forestTrail],
    },
    facts: [
      { label: 'Minimalna grupa', value: '4 osobe' },
      { label: 'Oprema', value: 'Zaštitne naočare i slušalice u ceni' },
      { label: 'Instruktaža', value: 'Obavezna, oko 15 minuta pre početka' },
    ],
  },
];

export function getPartnerById(id: string): Partner | undefined {
  return partners.find((partner) => partner.id === id);
}

export function getPartnerBySlug(slug: string): Partner | undefined {
  return partners.find((partner) => partner.slug === slug);
}
