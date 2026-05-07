'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useGroupStore } from '@/store/groupStore';
import { useExpenseStore } from '@/store/expenseStore';
import { X } from 'lucide-react';

const schema = z.object({
  title: z.string().min(1),
  amount: z.coerce.number().positive(),
  expenseDate: z.string().min(1),
  categoryId: z.string().optional(),
  notes: z.string().optional(),
  splitType: z.enum(['EQUAL', 'CUSTOM']).default('EQUAL'),
});

type FormData = z.infer<typeof schema>;

export default function AddGroupExpenseModal({ groupId, onClose }: { groupId: string; onClose: () => void }) {
  const { addGroupExpense } = useGroupStore();
  const { categories, fetchCategories } = useExpenseStore();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { expenseDate: new Date().toISOString().split('T')[0], splitType: 'EQUAL' },
  });

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const onSubmit = async (data: FormData) => {
    await addGroupExpense(groupId, data);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="bg-white rounded-t-3xl w-full max-w-lg p-6 animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-900">Add Group Expense</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input {...register('title')} placeholder="What was this expense?"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500" />
          <div className="grid grid-cols-2 gap-3">
            <input {...register('amount')} type="number" step="0.01" placeholder="Amount (₹)"
              className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500" />
            <input {...register('expenseDate')} type="date"
              className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select {...register('categoryId')}
              className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white">
              <option value="">Category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select {...register('splitType')}
              className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white">
              <option value="EQUAL">Split Equally</option>
              <option value="CUSTOM">Custom Split</option>
            </select>
          </div>
          <textarea {...register('notes')} placeholder="Notes (optional)" rows={2}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none" />
          <button type="submit" disabled={isSubmitting}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3.5 rounded-xl transition disabled:opacity-50">
            {isSubmitting ? 'Adding...' : 'Add Expense'}
          </button>
        </form>
      </div>
    </div>
  );
}
