'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useGroupStore } from '@/store/groupStore';
import { X } from 'lucide-react';
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
      ? data.memberEmails.split(',').map((e) => e.trim()).filter(Boolean)
      : [];
    const group = await createGroup({ name: data.name, description: data.description, memberEmails });
    onClose();
    router.push(`/groups/${group.id}`);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="bg-white rounded-t-3xl w-full max-w-lg p-6 animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-900">Create Group</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input {...register('name')} placeholder="Group name (e.g. Goa Trip)"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <textarea {...register('description')} placeholder="Description (optional)" rows={2}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none" />
          <div>
            <input {...register('memberEmails')} placeholder="Member emails (comma separated)"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500" />
            <p className="text-xs text-gray-400 mt-1">e.g. alice@email.com, bob@email.com</p>
          </div>
          <button type="submit" disabled={isSubmitting}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3.5 rounded-xl transition disabled:opacity-50">
            {isSubmitting ? 'Creating...' : 'Create Group'}
          </button>
        </form>
      </div>
    </div>
  );
}
