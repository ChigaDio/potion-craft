import { useState, useEffect } from 'react';
import { Download, Upload } from 'lucide-react';
import { DataTable } from './components/DataTable';
import { ItemForm } from './components/ItemForm';
import { RecipeForm } from './components/RecipeForm';
import { ItemList } from './components/ItemList';
import { RecipeList } from './components/RecipeList';
import { usePotionCraft } from './hooks/usePotionCraft';
import type { Item, Recipe } from './types';
import { MAGIMIN_TABLE } from './data/magiminTable';

type Tier = keyof typeof MAGIMIN_TABLE;

export default function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [discount, setDiscount] = useState(0);
  const [sortBy, setSortBy] = useState<'price' | 'count'>('price');
  const [minTier, setMinTier] = useState<Tier | ''>('');
  const [maxTier, setMaxTier] = useState<Tier | ''>('');
  const [traitFilters, setTraitFilters] = useState<Record<'trait1' | 'trait2' | 'trait3' | 'trait4' | 'trait5', number[]>>({
    trait1: [],
    trait2: [],
    trait3: [],
    trait4: [],
    trait5: [],
  });
  const [requiredItems, setRequiredItems] = useState<string[]>([]);

  // ローカルストレージ
  useEffect(() => {
    const saved = localStorage.getItem('potion-craft-data');
    if (saved) {
      const { items: i, recipes: r } = JSON.parse(saved);
      setItems(i || []);
      setRecipes(r || []);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('potion-craft-data', JSON.stringify({ items, recipes }));
  }, [items, recipes]);

  // usePotionCraft に5引数（filters オブジェクト）
  const results = usePotionCraft(items, selectedRecipe, discount, sortBy, {
    minTier: minTier || undefined,
    maxTier: maxTier || undefined,
    traitFilters,
    requiredItems,
  });

  // JSONダウンロード
  const downloadData = () => {
    const data = { items, recipes };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `potion-craft-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // JSONアップロード
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (data.items && data.recipes) {
          setItems(data.items);
          setRecipes(data.recipes);
          alert('データ復元成功！');
        } else {
          alert('無効なJSON形式です');
        }
      } catch {
        alert('JSON読み込みエラー');
      }
    };
    reader.readAsText(file);
  };

  // アイテム編集
  const handleEditItem = (updated: Item) => {
    setItems(prev => prev.map(i => i.id === updated.id ? updated : i));
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-purple-800">
          マジミン・ポーションクラフト
        </h1>

        {/* ツールバー */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex flex-wrap gap-3 items-center">
          <button onClick={downloadData} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            <Download size={18} /> バックアップ
          </button>
          <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700">
            <Upload size={18} /> 復元
            <input type="file" accept=".json" onChange={handleUpload} className="hidden" />
          </label>
          <div className="flex-1" />
          <span className="text-sm text-gray-600">保存: ローカルストレージ + JSON</span>
        </div>

        {/* アイテム管理 */}
        <div className="bg-white rounded-xl shadow-xl p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-purple-700">アイテム管理</h2>
          <div className="grid lg:grid-cols-2 gap-6">
            <div>
              <ItemForm onAdd={item => setItems(prev => [...prev, { ...item, id: crypto.randomUUID() }])} />
            </div>
            <div>
              <ItemList
                items={items}
                onDelete={id => setItems(prev => prev.filter(i => i.id !== id))}
                onEdit={handleEditItem}
              />
            </div>
          </div>
        </div>

        {/* レシピ管理 */}
        <div className="bg-white rounded-xl shadow-xl p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-700">レシピ管理</h2>
          <div className="grid lg:grid-cols-2 gap-6">
            <div>
              <RecipeForm onAdd={recipe => setRecipes(prev => [...prev, { ...recipe, id: crypto.randomUUID() }])} />
            </div>
            <div>
              <RecipeList
                recipes={recipes}
                onDelete={id => setRecipes(prev => prev.filter(r => r.id !== id))}
                onSelect={setSelectedRecipe}
                selectedId={selectedRecipe?.id || null}
              />
            </div>
          </div>
        </div>

        {/* クラフト結果 + 絞り込み */}
        {selectedRecipe && (
          <div className="bg-white rounded-xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-pink-700">
                クラフト結果: {selectedRecipe.name}
              </h2>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="割引%"
                  value={discount}
                  onChange={e => setDiscount(+e.target.value)}
                  className="w-20 px-2 py-1 border rounded text-sm"
                />
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as 'price' | 'count')}
                  className="px-3 py-1 border rounded text-sm"
                >
                  <option value="price">安い順</option>
                  <option value="count">少ない順</option>
                </select>
              </div>
            </div>

            {/* 絞り込みUI */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-semibold mb-3 text-gray-700">絞り込み</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1">最小ティア</label>
                  <select
                    value={minTier}
                    onChange={e => setMinTier(e.target.value as Tier | '')}
                    className="w-full px-2 py-1 text-xs border rounded"
                  >
                    <option value="">なし</option>
                    {Object.keys(MAGIMIN_TABLE).map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">最大ティア</label>
                  <select
                    value={maxTier}
                    onChange={e => setMaxTier(e.target.value as Tier | '')}
                    className="w-full px-2 py-1 text-xs border rounded"
                  >
                    <option value="">なし</option>
                    {Object.keys(MAGIMIN_TABLE).map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">必須アイテムID</label>
                  <input
                    placeholder="1,2"
                    value={requiredItems.join(', ')}
                    onChange={e => setRequiredItems(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                    className="w-full px-2 py-1 text-xs border rounded"
                  />
                </div>
              </div>

              {/* 特性フィルター */}
              <div className="mt-3 flex flex-wrap gap-2">
                {(['trait1', 'trait2', 'trait3', 'trait4', 'trait5'] as const).map(t => (
                  <div key={t} className="flex items-center gap-1">
                    <span className="text-xs font-medium">{t.slice(-1)}:</span>
                    {[-1, 0, 1].map(v => (
                      <label key={v} className="flex items-center text-xs">
                        <input
                          type="checkbox"
                          checked={traitFilters[t].includes(v)}
                          onChange={e => {
                            setTraitFilters(prev => ({
                              ...prev,
                              [t]: e.target.checked
                                ? [...prev[t], v]
                                : prev[t].filter(x => x !== v),
                            }));
                          }}
                          className="mr-1"
                        />
                        {v > 0 ? '+' : v < 0 ? '-' : '0'}
                      </label>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <DataTable data={results} />
            {results.length === 0 && (
              <p className="text-center py-8 text-gray-500">
                完璧な組み合わせが見つかりません...
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}