'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useExpenseStore } from '@/store/expenseStore';
import { X } from 'lucide-react';

const schema = z.object({
  title: z.string().min(1, 'Title required'),
  amount: z.coerce.number().positive('Amount must be positive'),
  expenseDate: z.string().min(1, 'Date required'),
  categoryId: z.string().optional(),
  paymentMethod: z.enum(['CASH', 'CARD', 'UPI', 'NET_BANKING', 'WALLET']).default('CASH'),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function AddExpenseModal({ onClose }: { onClose: () => void }) {
  const { addExpense, fetchCategories, categories, isLoading } = useExpenseStore();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { expenseDate: new Date().toISOString().split('T')[0], paymentMethod: 'CASH' },
  });

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const onSubmit = async (data: FormData) => {
    await addExpense(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="bg-white rounded-t-3xl w-full max-w-lg p-6 animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-900">Add Expense</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <input {...register('title')} placeholder="What did you spend on?"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500" />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>
            <div>
              <input {...register('amount')} type="number" step="0.01" placeholder="Amount (₹)"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500" />
              {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>}
            </div>
            <div>
              <input {...register('expenseDate')} type="date"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <select {...register('categoryId')}
              className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white">
              <option value="">Category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select {...register('paymentMethod')}
              className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white">
              {['CASH', 'CARD', 'UPI', 'NET_BANKING', 'WALLET'].map((m) => (
                <option key={m} value={m}>{m.replace('_', ' ')}</option>
              ))}
            </select>
          </div>

          <textarea {...register('notes')} placeholder="Notes (optional)" rows={2}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none" />

          <button type="submit" disabled={isLoading}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3.5 rounded-xl transition disabled:opacity-50">
            {isLoading ? 'Adding...' : 'Add Expense'}
          </button>
        </form>
      </div>
    </div>
  );
}
