'use client';

import { useEffect } from 'react';
import { useExpenseStore } from '@/store/expenseStore';
import ExpenseCard from '@/components/expenses/ExpenseCard';
import { formatDate } from '@/lib/utils';

export default function ExpensesPage() {
  const { expenses, fetchExpenses, isLoading } = useExpenseStore();

  useEffect(() => {
    const now = new Date();
    fetchExpenses(now.getMonth() + 1, now.getFullYear());
  }, [fetchExpenses]);

  if (isLoading) return <div className="space-y-3">{[1,2,3,4,5].map(i => <div key={i} className="h-20 bg-gray-200 rounded-2xl animate-pulse" />)}</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
        <span className="text-sm text-gray-500">{expenses.length} this month</span>
      </div>

      {expenses.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-3">🧾</div>
          <p className="text-gray-500">No expenses yet</p>
          <p className="text-gray-400 text-sm">Tap + to add your first expense</p>
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
