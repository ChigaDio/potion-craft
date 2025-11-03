// 型を「文字列リテラル」として固定
const PARAMS = ['a', 'b', 'c', 'd', 'e'] as const;
const TRAITS = ['trait1', 'trait2', 'trait3', 'trait4', 'trait5'] as const;
const TIERS = ['minor', 'common', 'greater', 'grand', 'superior', 'masterwork'] as const;

export type Param = typeof PARAMS[number]; // 'a' | 'b' | ...
export type Trait = typeof TRAITS[number];
export type Tier = typeof TIERS[number];

export type TraitValue = -1 | 0 | 1;

export interface Item {
  id: string;
  name: string;
  price: number;
  params: Record<Param, number>;
  traits: Record<Trait, TraitValue>;
  magimin: number;
}

export interface Recipe {
  id: string;
  name: string;
  ratio: Record<Param, number>;
}

export interface CraftResult {
  itemsUsed: { item: Item; count: number }[];
  totalPrice: number;
  totalItems: number;
  totalMagimin: number;
  craftCount: number;
  tier: string;
  traits: Record<Trait, { plus: number; normal: number; minus: number }>;
}