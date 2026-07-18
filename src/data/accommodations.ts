import type { Accommodation } from '@/types';
import { images } from './images';

export const accommodations: Accommodation[] = [
  {
    id: 'apartman-cigota',
    name: 'Apartman Čigota',
    type: 'apartman',
    description:
      'Topao, pažljivo uređen apartman u blizini centra, sa kaminom i pogledom na okolne padine. Pogodan za parove koji žele mir uz sav neophodan komfor.',
    capacity: 2,
    image: images.cabinLivingRoom,
    amenities: ['Kamin', 'Besplatan Wi-Fi', 'Kuhinja', 'Parking'],
  },
  {
    id: 'vila-panorama',
    name: 'Vila Panorama',
    type: 'vila',
    description:
      'Premium vila na osami sa panoramskim pogledom na Zlatibor, prostranim dnevnim boravkom i terasom. Odlična osnova za aktivan ili proslavljenički vikend.',
    capacity: 4,
    image: images.zlatiborView,
    amenities: ['Panoramski pogled', 'Terasa', 'Kamin', 'Parking', 'Mogućnost kasnog checkout-a'],
  },
  {
    id: 'kuca-za-ekipu',
    name: 'Kuća za ekipu',
    type: 'brvnara',
    description:
      'Prostrana brvnara sa više spavaćih soba i velikim zajedničkim dnevnim boravkom — prilagođena društvima koja žele da budu na jednom mestu.',
    capacity: 8,
    image: images.cabinLivingRoom,
    amenities: ['Više spavaćih soba', 'Veliki dnevni boravak', 'Kamin', 'Parking za više vozila'],
  },
];

export function getAccommodationById(id: string): Accommodation | undefined {
  return accommodations.find((accommodation) => accommodation.id === id);
}
