import type { Tier } from '../types';

export const MAGIMIN_TABLE: Record<Tier, number[]> = {
  minor: [0, 10, 20, 30, 40, 50],
  common: [60, 75, 90, 105, 115, 130],
  greater: [150, 170, 195, 215, 235, 260],
  grand: [290, 315, 345, 370, 400, 430],
  superior: [470, 505, 545, 580, 620, 660],
  masterwork: [720, 800, 875, 960, 1040, 1121],
} satisfies Record<Tier, number[]>;

export const getCraftCount = (magimin: number, tier: Tier): number => {
  const thresholds = MAGIMIN_TABLE[tier] ?? MAGIMIN_TABLE.minor;
  return thresholds.filter(t => magimin >= t).length;
};