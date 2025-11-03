import { useState } from 'react';
import type { Recipe, Param } from '../types';

const PARAMS: Param[] = ['a', 'b', 'c', 'd', 'e'];

const PARAM_COLORS: Record<Param, string> = {
  a: 'bg-red-100 text-red-700',
  b: 'bg-blue-100 text-blue-700',
  c: 'bg-green-100 text-green-700',
  d: 'bg-yellow-100 text-yellow-700',
  e: 'bg-purple-100 text-purple-700',
};

interface Props {
  onAdd: (recipe: Omit<Recipe, 'id' | 'tier'>) => void;
}

export function RecipeForm({ onAdd }: Props) {
  const [form, setForm] = useState<Omit<Recipe, 'id' | 'tier'>>({
    name: '',
    ratio: { a: 0, b: 0, c: 0, d: 0, e: 0 }
  });

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow-sm">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">レシピ名</label>
        <input
          placeholder="例: 回復ポーション"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">必要パラメータ</label>
        <div className="grid grid-cols-5 gap-2">
          {PARAMS.map(p => (
            <div key={p} className="flex flex-col items-center">
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${PARAM_COLORS[p]} mb-1`}>
                {p.toUpperCase()}
              </span>
              <input
                type="number"
                placeholder="0"
                min="0"
                value={form.ratio[p]}
                onChange={e => setForm({ ...form, ratio: { ...form.ratio, [p]: +e.target.value || 0 } })}
                className="w-full px-2 py-1 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 text-sm"
              />
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          ※ ティアはマジノミクス投入数で自動判定されます
        </p>
      </div>

      <button
        onClick={() => {
          if (!form.name.trim()) {
            alert('レシピ名を入力してください');
            return;
          }
          if (Object.values(form.ratio).every(v => v === 0)) {
            alert('少なくとも1つのパラメータを入力してください');
            return;
          }
          onAdd(form);
          setForm({ name: '', ratio: { a: 0, b: 0, c: 0, d: 0, e: 0 } });
        }}
        className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-md hover:from-indigo-700 hover:to-purple-700 transition shadow-md"
      >
        レシピを追加
      </button>
    </div>
  );
}