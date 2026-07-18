import type { Partner } from '@/types';
import { images } from './images';

/**
 * Demonstracioni partneri — generički, izmišljeni nazivi. Ne predstavljaju
 * stvarne ugovorene partnere dok saradnja nije zvanično potvrđena.
 */
export const demoPartners: Partner[] = [
  {
    id: 'demo-vila-srebrno-brdo',
    type: 'vila',
    name: 'Vila Srebrno brdo (demo primer)',
    description: 'Boutique vila sa 4 apartmana, wellness zonom i panoramskom terasom.',
    location: 'Zlatibor',
    image: images.zlatiborView,
    verified: false,
  },
  {
    id: 'demo-konak-kraj-potoka',
    type: 'restoran',
    name: 'Konak kraj potoka (demo primer)',
    description: 'Restoran domaće kuhinje sa baštom i mogućnošću privatnih večera.',
    location: 'Zlatibor',
    image: images.candlelitDinner,
    verified: false,
  },
  {
    id: 'demo-adrenalin-tim',
    type: 'avantura',
    name: 'Adrenalin tim (demo primer)',
    description: 'Organizator kvad tura, streljane i paintball aktivnosti za grupe.',
    location: 'Zlatibor i okolina',
    image: images.quadBike,
    verified: false,
  },
];
