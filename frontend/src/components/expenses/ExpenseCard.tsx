'use client';
import { Expense } from '@/types';
import { formatCurrency, formatDate, CATEGORY_COLORS } from '@/lib/utils';
import { Trash2 } from 'lucide-react';
import { useExpenseStore } from '@/store/expenseStore';
import { useState } from 'react';

const EMOJI: Record<string, string> = {
  Food:'🍔', Travel:'🚗', Rent:'🏠', Electricity:'⚡',
  Shopping:'🛍️', Medicine:'💊', Bills:'📄', Entertainment:'🎬', Others:'📦',
};
const PAY: Record<string, string> = { CASH:'💵', CARD:'💳', UPI:'📱', NET_BANKING:'🏦', WALLET:'👛' };

export default function ExpenseCard({ expense }: { expense: Expense }) {
  const { deleteExpense } = useExpenseStore();
  const [del, setDel] = useState(false);
  const color = expense.category ? CATEGORY_COLORS[expense.category.name] || '#9CA3AF' : '#9CA3AF';

  return (
    <div className={`card p-4 flex items-center gap-3 tap transition-all ${del ? 'opacity-40 scale-95' : ''}`}>
      <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
        style={{ background: `${color}18` }}>
        {expense.category ? EMOJI[expense.category.name] || '💸' : '💸'}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-[15px] truncate">{expense.title}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-xs text-gray-400">{formatDate(expense.expenseDate)}</span>
          {expense.category && (
            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
              style={{ background: `${color}18`, color }}>
              {expense.category.name}
            </span>
          )}
          <span className="text-xs">{PAY[expense.paymentMethod] || '💵'}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="font-bold text-gray-900">{formatCurrency(expense.amount)}</span>
        <button onClick={async () => { setDel(true); await deleteExpense(expense.id); }}
          className="w-7 h-7 flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-xl transition">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
