'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useExpenseStore } from '@/store/expenseStore';
import { Expense } from '@/types';
import { X, Pencil } from 'lucide-react';

const schema = z.object({
  title: z.string().min(1, 'Required'),
  amount: z.coerce.number().positive('Must be positive'),
  expenseDate: z.string().min(1),
  categoryId: z.string().optional(),
  paymentMethod: z.enum(['CASH', 'CARD', 'UPI', 'NET_BANKING', 'WALLET']).default('CASH'),
  notes: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

const PAYS = [
  { v: 'CASH', l: '💵 Cash' }, { v: 'CARD', l: '💳 Card' },
  { v: 'UPI', l: '📱 UPI' }, { v: 'NET_BANKING', l: '🏦 Bank' },
  { v: 'WALLET', l: '👛 Wallet' },
];

export default function EditExpenseModal({ expense, onClose }: { expense: Expense; onClose: () => void }) {
  const { updateExpense, fetchCategories, categories, isLoading } = useExpenseStore();

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: expense.title,
      amount: expense.amount,
      expenseDate: expense.expenseDate,
      categoryId: expense.category?.id || '',
      paymentMethod: expense.paymentMethod || 'CASH',
      notes: expense.notes || '',
    },
  });

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const onSubmit = async (data: FormData) => {
    await updateExpense(expense.id, data);
    onClose();
  };

  const pm = watch('paymentMethod');
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
            <div className="w-10 h-10 bg-amber-100 rounded-2xl flex items-center justify-center">
              <Pencil size={18} className="text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Edit Expense</h2>
              <p className="text-xs text-gray-400">Changes will show "edited" badge</p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-9 h-9 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition active:scale-90">
            <X size={18} className="text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <div className="overflow-y-auto flex-1 px-5 py-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Amount */}
            <div className="bg-amber-50 rounded-2xl p-4 text-center">
              <p className="text-xs text-amber-500 font-semibold uppercase tracking-widest mb-2">Amount</p>
              <div className="flex items-center justify-center gap-1">
                <span className="text-4xl font-bold text-amber-600">₹</span>
                <input {...register('amount')} type="number" step="0.01"
                  className="text-4xl font-bold text-amber-600 bg-transparent outline-none w-36 text-center" />
              </div>
              {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
              <input {...register('title')} placeholder="Expense title" className={inputCls} />
              {errors.title && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.title.message}</p>}
            </div>

            {/* Date & Category */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                <input {...register('expenseDate')} type="date"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-3 py-3 text-sm outline-none focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select {...register('categoryId')}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-3 py-3 text-sm outline-none focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all">
                  <option value="">Select</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>

            {/* Payment method */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Method</label>
              <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                {PAYS.map(p => (
                  <label key={p.v} className="flex-shrink-0 cursor-pointer">
                    <input {...register('paymentMethod')} type="radio" value={p.v} className="sr-only" />
                    <div className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition active:scale-95 ${
                      pm === p.v ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-gray-600 border-gray-200'
                    }`}>
                      {p.l}
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
              <textarea {...register('notes')} placeholder="Add a note..." rows={2}
                className={`${inputCls} resize-none`} />
            </div>

            <button type="submit" disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-[15px] py-4 rounded-2xl shadow-lg shadow-amber-200 transition-all active:scale-95 disabled:opacity-50">
              {isLoading
                ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Saving...</span></>
                : <><Pencil size={16} /><span>Save Changes</span></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
