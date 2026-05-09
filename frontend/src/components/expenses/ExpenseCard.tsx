'use client';

import { Expense } from '@/types';
import { formatCurrency, formatDate, CATEGORY_COLORS } from '@/lib/utils';
import { Trash2 } from 'lucide-react';
import { useExpenseStore } from '@/store/expenseStore';
import { useState } from 'react';

const CATEGORY_EMOJIS: Record<string, string> = {
  Food: '🍔', Travel: '🚗', Rent: '🏠', Electricity: '⚡',
  Shopping: '🛍️', Medicine: '💊', Bills: '📄', Entertainment: '🎬', Others: '📦',
};

const PAYMENT_ICONS: Record<string, string> = {
  CASH: '💵', CARD: '💳', UPI: '📱', NET_BANKING: '🏦', WALLET: '👛',
};

export default function ExpenseCard({ expense }: { expense: Expense }) {
  const { deleteExpense } = useExpenseStore();
  const [deleting, setDeleting] = useState(false);
  const color = expense.category ? CATEGORY_COLORS[expense.category.name] || '#9CA3AF' : '#9CA3AF';
  const emoji = expense.category ? CATEGORY_EMOJIS[expense.category.name] || '💸' : '💸';

  const handleDelete = async () => {
    if (!confirm('Delete this expense?')) return;
    setDeleting(true);
    await deleteExpense(expense.id);
  };

  return (
    <div className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3 transition-all ${deleting ? 'opacity-40 scale-95' : ''}`}>
      <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 text-xl"
        style={{ backgroundColor: `${color}18` }}>
        {emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-sm truncate">{expense.title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-gray-400">{formatDate(expense.expenseDate)}</span>
          {expense.category && (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: `${color}18`, color }}>
              {expense.category.name}
            </span>
          )}
          <span className="text-xs text-gray-300">{PAYMENT_ICONS[expense.paymentMethod] || '💵'}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="font-bold text-gray-900 text-sm">{formatCurrency(expense.amount)}</span>
        <button onClick={handleDelete} disabled={deleting}
          className="w-7 h-7 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
