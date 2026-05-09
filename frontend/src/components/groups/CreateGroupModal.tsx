'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useGroupStore } from '@/store/groupStore';
import { X, Users, FileText, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  memberEmails: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export default function CreateGroupModal({ onClose }: { onClose: () => void }) {
  const { createGroup } = useGroupStore();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    const memberEmails = data.memberEmails
      ? data.memberEmails.split(',').map(e => e.trim()).filter(Boolean)
      : [];
    const group = await createGroup({ name: data.name, description: data.description, memberEmails });
    onClose();
    router.push(`/groups/${group.id}`);
  };

  const inputCls = "w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-gray-900 text-[15px] placeholder-gray-400 outline-none transition-all focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-100";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}>
      <div
        className="w-full max-w-lg bg-white rounded-t-[2rem] overflow-hidden"
        style={{ animation: 'slideUp 0.35s cubic-bezier(0.32,0.72,0,1) forwards' }}
        onClick={e => e.stopPropagation()}>

        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-3 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-100 rounded-2xl flex items-center justify-center">
              <Users size={20} className="text-violet-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Create Group</h2>
              <p className="text-xs text-gray-400">Split expenses with friends</p>
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

            {/* Group Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Group Name <span className="text-red-500">*</span>
              </label>
              <input {...register('name')} placeholder="e.g. Goa Trip, Flatmates, Office Lunch"
                className={inputCls} autoFocus />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.name.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea {...register('description')} placeholder="What is this group for?"
                rows={2}
                className={`${inputCls} resize-none`} />
            </div>

            {/* Member Emails */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Invite Members <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input {...register('memberEmails')}
                  placeholder="alice@email.com, bob@email.com"
                  className={`${inputCls} pl-10`} />
              </div>
              <p className="text-xs text-gray-400 mt-1.5 ml-1">
                Separate multiple emails with commas
              </p>
            </div>

            {/* Submit */}
            <button type="submit" disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold text-[15px] py-4 rounded-2xl shadow-lg shadow-violet-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-2">
              {isSubmitting ? (
                <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Creating...</span></>
              ) : (
                <><Users size={18} /><span>Create Group</span></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
