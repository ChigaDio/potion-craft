import { useState } from 'react';
import type { Item, Param, Trait } from '../types';

const PARAMS: Param[] = ['a', 'b', 'c', 'd', 'e'];
const TRAITS: Trait[] = ['trait1', 'trait2', 'trait3', 'trait4', 'trait5'];

const PARAM_COLORS = {
  a: 'bg-red-100 text-red-700',
  b: 'bg-blue-100 text-blue-700',
  c: 'bg-green-100 text-green-700',
  d: 'bg-yellow-100 text-yellow-700',
  e: 'bg-purple-100 text-purple-700',
};

interface Props {
  onAdd: (item: Omit<Item, 'id'>) => void;
}

export function ItemForm({ onAdd }: Props) {
  const [form, setForm] = useState<Omit<Item, 'id'>>({
    name: '', price: 0, magimin: 0,
    params: { a: 0, b: 0, c: 0, d: 0, e: 0 },
    traits: { trait1: 0, trait2: 0, trait3: 0, trait4: 0, trait5: 0 }
  });

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow-sm">
      {/* 名前 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">アイテム名</label>
        <input
          placeholder="例: 赤い実"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {/* 価格 & マジミン */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">価格 (¥)</label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">¥</span>
            <input
              type="number"
              placeholder="100"
              value={form.price}
              onChange={e => setForm({ ...form, price: +e.target.value })}
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">マジミン (M)</label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-purple-600 font-bold">M</span>
            <input
              type="number"
              placeholder="50"
              value={form.magimin}
              onChange={e => setForm({ ...form, magimin: +e.target.value })}
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      {/* パラメータ a〜e */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">パラメータ</label>
        <div className="grid grid-cols-5 gap-2">
          {PARAMS.map(p => (
            <div key={p} className="flex flex-col items-center">
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${PARAM_COLORS[p]} mb-1`}>
                {p.toUpperCase()}
              </span>
              <input
                type="number"
                placeholder="0"
                value={form.params[p]}
                onChange={e => setForm({ ...form, params: { ...form.params, [p]: +e.target.value } })}
                className="w-full px-2 py-1 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 text-sm"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 特性 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">特性</label>
        <div className="grid grid-cols-5 gap-2">
          {TRAITS.map(t => (
            <div key={t} className="flex flex-col items-center">
              <span className="text-xs text-gray-500 mb-1">T{t.slice(-1)}</span>
              <select
                value={form.traits[t]}
                onChange={e => setForm({ ...form, traits: { ...form.traits, [t]: +e.target.value as -1 | 0 | 1 } })}
                className="w-full px-2 py-1 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 text-sm"
              >
                <option value={-1} className="text-red-600">-</option>
                <option value={0}>0</option>
                <option value={1} className="text-green-600">+</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* 追加ボタン */}
      <button
        onClick={() => {
          onAdd(form);
          setForm({
            name: '', price: 0, magimin: 0,
            params: { a: 0, b: 0, c: 0, d: 0, e: 0 },
            traits: { trait1: 0, trait2: 0, trait3: 0, trait4: 0, trait5: 0 }
          });
        }}
        className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-md hover:from-purple-700 hover:to-pink-700 transition shadow-md"
      >
        アイテムを追加
      </button>
    </div>
  );
}