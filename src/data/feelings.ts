import type { FeelingKey, ImageRef } from '@/types';
import { images } from './images';
import { feelingLabels, feelingDescriptions } from '@/utils/labels';

export interface FeelingCardData {
  key: FeelingKey;
  label: string;
  description: string;
  image: ImageRef;
}

const feelingImages: Record<FeelingKey, ImageRef> = {
  romanticno: images.candlelitDinner,
  opusteno: images.ribnickoJezero,
  uzbudljivo: images.quadBike,
  razmazeno: images.massageTreatment,
  povezano: images.bonfireFriends,
  veselo: images.candlelitDinner2,
  autenticno: images.sirogojnoVillage,
};

export const feelingCards: FeelingCardData[] = (Object.keys(feelingLabels) as FeelingKey[]).map((key) => ({
  key,
  label: feelingLabels[key],
  description: feelingDescriptions[key],
  image: feelingImages[key],
}));
