import type { CraftResult } from '../types';

interface Props {
  data: CraftResult[];
}

export function DataTable({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
        <p className="text-lg font-medium">完璧な組み合わせが見つかりません...</p>
        <p className="text-sm mt-2">条件を緩和してみてください</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-purple-100 text-purple-800 font-semibold">
            <th className="px-4 py-3 text-left">合計価格</th>
            <th className="px-4 py-3 text-center">使用数</th>
            {/* 作成数・ティア削除 */}
            <th className="px-4 py-3 text-left">使用アイテム</th>
            <th className="px-4 py-3 text-center">特性</th>
          </tr>
        </thead>
        <tbody>
          {data.map((result, i) => (
            <tr key={i} className="border-b hover:bg-purple-50 transition">
              {/* 合計価格 */}
              <td className="px-4 py-3 font-bold text-green-700 text-lg">
                ¥{result.totalPrice.toLocaleString()}
              </td>

              {/* 使用数 */}
              <td className="px-4 py-3 text-center font-medium text-gray-700">
                {result.totalItems}
              </td>

              {/* 使用アイテム（見やすく） */}
              <td className="px-4 py-3">
                <div className="space-y-2">
                  {result.itemsUsed.map(({ item, count }) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-2 bg-white rounded-lg shadow-sm border border-gray-200"
                    >
                      <span className="font-bold text-gray-800 min-w-16">
                        {item.name}
                      </span>
                      <span className="text-indigo-600 font-medium">×{count}</span>
                      <span className="text-xs text-gray-500">
                        (¥{item.price.toLocaleString()} × {count} = ¥{(item.price * count).toLocaleString()})
                      </span>
                    </div>
                  ))}
                </div>
              </td>

              {/* 特性 */}
              <td className="px-4 py-3 text-center">
                <div className="flex justify-center gap-3 text-sm">
                  {Object.entries(result.traits).map(([t, { plus, normal:_, minus }]) => (
                    <div key={t} className="flex flex-col items-center">
                      <span className="font-bold text-gray-700">{t.slice(-1)}</span>
                      <span className={
                        plus > 0 ? 'text-green-600 font-bold' :
                        minus > 0 ? 'text-red-600 font-bold' :
                        'text-gray-400'
                      }>
                        {plus > 0 ? `+${plus}` : minus > 0 ? `-${minus}` : '0'}
                      </span>
                    </div>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}