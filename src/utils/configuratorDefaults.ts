import type { ConfiguratorAnswers, FeelingKey, TravelerTypeKey, DateModeKey } from '@/types';

export const defaultAnswers: ConfiguratorAnswers = {
  occasion: null,
  travelerType: null,
  groupSize: 2,
  dateMode: null,
  specificDate: '',
  nights: 2,
  feelings: [],
  wants: [],
  budget: null,
  pace: null,
  locationPreference: 'najbolja-opcija',
  specialRequest: '',
};

export function hydrateFromSearchParams(params: URLSearchParams): Partial<ConfiguratorAnswers> {
  const patch: Partial<ConfiguratorAnswers> = {};
  const travelerType = params.get('travelerType');
  if (travelerType) patch.travelerType = travelerType as TravelerTypeKey;

  const groupSize = params.get('groupSize');
  if (groupSize) patch.groupSize = Math.max(1, Number(groupSize) || 2);

  const feeling = params.get('feeling');
  if (feeling) patch.feelings = [feeling as FeelingKey];

  const dateMode = params.get('dateMode');
  if (dateMode) patch.dateMode = dateMode as DateModeKey;

  return patch;
}
