import { useReactTable, getCoreRowModel, flexRender, } from '@tanstack/react-table';
import type { Item } from '../types';
import type { ColumnDef } from '@tanstack/react-table';
import { Trash2, Edit } from 'lucide-react';
import { useState } from 'react';

interface Props {
  items: Item[];
  onDelete: (id: string) => void;
  onEdit: (item: Item) => void;
}

export function ItemList({ items, onDelete }: Props) {
  const [, setEditingId] = useState<string | null>(null);
  const [, setEditForm] = useState<Item | null>(null);

  const columns: ColumnDef<Item>[] = [
    {
      header: '名前',
      accessorKey: 'name',
      cell: ({ row }) => (
<span className="font-semibold text-purple-800 hover:text-purple-600">
  {row.original.name}
</span>
      ),
    },
    {
      header: '価格',
      accessorKey: 'price',
      cell: ({ row }) => <span className="text-green-600">¥{row.original.price}</span>,
    },
    {
      header: 'マジミン',
      accessorKey: 'magimin',
      cell: ({ row }) => <span className="text-purple-600 font-bold">M{row.original.magimin}</span>,
    },
    {
      header: 'パラメータ',
      cell: ({ row }) => (
        <div className="flex gap-1">
          {(['a','b','c','d','e'] as const).map(p => (
            <span
              key={p}
              className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                row.original.params[p] > 0 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'
              }`}
            >
              {p.toUpperCase()}: {row.original.params[p]}
            </span>
          ))}
        </div>
      ),
    },
    {
      header: '特性',
      cell: ({ row }) => (
        <div className="flex gap-1">
          {(['trait1','trait2','trait3','trait4','trait5'] as const).map(t => {
            const val = row.original.traits[t];
            return (
              <span
                key={t}
                className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  val > 0 ? 'bg-green-100 text-green-700' :
                  val < 0 ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-500'
                }`}
              >
                T{t.slice(-1)}: {val === 0 ? '0' : val > 0 ? '+' : '-'}
              </span>
            );
          })}
        </div>
      ),
    },
    {
      header: '操作',
      cell: ({ row }) => (
        <div className="flex gap-1">
          <button
            onClick={() => {
              setEditingId(row.original.id);
              setEditForm({ ...row.original });
            }}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(row.original.id)}
            className="p-1 text-red-600 hover:bg-red-50 rounded"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (items.length === 0) {
    return <p className="text-center text-gray-500 py-4">アイテムが登録されていません</p>;
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