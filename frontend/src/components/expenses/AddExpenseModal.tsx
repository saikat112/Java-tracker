'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useExpenseStore } from '@/store/expenseStore';
import { X } from 'lucide-react';

const schema = z.object({
  title: z.string().min(1, 'Required'),
  amount: z.coerce.number().positive('Must be positive'),
  expenseDate: z.string().min(1),
  categoryId: z.string().optional(),
  paymentMethod: z.enum(['CASH','CARD','UPI','NET_BANKING','WALLET']).default('CASH'),
  notes: z.string().optional(),
});
type F = z.infer<typeof schema>;

const PAYS = [
  { v: 'CASH', l: '💵 Cash' }, { v: 'CARD', l: '💳 Card' },
  { v: 'UPI', l: '📱 UPI' }, { v: 'NET_BANKING', l: '🏦 Bank' }, { v: 'WALLET', l: '👛 Wallet' },
];

export default function AddExpenseModal({ onClose }: { onClose: () => void }) {
  const { addExpense, fetchCategories, categories, isLoading } = useExpenseStore();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<F>({
    resolver: zodResolver(schema),
    defaultValues: { expenseDate: new Date().toISOString().split('T')[0], paymentMethod: 'CASH' },
  });

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const onSubmit = async (d: F) => { await addExpense(d); onClose(); };
  const pm = watch('paymentMethod');

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg mx-auto bg-white rounded-t-[2rem] slide-up" onClick={e => e.stopPropagation()}>
        {/* Handle */}
        <div className="flex justify-center pt-3"><div className="w-10 h-1 bg-gray-200 rounded-full" /></div>

        <div className="px-5 pt-4 pb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900">Add Expense</h2>
            <button onClick={onClose} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center tap">
              <X size={16} className="text-gray-600" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Big amount input */}
            <div className="bg-violet-50 rounded-2xl p-5 text-center">
              <p className="text-xs text-violet-400 font-semibold uppercase tracking-widest mb-3">Amount</p>
              <div className="flex items-center justify-center gap-1">
                <span className="text-4xl font-bold text-violet-600">₹</span>
                <input {...register('amount')} type="number" step="0.01" placeholder="0"
                  className="text-4xl font-bold text-violet-600 bg-transparent outline-none w-36 text-center placeholder-violet-300" />
              </div>
              {errors.amount && <p className="text-red-500 text-xs mt-2">{errors.amount.message}</p>}
            </div>

            <input {...register('title')} placeholder="What did you spend on?" className="field" />
            {errors.title && <p className="text-red-500 text-xs -mt-2 ml-1">{errors.title.message}</p>}

            <div className="grid grid-cols-2 gap-3">
              <input {...register('expenseDate')} type="date" className="field text-sm" />
              <select {...register('categoryId')} className="field text-sm">
                <option value="">Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            {/* Payment chips */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {PAYS.map(p => (
                <label key={p.v} className="flex-shrink-0 cursor-pointer">
                  <input {...register('paymentMethod')} type="radio" value={p.v} className="sr-only" />
                  <div className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition tap ${pm === p.v ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-gray-600 border-gray-200'}`}>
                    {p.l}
                  </div>
                </label>
              ))}
            </div>

            <textarea {...register('notes')} placeholder="Note (optional)" rows={2}
              className="field resize-none text-sm" />

            <button type="submit" disabled={isLoading} className="btn-violet">
              {isLoading
                ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : 'Add Expense'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
