'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useGroupStore } from '@/store/groupStore';
import { useExpenseStore } from '@/store/expenseStore';
import { X, Receipt } from 'lucide-react';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  amount: z.coerce.number().positive('Amount must be positive'),
  expenseDate: z.string().min(1, 'Date is required'),
  categoryId: z.string().optional(),
  notes: z.string().optional(),
  splitType: z.enum(['EQUAL', 'CUSTOM']).default('EQUAL'),
});
type FormData = z.infer<typeof schema>;

const SPLIT_OPTIONS = [
  { value: 'EQUAL', label: '⚖️ Split Equally', desc: 'Divide equally among all members' },
  { value: 'CUSTOM', label: '✏️ Custom Split', desc: 'Set custom amounts per person' },
];

export default function AddGroupExpenseModal({ groupId, onClose }: { groupId: string; onClose: () => void }) {
  const { addGroupExpense } = useGroupStore();
  const { categories, fetchCategories } = useExpenseStore();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      expenseDate: new Date().toISOString().split('T')[0],
      splitType: 'EQUAL',
    },
  });

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const onSubmit = async (data: FormData) => {
    await addGroupExpense(groupId, data);
    onClose();
  };

  const splitType = watch('splitType');

  const inputCls = "w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-gray-900 text-[15px] placeholder-gray-400 outline-none transition-all focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-100";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}>
      <div
        className="w-full max-w-lg bg-white rounded-t-[2rem] overflow-hidden max-h-[92vh] overflow-y-auto"
        style={{ animation: 'slideUp 0.35s cubic-bezier(0.32,0.72,0,1) forwards' }}
        onClick={e => e.stopPropagation()}>

        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 sticky top-0 bg-white z-10">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-3 pb-4 border-b border-gray-100 sticky top-5 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-100 rounded-2xl flex items-center justify-center">
              <Receipt size={20} className="text-violet-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Add Group Expense</h2>
              <p className="text-xs text-gray-400">Record a shared expense</p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-9 h-9 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition active:scale-90">
            <X size={18} className="text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <div className="px-5 py-5 pb-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Amount — big input */}
            <div className="bg-violet-50 rounded-2xl p-5 text-center">
              <p className="text-xs text-violet-500 font-semibold uppercase tracking-widest mb-3">Amount</p>
              <div className="flex items-center justify-center gap-1">
                <span className="text-4xl font-bold text-violet-600">₹</span>
                <input {...register('amount')} type="number" step="0.01" placeholder="0"
                  className="text-4xl font-bold text-violet-600 bg-transparent outline-none w-36 text-center placeholder-violet-300" />
              </div>
              {errors.amount && <p className="text-red-500 text-xs mt-2">{errors.amount.message}</p>}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                What was this for? <span className="text-red-500">*</span>
              </label>
              <input {...register('title')} placeholder="e.g. Dinner, Hotel, Cab fare"
                className={inputCls} />
              {errors.title && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.title.message}</p>}
            </div>

            {/* Date & Category */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                <input {...register('expenseDate')} type="date"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-gray-900 text-sm outline-none transition-all focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-100" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select {...register('categoryId')}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-gray-900 text-sm outline-none transition-all focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-100">
                  <option value="">Select</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>

            {/* Split Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">How to split?</label>
              <div className="grid grid-cols-2 gap-2">
                {SPLIT_OPTIONS.map(opt => (
                  <label key={opt.value} className="cursor-pointer">
                    <input {...register('splitType')} type="radio" value={opt.value} className="sr-only" />
                    <div className={`p-3 rounded-2xl border-2 transition-all ${
                      splitType === opt.value
                        ? 'border-violet-500 bg-violet-50'
                        : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                    }`}>
                      <p className={`text-sm font-semibold ${splitType === opt.value ? 'text-violet-700' : 'text-gray-700'}`}>
                        {opt.label}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Notes <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea {...register('notes')} placeholder="Any additional details..."
                rows={2} className={`${inputCls} resize-none`} />
            </div>

            {/* Submit */}
            <button type="submit" disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold text-[15px] py-4 rounded-2xl shadow-lg shadow-violet-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? (
                <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Adding...</span></>
              ) : (
                <><Receipt size={18} /><span>Add Expense</span></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
