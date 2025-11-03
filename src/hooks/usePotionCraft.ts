import { useMemo } from 'react';
import type { Item, Recipe, CraftResult, Param, Trait } from '../types';
import { MAGIMIN_TABLE, getCraftCount } from '../data/magiminTable';

const PARAMS: Param[] = ['a', 'b', 'c', 'd', 'e'];
const TRAITS: Trait[] = ['trait1', 'trait2', 'trait3', 'trait4', 'trait5'];

interface Filters {
  minTier?: keyof typeof MAGIMIN_TABLE;
  maxTier?: keyof typeof MAGIMIN_TABLE;
  traitFilters?: Record<Trait, number[]>;
  requiredItems?: string[];
}

// アイテムが「レシピで要求されていないパラメータ」を提供していないか？
const isItemValidForRecipe = (item: Item, requiredParams: Param[]): boolean => {
  return PARAMS.every(p => {
    if (requiredParams.includes(p)) {
      // 要求されてる → 提供できればOK
      return true;
    } else {
      // 要求されてない → 絶対に提供してはいけない
      return item.params[p] === 0;
    }
  });
};

export const usePotionCraft = (
  items: Item[],
  recipe: Recipe | null,
  discount: number,
  sortBy: 'price' | 'count',
  filters: Filters
): CraftResult[] => {
  return useMemo(() => {
    if (!recipe || items.length === 0) return [];

    const ratio = recipe.ratio;
    const requiredParams = PARAMS.filter(p => ratio[p] > 0);
    if (requiredParams.length === 0) return [];

    // 1. レシピに適合するアイテムのみ抽出
    const validItems = items.filter(item => isItemValidForRecipe(item, requiredParams));
    if (validItems.length === 0) return [];

    // 2. 各必須パラメータに対して、提供可能なアイテムをグループ化
    const paramToItems = new Map<Param, { item: Item; provide: number }[]>();
    
    for (const p of requiredParams) {
      const candidates = validItems
        .filter(item => item.params[p] > 0)
        .map(item => ({
          item,
          provide: item.params[p]
        }));
      
      if (candidates.length === 0) return [];
      paramToItems.set(p, candidates);
    }

    const results: CraftResult[] = [];

    // 3. 再帰で組み合わせ生成
    const generate = (
      index: number,
      current: Array<{ item: Item; count: number }>
    ): void => {
      if (index === requiredParams.length) {
        // 重複アイテム集計
        const itemMap = new Map<string, { item: Item; count: number }>();
        for (const { item, count } of current) {
          const key = item.id;
          if (itemMap.has(key)) {
            itemMap.get(key)!.count += count;
          } else {
            itemMap.set(key, { item, count });
          }
        }

        const itemsUsed = Array.from(itemMap.values());
        const totalPrice = itemsUsed.reduce((s, { item, count }) => s + item.price * count, 0) * (1 - discount / 100);
        const totalMagimin = itemsUsed.reduce((s, { item, count }) => s + item.magimin * count, 0);
        const tier = getTier(totalMagimin);
        const craftCount = getCraftCount(totalMagimin, tier);

        const traits = TRAITS.reduce((acc, t) => {
          acc[t] = { plus: 0, normal: 0, minus: 0 };
          return acc;
        }, {} as CraftResult['traits']);

        for (const { item, count } of itemsUsed) {
          for (const t of TRAITS) {
            const val = item.traits[t] * count;
            if (val > 0) traits[t].plus += val;
            else if (val < 0) traits[t].minus += -val;
            else traits[t].normal += count;
          }
        }

        results.push({
          itemsUsed,
          totalPrice: Math.round(totalPrice),
          totalItems: itemsUsed.reduce((s, { count }) => s + count, 0),
          totalMagimin,
          craftCount,
          tier,
          traits
        });
        return;
      }

      const p = requiredParams[index];
      const candidates = paramToItems.get(p)!;

      for (const { item, provide } of candidates) {
        const need = ratio[p];
        const count = Math.ceil(need / provide);
        generate(index + 1, [...current, { item, count }]);
      }
    };

    generate(0, []);

    // 4. フィルタ
    let filtered = results;

    if (filters.minTier) {
      const minVal = MAGIMIN_TABLE[filters.minTier][0];
      filtered = filtered.filter(r => r.totalMagimin >= minVal);
    }
    if (filters.maxTier) {
      const maxVal = MAGIMIN_TABLE[filters.maxTier][5];
      filtered = filtered.filter(r => r.totalMagimin <= maxVal);
    }
    if (filters.traitFilters) {
      for (const [t, allowed] of Object.entries(filters.traitFilters)) {
        if (allowed.length > 0) {
          filtered = filtered.filter(r => {
            const { plus, minus } = r.traits[t as Trait];
            const val = plus > 0 ? 1 : minus > 0 ? -1 : 0;
            return allowed.includes(val);
          });
        }
      }
    }
    if (filters.requiredItems && filters.requiredItems.length > 0) {
      filtered = filtered.filter(r =>
        filters.requiredItems!.every(id => r.itemsUsed.some(i => i.item.id === id))
      );
    }

    return filtered
      .sort((a, b) => sortBy === 'price' ? a.totalPrice - b.totalPrice : a.totalItems - b.totalItems)
      .slice(0, 50);
  }, [items, recipe, discount, sortBy, filters]);
};

const getTier = (magimin: number): keyof typeof MAGIMIN_TABLE => {
  if (magimin < 60) return 'minor';
  if (magimin < 150) return 'common';
  if (magimin < 290) return 'greater';
  if (magimin < 470) return 'grand';
  if (magimin < 720) return 'superior';
  return 'masterwork';
};