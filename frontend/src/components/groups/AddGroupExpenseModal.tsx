'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useGroupStore } from '@/store/groupStore';
import { useExpenseStore } from '@/store/expenseStore';
import { X, Receipt, ChevronDown } from 'lucide-react';

const schema = z.object({
  title: z.string().min(1, 'Select or enter an item'),
  amount: z.coerce.number().positive('Amount must be positive'),
  expenseDate: z.string().min(1),
  categoryId: z.string().optional(),
  notes: z.string().optional(),
  splitType: z.enum(['EQUAL', 'CUSTOM']).default('EQUAL'),
});
type FormData = z.infer<typeof schema>;

const QUICK_ITEMS = [
  { emoji: '🛢️', label: 'Oil' },
  { emoji: '🥩', label: 'Meat' },
  { emoji: '🥦', label: 'Vegetables' },
  { emoji: '🛒', label: 'Groceries' },
  { emoji: '🐟', label: 'Fish' },
  { emoji: '🥚', label: 'Eggs' },
  { emoji: '🍚', label: 'Rice' },
  { emoji: '🥛', label: 'Milk' },
  { emoji: '🍞', label: 'Bread' },
  { emoji: '🧅', label: 'Onion' },
  { emoji: '🍗', label: 'Chicken' },
  { emoji: '🧴', label: 'Soap' },
  { emoji: '🫙', label: 'Spices' },
  { emoji: '🥔', label: 'Potato' },
  { emoji: '🍅', label: 'Tomato' },
  { emoji: '🧈', label: 'Butter' },
  { emoji: '🫒', label: 'Mustard Oil' },
  { emoji: '🍋', label: 'Lemon' },
  { emoji: '🥜', label: 'Dal' },
  { emoji: '✏️', label: 'Other' },
];

export default function AddGroupExpenseModal({ groupId, onClose }: { groupId: string; onClose: () => void }) {
  const { addGroupExpense } = useGroupStore();
  const { categories, fetchCategories } = useExpenseStore();
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
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
  const titleValue = watch('title') || '';
  const isOther = titleValue === 'Other' || (titleValue && !QUICK_ITEMS.find(i => i.label === titleValue));
  const selectedItem = QUICK_ITEMS.find(i => i.label === titleValue);

  const inputCls = "w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-gray-900 text-[15px] placeholder-gray-400 outline-none transition-all focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-100";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}>
      <div
        className="w-full max-w-lg bg-white rounded-t-[2rem] overflow-hidden max-h-[92vh] flex flex-col"
        style={{ animation: 'slideUp 0.35s cubic-bezier(0.32,0.72,0,1) forwards' }}
        onClick={e => e.stopPropagation()}>

        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-2 pb-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-100 rounded-2xl flex items-center justify-center">
              <Receipt size={20} className="text-violet-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Add Expense</h2>
              <p className="text-xs text-gray-400">Record a shared expense</p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-9 h-9 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition active:scale-90">
            <X size={18} className="text-gray-600" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-5 py-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Amount */}
            <div className="bg-violet-50 rounded-2xl p-4 text-center">
              <p className="text-xs text-violet-500 font-semibold uppercase tracking-widest mb-2">Amount</p>
              <div className="flex items-center justify-center gap-1">
                <span className="text-4xl font-bold text-violet-600">₹</span>
                <input {...register('amount')} type="number" step="0.01" placeholder="0"
                  className="text-4xl font-bold text-violet-600 bg-transparent outline-none w-36 text-center placeholder-violet-300" />
              </div>
              {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>}
            </div>

            {/* Item dropdown */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Item</p>
              <div className="relative">
                <select
                  value={isOther ? 'Other' : titleValue}
                  onChange={e => {
                    const val = e.target.value;
                    if (val === 'Other') {
                      setValue('title', '', { shouldValidate: false });
                    } else {
                      setValue('title', val, { shouldValidate: true });
                    }
                  }}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-gray-900 text-[15px] outline-none transition-all focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-100 appearance-none pr-10">
                  <option value="">-- Select item --</option>
                  {QUICK_ITEMS.map(item => (
                    <option key={item.label} value={item.label}>
                      {item.emoji} {item.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              {errors.title && !isOther && (
                <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.title.message}</p>
              )}
            </div>

            {/* Custom input if Other selected */}
            {(isOther || titleValue === '') && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Custom Item Name
                </p>
                <input
                  value={isOther && titleValue !== 'Other' ? titleValue : ''}
                  onChange={e => setValue('title', e.target.value, { shouldValidate: true })}
                  placeholder="e.g. Paneer, Atta, Detergent..."
                  className={inputCls} />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.title.message}</p>
                )}
              </div>
            )}

            {/* Date & Category */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Date</p>
                <input {...register('expenseDate')} type="date"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-3 py-3 text-gray-900 text-sm outline-none focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Category</p>
                <select {...register('categoryId')}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-3 py-3 text-gray-900 text-sm outline-none focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all">
                  <option value="">Select</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>

            {/* Split type */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Split</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'EQUAL', label: '⚖️ Equal Split' },
                  { value: 'CUSTOM', label: '✏️ Custom Split' },
                ].map(opt => (
                  <label key={opt.value} className="cursor-pointer">
                    <input {...register('splitType')} type="radio" value={opt.value} className="sr-only" />
                    <div className={`p-3 rounded-2xl border-2 text-center transition-all ${
                      splitType === opt.value
                        ? 'border-violet-500 bg-violet-50 text-violet-700'
                        : 'border-gray-200 bg-gray-50 text-gray-600'
                    }`}>
                      <p className="text-sm font-semibold">{opt.label}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Notes <span className="text-gray-400 font-normal">(optional)</span>
              </p>
              <textarea {...register('notes')} placeholder="Any extra details..."
                rows={2} className={`${inputCls} resize-none`} />
            </div>

            <button type="submit" disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold text-[15px] py-4 rounded-2xl shadow-lg shadow-violet-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting
                ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Adding...</span></>
                : 'Add Expense'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
