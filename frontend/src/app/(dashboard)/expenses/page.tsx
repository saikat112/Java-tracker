'use client';
import { useEffect } from 'react';
import { useExpenseStore } from '@/store/expenseStore';
import ExpenseCard from '@/components/expenses/ExpenseCard';
import { formatCurrency } from '@/lib/utils';

export default function ExpensesPage() {
  const { expenses, fetchExpenses, isLoading } = useExpenseStore();
  const now = new Date();
  const total = expenses.reduce((s, e) => s + Number(e.amount), 0);

  useEffect(() => { fetchExpenses(now.getMonth() + 1, now.getFullYear()); }, []);

  return (
    <div className="space-y-4 fade-in">
      <div>
        <h1 className="text-[26px] font-bold text-gray-900">Expenses</h1>
        <p className="text-gray-400 text-sm">{now.toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-5">
        <div className="flex justify-between">
          <div>
            <p className="text-violet-200 text-xs uppercase tracking-wide">Total Spent</p>
            <p className="text-white text-3xl font-bold mt-1">{formatCurrency(total)}</p>
          </div>
          <div className="text-right">
            <p className="text-violet-200 text-xs uppercase tracking-wide">Transactions</p>
            <p className="text-white text-3xl font-bold mt-1">{expenses.length}</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">{[1,2,3,4].map(i => <div key={i} className="h-[68px] bg-gray-200 rounded-2xl animate-pulse" />)}</div>
      ) : expenses.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-3">🧾</p>
          <p className="font-semibold text-gray-700">No expenses yet</p>
          <p className="text-gray-400 text-sm mt-1">Tap + to add your first expense</p>
        </div>
      ) : (
        <div className="space-y-2 stagger">
          {expenses.map(e => <ExpenseCard key={e.id} expense={e} />)}
        </div>
      )}
    </div>
  );
}
