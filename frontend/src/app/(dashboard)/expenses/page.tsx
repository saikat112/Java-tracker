'use client';

import { useEffect } from 'react';
import { useExpenseStore } from '@/store/expenseStore';
import ExpenseCard from '@/components/expenses/ExpenseCard';
import { formatCurrency } from '@/lib/utils';

export default function ExpensesPage() {
  const { expenses, fetchExpenses, isLoading } = useExpenseStore();
  const now = new Date();
  const totalSpent = expenses.reduce((s, e) => s + Number(e.amount), 0);

  useEffect(() => {
    fetchExpenses(now.getMonth() + 1, now.getFullYear());
  }, []);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
        <p className="text-gray-400 text-sm">{now.toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-4 flex items-center justify-between text-white">
        <div>
          <p className="text-violet-200 text-xs">Total Spent</p>
          <p className="text-2xl font-bold mt-0.5">{formatCurrency(totalSpent)}</p>
        </div>
        <div className="text-right">
          <p className="text-violet-200 text-xs">Transactions</p>
          <p className="text-2xl font-bold mt-0.5">{expenses.length}</p>
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => <div key={i} className="h-16 bg-gray-200 rounded-2xl animate-pulse" />)}
        </div>
      ) : expenses.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🧾</div>
          <p className="font-semibold text-gray-700">No expenses yet</p>
          <p className="text-gray-400 text-sm mt-1">Tap + to add your first expense</p>
        </div>
      ) : (
        <div className="space-y-2">
          {expenses.map((expense) => (
            <ExpenseCard key={expense.id} expense={expense} />
          ))}
        </div>
      )}
    </div>
  );
}
