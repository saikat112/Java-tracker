'use client';

import { useEffect, useState } from 'react';
import { useGroupStore } from '@/store/groupStore';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { Plus, Users } from 'lucide-react';
import CreateGroupModal from '@/components/groups/CreateGroupModal';

export default function GroupsPage() {
  const { groups, fetchGroups, isLoading } = useGroupStore();
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => { fetchGroups(); }, [fetchGroups]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Groups</h1>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 bg-violet-600 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-violet-700 transition">
          <Plus size={16} /> New Group
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-24 bg-gray-200 rounded-2xl animate-pulse" />)}</div>
      ) : groups.length === 0 ? (
        <div className="text-center py-16">
          <Users size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No groups yet</p>
          <p className="text-gray-400 text-sm">Create a group to split expenses</p>
        </div>
      ) : (
        <div className="space-y-3">
          {groups.map((group) => (
            <Link key={group.id} href={`/groups/${group.id}`}
              className="block bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:border-violet-200 transition">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-violet-100 rounded-2xl flex items-center justify-center">
                  <span className="text-xl">👥</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{group.name}</p>
                  <p className="text-sm text-gray-500">{group.memberCount} members</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{formatCurrency(group.totalExpenses)}</p>
                  <p className="text-xs text-gray-400">total</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {showCreate && <CreateGroupModal onClose={() => setShowCreate(false)} />}
    </div>
  );
}
