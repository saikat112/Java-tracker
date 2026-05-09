'use client';

import { useEffect, useState } from 'react';
import { useGroupStore } from '@/store/groupStore';
import { useAuthStore } from '@/store/authStore';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import AddGroupExpenseModal from '@/components/groups/AddGroupExpenseModal';
import SettlementView from '@/components/groups/SettlementView';
import { use } from 'react';

export default function GroupDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { currentGroup, groupExpenses, settlementSummary, fetchGroup, fetchGroupExpenses, fetchSettlements } = useGroupStore();
  const { user } = useAuthStore();
  const [tab, setTab] = useState<'expenses' | 'settlements'>('expenses');
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    fetchGroup(id);
    fetchGroupExpenses(id);
    fetchSettlements(id);
  }, [id]);

  if (!currentGroup) return <div className="h-32 bg-gray-200 rounded-2xl animate-pulse" />;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Link href="/groups" className="p-2 rounded-xl hover:bg-gray-100 transition"><ArrowLeft size={20} /></Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">{currentGroup.name}</h1>
          <p className="text-sm text-gray-500">{currentGroup.memberCount} members</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 bg-violet-600 text-white text-sm font-medium px-3 py-2 rounded-xl">
          <Plus size={15} /> Add
        </button>
      </div>

      {/* Members */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <p className="text-sm font-medium text-gray-500 mb-2">Members</p>
        <div className="flex gap-2 flex-wrap">
          {currentGroup.members.map((m) => (
            <div key={m.userId} className="flex items-center gap-1.5 bg-gray-50 rounded-full px-3 py-1.5">
              <div className="w-6 h-6 bg-violet-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-violet-700">{m.name.charAt(0)}</span>
              </div>
              <span className="text-sm text-gray-700">{m.name.split(' ')[0]}</span>
              {m.role === 'ADMIN' && <span className="text-xs text-violet-500">★</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-xl p-1">
        {(['expenses', 'settlements'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition capitalize ${tab === t ? 'bg-white text-violet-600 shadow-sm' : 'text-gray-500'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'expenses' ? (
        <div className="space-y-2">
          {groupExpenses.length === 0 ? (
            <div className="text-center py-10 text-gray-400">No expenses yet</div>
          ) : groupExpenses.map((expense) => (
            <div key={expense.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-900">{expense.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Paid by {expense.paidBy.name} · {formatDate(expense.expenseDate)}
                  </p>
                </div>
                <p className="font-bold text-gray-900">{formatCurrency(expense.amount)}</p>
              </div>
              <div className="mt-2 flex gap-2 flex-wrap">
                {expense.splits.map((s) => (
                  <span key={s.userId} className={`text-xs px-2 py-1 rounded-full ${s.isSettled ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                    {s.userName.split(' ')[0]}: {formatCurrency(s.shareAmount)}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        settlementSummary && <SettlementView summary={settlementSummary} groupId={id} currentUserId={user?.id || ''} />
      )}

      {showAdd && <AddGroupExpenseModal groupId={id} onClose={() => setShowAdd(false)} />}
    </div>
  );
}
