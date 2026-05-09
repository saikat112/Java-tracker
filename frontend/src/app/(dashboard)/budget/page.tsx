'use client';
import { useEffect, useState } from 'react';
import { useBudgetStore } from '@/store/budgetStore';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { formatCurrency } from '@/lib/utils';
import { Plus, Trash2, Pencil, Check, X } from 'lucide-react';

const schema = z.object({
  totalBudget: z.coerce.number().min(1, 'Required'),
  savingsGoal: z.coerce.number().min(0).default(0),
  fixedExpenses: z.array(z.object({
    name: z.string().min(1, 'Name required'),
    amount: z.coerce.number().min(1, 'Amount required'),
  })).default([]),
});
type FormData = z.infer<typeof schema>;

export default function BudgetPage() {
  const { budget, fetchBudget, saveBudget, isLoading } = useBudgetStore();
  const now = new Date();
  const [editMode, setEditMode] = useState(false);
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
        fixedExpenses: budget.fixedExpenses.map(f => ({ name: f.name, amount: Number(f.amount) })),
      });
    }
  }, [budget, reset]);

  // Open edit mode if no budget exists
  useEffect(() => {
    if (!isLoading && !budget) setEditMode(true);
  }, [isLoading, budget]);

  const w = watch();
  const fixedTotal = (w.fixedExpenses || []).reduce((s, f) => s + (Number(f.amount) || 0), 0);
  const flexible = (Number(w.totalBudget) || 0) - fixedTotal - (Number(w.savingsGoal) || 0);

  const onSubmit = async (data: FormData) => {
    await saveBudget({ ...data, month: now.getMonth() + 1, year: now.getFullYear() });
    setSaved(true);
    setEditMode(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const inputCls = "w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-gray-900 text-sm outline-none transition-all focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-100";

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Budget</h1>
          <p className="text-gray-400 text-sm">{now.toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
        </div>
        {budget && !editMode && (
          <button onClick={() => setEditMode(true)}
            className="flex items-center gap-1.5 bg-violet-50 text-violet-600 font-semibold text-sm px-4 py-2 rounded-2xl hover:bg-violet-100 transition active:scale-95">
            <Pencil size={14} /> Edit
          </button>
        )}
      </div>

      {/* View Mode — show existing budget */}
      {budget && !editMode && (
        <div className="space-y-4">
          {/* Main budget card */}
          <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-3xl p-5 text-white">
            <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Total Budget</p>
            <p className="text-4xl font-bold">{formatCurrency(budget.totalBudget)}</p>
            <div className="grid grid-cols-3 gap-2 mt-5">
              {[
                { label: 'Fixed', val: budget.fixedExpensesTotal, icon: '🔒' },
                { label: 'Savings', val: budget.savingsGoal, icon: '🎯' },
                { label: 'Flexible', val: budget.flexibleBudget, icon: '💳' },
              ].map(s => (
                <div key={s.label} className="rounded-2xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.07)' }}>
                  <span className="text-lg">{s.icon}</span>
                  <p className="text-gray-400 text-[10px] mt-1 uppercase tracking-wide">{s.label}</p>
                  <p className="text-white font-bold text-sm mt-0.5">{formatCurrency(s.val)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Budget progress */}
          <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <p className="font-semibold text-gray-900">Spending Progress</p>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                budget.remainingBudget < 0 ? 'bg-red-50 text-red-500' :
                budget.remainingBudget < budget.flexibleBudget * 0.2 ? 'bg-amber-50 text-amber-600' :
                'bg-emerald-50 text-emerald-600'
              }`}>
                {budget.remainingBudget < 0 ? 'Over Budget' :
                 budget.remainingBudget < budget.flexibleBudget * 0.2 ? 'Warning' : 'On Track'}
              </span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-3">
              <div className={`h-full rounded-full transition-all duration-700 ${
                budget.remainingBudget < 0 ? 'bg-red-500' :
                budget.remainingBudget < budget.flexibleBudget * 0.2 ? 'bg-amber-400' : 'bg-violet-500'
              }`} style={{ width: `${Math.min((budget.totalSpent / Math.max(budget.flexibleBudget, 1)) * 100, 100)}%` }} />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Spent: <span className="font-semibold text-gray-900">{formatCurrency(budget.totalSpent)}</span></span>
              <span className="text-gray-500">Left: <span className={`font-semibold ${budget.remainingBudget < 0 ? 'text-red-500' : 'text-emerald-600'}`}>{formatCurrency(budget.remainingBudget)}</span></span>
            </div>
          </div>

          {/* Fixed expenses list */}
          {budget.fixedExpenses?.length > 0 && (
            <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm">
              <p className="font-semibold text-gray-900 mb-3">Fixed Expenses</p>
              <div className="space-y-2">
                {budget.fixedExpenses.map((fe, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-violet-50 rounded-xl flex items-center justify-center">
                        <span className="text-sm">🔒</span>
                      </div>
                      <span className="text-sm font-medium text-gray-800">{fe.name}</span>
                    </div>
                    <span className="font-semibold text-gray-900 text-sm">{formatCurrency(fe.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Weekly breakdown */}
          {budget.weeklyBreakdown?.length > 0 && (
            <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm">
              <p className="font-semibold text-gray-900 mb-3">Weekly Breakdown</p>
              <div className="space-y-2">
                {budget.weeklyBreakdown.map(w => {
                  const pct = Math.min((w.totalSpent / Math.max(w.weeklyBudget, 1)) * 100, 100);
                  return (
                    <div key={w.weekNumber} className="bg-gray-50 rounded-2xl p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-gray-800">Week {w.weekNumber}</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          w.status === 'HEALTHY' ? 'bg-emerald-100 text-emerald-700' :
                          w.status === 'WARNING' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                        }`}>{w.status}</span>
                      </div>
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mb-2">
                        <div className={`h-full rounded-full ${
                          w.status === 'HEALTHY' ? 'bg-emerald-500' :
                          w.status === 'WARNING' ? 'bg-amber-500' : 'bg-red-500'
                        }`} style={{ width: `${pct}%` }} />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Budget: {formatCurrency(w.weeklyBudget)}</span>
                        <span>Spent: {formatCurrency(w.totalSpent)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Edit / Create Mode */}
      {editMode && (
        <div className="space-y-4">
          {/* Live preview */}
          <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-3xl p-5 text-white">
            <p className="text-violet-200 text-xs uppercase tracking-widest mb-3">Live Preview</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Total', val: Number(w.totalBudget) || 0 },
                { label: 'Fixed', val: fixedTotal },
                { label: 'Flexible', val: flexible },
              ].map(s => (
                <div key={s.label} className="rounded-2xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.12)' }}>
                  <p className="text-violet-200 text-[10px] uppercase tracking-wide">{s.label}</p>
                  <p className={`font-bold text-sm mt-1 ${s.label === 'Flexible' && s.val < 0 ? 'text-red-300' : 'text-white'}`}>
                    {formatCurrency(s.val)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Budget & Savings */}
            <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Total Monthly Budget (₹)</label>
                <input {...register('totalBudget')} type="number" placeholder="e.g. 30000" className={inputCls} />
                {errors.totalBudget && <p className="text-red-500 text-xs mt-1">{errors.totalBudget.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Savings Goal (₹)</label>
                <input {...register('savingsGoal')} type="number" placeholder="e.g. 5000" className={inputCls} />
              </div>
            </div>

            {/* Fixed Expenses */}
            <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold text-gray-900">Fixed Expenses</p>
                <button type="button" onClick={() => append({ name: '', amount: 0 })}
                  className="flex items-center gap-1 text-violet-600 text-sm font-semibold hover:text-violet-800 transition">
                  <Plus size={15} /> Add
                </button>
              </div>
              <div className="space-y-2">
                {fields.map((field, i) => (
                  <div key={field.id} className="flex gap-2 items-start">
                    <div className="flex-1">
                      <input {...register(`fixedExpenses.${i}.name`)} placeholder="e.g. Rent"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
                    </div>
                    <div className="w-28">
                      <input {...register(`fixedExpenses.${i}.amount`)} type="number" placeholder="Amount"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
                    </div>
                    <button type="button" onClick={() => remove(i)}
                      className="mt-0.5 w-9 h-9 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition">
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
                {fields.length === 0 && (
                  <p className="text-gray-400 text-sm text-center py-4">No fixed expenses. Tap Add to include rent, bills etc.</p>
                )}
              </div>
            </div>

            {flexible < 0 && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-2xl">
                ⚠️ Fixed expenses + savings exceed total budget
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
              {budget && (
                <button type="button" onClick={() => { setEditMode(false); reset({ totalBudget: budget.totalBudget, savingsGoal: budget.savingsGoal, fixedExpenses: budget.fixedExpenses.map(f => ({ name: f.name, amount: Number(f.amount) })) }); }}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 font-semibold py-4 rounded-2xl hover:bg-gray-200 transition active:scale-95">
                  <X size={16} /> Cancel
                </button>
              )}
              <button type="submit" disabled={isLoading || flexible < 0}
                className="flex-1 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-violet-200 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                {isLoading
                  ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <><Check size={16} /> {budget ? 'Update Budget' : 'Save Budget'}</>}
              </button>
            </div>
          </form>
        </div>
      )}

      {saved && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-lg flex items-center gap-2 z-50">
          <Check size={16} /> Budget saved successfully!
        </div>
      )}
    </div>
  );
}
