'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useExpenseStore } from '@/store/expenseStore';
import { X } from 'lucide-react';

const schema = z.object({
  title: z.string().min(1, 'Title required'),
  amount: z.coerce.number().positive('Must be positive'),
  expenseDate: z.string().min(1),
  categoryId: z.string().optional(),
  paymentMethod: z.enum(['CASH', 'CARD', 'UPI', 'NET_BANKING', 'WALLET']).default('CASH'),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const PAYMENT_METHODS = [
  { value: 'CASH', label: '💵 Cash' },
  { value: 'CARD', label: '💳 Card' },
  { value: 'UPI', label: '📱 UPI' },
  { value: 'NET_BANKING', label: '🏦 Net Banking' },
  { value: 'WALLET', label: '👛 Wallet' },
];

export default function AddExpenseModal({ onClose }: { onClose: () => void }) {
  const { addExpense, fetchCategories, categories, isLoading } = useExpenseStore();
  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      expenseDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'CASH',
    },
  });

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const onSubmit = async (data: FormData) => {
    await addExpense(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end" onClick={onClose}>
      <div className="bottom-sheet w-full animate-slide-up" onClick={(e) => e.stopPropagation()}>
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        <div className="px-5 pb-8 pt-3">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900">Add Expense</h2>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition">
              <X size={18} className="text-gray-600" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Amount - Big input */}
            <div className="bg-violet-50 rounded-2xl p-4 text-center">
              <p className="text-xs text-violet-500 font-medium mb-2">AMOUNT</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl font-bold text-violet-600">₹</span>
                <input {...register('amount')} type="number" step="0.01" placeholder="0.00"
                  className="text-3xl font-bold text-violet-600 bg-transparent border-none outline-none w-40 text-center placeholder-violet-300" />
              </div>
              {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>}
            </div>

            {/* Title */}
            <input {...register('title')} placeholder="What did you spend on?"
              className="input-field" />
            {errors.title && <p className="text-red-500 text-xs -mt-2 ml-1">{errors.title.message}</p>}

            {/* Date & Category */}
            <div className="grid grid-cols-2 gap-3">
              <input {...register('expenseDate')} type="date" className="input-field text-sm" />
              <select {...register('categoryId')} className="input-field text-sm bg-gray-50">
                <option value="">Category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            {/* Payment Method */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {PAYMENT_METHODS.map((m) => (
                <label key={m.value} className="flex-shrink-0">
                  <input {...register('paymentMethod')} type="radio" value={m.value} className="sr-only" />
                  <div className={`px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition border ${watch('paymentMethod') === m.value ? 'bg-violet-600 text-white border-violet-600' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                    {m.label}
                  </div>
                </label>
              ))}
            </div>

            {/* Notes */}
            <textarea {...register('notes')} placeholder="Add a note (optional)" rows={2}
              className="input-field resize-none text-sm" />

            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Adding...</span>
                </div>
              ) : 'Add Expense'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
