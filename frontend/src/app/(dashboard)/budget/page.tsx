'use client';
import { useEffect, useState } from 'react';
import { useBudgetStore } from '@/store/budgetStore';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { formatCurrency } from '@/lib/utils';
import { Plus, Trash2, Pencil, Check, X, RefreshCw } from 'lucide-react';

const schema = z.object({
  totalBudget: z.coerce.number().min(1, 'Total budget is required'),
  savingsGoal: z.coerce.number().min(0).default(0),
  fixedExpenses: z.array(z.object({
    name: z.string().min(1, 'Name required'),
    amount: z.coerce.number().min(1, 'Amount required'),
  })).default([]),
});
type FormData = z.infer<typeof schema>;

export default function BudgetPage() {
  const { budget, fetchBudget, saveBudget, isLoading, isSaving } = useBudgetStore();
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const [editMode, setEditMode] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saved, setSaved] = useState(false);

  const { register, handleSubmit, watch, control, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { totalBudget: 0, savingsGoal: 0, fixedExpenses: [] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'fixedExpenses' });

  // Fetch budget on mount
  useEffect(() => {
    fetchBudget(month, year);
  }, []);

  // When budget loads, populate form
  useEffect(() => {
    if (budget) {
      reset({
        totalBudget: Number(budget.totalBudget),
        savingsGoal: Number(budget.savingsGoal),
        fixedExpenses: (budget.fixedExpenses || []).map(f => ({
          name: f.name,
          amount: Number(f.amount),
        })),
      });
    }
  }, [budget]);

  // Auto open edit mode if no budget
  useEffect(() => {
    if (!isLoading && !budget) setEditMode(true);
  }, [isLoading, budget]);

  const w = watch();
  const fixedTotal = (w.fixedExpenses || []).reduce((s, f) => s + (Number(f.amount) || 0), 0);
  const flexible = (Number(w.totalBudget) || 0) - fixedTotal - (Number(w.savingsGoal) || 0);

  const onSubmit = async (data: FormData) => {
    setSaveError('');
    try {
      await saveBudget({ ...data, month, year });
      // Re-fetch to get fresh data from server (including generated flexible_budget)
      await fetchBudget(month, year);
      setEditMode(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setSaveError(msg || 'Failed to save budget. Please try again.');
    }
  };

  const handleCancel = () => {
    setSaveError('');
    setEditMode(false);
    // Reset form back to current budget values
    if (budget) {
      reset({
        totalBudget: Number(budget.totalBudget),
        savingsGoal: Number(budget.savingsGoal),
        fixedExpenses: (budget.fixedExpenses || []).map(f => ({
          name: f.name,
          amount: Number(f.amount),
        })),
      });
    }
  };

  const inputCls = "w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-gray-900 text-sm outline-none transition-all focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-100";

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-32 bg-gray-200 rounded-xl animate-pulse" />
        <div className="h-48 bg-gray-200 rounded-3xl animate-pulse" />
        <div className="h-32 bg-gray-200 rounded-3xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Budget</h1>
          <p className="text-gray-400 text-sm">
            {now.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        {budget && !editMode && (
          <button onClick={() => setEditMode(true)}
            className="flex items-center gap-1.5 bg-violet-50 text-violet-600 font-semibold text-sm px-4 py-2 rounded-2xl hover:bg-violet-100 transition active:scale-95">
            <Pencil size={14} /> Edit Budget
          </button>
        )}
      </div>

      {/* ── VIEW MODE ── */}
      {budget && !editMode && (
        <div className="space-y-4">
          {/* Dark hero card */}
          <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-3xl p-5 text-white">
            <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Total Budget</p>
            <p className="text-4xl font-bold tracking-tight">{formatCurrency(Number(budget.totalBudget))}</p>
            <div className="grid grid-cols-3 gap-2 mt-5">
              {[
                { label: 'Fixed', val: Number(budget.fixedExpensesTotal), icon: '🔒' },
                { label: 'Savings', val: Number(budget.savingsGoal), icon: '🎯' },
                { label: 'Flexible', val: Number(budget.flexibleBudget), icon: '💳' },
              ].map(s => (
                <div key={s.label} className="rounded-2xl p-3 text-center"
                  style={{ background: 'rgba(255,255,255,0.07)' }}>
                  <span className="text-lg">{s.icon}</span>
                  <p className="text-gray-400 text-[10px] mt-1 uppercase tracking-wide">{s.label}</p>
                  <p className="text-white font-bold text-sm mt-0.5">{formatCurrency(s.val)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Spending progress */}
          <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <p className="font-semibold text-gray-900">Spending Progress</p>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                Number(budget.remainingBudget) < 0 ? 'bg-red-50 text-red-500' :
                Number(budget.remainingBudget) < Number(budget.flexibleBudget) * 0.2
                  ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
              }`}>
                {Number(budget.remainingBudget) < 0 ? '🔴 Over Budget' :
                 Number(budget.remainingBudget) < Number(budget.flexibleBudget) * 0.2
                   ? '⚠️ Warning' : '✅ On Track'}
              </span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-3">
              <div className={`h-full rounded-full transition-all duration-700 ${
                Number(budget.remainingBudget) < 0 ? 'bg-red-500' :
                Number(budget.remainingBudget) < Number(budget.flexibleBudget) * 0.2
                  ? 'bg-amber-400' : 'bg-violet-500'
              }`} style={{
                width: `${Math.min((Number(budget.totalSpent) / Math.max(Number(budget.flexibleBudget), 1)) * 100, 100)}%`
              }} />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">
                Spent: <span className="font-semibold text-gray-900">{formatCurrency(Number(budget.totalSpent))}</span>
              </span>
              <span className="text-gray-500">
                Left: <span className={`font-semibold ${Number(budget.remainingBudget) < 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                  {formatCurrency(Number(budget.remainingBudget))}
                </span>
              </span>
            </div>
          </div>

          {/* Fixed expenses */}
          {budget.fixedExpenses?.length > 0 && (
            <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm">
              <p className="font-semibold text-gray-900 mb-3">Fixed Expenses</p>
              <div className="space-y-1">
                {budget.fixedExpenses.map((fe, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-violet-50 rounded-xl flex items-center justify-center">
                        <span className="text-sm">🔒</span>
                      </div>
                      <span className="text-sm font-medium text-gray-800">{fe.name}</span>
                    </div>
                    <span className="font-semibold text-gray-900 text-sm">{formatCurrency(Number(fe.amount))}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-2.5">
                  <span className="text-sm font-bold text-gray-700">Total Fixed</span>
                  <span className="font-bold text-gray-900">{formatCurrency(Number(budget.fixedExpensesTotal))}</span>
                </div>
              </div>
            </div>
          )}

          {/* Weekly breakdown */}
          {budget.weeklyBreakdown?.length > 0 && (
            <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm">
              <p className="font-semibold text-gray-900 mb-3">Weekly Breakdown</p>
              <div className="space-y-2">
                {budget.weeklyBreakdown.map(w => {
                  const pct = Math.min((Number(w.totalSpent) / Math.max(Number(w.weeklyBudget), 1)) * 100, 100);
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
                        <div className={`h-full rounded-full transition-all ${
                          w.status === 'HEALTHY' ? 'bg-emerald-500' :
                          w.status === 'WARNING' ? 'bg-amber-500' : 'bg-red-500'
                        }`} style={{ width: `${pct}%` }} />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Budget: {formatCurrency(Number(w.weeklyBudget))}</span>
                        <span>Spent: {formatCurrency(Number(w.totalSpent))}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── EDIT / CREATE MODE ── */}
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
                <div key={s.label} className="rounded-2xl p-3 text-center"
                  style={{ background: 'rgba(255,255,255,0.12)' }}>
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Total Monthly Budget (₹)
                </label>
                <input {...register('totalBudget')} type="number" placeholder="e.g. 30000"
                  className={inputCls} />
                {errors.totalBudget && (
                  <p className="text-red-500 text-xs mt-1">{errors.totalBudget.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Savings Goal (₹)
                </label>
                <input {...register('savingsGoal')} type="number" placeholder="e.g. 5000"
                  className={inputCls} />
              </div>
            </div>

            {/* Fixed Expenses */}
            <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold text-gray-900">Fixed Expenses</p>
                  <p className="text-xs text-gray-400 mt-0.5">Rent, electricity, subscriptions etc.</p>
                </div>
                <button type="button" onClick={() => append({ name: '', amount: 0 })}
                  className="flex items-center gap-1 text-violet-600 text-sm font-semibold hover:text-violet-800 transition active:scale-95">
                  <Plus size={15} /> Add
                </button>
              </div>
              <div className="space-y-2">
                {fields.map((field, i) => (
                  <div key={field.id} className="flex gap-2 items-start">
                    <div className="flex-1">
                      <input {...register(`fixedExpenses.${i}.name`)} placeholder="e.g. Rent"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all" />
                      {errors.fixedExpenses?.[i]?.name && (
                        <p className="text-red-500 text-xs mt-0.5">{errors.fixedExpenses[i]?.name?.message}</p>
                      )}
                    </div>
                    <div className="w-28">
                      <input {...register(`fixedExpenses.${i}.amount`)} type="number" placeholder="₹ Amount"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all" />
                      {errors.fixedExpenses?.[i]?.amount && (
                        <p className="text-red-500 text-xs mt-0.5">{errors.fixedExpenses[i]?.amount?.message}</p>
                      )}
                    </div>
                    <button type="button" onClick={() => remove(i)}
                      className="mt-0.5 w-9 h-9 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition">
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
                {fields.length === 0 && (
                  <p className="text-gray-400 text-sm text-center py-4">
                    No fixed expenses. Tap Add to include rent, bills etc.
                  </p>
                )}
                {fields.length > 0 && (
                  <div className="flex justify-between pt-2 border-t border-gray-100 mt-2">
                    <span className="text-sm font-semibold text-gray-600">Total Fixed</span>
                    <span className="text-sm font-bold text-gray-900">{formatCurrency(fixedTotal)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Validation errors */}
            {flexible < 0 && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-2xl">
                ⚠️ Fixed expenses + savings goal exceed total budget by {formatCurrency(Math.abs(flexible))}
              </div>
            )}

            {saveError && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-2xl">
                ⚠️ {saveError}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              {budget && (
                <button type="button" onClick={handleCancel}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 font-semibold py-4 rounded-2xl hover:bg-gray-200 transition active:scale-95">
                  <X size={16} /> Cancel
                </button>
              )}
              <button type="submit" disabled={isSaving || flexible < 0}
                className="flex-1 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-violet-200 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                {isSaving ? (
                  <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Saving...</span></>
                ) : (
                  <><Check size={16} /><span>{budget ? 'Update Budget' : 'Save Budget'}</span></>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Success toast */}
      {saved && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 whitespace-nowrap">
          <Check size={16} /> Budget updated successfully!
        </div>
      )}
    </div>
  );
}
