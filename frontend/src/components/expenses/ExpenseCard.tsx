'use client';

import { Expense } from '@/types';
import { formatCurrency, formatDate, CATEGORY_COLORS } from '@/lib/utils';
import { Trash2, Pencil } from 'lucide-react';
import { useExpenseStore } from '@/store/expenseStore';
import { useState } from 'react';

export default function ExpenseCard({ expense }: { expense: Expense }) {
  const { deleteExpense } = useExpenseStore();
  const [deleting, setDeleting] = useState(false);
  const color = expense.category ? CATEGORY_COLORS[expense.category.name] || '#9CA3AF' : '#9CA3AF';

  const handleDelete = async () => {
    if (!confirm('Delete this expense?')) return;
    setDeleting(true);
    await deleteExpense(expense.id);
  };

  return (
    <div className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3 ${deleting ? 'opacity-50' : ''}`}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${color}20` }}>
        <span className="text-lg">{getCategoryEmoji(expense.category?.name)}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 truncate">{expense.title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-gray-400">{formatDate(expense.expenseDate)}</span>
          {expense.category && (
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${color}20`, color }}>
              {expense.category.name}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-bold text-gray-900">{formatCurrency(expense.amount)}</span>
        <button onClick={handleDelete} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition">
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

function getCategoryEmoji(name?: string): string {
  const map: Record<string, string> = {
    Food: '🍔', Travel: '🚗', Rent: '🏠', Electricity: '⚡',
    Shopping: '🛍️', Medicine: '💊', Bills: '📄', Entertainment: '🎬', Others: '📦',
  };
  return name ? (map[name] || '💸') : '💸';
}
