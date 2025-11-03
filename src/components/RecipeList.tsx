import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import type { Recipe } from '../types';
import { Trash2 } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';

interface Props {
  recipes: Recipe[];
  onDelete: (id: string) => void;
  onSelect: (recipe: Recipe) => void;
  selectedId: string | null;
}

export function RecipeList({ recipes, onDelete, onSelect, selectedId }: Props) {
  const columns: ColumnDef<Recipe>[] = [
    {
      header: 'レシピ名',
      accessorKey: 'name',
      cell: ({ row }) => (
        <button
          onClick={() => onSelect(row.original)}
          className={`text-left font-medium w-full text-left px-2 py-1 rounded ${
            selectedId === row.original.id
              ? 'bg-purple-600 text-white'
              : 'hover:bg-purple-100'
          }`}
        >
          {row.original.name}
        </button>
      ),
    },
    {
      header: '必要パラメータ',
      cell: ({ row }) => (
        <div className="flex gap-1">
          {(['a','b','c','d','e'] as const).map(p => (
            row.original.ratio[p] > 0 && (
              <span
                key={p}
                className="text-xs px-1.5 py-0.5 bg-red-100 text-red-700 rounded-full font-bold"
              >
                {p.toUpperCase()}: {row.original.ratio[p]}
              </span>
            )
          ))}
        </div>
      ),
    },
    {
      header: '削除',
      cell: ({ row }) => (
        <button
          onClick={() => onDelete(row.original.id)}
          className="p-1 text-red-600 hover:bg-red-50 rounded"
        >
          <Trash2 size={16} />
        </button>
      ),
    },
  ];

  const table = useReactTable({
    data: recipes,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (recipes.length === 0) {
    return <p className="text-center text-gray-500 py-4">レシピが登録されていません</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id} className="border-b bg-gray-50">
              {headerGroup.headers.map(header => (
                <th key={header.id} className="text-left py-2 px-3 font-medium">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="border-b hover:bg-purple-50">
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="py-2 px-3">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}