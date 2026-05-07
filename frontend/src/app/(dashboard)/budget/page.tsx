'use client';

import { useEffect, useState } from 'react';
import { useBudgetStore } from '@/store/budgetStore';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { formatCurrency } from '@/lib/utils';
import { Plus, Trash2 } from 'lucide-react';

const schema = z.object({
  totalBudget: z.coerce.number().positive(),
  savingsGoal: z.coerce.number().min(0).default(0),
  fixedExpenses: z.array(z.object({
    name: z.string().min(1),
    amount: z.coerce.number().positive(),
  })).default([]),
});

type FormData = z.infer<typeof schema>;

export default function BudgetPage() {
  const { budget, fetchBudget, saveBudget, isLoading } = useBudgetStore();
  const now = new Date();
  const [saved, setSaved] = useState(false);

  const { register, handleSubmit, watch, control, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { totalBudget: 0, savingsGoal: 0, fixedExpenses: [] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'fixedExpenses' });

  useEffect(() => {
    fetchBudget(now.getMonth() + 1, now.getFullYear());
  }, []);

  useEffect(() => {
    if (budget) {
      reset({
        totalBudget: budget.totalBudget,
        savingsGoal: budget.savingsGoal,
        fixedExpenses: budget.fixedExpenses.map((f) => ({ name: f.name, amount: f.amount })),
      });
    }
  }, [budget, reset]);

  const watchAll = watch();
  const fixedTotal = watchAll.fixedExpenses?.reduce((s, f) => s + (Number(f.amount) || 0), 0) || 0;
  const flexible = (Number(watchAll.totalBudget) || 0) - fixedTotal - (Number(watchAll.savingsGoal) || 0);

  const onSubmit = async (data: FormData) => {
    await saveBudget({ ...data, month: now.getMonth() + 1, year: now.getFullYear() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Monthly Budget</h1>
      <p className="text-gray-500 text-sm">{now.toLocaleString('default', { month: 'long', year: 'numeric' })}</p>

      {/* Live Preview */}
      <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-3xl p-5 text-white">
        <p className="text-violet-200 text-sm mb-3">Budget Breakdown</p>
        <div className="grid grid-cols-3 gap-3">
          <PreviewStat label="Total" value={formatCurrency(Number(watchAll.totalBudget) || 0)} />
          <PreviewStat label="Fixed" value={formatCurrency(fixedTotal)} />
          <PreviewStat label="Flexible" value={formatCurrency(Math.max(flexible, 0))} highlight={flexible < 0} />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Monthly Budget (₹)</label>
            <input {...register('totalBudget')} type="number" placeholder="e.g. 30000"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500" />
            {errors.totalBudget && <p className="text-red-500 text-xs mt-1">{errors.totalBudget.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Savings Goal (₹)</label>
            <input {...register('savingsGoal')} type="number" placeholder="e.g. 5000"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">Fixed Expenses</h3>
            <button type="button" onClick={() => append({ name: '', amount: 0 })}
              className="flex items-center gap-1 text-violet-600 text-sm font-medium hover:text-violet-700">
              <Plus size={16} /> Add
            </button>
          </div>
          <div className="space-y-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <input {...register(`fixedExpenses.${index}.name`)} placeholder="Name (e.g. Rent)"
                  className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm" />
                <input {...register(`fixedExpenses.${index}.amount`)} type="number" placeholder="Amount"
                  className="w-28 px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm" />
                <button type="button" onClick={() => remove(index)}
                  className="p-2.5 text-red-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {fields.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-3">No fixed expenses added</p>
            )}
          </div>
        </div>

        <button type="submit" disabled={isLoading || flexible < 0}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3.5 rounded-xl transition disabled:opacity-50">
          {isLoading ? 'Saving...' : saved ? '✓ Saved!' : 'Save Budget'}
        </button>
        {flexible < 0 && (
          <p className="text-red-500 text-sm text-center">Fixed expenses + savings exceed total budget</p>
        )}
      </form>

      {budget?.weeklyBreakdown && budget.weeklyBreakdown.length > 0 && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-3">Weekly Breakdown</h3>
          <div className="space-y-2">
            {budget.weeklyBreakdown.map((w) => (
              <div key={w.weekNumber} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm font-medium text-gray-700">Week {w.weekNumber}</span>
                <span className="text-sm text-gray-500">{formatCurrency(w.weeklyBudget)}</span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  w.status === 'HEALTHY' ? 'bg-green-100 text-green-700' :
                  w.status === 'WARNING' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                }`}>{w.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PreviewStat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="bg-white/10 rounded-xl p-2.5 text-center">
      <p className="text-violet-200 text-xs">{label}</p>
      <p className={`font-bold text-sm mt-0.5 ${highlight ? 'text-red-300' : 'text-white'}`}>{value}</p>
    </div>
  );
}
